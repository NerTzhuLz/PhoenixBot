exports.onMessage = (client, message) => {
    //triggers on every non-bot message
    if (message.isMemberMentioned(client.user) && message.content.includes("core")) {
        message.channel.send(`Current core: ${client.identity.name} with prefix ${client.baseConfig.prefix}`);
    } else if (message.isMemberMentioned(client.user) && message.content.includes("help")) {
        message.channel.send(`Current prefix ${client.baseConfig.prefix}`);
    }

}

exports.commandHandler = (client, message) => {
    //have already checked for the prefix
    //split the message into arguments
    const args = message.content.slice(client.baseConfig.prefix.length).trim().split(/ +/g);
    //make sure it's lower case
    const command = args.shift().toLowerCase();

    // Grab the command data from the client.commands Enmap
    const cmd = client.commands.get(command);

    //check if the command exists
    if (!cmd) {
        message.channel.send("Command not found - Make sure you put a space after it");
        return;
    }
    //check if the command has a "run" function
    if (!cmd.run) {
        message.channel.send("Command exists but is not coded properly - contact the devs");
        return;
    }
    //check if the command has permissions
    if (!cmd.permissions) {
        message.channel.send('Something\'s wrong with the command permissions');
        return;
    }

    //get the permissions config
    const perms = cmd.permissions(client);
    //see if this command must be used in bot channels
    const botChannel = perms.botChannel;
    const adminBotChannel = perms.adminBotChannel;
    //get a list of bot channels on the server
    const botChannels = client.channelConfig.botChannels;
    const adminBotChannels = client.channelConfig.adminBotChannels;

    //Check if this command is allowed here
    //otherwise make sure we're in any bot channel
    if (botChannel && !botChannels.includes(message.channel.id) && !adminBotChannels.includes(message.channel.id)) return;

    //calculate the user's privs
    const commandPrivs = perms.role.privs;
    const libFunc = require('../lib/getUserPrivs');
    const userPrivs = libFunc.run(message, client);
    //compare to command
    if (userPrivs < commandPrivs) {
        message.channel.send(`Sorry, you don't have permission to use this command. You need at least a ${perms.role.name}-level role to use ${command}` );
        return;
    } else {

        //if it needs an admin channel, make sure we're in an admin channel
        if (adminBotChannel && !adminBotChannels.includes(message.channel.id)) {
            message.reply('Use the admin channel for that command');
            message.delete();
            return;
        }

        cmd.run(client, message, args);
    }
};