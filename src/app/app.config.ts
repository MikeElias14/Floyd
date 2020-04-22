import { Injectable } from '@angular/core';
import { IAppConfig } from './models/app-config.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppConfig {
    static settings: IAppConfig;
    constructor(private http: HttpClient) {}
    load() {
        const jsonFile = `/assets/config/config.dev.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response: IAppConfig) => {
               AppConfig.settings = response as IAppConfig;
               resolve();
            }).catch((response: any) => {
               reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }
}
