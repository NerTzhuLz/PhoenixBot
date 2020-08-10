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
    if (args.length > 0) {
        //-----Check if relic (and format correctly)-----
        //-----Check if vaulted-----
        let relic = args.join(" ");

        //find open squads with this relic
        relicSearch(client, relic)
        .then(output => {
            //display the result
            let resultArray = [];
            resultArray.push(output);
            displayResults(client, message.channel, resultArray);
        })

    } else {
        playerSearch(client, message.channel, message.author.id);
    }
};

let Result = function (messageURL, messageContent, squadID) {
    this.messageURL = messageURL;
    this.messageContent = messageContent;
    this.squadID = squadID;
}

async function relicSearch(client, relic) {
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
            results.push(new Result(squadMessage.url, currentSquad.messageContent, currentSquad.lobbyID));
        }
    }
        
    return {"relicName": relic, "results": results};
}

async function playerSearch(client, channel, playerID) {
    //-----find each relic the player has-----

    let relics = ["Axi A1", "Axi B2", "Axi A3"];

    let resultArray = [];
    for (relic of relics) {
        let thisResult = await relicSearch(client, relic);
        resultArray.push(thisResult);
    }

    displayResults(client, channel, resultArray);
}

function displayResults(client, channel, results) {
    //passed an array of objects
    //objects have "relic": relic name, "results": array of Result

    let resultMessage = "";
    for (relic of results) {
        if (relic.results.length == 0) continue;

        resultMessage += `\n**${relic.relicName}**:\n`;
        for (result of relic.results) {
            resultMessage += `[Squad ${result.squadID}](${result.messageURL}): ${result.messageContent}\n`;
        }
    }

    if (resultMessage == "") resultMessage = "No open squads found for those relics";

    const { RichEmbed } = require('discord.js');

    const embed = new RichEmbed()
    .setTitle('Search Results')
    .setColor(client.config.get('baseConfig').colour)
    .setDescription(resultMessage);

    channel.send(embed);
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