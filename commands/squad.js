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

    let squad = parseInt(args[0], 10).toString();
    
    if (!(squad < 100 && squad >= 0)) {
        const embed = new RichEmbed()
        .setTitle(`Bad squad`)
        .setColor(client.baseConfig.colour)
        .setDescription("Please enter a valid squad ID");

        message.channel.send(embed);        
        return;
    }

    if (!client.lobbyDB.has(squad)) {
        const embed = new RichEmbed()
        .setTitle(`Squad doesn't exist`)
        .setColor(client.baseConfig.colour)
        .setDescription(`Squad does not exist`);

        message.channel.send(embed);
        return;
    }

    let thisSquad = client.lobbyDB.get(squad);

    if (!thisSquad.open && thisSquad.playerCount < 4) {
        const embed = new RichEmbed()
        .setTitle(`Squad closed`)
        .setColor(client.baseConfig.colour)
        .setDescription(`Squad ${squad} has been closed`);

        message.channel.send(embed);
        return;
    }

    hostName = `<@${thisSquad.hostID}>`;

    let playerNames = [];

    for (let memberID of thisSquad.joinedIDs) {
        playerNames.push(`<@${memberID}> `);
    }

    if (playerNames.length == 0) {
        playerNames = "(None)";
    }

    const recruitChannel = client.channels.get(client.channelConfig.recruitChannel.toString());
    const url = recruitChannel.fetchMessage(thisSquad.messageID)
    .then((msg) => {
        const url = msg.url;
        const sendMessage = `Current player count: ${thisSquad.playerCount}
Hosted by: ${hostName}
Current players: ${playerNames}
[Click here to go to host message](${url})`;

        const embed = new RichEmbed()
        .setTitle(`Squad info for squad ${squad}:`)
        .setColor(client.baseConfig.colour)
        .setDescription(sendMessage);

        message.channel.send(embed);
    });
};

//This code is run when "Help" is used to get info about this command
exports.help = (client, message) => {
    const { Client, RichEmbed } = require('discord.js');
    
    const helpMessage = `Displays information about one squad.

Usage: ${client.baseConfig.prefix}squad <ID>`;

    const embed = new RichEmbed()
    .setTitle('Help for Squad')
    .setColor(client.baseConfig.colour)
    .setDescription(helpMessage);

    message.channel.send(embed);
};