exports.permissions = (client) => {
    return perms = {
        botChannel: true,
        adminBotChannel: false,
        role: client.config.get('perms').user
    }
}

exports.run = (client, message, args) => {
    const { Client, RichEmbed } = require('discord.js');

    //check for args
    if (args.length < 1 || args == undefined) {

        let recruitChannelCmds = ["create", "close", "join", "leave", "addplayer", "removeplayer", "kick"];
        let sendMessage = `Prefix: ${client.config.get('baseConfig').prefix}\nUse **${client.config.get('baseConfig').prefix}guide** for a user guide.\n\nCommand list by permission level:`;

        //calculate the user's privs
        const libFunc = require('../lib/getUserPrivs');
        const userPrivs = libFunc.run(message, client);
        
        let commandKeys = client.commands.keyArray();
        let firstCommand = 1;
        const isAdminBotChannel = client.config.get('channelConfig').adminBotChannels.includes(message.channel.id);
        //loop through perms
        for (var perm in client.config.get('perms')) {
            perm = client.config.get('perms')[perm];
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
                                if (perm.name == 'user') {
                                    perm.name = 'user - Bot channels'
                                }
                                sendMessage = sendMessage + "\n"+ capitaliseFirst(perm.name) + ":\n";
                                firstCommand = 0;
                            }
                            if (!recruitChannelCmds.includes(commandKey)) {
                                if (commandKey == "addrelic" || commandKey == "removerelic") {
                                    sendMessage += " " + commandKey + "s\n";
                                } else {
                                    sendMessage += " " + commandKey + "\n";
                                }
                            }                         
                        }
                    }
                }
            }
        }

        sendMessage += "\nUser - Recruitment channel:\n";
        for (var cmd of recruitChannelCmds) {
            sendMessage += " " + cmd + "\n";
        }

        if (!isAdminBotChannel && userPrivs >= client.config.get('perms')['mod'].privs) {
            sendMessage = sendMessage + "\nSince you're staff (or a dev) you may have additional commands available in the admin bot channel\n"
        }

        sendMessage = sendMessage + `\nUse **${client.config.get('baseConfig').prefix}help <command name>** to get more information on that command.\n(e.g. **${client.config.get('baseConfig').prefix}help ping**)
Feel free to send any suggestions/feedback to me (<@198269661320577024>)`;
        
        const embed = new RichEmbed()
        .setTitle('Help - Command List')
        .setColor(client.config.get('baseConfig').colour)
        .setDescription(sendMessage);

        message.channel.send(embed);
    } else {
        const commandName = args[0].toLowerCase();
        const cmd = client.commands.get(commandName);
        const isAdminBotChannel = client.config.get('channelConfig').adminBotChannels.includes(message.channel.id);
        let sendMessage = "";

        if (!cmd) {
            sendMessage = `Command not found - ${commandName}`;
            const embed = new RichEmbed()
            .setTitle('Help - Error')
            .setColor(client.config.get('baseConfig').colour)
            .setDescription(sendMessage);

            message.channel.send(embed);
            return;
        }
        const reqAdminBotChannel = cmd.permissions(client).adminBotChannel;

        if (!reqAdminBotChannel || (reqAdminBotChannel && isAdminBotChannel)) {
            if (cmd.help) {
                cmd.help(client, message);
            } else {
                sendMessage = "Oops, that command exists but doesn't have help info yet. Harrass the devs.\n(Please don't actually)";
            }
        } else {
            message.reply("That command is only available in the Admin bot channel.")
            .then((msg) => {
                msg.delete(5000);
            });
            message.delete();
        }
        if (sendMessage != "") {
            const embed = new RichEmbed()
            .setTitle('Help - Error')
            .setColor(client.config.get('baseConfig').colour)
            .setDescription(sendMessage);

            message.channel.send(embed);
        }
    }
};

function capitaliseFirst(lower) {
    return lower.charAt(0).toUpperCase() + lower.substring(1);
}

exports.help = (client, message) => {
    const { Client, RichEmbed } = require('discord.js');
    
    const helpMessage = `Can display a list of all available commands, or additional help for a specific command.

Command list usage: ${client.config.get('baseConfig').prefix}help
Info usage: ${client.config.get('baseConfig').prefix}help <command name>`;

    const embed = new RichEmbed()
    .setTitle('Help for Help')
    .setColor(client.config.get('baseConfig').colour)
    .setDescription(helpMessage);

    message.channel.send(embed);
};
