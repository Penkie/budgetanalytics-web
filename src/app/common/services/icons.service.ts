import { HttpClient, HttpClientModule } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IconsService {
    private readonly http = inject(HttpClient);

    public getIconsList(): Observable<Array<string>> {
        return this.http.get<Array<string>>(`/category_icons/list.json`);
    }

    public getColorList(): Observable<Array<string>> {
        return this.http.get<Array<string>>(`/colors-list.json`);
    }
}
