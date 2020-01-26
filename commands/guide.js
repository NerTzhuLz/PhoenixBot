//If something needs to know the permissions for this command, it looks here
exports.permissions = (client) => {
    return perms = {
        botChannel: true,           //If true, bot only responds in bot channels
        adminBotChannel: false,     //If true, bot only responds in admin bot channels
        role: client.perms.user     //Last word specifies permission level needed to use this command
    }
}

//This code is run when the command is executed
exports.run = (client, message, args) => {
    const { Client, RichEmbed } = require('discord.js');
    
    const sendMessage = `Quick overview: 
- Use __+!addrelic *<relics>*__ in the bot channel to subscribe to relics.
- Use __+!create *<message>*__ in the recruiting channel to create a host message. Any relics you include will be tagged. Put "1/4" or similar for each squad you wish to create. 
- If you see a squad you'd like to join, get its ID (the bold number in curly braces next to the "1/4") and use __+!join *<ID>*__ in the recruiting channel.
    
Full guide (with screenshots) is available at: 
https://github.com/DarkPhoenix6853/PhoenixBot/blob/RelicBot/Guide.pdf 

Alternatively you can:
- Use ${client.baseConfig.prefix}help
- Ask a staff member or me (<@198269661320577024>, if I'm online)
- Check out the Readme on the Github page (More detailed, but less helpful): 
https://github.com/DarkPhoenix6853/PhoenixBot/blob/RelicBot/README.md`;

    const embed = new RichEmbed()
    .setTitle('Guide')
    .setColor(client.baseConfig.colour)
    .setDescription(sendMessage);

    message.channel.send(embed);
};