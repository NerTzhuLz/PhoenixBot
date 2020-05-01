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
    if (client.channelConfig.recruitChannel != message.channel.id) {
        message.channel.send("That command is only for the recruiting channel, sorry");
        return;
    }

    if (args.length == 0) {
        message.reply(createEmbed(client,`Error - No targets found`, `Please use __${client.baseConfig.prefix}help kick__ to learn how to use this command`))
        .then((msg) => {
            msg.delete(10000);
            message.delete(5000);
        });
        return;
    }

    if (message.mentions.users.size == 0) {
        message.reply(createEmbed(client,`Error - Invalid (or no) tagged user`, `Please use __${client.baseConfig.prefix}help kick__ to learn how to use this command`))
        .then((msg) => {
            msg.delete(10000);
            message.delete(5000);
        });
        return;
    }

    let kickedID = message.mentions.users.first().id;

    let squadIDs = [];

    if (!isNaN(args[0])) {

        //single-squad
        let squadID = parseInt(args[0], 10)

        if (squadID > 0 && squadID < client.baseConfig.maxSquads) {
            squadIDs.push(squadID);
        } else {
            //bad squad ID given
            message.reply(createEmbed(client,`Error - Bad squad ID`, `Please use __${client.baseConfig.prefix}help kick__ to learn how to use this command`))
            .then((msg) => {
                msg.delete(10000);
                message.delete(5000);
            });
            return;
        }

        //test that author is host of squad, and that user is in squad
        let squad = client.lobbyDB.get(squadID);
        if (squad.hostID != message.author.id || !squad.joinedIDs.includes(kickedID) || !squad.open) { 
            message.reply(createEmbed(client,`Error - not valid`, `Either you are not the host of this squad, or the user you've tagged isn't in this squad, or the squad has been closed.`))
            .then((msg) => {
                msg.delete(10000);
                message.delete(5000);
            });
            return;
        }

    } else {
        //multisquad
        //get all squads hosted by sender, that contain user
        const squads = client.lobbyDB.array().filter(entry => Object.keys(entry).includes("hostID"));
        const correctSquads = squads.filter(squad => squad.joinedIDs.includes(kickedID) && squad.hostID == message.author.id && squad.open);

        //get the IDs for each of these squads
        for (let squad of correctSquads) {
            squadIDs.push(squad.lobbyID);
        }

        if (squadIDs.length == 0) {
            message.reply(createEmbed(client,`Error - Not found`, `This user does not appear to be in any of your open squads.`))
            .then((msg) => {
                msg.delete(10000);
                message.delete(5000);
            });
            return;
        }
    }

    //kick from all squadIDs
    for (let squadID of squadIDs) {
        kickUser(client, message, kickedID, squadID);
    }

    message.channel.send(`Kicked user from squads ${squadIDs.join(', ')}`)
    .then((msg) => {
        msg.delete(10000);
        message.delete(5000);
    });

    

};

function kickUser(client, message, userID, squadID) {
    
    let squad = client.lobbyDB.get(squadID);
    const index = squad.joinedIDs.indexOf(userID);
    if (index != -1) {
        squad.joinedIDs.splice(index, 1);
        squad.playerCount -=1;

        //save to DB
        client.lobbyDB.set(squadID, squad);
        //edit host message

        doEdits(client, message, squad);
    }
}

async function doEdits(client, message, squad) { 

    const { Client, RichEmbed } = require('discord.js');

    //editMessages.push({messageID: squad.messageID, messageIndex: squad.countIndex, count: squad.playerCount});

    let currentMessage = await message.channel.fetchMessage(squad.messageID);

    const content = currentMessage.embeds[0].description;

    let newMessage = content.substring(0, squad.countIndex);
    newMessage = newMessage + squad.playerCount
    newMessage = newMessage + content.substring(squad.countIndex + 1, content.length);

    const embed = new RichEmbed()
    .setTitle(currentMessage.embeds[0].title)
    .setColor(client.baseConfig.colour)
    .setDescription(newMessage);

    await currentMessage.edit(embed);
}

function createEmbed(client, title, content) {
    const { Client, RichEmbed } = require('discord.js');
    return new RichEmbed()
    .setTitle(title)
    .setColor(client.baseConfig.colour)
    .setDescription(content);
}

//This code is run when "Help" is used to get info about this command
exports.help = (client, message) => {
    const { Client, RichEmbed } = require('discord.js');
    
    const helpMessage = `Kicks a nuisance user from one squad, or all squads you're hosting. 

(Make sure you tag the user correctly, as if you were @'ing them in a conversation)

Usage, single-squad kick: ${client.baseConfig.prefix}Kick <squad ID> @userName
OR kick from all your squads: ${client.baseConfig.prefix}Kick @userName`;

    const embed = new RichEmbed()
    .setTitle('Help for Kick')
    .setColor(client.baseConfig.colour)
    .setDescription(helpMessage);

    message.channel.send(embed);
};