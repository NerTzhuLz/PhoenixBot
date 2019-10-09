//If something needs to know the permissions for this command, it looks here
exports.permissions = (client) => {
    return perms = {
        botChannel: true,           //If true, bot only responds in bot channels
        adminBotChannel: true,     //If true, bot only responds in admin bot channels
        role: client.perms.dev     //Last word specifies permission level needed to use this command
    }
}

//This code is run when the command is executed
exports.run = (client, message, args) => {
    
    client.DBEnmap.deleteAll();

    message.channel.send("Database has been purged");

};

//This code is run when the help command is used to get info about this command
exports.help = (client, message) => {
    message.channel.send(`Help for PurgeDB:
Completely eradicates the relic database. Not to be used lightly.

Usage: ${client.baseConfig.prefix}PurgeDB`);
};
