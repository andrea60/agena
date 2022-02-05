"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestSimpleStore = void 0;
const __1 = require("../..");
const agena_store_1 = require("../../agena-store");
let TestSimpleStore = class TestSimpleStore extends __1.SimpleStore {
    constructor() {
        super({
            x: 0,
            a: { y: 0 }
        });
    }
};
TestSimpleStore = __decorate([
    (0, agena_store_1.AgenaStore)({})
], TestSimpleStore);
exports.TestSimpleStore = TestSimpleStore;
//# sourceMappingURL=test-simple-store.js.map