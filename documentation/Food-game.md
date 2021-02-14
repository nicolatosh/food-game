## Food-game-api

> NodeJS based service

This service is the process-centric service. It is responsible to aggregate other services and produce a game.
A game is a resource that  can be used to play. It is made of several matches. 

This service allow users to play alone or against another user. So it requires users to be registered and logged in.

---

#### How it works?

The typical request flow to play the game is the following:

> **Single-player modality**
>
> 1. Sign-in or Log-in
> 2. Choose of a game modality Single-player
> 3. Select a match-type according to what is available. (it depends on which modalities match service can offer)
> 4. Game starts!

> **Multi-player modality**
>
> 1. Sign-in or Log-in
> 2. Choose of a game modality *Multi-player* or *Join* to existent game
> 3. If not joined to an existent game, select a match-type according to what is available. (it depends on which modalities match service can offer).
>    If Join mode is selected then enter the game id then game starts!
> 4. If multi-player mode is selected then wait for a user to join



---

###### Types

```
export interface Match {
  id: string;
  match_type: string;
  recipe_name: string;
  scrambled_ingredients: Array<String>;
  scrambled_steps: Array<String>;
  answer: Array<String>;
}

export interface GameMatch {
  gameid: string;
  gamemode: string;
  game_status: GAME_STATUS; //This is an enum containing some status. Further information below
  matches: Match[];
}
```



### Api routes list

Following routes base URL is **http://localhost/30000**



##### **GET** /

> Endpoint to check if the service is on-line. Just returns "Hello World" message.
>
> ```
>GET 200 Produces: 
> "Food-game online!"
>```
> 



##### **POST** /play

> This endpoint allows to start a game. 
>
> *Requires user to be authenticated.*
>
> > gamemode can be: "single" or "multiplayer"
>
> ```
> Requires: 
> {
>     "gamemode": "single",
>     "matchtype": "rearrange_steps"
>     "userid" : "userid"
> }
> 
> POST 200 Produces: 
> {
>    "gameid":"32974",
>    "gamemode":"single",
>    "game_status":"single_started",
>    "matches":[
>       {
>          "id":"1861341677",
>          "match_type":"rearrange_steps",
>          "recipe_name":"Pasta al pomodoro",
>          "scrambled_ingredients":[
> 
>          ],
>                      "scrambled_steps":[
>             "cuoci la pasta",
>             "cuoci il pomodoro",
>             "manteca il tutto"
>          ],
>          "answer":[
>             "cuoci la pasta",
>             "cuoci il pomodoro",
>             "manteca il tutto"
>          ]
>       }
>    ]
> }
> ```
>
> ```
> POST 400 Errors:
> { 'error': 'Cannot start game with chosen settings' }
> { 'error': 'not authorized' }
> ```



##### **GET | POST** /game

> GET: Returns the game given a "gameid" or returns a 404 error message.
>
> *Requires user to be authenticated.*
>
> > *GET /game?gameid=1312&userid=userid*
>
> ```
> Requires: gameid parameter and userid
> 
> GET 200 Produces: 
> {
>    "gameid":"1312",
>    "gamemode":"single",
>    "game_status":"single_started",
>    "matches":[
>       {
>          "id":"1861341677",
>          "match_type":"rearrange_steps",
>          "recipe_name":"Pasta al pomodoro",
>          "scrambled_ingredients":[
> 
>          ],
>          "scrambled_steps":[
>             "cuoci la pasta",
>             "cuoci il pomodoro",
>             "manteca il tutto"
>          ],
>          "answer":[
>             "cuoci la pasta",
>             "cuoci il pomodoro",
>             "manteca il tutto"
>          ]
>       }
>    ]
> }
> ```
>
> ```
> GET 404 Errors:
> {"error":"Game does not exits!"}
> GET 400 Errors:
> { 'error': 'not authorized' }
> ```
>
> 
>
> > POST: calls a function called *processUserInput*. That function modifies the game resource according to what user sends. User can send a correct or a wrong answer. If we consider also the multiplayer scenario then game can enter in different *game_satus*
>
> > **Game sates**
> >
> > 1. Single_started 
> >
> > 2. Single_end 
> >
> > 3. Single_failure
> >
> >    *Following states applies for multi-player only*
> >
> > 4. Gaming 
> >
> > 5. Waiting_opponent_connection
> >
> > 6. Game_end 
> >
> > 7. Opponent_match_win 
> >
> > 8. Opponent_wrong_response 
> >
> > 9. Both_user_failure
>
> ```
> Requires:
> {
>     "gameid":"id",
>     "userid":"nickname",
>     "answer":[
>         "cuoci la pasta",
>         "cuoci pomodoro",
>         "manteca il tutto"
>     ]
> }
> 
> POST 200 Produces:
> 
> Result is a game in JSON format, check GET response. The difference relies is based on user input, so tipically game can have a different satatus such as more matches.
> 
> Otherwise some messages can be sent.
> ```
>
> ```
> POST 404 Error:
> {"error":"Game does not exits!"}
> GET 400 Errors:
> { 'error': 'not authorized' }
> ```



##### **POST** /play/join

> Allows a user to join a game. User must provide a 'gameid' and 'userid'.
>
> *Requires user to be authenticated.*
>
> > If user can join the game, an event is sent via SSE. 
>
> ```
> Requires: 
> {
>     "gameid": "id",
>     "userid": "userid"
> }
> 
> POST 200 Produces: 
> {
>    "gameid":"32974",
>    "gamemode":"single",
>    "game_status":"single_started",
>    "matches":[
>       {
>          "id":"1861341677",
>          "match_type":"rearrange_steps",
>          "recipe_name":"Pasta al pomodoro",
>          "scrambled_ingredients":[
> 
>          ],
>          "scrambled_steps":[
>             "cuoci la pasta",
>             "cuoci il pomodoro",
>             "manteca il tutto"
>          ],
>          "answer":[
>             "cuoci la pasta",
>             "cuoci il pomodoro",
>             "manteca il tutto"
>          ]
>       }
>    ]
> }
> ```
>
> ```
> POST 404 Errors:
> { "error": 'Game does not exits!'}
> { "error": 'game is not joinable'}
> GET 400 Errors:
> { 'error': 'not authorized' }
> ```





##### **POST** /register

> Perform the sign-in process. Requires nickname and password.
>
> > Note that the sign-in requires this service to call the user-adapter service. Stored password is hashed + salted.
>
> ```
>Requires: 
> {
>     "nickname": "jason",
>     "password": "psw"
> }
> 
> POST 200 Produces: 
> {"nickname":"jason"}
> ```
> 
> ```
>POST 400 Errors:
> { 'error': 'Supplied bad credentials to perform a signin' }
> ```



##### **POST** /login

> Perform the login process.
>
> + Requires nickname and password.
>
> + If user wants to logout also a 'logout' true parameter is needed.
>
> - If login is successful then user is also authorized. Service simply register a true bit in user database that means that user has correctly logged in
>
> ```
>Requires: 
> {
>     "nickname": "jason",
>     "password": "psw"
>     "logout" : "true or false"  //This paramiter is optional. If not supplied service will start login procedure
> }
> 
> POST 200 Produces: 
> {"nickname":"jason"}
> ```
> 
> ```
>POST 400 Errors:
> { 'error': "wrong credentials"}
> { 'error': "authorization failure"}
> ```





##### **GET** /matchtypes

> Endpoint to get all match types supported by the game
>
> ```
>GET 200 Produces: 
> ["rearrange_steps","select_ingredients"]
> ```
> 



##### **GET** /sse

> Endpoint to establish a one-way channel between service and caller. Through this channel this service can communicate dynamic updates of game resource. For example if a game ends or expires food-game service will notify with an event though this channel.
>
> ```
>GET 200 Produces: 
> 'Content-type': 'text/event-stream',
> 'Cache-Control': 'no-cache',
> Connection: 'keep-alive
> ```



