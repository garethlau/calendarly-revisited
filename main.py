from flask import Flask, render_template, request, redirect, url_for
import os
import json
from flask_cors import CORS
from oauthlib.oauth2 import WebApplicationClient
import requests
from keys import keys
from scrape import scrape_pdf
from utils import get_date_time, get_google_provider_cfg, generate_recurrence_rule


# Somewhere in webapp_example.py, before the app.run for example
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

app = Flask(__name__)
CORS(app)

client = WebApplicationClient(keys['GOOGLE_CLIENT_ID'])

# Thresholds for extraction
THRESHOLDS = [
    [65, 94],
    [95, 150],
    [169, 188],
    [200, 250],
    [260, 290]
]


@app.route("/login")
def login():
    print("in login method")
    # Find out what URL to hit for Google login
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    # Use library to construct the request for Google login and provide
    # scopes that let you retrieve user's profile from Google
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=request.base_url + "/callback",
        scope=["openid", "email", "profile",
               "https://www.googleapis.com/auth/calendar.events",
               "https://www.googleapis.com/auth/calendar"],
    )
    return request_uri


@app.route("/login/callback")
def callback():
    # Get authorization code Google sent back to you
    code = request.args.get("code")
    # Find out what URL to hit to get tokens that allow you to ask for
    # things on behalf of a user
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    # Prepare and send a request to get tokens! Yay tokens!
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(keys['GOOGLE_CLIENT_ID'], keys['GOOGLE_CLIENT_SECRET']),
    )
    # print("TOKEN RESPONSE")
    # print(token_response.json())

    # Parse the tokens!
    client.parse_request_body_response(json.dumps(token_response.json()))

    # Now that you have tokens (yay) let's find and hit the URL
    # from Google that gives you the user's profile information,
    # including their Google profile image and email
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    # You want to make sure their email is verified.
    # The user authenticated with Google, authorized your
    # app, and now you've verified their email through Google!
    if userinfo_response.json().get("email_verified"):
        unique_id = userinfo_response.json()["sub"]
        users_email = userinfo_response.json()["email"]
        users_name = userinfo_response.json()["given_name"]
        print("{} {} {} ".format(unique_id, users_email, users_name))
        return redirect("http://localhost:3000/auth/success")
    else:
        return redirect("http://localhost:3000/auth/failure")


@app.route('/api/v1/create-events', methods=['POST'])
def create_events():
    options = json.loads(request.form['options'])
    events = json.loads(request.form['events'])
    endpoint = "https://www.googleapis.com/calendar/v3/calendars/{}/events".format(
        options['calendarId'])

    # Insert each event
    for event in events:
        # Format the data
        summary = "{} {} - {}".format(event['class'],
                                      event['code'], event['section'])
        location = event['location']
        description = "Course: {} {} \n Section: {} \n Type: {} \n Location: {} \n Made By Calendarly".format(
            event['class'], event['code'], event['section'], event['type'], event['location'])
        start_date_time = get_date_time(
            event['day'], event['start'], options['startDate'])
        end_date_time = get_date_time(
            event['day'], event['end'], options['startDate'])
        time_zone = options['timeZone']

        # Format recurrence date time
        recurrence_rule = generate_recurrence_rule(options['endDate'], event['day'])

        data = {
            'summary': summary,
            'location': location,
            'description': description,
            'start': {
                'dateTime': start_date_time,
                'timeZone': time_zone
            },
            'end': {
                'dateTime': end_date_time,
                'timeZone': time_zone
            },
            'recurrence': [
                recurrence_rule
            ],
            'reminders': {
                'useDefault': False,
            },
        }
        print("Creating === > {} : {} - {}".format(
            data['summary'], data['start']['dateTime'], data['end']['dateTime']))
        try:
            uri, headers, body = client.add_token(endpoint)
            headers['Content-Type'] = "application/json"
            response = requests.post(uri, headers=headers, data=json.dumps(data))
        except:
            print("Error creating event")
            return "There was an error"
    return "all completed"


@app.route('/api/v1/extract', methods=['POST'])
def extract():
    if 'file' not in request.files:
        return "Did not recieve file"
    pdf_file = request.files['file']
    classes = scrape_pdf(pdf_file, THRESHOLDS)

    # print(classes)
    return json.dumps(classes)

if __name__ == "__main__":
    print("Starting Flask server")
    app.config.from_object('configurations.DevelopmentConfig')
    app.run()
