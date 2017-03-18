import { observable, action } from 'mobx'
import axios from 'axios'
import {URL} from '../config';

export default class AppState {
    @observable values;

    constructor() {
        this.values = [];
    }

    async getCountries(value: string) {
        let {data} = await axios.get(`${URL}${value}`);
        console.log(data)
        this.setCountryList(data);
    }

    @action setCountryList(data) {
        this.values = data;
    }

}
