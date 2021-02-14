## Match-service

> Java Spring service

This service is responsible to build a Match from ingredients and recipes. In short, it can produce following types of matches:

1. rearrange_steps

2. select_ingredients

The first type requires the service to get a random recipe, take its steps and rearrange them.
The second type requires the service to get all ingredients, a random recipe and do the following:

- Remove half of ingredients from the recipe
- Fill the gap with random ingredients without repetition and without overlap with the other half

Then in both match types a correct answer must be produced. In this way the service that will consume this match will know what means for a match to be correctly answered.

---



###### Match type

```
Below there are private fields of the Match object:

	private final String id;
    private final String match_type;
    private final String recipe_name;
    private final List<String> scrambled_ingredients;
    private final List<String> scrambled_steps;
    private final List<String> answer;
```



---



### Api routes list

Following routes base URL is **http://localhost/8080**



##### **GET** /match

> This endpoint produces a new match according to some parameters.
>
> > *GET /match?type=select_ingredients*
>
> ```
>GET 200 Produces: 
> {
>     "id":"-349539266",
>     "match_type":"select_ingredients",
>     "recipe_name":"Ciambellone al cioccolato",
>     "scrambled_ingredients":[
>         "farina",
>         "uova",
>         "sale",
>         "brodo",
>         "tuorli",
>         "formaggio"
>     ],
>     "scrambled_steps":[
> 
>     ],
>             "answer":[
>         "farina",
>         "uova",
>         "sale"
>     ]
> }
> ```
> 
> ```
>GET 400 Error:
> "Error, such type of match does not exits"
> ```



