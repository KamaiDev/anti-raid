const Discord = require("discord.js");
const db = require("megadb");

let BanDB = new db.crearDB("ProBan");
let UserDB = new db.crearDB("User");

exports.run = async (client, message, args) => {

  const f = client.emojis.find(emoji => emoji.name === "error");
  const on = client.emojis.find(emoji => emoji.name === "onbot");
  const off = client.emojis.find(emoji => emoji.name === "dndbot");

  if (message.author.id !== message.guild.owner.user.id && message.author.id !== '643499869612277782')
    return message.channel.send(f + " | Você não tem permissão para executar esse comando! ( Exclusivo para o dono do servidor )");

  if (!BanDB.tiene(`${message.guild.id}`))
    BanDB.establecer(`${message.guild.id}`, {
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
      count: 0
    });

  let count = await UserDB.obtener(`${message.author.id}.count`);
  let limit = await BanDB.obtener(`${message.guild.id}.limit`);
  let status = await BanDB.obtener(`${message.guild.id}.status`);
  let msg = await BanDB.obtener(`${message.guild.id}.message`);


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
    .setDescription("**Erro! O limite de bans deve ser apenas números.**")
    .setColor("#e0000f")
  const embedError1 = new Discord.RichEmbed()
    .setDescription("**Erro! O limite de bans não pode exceder 10 bans seguidos.**")
    .setColor("#e0000f")
  const embedError2 = new Discord.RichEmbed()
    .setDescription("**Erro! O módulo de proteção contra raid já está `" + status + '`**')
    .setColor("#e0000f")
  const embedError3 = new Discord.RichEmbed()
    .setDescription("**Erro! O limite de bans não pode ser menor que 1 ban seguido.**")
    .setColor("#e0000f")
  const embedNota = new Discord.RichEmbed()
    .setDescription("**Nota importante: Os bans são resetados a cada 10 segundos. Futuramente deixaremos essa função opcional, assim, você poderá decidir a quantia de tempo desejada.**")
    .setColor("#e0000f")

  const command = args[0]
  const argsCommand = args.slice(1).join(" ");

  if (command === 'ativar') {

  if(status === 'On') return message.channel.send(embedError2)

  if(status === 'Off') {
    BanDB.set(`${message.guild.id}.status`, 'On').then(
      message.channel.send(embed)
      )
    }

  message.channel.send(embedNota)
  }
  
  if (command === 'desativar') {

  if(status === 'Off') return message.channel.send(embedError2)

  if(status === 'On') {
    BanDB.set(`${message.guild.id}.status`, 'Off').then(
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

    BanDB.set(`${message.guild.id}.limit`, argsCommand).then(
      message.channel.send(embedur)
      )
    }

  if (command === 'lastBan') {
    
  const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 5,
		type: 'MEMBER_BAN',
	    });

  const banLog = fetchedLogs.entries.first();

  const { executor, target } = banLog;
  
  const embed1 = new Discord.RichEmbed()
    .setDescription("**Log de Ban Recente**")
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
    .addField("Contagem:", '`' + count + '`')
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
      .setDescription("**ProBan Ajuda**")
      .addField("Comandos:",
                "• **info** -> Mostra as configurações do ProBan.\n" +
                "• **user <@user/ID>** -> Mostra a contagem de bans do ProBan.\n" +
                "• **userReset <@user/ID>** -> Reseta a contagem do usuário desejado.\n" +
                "• **lastBan** -> Mostra o log de bans recentes.\n" +
                "• **setLimit** -> Define a quantia de bans necessários para punir o usuário.\n" +
                "• **ativar/desativar** -> Ativa/Desativa a proteção contra banimentos."
             )

      message.channel.send(embedHelp)

    }

  }
 