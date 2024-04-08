class Utility {
    static async Delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

