"use strict";
const React = require('react');
const defaultStyles_1 = require('./defaultStyles');
var KeyCode;
(function (KeyCode) {
    KeyCode[KeyCode["ARROW_UP"] = 38] = "ARROW_UP";
    KeyCode[KeyCode["ARROW_DOWN"] = 40] = "ARROW_DOWN";
    KeyCode[KeyCode["ENTER_KEY"] = 13] = "ENTER_KEY";
    KeyCode[KeyCode["ESC_KEY"] = 27] = "ESC_KEY";
})(KeyCode || (KeyCode = {}));
class Autocomplete extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { suggestions: [], index: undefined };
        this.timer = 0;
        this.clearAutocomplete = () => {
            this.setState({ suggestions: [] });
        };
        this.selectValue = (suggestion) => {
            this.clearAutocomplete();
            this.handleSelect(suggestion);
        };
        this.handleSelect = (suggestion) => {
            this.props.onSelect ? this.props.onSelect(suggestion) : this.props.onChange(suggestion.name);
        };
        this.selectActiveItemAtIndex = (index) => {
            const suggestion = this.state.suggestions[index];
            this.setActiveItemAtIndex(index);
            this.setState({ index });
            this.props.onChange(suggestion.name);
        };
        this.handleEnterKey = () => {
            const index = this.state.index;
            if (index !== undefined) {
                this.selectValue(this.state.suggestions[index]);
            }
        };
        this.handleDownKey = () => {
            const index = this.state.index;
            if (index === undefined) {
                this.selectActiveItemAtIndex(0);
            }
            else {
                const nextIndex = (index + 1) % this.state.suggestions.length;
                this.selectActiveItemAtIndex(nextIndex);
            }
        };
        this.handleUpKey = () => {
            const index = this.state.index;
            if (index === undefined) {
                this.selectActiveItemAtIndex(this.state.suggestions.length - 1);
            }
            else {
                let prevIndex;
                if (index === 0) {
                    prevIndex = this.state.suggestions.length - 1;
                }
                else {
                    prevIndex = (index - 1) % this.state.suggestions.length;
                }
                this.selectActiveItemAtIndex(prevIndex);
            }
        };
        this.handleInputKeyDown = (event) => {
            switch (event.keyCode) {
                case KeyCode.ENTER_KEY:
                    event.preventDefault();
                    this.handleEnterKey();
                    break;
                case KeyCode.ARROW_DOWN:
                    event.preventDefault();
                    this.handleDownKey();
                    break;
                case KeyCode.ARROW_UP:
                    event.preventDefault();
                    this.handleUpKey();
                    break;
                case KeyCode.ESC_KEY:
                    this.clearAutocomplete();
                    break;
            }
        };
        this.setActiveItemAtIndex = (index) => {
            const suggestions = this.state.suggestions.map((item, key) => {
                if (key === index) {
                    return Object.assign({}, item, { active: true });
                }
                else {
                    return Object.assign({}, item, { active: false });
                }
            });
            this.setState({ suggestions });
        };
        this.handleChange = (event) => {
            const value = event.currentTarget.value;
            this.props.onChange(value);
            if (this.timer) {
                clearTimeout(this.timer);
            }
            if (!value) {
                this.clearAutocomplete();
                return;
            }
            this.timer = setTimeout(() => {
                this.props.action(value);
            }, 300);
        };
        this.autocompleteItemStyle = (active) => {
            if (active) {
                return defaultStyles_1.default.autocompleteItemActive;
            }
            else {
                return {};
            }
        };
        this.renderAutocomplete = () => {
            const { suggestions } = this.state;
            if (suggestions.length === 0) {
                return null;
            }
            return (React.createElement("div", {style: defaultStyles_1.default.autocompleteContainer}, suggestions.map((p, key) => (React.createElement("div", {key: key, onMouseOver: () => this.setActiveItemAtIndex(key), onMouseDown: () => this.selectValue(p), style: Object.assign({}, defaultStyles_1.default.autocompleteItem, this.autocompleteItemStyle(p.active))}, p.name)))));
        };
        this.renderInput = () => {
            const { classNames, placeholder, value, inputName, inputId } = this.props;
            return (React.createElement("input", {type: "text", placeholder: placeholder, className: classNames || '', style: defaultStyles_1.default.autocompleteInput, value: value || '', onChange: this.handleChange, onKeyDown: this.handleInputKeyDown, onBlur: () => this.clearAutocomplete(), name: inputName || '', id: inputId || ''}));
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.suggestions !== this.props.suggestions) {
            this.setState({ suggestions: nextProps.suggestions.slice(0, this.props.limit), index: undefined });
        }
    }
    ;
    render() {
        return (React.createElement("div", {style: defaultStyles_1.default.root}, 
            this.renderInput(), 
            this.renderAutocomplete()));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Autocomplete;
