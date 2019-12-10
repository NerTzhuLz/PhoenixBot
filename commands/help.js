exports.permissions = (client) => {
    return perms = {
        botChannel: true,
        adminBotChannel: false,
        role: client.perms.user
    }
}

exports.run = (client, message, args) => {

    //check for args
    if (args.length < 1 || args == undefined) {
        let sendString = `Prefix: ${client.baseConfig.prefix}\nUse ${client.baseConfig.prefix}guide for a user guide.\n\nCommand list: \n`;

        //calculate the user's privs
        const libFunc = require('../lib/getUserPrivs');
        const userPrivs = libFunc.run(message, client);
        
        let commandKeys = client.commands.keyArray();
        let firstCommand = 1;
        const isAdminBotChannel = client.channelConfig.adminBotChannels.includes(message.channel.id);
        //loop through perms
        for (var perm in client.perms) {
            perm = client.perms[perm];
            //perm.privs, perm.name
            if (userPrivs >= perm.privs) {
                //display commands at this level
                
                //get an object of all commands at this level, if not empty print things
                firstCommand = 1;
                for (var i = 0; i < commandKeys.length; i++) {
                    commandKey = commandKeys[i];
                    command = client.commands.get(commandKey);

                    if (command.permissions(client).role.privs == perm.privs) {
                        //if admin bot channel restricted, check that we're in an admin bot channel
                        const reqAdminBotChannel = command.permissions(client).adminBotChannel;
                        
                        if ((!reqAdminBotChannel || (reqAdminBotChannel && isAdminBotChannel)) && command.help) {
                            if (firstCommand) {
                                sendString = sendString + "--Commands for level: "+ perm.name + "--\n";
                                firstCommand = 0;
                            }
                            if (["create", "close", "join", "leave", "addplayer", "removeplayer"].includes(commandKey)) {
                                sendString += '-';
                            }
                            
                            sendString = sendString + "    "+ commandKey + "\n";
                            
                        }
                    }
                }
            }
        }

        if (!isAdminBotChannel && userPrivs >= client.perms['mod'].privs) {
            sendString = sendString + "\nSince you're staff you may have additional commands available in the admin bot channel\n"
        }

        sendString = sendString + `\nCommands with a '-' can only be used in Recruiting. \n\nUse ${client.baseConfig.prefix}help <command name> to get more information.\n(e.g. ${client.baseConfig.prefix}help ping)`;
        
        message.channel.send(sendString);
    } else {
        const commandName = args[0].toLowerCase();
        const cmd = client.commands.get(commandName);
        const isAdminBotChannel = client.channelConfig.adminBotChannels.includes(message.channel.id);
        const reqAdminBotChannel = cmd.permissions(client).adminBotChannel;
        if (!cmd) {
            message.channel.send("Command not found");
            return;
        }
        if (!reqAdminBotChannel || (reqAdminBotChannel && isAdminBotChannel)) {
            if (cmd.help) {
                cmd.help(client, message);
            } else {
                message.channel.send("Oops, that command exists but doesn't have help info yet. Harrass the devs.\n(Please don't actually)")
            }
        } else {
            message.reply("That command is only available in the Admin bot channel.");
            message.delete();
        }
        
    }
};

exports.help = (client, message) => {
    message.channel.send(`Help for help:
Can display a list of all available commands, or additional help for a specific command.

Command list usage: ${client.baseConfig.prefix}help
Info usage: ${client.baseConfig.prefix}help <command name>`);
};
