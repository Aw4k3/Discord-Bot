import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } from "discord.js";

// Key: Channel Id, Value: End Point
const endpointTracker: Map<string, string> = new Map();
const waifuMenu = new StringSelectMenuBuilder()
    .setCustomId("emdpoint")
    .setPlaceholder("Waifu Type...")
    .setOptions([
        {
            label: "Avatar",
            value: "avatar",
            emoji: "772950364437610518"
        },
        {
            label: "Cuddle",
            value: "cuddle",
            emoji: "883376930282414100"
        },
        {
            label: "Feed",
            value: "feed",
            emoji: "852926235919122452"
        },
        {
            label: "Foxgirl",
            value: "fox_girl",
            emoji: "800166987099144192"
        },
        {
            label: "Gasm",
            value: "gasm",
            emoji: "857029075260407819"
        },
        {
            label: "Genetically Engineered Catgirl",
            value: "gecg",
            emoji: "951057797037064213"
        },
        {
            label: "Goose",
            value: "goose",
            emoji: "918653131565432852"
        },
        {
            label: "Hug",
            value: "hug",
            emoji: "1008812073368694915"
        },
        {
            label: "Kiss",
            value: "kiss",
            emoji: "788152154585301022"
        },
        {
            label: "Lewd",
            value: "lewd",
            emoji: "801906570829103144"
        },
        {
            label: "Lizard",
            value: "lizard",
            emoji: "852923680718848060"
        },
        {
            label: "Meow",
            value: "meow",
            emoji: "885283542576295957"
        },
        {
            label: "Neko",
            value: "neko",
            emoji: "902939601814052904"
        },
        {
            label: "Neko Gif",
            value: "ngif",
            emoji: "902939601814052904"
        },
        {
            label: "Pat",
            value: "pat",
            emoji: "822152587033837579"
        },
        {
            label: "Slap",
            value: "slap",
            emoji: "638480830204870710"
        },
        {
            label: "Smug",
            value: "smug",
            emoji: "701255431854489630"
        },
        {
            label: "Spank",
            value: "spank",
            description: "? Possible NSFW results",
            emoji: "648393455264989196"
        },
        {
            label: "Tickle",
            value: "tickle",
            emoji: "852924118239936522"
        },
        {
            label: "Wallpaper",
            value: "wallpaper",
            description: "? Possible NSFW results",
            emoji: "586303697739448320"
        },
        {
            label: "Woof",
            value: "woof",
            emoji: "808379650341339175"
        }
    ]);

const rerollButton = new ButtonBuilder()
    .setCustomId("next")
    .setLabel("Next")
    .setStyle(ButtonStyle.Primary);

const iLostButton = new ButtonBuilder()
    .setCustomId("i_lost")
    .setLabel("I Lost")
    .setStyle(ButtonStyle.Secondary);

const actionRowMenu = new ActionRowBuilder()
    .addComponents(waifuMenu);

const actionRowButtons = new ActionRowBuilder()
    .addComponents(rerollButton, iLostButton);

const instance = new EmbedBuilder()
    .setTitle("Embrace the Waifus");

const data = new SlashCommandBuilder()
    .setName("waifu")
    .setDescription("God I love looking at waifus");

async function execute(interaction: CommandInteraction) {
    endpointTracker.set(interaction.channelId, "avatar");
    const response = await fetch(`https://nekos.life/api/v2/img/${endpointTracker.get(interaction.channelId)}`);
    const data = await response.json();
    instance.setImage(data.url);
    const messageResponse = await interaction.reply({ embeds: [instance], components: [actionRowMenu, actionRowButtons] as any });
    
    const collector = messageResponse.createMessageComponentCollector();

    collector.on("collect", async i => {
        switch (i.componentType) {
            case ComponentType.StringSelect:
                const endpoint = i.values[0];
                endpointTracker.set(i.channelId, endpoint);
                const response = await fetch(`https://nekos.life/api/v2/img/${endpoint}`);
                const data = await response.json();
                instance.setImage(data.url);
                i.update({ embeds: [instance] })
                break;

            case ComponentType.Button:
                switch (i.customId) {
                    case "next":
                        const response = await fetch(`https://nekos.life/api/v2/img/${endpointTracker.get(interaction.channelId)}`);
                        const data = await response.json();
                        instance.setImage(data.url);
                        i.update({ embeds: [instance] })
                        break;

                    case "i_lost":
                        i.reply(`lmao you lost, ${i.member}`);
                        break;
                }
                break;
        }
    });
}

export { data, execute };
