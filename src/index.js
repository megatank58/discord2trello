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
    boards: ["3iBR85ih"],
  },
});

setTimeout(() => {
  trelloEvents.on("updateCard", async (event) => {
    if (
      event.data.card.idLabels &&
      event.data.card.idLabels.length != event.data.old.idLabels.length
    ) {
      const oldLabels = event.data.old.idLabels;
      const newLabels = event.data.card.idLabels;
      if (oldLabels.length !== newLabels.length) {
        const username = event.data.card.name;
        const guild = client.guilds.cache.first();
        const user = await guild.members.fetch({
          query: username.split("#")[0],
          force: true,
        });

        for (const label of oldLabels) {
          const role = guild.roles.cache.find((r) => r.name === label.name);
          if (!role) continue;
          if (!newLabels.includes(label.id)) {
            await user.roles.remove(role);
          }
        }

        for (const label of newLabels) {
          const role = guild.roles.cache.find((r) => r.name === label.name);
          if (!role) continue;
          if (!oldLabels.includes(label.id)) {
            await user.roles.add(role);
          }
        }
      }
    }
  });
}, 5_000);

trelloEvents.start(3_000);

// Start the WebSocket connection.
client.login(process.env.discordToken);
