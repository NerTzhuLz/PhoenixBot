//If something needs to know the permissions for this command, it looks here
exports.permissions = (client) => {
    return perms = {
        botChannel: true,           //If true, bot only responds in bot channels
        adminBotChannel: false,     //If true, bot only responds in admin bot channels
        role: client.config.get('perms').user     //Last word specifies permission level needed to use this command
    }
}

//This code is run when the command is executed
exports.run = (client, message, args) => {
    const { Client, RichEmbed } = require('discord.js');

    //find relic names in args
    let searchString = args.join(" ");

    let regex = /((Lith)|(Meso)|(Neo)|(Axi)){1} ?[a-z]{1}[0-9]+/gi;
    let currentMatch;
    let result = "";
    let matches = [];

    if (args.length > 0 && args[0].toLowerCase() == 'all') {
        matches = client.DBEnmap.indexes;
    } else {

        while((currentMatch = regex.exec(searchString)) !== null) {
            result = currentMatch[0].toLowerCase();
    
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
    
            if (client.DBEnmap.indexes.includes(result)) {
                matches.push(result);
            }
        }
        //'matches' is now an array of correctly formatted, vaulted relics from the input

    }
    
    let sendMessage = "";

    //if we found matches
    if (matches.length > 0) {
        if (args[0].toLowerCase() != 'all') {
            sendMessage = `Unsubscribing ${message.guild.member(message.author).displayName} from the following relics: ${matches.join(', ')}.`
        } else {
            sendMessage = `Unsubscribing ${message.guild.member(message.author).displayName} from all relics`
        }
        
        //remove user from array in DB
        for (let relic of matches) {
            //check if user is in relic, because apparently this DB is dumb
            if (client.DBEnmap.includes(relic, message.author.id)) {
                client.DBEnmap.remove(relic, message.author.id);
            }
        }
    } else {
        //no matches
        sendMessage = "Couldn't find any of those relic(s)."
    }
    
    const embed = new RichEmbed()
    .setTitle('RemoveRelic')
    .setColor(client.config.get('baseConfig').colour)
    .setDescription(sendMessage);

    message.channel.send(embed);
};

//This code is run when the help command is used to get info about this command
exports.help = (client, message) => {
    const { Client, RichEmbed } = require('discord.js');
    
    const helpMessage = `Unsubscribes you from relics that you no longer want to receive notifications for.  

Usage: ${client.config.get('baseConfig').prefix}RemoveRelic <relic name(s)>
(Put spaces between each new relic)

You can also unsubscribe from all relics using ${client.config.get('baseConfig').prefix}RemoveRelic all`;

    const embed = new RichEmbed()
    .setTitle('Help for RemoveRelic')
    .setColor(client.config.get('baseConfig').colour)
    .setDescription(helpMessage);

    message.channel.send(embed);
};

