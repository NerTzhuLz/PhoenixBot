//If something needs to know the permissions for this command, it looks here
exports.permissions = (client) => {
    return perms = {
        botChannel: false,           //If true, bot only responds in bot channels
        adminBotChannel: false,     //If true, bot only responds in admin bot channels
        role: client.perms.dev     //Last word specifies permission level needed to use this command
    }
}

//This code is run when the command is executed
exports.run = (client, message, args) => {
    //code to run goes here
    const fs = require('fs');

    const LobbyArray = client.lobbyDB.array();

    fs.writeFile("./lobbyDump.json", JSON.stringify(LobbyArray,null,4), (err) => console.error);

    const RelicArray = client.DBEnmap.indexes;

    fs.writeFile("./relicDump.json", JSON.stringify(RelicArray,null,4), (err) => console.error);

    console.log("Database saved to file");

};

