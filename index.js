const sakalist = require('./saka');
const tepkilist = require('./tepki');
const whitelist = require('./whitelist');
require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = 's!'
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

client.once('ready', () => {
    console.log('Hazırım!')
})

client.on('message', message =>{
    if (whitelist.find(id => id == message.channel.id)){
        if(!message.content.startsWith(prefix) || message.author.bot) return

        const args = message.content.slice(prefix.length).split(" ")
        const command = args.shift().toLowerCase()

        if(command === 'saka'){
            let i = getRandomInt(sakalist.length)
            message.channel.send(sakalist[i])
        }else if(command === 'tepki'){
            let j = getRandomInt((tepkilist.length))
            message.channel.send(tepkilist[j])
        }
    }
    if(message.content.match('<:agladim:859509083790508112>')){
        message.react('🪣')
        message.react('🧻')
        message.react('🫂')
    }
})


client.login(process.env.BOT_TOKEN);

