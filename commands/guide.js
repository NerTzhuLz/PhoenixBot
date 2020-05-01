//If something needs to know the permissions for this command, it looks here
exports.permissions = (client) => {
    return perms = {
        botChannel: true,           //If true, bot only responds in bot channels
        adminBotChannel: false,     //If true, bot only responds in admin bot channels
        role: client.config.get('perms').user     //Last word specifies permission level needed to use this command
    }
}

//This code is run when the command is executed
exports.run = (client, message, args) => {
    const { Client, RichEmbed } = require('discord.js');
    
    const sendMessage = `Quick overview: 
- Use __${client.config.get('baseConfig').prefix}help__ for a list of commands, or __${client.config.get('baseConfig').prefix}help *<command>*__ to see help for a specific command. 
- There's also a small FAQ (in progress) at __${client.config.get('baseConfig').prefix}faq__

- Use __${client.config.get('baseConfig').prefix}addrelic *<relics>*__ in the bot channel to subscribe to relics. You can add multiple relics with one command. (Also useful: __${client.config.get('baseConfig').prefix}removerelic__ and __${client.config.get('baseConfig').prefix}listrelics__)
- Use __${client.config.get('baseConfig').prefix}create *<message>*__ in the recruiting channel to create a host message. Any relics you include will be tagged. Put "1/4" or similar for each squad you wish to create. 
- If you see a squad you'd like to join, get its ID (the bold number in curly braces after the "1/4") and use __${client.config.get('baseConfig').prefix}join *<ID>*__ in the recruiting channel. (Also useful: __${client.config.get('baseConfig').prefix}leave__ and __${client.config.get('baseConfig').prefix}close__)

Full guide (with screenshots) is available at: 
https://github.com/DarkPhoenix6853/PhoenixBot/blob/RelicBot/Guide.pdf 

Alternatively you can:
- Ask a staff member or me (<@198269661320577024>, if I'm online)
- Check out the Readme on the Github page (More detailed, but less helpful): 
https://github.com/DarkPhoenix6853/PhoenixBot/blob/RelicBot/README.md`;

    const embed = new RichEmbed()
    .setTitle('Guide')
    .setColor(client.config.get('baseConfig').colour)
    .setDescription(sendMessage);

    message.channel.send(embed);
};