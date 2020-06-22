const Discord = require("discord.js");
const db = require("megadb");

let ProDB = new db.crearDB("ProBot");

exports.run = async (client, message, args) => {
  const f = client.emojis.find(emoji => emoji.name === "errorbot");
  const on = client.emojis.find(emoji => emoji.name === "onbot");
  const off = client.emojis.find(emoji => emoji.name === "dndbot");

  if (message.author.id !== message.guild.owner.user.id)
    return message.channel.send(f + " | Você não tem permissão para executar esse comando! ( Exclusivo para o dono do servidor )"); 

  const command = args[0]

  if (!ProDB.tiene(`${message.guild.id}`))
    ProDB.establecer(`${message.guild.id}`, {
      name: message.guild.name,
      owner: message.guild.owner.user.id,
      message:
        "Proteção ativada! O bot ( {bot} ) adicionado foi expulso com sucesso!",
      status: "Off"
    });

  const status = await ProDB.obtener(`${message.guild.id}.status`);
  const msg = await ProDB.obtener(`${message.guild.id}.message`);

  const embed = new Discord.RichEmbed()
    .setDescription("**Configurações Atualizadas**")
    .addField("Mensagem:", '`' + msg + '`')
    .addField("Status:", `${status === 'On' ? off : on}`)
    .setColor("#e0000f")
  const embed1 = new Discord.RichEmbed()
    .setDescription("**Configurações Atuais**")
    .addField("Mensagem:", '`' + msg + '`')
    .addField("Status:", `${status === 'On' ? on : off}`)
    .setColor("#e0000f")

  if (command === 'info') return message.channel.send(embed1);

  if(!command) return message.channel.send(`${f} | Você não forneceu um subcomando para ligar/desligar o módulo ou ver o menu de ajuda.`)

if(command === "ativar") {
  
  if (status === "On") return message.channel.send(`${f} | O módulo de defesa já está ativado.`);
  
  if (status === "Off") {
    ProDB.set(`${message.guild.id}.status`, "On").then(
      message.channel.send(embed)
    );
  }
}

if(command = "desativar") {
  
  if (status === "Off") return message.channel.send(`${f} | O módulo de defesa já está desativado.`)
  
  if (status === "On") {
    ProDB.set(`${message.guild.id}.status`, "Off").then(
      message.channel.send(embed)
      );
    }
  }

  if (command === 'help') {

    const embedHelp = new Discord.RichEmbed()
    .setDescription("**ProBot Ajuda**")
    .addField("Comandos:",
              "• **info** -> Mostra as configurações do ProBot.\n" +
              "• **ativar/desativar** -> Ativa/Desativa o módulo de proteção contra bots."
             )

      message.channel.send(embedHelp);
  }
}
