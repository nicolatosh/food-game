import json

import jsonschema
from flask import Flask, request, make_response
from jsonschema import validate
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from bson.json_util import dumps

app = Flask(__name__)

client = MongoClient('user_db', 27017)
db = client.user_db
collection = db.user

# This is how user look like. It is used to define a schema
# that specify how the resource 'user' is
userSchema = {
    "title": "User",
    "type": "object",
    "description": "User of food-game",
    "properties": {
        "nickname": {"type": "string"},
        "password": {"type": "string"}
    },
    "required": ["nickname", "password"]
}


# Helper function to validate recipes according to a supplied schema
def validate_json(json_data, schema):
    try:
        validate(instance=json_data, schema=schema)
    except jsonschema.exceptions.ValidationError as err:
        print(err)
        return False
    return True


# At this point there is a check if the Db is empty, in case a default user in added
x = collection.find_one()
if x is None:
    print("Default user created")
    collection.insert_one({'nickname' : 'user', 'password' : 'user'})


# This route can be used to check if the adapter service is
# working properly. It returns a Json response describing 
# the connection with DB and its information
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


# Endpoint that allows to signin a user (POST nick + password)
# If user is in Db then the GET response is the user
@app.route('/user', methods=['POST', 'GET'])
def get_user():

    # POST allows to add a user 
    if request.method == 'POST':
        req_data = request.get_json()
        response = make_response({"nickname": req_data['nickname']})
        response.headers['Content-Type'] = 'application/json'
        
        # Validation of the supplied Json format user
        if validate_json(req_data, userSchema):
            print("User register request received")
            if not is_user_duplicate(req_data["nickname"]):
                result = collection.insert_one(req_data)
                print("Inserted in db: ", result)
                if result:
                    response.status_code = 200
                    return response
            response = make_response({"error": "Duplicate username"})
            response.headers['Content-Type'] = 'application/json'
            response.status_code = 400
            return response     
        response = make_response({"error": "Invalid Json payload"})
        response.headers['Content-Type'] = 'application/json'
        response.status_code = 400
        return response

    elif request.method == 'GET' and  request.args.get('nickname') != " ":
        nick = request.args.get('nickname')
        response = make_response({"nickname": nick})
        response.headers['Content-Type'] = 'application/json'
        print("User nickname check requestd")
        result = list(collection.find({"nickname": nick}, {"_id": 0}))
        print(result)
        if len(result):
            response.status_code = 200
            response = make_response(json.dumps(result, default=str))
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response
        response = make_response({"error": 'User with nickname' + str(nick) + 'do not exist'})
        response.status_code = 400
        return response
        
# Endpoint that allows user to logout
@app.route('/logout', methods=['POST'])
def logout():
    req_data = request.get_json()
    nick = req_data["nickname"]
    # Find user and remove the authorization
    result = list(collection.find({"nickname": nick}, {"_id": 0}))
    if len(result):
        result[0]['authorized'] = False
        response = make_response({"operation": True})
        response.headers['Content-Type'] = 'application/json'
        response.status_code = 200
        return response
    else:
        response = make_response({"operation": False})
        response.headers['Content-Type'] = 'application/json'
        response.status_code = 400
        return response
    

# Endpoint that allows to authorize a user
@app.route('/authorize', methods=['POST'])
def auth():
    req_data = request.get_json()
    nick = req_data["nickname"]
    result = list(collection.find({"nickname": nick}, {"_id": 0}))
    if len(result):
        result[0]['authorized'] = True
        response = make_response({"operation": True})
        response.headers['Content-Type'] = 'application/json'
        response.status_code = 200
        return response
    else:
        response = make_response({"operation": False})
        response.headers['Content-Type'] = 'application/json'
        response.status_code = 400
        return response

# Function to check if a nickname already exist in DB
def is_user_duplicate(nick):
    query = {"nickname": nick}
    res = list(collection.find(query))
    if len(res):
        return True
    return False


# Utility function to compute union without repetition
def union(lst1, lst2):
    final_list = list(set(lst1) | set(lst2))
    return final_list


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001)
