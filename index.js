const sqlite3 = require('sqlite3').verbose();
const whitelist = require('./whitelist');
require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = 's!'



let db = new sqlite3.Database('./sakabase.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Şakabase bağlanıldı.');
});

client.once('ready', () => {
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS sakalar(" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "saka TEXT UNIQUE NOT NULL)")
        db.run("CREATE TABLE IF NOT EXISTS tepkiler(" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "tepki TEXT UNIQUE NOT NULL)")
        db.run("CREATE TABLE IF NOT EXISTS hakaretler(" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "hakaret TEXT UNIQUE NOT NULL)")
    });
    console.log('Hazırım!')
})

client.on('message', message =>{
    if(message.content.match('<:agladim:859509083790508112>')){
        message.react('🪣')
        message.react('🧻')
        message.react('🫂')
    }else if(message.content.match('🤮')){
        message.react('🪣')
    }
    if (whitelist.find(id => id == message.channel.id)){
        if(!message.content.startsWith(prefix) || message.author.bot) return

        const args = message.content.slice(prefix.length).trim().split(' ')
        const command = args[0]
        const text = args.slice(1).join(' ')

        switch(command){
            case 'saka':
                db.get(`SELECT saka FROM sakalar ORDER BY RANDOM() LIMIT 1`,[], (err, row) => {
                    message.channel.send(row.saka)
                })
            break;
            case 'tepki':
                db.get(`SELECT tepki FROM tepkiler ORDER BY RANDOM() LIMIT 1`,[], (err, row) => {
                    message.channel.send(row.tepki)
                })
            break;
            case 'hakaret':
               db.get(`SELECT hakaret FROM hakaretler ORDER BY RANDOM() LIMIT 1`,[], (err, row) => {
                   message.channel.send(row.hakaret)
               })

            break;
            case 'yardim':
                const embed = new Discord.MessageEmbed()
                    .setTitle ('Yardım')
                    .setColor ('#ffcc4d')
                    .addField ('s!saka', 'bu komut, size komik olmayan birtakım şakalar yapar')
                    .addField ('s!tepki', 'bu komut, bu komik olmayan şakalara vermeniz gereken tepkiyi söyler')
                    .addField ('s!hakaret', 'bu da adı üstünde')
                message.channel.send(embed)
            break;
            case 'sakaekle':
                if(message.author.id !== '286504647882178560') return message.reply("Yetkin yok.")
                db.run(`INSERT INTO sakalar (saka) VALUES ("${text}")`)
                message.reply("Şaka eklendi.")
            break;
            case 'tepkiekle':
                if(message.author.id !== '286504647882178560') return message.reply("Yetkin yok.")
                db.run(`INSERT INTO tepkiler (tepki) VALUES ("${text}")`)
                message.reply("Tepki eklendi.")
            break;
            case 'hakaretekle':
                if(message.author.id !== '286504647882178560') return message.reply("Yetkin yok.")
                db.run(`INSERT INTO hakaretler (hakaret) VALUES ("${text}")`)
                message.reply("Hakaret eklendi.")
            break;
        }
    }
})


client.login(process.env.BOT_TOKEN);

