exports.permissions = (client) => {
    return perms = {
        botChannel: true,
        adminBotChannel: true,
        role: client.perms.dev
    }
}

exports.run = (client, message, args) => {
    //check if a command name has been given
    if(!args || args.length < 1) return message.reply("Must provide a command name to reload.");
    const commandName = args[0];

    //check if the command exists
    if(!client.commands.has(commandName)) {
        return message.reply("That command does not exist. Are you trying to use Load?");
    }

    //get rid of the old command
    delete require.cache[require.resolve(`./${commandName}.js`)];
    client.commands.delete(commandName);

    //load the new one
    console.log(`Reloading ${commandName}, authorised by ${message.author.username}`)
    const props = require(`./${commandName}.js`);
    client.commands.set(commandName, props);
    message.reply(`The command ${commandName} has been reloaded`);
};

exports.help = (client, message) => {
    message.channel.send("Help for reload")
};