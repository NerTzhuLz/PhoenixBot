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
        message.channel.send(`Requires a relic name. See ${client.baseConfig.prefix}help CreateRelic`);
        return;
    };
    let inString = args.join(" ");

    message.channel.send(`Adding relic named '${inString}'`);
    client.DBEnmap.set(inString, []);
};

//This code is run when the help command is used to get info about this command
exports.help = (client, message) => {
    message.channel.send(`Help for CreateRelic:
Add a newly vaulted relic to the list of relics users can subscribe to. 
RELIC NAME MUST BE FORMATTED CORRECTLY, AS SHOWN IN EXAMPLE. 

Usage: ${client.baseConfig.prefix}CreateRelic <relic name>
e.g. ${client.baseConfig.prefix}CreateRelic Axi E1`);
};

