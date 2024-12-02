import {Component, Input} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-card-with-input',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    FormsModule
  ],
  templateUrl: './card-with-input.component.html',
  styleUrl: './card-with-input.component.css'
})
export class CardWithInput {

  public heroes: string[] = ['Windstorm', 'Bombasto', 'Magneta', 'Tornado'];

  // can not be assigned from html
  // public title: string = 'Little tour';
  @Input() public title: string = 'Little tour';
  // constructor(public title: string) {
  // }

  addHero(hero: string): void {
    if (hero) {
      this.heroes.push(hero);
    }
  }

}