const Discord = require("discord.js");

exports.run = async (client, message) => {

  const f = client.emojis.find(emoji => emoji.name === "error");

  if (!message.member.hasPermission("ADMINISTRATOR"))
    return message.channel.send(f + ' | Você não tem permissão para executar esse comando!')

  const a = client.emojis.find(emoji => emoji.name === "errorbot");
  const b = client.emojis.find(emoji => emoji.name === "vefbot");
  const c = client.emojis.find(emoji => emoji.name === "loadbot");

  const embedError = new Discord.RichEmbed()
    .setDescription(a + " | Desculpe, você não tem permissão de desbanir usuários neste servidor!")
    .setColor("#e0000f")
  const embedError1 = new Discord.RichEmbed()
    .setDescription(a + " | Eu não tenho permissão para desbanir usuários nesse servidor.")
    .setColor("#e0000f")
  const embedError2 = new Discord.RichEmbed()
    .setDescription(a + " | Não há usuários banidos neste servidor")
    .setColor("#e0000f")
  
    if(!message.member.hasPermission("BAN_MEMBERS", false, true, true)) {
        message.channel.send(embedError);
    }
  
    if (!message.guild.me.hasPermission("BAN_MEMBERS", false, true)) {
        message.reply(embedError1);
    }
  
    let bannedUsers = await message.guild.fetchBans().catch(()=>{});
  
    let size = bannedUsers.size;
  
    if (!size) {
        message.channel.send(embedError2);
        return 0;
    }

    await message.channel.send(c + ` | Começando ::: 0/${size}`).then(async m => {
        let i = 0;
        for (var user of bannedUsers.values()) {
            await m.guild.unban(user).then(() => {
                ++i;
                if (i % 10 === 0) {
                    m.edit(c + ` | Faltam: ${i}/${size}`).catch(console.error);
                }
            }).catch(()=>{});
        }
        m.edit(b + " | Pronto");
    }).catch(err => console.log(err));
};