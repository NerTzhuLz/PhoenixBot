

exports.permissions = (client) => {
    return perms = {
        botChannel: false,
        adminBotChannel: false,
        role: client.perms.user
    }
}

exports.run = (client, message, args) => {

    //-----TEMP----
    let fs = require('fs');

    let memberName = message.guild.member(message.author).displayName;

    let sendMessage =` - **${memberName}:**\n`;
    let relicList = new Set();
    let errorMessage = "";

    let inString = args.join(" ");
    let lowerString = inString.toLowerCase();

    let currentCharacter = 0;
    let relicName = "";
    let spaceIndex = 0;

    //search for relics
    let searchString = lowerString;
    let regex = /((Lith)|(Meso)|(Neo)|(Axi)){1} ?[a-z]{1}[0-9]+/gi;
    let currentMatch;
    let result = {};
    let matches = [];

    while((currentMatch = regex.exec(searchString)) !== null) {
        result = {};
        result.name = currentMatch[0];
        result.index = currentMatch.index;
        result.lastIndex = regex.lastIndex;
        matches.push(result);
    }

    //iterate through all characters of the message
    for (let index = 0; index < lowerString.length; index++) {
        
        currentCharacter = index;

        //if we're not ignoring at the moment, show any results starting here
        result = null;
        for (let i = 0; i < matches.length; i++) {
            if (matches[i].index == index) {
                
                result = matches[i];
            }
        }

        if (result != null) {
            //a result starts here
            //check if the result has a space in the name or not, add it if it's missing
            if (result.name.startsWith('lith') || result.name.startsWith('meso')) {
                spaceIndex = 4;
            } else {
                spaceIndex = 3;
            }

            if (result.name[spaceIndex] == ' ') {
                relicName = result.name;
            } else {
                relicName = result.name.substring(0,spaceIndex) + " " + result.name.substring(spaceIndex, result.name.length);
            }
            
            //capitalise properly
            relicName = relicName
                .toLowerCase()
                .split(' ')
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ');

            //check if relic in DB
            if (client.DBEnmap.indexes.includes(relicName)) {

                //add to list of relics
                relicList.add(relicName);

                //format it into the message
                sendMessage += "__";
                sendMessage += relicName;
                sendMessage += "__";

                //skip to the end of the result (so we don't print it out twice)
                index = result.lastIndex - 1;
            }
        }
        
        
        //if we haven't found anything, just print the current character
        if (currentCharacter == index) {
            sendMessage += inString[index];
        }
    }

    //-----TEMP-----
    let roleString = "";
    //-----
    
    //if message has some vaulted relics
    let playerList = new Set();
    if (relicList.size > 0) {
        //get the player list for each relic
        let currentUsers = [];
        for (let relic of relicList) {

            
            //-----TEMP-----if role exists for the relic, ping that as well
            let role = message.guild.roles.find(role => role.name == relic)
            if (role) {
                roleString += `<@&${role.id}>`;
            }
            //-----



            currentUsers = client.DBEnmap.get(relic);
            for (let user of currentUsers) {
                if (user != message.author.id) {
                    playerList.add(user);
                }
            }
        }

        //-----TEMP-----
        if (roleString.length < 2000 && roleString.length > 0) {
            message.channel.send(roleString)
            .then(msg => {
                msg.delete();
            })
            .catch();
            
        } else {
            if (roleString.length > 0) errorMessage += "Error - Too many relics to use old system\n";
        }
        //-----

    } else {
        //send error message about no relics found
        errorMessage += "Error - No vaulted relics found in this message\n";
    }

    //search for squad capacity markers
    searchString = sendMessage;
    regex = /\b[1-3]\/4/g;
    currentMatch;
    result = {};
    matches = [];

    while((currentMatch = regex.exec(searchString)) !== null) {
        result = {};
        result.name = currentMatch[0];
        result.index = currentMatch.index;
        result.lastIndex = regex.lastIndex;
        matches.push(result);
    }

    let squadObject = {};
    let newSendMessage = "";
    let lastCut = 0;

    for (let i = 0; i < matches.length; i++) {
        squadObject = {};
        let lobbyIndex = client.lobbyDB.get('nextLobby');

        squadObject.lobbyID = lobbyIndex;
        squadObject.messageID = message.id;

        newSendMessage += sendMessage.substring(lastCut, matches[i].lastIndex);

        squadObject.countIndex = newSendMessage.length-3;

        newSendMessage += ` {**${lobbyIndex}**}`;
        lastCut = matches[i].lastIndex;
        
        squadObject.playerCount = parseInt(matches[i].name.substring(0));
        squadObject.open = true;
        squadObject.hostID = message.author.id;
        squadObject.joinedIDs = [];

        client.lobbyDB.set(lobbyIndex, squadObject);
        if (lobbyIndex == 99) {
            client.lobbyDB.set('nextLobby', 0);
        } else {
            client.lobbyDB.set('nextLobby', lobbyIndex + 1);
        }
    }

    newSendMessage += sendMessage.substring(lastCut, sendMessage.length);
    //fs.writeFile("./TEST.json", JSON.stringify(Array.from(client.lobbyDB.values()),null,4), (err) => console.error);

    //if we've had non-fatal errors say so
    if (errorMessage != "") {
        message.reply(`Some errors occured: \n${errorMessage}`);
    }

    //post the message
    message.channel.send(newSendMessage);
    let channel = message.channel;
    message.delete();


    let userArray = Array.from(playerList);

    //mass ping
    let pingMessage = "";
    let newPingMessage = "";
    let currentMention = "";

    while (userArray.length > 0) {
        currentMention = "<@" + userArray.shift() + ">";
        newPingMessage = pingMessage + currentMention;
        if (newPingMessage.length < 2000) {
            pingMessage = newPingMessage;
        } else {
            channel.send(pingMessage)
            .then(msg => {
                msg.delete();
            })
            .catch();
            pingMessage = currentMention;
        }
    }
    if (pingMessage.length > 0) {

        channel.send(pingMessage)
        .then(msg => {
            msg.delete();
        })
        .catch();
    }
};

exports.help = (client, message) => {
    message.channel.send(`Help for create:
(No help message yet)

Usage: ${client.baseConfig.prefix}create stuff`);
};