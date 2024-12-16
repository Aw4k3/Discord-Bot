"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
// Key: Channel Id, Value: End Point
const endpointTracker = new Map();
const waifuMenu = new discord_js_1.StringSelectMenuBuilder()
    .setCustomId("emdpoint")
    .setPlaceholder("Waifu Type...")
    .setOptions([
    {
        label: "Avatar",
        value: "avatar",
    },
    {
        label: "Cuddle",
        value: "cuddle",
    },
    {
        label: "Feed",
        value: "feed",
    },
    {
        label: "Foxgirl",
        value: "fox_girl",
    },
    {
        label: "Gasm",
        value: "gasm",
    },
    {
        label: "Genetically Engineered Catgirl",
        value: "gecg",
    },
    {
        label: "Goose",
        value: "goose",
    },
    {
        label: "Hug",
        value: "hug",
    },
    {
        label: "Kiss",
        value: "kiss",
    },
    {
        label: "Lewd",
        value: "lewd",
    },
    {
        label: "Lizard",
        value: "lizard",
    },
    {
        label: "Meow",
        value: "meow",
    },
    {
        label: "Neko",
        value: "neko",
    },
    {
        label: "Neko Gif",
        value: "ngif",
    },
    {
        label: "Pat",
        value: "pat",
    },
    {
        label: "Slap",
        value: "slap",
    },
    {
        label: "Smug",
        value: "smug",
    },
    {
        label: "Spank",
        value: "spank",
        description: "Possible NSFW results",
    },
    {
        label: "Tickle",
        value: "tickle",
    },
    {
        label: "Wallpaper",
        value: "wallpaper",
        description: "Possible NSFW results",
    },
    {
        label: "Woof",
        value: "woof",
    },
]);
const rerollButton = new discord_js_1.ButtonBuilder()
    .setCustomId("next")
    .setLabel("Next")
    .setStyle(discord_js_1.ButtonStyle.Primary);
const saveImage = new discord_js_1.ButtonBuilder()
    .setCustomId("save_image")
    .setLabel("Save Image")
    .setStyle(discord_js_1.ButtonStyle.Secondary);
const iLostButton = new discord_js_1.ButtonBuilder()
    .setCustomId("i_lost")
    .setLabel("I Lost")
    .setStyle(discord_js_1.ButtonStyle.Secondary);
const actionRowMenu = new discord_js_1.ActionRowBuilder().addComponents(waifuMenu);
const standardActionRowButtons = new discord_js_1.ActionRowBuilder().addComponents(rerollButton, saveImage, iLostButton);
const saveImageActionRowButtons = new discord_js_1.ActionRowBuilder().addComponents(rerollButton, iLostButton);
const instance = new discord_js_1.EmbedBuilder().setTitle("Embrace the Waifus");
const data = new discord_js_1.SlashCommandBuilder()
    .setName("waifu")
    .setDescription("God I love looking at waifus");
exports.data = data;
async function execute(interaction) {
    const response = await fetch(`https://nekos.life/api/v2/img/avatar`);
    const data = await response.json();
    endpointTracker.set(interaction.channelId, {
        endpoint: "avatar",
        url: data.url,
    });
    instance.setImage(data.url);
    const messageResponse = await interaction.reply({
        embeds: [instance],
        components: [actionRowMenu, standardActionRowButtons],
    });
    const collector = messageResponse.createMessageComponentCollector();
    collector.on("collect", async (i) => {
        switch (i.componentType) {
            case discord_js_1.ComponentType.StringSelect:
                const endpoint = i.values[0];
                const response = await fetch(`https://nekos.life/api/v2/img/${endpoint}`);
                const data = await response.json();
                endpointTracker.set(i.channelId, { endpoint: endpoint, url: data.url });
                instance.setImage(data.url);
                i.update({
                    embeds: [instance],
                    components: [actionRowMenu, standardActionRowButtons],
                });
                break;
            case discord_js_1.ComponentType.Button:
                switch (i.customId) {
                    case "next":
                        {
                            let { endpoint } = endpointTracker.get(interaction.channelId);
                            const response = await fetch(`https://nekos.life/api/v2/img/${endpoint}`);
                            const data = await response.json();
                            endpointTracker.set(i.channelId, {
                                endpoint: endpoint,
                                url: data.url,
                            });
                            instance.setImage(data.url);
                            i.update({
                                embeds: [instance],
                                components: [actionRowMenu, standardActionRowButtons],
                            });
                        }
                        break;
                    case "i_lost":
                        i.reply(`lmao you lost, ${i.member}`);
                        break;
                    case "save_image":
                        {
                            let { url } = endpointTracker.get(interaction.channelId);
                            if (i.channel && url)
                                i.channel.send(url);
                            i.update({
                                embeds: [instance],
                                components: [actionRowMenu, saveImageActionRowButtons],
                            });
                        }
                        break;
                }
                break;
        }
    });
}
