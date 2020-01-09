exports.onMessage = (client, message) => {
    //triggers on every non-bot message
    if (message.isMemberMentioned(client.user) && message.content.includes("core")) {
        message.channel.send(`Current core: ${client.identity.name} with prefix ${client.baseConfig.prefix}`);
    } else if (message.isMemberMentioned(client.user) && (message.content.includes("help") || message.content.includes("prefix"))) {
        message.channel.send(`Current prefix: ${client.baseConfig.prefix}`);
    }

}

exports.commandHandler = (client, message) => {
    //have already checked for the prefix
    //split the message into arguments
    const args = message.content.slice(client.baseConfig.prefix.length).trim().split(/ +/g);
    //make sure it's lower case
    const command = args.shift().toLowerCase();

    // Grab the command data from the client.commands Enmap
    let cmd = client.commands.get(command);

    //check if the command exists
    if (!cmd) {
        const pluralCommands = ["addplayers", "addrelics", "createrelics", "deleterelics", "removeplayers", "removerelics"];
        if (pluralCommands.includes(command)) {
            cmd = client.commands.get(command.substring(0,command.length-1));
        } else {
                message.channel.send("Command not found, or you didn't put a space between the command and its information")
            .then((msg) => {
                if (client.channelConfig.recruitChannel == message.channel.id) {
                    //msg.delete(10000);
                }
                
            });

            if (client.channelConfig.recruitChannel == message.channel.id) {
                //message.delete();
            }
            
            return;
        }
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
    if (botChannel && !botChannels.includes(message.channel.id) && !adminBotChannels.includes(message.channel.id)) {
        message.reply('You must use this in a bot channel.')
        .then((msg) => {
            //message.delete();
            //msg.delete(5000);
        });
        return;
    }

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
            message.reply('Use the admin channel for that command')
            .then((msg) => {
                message.delete();
                msg.delete(5000);
            });
            return;
        }

        cmd.run(client, message, args);
    }
};