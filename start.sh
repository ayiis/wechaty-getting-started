#!/bin/bash
export WECHATY_PUPPET_PADCHAT_TOKEN=padchat-tokenzhengrenfeng8471312
export WECHATY_PUPPET=padchat
export WECHATY_LOG=silly./node_modules/.bin/
export WECHATY_PUPPET_PADCHAT_ENDPOINT=ws://54.223.73.175:8788/wx
# ts-node examples/ding-dong-bot.ts
# ts-node examples/starter-bot.js
ts-node examples/my_bot.js

