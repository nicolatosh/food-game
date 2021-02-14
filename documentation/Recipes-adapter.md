## Recipes-adapter

> Python Flask adapter. Embedded MongoDB database

This service is responsible to manage communication with recipe database. It provides functions and methods to manage recipes information.

MongoDB is used so data is stored as JSON.

---



###### Record type

The main object that this service manages is the **recipe**. It is validated according to this following schema:

```
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
```

A valid recipe needs at least a **name**

> **Note**: each recipe needs to have a distinct id. This is a dynamic property added to recipe before saving it on database.

```
def digest(recipe):
    if '_id' in recipe:
        return recipe
    else:
        _id = hash(recipe['name'] + recipe['ingredients'][0])
        recipe['_id'] = str(_id)
        return recipe
```

> **Note**: at startup the database is empty. Service performs a check and if the case a default collection is added.



---



### Api routes list

Following routes base URL is **http://localhost/5000**



##### **GET** /info

> This route can be used to check if the adapter service is working properly.
>
>  ```
>Returns JSON: 
> 
> {"Connection": "Adapter and  Mongodb are Online!, "Mongo status": ...}
> ```



##### **POST** /recipe

> Post a single recipe in Json format
>
> ```
>POST 200
> Requires JSON body:
> {
>  "name": "Risotto ai funghi",
>  "ingredients": ["riso", "funghi", "brodo", "burro", "formaggio"],
>     "steps":["prepara il brodo", "tosta il riso","cuoci riso con brodo", "aggiungi funghi"
>     ,"manteca il tutto con burro e parmigiano"]
>    }
>    
> Produces:
> {'recipe': 'Risotto ai funghi'}
> ```
> 
> ```
>POST 400 Errors:
> {'error': 'supplied not valid recipe'}
> ```



##### DELETE /recipe

> Delete a recipe by name
>
> > /recipe?name=pasta
>
> ```
> DELETE 200
> Requires: name parameter
> Produces:
> {'recipe': 'pasta'}
> ```
>
> ```
> DELETE 400 Errors:
> {'error': 'supplied not valid recipe'}
> ```



##### **GET** /recipes

>Endpoint to get all recipes.
>
>```
>GET 200
>Produces: 
>
>[
>{
>   "name": "Risotto ai funghi",
>       "ingredients": [
>            "riso",
>            "funghi",
>            "brodo",
>            "burro",
>            "formaggio"
>        ],
>        "steps": [
>            "prepara il brodo",
>            "tosta il riso",
>            "cuoci riso con brodo",
>            "aggiungi funghi",
>            "manteca il tutto con burro e parmigiano"
>        ]
>     },
>     ...
>    ...
>    ...
>    ]
>    ```
> 
>```
>GET 404 Errors:
>{'error': 'empty recipes collection'}
>```



##### **GET** /ingredients

>Endpoint to get all distinct ingredients.
>
>```
>GET 200
>Produces: 
>[
>"guanciale",
>"cioccolato",
>    "pinoli",
>    "basilico",
>    "riso",
>    "uova",
>    "pecorino romano",
>    "sale",
>    "olio",
>    "burro",
>    "lievito
>    ...
>    ...
>    ...
>    ]
>    ```
>
>```
>GET 404 Errors:
>{'error': 'empty ingredients collection'}
>```



