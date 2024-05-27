const translatedChars = {
    characters: [
        { translation: 'a', japeneseText: 'あ' },
        { translation: 'b', japeneseText: 'b' },
        { translation: 'c', japeneseText: 'c' },
        { translation: 'd', japeneseText: 'd' },
        { translation: 'e', japeneseText: 'e' },
        { translation: 'f', japeneseText: 'f' },
        { translation: 'g', japeneseText: 'g' },
        { translation: 'h', japeneseText: 'h' },
        { translation: 'i', japeneseText: '私' },
        { translation: 'j', japeneseText: 'j' },
        { translation: 'k', japeneseText: 'k' },
        { translation: 'l', japeneseText: '私' },
        { translation: 'm', japeneseText: 'メートル' },
        { translation: 'n', japeneseText: 'n' },
        { translation: 'o', japeneseText: 'ああ' },
        { translation: 'p', japeneseText: 'p' },
        { translation: 'q', japeneseText: 'q' },
        { translation: 'r', japeneseText: 'r' },
        { translation: 's', japeneseText: 's' },
        { translation: 't', japeneseText: 't' },
        { translation: 'u', japeneseText: 'あなた' },
        { translation: 'v', japeneseText: 'v' },
        { translation: 'w', japeneseText: 'w' },
        { translation: 'x', japeneseText: 'バツ' },
        { translation: 'y', japeneseText: 'y' },
        { translation: 'z', japeneseText: 'z' },
    ]
};

// Create a mapping object for quick lookups
const translationMap = translatedChars.characters.reduce((acc, { translation, japeneseText }) => {
    acc[japeneseText] = translation;
    return acc;
}, {});

export default class Translation {
    // Method to detect Japanese letters in the text
    static async detectLetters(text) {
        // Regular expression to match Japanese characters
        const japaneseRegex = /[\u3040-\u30FF\u4E00-\u9FFF]/g;
        const matches = text.match(japaneseRegex);
        return matches ? matches : [];
    }

    // Method to translate detected Japanese letters to English
    static async translate(text) {
        const japaneseChars = await this.detectLetters(text);
        let translatedText = text;

        japaneseChars.forEach(char => {
            if (translationMap[char]) {
                translatedText = translatedText.replace(new RegExp(char, 'g'), translationMap[char]);
            }
        });

        return translatedText;
    }
}
