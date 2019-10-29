//If something needs to know the permissions for this command, it looks here
exports.permissions = (client) => {
    return perms = {
        botChannel: false,           //If true, bot only responds in bot channels
        adminBotChannel: false,     //If true, bot only responds in admin bot channels
        role: client.perms.user     //Last word specifies permission level needed to use this command
    }
}

//This code is run when the command is executed
exports.run = (client, message, args) => {
    //code to run goes here
    const fs = require('fs');

    const enmapArray = client.lobbyDB.array();

    fs.writeFile("./lobbyDump.json", JSON.stringify(enmapArray,null,4), (err) => console.error);

};

//This code is run when "Help" is used to get info about this command
exports.help = (client, message) => {
    message.channel.send(`Help for CommandName:
(Text here)

Usage: ${client.baseConfig.prefix}CommandName`);
};

