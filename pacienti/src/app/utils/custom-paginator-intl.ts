import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable()
export class CustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  itemsPerPageLabel = 'Elemente pe pagină:';
  nextPageLabel = 'Pagina următoare';
  previousPageLabel = 'Pagina anterioară';
  firstPageLabel = 'Prima pagină';
  lastPageLabel = 'Ultima pagină';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
      return 'Pagina 1 din 1';
    }
    const totalPages = Math.ceil(length / pageSize);
    return `Pagina ${page + 1} din ${totalPages}`;
  }
}