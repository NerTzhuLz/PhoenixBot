

exports.permissions = (client) => {
    return perms = {
        botChannel: true,
        adminBotChannel: false,
        role: client.perms.user
    }
}

exports.run = (client, message, args) => {
    let sendMessage = "";
    let relicList = new Set();
    let errorMessage = "";

    let inString = args.join(" ");
    let lowerString = inString.toLowerCase();

    let ignore = false;
    let currentCharacter = 0;
    let firstBracket = false;
    let outerBracket = false;
    let relicName = "";
    let spaceIndex = 0;

    //search for relics
    let regex = /((Lith)|(Meso)|(Neo)|(Axi)){1} ?[a-z]{1}[0-9]+/gi;
    let currentMatch;
    let result = {};
    let matches = [];

    while((currentMatch = regex.exec(lowerString)) !== null) {
        result = {};
        result.name = currentMatch[0];
        result.index = currentMatch.index;
        result.lastIndex = regex.lastIndex;
        matches.push(result);
    }

    //iterate through all characters of the message
    for (let index = 0; index < lowerString.length; index++) {

        //OLD
        //ignore things between square brackets
        /*if (lowerString[index] == '[') {
            //keep track of extra brackets so users can still display them
            if (ignore) {
                firstBracket = false;
            } else {
                firstBracket = true;
            }
            ignore = true;
        }
        //keep track of extra brackets so users can still display them
        if (!ignore && lowerString[index] == ']') {
            outerBracket = true;
        } else {
            outerBracket = false;
        }
        //stop ignoring after a square bracket
        if (ignore) {
            if (lowerString[index] == ']') {
                ignore = false;
            } else if (index == lowerString.length-1) {
                //if we're still ignoring and have reached the end of the message, there was never a closed bracket
                errorMessage += "Error - square brackets not closed properly\n";
            }
        } */
        
        currentCharacter = index;

        if (!ignore/* Always true without old code */) {
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



                //-----TO DO: CHECK IF REAL RELIC-----


                if (1 /*REAL RELIC*/) {


                    //add to list of relics
                    relicList.add(relicName);

                    //format it into the message
                    sendMessage += "__**";
                    sendMessage += relicName;
                    sendMessage += "**__";

                    //skip to the end of the result (so we don't print it out twice)
                    index = result.lastIndex - 1;
                }
            }
        }
        
        //if we haven't found anything, just print the current character
        if (currentCharacter == index) {
            sendMessage += inString[index];
            //OLD - checks for square brackets
            //if the current character is not an opening bracket that we can't print
            /*if (!(lowerString[index] == '[' && ignore && firstBracket)) {
                //or close bracket we're not allowed to print
                if (!(lowerString[index] == ']' && !outerBracket)){
                    sendMessage += inString[index];
                }
            }*/
        }
    }

    //if message has some vaulted relics
    if (relicList.size > 0) {
        message.channel.send(`Relics to search for: ${Array.from(relicList).join(', ')}`);

        //----get the player list for each relic
        //----remove duplicates of players
        //----mass ping

    } else {
        //send error message about no relics found
        errorMessage += "Error - No vaulted relics found in this message";
    }
    

    //squad setup?
        //send squad message
        //add initial react(s)
        //listen for reactions on this message
        //set up timeout stuff
        //some way to un-host a squad?



    //if we've had non-fatal errors say so
    if (errorMessage != "") {
        message.reply(`Some errors occured: \n${errorMessage}`);
    }

    //post the message
    message.channel.send(sendMessage);
};

exports.help = (client, message) => {
    message.channel.send(`Help for create:
(No help message yet)

Usage: ${client.baseConfig.prefix}create stuff`);
};