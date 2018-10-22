
const Discord = require('discord.js')
const fs = require('fs')
const path = require('path')

const bot = new Discord.Client()


const config = require('./config.json')
const prefix = 'm!'
var msgSent = false

//==============================================================================
// file(command) | Gets a commands output from its text file
//==============================================================================
function file(command){
  return fs.readFileSync(command + '.md','utf8')
}

async function activity(){
  bot.user.setPresence({
      game: {
          name: `bot started!`,
          type: "PLAYING"
      }
  })

  while(true){
    await sleep(10000)
    var x = Math.floor(Math.random() * Math.floor(9))
    switch (x){
      case 0:
                bot.user.setPresence({
                    game: {
                        name: `Eden: Universe Builder`,
                        type: "PLAYING"
                    }
                })
      case 1:
                bot.user.setPresence({
                    game: {
                        name: `m!help`,
                        type: "LISTENING"
                    }
                })
      case 2:
                bot.user.setPresence({
                    game: {
                        name: `${bot.users.size} builders!`,
                        type: "WATCHING"
                    }
                })
      case 3:
                bot.user.setPresence({
                    game: {
                        name: `with Stumpy`,
                        type: "PLAYING"
                    }
                })
      case 4:
                bot.user.setPresence({
                    game: {
                        name: `edengame.net`,
                        type: "STREAMING"
                    }
                })
      case 5:
                bot.user.setPresence({
                    game: {
                        name: `r/edengame`,
                        type: "STREAMING"
                    }
                })
      case 6:
                bot.user.setPresence({
                    game: {
                        name: `gitlab.com/edenproject`,
                        type: "STREAMING"
                    }
                })
      case 7:
                bot.user.setPresence({
                    game: {
                        name: `discord.me/EdenUniverseBuilder`,
                        type: "WATCHING"
                    }
                })
      case 8:
                bot.user.setPresence({
                    game: {
                        name: `#bot`,
                        type: "WATCHING"
                    }
                })
      default:
                bot.user.setPresence({
                    game: {
                        name: `Eden: Universe Builder`,
                        type: "PLAYING"
                    }
                })
    }
  }
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

//==============================================================================
// ready | Gets called when our bot is successfully logged in and connected.
//==============================================================================
bot.on('ready', () => {
  const guild = bot.guilds.array()[0]
  const channel = guild.channels.find('name', 'bot')

  console.log( `Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`)
  //channel.send(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`)

  activity()
  //displayPrompt()
})

//==============================================================================
// guildCreate | This event triggers when the bot joins a guild.
//==============================================================================
bot.on('guildCreate', guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`)
})

//==============================================================================
// guildDelete | This event triggers when the bot is removed from a guild.
//==============================================================================
bot.on('guildDelete', guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`)
})

async function displayPrompt(command){
  const guild = bot.guilds.array()[0]
  const channel = guild.channels.find('name', 'bot')

  while(true){
    await sleep(10000)
    if (msgSent){
      channel.send(file('help'))
      .then(msg => {
        msg.delete(10000)
      })
      .catch()
      msgSent = false
    }
  }
}

//==============================================================================
// message | Event to listen to messages sent to the server where the bot is located
//==============================================================================
bot.on('message', async message => {

  const log = fs.readFileSync('log.txt','utf8') + message.author.username + ' | ' + message.content + '\n'
  fs.writeFile("log.txt", log, function(err) {
    if(err) {
        return console.log(err);
    }
  })

  // So the bot doesn't reply to iteself
	if(message.author.bot) return
  const botChannel = message.guild.channels.find('name', 'bot')
  msgSent = true

  var args = ''
  var command = ''

  if(message.channel != botChannel){
    // Ignore any message that does not start with our prefix,
    if(message.content.indexOf(prefix) !== 0) return
    args = message.content.slice(prefix.length).trim().split(/ +/g)
  	command = args.shift().toLowerCase()
  } else {
    if (message.content.indexOf(prefix) == 0){
      args = message.content.slice(prefix.length).trim().split(/ +/g)
    } else {
      args = message.content.trim().split(/ +/g)
    }
    command = args.shift().toLowerCase()
  }

  console.log(command)
  console.log(args)

  switch(command) {
    case 'ping':
                    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
                		const m = await message.channel.send('Ping?')
                		m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`)
    break
    case 'help':
                    if (args.length <= 0){
                      message.channel.send(file('help'))
                    } else {
                      for (var i = 0; i < args.length; i++) {
                        if (args[i] == 't' || args[i] == 'tatsumaki') {
                          message.channel.send(file('tHelp'))
                        } else if (args[i] == 'n' || args[i] == 'notsobot') {
                          message.channel.send(file('nHelp'))
                        }  else if (args[i] == 'r' || args[i] == 'rythm') {
                          message.channel.send(file('rHelp'))
                        } else if (args[i] == 'm' || args[i] == 'moof') {
                          message.channel.send(file('mHelp'))
                        }
                      }
                    }
    break
    default:
                    if(message.channel != botChannel){
                      message.channel.send('Command not found')
                    }
}
})

//==============================================================================
// guildMemberAdd | Create an event listener for new guild members
//==============================================================================
bot.on('guildMemberAdd', member => {
  const channel = member.guild.channels.find('name', 'welcome')
  const adminChannel = member.guild.channels.find('name', 'admin-chat')
  // Do nothing if the channel wasn't found on this server
  if (!channel) return

  console.log(`Welcome to the server, ${member.displayName}`)

  if (member.displayName.indexOf('discord.gg') > -1 || member.displayName.indexOf('add me') > -1 || member.displayName.indexOf('twitch.tv') > -1 || member.displayName.indexOf('discord.me') > -1) {
    member.guild.ban(member)
    console.log(`SPAM DETECTED: ${member}`)
    console.log(adminChannel)
    adminChannel.send(`SPAM DETECTED: ${member}`)
  } else {
    bot.user.setPresence({
        game: {
            name: `the new guy`,
            type: "WATCHING"
        }
    })
    channel.send(`Welcome ${member} to the discord server for Eden: Universe Builder! :D

Please wait for a <@&468233437115842560> to add you to the trusted members group!`)
  }
})

//==============================================================================
// guildMemberRemove | Create an event listener for new guild members
//==============================================================================
bot.on('guildMemberRemove', member => {
  const channel = member.guild.channels.find('name', 'welcome')
  // Do nothing if the channel wasn't found on this server
  if (!channel) return

  console.log(`We're sorry to see you leaving, ${member.displayName}`)

  if (!(member.displayName.indexOf('discord.gg') > -1 || member.displayName.indexOf('add me') > -1 || member.displayName.indexOf('twitch.tv') > -1 || member.displayName.indexOf('discord.me') > -1)) {
    bot.user.setPresence({
        game: {
            name: `the player that left`,
            type: "WATCHING"
        }
    })
    channel.send(`We're sorry to see you leaving, ${member} <:cancel:484597542894567436>`)
  }
})


bot.login(config.token)
