/* 

DDDDDDD        EEEEEEEEE  VVV             VVV
DDDDDDDDDD     EEEEEEEEE   VVV           VVV
DDDD    DDD    EEE          VVV         VVV
DDDD      DDD  EEEEEE        VVV       VVV
DDDD      DDD  EEEEEE         VVV     VVV
DDDD    DDD    EEE             VVV   VVV
DDDDDDDDD      EEEEEEEEE        VVV VVV
DDDDDD         EEEEEEEEE          VVV

🍷 Desenvolvido por: NotDev
💻 Source de anti raid + moderação fácil de configurar
🗳️ Sugestões de Scripts? Me add: NotDev'ᴮᴸ⁰#0666

💳 Também Vendo 💳
• Script de divulgação
• Apagar mensagens canais/privado sem rate limit
• Bot Anti Raid privado pro seu servidor
• Vendo entrada para a banca R$ 400,00 ( meme, Iroh. Casa comigo )

📚 Como Usar 📚

1 • Coloque a token da conta na pasta config.json
2 • Configure o prefixo padrão desejado
3 • Configure os emojis e o que desejar nos comandos
[Nota] Recomendo privatizar os bans somente ao bot, pois não há excessões e pode acabar banindo outro bot de moderação

*/

const http = require("http");
const express = require("express");
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

require("dotenv").config();

const Discord = require("discord.js");
const { Client, RichEmbed } = require("discord.js");
const client = new Client();

let config = require("./config.json");

const fs = require("fs");
const Enmap = require("enmap");
const db = require("megadb");

fs.readdir("./events/", (err, files) => {  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Enmap();

fs.readdir("./comandos/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./comandos/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Comando carregado • ${commandName}`);
    client.commands.set(commandName, props);
  });
});

client.on("message", async message => {
  
  let PrefixDB = new db.crearDB("Prefix");

  if (!PrefixDB.tiene(`${message.guild.id}`))
    PrefixDB.establecer(`${message.guild.id}`, {
      name: message.guild.name,
      owner: message.guild.owner.user.id,
      prefix: "&"
    });

  let prefixoAtual = await PrefixDB.obtener(`${message.guild.id}.prefix`);

  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (!message.content.startsWith(prefixoAtual)) return;
  let args = message.content.split(" ").slice(1);
  let comando = message.content.split(" ")[0];
  comando = comando.slice(prefixoAtual.length);
  try {
    let commandFile = require("./comandos/" + comando + ".js");
    commandFile.run(client, message, args);
  } catch (err) {
    console.log(
      `O comando **${comando}** usado por **${message.author.tag} | ${message.author.id}** não existe*`
    );
  }
});

if(!config.token) config.token = "Nothing";
client.login(config.token).catch(() => { console.log(`Token Inválida » ${config.token}`) });
