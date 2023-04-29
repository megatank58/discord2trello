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

setTimeout(async () => {
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

    if (event.data.listAfter && event.data.listAfter.name == "Discontinued") {
      let dm = await user.createDM();
      dm.send({
        content: `💌 Hey ${user}, Support လုပ်တာကုန်တော့မှာ နောက်တစ်ပတ်အတွက် ထပ်ပြီး Support ချင်ရင် Bloxtoys ကိုသွားပြီး Support လုပ်လို့ရပါတယ်နော်။\n\nLink: https://www.facebook.com/BloxToys 
      `,
        files: [
          "https://media.discordapp.net/attachments/985918043089690694/1101768586877476885/SUPPORT_YOUTUBERS_15.png?width=497&height=417",
        ],
      });
      await user.roles.remove(role);
    } else await user.roles.add(role);
  });
}, 5_000);

trelloEvents.start(3_000);

client.login(process.env.discordToken);
