import { Pipe, PipeTransform, inject, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/** Newlines become line breaks; other HTML is passed through Angular's HTML sanitizer. */
@Pipe({
  name: 'characterNameHtml',
  standalone: true,
})
export class CharacterNameHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined, lowercase: boolean = false): string {
    if (value == null || value === '') {
      return '';
    }

    let normalized = value;
    if (lowercase) {
      normalized = value.toLowerCase();
    }
    normalized = normalized.replace(/\r\n|\r|\n/g, '<br>');
    return this.sanitizer.sanitize(SecurityContext.HTML, normalized) ?? '';
  }
}
