import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TransactionService {
    private API_URL = environment.api_url;

    constructor(private http: HttpClient) {}

    public getTransactions(
        startDate: Date,
        endDate: Date,
        page: number,
        size: number
    ): Observable<Transaction[]> {
        return this.http.get<Array<Transaction>>(
            `${this.API_URL}/transaction?startDate=2025-08-04&endDate=2025-08-04&page=${page}&size=${size}`
        );
    }
}
