import json

import jsonschema
from flask import Flask, request, make_response
from jsonschema import validate
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

app = Flask(__name__)

client = MongoClient('user_db', 27020)
db = client.user_db
collection = db.user_db

# This is how user look like
userSchema = {
    "title": "User",
    "type": "object",
    "description": "User of food-game",
    "properties": {
        "nickname": {"type": "string"},
        "password": {"type": "string"}
    },
    "required": ["name", "password"]
}


# Helper function to validate recipes according to a supplied schema
def validate_json(json_data, schema):
    try:
        validate(instance=json_data, schema=schema)
    except jsonschema.exceptions.ValidationError as err:
        print(err)
        return False
    return True


@app.route('/info')
def info():
    connection = "User adapter and user Mongodb are Online!"
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


# Endpoint that allows user to signing or to login
@app.route('/user', methods=['POST', 'GET'])
def add_recipe():
    req_data = request.get_json()
    if request.method == 'POST' and (validate_json(req_data, userSchema) is not True):
        print("User register request received")
        if is_user_duplicate(req_data.nickname) is not True:
            result = collection.insert_one(req_data)
            print("Inserted in db: ", result)
            if result:
                response = make_response({"nickname": req_data.nickname})
                response.headers['Content-Type'] = 'application/json'
                return response
        return "400"

    if request.method == 'GET' and (validate_json(req_data, userSchema) is not True):
        print("Login user request received")
        result = collection.find(req_data)
        print(result)
        if result:
            response = make_response({"nickname": result.nickname})
            response.headers['Content-Type'] = 'application/json'
            return response
    return "400"


# Function to check if a nickname already exist
def is_user_duplicate(nick):
    query = {"nickname": nick}
    res = collection.find(query)
    if res:
        return True
    return False


# Utility function to compute union without repetition
def union(lst1, lst2):
    final_list = list(set(lst1) | set(lst2))
    return final_list


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001)
