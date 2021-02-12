/**
 * This module contains all supported routes that can be called.
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

router.get('/', welcome); 
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
