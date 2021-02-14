## User-adapter

> Python Flask adapter. Embedded MongoDB database

This service is responsible to manage communication with user database. It provides functions and methods to manage user information.

MongoDB is used so data is stored as JSON.



---



###### Record type

The main object that this service manages is the **user**. It is validated according to this following schema:

```
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
```

A valid user needs **nickname** and **password**.

When user is logged in, a simple boolean is saved to state that he has done such operation. This info will be used as authentication token.

```
Another property is added dynamically to user json:
['authorized'] = True
```



---



### Api routes list

Following routes base URL is **http://localhost/5001**



##### **GET** /info

> This route can be used to check if the adapter service is working properly.
>
>  ```
>GET 200 Produces: 
> 
> {"Connection": "User adapter and user Mongodb are Online!, "Mongo status": ...}
> ```



##### **GET | POST** /user

> Endpoint that allows to save and get user from database
>
>  > *GET /user?nickname=bob*
>
> ```
>GET 200 Produces:
> 
> [{"nickname": "user", "password": "$2a$10$VRvMdIX9DTQRPX9/0wke/uIFXOF3Y1BbkEKLVLjToMFleLEek3pI2"}]
> ```
> 
> ```
>GET 400 Errors:
> {"error": 'User with nickname X do not exist'}
> ```



> ```
> POST 200
> Requires JSON body:
> {
> 	'nickname' : 'sample',
> 	'password' : 'sample'
> }
> 
> Produces:
> {"nickname": "sample"}
> ```
>
> ```
> POST 400 Errors:
> {"error": "Duplicate username"}
> {"error": "Invalid Json payload"}
> ```



##### **POST** /logout 

>Endpoint that allows user to logout. Also removes user authentication, sets authorized property to *false*.
>
>```
>POST 200
>Requires Json body:
>{
>	'nickname' : 'sample'
>}
>
>Produces: 
>{"operation": True}
>```
>
>```
>POST 400 Errors:
>{"operation": False}
>```



##### **POST** /authorize

>Endpoint that allows to authorize a user.
>
>```
>POST 200
>Requires Json body:
>{
>	'nickname' : 'sample'
>}
>
>Produces: 
>{"operation": True}
>```
>
>```
>POST 400 Errors:
>{"operation": False}
>```



