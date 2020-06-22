const Discord = require("discord.js");
const db = require("megadb");

let PrefixDB = new db.crearDB("Prefix");
let ModLogDB = new db.crearDB("ModLog");

exports.run = async (client, message, args) => {
  
  const a = client.emojis.find(emoji => emoji.name === "errorbot");
  const b = client.emojis.find(emoji => emoji.name === "certoamora");

  if (!PrefixDB.tiene(`${message.guild.id}`))
    PrefixDB.establecer(`${message.guild.id}`, {
      name: message.guild.name,
      owner: message.guild.owner.user.id,
      prefix: "&"
    });

  if (!ModLogDB.tiene(`${message.guild.id}`))
    ModLogDB.establecer(`${message.guild.id}`, {
      name: message.guild.name,
      owner: message.guild.owner.user.id,
      channel: "No"
    });

  const prefix = await PrefixDB.obtener(`${message.guild.id}.prefix`);
  const banLogs = await ModLogDB.obtener(`${message.guild.id}.channel`);

  let modlog = message.guild.channels.get(banLogs);
  if (banLogs === "No") modlog = message.author;

  if (!message.member.hasPermission("BAN_MEMBERS"))
    return message.channel.send(a + ` | Você não possui permissão para isto!`);
  if (!message.guild.me.hasPermission("BAN_MEMBERS"))
    return message.channel.send(a + ` | Eu não possuo permissão para isto!`);

  if (!args[0])
    return message.channel.send(
      a + ` | Você está utilizando isto incorretamente! \n⚙️ | Use: **${prefix}ban** \`<@user> <motivo>\``
    );

  let target = message.guild.member(
    message.mentions.users.first() || message.guild.members.get(args[0])
  );
  if (target.id === "643499869612277782")
    target = message.guild.member(message.guild.members.get(message.author.id));

  if (!target) return message.reply(a + ` | Este usuário não existe!`);
  if (!target.bannable)
    return message.channel.send(a + ` | O cargo do usuário é maior que o meu!`);

  let razao = args.slice(1).join(" ");
  if (!razao) razao = "Sem Motivo";

  let confirm = new Discord.RichEmbed()
    .setAuthor(`Confirmação de Punição`, target.user.avatarURL)
    .addField(
      `Reaja com ${b} para banir ou com ${a} para cancelar`,
      `**Usuário:** \`${target.user.username}\` \n**Autor:** \`${message.author.username}\` \n**Motivo:** \`${razao}\``
    );

  let embban = new Discord.RichEmbed()
    .setAuthor(`Punição aplicada!`, `${target.user.avatarURL}`)
    .setDescription(
      `\n\nUsuário: \`${target.user.username}\` \nAutor: \`${message.author.username}\` \nMotivo: \`${razao}\``
    )
    .setTimestamp(`• ${client.user.username} Ban System`);

  message.channel.send(confirm).then(c => {
    c.react(b.id).then(() => {
    c.react(a.id).then(() => {});
  });

    let ConfirmarFilter = (reaction, user) =>
      reaction.emoji.id === b.id && user.id === message.author.id;
    let CancelarFilter  = (reaction, user) =>
      reaction.emoji.id === a.id && user.id === message.author.id;

    let Confirmar = c.createReactionCollector(ConfirmarFilter, { time: 80000 });
    let Cancelar  = c.createReactionCollector(CancelarFilter,  { time: 80000 });

    Confirmar.on("collect", async r2 => {
      (await target.ban(razao)) &&
        message.channel.send(embban) &&
        modlog.send(embban) &&
        c.delete();
    });

    Cancelar.on("collect", r2 => {
      message.channel.send("Banimento Cancelado...").then(mm => {
        mm.delete(3000);
      });
      c.delete();
    });
  });
};
