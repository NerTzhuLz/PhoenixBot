const Enmap = require('enmap');
const DBEnmap = new Enmap({ name: 'DB' });
const lobbyDB = new Enmap({ name: 'lobbyDB' });

exports.onReady = async (client) => {
    await DBEnmap.defer;
    console.log(`\nLoaded ${DBEnmap.size} relics from database`);
    client.DBEnmap = DBEnmap;

    await lobbyDB.defer;
    if (!lobbyDB.has('nextLobby')) {
        console.log('Lobby counter not found - setting to 0');
        lobbyDB.set('nextLobby', 0);
    }
    console.log(`Loaded ${lobbyDB.size-1} squad indicators`);
    client.lobbyDB = lobbyDB;

    console.log(`\n${client.identity.name} online`);
}