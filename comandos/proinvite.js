const Discord = require("discord.js");
const db = require("megadb");

let InviteDB = new db.crearDB("Invite");

exports.run = async (client, message, args) => {
  
  const f = client.emojis.find(emoji => emoji.name === "errorbot");
  const on = client.emojis.find(emoji => emoji.name === "onbot");
  const off = client.emojis.find(emoji => emoji.name === "dndbot");

  if (message.author.id !== message.guild.owner.user.id)
    return message.channel.send(f + " | Você não tem permissão para executar esse comando! ( Exclusivo para o dono do servidor )");

  if (!InviteDB.tiene(`${message.guild.id}`))
    InviteDB.establecer(`${message.guild.id}`, {
      name: message.guild.name,
      owner: message.guild.owner.user.id,
      message: "Proteção ativada! O convite enviado foi excluido com sucesso.",
      status: "Off"
    });

  let stats = await InviteDB.obtener(`${message.guild.id}.status`);
  let msg = await InviteDB.obtener(`${message.guild.id}.message`);

  const embed = new Discord.RichEmbed()
    .setDescription("**Configurações Atualizadas**")
    .addField("Mensagem:", '`' + msg + '`')
    .addField("Status:", `${stats === 'On' ? off : on}`)
    .setColor("#e0000f")
  const embed1 = new Discord.RichEmbed()
    .setDescription("**Configurações Atuais**")
    .addField("Mensagem:", '`' + msg + '`')
    .addField("Status:", `${stats === 'On' ? on : off}`)
    .setColor("#e0000f")

  const command = args[0]

  if(command === 'info') return message.channel.send(embed1);

  if(!command) return message.channel.send(`${f} | Você não forneceu o subcomando do módulo.`)
  
if(command === "ativar") {
  
  if(stats === "On") return message.channel.send(`${f} | O módulo já está ligado.`)
  
  if (stats === "Off") {
    InviteDB.set(`${message.guild.id}.status`, "On").then(
      message.channel.send(embed)
    );
  }
}
  
if(command === "desativar") {
  
  if(stats === "Off") return message.channel.send(`${f} | O módulo já está desligado.`)
  
  if (stats === "On") {
    InviteDB.set(`${message.guild.id}.status`, "Off").then(
      message.channel.send(embed)
      );
    }
  }

  if (command === 'help') {
    const embedHelp = new Discord.RichEmbed()
    .setDescription("**ProInvite Ajuda**")
    .addField("Comandos:",
              "• **info** -> Mostra as configurações do ProInvite.\n" +
              "• **ativar/desativar** -> Ativa/Desativa o módulo de proteção contra convites."
             )

      message.channel.send(embedHelp)
  }
};
