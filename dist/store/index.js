"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const mobx_1 = require('mobx');
const axios_1 = require('axios');
const config_1 = require('../config');
class AppState {
    constructor() {
        this.getCountries = (value) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield axios_1.default.get(`${config_1.URL}/name/${value}`);
                console.log(data);
                this.values = data;
            }
            catch (err) {
                try {
                    const { data } = yield axios_1.default.get(`${config_1.URL}/alpha/${value}`);
                    this.values = data;
                }
                catch (err) {
                    this.values = [];
                }
            }
        });
        this.values = [];
    }
}
__decorate([
    mobx_1.observable
], AppState.prototype, "values", void 0);
__decorate([
    mobx_1.action
], AppState.prototype, "getCountries", void 0);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppState;