const Discord = require("discord.js");
const db = require("megadb");

let PrefixDB = new db.crearDB("Prefix");
let ModLogDB = new db.crearDB("ModLog");

exports.run = async (client, message, args) => {
  
  const f = client.emojis.find(emoji => emoji.name === "errorbot");

  if (message.author.id !== message.guild.owner.user.id)
    return message.channel.send(f + " | Você não tem permissão para executar esse comando! ( Exclusivo para o dono do servidor )"); 

  const command = args[0]

  if (!PrefixDB.tiene(`${message.guild.id}`))
    PrefixDB.establecer(`${message.guild.id}`, {
      name: message.guild.name,
      owner: message.guild.owner.user.id,
      prefix: "&"
    });
  
  if (!ModLogDB.tiene(`${message.guild.id}`))
    ModLogDB.establecer(`${message.guild.id}`, {
      name: message.guild.name,
      owner: message.guild.owner.user.id,
      channel: "No"
    });
  
  const prefix  = await PrefixDB.obtener(`${message.guild.id}.prefix` );
  let modlog    = await ModLogDB.obtener(`${message.guild.id}.channel`);
  let cu1     = await client.channels.get(modlog)
  if(cu1 === undefined) cu1 = "Não Definido";
  let cuF     = cu1.name;
  if(cuF === undefined) cuF = "Não Definido";
  
  const embed1 = new Discord.RichEmbed()
    .setDescription("**Configurações Atuais**")
    .addField("Canal Definido:", '`' + cuF + '`')
    .setColor("#e0000f")

  if (command === 'info') return message.channel.send(embed1);

  if(!command) {
    message.channel.send(`Use \`${prefix}modlog help\` para saber mais!`)
  }

  if (command === "channel") {
    
  const cu   = message.mentions.channels.first();
  if(!cu) return message.channel.send(f + " | Você precisa fornecer um canal para receber as notificações de banimentos.")
  const chan = message.guild.channels.get(cu.id);
  
  const embed = new Discord.RichEmbed()
    .setDescription("**Configurações Atualizadas**")
    .addField("Canal Definido:", '`' + chan.name + '`')
    .setColor("#e0000f")
  
    ModLogDB.set(`${message.guild.id}.channel`, cu.id) &&
    message.channel.send(embed)
  }
  
  if (command === 'help') {

    const embedHelp = new Discord.RichEmbed()
    .setDescription("**ModLog Ajuda**")
    .addField("Comandos:",
              "• **info** -> Mostra o canal configurado para o ModLog. \n" +
              "• **channel <#canal>** -> Define o canal de ModLog."
             )

      message.channel.send(embedHelp)
  }
};
