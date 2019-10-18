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
    client.lobbyDB.deleteAll();
    client.lobbyDB.set('nextLobby', 0);

    message.channel.send("Database has been purged");

};

//This code is run when the help command is used to get info about this command
exports.help = (client, message) => {
    message.channel.send(`Help for PurgeDB:
Completely eradicates the relic database. Not to be used lightly.
Also sets the lobby counter to 0, to avoid breaking things. 

Usage: ${client.baseConfig.prefix}PurgeDB`);
};
