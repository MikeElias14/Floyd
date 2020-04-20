import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
    getHoldings() {
        const res = {
            TSLA: 750,
            AC: 100,
            UBER: 300
        };
        return res;
    }
}
