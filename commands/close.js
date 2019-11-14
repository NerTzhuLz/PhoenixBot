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
    /*if (!client.channelConfig.recruitChannel == message.channel.id) {
        message.channel.send("This command is only for recruiting channels, sorry");
        return;
    }*/


    //check for "all"
    //otherwise grab squad ID's

    //get a list of squads to close
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
        message.channel.send("Please supply at least one squad number to close, or specify 'all'")
        .then((msg) => {
            //msg.delete(10000);
        });
        message.delete();
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
            if (currentSquad.hostID != message.author.id && !args[0].toLowerCase() == 'all') {
                if (errorCount == 0) {
                    errorMessage = errorMessage + `Error - can't close a squad you're not hosting.\n`;
                    errorCount += 1;
                }
            }

            else if (currentSquad.hostID == message.author.id && currentSquad.open) {
                //squad exists, is open, and we are the host
                //close it immediately to avoid race condition
                client.lobbyDB.setProp(squads[i], "open", false);

                //add squad to list of squads we're leaving
                sendString = sendString + squads[i] + ", ";

                //record info for editing message later
                editMessages.push({messageID: currentSquad.messageID, messageIndex: currentSquad.countIndex})
            }
        }
    }

    if (errorMessage != "") {
        message.reply ("Errors occurred: \n" + errorMessage)
        .then((msg) => {
            //msg.delete(10000);
        });
    }

    if (sendString == "Closing squads: ") {
        message.reply ("Didn't close any squads (May have already been closed)")
        .then((msg) => {
            //msg.delete(10000);
        });
    } else {
        message.reply(sendString.substring(0,sendString.length-2))
        .then((msg) => {
            //msg.delete(10000);
        });
    }

    doEdits(editMessages, message);
};

async function doEdits(editMessages, message) {
    let currentMessage = null;
    for (let edit of editMessages) {
        if (currentMessage == null || currentMessage.id != edit.messageID) {

            currentMessage = await message.channel.fetchMessage(edit.messageID);
        }

        let newMessage = currentMessage.content.substring(0, edit.messageIndex);
        newMessage = newMessage + "X";
        newMessage = newMessage + currentMessage.content.substring(edit.messageIndex + 1, currentMessage.content.length);

        await currentMessage.edit(newMessage);
    }

    //message.delete();
}

//This code is run when "Help" is used to get info about this command
exports.help = (client, message) => {
    message.channel.send(`Help for Close:
Usable only by a squad host. 
Closes a squad or list of squads so that no more players can join. Cannot be undone. 
Can use the 'all' tag to close all squads that you are currently hosting

Usage: ${client.baseConfig.prefix}Close <squad ID(s)>
OR: ${client.baseConfig.prefix}Close all`);
};