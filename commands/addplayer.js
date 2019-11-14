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

    //get a list of squads to add to
    let squads = [];
    let override = false;

    for (let i = 0; i < args.length; i++) {
        if (parseInt(args[i], 10) < 100 && parseInt(args[i], 10) >= 0) {
            squads.push(args[i]);
        } else if (args[i] == "-o") {
            override = true;
        }
    }

    if (squads.length == 0) {
        message.reply("Please supply at least one squad number to add a player to").then((msg) => {
            //msg.delete(10000);
        });
        message.delete();
        return;
    }

    let editMessages = [];
    let overrideSquads = [];
    let addedSquads = [];

    for (let squadID of squads) {

        if (!client.lobbyDB.has(squadID)) {
            continue;
        }

        let squad = client.lobbyDB.get(squadID);

        //if squad closed or if we're not the host, ignore it
        if (!squad.open || squad.hostID != message.author.id) {
            continue;
        }
        
        //if squad would fill from this command
        if (squad.playerCount == 3) {
            //check for override
            if (override) {
                //try to avoid race condition
                client.lobbyDB.setProp(squadID, "open", false);
                squad.open = false;
            } else {
                //don't process this one, give player warning
                overrideSquads.push(squadID);
                continue;
            }
        }

        addedSquads.push(squadID);
        
        //add one to the player count
        squad.playerCount += 1;

        //add to DB
        client.lobbyDB.set(squadID, squad);

        //add to edits
        editMessages.push({messageID: squad.messageID, messageIndex: squad.countIndex, count: squad.playerCount});
        
        //if now full, trigger full squad like join
        if (squad.playerCount == 4) {
            //send notification to subscribers
            let pingMessage = `-----\nSquad ${squadID} has been filled\n` + "<@" + squad.hostID + "> ";

            for (id of squad.joinedIDs) {
                pingMessage = pingMessage + "<@" + id + "> "
            }

            message.channel.send(pingMessage + "\n-----")
        }
    }

    if (overrideSquads.length > 0) {
        message.reply(`Warning, the following squads would have filled: ${overrideSquads.join(", ")}\nIf this was intended, please add an -o argument to your command next time (see ${client.baseConfig.prefix}help addplayer (only in a bot spam channel))`)
    }

    if (addedSquads.length > 0) {
        message.reply("Added phantom players to squads: " + addedSquads.join(", "))
        .then((msg) => {
            //msg.delete(10000);
        });
    } else {
        message.reply("Error - No phantom players added")
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

//This code is run when "Help" is used to get info about this command
exports.help = (client, message) => {
    message.channel.send(`Help for AddPlayer:
Usable only by a squad host. 
Adds one non-discord player to the squad. Useful for if a host finds players in-game. 
If using this command would fill the squad (which is not reversible) it requires the host to supply a -o tag (shown below)

Usage (cannot fill squad): ${client.baseConfig.prefix}AddPlayer <squad ID(s)>
OR (can fill squad): ${client.baseConfig.prefix}AddPlayer -o <squad ID(s)>`);
};