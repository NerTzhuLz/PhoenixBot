exports.permissions = (client) => {
    return perms = {
        botChannel: true,
        adminBotChannel: false,
        role: client.perms.user
    }
}

exports.run = (client, message, args) => {
    message.channel.send("pong!");
};

exports.help = (client, message) => {
    message.channel.send(`Help for Ping:
Checks if the bot is awake. Not much else.

Usage: /ping`);
    //message.channel.send(`${this.permissions(client).botChannel}`)
};

