//If something needs to know the permissions for this command, it looks here
exports.permissions = (client) => {
    return perms = {
        botChannel: true,           //If true, bot only responds in bot channels
        adminBotChannel: true,     //If true, bot only responds in admin bot channels
        role: client.perms.admin     //Last word specifies permission level needed to use this command
    }
}

//This code is run when the command is executed
exports.run = (client, message, args) => {
    if (args.length < 1) {
        message.channel.send(`Requires a relic name.`);
        return;
    };
    let inString = args.join(" ");

    let users = client.DBEnmap.get(inString);
    message.channel.send(`List of users subscribed to '${inString}':\n ${users}`);
};

//This code is run when the help command is used to get info about this command
exports.help = (client, message) => {
    message.channel.send(`Help for RelicUsers:
Lists the users subscribed to a relic.   

Usage: ${client.baseConfig.prefix}RelicUsers <relic name>`);
};

