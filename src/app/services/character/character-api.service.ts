import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ICharacter } from "../../core/interfaces/character.interface";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class CharacterApiService {

    private readonly http = inject(HttpClient);
    readonly baseUrl = environment.baseUrl;

    getCharacters(): Observable<ICharacter[]> {
        return this.http.get<ICharacter[]>(`${this.baseUrl}characters/`);
    }

}