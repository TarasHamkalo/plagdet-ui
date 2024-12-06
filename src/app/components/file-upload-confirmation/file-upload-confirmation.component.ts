import {Component, inject, Input} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {DatePipe, DecimalPipe} from "@angular/common";
import {MatList, MatListItem, MatListItemIcon, MatListItemTitle} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-file-upload-confirmation',
  imports: [
    MatDialogTitle,
    MatButton,
    MatDialogContent,
    MatDialogActions,
    DatePipe,
    DecimalPipe,
    MatDialogClose,
    MatList,
    MatListItem,
    MatListItemIcon,
    MatIcon,
    MatListItemTitle
  ],
  templateUrl: './file-upload-confirmation.component.html',
  styleUrl: './file-upload-confirmation.component.css'
})
export class FileUploadConfirmationComponent {

  @Input() public title = "Informácie o súbore";

  @Input() public cancelText = "Odstraniť";

  @Input() public confirmText = "Potvrdiť";

  public dialogData: any = inject(MAT_DIALOG_DATA);
}
