const Discord = require("discord.js")
const client = new Discord.Client();

const SaweriaItSelf = require("saweria")
const sc = new SaweriaItSelf()

require('dotenv').config()

let lang = require("./lang.json")

let discordtag = lang.discordtag
let saweriatag = lang.saweriatag

function amountBeautifyer(x) {
    //console.log(`[nomor_titik()] : ${x}`)
    if (x == 0) {
      return 0
    } else if (!x) {
      return 0
    }
    
    if (isNaN(x)) {
      return "NaN"
    }
  
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Discord - Send Webhock
//Big Boi
async function DiscordSendEmbed(client, sc, donations) {
    
    //Declare Webhook Credentials
    let webhok = {
        "id" : lang.discord_webhook_credentials.id,
        "tkn" : lang.discord_webhook_credentials.token
    }

    //Set WebhockClient
    const webhookClient = new Discord.WebhookClient(webhok.id, webhok.tkn);

    //Donation Part
    for (const donation of donations) {
        
        //Check if donation type is normal, do this
        if (donation.type === "normal") {
            //Small Declaration
            let media = donation.media
            let mediatag = null
            
            //Filter
            if (!media) {
                media = null
                mediatag = media.tag
            }

            //Another Declaration
            let donator = donation.donator
            let amount = donation.amount
            let type = donation.type
            let message = donation.message

            //Debug
            //console.log(discordtag + "Normal Donation")
            //console.log(donation.media)

            //Set Embed
            let embed_lang = lang.donation_event.normal.embed

            let title = embed_lang.title
            let color = embed_lang.color
            let description = embed_lang.description
            let emoji = lang.donation_event.succses_emoji
            let footer = lang.donation_event.embed_footer
            //Filter

            if (title.includes("&author&")) {
                title = title.replace("&author&", donator)
            }

            if (title.includes("&amount&")) {
                title = title.replace("&amount&", `Rp.`+ amountBeautifyer(amount))
            }

            if (description.includes("&message&")) {
                description = description.replace("&message&", message)
            }

            if (!emoji || emoji == null) {
                emoji = ""
            } else {
                emoji = `${emoji} `
            }

            if (!footer || footer == null) {
                footer = "Donation Alert With Saweria API"
            }

            let embed = new Discord.MessageEmbed()
            .setTitle(`${emoji}${title}`)
            .setColor(color)
            .setDescription(description)
            .setFooter(footer)
            .setTimestamp(Date.now())

            let embedImage = new Discord.MessageEmbed()
            .setTitle(`${emoji}${title}`)
            .setColor(color)
            .setDescription(description)
            .setFooter(footer)
            .setImage(media.src[0])
            .setTimestamp(Date.now())

            //Send Embed
            try {
                if (!media) {
                    webhookClient.send(embed);
                } else {
                    webhookClient.send(embedImage);
                }
            } catch (e) {
                console.log(discordtag + `Failed Send Embed: ${e}`)
            }
        } else if (donation.type === "media") {
            //console.log(donations)
            let media = donation.media
            let mediatag = media.id
            
            //Filter

            //Another Declaration
            let donator = donation.donator
            let amount = donation.amount
            let type = donation.type
            let message = donation.message

            //Debug
            //console.log(discordtag + "Normal Donation")
            //console.log(donation.media)

            //Set Embed
            let embed_lang = lang.donation_event.mediashare.embed

            let title = embed_lang.title
            let color = embed_lang.color
            let description = embed_lang.description
            let emoji = lang.donation_event.succses_emoji
            let footer = lang.donation_event.embed_footer
            //Filter

            if (title.includes("&author&")) {
                title = title.replace("&author&", donator)
            }

            if (title.includes("&amount&")) {
                title = title.replace("&amount&", `Rp.`+ amountBeautifyer(amount))
            }

            if (description.includes("&message&")) {
                description = description.replace("&message&", message)
            }

            if (!emoji || emoji == null) {
                emoji = ""
            } else {
                emoji = `${emoji} `
            }

            if (!footer || footer == null) {
                footer = "Donation Alert With Saweria API"
            }

            let embed = new Discord.MessageEmbed()
            .setTitle(`${emoji}${title}`)
            .setColor(color)
            .setDescription(description)
            .setFooter(footer)
            .setURL(`https://www.youtube.com/watch?v=` + mediatag)
            .setTimestamp(Date.now())

            //Send Embed
            try {
                webhookClient.send(embed);
            } catch (e) {
                console.log(discordtag + `Failed Send Embed: ${e}`)
            }
        }
      }
}

//Saweria - Login Event
sc.on("login", async (user) => {
	console.log(saweriatag + "Logged in as: ", user.username);
    console.log("")

    let streamkey = await sc.getStreamKey()
    sc.setStreamKey(streamkey)

    //Small Filter
    let embed_lang = lang.donation_event.normal.embed
    let title = embed_lang.title
    let color = embed_lang.color
    let description = embed_lang.description

    if (lang.discord_webhook_credentials.id == null || typeof lang.discord_webhook_credentials.id == "undefined" || !lang.discord_webhook_credentials.id) {
         console.log(discordtag + `Discord Webhook ID Is Required!`)
    }

    if (lang.discord_webhook_credentials.token == null || typeof lang.discord_webhook_credentials.token == "undefined" || !lang.discord_webhook_credentials.token) {
         console.log(discordtag + `Discord Webhook Token Is Required!`)
    }

    if (!title || title == null || typeof title == "undefined") {
         console.log(discordtag + "Discord Normal Embed title Is Required!")
    }

    if (!color || color == null || typeof color == "undefined") {
         console.log(discordtag + "Discord Normal Embed color Is Required!")
    }

    if (!description || description == null || typeof description == "undefined") {
         console.log(discordtag + "Discord Normal Embed description Is Required!")
    }
});

//Saweria - Donations Event
sc.on("donations", async (donations) => {
	console.log(saweriatag + `New Donation!`)

    //Function Call
    DiscordSendEmbed(client, sc, donations)
});

//Saweria - Error Event
sc.on("error", (error) => { 
    //console.log(error);
    if (!error) return
    if (!error.message) return
    if (!error.status) return
    if (typeof error.message == "undefined") return

    console.log(saweriatag + `ERROR: ${error.status} ${error.message}`)
});

//Saweria - Login
sc.login(process.env.SAWERIA_EMAIL, process.env.SAWERIA_PASSWORD);