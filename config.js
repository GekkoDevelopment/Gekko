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
        devTestLogChannel: '1226548220801450074', //  The channel in the main support discord where commands that contains logs and stuff.

        devBugReportsChannel: '1227662388409663609' // The channel that the bug reports go to.
    },

    database: {
        host: '198.244.148.129', // The host IP for Gekkō's database.
        port: 3306, // The port for database uses to connect
        name: 's2_gekko', // The database name for Gekkō that stores all of the bot information
        username: 'u2_YcRpm2I6VN', // The username for Gekkō's Database
        password: '0A!=JiH6l+T!IMZKjJH5Z0@C' // The password for Gekkō's database.
    },

    apiKeys: {
        tenorApi: 'AIzaSyCC6haPOEqn-p5I8oJdyyIjJAXkYQGWJcQ', // The API key used for our random gif command.
        chessAPI: 'lip_fWKAMXrBVDeuZfsG8W6P' // The API key that interacts with our chess command. (You can make the key from here: https://lichess.org/account/oauth/token)
    },

    githubApi: {
        url: 'https://api.github.com/repos/GekkoDevelopment/Gekko/issues',
        token: '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'
    },

    assets: {
        gekkoBanner: 'https://i.imgur.com/EZjebpm.png', // Gekkō's main profile banner.
        gekkoBanner2: 'https://i.imgur.com/icOLzqm.png', // The second banner for Gekkō without the text.
        gekkoLogo: 'https://media.discordapp.net/attachments/1226564051488870450/1226564091913441391/image.png?ex=662539d3&is=6612c4d3&hm=1f5f942aadea918225099ca799aa1f54e40e44beef9d45b8de491e642c1b9db5&=&format=webp&quality=lossless&width=500&height=500', // Gekkō's main profile logo.
    },

    emojis: {
        d1: '<:gekko_d1:1226997324560203906>', // One Dice Dot
        d2: '<:gekko_d2:1226997326237663293>', // Two Dice Dot
        d3: '<:gekko_d3:1226997327647080540>', // Three Dice Dot
        d4: '<:gekko_d4:1226997329173942467>', // Four Dice Dot
        d5: '<:gekko_d5:1226997330457399427>', // Five Dice Dot
        d6: '<:gekko_d6:1226997331803504711>', // Six Dice Dot
        ratingGreen: '<:ratingGreen:1228098304844501003>', // Good Rating
        ratingAmber: '<:ratingAmber:1228098312012562532>', // Mid Rating
        ratingRed: '<:ratingRed:1228098317905297500>', // Bad Rating
        ratingNa: '<:ratingNA:1228100149415251988>', // N/A Rating
        inspect: '<:wannainspect:1228453507749777481>', // Wanna Inspect emoji
        noted: '<:BeepNoted:1228454277899489336>', // Noted Emoji
        green: '<:green:1229766565633720381>', // Green Circle Emoji
        amber: '<:amber:1230154433019514982>', // Amber Circle Emoji
        red: '<:red:1229766554548305940>', // Red Circle Emoji
        warning: '<:warning:1230154510375063603>', // Warning Emoji
        passed: '<:passed:1230154594126925885>', // Passed Emoji
        failed: '<:failed:1230154570588749844>', // Failed Emoji
        questionMark: '<:gekko_questionMark:1226506605596512287>', // Question Mark Emoji
        exclamationMark: '<:gekko_exclamationMark:1226506603755475015>',
        configuration: '<:hammer:1230255584117264487>', // Config Emoji
        discord: '<:discordemote:1230262224057274439>', // Discord Emoji (Literally Discord's logo.)
        gekko: '<:gekkoemote:1230261004395483367>', // Gekkō Discord Profile Picture
        arrowLeft: '<a:gekko_arrowLeft:1230484672715161680> ', // Arrow Pointing to the Left
        arrowRight: '<a:gekko_arrowRight:1230484728130310227>', // Arrow Pointing to the Right
        gekkoStar: '<:gekkoStar:1238513900295819345>', // Gekko Star (Purple)
        discordOn: '<:discordon:1238515456135135303>', // Slider on (green)
        discordOff: '<:discordoff:1238515457384906883>', // Slider off (red)
        gekkoCoin: '<a:heartCoin:1239200690039951501>', // Gekko BokCoin(animated)
        gekkoBill: '<:gekkoBill:1239198493411643442>', // pink bill note
        gekkoWalking: '<a:gekkoWalking:1239204341693415484>', //(animated walking)
        gekkoCawfee: '<:kawfee:1239297709299597392>',

    }
}