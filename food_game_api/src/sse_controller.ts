import { Request, Response } from 'express';
import { GameMatch } from './types';

const stream = require('central-event')

export const sse = async (req: Request, res: Response) => {
    res.writeHead(200, {
        'Content-type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
    });

    stream.on('join', function () {
        console.log("send event join")
        res.write('event: message' + '\n' + 'data: ' + JSON.stringify({ 'event': 'join', 'data': "" }) + '\n\n');
    });

    stream.on('nextmatch', (data: GameMatch) => {
        console.log("send event nextmatch")
        res.write('event: message' + '\n' + 'data: ' + JSON.stringify({ 'event': 'nextmatch', 'data': data }) + '\n\n');
    });

    stream.on('wronganswer', (data: GameMatch) => {
        console.log("send event wronganswer")
        res.write('event: message' + '\n' + 'data: ' + JSON.stringify({ 'event': 'wronganswer', 'data': data }) + '\n\n');
    });

    stream.on('matchwin', (data: GameMatch) => {
        console.log("send event matchwin")
        res.write('event: message' + '\n' + 'data: ' + JSON.stringify({ 'event': 'matchwin', 'data': data }) + '\n\n');
    });

    stream.on('gameend', (data: GameMatch) => {
        console.log("send event gameend")
        res.write('event: message' + '\n' + 'data: ' + JSON.stringify({ 'event': 'gameend', 'data': data }) + '\n\n');
    });

    stream.on('gamefailure', function () {
        console.log("send event gamefailure")
        res.write('event: message' + '\n' + 'data: ' + JSON.stringify({ 'event': 'gamefailure', 'data': {} }) + '\n\n');
    });

    stream.on('matchexpired', function () {
        console.log("send event gamefailure")
        res.write('event: message' + '\n' + 'data: ' + JSON.stringify({ 'event': 'matchexpired', 'data': {} }) + '\n\n');
    });

    stream.on('joinfailure', function () {
        console.log("send event joinfailure")
        res.write('event: message' + '\n' + 'data: ' + JSON.stringify({ 'event': 'joinfailure', 'data': {} }) + '\n\n');
    });
}