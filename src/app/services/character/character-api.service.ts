import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { ICharacter, ISimulationRequest, ISimulationResponse } from "../../core/interfaces/character.interface";
import { environment } from "../../../environments/environment";
import { CharacterStoreService } from "./character-store.service";

@Injectable({
    providedIn: 'root'
})
export class CharacterApiService {

    private readonly http = inject(HttpClient);
    private readonly characterStoreService = inject(CharacterStoreService);
    readonly baseUrl = environment.baseUrl;

    getCharacters(): Observable<ICharacter[]> {
        return this.http.get<ICharacter[]>(`${this.baseUrl}characters/`).pipe(
            tap((characters: ICharacter[]) => {
                this.characterStoreService.setCharacters(characters);
            })
        );
    }

    simulateBattle(characters: ISimulationRequest): Observable<ISimulationResponse> {
        return this.http.post<ISimulationResponse>(`${this.baseUrl}simulate/`, characters);
    }

}