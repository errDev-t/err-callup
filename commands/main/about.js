const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  time,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("about").setDescription("about bot"),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    let totalSeconds = client.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    let uptime = `${days}d, ${hours}h, ${minutes}m, ${seconds}seconds.`;
    const embed = new EmbedBuilder()
      .setTitle(`🤖 Bot info`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `**Bot Name** \n ${client.user.username} \n ** Bot Id ** \n ${client.user.id} \n  ** Discord.js Version **\n 14.11.0 \n  ** Bot Version **\n  1.0.0 \n  ** Server Count ** \n 🏰${client.guilds.cache.size} \n  ** Uptime ** \n ${uptime} \n  ** Bot Description ** \n 📝idk lol`
      );

    const button = new ButtonBuilder()
      .setEmoji("🤖")
      .setURL(
        "https://discord.com/api/oauth2/authorize?client_id=1111637791877632060&permissions=8&scope=bot"
      )
      .setStyle(ButtonStyle.Link)
      .setLabel("Invite Me");

    const row = new ActionRowBuilder().addComponents(button);

    interaction.reply({ embeds: [embed], components: [row] });
  },
};
