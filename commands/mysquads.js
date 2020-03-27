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

    //get all squads
    const squads = client.lobbyDB.array().filter(entry => Object.keys(entry).includes("hostID"));

    //filter to squads we're a part of
    const mySquads = squads.filter(squad => squad.joinedIDs.includes(message.author.id) || squad.hostID == message.author.id);
    
    let hosted = [];
    let joined = [];
    let full = [];
    let fullHosted = [];
    //let closed = [];

    for (let squad of mySquads) {
        //get closed squads first 
        if (!squad.open) {
            //don't care about closed squads, ignore them
            //closed.push(squad.lobbyID);
        } else if(squad.playerCount == 4 && squad.hostID == message.author.id) {
            fullHosted.push(squad.lobbyID);
        } else if (squad.playerCount == 4) {
            full.push(squad.lobbyID);
        } else if (squad.hostID == message.author.id) {
            hosted.push(squad.lobbyID);
        } else {
            joined.push(squad.lobbyID);
        }
    }

    //if no results left, send error
    if (hosted.length + joined.length + full.length == 0) {
        const embed = new RichEmbed()
        .setTitle('MySquads - None found')
        .setColor(client.baseConfig.colour)
        .setDescription("No hosted, joined or full squads found.");

        message.channel.send(embed);
        return;
    }

    //send results for each category, if any exist
    let sendMessage = "";

    if (hosted.length != 0) {
        sendMessage += "Hosted, not filled: " + hosted.join(", ") + "\n";
    }
    if (fullHosted.length != 0) {
        sendMessage += "Hosted, filled: " + fullHosted.join(", ") + "\n";
    }
    if (joined.length != 0) {
        sendMessage += "Joined: " + joined.join(", ") + "\n";
    }
    if (full.length != 0) {
        sendMessage += "Filled: " + full.join(", ") + "\n";
    }

    const embed = new RichEmbed()
    .setTitle('List of your squads:')
    .setColor(client.baseConfig.colour)
    .setDescription(sendMessage);

    message.channel.send(embed);

};

//This code is run when "Help" is used to get info about this command
exports.help = (client, message) => {
    const { Client, RichEmbed } = require('discord.js');
    
    const helpMessage = `Lists all existing squads that you have joined or hosted

Usage: ${client.baseConfig.prefix}MySquads`;

    const embed = new RichEmbed()
    .setTitle('Help for MySquads')
    .setColor(client.baseConfig.colour)
    .setDescription(helpMessage);

    message.channel.send(embed);
};