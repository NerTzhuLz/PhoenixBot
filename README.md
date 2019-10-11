# WispBot
Relic-tagging bot for Relic Burners


## Current Commands/features
Admin-level commands:
    CreateRelic
        Adds a new relic/list of relics to the database (for if a new one is vaulted)
        Only allows relics to have the form described below this command list
    DeleteRelic
        Deletes a relic/list of relics and their associated user subscriptions from the database (for if someone screwed up and added a relic that they shouldn't have)
        Can only delete relics that are already in the database
        Doesn't break if told to delete a relic that doesn't exist
    RelicUsers
        Shows a list of users that are subscribed to a relic/list of relics (Probably not really much use)
    Kill
        Shuts the bot down, has to be restarted by the host (for if it somehow starts breaking in some way that hurts the server/users)

User-level commands:
    AddRelic
        Subscribes a user to a relic/list of relics so that people hosting it can ping them
        Only adds relics that exist in the database that the user doesn't already have
    RemoveRelic
        Unsubscribes a user from a relis/list of relics
        Doesn't break if asked to remove a relic that doesn't exist/the user doesn't have, just does nothing
    MyRelics
        Shows a list of the relics a user is subscribed to
    ListRelics
        Shows a list of relics that can be subscribed to
    Help
        Provides a list of available commands, or shows a how-to for a specific command
    Create
        Creates a hosting message, automatically detects vaulted relics and pings everyone subscribed to one of those relics
        Pings everyone ONCE, even if they are subscribed to multiple relics in the list
        Bolds/underlines relic names that people have been pinged for

Dev-level commands (That are related to the server):
    ImportRelics
        Imports all relics in "relics.json" into the database. Should only need to use this once ever unless...
    PurgeDB
        Wipes everything. Not meant to be used lightly. 


All functions that detect the names of relics will work with any capitalisation/lack of spaces 
as long as the relics have an era (Lith/Meso etc.) followed by a single letter and then at least one (but maybe more) number/s

## To be Completed
Figure out hosting

Create
    Help message
    Squads
        Detect X/4
        Allow users to update the squad population somehow
        Somehow automate?
            Lobby numbers?
    Limit Create to recruiting channel



Possible expansion:
    Make "create" command respond to any message that isn't a command instead
    Mass ping using global list
        automatically starts pinging when new users are added
        new players to ping are just added to the list
    Automatically make/delete a certain number of roles for most popular relics
    Use some kind of API to post fissure updates
    Limit pings based on current fissures



Setup:
    Bot needs access to these channels:
        Recruiting
        Bot spam
        (If it exists) Admin bot channel (Unless they just want to use the admin/dev-level commands in the public bot-spam)

    Bot needs following permissions in those channels:
        Read messages
        Send messages
        Manage messages (Maybe not so much in the bot-spam channels, but definitely in recruiting)
        Read message history
        Add reactions? (not sure on this yet)

    Bot needs information: 
        ID's for these channels (If admin bot channel exists I could just ask for access? Or walk someone else through developer mode)
        ID's for whichever roles are allowed access to the admin-level commands (dev-level too?)