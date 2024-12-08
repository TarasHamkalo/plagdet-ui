import {Component, Input} from '@angular/core';
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-submissions-list',
  imports: [
    MatTooltip
  ],
  templateUrl: './submissions-list.component.html',
  styleUrl: './submissions-list.component.css'
})
export class SubmissionsList {

  @Input() public numberOfSubmissions: number = 5;

  ngOnInit(): void {
    console.log(`recieved ${this.numberOfSubmissions}`);
  }


}
