const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  time,
} = require("discord.js");

//==========< SETTINGS >==========\\

module.exports = {
  data: new SlashCommandBuilder()
    .setName("callup")
    .setDescription("استدعاء شخص ليس موجود داخل السيرفر")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("قم باختيار الشخص الي تود استدعائه")
        .setRequired(true)
    )
    .addAttachmentOption((option) =>
      option
        .setName("prove")
        .setDescription("قم بوضع فيديو يوضح سبب الاستدعاء")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("قم بوضع سبب الاستدعاء")
        .setRequired(true)
    )

    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)

    .setDMPermission(false),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    const config = require("../../config.json")
    const role = config.callupRoleId; // ايدي رتبه الاستدعاء
    const whiteListRole = config.callupRoleId; // ايدي رتبه وايت لست
    const user1 = interaction.options?.getMember("user");
    const prove = interaction.options?.getAttachment("prove");
    const reason = interaction.options?.getString("reason");
    const channel = client.channels.cache.get(config.logRoomId); // ايدي روم log
    const roleName = config.callupRoleName; // اسم رتبه الاستدعاء
    const whiteList = config.whitelistRoleName; // اسم رتبه التفعيل
    const currentDate = new Date();

    if (user1.roles.cache.some((role) => role.name === roleName))
      return await interaction.reply({
        content: "الشخص الذي تريد استدعائه قد تم استدعائه مسبقا",
        ephemeral: true,
      });

    if (!user1.roles.cache.some((role) => role.name === whiteList)) {
      return await interaction.reply({
        content: `هذا الشخص غير مفعل ${user1}`,
        ephemeral: true,
      });
    }

    await interaction.guild.members.cache
      .get(user1.id)
      .roles.remove(whiteListRole);
    await interaction.guild.members.cache.get(user1.id).roles.add(role);

    const dmEmbed = new EmbedBuilder()
      .setTitle("NoFact Call up")
      .setDescription(
        "**لقد تم استدعائك من قبل اداره  , نتمنى منك التوجه إلى الدسكورد ودخول الروم الصوتي  callup-waiting  مباشره وفي حال لم تتوجه إلى الرومات الصوتيه الخاصه بالاستدعاء سيتم التعامل معك خلال 12 ساعه فوراً **"
      )
      .setColor("Orange")
      .setFooter({
        iconURL: interaction.guild.iconURL({ dynamic: true }),
        text: `Developer Department • ${currentDate.toLocaleString()}`,
      });

    user1
      .send({ embeds: [dmEmbed], content: `${user1} مرحباً` })
      .catch(async (err) => {
        return await interaction
          .reply({
            content: `لا يمكنني ارسال رساله إلى ${user1}`,
            ephemeral: true,
            sss,
          })
          .catch((err) => {});
      });

    const logEmbed = new EmbedBuilder()
      .setFooter({
        iconURL: interaction.guild.iconURL({ dynamic: true }),
        text: `Developer Department • ${currentDate.toLocaleString()}`,
      })
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor("Orange")

      .setFields(
        { name: "・ Modderator:", value: ` ${interaction.user.username}` },
        { name: "・ user:", value: `${user1}` },
        { name: "・ Reason:", value: `${reason}` }
      );
    channel.send({ embeds: [logEmbed], files: [prove] });

    interaction.reply({ content: `تم استدعاء ${user1}`, ephemeral: true });
  },
};
