import json

import jsonschema
from flask import Flask, request, make_response
from jsonschema import validate
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

app = Flask(__name__)

client = MongoClient('recipes_db', 27017)
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


# Utility to create an unique digest which will be used as recipe id if not present
def digest(recipe):
    if '_id' in recipe:
        return recipe
    else:
        _id = hash(recipe['name'] + recipe['ingredients'][0])
        recipe['_id'] = str(_id)
        return recipe


# At this point there is a check if the Db is empty, in case a default collection will be loaded
x = collection.find_one()
if x is None:
    print("Initializing default collection...")
    f = open('default-collection.json')
    data = json.load(f)
    for recipe in data['recipes']:
        elem = digest(recipe)
        collection.insert_one(elem)
    f.close()


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


# Post a single Json with recipe data
@app.route('/recipe', methods=['POST'])
def add_recipe():
    print("POST received: /recipe")
    req_data = request.get_json()
    if validate_json(req_data):
        # Creating an unique id
        req_data = digest(req_data)
        result = collection.insert_one(req_data)
        print(result)
        response = make_response({'recipe': req_data['name']})
        response.headers['Content-Type'] = 'application/json'
        response.status_code = 200
        return response
    else:
        response = make_response({'error': 'supplied not valid recipe'})
        response.headers['Content-Type'] = 'application/json'
        response.status_code = 400
        return response

# Delete a recipe by name
@app.route('/recipe', methods=['DELETE'])
def delete_recipe():
    print("DELETE received: /recipe")
    req_data = request.args.get('name')
    coll = list(collection.find({"name": req_data}, {"_id": 0}))
    print(coll)
    if len(coll) > 0:
        collection.delete_one({ "name" : req_data})
        response = make_response({'recipe': req_data})
        response.headers['Content-Type'] = 'application/json'
        response.status_code = 200
        return response
    else:
        response = make_response({'error': 'supplied not valid recipe'})
        response.headers['Content-Type'] = 'application/json'
        response.status_code = 400
        return response
        
# Endpoint to get all recipes at '/recipes' Get method
@app.route('/recipes', methods=['GET'])
def get_recipes():
    res = collection.count_documents({})
    if res:
        print("GET received: /recipes")
        # returning recipes without "_id"
        coll = list(collection.find({}, {"_id": 0}))
        response = make_response(json.dumps(coll, default=str))
        response.headers['Content-Type'] = 'application/json'
        return response
    else:
        response = make_response({'error': 'empty recipes collection'})
        response.headers['Content-Type'] = 'application/json'
        response.status_code = 404
        return response


# Utility function to compute union without repetition
def union(lst1, lst2):
    final_list = list(set(lst1) | set(lst2))
    return final_list


# Endpoint to get all ingredients at '/ingredients' Get method
@app.route('/ingredients', methods=['GET'])
def get_ingredients():
    res = collection.count_documents({})
    if res:
        print("GET received: /ingredients")
        # returning ingredients from recipes
        coll = list(collection.find({}, {"_id": 0, "ingredients": 1}))
        res = []
        for x in coll:
            res = union(res, x['ingredients'])
        response = make_response(json.dumps(res))
        response.headers['Content-Type'] = 'application/json'
        response.status_code = 200
        return response
    else:
        response = make_response({'error': 'empty ingredients collection'})
        response.headers['Content-Type'] = 'application/json'
        response.status_code = 404
        return response


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
