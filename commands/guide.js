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
    message.channel.send(`Sorry, haven't finished this yet. If you need more information about how to use a command you can: 
- Use ${client.baseConfig.prefix}help
- Ask a staff member or me (DarkPhoenix6853, if I'm online)
- Check out the Readme on the Github page (slightly more detailed information): 
https://github.com/DarkPhoenix6853/PhoenixBot/blob/RelicBot/README.md`);

};

//This code is run when "Help" is used to get info about this command
exports.help = (client, message) => {
    message.channel.send(`Help for Guide:
Provides a link to a user guide for this bot.

Usage: ${client.baseConfig.prefix}Guide`);
};