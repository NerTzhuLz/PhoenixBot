exports.permissions = (client) => {
    return perms = {
        botChannel: false,
        adminBotChannel: false,
        role: client.perms.dev
    }
}

exports.run = (client, message, args) => {
    message.channel.send('Creating a squad for things').then(msg => {
        msg.react('👍')
        .then(() => msg.react('👎'));
    });

    let userID = '497654500371202069';
    message.channel.send(`Hey, <@${userID}>`)
    .then(msg => {
        msg.delete();
      })
      .catch(/*Your Error handling if the Message isn't returned, sent, etc.*/);
    
    message.delete();
};

//exports.help = (client, message) => {};
