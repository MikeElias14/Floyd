import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
    getHoldings() {
        const res = {
            ABX: {
                ammount: 17,
                char: 'gold'
            },
            AC: {
                ammount: 10,
                char: 'other'
            },
            CDZ: {
                ammount: 25,
                char: 'div'
            },
            CGR: {
                ammount: 8,
                char: 'reit'
            },
            CWW: {
                ammount: 5,
                char: 'other'
            },
            'HR.UN': {
                ammount: 5,
                char: 'reit'
            },
            'REI.UN': {
                ammount: 3,
                char: 'reit'
            },
            VDY: {
                ammount: 25,
                char: 'div'
            },
            XUU: {
                ammount: 4,
                char: 'market'
            },
        };
        return res;
    }
}
