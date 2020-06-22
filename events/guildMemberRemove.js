let { RichEmbed } = require("discord.js");

module.exports = async (client, member) => {
  
  const fetchedLogs = await member.guild.fetchAuditLogs({
		limit: 1,
		type: 'MEMBER_KICK',
	});
  
  const db = require("megadb");
  
  let kickDB = new db.crearDB("ProKick");
  let UserDB = new db.crearDB("User");
  
  const kickLog = fetchedLogs.entries.first();
  
	const { executor, target } = kickLog;
  if(!executor) return;
  if(executor === undefined) return;
  if( executor.id === client.user.id ) return;
  
  if (!kickDB.has(`${member.guild.id}`))
    kickDB.set(`${member.guild.id}`, {
      name: member.guild.name,
      id: member.guild.id,
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

  let count = await UserDB.get(`${executor.id}.countK`);
  let limit = await kickDB.get(`${member.guild.id}.limit`);
  let status = await kickDB.get(`${member.guild.id}.status`);
  let msg = await kickDB.get(`${member.guild.id}.message`);
  
  UserDB.sumar(`${executor.id}.countK`, 1).then(
    console.log("Iroh, casa comigo na Shine...")
  )
  
  const newMsg = msg.replace("{member}", executor.tag);
  
  let warnEmbed = new RichEmbed()
    .setColor("#f7002c")
    .setDescription(newMsg);
  
  if(count >= limit) {
    member.guild.owner.user.send(warnEmbed).catch(()=>{})
    console.log('Estou banindo')
    member.guild.member(executor).ban('Proteção contra raid ativada!').catch(err => { console.log(err) })
  }
}