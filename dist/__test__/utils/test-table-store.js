"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestTableStore = exports.generateEntity = void 0;
const __1 = require("../..");
function generateEntity(id, name = 'Name', age = 20, city = 'Gondor', postalCode = '0000') {
    return {
        id,
        name,
        age,
        address: {
            city,
            postalCode
        }
    };
}
exports.generateEntity = generateEntity;
class TestTableStore extends __1.TableStore {
    constructor() {
        super({});
    }
}
exports.TestTableStore = TestTableStore;
