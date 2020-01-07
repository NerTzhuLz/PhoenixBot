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
    
    const sendMessage = `**Commands:**
AddPlayer
AddRelic
Close
Create
CreateRelic
DeleteRelic
Join
Leave
ListRelics
Load
MyRelics
MySquads
RelicUsers
RemovePlayer
RemoveRelic
Squad

**Features**
DB removal when player leaves server
Command restriction (Bot spam stays in bot spam, recruiting stays in recruiting, neither in general chat)
Permissions (Admin commands for admins only)

**General:**
Grammar/spelling
Make sure Help is helpful for every command
Proofreading on the Guide
Missing errors - If a command fails (but doesn't crash the bot) it needs to tell you why
All bot messages of more than 1 sentence/line should be sent in embeds - let me know if I've missed any
`;

    const embed = new RichEmbed()
    .setTitle('Things left to test:')
    .setColor(client.baseConfig.colour)
    .setDescription(sendMessage);

    message.channel.send(embed);

};