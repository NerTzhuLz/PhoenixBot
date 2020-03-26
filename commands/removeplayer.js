//If something needs to know the permissions for this command, it looks here
exports.permissions = (client) => {
    return perms = {
        botChannel: false,           //If true, bot only responds in bot channels
        adminBotChannel: false,     //If true, bot only responds in admin bot channels
        role: client.perms.user     //Last word specifies permission level needed to use this command
    }
}

//This code is run when the command is executed
exports.run = (client, message, args) => {
    //make sure we're in Recruiting
    if (client.channelConfig.recruitChannel != message.channel.id) {
        message.channel.send("That command is only for the recruiting channel, sorry");
        return;
    }

    //get a list of squads to remove from
    let squads = [];

    for (let i = 0; i < args.length; i++) {
        if (parseInt(args[i], 10) < 100 && parseInt(args[i], 10) >= 0) {
            squads.push(args[i]);
        }
    }

    if (squads.length == 0) {
        message.reply(createEmbed(client,"Error - no squad IDs found","Please supply at least one squad number to remove a player from"))
        .then((msg) => {
            msg.delete(10000);
        });
        message.delete();
        return;
    }

    let editMessages = [];
    let removedSquads = [];
    let minWarning = false;
    let badSquads = [];

    for (let squadID of squads) {

        //check if squad exists
        if (!client.lobbyDB.has(squadID)) {
            badSquads.push(squadID)
            continue;
        }

        let squad = client.lobbyDB.get(squadID);

        //if squad closed or if we're not the host, ignore it
        if (!squad.open || squad.hostID != message.author.id) {
            badSquads.push(squadID)
            continue;
        }

        //check number of players + host
        if (squad.playerCount <= squad.joinedIDs.length + 1) {
            minWarning = true;
            continue;
        }

        removedSquads.push(squadID);
        
        //add one to the player count
        squad.playerCount -= 1;

        //add to DB
        client.lobbyDB.set(squadID, squad);

        //add to edits
        editMessages.push({messageID: squad.messageID, messageIndex: squad.countIndex, count: squad.playerCount});
    }

    if (minWarning || badSquads.length > 0) {
        let errorMessage = "";
        let title = "";
        if (badSquads.length > 0) {
            errorMessage += `Some squads could not have players removed. Either they don't exist, you are not the host, or the squad has been closed: ${badSquads.join(', ')}`;
            if (minWarning) {
                errorMessage += "\n\n";
                title = "Multiple errors - Can't remove";
            }
        } 
        if (minWarning) {
            errorMessage += "Cannot make player count lower than number of joined players + host";
        }

        if (title == "") {
            title = "Error - Can't remove";
        }
        
        message.reply(createEmbed(client,title,errorMessage))
        .then((msg) => {
            msg.delete(10000);
        });
    }

    if (removedSquads.length > 0) {
        message.reply(createEmbed(client,"Success","Removed phantom players from squads: " + removedSquads.join(", ")))
        .then((msg) => {
            msg.delete(10000);
        });
    } else {
        /*message.reply("Error - No phantom players removed")
        .then((msg) => {
            msg.delete(10000);
        });*/
    }

    doEdits(client, editMessages, message);
};

async function doEdits(client, editMessages, message) {
    const { Client, RichEmbed } = require('discord.js');

    let currentMessage = null;
    for (let edit of editMessages) {
        if (currentMessage == null || currentMessage.id != edit.messageID) {

            currentMessage = await message.channel.fetchMessage(edit.messageID);
        }

        const content = currentMessage.embeds[0].description;

        let newMessage = content.substring(0, edit.messageIndex);
        newMessage = newMessage + edit.count;
        newMessage = newMessage + content.substring(edit.messageIndex + 1, content.length);

        const embed = new RichEmbed()
        .setTitle(currentMessage.embeds[0].title)
        .setColor(client.baseConfig.colour)
        .setDescription(newMessage);

        await currentMessage.edit(embed);
    }

    message.delete();
}

function createEmbed(client, title, content) {
    const { Client, RichEmbed } = require('discord.js');
    return new RichEmbed()
    .setTitle(title)
    .setColor(client.baseConfig.colour)
    .setDescription(content);
}

//This code is run when "Help" is used to get info about this command
exports.help = (client, message) => {
    const { Client, RichEmbed } = require('discord.js');
    
    const helpMessage = `Usable only by a squad host. 
    Removes one non-discord player from the squad. Only usable if AddPlayer has been used on that squad previously. 
    
    Usage: ${client.baseConfig.prefix}RemovePlayer <squad ID(s)>`;

    const embed = new RichEmbed()
    .setTitle('Help for RemovePlayer')
    .setColor(client.baseConfig.colour)
    .setDescription(helpMessage);

    message.channel.send(embed);

};