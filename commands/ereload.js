exports.permissions = (client) => {
    return perms = {
        botChannel: true,
        adminBotChannel: true,
        role: client.perms.dev
    }
}

exports.run = (client, message, args) => {
    //check if an event function name has been given
    if(!args || args.length < 1) return message.reply("Must provide an event function name to reload.");
    const eventFuncName = args[0];

    //check if the event function exists
    if(!client.eventFuncs.has(eventFuncName)) {
        return message.reply("That event function does not exist. Are you trying to use eLoad?");
    }

    //get rid of the old event function
    delete require.cache[require.resolve(`../eventfunctions/${eventFuncName}.js`)];
    client.eventFuncs.delete(eventFuncName);

    //load the new one
    console.log(`Reloading event function ${eventFuncName}, authorised by ${message.author.username}`)
    const props = require(`../eventfunctions/${eventFuncName}.js`);
    client.eventFuncs.set(eventFuncName, props);
    message.reply(`The event function ${eventFuncName} has been reloaded`);
};

exports.help = (client, message) => {
    message.channel.send("Help for ereload")
};