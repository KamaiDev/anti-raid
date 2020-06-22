let { RichEmbed } = require("discord.js");
let db = require("megadb");

module.exports = async (client, member) => {
  console.log(0);

  // Boas-Vindas
  welcome(client, member)

  // Proteção contra bots
  botProtection(client, member)

  // Proteção contra fakes
  fakeProtection(client, member)

};

async function welcome (client, member) {
  let ChannelDB = new db.crearDB("Channel");

  if (!ChannelDB.tiene(`${member.guild.id}`))
    ChannelDB.establecer(`${member.guild.id}`, { 
        channel: 'No',
        message: '<a:corabot:668157639368376371> | {member} Seja bem-vindo(a) ao nosso servidor!',
        status:  'Off'
     });

  const status = await ChannelDB.obtener(`${member.guild.id}.status`);
  const mssg   = await ChannelDB.obtener(`${member.guild.id}.message`);
  const chan   = await ChannelDB.obtener(`${member.guild.id}.channel`);

  const newMsgg = mssg.replace('{member}', member)

  if (status === 'Off') {
    return console.log('Welcome Desativado!')
  }

  let welcomeEmbed = new RichEmbed()
  .setColor('#f7002c')
  .setDescription(newMsgg)

  client.channels.get(chan).send(welcomeEmbed)
}

async function botProtection (client, member) {
  let ProDB = new db.crearDB("ProBot");

  if (!ProDB.tiene(`${member.guild.id}`))
    ProDB.establecer(`${member.guild.id}`, {
      name: member.guild.name,
      owner: member.guild.owner.user.id,
      message: "Proteção ativada! O bot ( {bot} ) adicionado foi expulso com sucesso!",
      status: "Off"
    });

  let stats = await ProDB.obtener(`${member.guild.id}.status`);
  let msg = await ProDB.obtener(`${member.guild.id}.message`);

  const newMsg = msg.replace("{bot}", member.user.tag);

  if (stats === "Off") {
    return console.log('ProBot Desativado!')
  }
  
  let warnEmbed = new RichEmbed()
    .setColor("#f7002c")
    .setDescription(newMsg);

  let guild = member.guild;

  if (member.user.bot) {
    member.guild.owner.user.send(warnEmbed).catch(()=>{})
    member.kick("Proteção contra bots ativada!")
      .catch(error =>
        console.log(`Desculpe, Não pude banir este usuario, erro: ${error}`)
      );
  }
}

async function fakeProtection (client, member) {

const moment = require('moment')
const db     = require('megadb')
/**
 * O evento guildMemberAdd é emitido após um membro entrar (ser adicionado em uma guild).
 */

  let FakeDB = new db.crearDB("ProFake");

  if (!FakeDB.has(`${member.guild.id}`))
    FakeDB.set(`${member.guild.id}`, {
      name: member.guild.name,
      id: member.guild.id,
      days: 0,
      message: 'Olá! Você foi kickado automaticamente por suspeita de fake account em nosso servidor.',
      status: 'Off'
    });

  let days   = await FakeDB.get(`${member.guild.id}.days`   );
  let msg    = await FakeDB.get(`${member.guild.id}.message`);
  let status = await FakeDB.get(`${member.guild.id}.status` );

  if(status === 'Off') return;

  const daysSinceCreation = moment().diff(moment(member.user.createdAt), 'days')

  if (daysSinceCreation < days) return (() => { member.send(msg).catch() && member.kick('AutoKick: FakeAccounts não são bem vindas').catch() })()
}
