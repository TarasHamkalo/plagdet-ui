import {Component, Input, OnInit} from '@angular/core';
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-submissions-list',
  imports: [
    MatTooltip
  ],
  templateUrl: './submissions-list.component.html',
  styleUrl: './submissions-list.component.css'
})
export class SubmissionsListComponent implements OnInit {

  @Input() public numberOfSubmissions = 5;

  ngOnInit(): void {
    console.log(`recieved ${this.numberOfSubmissions}`);
  }


}
