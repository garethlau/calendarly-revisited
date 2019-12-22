from datetime import datetime, timedelta
import requests
from keys import keys


# Generate recurrence rule given an end date and the repeated weekday
def generate_recurrence_rule(endDate, weekday):
    if weekday == 'monday':
        by_day = 'MO'
    elif weekday == 'tuesday':
        by_day = 'TU'
    elif weekday == 'wednesday':
        by_day = 'WE'
    elif weekday == 'thursday':
        by_day = 'TH'
    elif weekday == 'friday':
        by_day = 'FR'

    recurrence_end = endDate.replace('-', '')
    recurrence_end = recurrence_end.replace(':', '')
    recurrence_end = recurrence_end.replace('.', '')
    recurrence_end = recurrence_end[:-4] + 'Z'
    recurrence_rule = "RRULE:FREQ=WEEKLY;BYDAY={};INTERVAL=1;UNTIL={}".format(
        by_day, recurrence_end)
    return recurrence_rule

# Given a boundary date, determine the next date time that the class will start on
def get_date_time(weekday, time, boundary_date):
    if weekday == "monday":
        weekday_num = 0
    elif weekday == "tuesday":
        weekday_num = 1
    elif weekday == "wednesday":
        weekday_num = 2
    elif weekday == "thursday":
        weekday_num = 3
    elif weekday == "friday":
        weekday_num = 4
    ONE_DAY = timedelta(days=1)

    a = boundary_date.replace('T', '-')
    a = a.split('-')
    year = a[0]
    month = a[1]
    if (month[0] == '0'):
        month = month[1:]
    day = a[2]
    if day[0] == '0':
        day = day[1:]

    time_24 = datetime.strptime(time, '%I:%M%p')
    time_24 = datetime.strftime(time_24, '%H:%M')
    # date time object of the boundary date
    d = datetime(int(year), int(month), int(day),
                 int(time_24[:2]), int(time_24[3:]))
    s = d.weekday()
    while not s == weekday_num:
        s = (s + 1) % 7
        d += ONE_DAY
    return d.isoformat()


ALLOWED_EXTENSIONS = {'pdf'}


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def get_google_provider_cfg():
    return requests.get(keys['GOOGLE_DISCOVERY_URL']).json()
