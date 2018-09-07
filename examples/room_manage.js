const ws_srv = require('./websocket.js');
const {
  config,
  Contact,
  Room,
  Wechaty,
  log,
} = require('wechaty');

async function roomInvite(){
    return null;
}

async function roomJoin(room, inviteeList, inviter){
    const topic = await room.topic();
    const inviteeListName = inviteeList.map(c => c.name()).join(',');
    const inviterName = inviter.name();
    log.info( 'Bot', 'EVENT: room-join - Room "%s" got new member "%s", invited by "%s"',
        topic,
        inviteeListName,
        inviterName,
    )
    console.log('bot room-join room id:', room.id)
    await room.say(`welcome to "${topic}"!`, inviteeList[0]);
    ws_srv.broadcast(`EVENT: room-join - Room ${topic} got new member ${inviteeListName}, invited by ${inviterName}`)
}

async function roomLeave(room, leaverList){
    const topic = await room.topic();
    const leaverListName = leaverList.map(c => c.name()).join(',');
    log.info('Bot', 'EVENT: room-leave - Room "%s" lost member "%s"',
        topic,
        leaverListName,
    )
    const name  = leaverList[0] ? leaverList[0].name() : 'no contact!'
    await room.say(`kick off "${name}" from "${topic}"!` )
    ws_srv.broadcast(`EVENT: room-leave - Room ${topic} lost member ${leaverListName}`)
}

async function roomTopic(room, topic, oldTopic, changer){
    try {
        log.info('Bot', 'EVENT: room-topic - Room "%s" change topic from "%s" to "%s" by member "%s"',
            room,
            oldTopic,
            topic,
            changer,
        )
        await room.say(`room-topic - change topic from "${oldTopic}" to "${topic}" by member "${changer.name()}"` )
        ws_srv.broadcast(`EVENT: room-topic - Room ${room} change topic from ${oldTopic} to ${topic} by member ${changer}`)
    } catch (e) {
        log.error('Bot', 'room-topic event exception: %s', e.stack)
    }
}

function initRoom(bot) {
    // bot.on('room-invite', roomInvite);   // not here: emit when there is a room invitation
    bot.on('room-join',   roomJoin);
    bot.on('room-leave',  roomLeave);
    bot.on('room-topic',  roomTopic);
}

module.exports = {
    initRoom: initRoom
}
