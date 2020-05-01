exports.permissions = (client) => {
    return perms = {
        botChannel: true,
        adminBotChannel: true,
        role: client.config.get('perms').dev
    }
}

exports.run = (client, message, args) => {
    const fs = require('fs');

    //check if a command name has been given
    if(!args || args.length < 1) return message.reply("Must provide a command name to load.");
    const commandName = args[0];

    //check if the command exists
    if(client.commands.has(commandName)) {
        return message.reply("That command already exists. Are you trying to use Reload?");
    }

    fs.access(`./commands/${commandName}.js`, fs.F_OK, (err) => {
        if (err) {
            message.reply("Something went wrong loading the file. Maybe you typed the command name incorrectly?");
            console.error(err);
            return;
        }

        console.log(`Loading ${commandName}, authorised by ${message.author.username}`);
        const props = require(`./${commandName}.js`);
        client.commands.set(commandName, props);
        message.reply(`The command ${commandName} has been loaded`);
    });
};

exports.help = (client, message) => {
    const { Client, RichEmbed } = require('discord.js');
    
    const helpMessage = `Loads a new command from file. If you want to update an existing command instead, use ${client.config.get('baseConfig').prefix}reload.

Usage: ${client.config.get('baseConfig').prefix}load {filename}

Make sure the file is in the correct location.`;

    const embed = new RichEmbed()
    .setTitle('Help for Load')
    .setColor(client.config.get('baseConfig').colour)
    .setDescription(helpMessage);

    message.channel.send(embed);
};