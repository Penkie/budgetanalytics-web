export interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: Date;
    categoryId: string;
    accountId: string;
}
