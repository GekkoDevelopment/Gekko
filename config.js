module.exports = {
    bot: {
        token: 'MTIyNjMzNDk1MjE3MDMyODEwNA.GwC0YA.hvRSSnzsJjS7baZBFFqy0hK41KcHfbgMRJvkkM', // The token to log into the bot | DO NOT CHANGE
        clientId: '1226334952170328104', // The client ID for the bot.
        secret: 't5iTXJ9e6Y_q7B8IVBbrW6U5DiwGEbRa' // The client secret ID for the bot.
    },

    developer: { // This part of the config is only used for the bot developers.
        dev1Id: '795059255073177630', // Kier
        dev2Id: '1016846998021873714', // RedMeansWar / Brandon

        devTestChannel: '1226522704195227771', // The channel in the main support discord where commands are tested.
        devGuild: '1226501941249576980', // The guild ID for Gekkō Support / Testing.
        devLogChannel: '1226502649978032138', // The channel that Gekkō Support user and command logs to.
        devTestLogChannel: '1226548220801450074', //  The channel in the main support discord where commands that contains logs and .

        devBugReportsChannel: '1227662388409663609' // The channel that the bug reports go to.
    },

    database: {
        host: '198.244.148.129', // The host IP for Gekkō's database.
        port: 3306, // The port for database uses to connect
        name: 's2_gekko', // The database name for Gekkō that stores all of the bot information
        username: 'u2_YcRpm2I6VN', // The username for Gekkō's Database
        password: '0A!=JiH6l+T!IMZKjJH5Z0@C' // The password for Gekkō's database.
    },

    panel: {
        host: 'http://198.244.148.129/', // The host for pterodactyl that is used to run the bot.
        apiKey: 'ptlc_URrfpJa5WDu9uN2dr1MCLCHODqRFyFTFPC0i07reuSN',
        gekkoServerId: 'f9f4a360-269b-4bd6-8572-c4f9d47fe2b4' // The server id that runs Gekkō
    },

    apiKeys: {
        tenorApi: 'AIzaSyCC6haPOEqn-p5I8oJdyyIjJAXkYQGWJcQ' // The API key used for our random gif command.
    },

    assets: {
        gekkoBanner: 'https://cdn.discordapp.com/attachments/1226564051488870450/1226587759502954576/card.png?ex=66254fde&is=6612dade&hm=a750c8299cf43e15b773976647ae045fc1c9e1c5cab1ec2b9b927f1e869e738e&',
        gekkoLogo: 'https://media.discordapp.net/attachments/1226564051488870450/1226564091913441391/image.png?ex=662539d3&is=6612c4d3&hm=1f5f942aadea918225099ca799aa1f54e40e44beef9d45b8de491e642c1b9db5&=&format=webp&quality=lossless&width=500&height=500'
    },

    emojis: {
        d1: '<:gekko_d1:1226997324560203906>', // One Dice Dot
        d2: '<:gekko_d2:1226997326237663293>', // Two Dice Dot
        d3: '<:gekko_d3:1226997327647080540>', // Three Dice Dot
        d4: '<:gekko_d4:1226997329173942467>', // Four Dice Dot
        d5: '<:gekko_d5:1226997330457399427>', // Five Dice Dot
        d6: '<:gekko_d6:1226997331803504711>', // Six Dice Dot
        ratingGreen: '<:ratingGreen:1228098304844501003>',
        ratingAmber: '<:ratingAmber:1228098312012562532>',
        ratingRed: '<:ratingRed:1228098317905297500>',
        ratingNa: '<:ratingNA:1228100149415251988>',
        inspect: '<:wannainspect:1228453507749777481>',
        noted: '<:BeepNoted:1228454277899489336>'
    }
}