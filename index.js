import { Client, GatewayIntentBits } from "discord.js";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

if (!DISCORD_TOKEN || !N8N_WEBHOOK_URL) {
  console.error("❌ Missing DISCORD_TOKEN or N8N_WEBHOOK_URL in .env file");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  try {
    await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: {
          id: message.author.id,
          name: message.author.username,
          bot: message.author.bot,
        },
        channel: message.channel.id,
        text: message.content,
      }),
    });
    console.log("📤 Relayed:", message.content);
  } catch (err) {
    console.error("❌ Failed to relay:", err);
  }
});

client.login(DISCORD_TOKEN);
