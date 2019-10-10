exports.permissions = (client) => {
    return perms = {
        botChannel: true,           //If true, bot only responds in bot channels
        adminBotChannel: false,     //If true, bot only responds in admin bot channels
        role: client.perms.user     //Last word specifies permission level needed to use this command
    }
}

//This code is run when the command is executed
exports.run = (client, message, args) => {

    let relics = client.DBEnmap.indexes;
    
    let sendMessage = "List of relics:\n"
    let lithRelics = [];
    let mesoRelics = [];
    let neoRelics = [];
    let axiRelics = [];
    let junk = [];

    let first3 = "";
    let first4 = "";

    for (let i = 0; i < relics.length; i++) {
        first3 = relics[i].substring(0,3);
        first4 = relics[i].substring(0,4);

        if (first4 == 'Lith') {
            lithRelics.push(relics[i].substring(5,relics[i].length));
        } else if (first4 == 'Meso') {
            mesoRelics.push(relics[i].substring(5,relics[i].length));
        } else if (first3 == 'Neo') {
            neoRelics.push(relics[i].substring(4,relics[i].length));
        } else if (first3 == 'Axi') {
            axiRelics.push(relics[i].substring(4,relics[i].length));
        } else {
            junk.push(relics[i]);
        }
    }

    sendMessage += `Lith:\n`;
    for (let i = 0; i < lithRelics.length; i++) {
        if (i != lithRelics.length - 1) {
            sendMessage += `${lithRelics[i]}, `;
        } else {
            sendMessage += `${lithRelics[i]}\n\n`;
        }
    }

    sendMessage += `Meso:\n`;
    for (let i = 0; i < mesoRelics.length; i++) {
        if (i != mesoRelics.length - 1) {
            sendMessage += `${mesoRelics[i]}, `;
        } else {
            sendMessage += `${mesoRelics[i]}\n\n`;
        }
    }

    sendMessage += `Neo:\n`;
    for (let i = 0; i < neoRelics.length; i++) {
        if (i != neoRelics.length - 1) {
            sendMessage += `${neoRelics[i]}, `;
        } else {
            sendMessage += `${neoRelics[i]}\n\n`;
        }
    }

    sendMessage += `Axi:\n`;
    for (let i = 0; i < axiRelics.length; i++) {
        if (i != axiRelics.length - 1) {
            sendMessage += `${axiRelics[i]}, `;
        } else {
            sendMessage += `${axiRelics[i]}\n\n`;
        }
    }

    if (junk.length > 0) {
    sendMessage += `Random junk (How did this even get in here?):\n`;
        for (let i = 0; i < junk.length; i++) {
            if (i != junk.length - 1) {
                sendMessage += `${junk[i]}, `;
            } else {
                sendMessage += `${junk[i]}\n`;
        }
    }
}
    
    message.channel.send(sendMessage);
};

//This code is run when the help command is used to get info about this command
exports.help = (client, message) => {
    message.channel.send(`Help for ListRelics:
Displays a list of all relics in the database

Usage: ${client.baseConfig.prefix}ListRelics`);
};