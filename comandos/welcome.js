const Discord = require("discord.js");
const db = require("megadb");
const config = require('../config.json')

let ChannelDB = new db.crearDB("Channel");

module.exports.run = async (client, message, args) => {
  
  const f = client.emojis.find(emoji => emoji.name === "errorbot");

  if (!message.member.hasPermission("MANAGE_CHANNELS"))
    return message.channel.send(f + ' | Você não tem permissão para executar esse comando!')

  const command = args[0]
  const subCommand = args[1]
  if(!command) return message.channel.send(f + ' | Você precisa fornecer o subcomando que deseja usar! Exemplo: `' + config.prefix + 'welcome info`')
  const argsCommand = args.slice(1).join(" ");
  console.log(argsCommand)

  if (command === 'info') {

    if (!ChannelDB.tiene(`${message.guild.id}`))
      ChannelDB.establecer(`${message.guild.id}`, {
        channel: 'No',
        message: '<a:corabot:668157639368376371> | {member} Seja bem-vindo(a) ao nosso servidor!',
        status: 'Off'
      });

    const stats = await ChannelDB.obtener(`${message.guild.id}.status`);
    const msg = await ChannelDB.obtener(`${message.guild.id}.message`);
    const chan = await ChannelDB.obtener(`${message.guild.id}.channel`);

    const embed = new Discord.RichEmbed()
      .setDescription("**Configurações Atuais**")
      .addField("Canal Definido:", chan + ' ::: <#' + chan + '>')
      .addField("Mensagem Definida:", msg)
      .addField("Status Definido:", `${stats === 'On' ? '<:on:683350072834129961>' : '<:off:683351063637917698>'}`)
      .setColor("#e0000f")

    message.channel.send(embed)

  }

  if (command === 'canal') {

    if (!ChannelDB.tiene(`${message.guild.id}`))
      ChannelDB.establecer(`${message.guild.id}`, {
        channel: 'No',
        message: '<a:corabot:668157639368376371> | {member} Seja bem-vindo(a) ao nosso servidor!',
        status: 'Off'
      });

    let id = argsCommand

    if (!id) return message.channel.send(f + ' | Você não forneceu um canal!')
    if (id == null) return message.channel.send(f + ' | O id do canal fornecido não é válido!')
    if (isNaN(Number(id))) return message.channel.send(f + ' | O id do canal fornecido não é um número ou não é válido!')

    const embed = new Discord.RichEmbed()
      .setDescription("**Mensagem de boas-vindas setada com sucesso no canal <#" + id + "> !!**")
      .setColor("#e0000f")

    ChannelDB.set(`${message.guild.id}.channel`, id).then(
      message.channel.send(embed)
    )
  }

  if (command === 'mensagem') {

    if (!ChannelDB.tiene(`${message.guild.id}`))
      ChannelDB.establecer(`${message.guild.id}`, {
        channel: 'No',
        message: '<a:corabot:668157639368376371> | {member} Seja bem-vindo(a) ao nosso servidor!',
        status: 'Off'
      });

    if(argsCommand.length >= 600) return message.channel.send(f + ' A mensagem não deve ser maior que 600 caracteres')
    if(!argsCommand) return message.channel.send(f + ' | Forneça uma mensagem!')  
    if(argsCommand == null) return message.channel.send(f + ' | A mensagem de boas-vindas não é válida!')  
    if(!message.content.includes("{member}")) return message.channel.send(f + ' | Você precisa usar a menção do usuário colocando `{member}` em meio ao texto')


    const embed = new Discord.RichEmbed()
      .setDescription("**Mensagem de boas-vindas definida com sucesso!!**")
      .addField("**Mensagem definida:**", "`" + argsCommand + "`")
      .setColor("#e0000f")

    ChannelDB.set(`${message.guild.id}.message`, argsCommand).then(
      message.channel.send(embed)
    );
  }

  if (command === 'ativar') {

    if (!ChannelDB.tiene(`${message.guild.id}`))
      ChannelDB.establecer(`${message.guild.id}`, {
        channel: 'No',
        message: '<a:corabot:668157639368376371> | {member} Seja bem-vindo(a) ao nosso servidor!',
        status: 'Off'
      });

    const stats = await ChannelDB.obtener(`${message.guild.id}.status`);
    const chan = await ChannelDB.obtener(`${message.guild.id}.channel`);
    if (chan === 'No') return message.channel.send(f + ' | Antes de ativar o status **On/Off**, informe o canal que deseja enviar a mensagem!')

    const embed = new Discord.RichEmbed()
      .setDescription("**Mensagem de boas-vindas `ligada` com sucesso!!**")
      .setColor("#e0000f")
  
    if (stats === 'Off') {
      ChannelDB.set(`${message.guild.id}.status`, 'On').then(
        message.channel.send(embed)
      )
    }
  }

  if(command === "desativar") {
    
    const embed1 = new Discord.RichEmbed()
      .setDescription("**Mensagem de boas-vindas `desligada` com sucesso!!**")
      .setColor("#e0000f")

    const stats = await ChannelDB.obtener(`${message.guild.id}.status`);
    
    if (stats === 'On') {
      ChannelDB.set(`${message.guild.id}.status`, 'Off').then(
        message.channel.send(embed1)
      )
    }
  }
  
  if(command === "help") {
    
    const embed = new Discord.RichEmbed()
       .setDescription(
          "• **info** -> Mostra as configurações atuais do módulo de boas-vindas.\n" +
          "• **mensagem <mensagem de boas-vindas> -> Configura a mensagem de boas-vindas.\n" +
          "• **canal <ID>** -> Configura o canal do módulo de boas-vindas.\n" +
          "• **ativar/desativar** -> Ativa/Desativa a mensagem de boas-vindas no servidor."
       )
  }
}
