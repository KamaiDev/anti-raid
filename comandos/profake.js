  const db = require('megadb')
  const Discord = require('discord.js')

  let FakeDB = new db.crearDB("ProFake");

exports.run = async (client, message, args) => {

  const f = client.emojis.find(emoji => emoji.name === "error");
  const on = client.emojis.find(emoji => emoji.name === "onbot");
  const off = client.emojis.find(emoji => emoji.name === "dndbot");

  if (message.author.id !== message.guild.owner.user.id)
    return message.channel.send(f + " | Você não tem permissão para executar esse comando! ( Exclusivo para o dono do servidor )");

  if (!FakeDB.has(`${message.guild.id}`))
    FakeDB.set(`${message.guild.id}`, {
      name: message.guild.name,
      id: message.guild.id,
      days: 0,
      message: 'Olá! Você foi kickado automaticamente por suspeita de fake account em nosso servidor.',
      status: 'Off'
    });

  let days   = await FakeDB.get(`${message.guild.id}.days`   );
  let msg    = await FakeDB.get(`${message.guild.id}.message`);
  let status = await FakeDB.get(`${message.guild.id}.status` );

  const embed = new Discord.RichEmbed()
    .setDescription("**Configurações Atualizadas**")
    .addField("Mensagem:", '`' + msg + '`')
    .addField("Dias Necessários:", '`' + days + '`')
    .addField("Status:", `${status === 'On' ? off : on}`)
    .setColor("#e0000f")
  const embed1 = new Discord.RichEmbed()
    .setDescription("**Configurações Atuais**")
    .addField("Mensagem:", '`' + msg + '`')
    .addField("Dias Necessários:", '`' + days + '`')
    .addField("Status:", `${status === 'On' ? on : off}`)
    .setColor("#e0000f")

  let command = args[0];

  let subCommand = args[1];

  if(command === 'info') {

    message.channel.send(embed1)

  }

  if(command === 'ativar') {

  const embedError2 = new Discord.RichEmbed()
    .setDescription("**Erro! O módulo de proteção contra fakes já está `" + status + '`**')
    .setColor("#e0000f")

    if(days === 0) return message.channel.send(f + ` | Antes de ativar a proteção, forneça a quantidade de dias para uma fake ser expulsa.`)
    if(status === 'On') return message.channel.send(embedError2)

  FakeDB.set(`${message.guild.id}.status`, 'On').then(

      message.channel.send(embed)

    )
  }

  if(command === 'desativar') {

  const embedError2 = new Discord.RichEmbed()
    .setDescription("**Erro! O módulo de proteção contra fakes já está `" + status + '`**')
    .setColor("#e0000f")

  if(status === 'Off') return message.channel.send(embedError2)

  FakeDB.set(`${message.guild.id}.status`, 'Off').then(

      message.channel.send(embed)

    )
  }

  if(command === 'setDays') {

   if(isNaN(Number(subCommand))) return message.channel.send(`${f} | A quantidade de dias fornecida não é um número.`)
   if(subCommand >= 31) return message.channel.send(`${f} | A quantidade de dias não pode ser maior que 30 dias.`)
    
  const embedA = new Discord.RichEmbed()
    .setDescription("**Configurações Atuais**")
    .addField("Mensagem:", '`' + msg + '`')
    .addField("Dias Necessários:", '`' + subCommand + '`')
    .addField("Status:", `${status === 'On' ? on : off}`)
    .setColor("#e0000f")

  FakeDB.set(`${message.guild.id}.days`, subCommand).then(

      message.channel.send(embedA)

    )
  }

  if(command === 'help') {

  const embedHelp = new Discord.RichEmbed()
    .setDescription("**ProFake Ajuda**")
    .addField("Comandos:",
              "• **info** -> Mostra as configurações atuais do ProFake.\n" +
              "• **ativar** -> Ativa a proteção contra fakes.\n" +
              "• **desativar** -> Desativa a proteção contra fakes.\n" +
              "• **setDays <quantia de dias>** -> Define os dias necessários para uma fake ser expulsa."
             )

    message.channel.send(embedHelp)

  }
}