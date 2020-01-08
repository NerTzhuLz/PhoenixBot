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
    
    const sendMessage = `Basic guide is available at: 
https://github.com/DarkPhoenix6853/PhoenixBot/blob/RelicBot/Guide.pdf 

Alternatively you can:
- Use ${client.baseConfig.prefix}help
- Ask a staff member or me (DarkPhoenix6853, if I'm online)
- Check out the Readme on the Github page (More detailed, but less helpful): 
https://github.com/DarkPhoenix6853/PhoenixBot/blob/RelicBot/README.md`;

    const embed = new RichEmbed()
    .setTitle('Guide')
    .setColor(client.baseConfig.colour)
    .setDescription(sendMessage);

    message.channel.send(embed);
};