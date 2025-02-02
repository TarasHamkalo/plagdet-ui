import {Directive, HostBinding, Input, OnInit} from "@angular/core";
import {Submission} from "../model/submission";
import {Metadata} from "../model/metadata";

@Directive({
  selector: "[appMetadataEqualityHighlight]"
})
export class MetadataEqualityHighlightDirective implements OnInit {

  @Input({required: true}) public first!: Submission;

  @Input({required: true}) public second!: Submission;

  @Input({required: true}) public metadataField!: string;

  @HostBinding("class.meta-equality") private metaEquality = false;

  public ngOnInit() {
    const firstValue = this.getFieldValue(this.first.metadata, this.metadataField);
    const secondValue = this.getFieldValue(this.second.metadata, this.metadataField);
    if (firstValue && secondValue) {
      this.metaEquality = firstValue === secondValue;
      return;
    }

    this.metaEquality = false;
  }

  private getFieldValue(metadata: Metadata, fieldName: string): string | number {
    // @ts-expect-error the field should be correct :)
    return metadata[fieldName];
  }
}