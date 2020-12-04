import json
import jsonschema
from flask import Flask, redirect, url_for, request
from pymongo import MongoClient
from jsonschema import validate

app = Flask(__name__)

client = MongoClient('recipes_db', 27017)
db = client.recipes

recipeSchema = {
    "title": "Recipe",
    "type": "object",
    "description": "Simple recipe to cook",
    "properties": {
        "name": {"type": "string"},
        "ingredients": [],
        "steps": [],
    },
    "required": ["name"]
}


# Helper function to validate recipes according to a schema
def validate_json(json_data):
    try:
        validate(instance=json_data, schema=recipeSchema)
    except jsonschema.exceptions.ValidationError as err:
        return False
    return True


@app.route('/')
def hello_world():
    return 'Hello, World!'


# Post Json with recipe data
@app.route('/add', methods=['POST'])
def add_recipe():
    req_data = request.get_json()
    if validate_json(req_data):
        db.recipes.insert_one(req_data)
        return req_data
    else:
        return 400


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
