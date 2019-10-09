//If something needs to know the permissions for this command, it looks here
exports.permissions = (client) => {
    return perms = {
        botChannel: true,           //If true, bot only responds in bot channels
        adminBotChannel: false,     //If true, bot only responds in admin bot channels
        role: client.perms.user     //Last word specifies permission level needed to use this command
    }
}

//This code is run when the command is executed
exports.run = (client, message, args) => {
    message.channel.send("pong!");
};

//This code is run when the help command is used to get info about this command
exports.help = (client, message) => {
    message.channel.send(`Help for Ping:
Checks if the bot is awake. Not much else.

Usage: ${client.baseConfig.prefix}ping`);
};

