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

    const LobbyArrayKeys = client.lobbyDB.indexes;

    fs.writeFile("./dumps/lobbyDumpKeys.json", JSON.stringify(LobbyArrayKeys,null,4), (err) => console.error);

    const LobbyArrayVals = client.lobbyDB.array();

    fs.writeFile("./dumps/lobbyDumpValues.json", JSON.stringify(LobbyArrayVals,null,4), (err) => console.error);



    const RelicArrayKeys = client.DBEnmap.indexes;

    fs.writeFile("./dumps/relicDumpKeys.json", JSON.stringify(RelicArrayKeys,null,4), (err) => console.error);

    const RelicArrayVals = client.DBEnmap.array();

    fs.writeFile("./dumps/relicDumpValues.json", JSON.stringify(RelicArrayVals,null,4), (err) => console.error);

    console.log("Database saved to file");

};

