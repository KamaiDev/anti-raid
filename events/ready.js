module.exports = async bot => {
  console.log("Bot iniciado com " + bot.users.size + " usuários, em " + bot.channels.size + " canais de " + bot.guilds.size + " servidores.");
  console.log(`Bot invite: https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot`);

  const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time);
  });
  
  var i;
  console.log("☀ " + bot.user.username + " ☀");

  for (i = 0; i < 10; ) {
    bot.user.setPresence({
      game: {
        name: `Dev Baitola`,
        url: "https://www.twitch.tv/notdev",
        type: 1
      }
    });
     
    await sleep(20000);
    
    bot.user.setPresence({
      game: {
        name: "Sou Lindo",
        url: "https://www.twitch.tv/notdev",
        type: 1
      }
    });
    
    await sleep(20000);

    bot.user.setPresence({
      game: {
        name: `${bot.users.get('643499869612277782').username} Lindão`,
        url: "https://www.twitch.tv/notdev",
        type: 1
      }
    });
    
    await sleep(20000);
    
    bot.user.setPresence({
      game: {
        name: `Proteção Free :)`,
        url: "https://www.twitch.tv/notdev",
        type: 1
      }
    });

    await sleep(20000);
    
    bot.user.setPresence({
      game: {
        name: `:) Dev no Topo`,
        url: "https://www.twitch.tv/notdev",
        type: 1
      }
    });
    
    await sleep(20000);
  }
};
