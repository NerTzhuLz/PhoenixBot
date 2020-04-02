exports.onLeave = (client, member) => {

    console.log(`${member.displayName} left the server, purging ${member.id} from DB`);
    let logChannel = client.channels.find(channel => channel.id === client.channelConfig.logChannel);
    logChannel.send(`${member.displayName} left the server.`);

    let relics = client.DBEnmap.indexes;
    let myRelics = [];

    //for each relic name
    for (let i = 0; i < relics.length; i++) {
        //see if user is subscribed
        if(client.DBEnmap.get(relics[i]).includes(member.id)) {
            myRelics.push(relics[i]);
        }
    }

    if (myRelics.length > 0) {
        //remove user from array in DB
        for (let relic of myRelics) {
            client.DBEnmap.remove(relic, member.id);
        }
        console.log(`Removed ${myRelics.length} subscriptions`)
    } else {
        //no relics for that user
        console.log(`No relics found for ${member.displayName}`)
    }

}