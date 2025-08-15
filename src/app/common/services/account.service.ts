import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../models/account.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = environment.api_url;

    public getAccounts(): Observable<Array<Account>> {
        return this.http.get<Array<Account>>(`${this.API_URL}/account`);
    }

    public createAccount(account: Account): Observable<Account> {
        return this.http.post<Account>(`${this.API_URL}/account`, account);
    }
}
