import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

import { DateOnly } from '../models/dateonly';

@Pipe({name: 'dateonly'})
export class DateOnlyPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) { }

  transform(date: DateOnly, format: string = 'mediumDate'): any {
    if (!date) return date;
    return this.datePipe.transform(date.toDate(), format);
  }
}
