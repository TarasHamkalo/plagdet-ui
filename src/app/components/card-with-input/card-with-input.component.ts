import {Component, Input, signal} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-card-with-input',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatButton
  ],
  templateUrl: './card-with-input.component.html',
  styleUrl: './card-with-input.component.css'
})
export class CardWithInput {

  public heros: string[] = ['Windstorm', 'Bombasto', 'Magneta', 'Tornado'];

  // can not be assigned from html
  // public title: string = 'Little tour';
  @Input() public title: string = 'Little tour';
  // constructor(public title: string) {
  // }

  addHero(hero: string): void {
    this.heros.push(hero);
  }

}
