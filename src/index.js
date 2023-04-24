import { Client, GatewayIntentBits } from "discord.js";
import TrelloEvents from "trello-events";
import "dotenv/config";

// Create a client to emit relevant events.
const client = new Client({ intents: GatewayIntentBits.Guilds });

// Listen for the ready event
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
    let guild = client.guilds.cache.get(process.env.discordToken);
    let user = await guild.members.fetch({ query: event.data.member.name, force: true });

    let role = guild.roles.cache.find(role => role.name === event.data.card.name);

    user.roles.add(role);
  });

  trelloEvents.on("removeMemberFromCard", async (event) => {
    let guild = client.guilds.cache.get(process.env.discordToken);
    let user = await guild.members.fetch({ query: event.data.member.name, force: true });

    let role = guild.roles.cache.find(role => role.name === event.data.card.name);

    user.roles.remove(role);
  });
}, 5_000);

trelloEvents.start(3_000);

// Start the WebSocket connection.
client.login(process.env.discordToken);
