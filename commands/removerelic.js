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
    if (args.length < 1) {
        message.channel.send(`Requires a relic name.`);
        return;
    };
    let inString = args.join(" ");

    message.channel.send(`Unsubscribing from relic: '${inString}'`);
    client.DBEnmap.remove(inString, message.author);
};

//This code is run when the help command is used to get info about this command
exports.help = (client, message) => {
    message.channel.send(`Help for RemoveRelic:
Unsubscribes you from a relic that you no longer want to receive notifications for.  

Usage: ${client.baseConfig.prefix}RemoveRelic <relic name>`);
};

