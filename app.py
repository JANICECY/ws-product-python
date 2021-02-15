# -*- coding: utf-8 -*-

import os
from flask import Flask, jsonify
import sqlalchemy
import time

# web app
app = Flask(__name__)

# database engine
engine = sqlalchemy.create_engine(os.getenv('SQL_URI'))

"""
Simple implentation of Rate-limiting using Token Bucket algorithm
@author: Ying Chen
"""
def rated_limited(max_tokens_per_second):

    # prefill the bucket with the given tokens. 
    # This allows for a burst of packets when the throttler first starts working.
    bucket = max_tokens_per_second 

    def decorate(func):

        last_time_called = 0.0
        
        def rate_limited_func(*args, **kargs):
            nonlocal bucket
            nonlocal last_time_called
            current_time = time.time()

            time_elapsed = current_time - last_time_called
            last_time_called = current_time

            # find out how many token needs to be added to the bucket.
            bucket = bucket + time_elapsed * max_tokens_per_second

            #  Reset the bucket if it has more tokens than the default value.
            if bucket > max_tokens_per_second:
                bucket = max_tokens_per_second

            if bucket < 1:
                print('Request Dropped...')
                return "The request has exceeded the allowable time limit"
            else:
                bucket = bucket - 1
                return func(*args, **kargs)
        rate_limited_func.__name__ = func.__name__
        return rate_limited_func
    return decorate




@app.route('/')
@rated_limited(5) # apply the rate-limiting decorator to each route with max 5 requests per second
def index():
    return 'Welcome to EQ Works 😎'


@app.route('/events/hourly')
@rated_limited(5)
def events_hourly():
    return queryHelper('''
        SELECT date, hour, events
        FROM public.hourly_events
        ORDER BY date, hour
        LIMIT 168;
    ''')


@app.route('/events/daily')
@rated_limited(5)
def events_daily():
    return queryHelper('''
        SELECT date, SUM(events) AS events
        FROM public.hourly_events
        GROUP BY date
        ORDER BY date
        LIMIT 7;
    ''')


@app.route('/stats/hourly')
@rated_limited(5)
def stats_hourly():
    return queryHelper('''
        SELECT date, hour, impressions, clicks, revenue
        FROM public.hourly_stats
        ORDER BY date, hour
        LIMIT 168;
    ''')


@app.route('/stats/daily')
@rated_limited(5)
def stats_daily():
    return queryHelper('''
        SELECT date,
            SUM(impressions) AS impressions,
            SUM(clicks) AS clicks,
            SUM(revenue) AS revenue
        FROM public.hourly_stats
        GROUP BY date
        ORDER BY date
        LIMIT 7;
    ''')

@app.route('/poi')
@rated_limited(5)
def poi():
    return queryHelper('''
        SELECT *
        FROM public.poi;
    ''')

def queryHelper(query):
    with engine.connect() as conn:
        result = conn.execute(query).fetchall()
        return jsonify([dict(row.items()) for row in result])
