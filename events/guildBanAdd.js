let { RichEmbed } = require("discord.js");

module.exports = async (client, guild, user) => {

  const fetchedLogs = await guild.fetchAuditLogs({
		limit: 1,
		type: 'MEMBER_BAN_ADD',
	});

  const db = require("megadb");

  let BanDB = new db.crearDB("ProBan");
  let UserDB = new db.crearDB("User");

  const banLog = fetchedLogs.entries.first();

	const { executor, target } = banLog;

  if( executor.id === client.user.id ) return;
  
  if (!BanDB.has(`${guild.id}`))
    BanDB.set(`${guild.id}`, {
      name: guild.name,
      id: guild.id,
      limit: 0,
      message: 'Proteção contra raid ativada! O usuário {member} foi banido com sucesso.',
      status: 'Off'
    });

  if (!UserDB.has(`${executor.id}`))
    UserDB.set(`${executor.id}`, {
      name: executor.tag,
      id: executor.id,
      count: 0,
      countk: 0
    });

  let count = await UserDB.get(`${executor.id}.count`);
  let limit = await BanDB.get(`${guild.id}.limit`);
  let status = await BanDB.get(`${guild.id}.status`);
  let msg = await BanDB.get(`${guild.id}.message`);

  UserDB.sumar(`${executor.id}.count`, 1)

  const newMsg = msg.replace("{member}", executor.tag);

  let warnEmbed = new RichEmbed()
    .setColor("#f7002c")
    .setDescription(newMsg);

  if(count >= limit) {
    guild.owner.user.send(warnEmbed).catch(()=>{})
    console.log('Estou banindo')
    guild.member(executor).ban('Proteção contra raid ativada!').catch(err => { console.log(err) })
    //executor.ban('"Proteção contra raid ativada!"').catch(()=>{})
  }
}