#!/usr/bin/env python
# coding: utf8
from gluon import *

# Geolocation database test
def location():

    log = []

    ids = []

    # Create 10 rows in the database
    for i in range(5):
        ids.append(db.geolocation.insert(uid = 1, loc = geoPoint(i * 100, i * 100 + 100)))
    
    for id in ids:
        # Read the created rows
        log.append(db(db.geolocation.id == id).select().first())
    
        # Update the created rows
        db(db.geolocation.id == id).update(uid = 2, loc = geoPoint(123, 456))
        log.append(db(db.geolocation.id == id).select().first())

        # Delete the created rows
        db(db.geolocation.id == id).delete()

    return dict(log = BEAUTIFY(log))
