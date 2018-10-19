
const Discord = require('discord.js')
const fs = require('fs')
const path = require('path')

const bot = new Discord.Client()


const config = require('./config.json')
const prefix = '+'

//==============================================================================
// file(command) | Gets a commands output from its text file
//==============================================================================
function file(command){
  return fs.readFileSync(command + '.md','utf8')
}

//==============================================================================
// ready | Gets called when our bot is successfully logged in and connected.
//==============================================================================
bot.on('ready', () => {
  const guild = bot.guilds.array()[0];
  const channel = guild.channels.find('name', 'bot')

  console.log( `Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`)
  //channel.send(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`)

  bot.user.setActivity(`+help`)
})

//==============================================================================
// guildCreate | This event triggers when the bot joins a guild.
//==============================================================================
bot.on('guildCreate', guild => {
  bot.user.setActivity(`+help`)
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`)
})

//==============================================================================
// guildDelete | This event triggers when the bot is removed from a guild.
//==============================================================================
bot.on('guildDelete', guild => {
  bot.user.setActivity(`+help`)
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`)
})

//==============================================================================
// message | Event to listen to messages sent to the server where the bot is located
//==============================================================================
bot.on('message', async message => {
  // So the bot doesn't reply to iteself
	if(message.author.bot) return
  const botChannel = message.guild.channels.find('name', 'bot')

  var args = ''
  var command = ''

  if(message.channel != botChannel){
    // Ignore any message that does not start with our prefix,
    if(message.content.indexOf(prefix) !== 0) return
    args = message.content.slice(prefix.length).trim().split(/ +/g)
  	command = args.shift().toLowerCase()
  } else {
    args = message.content.trim().split(/ +/g)
    command = args.shift().toLowerCase()
  }

  console.log(command)
  console.log(args)

  switch(command) {
    case 'ping':
                    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
                		const m = await message.channel.send('Ping?')
                		m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`)
    break;
    case 'help':
                    for (var i = 0; i < args.length; i++) {
                      if (args[i] == 'adv') {
                        message.channel.send(file('help'))
                      }
                    }
    break;
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
  // Do nothing if the channel wasn't found on this server
  if (!channel) return

  console.log(`Welcome to the server, ${member.displayName}`)

  if(member.displayName.indexOf('discord.gg') > -1 || member.displayName.indexOf('add me') > -1 || member.displayName.indexOf('twitch.tv')) {
    member.guild.ban(member)
    console.log(`SPAM DECTECTED: ${member}`)
    const adminChannel = member.guild.channels.find('name', 'admin-chat')
    console.log(adminChannel)
    adminChannel.send(`SPAM DECTECTED: ${member}`)
  } else {
    channel.send(`Welcome ${member} to the discord server for Eden: Universe Builder! :D

Please wait for a <@&468233990642335745> or a <@&468233437115842560> to add you to the trusted members group!`)
  }
  //channel.send(`Welcome to the server, ${member}`)
})

//==============================================================================
// guildMemberRemove | Create an event listener for new guild members
//==============================================================================
bot.on('guildMemberRemove', member => {
  // Send the message to a designated channel on a server:
  //const channel = member.guild.channels.find('name', 'member-log')
  // Do nothing if the channel wasn't found on this server
  //if (!channel) return
  // Send the message, mentioning the member

  console.log(`We're sorry to see you leaving, ${member.displayName}`)
  if(member.displayName.indexOf('discord.gg') > -1 || member.displayName.indexOf('add me') > -1) {
    //member.guild.ban(member)
    //console.log(`SPAM DECTECTED: ${member}`)
    //const adminChannel = member.guild.channels.find('name', 'admin-chat')
    //console.log(adminChannel)
    //adminChannel.send(`SPAM DECTECTED: ${member}`)
  } else {
    const welcomeChannel = member.guild.channels.find('name', 'welcome')
    welcomeChannel.send(`We're sorry to see you leaving, ${member}`)
  }
  //channel.send(`Welcome to the server, ${member}`)
})


bot.login(config.token)
