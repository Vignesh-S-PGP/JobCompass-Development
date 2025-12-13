from pymongo import MongoClient
from flask import current_app

client = None
db = None

def init_db(app):
    global client, db
    client = MongoClient(app.config["MONGO_URI"])
    db = client.get_default_database()
