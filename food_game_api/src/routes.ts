/*********
 * Route definitions
 *   All the routes that you want to implement should be defined here!
 *   You should avoid to put code here: it's a better approach to call
 *   methods from the controllers in order to process the requests!
 *   In this way, here you can have a more organized way to check all
 *   your routes!
 *   In a huge project, you can define multiple routers in order to divide
 *   the endpoints in different files by the domain of their operation.
 */

import express from 'express';
import {
    welcome,
    play,
    getMatchstatus,
    processUserInput,
    opponentJoin,
    matchtypes,
    sse
} from './controller'
import { login, signin } from './user_controller';


const router = express.Router();

// Possible methods: .get, .post, .put, .patch, .delete

// To add URL parameters (Doable for any method! Not only for GET):
// router.get('/:parameter1/:parameter2', f);

router.get('/', welcome); // Example
/**
 * Endpoint to initialize the game. User should POST the chosen
 * game mode {@see GAME_MODE} via "gamemode" param and also the
 * match type {@see MATCH_TYPES} 
 */
router.post('/play', play)
router.get('/game', getMatchstatus)
router.post('/game', processUserInput)
router.post('/game/join', opponentJoin)
router.post('/register',signin)
router.post('/login',login)
router.get('/matchtypes', matchtypes)
router.get('/sse', sse)
router.get('/info', welcome)

export default router;
