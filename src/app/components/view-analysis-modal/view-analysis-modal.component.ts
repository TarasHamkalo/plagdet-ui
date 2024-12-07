import {Component, Input, OnDestroy, OnInit, signal} from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatProgressBar, ProgressBarMode} from "@angular/material/progress-bar";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-view-analysis-modal',
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatProgressBar,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  templateUrl: './view-analysis-modal.component.html',
  styleUrl: './view-analysis-modal.component.css'
})
export class ViewAnalysisModalComponent implements OnInit, OnDestroy {

  @Input() public title = "Analýza súboru odovovzdaní";

  @Input() public cancelText = "Pridajte ďalšiu";

  @Input() public confirmText = "Načítať analýzu";

  public indeterminateProgressState = signal('Extrakcia súborov');

  public mode = signal<ProgressBarMode>('indeterminate');

  public progressValue = signal(0);

  private progressInterval: any;

  ngOnInit() {
    setTimeout(() => {
      this.mode.set('determinate');
      this.startProgressAnimation();
    }, 1000);
  }

  private startProgressAnimation() {
    this.progressInterval = setInterval(() => {
      const newValue = this.progressValue() + 5;
      this.progressValue.set(newValue);

      if (newValue >= 100) {
        clearInterval(this.progressInterval);
        this.onComplete();
      }
    }, 200);
  }

  ngOnDestroy() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval); // Ensure interval is cleared
    }
  }

  private onComplete() {
    this.indeterminateProgressState.set('Analýza dokončená');
  }
}
