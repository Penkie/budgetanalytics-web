import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Pageable, PageableResponse } from '../models/pageable.model';
import { format } from 'date-fns';

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
    ): Observable<PageableResponse<Transaction>> {
        return this.http.get<PageableResponse<Transaction>>(
            `${this.API_URL}/transaction?startDate=${format(
                startDate,
                'yyyy-MM-dd'
            )}&endDate=${format(
                endDate,
                'yyyy-MM-dd'
            )}&page=${page}&size=${size}`
        );
    }

    public createTransaction(
        transaction: Transaction
    ): Observable<Transaction> {
        return this.http.post<Transaction>(
            `${this.API_URL}/transaction`,
            transaction
        );
    }

    public updateTransaction(
        transaction: Transaction
    ): Observable<Transaction> {
        return this.http.put<Transaction>(
            `${this.API_URL}/transaction`,
            transaction
        );
    }

    public getTransactionById(id: string): Observable<Transaction> {
        return this.http.get<Transaction>(`${this.API_URL}/transaction/${id}`);
    }
}
