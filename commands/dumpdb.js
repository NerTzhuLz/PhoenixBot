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

    let lobbyArray = [];

    for (let key of LobbyArrayKeys) {
        let lobbyObject = {
            squadID: key,
            squad: client.lobbyDB.get(key)
        }

        lobbyArray.push(lobbyObject);
    }

    fs.writeFile("./dumps/SquadDump.json", JSON.stringify(lobbyArray,null,4), (err) => console.error);

    

    const RelicArrayKeys = client.DBEnmap.indexes;

    let relicArray = [];

    for (let key of RelicArrayKeys) {
        let relicObject = {
            relic: key,
            data: client.DBEnmap.get(key)
        }

        relicArray.push(relicObject);
    }

    fs.writeFile("./dumps/RelicDump.json", JSON.stringify(relicArray,null,4), (err) => console.error);

    console.log("Database saved to file");

};

