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

    let user = message.author;
    let memberName = message.guild.member(message.author).displayName;

    message.channel.send(`Subscribing user ${memberName} to relic: '${inString}'`);
    client.DBEnmap.push(inString, user.id);
};

//This code is run when the help command is used to get info about this command
exports.help = (client, message) => {
    message.channel.send(`Help for AddRelic:
Subscribes you to a relic that you want to receive notifications for.  

Usage: ${client.baseConfig.prefix}AddRelic <relic name>`);
};

