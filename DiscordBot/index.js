
// Import the discord.js module
const Discord = require('discord.js')

// Create an instance of Discord that we will use to control the bot
const bot = new Discord.Client();

const config = require('./config.json');

const prefix = '+'

// Gets called when our bot is successfully logged in and connected
bot.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `bot.user` is what the
  // docs refer to as the "ClientUser".
  bot.user.setActivity(`+help`);
});

bot.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  bot.user.setActivity(`+help`);
});

bot.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  bot.user.setActivity(`+help`);
});

// Event to listen to messages sent to the server where the bot is located
bot.on("message", async message => {
  // So the bot doesn't reply to iteself
	if(message.author.bot) return;

	// Also good practice to ignore any message that does not start with our prefix,
	if(message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

  console.log(command)

	if(command === "ping") {
		// Calculates ping between sending a message and editing it, giving a nice round-trip latency.
		// The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
		const m = await message.channel.send("Ping?");
		m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
	}

	if(command === "help") {
		message.channel.send(`**Commands**
		+help
		+ping`);
	}
});

// Create an event listener for new guild members
bot.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  //const channel = member.guild.channels.find('name', 'member-log');
  // Do nothing if the channel wasn't found on this server
  //if (!channel) return;
  // Send the message, mentioning the member

  console.log(`Welcome to the server, ${member.displayName}`)
  if(member.displayName.indexOf("discord.gg") > -1 || member.displayName.indexOf("add me") > -1 || member.displayName.indexOf("twitch.tv")) {
    member.guild.ban(member)
    console.log(`SPAM DECTECTED: ${member}`)
    const adminChannel = member.guild.channels.find('name', 'admin-chat');
    console.log(adminChannel);
    adminChannel.send(`SPAM DECTECTED: ${member}`);
  } else {
    const welcomeChannel = member.guild.channels.find('name', 'welcome');
    welcomeChannel.send(`Welcome ${member} to the discord server for Eden: Universe Builder! :D

Please wait for a <@&468233990642335745> or a <@&468233437115842560> to add you to the trusted members group!`);
  }
  //channel.send(`Welcome to the server, ${member}`);
});

// Create an event listener for new guild members
bot.on('guildMemberRemove', member => {
  // Send the message to a designated channel on a server:
  //const channel = member.guild.channels.find('name', 'member-log');
  // Do nothing if the channel wasn't found on this server
  //if (!channel) return;
  // Send the message, mentioning the member

  console.log(`We're sorry to see you leaving, ${member.displayName}`)
  if(member.displayName.indexOf("discord.gg") > -1 || member.displayName.indexOf("add me") > -1) {
    //member.guild.ban(member)
    //console.log(`SPAM DECTECTED: ${member}`)
    //const adminChannel = member.guild.channels.find('name', 'admin-chat');
    //console.log(adminChannel);
    //adminChannel.send(`SPAM DECTECTED: ${member}`);
  } else {
    const welcomeChannel = member.guild.channels.find('name', 'welcome');
    welcomeChannel.send(`We're sorry to see you leaving, ${member}`);
  }
  //channel.send(`Welcome to the server, ${member}`);
});


bot.login(config.token);
