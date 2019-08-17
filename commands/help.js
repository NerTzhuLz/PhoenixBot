exports.permissions = (client) => {
    return perms = {
        botChannel: true,
        adminBotChannel: false,
        role: client.perms.user
    }
}

exports.run = (client, message, args) => {

    //check for args
    if (args.length < 1 || args == undefined) {
        message.channel.send("Help info:");
        //loop through all commands
        //if you have high enough perms to use it, add it to a string to send
        //IF IT HAS HELP OPTIONS
    } else {
        const commandName = args[0];
        const cmd = client.commands.get(commandName);

        if (!cmd) {
            message.channel.send("Command not found");
            return;
        }

        if (cmd.help) {
            cmd.help(client, message);
        } else {
            message.channel.send("Oops, that command exists but doesn't have help info yet. Harrass the devs.\n(Please don't actually)")
        }
    }
};

exports.help = (client, message) => {
    message.channel.send("Help for: Help");
};
