const Discord = require('discord.js')
const config = require("../config.json")
const db = require("megadb")

let PrefixDB = new db.crearDB("Prefix" );
let BanDB    = new db.crearDB("ProBan" );
let UserDB   = new db.crearDB("User"   );
let ProDB    = new db.crearDB("ProBot" );
let FakeDB   = new db.crearDB("ProFake");
let KickDB   = new db.crearDB("ProKick");
let InviteDB = new db.crearDB("Invite" );
let ModLogDB = new db.crearDB("ModLog" );

exports.run = async (client, message, args) => {

    let o = client.users.get("643499869612277782")
    let av = message.author.avatarURL
    let oav = o.avatarURL
    let user = message.author.username
    let botav = client.user.avatarURL
    let botuser = client.user.username
    let servidores = client.guilds.size
    let usuarios = client.users.size

    if (!PrefixDB.tiene(`${message.guild.id}`))
    PrefixDB.establecer(`${message.guild.id}`, {
      name: message.guild.name,
      owner: message.guild.owner.user.id,
      prefix: "&"
    });
  
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
  
    if (!ProDB.tiene(`${message.guild.id}`))
    ProDB.establecer(`${message.guild.id}`, {
      name: message.guild.name,
      owner: message.guild.owner.user.id,
      message:
        "Proteção ativada! O bot ( {bot} ) adicionado foi expulso com sucesso!",
      status: "Off"
    });
  
    if (!FakeDB.has(`${message.guild.id}`))
    FakeDB.set(`${message.guild.id}`, {
      name: message.guild.name,
      id: message.guild.id,
      days: 0,
      message: 'Olá! Você foi kickado automaticamente por suspeita de fake account em nosso servidor.',
      status: 'Off'
    });
  
    if (!KickDB.tiene(`${message.guild.id}`))
    KickDB.establecer(`${message.guild.id}`, {
      name: message.guild.name,
      id: message.guild.id,
      limit: 0,
      message: 'Proteção contra raid ativada! O usuário {member} foi banido com sucesso.',
      status: 'Off'
    });
  
    if (!InviteDB.tiene(`${message.guild.id}`))
    InviteDB.establecer(`${message.guild.id}`, {
      name: message.guild.name,
      owner: message.guild.owner.user.id,
      message: "Proteção ativada! O convite enviado foi excluido com sucesso.",
      status: "Off"
    });
  
    if (!ModLogDB.tiene(`${message.guild.id}`))
    ModLogDB.establecer(`${message.guild.id}`, {
      name: message.guild.name,
      owner: message.guild.owner.user.id,
      channel: "No"
    });

    const modlog = await ModLogDB.obtener(`${message.guild.id}.channel`);
    const prefix = await PrefixDB.obtener(`${message.guild.id}.prefix` );
    const ban    = await BanDB   .obtener(`${message.guild.id}.status` );
    const kick   = await KickDB  .obtener(`${message.guild.id}.status` );
    const bot    = await ProDB   .obtener(`${message.guild.id}.status` );
    const invite = await InviteDB.obtener(`${message.guild.id}.status` );
    const fake   = await FakeDB  .obtener(`${message.guild.id}.status` );
  
    const menu    = client.emojis.find(emoji => emoji.name === "certoamora");
    let proban    = client.emojis.find(emoji => emoji.name === "devdes");
    let prokick   = client.emojis.find(emoji => emoji.name === "devdes");
    let proinvite = client.emojis.find(emoji => emoji.name === "devdes");
    let probot    = client.emojis.find(emoji => emoji.name === "devdes");
    let profake   = client.emojis.find(emoji => emoji.name === "devdes");
    let modlogs   = client.emojis.find(emoji => emoji.name === "devdes");
  
    const ativado   = client.emojis.find(emoji => emoji.name === "devat" );
    if(ban    === "On") proban    = ativado;
    if(kick   === "On") prokick   = ativado;
    if(invite === "On") proinvite = ativado;
    if(bot    === "On") probot    = ativado;
    if(fake   === "On") profake   = ativado;
    if(modlog !== "No") modlogs   = ativado;
  
    const voltar    = client.emojis.find(emoji => emoji.name === "voltaryoe");
    
    let embed = new Discord.RichEmbed()
        .setAuthor(botuser, client.user.avatarURL)
        .addField(`${proban} **ProBan**`, `Proteção contra banimentos em massa. \`${prefix}proban help\``)
        .addField(`${prokick} **ProKick**`, `Proteção contra expulsões em massa. \`${prefix}prokick help\``)
        .addField(`${proinvite} **ProInvite**`, `Proteção contra convites de servidores. \`${prefix}proinvite help\``)
			  .addField(`${probot} **ProBot**`, `Proteção contra bots maliciosos. \`${prefix}probot help\``)
        .addField(`${profake} **ProFake**`, `Proteção contra contas fakes. \`${prefix}profake help\``)
        .addField(`${modlogs} **ModLog**`, `Canal para receber notificação de banimentos. \`${prefix}modlog help\``)
        .addField(`${voltar} **Close**`, `Fechar Menu de Comandos`)
        .setColor('RED')
        .setThumbnail("https://cdn.discordapp.com/attachments/688408514053406747/713141713128128522/utilsbot.gif")
        .setFooter("• Creator: 𝑁𝑜𝑡𝐷𝑒𝑣'ᴮᴸ⁰#0666", oav)
    
    message.channel.send(embed).then((c) => {
            c.react(voltar.id).then(()   => {
		    })
		
        let VoltarFilter   = (reaction, user, )   => reaction.emoji.id === voltar.id && user.id   === message.author.id;
  
        let Voltar         = c.createReactionCollector(VoltarFilter, { time: 80000 });
         
        Voltar.on('collect', r2 => {
          
            c.edit("Encerrando Painel...").then(h => { h.delete(3000) });
    })
  })
};