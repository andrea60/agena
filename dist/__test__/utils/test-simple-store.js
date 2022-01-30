"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestSimpleStore = void 0;
const __1 = require("../..");
class TestSimpleStore extends __1.SimpleStore {
    constructor() {
        super({
            x: 0,
            a: { y: 0 }
        });
    }
}
exports.TestSimpleStore = TestSimpleStore;
