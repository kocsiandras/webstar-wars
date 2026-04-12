import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { register } from 'swiper/element/bundle';
import type { Swiper } from 'swiper/types';
import { CharacterSide, CharacterSideLabel, ICharacter, ISimulationResponse } from '../../core/interfaces/character.interface';
import { CharacterNameHtmlPipe } from '../../shared/pipes/character-name-html.pipe';
import { CharacterApiService } from '../../services/character/character-api.service';
import { WebstarButtonComponent } from '../../shared/components/webstar-button/webstar-button.component';
import { handleHttpError } from '../../shared/utils/http-error.utils';
import { Router } from '@angular/router';

register();

type SwiperContainerEl = HTMLElement & { swiper?: Swiper };

@Component({
  selector: 'app-character-selector',
  imports: [CharacterNameHtmlPipe, WebstarButtonComponent],
  templateUrl: './character-selector.component.html',
  styleUrl: './character-selector.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CharacterSelectorComponent implements OnInit {

  protected readonly CharacterSideLabel = CharacterSideLabel;
  private readonly characterApiService = inject(CharacterApiService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  characters = signal<ICharacter[]>([]);
  activeCharacter = signal<ICharacter | null>(null);
  characterIndex = signal<number>(0);
  selectedCharacters = signal<ICharacter[]>([]);
  errorMessage = signal<string | null>(null);

  readonly isActiveCharacterSelected = computed(() => {
    const active = this.activeCharacter();
    if (!active) return false;
    return this.selectedCharacters().some((c) => c.id === active.id);
  });

  private readonly swiperRef = viewChild<ElementRef<SwiperContainerEl>>('swiperRef');

  ngOnInit(): void {
    this.getCharacters();
  }

  getCharacters(): void {
    this.characterApiService.getCharacters().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (characters: ICharacter[]) => {
        const sorted = [...characters].sort((a, b) => a.name.localeCompare(b.name));
        this.characters.set(sorted);
        this.activeCharacter.set(sorted[this.characterIndex()]);
        setTimeout(() => this.syncSwiperToIndex(), 0);
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
    this.syncSwiperToIndex();
  }

  nextCharacter(): void {
    if (this.characterIndex() >= this.characters().length - 1) return;
    this.characterIndex.set(this.characterIndex() + 1);
    this.activeCharacter.set(this.characters()[this.characterIndex()]);
    this.syncSwiperToIndex();
  }

  paginateCharacter(index: number): void {
    const list = this.characters();
    if (index < 0 || index >= list.length) return;
    this.characterIndex.set(index);
    this.activeCharacter.set(list[index]);
    this.syncSwiperToIndex();
  }

  onSwiperSlideChange(): void {
    const swiper = this.swiperRef()?.nativeElement?.swiper;
    if (!swiper) return;
    const idx = swiper.activeIndex;
    const list = this.characters();
    if (idx < 0 || idx >= list.length || idx === this.characterIndex()) return;
    this.characterIndex.set(idx);
    this.activeCharacter.set(list[idx]);
  }

  syncSwiperToIndex(): void {
    const swiper = this.swiperRef()?.nativeElement.swiper;
    if (!swiper) return;
    swiper.update();
    if (swiper.activeIndex !== this.characterIndex()) {
      swiper.slideTo(this.characterIndex(), 0);
    }
  }

  selectCharacter(): void {
    const active = this.activeCharacter();
    if (!active) return;

    const alreadySelected = this.selectedCharacters().find((c) => c.id === active.id);

    if (alreadySelected) {
      this.selectedCharacters.set(this.selectedCharacters().filter((c) => c.id !== active.id));
      return;
    }
    if (this.selectedCharacters().length < 1) {
      this.selectedCharacters.set([...this.selectedCharacters(), active]);
      return;
    }

    if (this.selectedCharacters().length == 1) {
      const firstSelectedSide = this.selectedCharacters()[0].side;
      const otherSide = firstSelectedSide !== this.activeCharacter()!.side;
      if (otherSide) {
        this.selectedCharacters.set([...this.selectedCharacters(), active]);
      }
    }
  }

  startBattle(): void {
    const lighSide = this.selectedCharacters().find((c) => c.side === CharacterSide.LIGHT);
    const darkSide = this.selectedCharacters().find((c) => c.side === CharacterSide.DARK);
    if (!lighSide || !darkSide) return;
    this.characterApiService.simulateBattle({
      light: lighSide.id,
      dark: darkSide.id
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response: ISimulationResponse) => {
        this.selectedCharacters.set([]);
        this.errorMessage.set(null);
        this.router.navigate(['/battle'], { queryParams: {
            light: lighSide.id,
            dark: darkSide.id
          }
        });
      },
      error: (error: unknown) => {
        const serverMessage = handleHttpError(error, {
          returnServerMessageFor500: true,
        });
        if (serverMessage !== undefined) {
          this.errorMessage.set(serverMessage);
        }
      }
    });
    
  }
}
