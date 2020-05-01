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

    const embed = new RichEmbed()
    .setTitle("RelicBot programmed by DarkPhoenix6853")
    .setColor(client.config.get('baseConfig').colour)
    .setDescription(`Thanks to: 

* Shuti/MamaWisp
* JaxDobba
* TheLostGuthix
* GlowingDiamond
* Yellow Flash/Jackalope33 - The only one who managed to completely break it
* Dradon
* Dimon222
* BusyHoneyBadger

For assisting with debug, troubleshooting and generally helping out`);

    message.channel.send(embed);

};

