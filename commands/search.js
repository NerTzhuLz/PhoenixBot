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
    //Check if argument provided
    if (args.length == 0) {
        //Check if relic
        //Check if vaulted
        //let results = relicSearch
        //displayResults
    } else {
        //playerSearch
    }
};

let Result = function (message, squadID) {
    this.message = message;
    this.squadID = squadID;
}

function relicSearch(client, relic) {
    let results = [];
    //for every squad
    for (let i = 0; i < client.config.get('baseConfig').maxSquads; i++) {
        index = i.toString();

        //check if exists and open
        if (!client.lobbyDB.has(index)) continue;
        let currentSquad = client.lobbyDB.get(index);
        if (!currentSquad.open) continue;

        //if content contains relic
        if (currentSquad.messageContent.includes(relic)) {
            //find the squad message
            const channelID = client.config.get('channelConfig').recruitChannel;
            const messageID = currentSquad.messageID;

            const channel = client.channels.get(channelID);
            let notFound = false;

            let squadMessage = await channel.fetchMessage(messageID)
            .catch(() => {
                notFound = true;
            })

            //if it's deleted, just ignore it
            if (notFound) continue;

            //add to results
            results.push(new Result(squadMessage, currentSquad.lobbyID));
        }
    }
        
    return {"relic": relic, "results": results};
}

function playerSearch(client, channel, playerID) {
    //find each relic the player has
    //make a result array
    //for each relic, result = relicSearch
    //if results, push to result array
}

function displayResults(channel, results) {
    //passed an array of objects
    //objects have "relic": relic name, "results": array of Result
}

//This code is run when "Help" is used to get info about this command
exports.help = (client, message) => {
    const { RichEmbed } = require('discord.js');
    
    const helpMessage = `Finds all open squads that contain a relic you're subscribed to. 
Alternatively, searches for all open squads that contain a certain relic. 

Usage: ${client.config.get('baseConfig').prefix}Search
or ${client.config.get('baseConfig').prefix}Search <relic>`;

    const embed = new RichEmbed()
    .setTitle('Help for Search')
    .setColor(client.config.get('baseConfig').colour)
    .setDescription(helpMessage);

    message.channel.send(embed);
};