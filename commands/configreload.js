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

    delete require.cache[require.resolve(`../config/baseConfig.json`)];
    delete require.cache[require.resolve(`../config/permsConfig.json`)];
    delete require.cache[require.resolve(`../config/channelConfig.json`)];
    delete require.cache[require.resolve(`../config/ignore/identity.json`)];

    client.config.delete('baseConfig');
    client.config.delete('perms');
    client.config.delete('channelConfig');
    client.config.delete('identity');

    const baseConfig = require("../config/baseConfig.json");
    const baseConfig = require("../config/permsConfig.json");
    const baseConfig = require("../config/channelConfig.json");
    const baseConfig = require("../config/ignore/identity.json");

    //attach config files to client so commands can see them
    client.config.set('baseConfig', baseConfig);
    client.config.set('identity', identity);
    client.config.set('perms', perms);
    client.config.set('channelConfig', channelConfig);

    message.channel.send("Config reloaded");

};