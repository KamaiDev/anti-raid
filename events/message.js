const { RichEmbed } = require("discord.js")

module.exports = async (client, message) => {
  if (!message.guild) return;

  // proteção contra invites
  inviteProtection(client, message)

  // menção do bot
  mention(client, message)
};

async function inviteProtection (client, message) {
  let db = require('megadb')
  let InviteDB = new db.crearDB("Invite");

  if (!InviteDB.tiene(`${message.guild.id}`)) // aqui
    InviteDB.establecer(`${message.guild.id}`, {  // aqui
      name: message.guild.name,
      owner: message.guild.owner.user.id,
      message: '<a:sirenebot:668157923263905792> | **Proteção ativada! O convite enviado foi excluido com sucesso.**',
      status: 'Off'
    });

  let stats = await InviteDB.obtener(`${message.guild.id}.status`)
  let mess  = await InviteDB.obtener(`${message.guild.id}.message`)

  let msg = message.content.toLowerCase(); 

  if (message.author.bot) return;
  
  let user = message.author;
  
  if (stats === 'Off') return;

  const embed = new RichEmbed()
    .setDescription(mess)
    .setColor("#e0000f")

  if (message.content.includes("discord.gg/")) { 
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      message.delete().catch(console.error);
      message.channel.send(embed).then(m => m.delete(5000)).catch(console.error)
    }
  }
}

async function mention (client, message) {

  if(message.isMentioned(client.user)) {

    let db = require('megadb')

    let PrefixDB = new db.crearDB("Prefix");

    if (!PrefixDB.tiene(`${message.guild.id}`))
    PrefixDB.establecer(`${message.guild.id}`, {
      name: message.guild.name,
      owner: message.guild.owner.user.id,
      prefix: "&"
    });

    let prefixoAtual = await PrefixDB.obtener(`${message.guild.id}.prefix`);

    const voltar = client.emojis.find(emoji => emoji.name === "voltaryoe");
    const dev = client.emojis.find(emoji => emoji.name === "Pompom");

    let devTag = client.users.get('643499869612277782')

    const embed = new RichEmbed()
        .setTitle(`Olá ${message.author.username}, está perdido?`)
        .setDescription(`Sou **${client.user.username}** e sou um bot feito especialmente para proteger o seu servidor! Abaixo deixarei algumas informações sobre mim.`)
        .addField(`Meu Prefixo Neste Servidor:`, "`" + prefixoAtual + "`")
        .addField(`Meus Desenvolvedores:`, 
                  `${devTag.tag} - ${dev}`)
        .setThumbnail(client.user.avatarURL)
        .setColor("#ff47ec")

    message.channel.send(embed) .then((c) => {
            c.react(dev.id)     .then(()  => {
            c.react(voltar.id)  .then(()  => {
        })
        })

    let DevFilter       = (reaction, user, )   => reaction.emoji.id === dev.id     && user.id === message.author.id;
    let VoltarFilter    = (reaction, user, )   => reaction.emoji.id === voltar.id  && user.id === message.author.id;

    let Dev            = c.createReactionCollector(DevFilter,     { time: 80000 });
    let Voltar         = c.createReactionCollector(VoltarFilter,  { time: 80000 });

    Dev.on('collect', r2 => { 
            let util = new RichEmbed()
                .setTitle(`${dev} ${devTag.tag}`)
                .setDescription("Lindo, Bonito e Maravilhoso. Apenas um programador de bots para Discord. Criador e desenvolvedor do " + client.user.username)
                .setThumbnail(devTag.avatarURL)
            c.edit(util) && r2.remove(message.author.id);
      });

    Voltar.on('collect', r2 => {

            c.edit(embed) && r2.remove(message.author.id)

      })
    })
  }
}