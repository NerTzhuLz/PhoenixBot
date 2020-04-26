//If something needs to know the permissions for this command, it looks here
exports.permissions = (client) => {
    return perms = {
        botChannel: true,           //If true, bot only responds in bot channels
        adminBotChannel: true,     //If true, bot only responds in admin bot channels
        role: client.perms.dev     //Last word specifies permission level needed to use this command
    }
}

//This code is run when the command is executed
exports.run = (client, message, args) => {

    let customStatus = {
        status: 'online',
        afk: false,
        game: {
            type: 2,
            name: "++guide"
        }
    }

    client.user.setPresence(customStatus)
    .catch(console.error);

};