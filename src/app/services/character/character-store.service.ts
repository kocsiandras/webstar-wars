import { Injectable, signal } from "@angular/core";
import { ICharacter } from "../../core/interfaces/character.interface";


@Injectable({
    providedIn: 'root'
})
export class CharacterStoreService {
    private readonly characters = signal<ICharacter[]>([]);

    getCharacters(): ICharacter[] {
        return this.characters();
    }

    setCharacters(characters: ICharacter[]): void {
        this.characters.set(characters);
    }
}
