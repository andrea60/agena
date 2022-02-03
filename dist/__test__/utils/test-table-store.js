"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestTableStore = exports.generateEntity = void 0;
const __1 = require("../..");
const agena_store_1 = require("../../agena-store");
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
let TestTableStore = class TestTableStore extends __1.TableStore {
    constructor() {
        super({});
    }
};
TestTableStore = __decorate([
    (0, agena_store_1.AgenaStore)({})
], TestTableStore);
exports.TestTableStore = TestTableStore;
