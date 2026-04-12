import { NgStyle } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { timer } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';
import { CharacterSide, ICharacter } from '../../core/interfaces/character.interface';
import { CharacterStoreService } from '../../services/character/character-store.service';

@Component({
  selector: 'app-battle',
  imports: [NgStyle],
  templateUrl: './battle.component.html',
  styleUrl: './battle.component.scss'
})
export class BattleComponent implements OnInit {

  lightCharacter = signal<ICharacter | null>(null);
  darkCharacter = signal<ICharacter | null>(null);
  lightCharacterHp = signal<number>(100);
  darkCharacterHp = signal<number>(100);
  minHurt = 10;
  maxHurt = 30;
  winner = signal<ICharacter | null>(null);
  private readonly msBetweenHits = 1000;

  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly characterStoreService = inject(CharacterStoreService);

  ngOnInit(): void {
    this.listenToQueryParams();
    console.log(this.characterStoreService.getCharacters());
  }

  listenToQueryParams(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      console.log(params);
      const light = this.characterStoreService.getCharacters().find((c) => c.id === params['light']);
      const dark = this.characterStoreService.getCharacters().find((c) => c.id === params['dark']);
      if (light && dark) {
        this.lightCharacter.set(light);
        this.darkCharacter.set(dark);
        this.startBattle();
      } else {
        console.error('Character not found');
      }
    });
  }

  startBattle(): void {

    timer(2000, this.msBetweenHits)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        takeWhile(() => this.lightCharacterHp() > 0 && this.darkCharacterHp() > 0),
        tap(() => {
          this.simulateCharacterAttack();
          if (this.lightCharacterHp() <= 0) {
            console.log('Dark side wins');
            this.winner.set(this.darkCharacter());
          } else if (this.darkCharacterHp() <= 0) {
            console.log('Light side wins');
            this.winner.set(this.lightCharacter());
          }
        })
      )
      .subscribe();
  }

  simulateCharacterAttack(): void {
    const characterHp = Math.random() < 0.5 ? this.lightCharacter()?.side : this.darkCharacter()?.side;
    if (!characterHp) return;
    const hurt = Math.floor(Math.random() * (this.maxHurt - this.minHurt + 1)) + this.minHurt;
    if (characterHp === CharacterSide.LIGHT) {
      this.lightCharacterHp.set(this.lightCharacterHp() - hurt < 0 ? 0 : this.lightCharacterHp() - hurt);
    } else {
      this.darkCharacterHp.set(this.darkCharacterHp() - hurt < 0 ? 0 : this.darkCharacterHp() - hurt);
    }
  }

}
