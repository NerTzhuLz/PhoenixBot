//If something needs to know the permissions for this command, it looks here
exports.permissions = (client) => {
    return perms = {
        botChannel: false,           //If true, bot only responds in bot channels
        adminBotChannel: false,     //If true, bot only responds in admin bot channels
        role: client.config.get('perms').user     //Last word specifies permission level needed to use this command
    }
}



//This code is run when the command is executed
exports.run = (client, message, args) => {

    //make sure we're in Recruiting
    if (client.config.get('channelConfig').recruitChannel != message.channel.id) {
        message.reply("That command is only for the recruiting channel, sorry");
        return;
    }


    //check for "all"
    //otherwise grab squad ID's

    //get a list of squads to close
    let squads = [];
    if (args.length > 0 && args[0].toLowerCase() == 'all') {
        for (let i = 0; i < client.config.get('baseConfig').maxSquads; i++) {
            squads.push(i.toString());
        }

    } else {
        for (let i = 0; i < args.length; i++) {
            if (parseInt(args[i], 10) < client.config.get('baseConfig').maxSquads && parseInt(args[i], 10) >= 0) {
                squads.push(args[i]);
            }
        }
    }

    if (squads.length == 0) {
        message.reply(createEmbed(client,"Error - no squad IDs found","Please supply at least one squad number to close, or specify 'all'"))
        .then((msg) => {
            msg.delete(10000);
            message.delete(5000);
        })
        .catch(() => {
            let catchMessage = 'Handled rejection - caught in Close - no squad IDs'
            console.log(catchMessage);

            let logChannel = client.channels.find(channel => channel.id === client.config.get('channelConfig').logChannel);
            logChannel.send(`<@198269661320577024>, ${catchMessage}`);
        });
        return;
    }

    let editMessages = [];

    //for each squad
    let sendString = "Closing squads: ";
    let errorMessage = "";
    let errorCount = 0;

    for (let i = 0; i < squads.length; i++) {
        //see if squad exists
        if (client.lobbyDB.has(squads[i])) {
            let currentSquad = client.lobbyDB.get(squads[i]);

            //can't close a squad that's not yours
            if (currentSquad.hostID != message.author.id && !(args[0].toLowerCase() == 'all')) {
                if (errorCount == 0) {
                    errorMessage = errorMessage + `Error - can't close a squad you're not hosting.\n`;
                    errorCount += 1;
                }
            }

            else if (currentSquad.hostID == message.author.id && currentSquad.open) {
                //squad exists, is open, and we are the host
                
                closeSquad(client, squads[i]);

                //add squad to list of squads we're leaving
                sendString = sendString + squads[i] + ", ";

                //record info for editing message later
                editMessages.push({messageID: currentSquad.messageID, messageIndex: currentSquad.countIndex, lobbyID: currentSquad.lobbyID})
            }
        }
    }

    if (errorMessage != "") {
        message.reply (createEmbed(client, "Errors occurred:" , errorMessage))
        .then((msg) => {
            msg.delete(10000);
        })
        .catch(() => {
            let catchMessage = 'Handled rejection - caught in Close - errors'
            console.log(catchMessage);

            let logChannel = client.channels.find(channel => channel.id === client.config.get('channelConfig').logChannel);
            logChannel.send(`<@198269661320577024>, ${catchMessage}`);
        });
    } else if (sendString == "Closing squads: ") {
        message.reply (createEmbed(client,"Error - no squads closed","Didn't close any squads (May have already been closed)"))
        .then((msg) => {
            msg.delete(10000);
        })
        .catch(() => {
            let catchMessage = 'Handled rejection - caught in Close - no closed'
            console.log(catchMessage);

            let logChannel = client.channels.find(channel => channel.id === client.config.get('channelConfig').logChannel);
            logChannel.send(`<@198269661320577024>, ${catchMessage}`);
        });
    } else {
        message.reply(createEmbed(client,"Success",sendString.substring(0,sendString.length-2)))
        .then((msg) => {
            msg.delete(10000);
        })
        .catch(() => {
            let catchMessage = 'Handled rejection - caught in Close - success'
            console.log(catchMessage);

            let logChannel = client.channels.find(channel => channel.id === client.config.get('channelConfig').logChannel);
            logChannel.send(`<@198269661320577024>, ${catchMessage}`);
        });
    }

    message.delete(5000)
    .catch(() => {
        let catchMessage = 'Handled rejection - caught in Close - edits'
        console.log(catchMessage);

        let logChannel = client.channels.find(channel => channel.id === client.config.get('channelConfig').logChannel);
        logChannel.send(`<@198269661320577024>, ${catchMessage}`);
    });
};

async function closeSquad (client, id) {
    //close the squad
    client.lobbyDB.setProp(id, "open", false);

    //get the squad
    const squad = client.lobbyDB.get(id);
    //delete the host message
    //SPLIT RECRUITS
    //const channel = squad.channel;
    const channelID = client.config.get('channelConfig').recruitChannel;
    const messageID = squad.messageID;

    const channel = client.channels.get(channelID);
    let messageNotFound = false;
    await channel.fetchMessage(messageID)
    .catch(() => {
        messageNotFound = true;
        let logChannel = client.channels.find(channel => channel.id === client.config.get('channelConfig').logChannel);
        logChannel.send(`<@198269661320577024> Error deleting message for squad ${id} for message ID ${messageID}. Does it exist?`);
    })
    .then(squadMessage => {
        if (!messageNotFound) squadMessage.delete();
    })
}

function createEmbed(client, title, content) {
    const { Client, RichEmbed } = require('discord.js');
    return new RichEmbed()
    .setTitle(title)
    .setColor(client.config.get('baseConfig').colour)
    .setDescription(content);
}

//This code is run when "Help" is used to get info about this command
exports.help = (client, message) => {
    const { Client, RichEmbed } = require('discord.js');
    
    const helpMessage = `Usable only by a squad host. 
Closes a squad or list of squads so that no more players can join. Cannot be undone. 
Can use the 'all' tag to close all squads that you are currently hosting

Usage: ${client.config.get('baseConfig').prefix}Close <squad ID(s)>
OR: ${client.config.get('baseConfig').prefix}Close all`;

    const embed = new RichEmbed()
    .setTitle('Help for Close')
    .setColor(client.config.get('baseConfig').colour)
    .setDescription(helpMessage);

    message.channel.send(embed);
};