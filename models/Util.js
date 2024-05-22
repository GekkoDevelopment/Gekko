import delay from 'node:timers/promises';

export class Util {
    
    static async escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    static regex = /^[A-Za-z]+$/;
    static emptyOrWhitespaceRegex = /^\s*$/;
    static numericRegex = /&[0-9]+$/;
    static uniqueIdBase = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';

    /**
     * 
     * @param {int} ms - The time in milliseconds to delay the task.
     */
    static async Delay(ms) {
        delay.setTimeout(ms);
    }
    
    /**
     * Test if the given object is a type of string
     * @param {Object} obj 
     * @returns {boolean}
     */
    static isString = function(obj) {
        return typeof obj === 'string';
    }

    static isNum = function(obj) {
        return typeof obj === 'number'
    }

    static uniqueId = () => {
        let id = '';

        for (let i = 0; i < 21; i++) {
            id += this.uniqueIdBase[(Math.random() * 64) | 0];
        }
    }
}