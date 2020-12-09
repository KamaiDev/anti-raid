const Discord = require("discord.js");

exports.run = async (client, message) => {

  const f = client.emojis.find(emoji => emoji.name === "error");

  if (!message.member.hasPermission("ADMINISTRATOR"))
    
