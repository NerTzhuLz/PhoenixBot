//If something needs to know the permissions for this command, it looks here
exports.permissions = (client) => {
    return perms = {
        botChannel: true,           //If true, bot only responds in bot channels
        adminBotChannel: true,     //If true, bot only responds in admin bot channels
        role: client.perms.admin     //Last word specifies permission level needed to use this command
    }
}

//This code is run when the command is executed
exports.run = (client, message, args) => {

    //find relic names in args
    let searchString = args.join(" ");

    let regex = /((Lith)|(Meso)|(Neo)|(Axi)){1} ?[a-z]{1}[0-9]+/gi;
    let currentMatch;
    let result = "";
    let matches = [];

    while((currentMatch = regex.exec(searchString)) !== null) {
        result = currentMatch[0];

        if (result.startsWith('lith') || result.startsWith('meso')) {
            spaceIndex = 4;
        } else {
            spaceIndex = 3;
        }

        if (result[spaceIndex] != ' ') {
            result = result.substring(0,spaceIndex) + " " + result.substring(spaceIndex, result.length);
        }

        result = result
            .toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');

        if (!client.DBEnmap.indexes.includes(result)) {
            matches.push(result);
        }
    }
    //'matches' is now an array of correctly formatted relic names found in the input that aren't in the DB already
    let sendMessage;

    //if we found matches
    if (matches.length > 0) {
        //respond
        sendMessage = `Adding relics: ${matches.join(', ')}.\n`;
        //add to DB
        for (let relic of matches) {
            client.DBEnmap.set(relic, []);
        }
    } else {
        //no matches
        sendMessage = "Relic(s) not found - typed badly or are already in the database"
    }

    message.channel.send(sendMessage);
    
};

//This code is run when the help command is used to get info about this command
exports.help = (client, message) => {
    message.channel.send(`Help for CreateRelic:
Add newly vaulted relics to the list of relics users can subscribe to. 

Usage: ${client.baseConfig.prefix}CreateRelic <relic name(s)>`);
};

