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

    for (let squad of mySquads) {
        //get full squads first (they are already closed, doesn't matter if we are host or join)
        if (squad.playerCount == 4) {
            full.push(squad.lobbyID);
        } 

        //ignore closed squads from here
        if (squad.open) {
            if (squad.hostID == message.author.id) {
                hosted.push(squad.lobbyID);
            } else {
                joined.push(squad.lobbyID);
            }
        } 
    }

    //if no results left, send error
    if (hosted.length + joined.length + full.length == 0) {
        message.channel.send("No hosted, joined or full squads found. Does not include closed squads.");
        return;
    }

    //send results for each category, if any exist
    let sendMessage = "Your squads:\n";

    if (hosted.length != 0) {
        sendMessage += "Hosted squads: " + hosted.join(", ") + "\n";
    }
    if (joined.length != 0) {
        sendMessage += "Joined squads: " + joined.join(", ") + "\n";
    }
    if (full.length != 0) {
        sendMessage += "Full squads: " + full.join(", ") + "\n";
    }

    const embed = new RichEmbed()
    .setTitle('MySquads')
    .setColor(client.baseConfig.colour)
    .setDescription(sendMessage);

    message.channel.send(embed);

};

//This code is run when "Help" is used to get info about this command
exports.help = (client, message) => {
    message.channel.send(`Help for MySquads:
Lists all existing squads that you have joined or hosted

Usage: ${client.baseConfig.prefix}MySquads`);
};