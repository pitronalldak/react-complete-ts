import { observable, action } from 'mobx'
import axios from 'axios'
import {URL} from '../config';
import ICountry from '../models/ICountry';

export default class AppState {
    @observable values: ICountry[];

    constructor() {
        this.values = [];
    }

    @action getCountries = async (value: string) => {
        try {
            const {data} = await axios.get(`${URL}/name/${value}`);
            console.log(data);
            this.values = data;
        } catch (err) {
            try {
                const {data} = await axios.get(`${URL}/alpha/${value}`);
                this.values = data;
            } catch (err) {
                this.values = [];
            }
        }
    };
}
