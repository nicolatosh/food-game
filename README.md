# Food-game

Welcome to FoodGame! This is a on-line game that challenge users with some delicious questions and is fully playable via REST api. It is made up by some different micro-services, each runs in a container solution.

Food game is able to:

- Generate a game resource and provide methods to access to it
- Manage user simple sign-in and log-in
- Allow users to play single-player and multi-player preserving data integrity
- Load new recipes data
- Game is fully playable via front-end

*To understand how each service works take a look to service specific documentation.*

> Check *documentation* folder



---



### Quick start

Application is based on different technologies and frameworks so that Docker containers was adopted. The app can be seen as two separate stacks, each one running on a separate virtual machine. In source folder you will find two different *docker-compose files*.

> *To run the application you should execute each compose "stack" in a separate virtual-machine*

In order to simulate a pseudo-distributed system, the VMs run a portion of the app. In my setup I used two VMs connected to the same shared NAT network. You can use the pre-configured machines or build new ones. In any case i would like to spend few words to explain what is intended with a shaded Nat network.

```
Using VirtualBox follow these steps:

1. Open File -> Preferencies -> Network
2. Create a new custom Nat network
3. Assign each machine to such network.

Machines now will be able to reach each other meanwhile being on a different net. VirtualBox will provide us a virtual bridge.
```



###### Run with docker-compose

In machine named "Ubuntu" 

> VMs password = nicola

```
git clone https://ArpiNatoR@bitbucket.org/ArpiNatoR/sde.git
cd sde
sudo docker-compose -f docker-compose-backend up --build
```

In machine named "Ubuntu-frontend"

```
git clone https://ArpiNatoR@bitbucket.org/ArpiNatoR/sde.git
cd sde
sudo docker-compose -f docker-compose-frontend up --build
```



>**Note**: we can also avoid to use pre-configured VMs with shared network. The only parameter to change is *BACKEND* env variable in *docker-compose-frontend.yml* file in which we need to specify what is the other machine address. Services will make calls at such address.

Game is now accessible via front-end at **http://localhost:4200/**



###### Play a game

To simulate a multi-player game you can open two different browser sessions and log-in as different user.

----



##### General game-play rules

Single-player

+ User wins if the answer is correct for each match
+ Even a single wrong answer causes the game to be lost
+ 10 seconds to answer. Once answer is sent there is no turning back

Multi-player

+ User waits for max 15 second for an opponent to join the game
+ Each user has 10 seconds to send a correct answer for a match
+ If user sends a wrong answer he cannot send more answers for the same match
+ If user sends a wrong answer waits till the opponent does his guess
+ if both users fail a match, the game is lost
+ Winner is the user that has achieved more won matches

