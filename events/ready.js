module.exports = (client) => {
    const eventFunc = client.eventFuncs.get("ready");
    eventFunc.onReady(client);
};