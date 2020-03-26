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

    //keep track of "filled" messages to send last
    let FutureMessage = function(message, embed) {
        this.message = message;
        this.embed = embed;
    }
    let futureMessages = [];

    //get a list of squads to join
    let squads = [];

    for (let i = 0; i < args.length; i++) {
        if (parseInt(args[i], 10) < 100 && parseInt(args[i], 10) >= 0) {
            squads.push(args[i]);
        }
    }

    if (squads.length == 0) {
        message.reply(createEmbed(client,"Error - no squad IDs found","Please supply at least one squad number to join"))
        .then((msg) => {
            msg.delete(10000);
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
            if (!currentSquad.open || currentSquad.playerCount == 4) {
                badSquads = badSquads + squads[i] + ", ";
            //see if we're already subbed to it
            } else if (currentSquad.joinedIDs.includes(message.author.id) || currentSquad.hostID == message.author.id) {
                
                subbedSquads = true;
            } else {
                //squad exists, and we can sub to it

                //if it's about to be full, quickly lock it to avoid race condition
                if (currentSquad.playerCount == 3) {
                    //OLD
                    //client.lobbyDB.setProp(squads[i], "open", false);
                    //currentSquad.open = false;

                    //update "full" playercount ASAP so nobody else can join
                    client.lobbyDB.setProp(squads[i], "playerCount", 4);
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
                    let pingMessage = "Host: <@" + currentSquad.hostID + ">, Joined players: ";

                    for (id of currentSquad.joinedIDs) {
                        pingMessage = pingMessage + "<@" + id + "> "
                    }

                    //add "filled" message to array to send later
                    let filledMessage = new FutureMessage(pingMessage, createEmbed(client,"Squad filled",`Squad ${squads[i]} has been filled`))
                    futureMessages.push(filledMessage);
                    //OLD
                    //message.channel.send(pingMessage,createEmbed(client,"Squad filled",`Squad ${squads[i]} has been filled`))
                }
            }
            
        } else {
            //desn't exist
            badSquads = badSquads + squads[i] + ", ";
        }
    }

    if (badSquads != "") {
        message.reply(createEmbed(client, "Error - can't join","Can't join the following squads (they may be full, closed or non-existent): " + badSquads.substring(0,badSquads.length-2)))
        .then((msg) => {
            msg.delete(10000);
        });
    }

    if (sendString == "Subscribing to squads: ") {
        /*message.reply ("Didn't subscribe to any squads")
        .then((msg) => {
            msg.delete(10000);
        });*/
    } else {
        message.reply(createEmbed(client, "Success", sendString.substring(0,sendString.length-2)))
        .then((msg) => {
            msg.delete(10000);
        });
    }

    if (subbedSquads) {
        message.reply(createEmbed(client,"Error - already joined","Some squads weren't joined because you were already subscribed"))
        .then((msg) => {
            msg.delete(10000);
        });
    }

    //send all the filled messages
    while (futureMessages.length > 0) {
        let newMessage = futureMessages.pop();
        message.channel.send(newMessage.message, newMessage.embed);
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

exports.help = (client, message) => {
    const { Client, RichEmbed } = require('discord.js');
    
    const helpMessage = `Subscribes you to a particular squad or squads. You will be alerted when the squad fills.

Usage: ${client.baseConfig.prefix}join <squad ID(s)>

(In the hosting message, the bold number in brackets is the squad's ID)
Example: You want to join the following group -  

**SomeHostUser:**
h __Axi N5__ 2b2 1/4 {**5**}

Use: ${client.baseConfig.prefix}join 5`;

    const embed = new RichEmbed()
    .setTitle('Help for Join')
    .setColor(client.baseConfig.colour)
    .setDescription(helpMessage);

    message.channel.send(embed);
};

