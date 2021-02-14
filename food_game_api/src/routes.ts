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
    matchtypes
} from './controller'
import { sse } from './sse_controller';
import { login, signin, logger } from './user_controller';

const router = express.Router();

/**
 * Food-game API endpoints. Note that some of them require
 * authentication.
 */
router.get('/', welcome); 
router.post('/play',logger, play)
router.get('/game', logger, getMatchstatus)
router.post('/game', logger, processUserInput)
router.post('/game/join', logger, opponentJoin)
router.post('/register',signin)
router.post('/login',login)
router.get('/matchtypes', matchtypes)
router.get('/sse', sse)
router.get('/info', welcome)

export default router;
