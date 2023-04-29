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
  let guild = client.guilds.cache.get(process.env.guildId);

  trelloEvents.on("updateCard", async (event) => {
    let username = event.data.card.name.split("/")[1].split("#")[0].trim();
    let label = event.data.card.name.split("/")[2].trim();

    let user = (
      await guild.members.fetch({
        query: username,
        force: true,
      })
    ).first();

    let role = guild.roles.cache.find((role) => role.name === label);

    if (event.data.listAfter && event.data.listAfter.name == "Discontinued")
      await user.roles.remove(role);
    else await user.roles.add(role);
  });
}, 5_000);

trelloEvents.start(3_000);

client.login(process.env.discordToken);
