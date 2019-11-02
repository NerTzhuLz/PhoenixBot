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
    /*if (!client.channelConfig.recruitChannels.includes(message.channel.id)) {
        message.channel.send("This command is only for recruiting channels, sorry");
        return;
    }*/

    //get a list of squads to leave
    let squads = [];

    

    if (args[0].toLowerCase() == 'all') {
        for (let i = 0; i < 100; i++) {
            squads.push(i.toString());
        }

    } else {
        for (let i = 0; i < args.length; i++) {
            if (parseInt(args[i], 10) < 100 && parseInt(args[i], 10) >= 0) {
                squads.push(args[i]);
            }
        }
    }

    if (squads.length == 0) {
        message.reply("Please supply at least one squad number to leave, or specify 'all'").then((msg) => {
            msg.delete(10000);
        });
        message.delete();
        return;
    }

    let sendString = "Unsubscribing from squads: ";
    let errorMessage = "";
    let errorCount = 0;

    //for each squad
    for (let i = 0; i < squads.length; i++) {
        //see if squad exists
        if (client.lobbyDB.has(squads[i])) {
            let currentSquad = client.lobbyDB.get(squads[i]);
            
            if (currentSquad.hostID == message.author.id && !args[0].toLowerCase() == 'all') {
                if (errorCount == 0) {
                    errorMessage = errorMessage + `Error - can't leave a squad you're hosting. Use ${client.baseConfig.prefix}close instead\n`;
                    errorCount += 1;
                }
                
            }
            //see if we're subbed to it/if it's open
             else if (currentSquad.joinedIDs.includes(message.author.id) && currentSquad.open) {
                //squad exists, is open, and we have previously joined it

                //add squad to list of squads we're leaving
                sendString = sendString + squads[i] + ", ";

                //update squad object
                currentSquad.playerCount = currentSquad.playerCount - 1;
                currentSquad.joinedIDs.splice(currentSquad.joinedIDs.indexOf(message.author.id), 1);

                //save to DB
                client.lobbyDB.set(squads[i], currentSquad);

                //edit the lobby message
                message.channel.fetchMessage(currentSquad.messageID).then((lobbyMessage) => {
                    let newMessage = lobbyMessage.content.substring(0,currentSquad.countIndex);
                    newMessage = newMessage + currentSquad.playerCount;
                    newMessage = newMessage + lobbyMessage.content.substring(currentSquad.countIndex+1, lobbyMessage.content.length);

                    lobbyMessage.edit(newMessage);
                })
            } 
        } 
    }

    if (errorMessage != "") {
        message.reply ("Errors occurred: \n" + errorMessage)
        .then((msg) => {
            msg.delete(10000);
        });
    }

    if (sendString == "Unsubscribing from squads: ") {
        message.reply ("Didn't unsub from any squads (You might have already been unsubbed)")
        .then((msg) => {
            msg.delete(10000);
        });
    } else {
        message.reply(sendString.substring(0,sendString.length-2));
    }
    
    message.delete();

};

exports.help = (client, message) => {
    message.channel.send(`Help for CommandName:
Unsubscribes you to from particular squad or squads. You will no longer be alerted when the squad fills.
Alternatively, specify "all" to leave every squad you are subscribed to. 

Usage: ${client.baseConfig.prefix}leave <squad ID(s)>
OR: ${client.baseConfig.prefix}leave all`);
};

