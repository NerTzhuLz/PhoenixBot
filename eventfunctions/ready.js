const Enmap = require('enmap');
const DBEnmap = new Enmap({ name: 'DB' });

exports.onReady = async (client) => {
    await DBEnmap.defer;
    console.log(`\nLoaded ${DBEnmap.size} keys from database`);
    client.DBEnmap = DBEnmap;
    console.log(`\n${client.identity.name} online`);
}