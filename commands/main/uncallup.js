const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("uncallup")
    .setDescription("الغاء استدعاء شخص")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("قم باختيار الشخص الي تود لغي استدعائه")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("قم بوضع سبب لغي الاستدعاء")
        .setRequired(true)
    )

    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false),

  async execute(interaction, client) {
    const config = require("../../config.json")
    const role = config.callupRoleId; // ايدي رتبه الاستدعاء
    const whiteListRole = config.whitelistRoleId; // ايدي رتبه وايت لست
    const user = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason");
    const channel = client.channels.cache.get(); // ايدي روم log
    const roleName =  config.callupRoleName ; // اسم رتبه الاستدعاء
    const whitelistRoleName = config.callupRoleName

    if (!user.roles.cache.some((role) => role.name === roleName)) {
      return await interaction.reply({
        content: `${user} لا يوجد استدعاء لهذا الشخص`,
        ephemeral: true,
      });
    }
    if (!user.roles.cache.some((whiteList) => whiteList.name === whitelistRoleName)) {
      return await interaction.reply({
        content: `${user} لا يوجد استدعاء لهذا الشخص`,
        ephemeral: true,
      });
    }

    await interaction.guild.members.cache.get(user.id).roles.remove(role);
    await interaction.guild.members.cache.get(user.id).roles.add(whiteListRole);

    const dmEmbed = new EmbedBuilder()
      .setTitle(" Call up")
      .setDescription(
        "لقد تم الغاء اخر استدعاء لك من قبل الاداره , \n بسبب وجود خطأ في الاستدعاء نعتذر منك \n ونتمنى قضاء وقت ممتع "
      )
      .setColor("Orange");

    user
      .send({ embeds: [dmEmbed], content: `مرحباً ${user}` })
      .catch(async (err) => {
        return await interaction
          .reply({
            content: `لا يمكنني ارسال رساله إلى ${user}`,
            ephemeral: true,
          })
          .catch((err) => {});
      });

    const logEmbed = new EmbedBuilder()
      .setFooter({
        iconURL: interaction.guild.iconURL({ dynamic: true }),
        text: `${interaction.guild.name}`,
      })
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor("Orange")

      .setFields(
        { name: "・ Modderator:", value: ` ${interaction.user.username}` },
        { name: "・ User:", value: `${user}` },
        { name: "・ Reason:", value: `${reason}` }
      );
    channel.send({ embeds: [logEmbed] });

    await interaction.reply({
      content: `تم الغاء استدعاء ${user}`,
      ephemeral: true,
      
    });
  },
};
