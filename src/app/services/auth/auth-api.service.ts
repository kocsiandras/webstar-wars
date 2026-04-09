import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ILoginForm, ILoginResponse } from "../../core/interfaces/auth.interface";

@Injectable({
    providedIn: 'root'
})
export class AuthApiService {

    readonly baseUrl = environment.baseUrl;

    private readonly http = inject(HttpClient);

    login(data: ILoginForm): Observable<ILoginResponse> {
        return this.http.post<ILoginResponse>(this.baseUrl + 'frontend-felveteli/v2/authentication/', data);
    }
}