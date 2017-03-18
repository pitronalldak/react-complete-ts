import * as React from 'react';
import defaultStyles from './defaultStyles';

/**
 * @prop {Function} onChange Callback function when value changed.
 * @prop {Function} onSelect Callback function when value selected.
 */
interface IProps {
    onChange?: (value: string) => void;
    onSelect?: (value: string) => void;
    action: (value: any) => void;
    suggestions: string[];
    classNames?: any;
    styles?: any;
    placeholder?: string;
    value?: any;
    inputName?: string;
    inputId?: string;
}

/**
 * @prop {string[]} suggestions Suggestions list.
 */
interface IState {
    suggestions: any[];
}

class Autocomplete extends React.Component<IProps, IState> {
    state = { suggestions: [] };
    timer = 0;

    clearAutocomplete = () => {
        this.setState({ suggestions: [] })
    };

    selectValue = (suggestion) => {
        this.clearAutocomplete();
        this.handleSelect(suggestion)
    }

    handleSelect = (suggestion) => {
        this.props.onSelect ? this.props.onSelect(suggestion) : this.props.onChange(suggestion)
    };

    getActiveItem = () => {
        return this.state.suggestions.find(item => item.active)
    };

    selectActiveItemAtIndex = (index) => {
        const suggestion = this.state.suggestions.find(item => item.index === index);
        this.setActiveItemAtIndex(index);
        this.props.onChange(suggestion)
    };

    handleEnterKey() {
        const activeItem = this.getActiveItem();
        if (activeItem !== undefined) {
            this.selectValue(activeItem)
        }
    }

    handleDownKey() {
        const activeItem = this.getActiveItem();
        if (activeItem === undefined) {
            this.selectActiveItemAtIndex(0)
        } else {
            const nextIndex = (activeItem.index + 1) % this.state.suggestions.length
            this.selectActiveItemAtIndex(nextIndex)
        }
    }

    handleUpKey() {
        const activeItem = this.getActiveItem()
        if (activeItem === undefined) {
            this.selectActiveItemAtIndex(this.state.suggestions.length - 1)
        } else {
            let prevIndex
            if (activeItem.index === 0) {
                prevIndex = this.state.suggestions.length - 1
            } else {
                prevIndex = (activeItem.index - 1) % this.state.suggestions.length
            }
            this.selectActiveItemAtIndex(prevIndex)
        }
    }

    handleInputKeyDown = (event) => {
        const ARROW_UP = 38
        const ARROW_DOWN = 40
        const ENTER_KEY = 13
        const ESC_KEY = 27

        switch (event.keyCode) {
            case ENTER_KEY:
                event.preventDefault();
                this.handleEnterKey();
                break;
            case ARROW_DOWN:
                event.preventDefault(); // prevent the cursor from moving
                this.handleDownKey();
                break;
            case ARROW_UP:
                event.preventDefault(); // prevent the cursor from moving
                this.handleUpKey();
                break;
            case ESC_KEY:
                this.clearAutocomplete();
                break
        }
    }

    setActiveItemAtIndex = (index) => {
        const suggestions = this.state.suggestions.map((item, idx) => {
            if (idx === index) {
                return Object.assign({},{item, active: true })
            } else {
                return Object.assign({},{item, active: false })
            }
        });
        this.setState({suggestions});
    };

    handleChange = (event) => {
        const value = event.target.value;
        if (this.timer) {
            // There is a running timer from a previous keyup
            clearTimeout(this.timer);
        }
        this.props.onChange(value);
        if (!value) {
            this.clearAutocomplete();
            return
        }
        this.timer = setTimeout(() => {
            this.props.action(value);
        }, 300)
    };

    autocompleteItemStyle = (active) => {
        if (active) {

            return defaultStyles.autocompleteItemActive
        } else {
            return {}
        }
    };

    renderAutocomplete = () => {
        const { suggestions } = this.state;
        if (suggestions.length === 0) { return null }

        return (
            <div
                className={this.props.classNames.autocompleteContainer || ''}
                style={defaultStyles.autocompleteContainer}
            >
                {suggestions.map((p, key) => (
                    <div
                        key={key}
                        onMouseOver={() => this.setActiveItemAtIndex(p.index)}
                        onMouseDown={() => this.selectValue(p.suggestion)}
                        style={Object.assign({}, defaultStyles.autocompleteItem, this.autocompleteItemStyle(p.active))}
                    >
                        {p.suggestion}
                    </div>
                ))}
            </div>
        )
    }

    renderInput = () => {
        const { classNames, placeholder, value, inputName, inputId } = this.props;
        return (
            <input
                type="text"
                placeholder={placeholder}
                className={classNames || ''}
                value={value}
                onChange={this.handleChange}
                onKeyDown={this.handleInputKeyDown}
                onBlur={() => this.clearAutocomplete()}
                name={inputName || ''}
                id={inputId || ''}
            />
        )
    }

    render() {
        const { classNames } = this.props;
        return (
            <div style={defaultStyles.root}>
                {this.renderInput()}
                {this.renderAutocomplete()}
            </div>
        )
    }
}

export default Autocomplete;