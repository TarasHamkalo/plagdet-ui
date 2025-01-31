import {MatPaginatorIntl} from "@angular/material/paginator";
import {Injectable} from "@angular/core";

@Injectable()
export class SlovakPaginatorService extends MatPaginatorIntl {

  constructor() {
    super();
    this.getAndInitTranslations();
  }

  public getAndInitTranslations() {
    this.itemsPerPageLabel = "Položky na stránku:";
    this.nextPageLabel = "Ďalšia stránka";
    this.previousPageLabel = "Predchádzajúca stránka";
    this.firstPageLabel = "Prvá stránka";
    this.lastPageLabel = "Posledná stránka";
    this.changes.next();
  }

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} / ${length}`;
  };

}