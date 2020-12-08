import json
import jsonschema
from flask import Flask, redirect, url_for, request, Response, make_response
from pymongo import MongoClient
from pymongo.errors import OperationFailure
from jsonschema import validate

app = Flask(__name__)

client = MongoClient('localhost', 27017)
db = client.recipes_db
collection = db.recipes

# This is how a recipe looks like. It is used for validation
recipeSchema = {
    "title": "Recipe",
    "type": "object",
    "description": "Simple recipe to cook",
    "properties": {
        "name": {"type": "string"},
        "ingredients": { 
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "steps":{ 
            "type": "array",
            "items": {
                "type": "string"
            }
        },
    },
    "required": ["name"]
}


# Helper function to validate recipes according to a recipeSchema
def validate_json(json_data):
    try:
        validate(instance=json_data, schema=recipeSchema)
    except jsonschema.exceptions.ValidationError as err:
        print(err)
        return False
    return True


@app.route('/')
def hello_world():
    return 'Hello, World!'


# Post Json with recipe data
@app.route('/add-recipe', methods=['POST'])
def add_recipe():
    print("Post recieved")
    req_data = request.get_json()
    if validate_json(req_data):
        result = collection.insert_one(req_data)
        print(result)
        return "200"
    else:
        return "400"

# Endpoint to get all recipes at '/recipes' Get method
@app.route('/recipes', methods=['GET'])
def get_recipes():
    res = collection.count_documents({})
    if res:
        coll = list(collection.find({},{ "_id": 0 }))
        for x in coll:
            print(x)
        response = make_response(json.dumps(coll, default=str))
        response.headers['Content-Type'] = 'application/json'
        return response
    return "404"

if __name__ == "__main__":
    app.run(port=5000)
