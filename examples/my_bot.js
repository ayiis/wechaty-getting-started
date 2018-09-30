const ws_srv = require('./websocket.js');
const room_manage = require('./room_manage.js');
const friend_manage = require('./friend_manage.js');

const { Wechaty } = require('wechaty')

const bot = new Wechaty({
    name : 'ding-dong-bot',
    profile : 'yes',
})

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

room_manage.initRoom(bot);
friend_manage.initFriendship(bot);
ws_srv.set_setting({
    "bot": bot,
});

bot.start()
.then(() => console.log('Starter Bot Started.'))
.catch(e => console.error(e))


function onScan (qrcode, status) {
    require('qrcode-terminal').generate(qrcode, { small: true })  // show qrcode on console

    const qrcodeImageUrl = [
        'https://api.qrserver.com/v1/create-qr-code/?data=',
        encodeURIComponent(qrcode),
    ].join('')

    console.log(qrcodeImageUrl)
}

function onLogin (user) {
    console.log(`${user} login`);
    let message_data = {
        "type": "login",
        "ts": new Date().getTime() / 1000,
        "data": user
    }
    ws_srv.broadcast(JSON.stringify(message_data));
}

function onLogout(user) {
    console.log(`${user} logout`);
    let message_data = {
        "type": "logout",
        "ts": new Date().getTime() / 1000,
        "data": user
    }
    ws_srv.broadcast(JSON.stringify(message_data));
}

async function onMessage (msg) {
    console.log(msg.toString())

    const room = msg.room();
    const from = msg.from();
    const to = msg.to();
    const text = msg.text();

    let message_data = {
        "type": "message",
        "ts": new Date().getTime() / 1000,
        "data": {
            "from_nick": from && from.name(),
            "from": from && from.id,
            "to_nick": to && to.name(),
            "to": to && to.id,
            "text": msg.text(),
            "room": room && room.id,
            "type": msg.type(),
            "self": msg.self(),
            "mentionSelf": msg.mentionSelf(),
            "age": msg.age(),
            "date": msg.date(),
        }
    }
    ws_srv.broadcast(JSON.stringify(message_data));
}



