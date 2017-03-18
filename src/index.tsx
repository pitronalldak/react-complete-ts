import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { inject, observer } from 'mobx-react'

import Autocomplete from './components/AutoComplete';

import AppState from './store';

/**
 * @prop {string} value Suggestion.
 */
interface IState {
    value: string;
}

@observer
class AppView extends React.Component<{store: AppState}, IState> {
    state = {value: undefined};

    handleOnChange = (value) => {
        this.setState({value});
    };

    render() {
        const {value} = this.state;
        return (
            <div>
               <Autocomplete
                   action={this.props.store.getCountries}
                   onChange={this.handleOnChange}
                   value={value}
                   suggestions={this.props.store.values}
               />
            </div>
        );
     }
}

const appState =  new AppState();

ReactDOM.render(<AppView store={appState} />, document.getElementById('root'));
