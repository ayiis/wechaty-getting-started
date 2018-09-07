'use strict';

const WebSocket = require('ws');
const port = 3000;
const WebSocketServer = WebSocket.Server;
const server = new WebSocketServer({ port: port });
let setting = {};

server.on('connection', ws => {
    ws.on('message', message => {
        try {
            console.log("Got message:", message);
            // broadcast(JSON.stringify(message));
            on_message_callback(message);
        } catch (e) {
            console.error(e.message);
        }
    });
});

function on_message_callback(message) {
    const json_message = JSON.parse(message);

    if(json_message.type == "room-message") {
        const contact = setting["bot"].Contact.load(json_message.to_id);
        contact.say(json_message["text"]);
    } else if(json_message.type == "message") {
        const room = setting["bot"].Room.load(json_message.to_id);
        room.say(json_message["text"]);
    }
}

function set_setting(new_setting) {
    for (var e in new_setting) {
        setting[e] = new_setting[e];
    }
}

function broadcast(data) {
    server.clients.forEach(client => {
        console.log("broadcast.data.len =", data.length);
        client.send(data);
    });
};

console.log('Server is running on port', port);

module.exports = {
    broadcast: broadcast,
    on_message_callback: on_message_callback,
    set_setting: set_setting,
}
