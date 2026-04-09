import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-webstar-button',
  imports: [NgClass],
  templateUrl: './webstar-button.component.html',
  styleUrl: './webstar-button.component.scss'
})
export class WebstarButtonComponent {

  disabled = input<boolean>(false);
  text = input<string>('');
  buttonStyleType = input<string | string[] | { [key: string]: boolean }>('');

  btnClick = output<void>();
}
