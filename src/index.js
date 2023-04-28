import { Client, GatewayIntentBits } from "discord.js";
import TrelloEvents from "trello-events";
import "dotenv/config";

const client = new Client({ intents: GatewayIntentBits.Guilds });

client.once("ready", () => console.log("Ready!"));

const trelloEvents = new TrelloEvents({
  trello: {
    key: process.env.apiKey,
    token: process.env.apiToken,
    boards: ["vVC7mmAy"],
  },
});

setTimeout(() => {
  trelloEvents.on("addMemberToCard", async (event) => {
    let guild = client.guilds.cache.get(process.env.guildId);
    let user = (await guild.members.fetch({ query: event.data.member.name.toLowerCase(), force: true })).first();

    let role = guild.roles.cache.find(role => role.name === event.data.card.name);
    await user.roles.add(role);
  });

  trelloEvents.on("removeMemberFromCard", async (event) => {
    let guild = client.guilds.cache.get(process.env.guildId);
    let user = (await guild.members.fetch({ query: event.data.member.name.toLowerCase(), force: true })).first();

    let role = guild.roles.cache.find(role => role.name === event.data.card.name);
    await user.roles.remove(role);
  });
}, 5_000);

trelloEvents.start(3_000);

client.login(process.env.discordToken);
