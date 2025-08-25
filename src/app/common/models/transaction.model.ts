import { Account } from './account.model';
import { Category } from './categorie.model';

export interface Transaction {
    id?: string;
    description: string;
    amount: number;
    date: string;
    categoryId: string;
    accountId: string;

    category?: Category;
    account?: Account;
}
