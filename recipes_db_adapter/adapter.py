import json

import jsonschema
from flask import Flask, request, make_response
from jsonschema import validate
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

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
        "steps": {
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


@app.route('/info')
def info():
    connection = "Adapter and Mongo are Online!"
    try:
        client.admin.command('ismaster')
        info = client.server_info()
    except ConnectionFailure:
        connection = "Error: Adapter working but Mongo is offline"
        info = "Mongo offline"
        print(connection)
    info_json = {"Connection": connection, "Mongo status": info}
    response = make_response(json.dumps(info_json))
    response.headers['Content-Type'] = 'application/json'
    if info == "Mongo offline":
        response.status_code = 503
    else:
        response.status_code = 200
    return response


# Post Json with recipe data
@app.route('/addrecipe', methods=['POST'])
def add_recipe():
    print("Post received")
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
        # returning recipes without "_id" generated from mongo
        coll = list(collection.find({}, {"_id": 0}))
        for x in coll:
            print(x)
        response = make_response(json.dumps(coll, default=str))
        response.headers['Content-Type'] = 'application/json'
        return response
    return "404"


# Utility function to compute union without repetition
def union(lst1, lst2):
    final_list = list(set(lst1) | set(lst2))
    return final_list


# Endpoint to get all ingredients at '/ingredients' Get method
@app.route('/ingredients', methods=['GET'])
def get_ingredients():
    res = collection.count_documents({})
    if res:
        # returning ingredients from recipes
        coll = list(collection.find({}, {"_id": 0, "ingredients": 1}))
        res = []
        for x in coll:
            res = union(res, x['ingredients'])
        print(res)
        response = make_response(json.dumps(res))
        response.headers['Content-Type'] = 'application/json'
        return response
    return "404"


if __name__ == "__main__":
    app.run(port=5000)
