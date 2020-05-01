//If something needs to know the permissions for this command, it looks here
exports.permissions = (client) => {
    return perms = {
        botChannel: false,           //If true, bot only responds in bot channels
        adminBotChannel: false,     //If true, bot only responds in admin bot channels
        role: client.config.get('perms').user     //Last word specifies permission level needed to use this command
    }
}

//This code is run when the command is executed
exports.run = async (client, message, args) => {
    const baseConfig = require("../config/baseConfig.json");
    const identity = require("../config/ignore/identity.json");
    const perms = require("../config/permsConfig.json");
    const channelConfig = require("../config/channelConfig.json");

    //attach config files to client so commands can see them
    client.config.set('baseConfig') = baseConfig;
    client.config.set('identity') = identity;
    client.config.set('perms') = perms;
    client.config.set('channelConfig') = channelConfig;

    console.log(client.config.get('baseConfig'));

};