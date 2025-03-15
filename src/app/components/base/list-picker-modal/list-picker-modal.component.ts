import {Component, inject} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatActionList, MatList, MatListItem} from "@angular/material/list";
import {NgForOf} from "@angular/common";

@Component({
  selector: "app-list-picker-modal",
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatButton,
    MatDialogClose,
    MatDialogActions,
    MatList,
    MatListItem,
    NgForOf,
    MatActionList
  ],
  templateUrl: "./list-picker-modal.component.html",
  styleUrl: "./list-picker-modal.component.css"
})
export class ListPickerModalComponent {

  protected readonly dialogRef = inject(MatDialogRef<ListPickerModalComponent>);

  protected readonly data = inject(MAT_DIALOG_DATA);

  protected readonly title = this.data.title;

  protected onSubmit(value: string) {
    this.dialogRef.close(value);
  }

}
