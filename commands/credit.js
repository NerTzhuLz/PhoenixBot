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
    const { Client, RichEmbed } = require('discord.js');

    const embed = new RichEmbed()
    .setTitle("Credits")
    .setColor(client.baseConfig.colour)
    .setDescription(`RelicBot programmed by DarkPhoenix6853
    
Thanks to: 
    
For helping debug, troubleshoot and otherwise help out`);

    message.channel.send(embed);

};

