//If something needs to know the permissions for this command, it looks here
exports.permissions = (client) => {
    return perms = {
        botChannel: true,           //If true, bot only responds in bot channels
        adminBotChannel: true,     //If true, bot only responds in admin bot channels
        role: client.perms.user     //Last word specifies permission level needed to use this command
    }
}

//This code is run when the command is executed
exports.run = (client, message, args) => {
    let relics = client.DBEnmap.indexes;
    let myRelics = [];

    for (let i = 0; i < relics.length; i++) {
        if(client.DBEnmap.get(relics[i]).includes(message.author.id)) {
            myRelics.push(relics[i]);
        }
    }

    message.channel.send(myRelics);
};

//This code is run when the help command is used to get info about this command
exports.help = (client, message) => {
    message.channel.send(`Help for MyRelics:
Lists the relics you are subscribed to.   

Usage: ${client.baseConfig.prefix}MyRelics`);
};

