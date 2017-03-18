"use strict";
const React = require('react');
const defaultStyles_1 = require('./defaultStyles');
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
            const ARROW_UP = 38;
            const ARROW_DOWN = 40;
            const ENTER_KEY = 13;
            const ESC_KEY = 27;
            switch (event.keyCode) {
                case ENTER_KEY:
                    event.preventDefault();
                    this.handleEnterKey();
                    break;
                case ARROW_DOWN:
                    event.preventDefault();
                    this.handleDownKey();
                    break;
                case ARROW_UP:
                    event.preventDefault();
                    this.handleUpKey();
                    break;
                case ESC_KEY:
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
            const value = event.target.value;
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.props.onChange(value);
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
            return (React.createElement("input", {type: "text", placeholder: placeholder, className: classNames || '', style: defaultStyles_1.default.autocompleteInput, value: value, onChange: this.handleChange, onKeyDown: this.handleInputKeyDown, onBlur: () => this.clearAutocomplete(), name: inputName || '', id: inputId || ''}));
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.suggestions !== this.props.suggestions) {
            this.setState({ suggestions: nextProps.suggestions.slice(0, this.props.limit), index: undefined });
        }
    }
    ;
    render() {
        const { classNames } = this.props;
        return (React.createElement("div", {style: defaultStyles_1.default.root}, 
            this.renderInput(), 
            this.renderAutocomplete()));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Autocomplete;
