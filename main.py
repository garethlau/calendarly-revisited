from scrape import scrape_pdf
from flask import Flask, render_template, request, redirect, url_for
from werkzeug.utils import secure_filename
import os
import json

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}

app = Flask(__name__, template_folder='templates')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

THRESHOLDS = [
    [65, 94],
    [95, 138],
    [169, 188],
    [200, 236],
    [269, 285]
]

@app.route('/')
def show_home():
    return render_template('home.html')

@app.route('/api/v1/extract', methods=['POST'])
def extract():
    print(request.files)
    if 'file' not in request.files:
        return "Did not recieve file"
    pdf_file = request.files['file']
    classes = scrape_pdf(pdf_file, THRESHOLDS)

    print(classes)
    return json.dumps(classes)

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            return "no file uploaded"
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return "uploaded"
    else:
        return render_template('upload.html')

if __name__ == "__main__":
    print("Starting Flask server")
    app.config.from_object('configurations.DevelopmentConfig')
    app.run()