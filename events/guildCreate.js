module.exports = async (client, guild) => {
  console.log(`Servidor Adicionado:\n
              » Nome: ${guild.name}\n
              » Owner: ${guild.owner.user.id}\n
              » ID: ${guild.id}\n
              » Users: ${guild.memberCount}\n
              » Users Totais: ${client.users.size}`)
}