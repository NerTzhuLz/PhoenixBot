# WispBot
Relic-tagging bot for Relic Burners


## Current Commands/features
Admin-level commands:
* CreateRelic
    * Adds a new relic/list of relics to the database (for if a new one is vaulted)
    * Only allows relics to have the form described below this command list
    * Doesn't break if no good relics are given
* DeleteRelic
    * Deletes a relic/list of relics and their associated user subscriptions from the database (for if someone screwed up and added a relic that they shouldn't have)
    * Can only delete relics that are already in the database
    * Doesn't break if told to delete a relic that doesn't exist
* RelicUsers
    * Shows a list of users that are subscribed to a relic/list of relics (Probably not very useful)
    * Doesn't break if no relics are given
* Kill
    * Shuts the bot down, has to be restarted by the host (for if it somehow starts breaking in some way that hurts the server/users)
    * Always breaks. That's kinda the point. 

User-level commands:
* AddRelic
    * Subscribes a user to a relic/list of relics so that people hosting it can ping them
    * Only adds relics that exist in the database that the user doesn't already have
    * Doesn't break if no good relics are provided
* RemoveRelic
    * Unsubscribes a user from a relic/list of relics
    * Doesn't break if asked to remove a relic that doesn't exist/the user doesn't have, just does nothing
* MyRelics
    * Shows a list of the relics a user is subscribed to
* ListRelics
    * Shows a list of relics that can be subscribed to
* Help
    * Provides a list of available commands, or shows a how-to for a specific command
* Create
    * Creates a hosting message, automatically detects vaulted relics and pings everyone subscribed to one of those relics
    * Pings everyone ONCE, even if they are subscribed to multiple relics in the list
    * Bolds/underlines relic names that people have been pinged for

Dev-level commands (That are related to the server):
* ImportRelics
    * Imports all relics in "relics.json" into the database. Should only need to use this once ever unless you use the next one...
* PurgeDB
    * Wipes everything. Not meant to be used lightly. Probably requires you to use ImportRelics afterwards, unless you really like typing. 


All functions that detect the names of relics will work with any capitalisation/lack of spaces 
as long as the relics have an era (Lith/Meso etc.) followed by a single letter and then at least one (but maybe more) number/s

## To Be Completed
Figure out how to host the bot

### New Commands
* Join - lets people join a squad
    * Multiple at once?
    * Can trigger full squad
* Leave - lets people leave a squad that they are in
    * multiple at once?
    * "All" option?
    * Only leaves squads that are still open
* Squad - lists people in a given squad
    * Host only? 
    * NOT ping - just display names
    * Works with full squads
    * Not closed squads (check player count)


* MySquads - Lists the squads you are waiting on
    * Sections for "Subbed squads", "Hosted squads" and "Full squads"
* Close (host) - lets the host stop more people from joining a squad
    * "All" option
    * Replace squad player count with "X"
    * Cannot close full lobbies
    * Notify subscribers that the squad has closed? 
* Add (host) - Adds one to the players in the squad (if a random joins after a squad is hosted)
    * Add an "Are you sure?" message if this will get the player count to 4?
    * Can trigger full squad
* Remove (host) - Removes one nameless player from the squad
    * Cannot go below the number of people who have used "join" + the host - just to complement "Add"

* If full squad is triggered, @ the people who have joined + host and close the squad

* Guide
    * Link to a page somewhere that explains all the commands and has examples

### After testing
* Enable recruit channel limiting for Create, Join, Leave
* Un-comment message.delete in each of those

### Possible expansion:
* Create the user guide
* Timed deletion of squads somehow
* Mass ping using global list (Stops host messages from competing with each other)
    * automatically starts pinging when new users are added
    * new players to ping are just added to the list
* Automatically make/delete a certain number of roles for most popular relics?
    * Less spam-pinging, requires X number of spare roles. Very far in the future. 
    * Only change roles if there is a significant imbalance
    * While new role is being populated, still mass-ping users instead of using it
* Use some kind of API to post fissure updates
* Limit pings based on current fissures? - Talk to Guthix and other admins about what they want

### Setup 
(Just my notes, not really relevant yet):
* Bot needs access to these channels:
    * Recruiting
    * Bot spam
    * (If it exists) Admin bot channel (Unless they just want to use the admin/dev-level commands in the public bot-spam)

* Bot needs following permissions in those channels:
    * Read messages
    * Send messages
    * Manage messages (Not so much in the bot-spam channels, but definitely in recruiting)
    * Read message history
    * Add reactions? (not sure on this yet)

* Bot needs information: 
    * ID's for these channels (If admin bot channel exists I could just ask for access? Or walk someone else through developer mode)
    * ID's for whichever roles are allowed access to the admin-level commands (dev-level too?)