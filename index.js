
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


bot.login(config.token);
