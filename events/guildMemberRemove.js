module.exports = (client, member) => {
    const eventFunc = client.eventFuncs.get("guildMemberRemove");
    eventFunc.onLeave(client, member);
};