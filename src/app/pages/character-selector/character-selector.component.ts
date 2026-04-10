import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CharacterSideLabel, ICharacter } from '../../core/interfaces/character.interface';
import { CharacterNameHtmlPipe } from '../../core/pipes/character-name-html.pipe';
import { CharacterApiService } from '../../services/character/character-api.service';
import { handleHttpError } from '../../shared/utils/http-error.utils';

@Component({
  selector: 'app-character-selector',
  imports: [CharacterNameHtmlPipe],
  templateUrl: './character-selector.component.html',
  styleUrl: './character-selector.component.scss'
})
export class CharacterSelectorComponent implements OnInit {

  protected readonly CharacterSideLabel = CharacterSideLabel;
  private readonly characterApiService = inject(CharacterApiService);
  private readonly destroyRef = inject(DestroyRef);

  characters = signal<ICharacter[]>([]);
  activeCharacter = signal<ICharacter | null>(null);
  characterIndex = signal<number>(0);

  ngOnInit(): void {
    this.getCharacters();
  }

  getCharacters(): void {
    this.characterApiService.getCharacters().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (characters: ICharacter[]) => {
        console.log('characters', characters);
        this.characters.set(characters.sort((a: ICharacter, b: ICharacter) => a.name.localeCompare(b.name)));
        this.activeCharacter.set(characters[this.characterIndex()]);
      },
      error: (error: unknown) => {
        handleHttpError(error);
      }
    });
  }

  previousCharacter(): void {
    if (this.characterIndex() <= 0) return;
    this.characterIndex.set(this.characterIndex() - 1);
    this.activeCharacter.set(this.characters()[this.characterIndex()]);
  }

  nextCharacter(): void {
    if (this.characterIndex() >= this.characters().length - 1) return;
    this.characterIndex.set(this.characterIndex() + 1);
    this.activeCharacter.set(this.characters()[this.characterIndex()]);
  }
}
