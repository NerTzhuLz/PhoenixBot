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

    message.channel.send(`Attempting to remove '${inString}' (Will only work if it exists)`);
    client.DBEnmap.delete(inString);
};

//This code is run when the help command is used to get info about this command
exports.help = (client, message) => {
    message.channel.send(`Help for DeleteRelic:
Deletes a relic and record of its subscribed users from the database

Usage: ${client.baseConfig.prefix}DeleteRelic <relic name>`);
};

