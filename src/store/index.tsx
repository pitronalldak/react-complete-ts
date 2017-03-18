import { observable, action } from 'mobx'
import axios from 'axios'
import {URL} from '../config';
import ICountry from '../models/ICountry';
import {AxiosResponse} from "axios";

export default class AppState {
    @observable values: ICountry[];

    constructor() {
        this.values = [];
    }

    @action getCountries = async (value: string): Promise<void> => {
        try {
            const {data}: AxiosResponse = await axios.get(`${URL}/name/${value}`);
            this.values = data;
        } catch (err) {
            try {
                const {data}: AxiosResponse = await axios.get(`${URL}/alpha/${value}`);
                this.values = data;
            } catch (err) {
                this.values = [];
            }
        }
    };
}
