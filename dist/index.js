"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const React = require('react');
const ReactDOM = require('react-dom');
const mobx_react_1 = require('mobx-react');
const AutoComplete_1 = require('./components/AutoComplete');
const store_1 = require('./store');
let AppView = class AppView extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { value: undefined };
        this.handleOnChange = (value) => {
            this.setState({ value });
        };
    }
    render() {
        const { value } = this.state;
        return (React.createElement("div", {style: { width: '200px' }}, 
            React.createElement(AutoComplete_1.default, {action: this.props.store.getCountries, onChange: this.handleOnChange, value: value, suggestions: this.props.store.values, debounce: 300, limit: 10})
        ));
    }
};
AppView = __decorate([
    mobx_react_1.observer
], AppView);
const appState = new store_1.default();
ReactDOM.render(React.createElement(AppView, {store: appState}), document.getElementById('root'));
