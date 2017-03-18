import * as React from 'react';
import defaultStyles from './defaultStyles';

interface IProps {
    onChange?: (value: string) => void;
    onSelect?: (value: string) => void;
    action: (value: any) => void;
    suggestions: any[];
    classNames?: any;
    styles?: any;
    placeholder?: string;
    value?: any;
    inputName?: string;
    inputId?: string;
    debounce: number;
    limit: number;
}

interface IState {
    suggestions?: any[];
    index?: number;
}

class Autocomplete extends React.Component<IProps, IState> {
    state = { suggestions: [], index: undefined };
    timer = 0;

    componentWillReceiveProps(nextProps: IProps) {
        if(nextProps.suggestions !== this.props.suggestions) {
            this.setState({suggestions: nextProps.suggestions.slice(0, this.props.limit), index: undefined});
        }
    };

    clearAutocomplete = () => {
        this.setState({ suggestions: [] })
    };

    selectValue = (suggestion: any) => {
        this.clearAutocomplete();
        this.handleSelect(suggestion)
    };

    handleSelect = (suggestion: any) => {
        this.props.onSelect ? this.props.onSelect(suggestion) : this.props.onChange(suggestion.name)
    };

    selectActiveItemAtIndex = (index: number) => {
        const suggestion = this.state.suggestions[index];
        this.setActiveItemAtIndex(index);
        this.setState({index});
        this.props.onChange(suggestion.name)
    };

    handleEnterKey = () => {
        const index = this.state.index;
        if (index !== undefined) {
            this.selectValue(this.state.suggestions[index])
        }
    };

    handleDownKey = () => {
        const index = this.state.index;
        if (index === undefined) {
            this.selectActiveItemAtIndex(0)
        } else {
            const nextIndex = (index + 1) % this.state.suggestions.length;
            this.selectActiveItemAtIndex(nextIndex)
        }
    };

    handleUpKey = () => {
        const index = this.state.index;
        if (index === undefined) {
            this.selectActiveItemAtIndex(this.state.suggestions.length - 1)
        } else {
            let prevIndex;
            if (index === 0) {
                prevIndex = this.state.suggestions.length - 1
            } else {
                prevIndex = (index - 1) % this.state.suggestions.length
            }
            this.selectActiveItemAtIndex(prevIndex)
        }
    };

    handleInputKeyDown = (event) => {
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
                break
        }
    };

    setActiveItemAtIndex = (index) => {
        const suggestions = this.state.suggestions.map((item, key) => {
            if (key === index) {
                return Object.assign({}, item, { active: true })
            } else {
                return Object.assign({}, item, { active: false })
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
                style={defaultStyles.autocompleteContainer}
            >
                {suggestions.map((p, key) => (
                    <div
                        key={key}
                        onMouseOver={() => this.setActiveItemAtIndex(key)}
                        onMouseDown={() => this.selectValue(p)}
                        style={Object.assign({}, defaultStyles.autocompleteItem, this.autocompleteItemStyle(p.active))}
                    >
                        {p.name}
                    </div>
                ))}
            </div>
        )
    };

    renderInput = () => {
        const { classNames, placeholder, value, inputName, inputId } = this.props;
        return (
            <input
                type="text"
                placeholder={placeholder}
                className={classNames || ''}
                style={defaultStyles.autocompleteInput}
                value={value}
                onChange={this.handleChange}
                onKeyDown={this.handleInputKeyDown}
                onBlur={() => this.clearAutocomplete()}
                name={inputName || ''}
                id={inputId || ''}
            />
        )
    };

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