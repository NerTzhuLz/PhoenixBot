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

    //get a list of squads to join
    let squads = [];

    for (let i = 0; i < args.length; i++) {
        if (parseInt(args[i], 10) < 100 && parseInt(args[i], 10) >= 0) {
            squads.push(args[i]);
        }
    }

    if (squads.length == 0) {
        message.reply("Please supply at least one squad number to join").then((msg) => {
            //msg.delete(10000);
        });
        message.delete();
        return;
    }

    let sendString = "Subscribing to squads: ";
    let badSquads = "";
    let subbedSquads = false;

    let editMessages = [];

    //for each squad
    for (let i = 0; i < squads.length; i++) {
        //see if squad exists
        if (client.lobbyDB.has(squads[i])) {
            let currentSquad = client.lobbyDB.get(squads[i]);

            //see if it's closed
            if (!currentSquad.open) {
                badSquads = badSquads + squads[i] + ", ";
            //see if we're already subbed to it
            } else if (currentSquad.joinedIDs.includes(message.author.id) || currentSquad.hostID == message.author.id) {
                
                subbedSquads = true;
            } else {
                //squad exists, and we can sub to it

                //if it's about to be full, quickly lock it to avoid race condition
                if (currentSquad.playerCount == 3) {
                    client.lobbyDB.setProp(squads[i], "open", false);
                    currentSquad.open = false;
                }

                //add squad to list of squads we're subbing to
                sendString = sendString + squads[i] + ", ";

                //update squad object
                currentSquad.playerCount = currentSquad.playerCount + 1;
                currentSquad.joinedIDs.push(message.author.id);

                //save to DB
                client.lobbyDB.set(squads[i], currentSquad);

                //edit the lobby message
                editMessages.push({messageID: currentSquad.messageID, messageIndex: currentSquad.countIndex, count: currentSquad.playerCount});
                

                //check if now full
                if (currentSquad.playerCount == 4) {
                    //send notification to subscribers
                    let pingMessage = `-----\nSquad ${squads[i]} has been filled\n` + "<@" + currentSquad.hostID + "> ";

                    for (id of currentSquad.joinedIDs) {
                        pingMessage = pingMessage + "<@" + id + "> "
                    }

                    message.channel.send(pingMessage + "\n-----")
                }
            }
            
        } else {
            //desn't exist
            badSquads = badSquads + squads[i] + ", ";
        }
    }

    if (badSquads != "") {
        message.reply("Can't join the following squads (they may be full, closed or non-existent): " + badSquads.substring(0,badSquads.length-2))
        .then((msg) => {
            //msg.delete(10000);
        });
    }

    if (sendString == "Subscribing to squads: ") {
        message.reply ("Didn't subscribe to any squads")
        .then((msg) => {
            //msg.delete(10000);
        });
    } else {
        message.reply(sendString.substring(0,sendString.length-2));
    }

    if (subbedSquads) {
        message.reply("Some squads weren't joined because you were already subscribed")
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
        newMessage = newMessage + edit.count;
        newMessage = newMessage + currentMessage.content.substring(edit.messageIndex + 1, currentMessage.content.length);

        await currentMessage.edit(newMessage);
    }

    //message.delete();
}

exports.help = (client, message) => {
    message.channel.send(`Help for Join:
Subscribes you to a particular squad or squads. You will be alerted when the squad fills.

Usage: ${client.baseConfig.prefix}join <squad ID(s)>

Example: You want to join the following group -  
**SomeHostUser:**
h __Axi N5__ 2b2 1/4 {**5**}

Use: ${client.baseConfig.prefix}join 5`);
};

