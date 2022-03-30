# Bot Permissions and Scopes

Scopes: bot, applications.commands
Permissions: Read Messages/View Channels, Send Messages, Connect, Speak

# Music-Bot

To use this music bot, you must create a bot through the discord developer portal.
Once that is done, you need to create a "config.json" file and include "token", "clientId", and "guildId" in the file in order for the bot to work.

The client ID and the bot's token can be found on your developer portal once the bot is created.
The guild ID can be found through discord itself, you will need to turn on developer mode in the discord app (This can be found in user settings - advanced, "developer mode").
Once developer mode is turned on you simply need to right click on your server's icon and click "Copy ID".

Once everything is set up, and you have installed all dependencies, you will have to run "node src/deploy-commands.js" while in the directory of the bot.
This registers the commands to your bot so that they can be used in the server.

If you choose to make more commands, or event handlers, they need to be put in either the "commands" or "events" folders respectively.
This bot is made modular enough that new functionality can be added if you so choose.
Functionality does not necessarily need to be for music playing, as the discord api allows for all sorts of fun and cool stuff.

THIS BOT IS NOT TO BE USED IN A MANNER OTHER THAN FOR USE IN YOUR OWN DISCORD SERVER. DO NOT USE THIS SOFTWARE TO CREATE A DISTRIBUTED BOT. PLEASE ONLY USE THIS SOFTWARE TO CREATE A BOT FOR YOUR OWN SERVER.

YouTube has shut down the big, distributed music bots. Do not follow in their footsteps, instead, create your own bot and use this software to enjoy the bot yourself.

With that all being said, enjoy the tunes!
