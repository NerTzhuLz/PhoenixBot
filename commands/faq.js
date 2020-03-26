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

    const embed = new RichEmbed()
    .setTitle("FAQ")
    .setColor(client.baseConfig.colour)
    .setDescription(`Q - How do I sub to multiple relics at once? 
A - __+!addrelics axi a1 axi a2 lith n1__...

Q - How do I quickly host a squad?
A - __+!create Axi A1 1/4__ with whatever other text around it you want. The 1/4 (or 2/4 or 3/4) IS important if you want people to be able to join you.

Q - How do I join a squad I like? 
A - If you see a host message, there SHOULD be something like "1/4 {**5**}" where the bold 5 in curly brackets is a squad ID. 
Use __+!join 5__ to join that one.

Q - I have a long and complicated +!create command I want to use... will it work? 
A - Send it to me and I can give you some pointers, or some of the regulars are pretty good at checking them too if you put it in general.

Q - How do I recreate a squad that hasn't filled? 
A - Short answer - you can't. The best alternative would be to use __+!create__ with no new squads to ping people, and in the host message tell them to join your old squads.
e.g. You are hosting an Axi A1 run in squad 6, you could try __+!create H Axi A1 in squad 6, see a few messages ago__. This will ping anyone subbed to Axi A1, and tell them to go join squad 6.`);

    message.channel.send(embed);

};

//This code is run when "Help" is used to get info about this command
exports.help = (client, message) => {
    const { Client, RichEmbed } = require('discord.js');
    
    const helpMessage = `Displays frequently asked questions

Usage: ${client.baseConfig.prefix}FAQ`;

    const embed = new RichEmbed()
    .setTitle('Help for FAQ')
    .setColor(client.baseConfig.colour)
    .setDescription(helpMessage);

    message.channel.send(embed);
};