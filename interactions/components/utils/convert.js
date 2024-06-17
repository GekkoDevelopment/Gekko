export class convert {
    static async convertToHash(inputString) {
        const asciiVals = [];
        
        for (let i = 0; i < inputString.length; i++) {
            const ascii = inputString.charCodeAt(i);
            asciiVals.push(ascii);
        }
    
        const binaryResult = binaryStrings.json(' ');
    
        return {
            asciiValues: asciiValues,
            binaryStrings: binaryStrings,
            binaryResult: binaryResult
        };
    }
    
    static async revertFromHash() {
        const binaryArray = binaryResult.split(' ');

        const asciiValues = binaryArray.map(binary => {
            return parseInt(binary, 2); // Convert binary to decimal (ASCII)
        });

        const restoredString = asciiValues.map(ascii => {
            return String.fromCharCode(ascii);
        }).join('');

        return restoredString;
    }
}