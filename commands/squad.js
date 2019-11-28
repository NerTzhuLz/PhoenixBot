//If something needs to know the permissions for this command, it looks here
exports.permissions = (client) => {
    return perms = {
        botChannel: true,           //If true, bot only responds in bot channels
        adminBotChannel: false,     //If true, bot only responds in admin bot channels
        role: client.perms.user     //Last word specifies permission level needed to use this command
    }
}

//This code is run when the command is executed
exports.run = (client, message, args) => {

    let squad = parseInt(args[0], 10).toString();
    
    if (!(squad < 100 && squad >= 0)) {
        message.channel.send("Please enter a valid squad ID");
        return;
    }

    if (!client.lobbyDB.has(squad)) {
        message.channel.send("Squad does not exist");
        return;
    }

    thisSquad = client.lobbyDB.get(squad);

    if (!thisSquad.open && thisSquad.playerCount < 4) {
        message.channel.send(`Squad ${squad} has been closed`);
        return;
    }

    hostName = message.guild.members.get(thisSquad.hostID).displayName;

    let playerNames = [];

    for (let memberID of thisSquad.joinedIDs) {
        playerNames.push(message.guild.members.get(memberID).displayName);
    }

    if (playerNames.length == 0) {
        playerNames = "(None)";
    }
    

    message.channel.send(`Squad info for squad ${squad}:
Current player count: ${thisSquad.playerCount}
Hosted by: ${hostName}
Current players: ${playerNames}`);

};

//This code is run when "Help" is used to get info about this command
exports.help = (client, message) => {
    message.channel.send(`Help for squad:
Displays information about one squad.

Usage: ${client.baseConfig.prefix}squad <ID>`);
};