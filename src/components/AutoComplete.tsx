import * as React from 'react';
import defaultStyles from './defaultStyles';

interface IProps {
    onChange: (value: string) => void;
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

enum KeyCode {
    ARROW_UP = 38,
    ARROW_DOWN = 40,
    ENTER_KEY = 13,
    ESC_KEY = 27,
}

class Autocomplete extends React.Component<IProps, IState> {
    state: IState = { suggestions: [], index: undefined };
    timer: number = 0;

    componentWillReceiveProps(nextProps: IProps): void {
        if(nextProps.suggestions !== this.props.suggestions) {
            this.setState({suggestions: nextProps.suggestions.slice(0, this.props.limit), index: undefined});
        }
    };

    clearAutocomplete = (): void => {
        this.setState({ suggestions: [] })
    };

    selectValue = (suggestion: any): void => {
        this.clearAutocomplete();
        this.handleSelect(suggestion)
    };

    handleSelect = (suggestion: any): void => {
        this.props.onSelect ? this.props.onSelect(suggestion) : this.props.onChange(suggestion.name)
    };

    selectActiveItemAtIndex = (index: number): void => {
        const suggestion: any = this.state.suggestions[index];
        this.setActiveItemAtIndex(index);
        this.setState({index});
        this.props.onChange(suggestion.name)
    };

    handleEnterKey = (): void => {
        const index: number = this.state.index;
        if (index !== undefined) {
            this.selectValue(this.state.suggestions[index])
        }
    };

    handleDownKey = (): void => {
        const index: number = this.state.index;
        if (index === undefined) {
            this.selectActiveItemAtIndex(0)
        } else {
            const nextIndex = (index + 1) % this.state.suggestions.length;
            this.selectActiveItemAtIndex(nextIndex)
        }
    };

    handleUpKey = (): void => {
        const index: number = this.state.index;
        if (index === undefined) {
            this.selectActiveItemAtIndex(this.state.suggestions.length - 1)
        } else {
            let prevIndex: number;
            if (index === 0) {
                prevIndex = this.state.suggestions.length - 1
            } else {
                prevIndex = (index - 1) % this.state.suggestions.length
            }
            this.selectActiveItemAtIndex(prevIndex)
        }
    };

    handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {

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
                break
        }
    };

    setActiveItemAtIndex = (index: number): void => {
        const suggestions: any = this.state.suggestions.map((item, key) => {
            if (key === index) {
                return Object.assign({}, item, { active: true })
            } else {
                return Object.assign({}, item, { active: false })
            }
        });
        this.setState({suggestions});
    };

    handleChange = (event: React.FormEvent<HTMLInputElement>): void => {
        const value: string = event.currentTarget.value;
        this.props.onChange(value);
        if (this.timer) {
            clearTimeout(this.timer);
        }
        if (!value) {
            this.clearAutocomplete();
            return
        }
        this.timer = setTimeout(() => {
            this.props.action(value);
        }, 300)
    };

    autocompleteItemStyle = (active: boolean): {} => {
        if (active) {

            return defaultStyles.autocompleteItemActive
        } else {
            return {}
        }
    };

    renderAutocomplete = (): JSX.Element => {
        const { suggestions }: IState = this.state;
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

    renderInput = (): JSX.Element => {
        const { classNames, placeholder, value, inputName, inputId }: IProps = this.props;
        return (
            <input
                type="text"
                placeholder={placeholder}
                className={classNames || ''}
                style={defaultStyles.autocompleteInput}
                value={value || ''}
                onChange={this.handleChange}
                onKeyDown={this.handleInputKeyDown}
                onBlur={() => this.clearAutocomplete()}
                name={inputName || ''}
                id={inputId || ''}
            />
        )
    };

    render() {
        return (
            <div style={defaultStyles.root}>
                {this.renderInput()}
                {this.renderAutocomplete()}
            </div>
        )
    }
}

export default Autocomplete;