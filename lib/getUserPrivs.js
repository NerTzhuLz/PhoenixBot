exports.run = (message, client) => {
    //return the privs number of the user
    let privs = 0;
    const devUsers = require("../config/devUsers.json");
    //check if dev user
    if (devUsers.includes(message.author.id)) return 50;

    //check through each permission level
    for (var perm in client.config.get('perms')) {
        perm = client.config.get('perms')[perm];
        //if this level is better than one we've already confirmed,
        if (perm.privs > privs) {
            //check if the users meets this level
            if (message.member.roles.some(role=>perm.roles.includes(role.id))) {
                privs = perm.privs;
            }
        }
    };
    return privs;
}