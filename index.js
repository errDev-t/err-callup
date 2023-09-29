const {
  Client,
  GatewayIntentBits,
  Events,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  time,
} = require("discord.js");
require("dotenv").config();
const { token } = require("./config.json");
const { readdirSync } = require("node:fs");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

readdirSync("./handlers").forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

client.login(token);
