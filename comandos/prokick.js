const Discord = require("discord.js");
const db = require("megadb");

let KickDB = new db.crearDB("ProKick");
let UserDB = new db.crearDB("User");

exports.run = async (client, message, args) => {

  const f = client.emojis.find(emoji => emoji.name === "error");
  const on = client.emojis.find(emoji => emoji.name === "onbot");
  const off = client.emojis.find(emoji => emoji.name === "dndbot");

  if (message.author.id !== message.guild.owner.user.id)
   return message.channel.send(f + " | Você não tem permissão para executar esse comando! ( Exclusivo para o dono do servidor )");

  if (!KickDB.tiene(`${message.guild.id}`))
    KickDB.establecer(`${message.guild.id}`, {
      name: message.guild.name,
      id: message.guild.id,
      limit: 0,
      message: 'Proteção contra raid ativada! O usuário {member} foi banido com sucesso.',
      status: 'Off'
    });

  if (!UserDB.tiene(`${message.author.id}`))
    UserDB.establecer(`${message.author.id}`, {
      name: message.author.tag,
      id: message.author.id,
      count: 0,
      countK: 0
    });

  let countK = await UserDB.obtener(`${message.author.id}.countK`);
  let limit = await KickDB.obtener(`${message.guild.id}.limit`);
  let status = await KickDB.obtener(`${message.guild.id}.status`);
  let msg = await KickDB.obtener(`${message.guild.id}.message`);


  const embed = new Discord.RichEmbed()
    .setDescription("**Configurações Atualizadas**")
    .addField("Mensagem:", '`' + msg + '`')
    .addField("Limite:", '`' + limit + '`')
    .addField("Status:", `${status === 'On' ? off : on}`)
    .setColor("#e0000f")
  const embed2 = new Discord.RichEmbed()
    .setDescription("**Configurações Atuais**")
    .addField("Mensagem:", '`' + msg + '`')
    .addField("Limite:", '`' + limit + '`')
    .addField("Status:", `${status === 'On' ? on : off}`)
    .setColor("#e0000f")
  const embedError = new Discord.RichEmbed()
    .setDescription("**Erro! O limite de kicks deve ser apenas números.**")
    .setColor("#e0000f")
  const embedError1 = new Discord.RichEmbed()
    .setDescription("**Erro! O limite de kicks não pode exceder 10 kickss seguidos.**")
    .setColor("#e0000f")
  const embedError2 = new Discord.RichEmbed()
    .setDescription("**Erro! O módulo de proteção contra raid já está `" + status + '`**')
    .setColor("#e0000f")
  const embedError3 = new Discord.RichEmbed()
    .setDescription("**Erro! O limite de kicks não pode ser menor que 1 kick seguido.**")
    .setColor("#e0000f")
  
  const command = args[0]
  const argsCommand = args.slice(1).join(" ");

  if (command === 'ativar') {

  if(status === 'On') return message.channel.send(embedError2)

  if(status === 'Off') {
    KickDB.set(`${message.guild.id}.status`, 'On').then(
      message.channel.send(embed)
      )
    }
  }
  
  if (command === 'desativar') {

  if(status === 'Off') return message.channel.send(embedError2)

  if(status === 'On') {
    KickDB.set(`${message.guild.id}.status`, 'Off').then(
      message.channel.send(embed)
      )
    }
  }

  if (command === 'setLimit') {

    if(isNaN(Number(argsCommand))) return message.channel.send(embedError)
    if(argsCommand >= 11) return message.channel.send(embedError1)
    if(argsCommand <= 0) return message.channel.send(embedError3)

    const embedur = new Discord.RichEmbed()
    .setDescription("**Configurações Atualizadas**")
    .addField("Mensagem:", '`' + msg + '`')
    .addField("Limite:", '`' + argsCommand + '`')
    .addField("Status:", `${status === 'On' ? on : off}`)
    .setColor("#e0000f")

    KickDB.set(`${message.guild.id}.limit`, argsCommand).then(
      message.channel.send(embedur)
      )
    }

  if (command === 'lastKick') {
    
  const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 5,
		type: 'MEMBER_BAN',
	    });

  const kickLog = fetchedLogs.entries.first();

  const { executor, target } = kickLog;
  
  const embed1 = new Discord.RichEmbed()
    .setDescription("**Log de Kick Recente**")
    .addField("Staff:", '`' + executor.tag + '`')
    .addField("Usuário:", '`' + target.tag + '`')
    .setColor("#e0000f")

  message.channel.send(embed1)
    }

  if (command === 'info') {
      message.channel.send(embed2)
    }

  if (command === 'user') {

  let user = message.mentions.users.first() || client.users.get(argsCommand) || message.author;

  let count = await UserDB.obtener(`${user.id}.count`);

  const embed3 = new Discord.RichEmbed()
    .setDescription("**Configurações Atuais**")
    .addField("Usuário:", '`' + user.tag + '`')
    .addField("Contagem:", '`' + countK + '`')
    .setColor("#e0000f")

      message.channel.send(embed3)
    }
  
  if (command === 'userReset') {

  let user = message.mentions.users.first() || client.users.get(argsCommand) || message.author;

    UserDB.set(`${user.id}.count`, 0).then(
      message.channel.send(':thumbsup:')
      )
    }

  if (command === 'help') {

    const embedHelp = new Discord.RichEmbed()
      .setDescription("**ProKick Ajuda**")
      .addField("Comandos:",
                "• **info** -> Mostra as configurações do ProKick.\n" +
                "• **user <@user/ID>** -> Mostra a contagem de kicks do ProKick.\n" +
                "• **userReset <@user/ID>** -> Reseta a contagem do usuário desejado.\n" +
                "• **lastKick** -> Mostra o log de kicks recentes.\n" +
                "• **setLimit** -> Define a quantia de kicks necessários para punir o usuário.\n" +
                "• **ativar/desativar** -> Ativa/Desativa o módulo de proteção contra kicks."
             )

      message.channel.send(embedHelp)

    }
  }
 