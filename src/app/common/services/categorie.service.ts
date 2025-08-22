import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../models/categorie.model';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = environment.api_url;

    public getCategories(): Observable<Array<Category>> {
        return this.http.get<Array<Category>>(`${this.API_URL}/category`);
    }

    public createCategory(category: Category): Observable<Category> {
        return this.http.post<Category>(`${this.API_URL}/category`, category);
    }

    public getCategorieById(id: string): Observable<Category> {
        return this.http.get<Category>(`${this.API_URL}/category/${id}`);
    }

    public updateCategory(category: Category): Observable<Category> {
        return this.http.put<Category>(`${this.API_URL}/category`, category);
    }

    public deleteCategory(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/category/${id}`);
    }
}
