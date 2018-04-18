import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

import { DateOnly } from '../models/dateonly';

@Pipe({name: 'dateonly'})
export class DateOnlyPipe extends DatePipe implements PipeTransform  {
  transform(date: any, format = 'mediumDate', timezone?: string, locale?: string): string|null {
    return super.transform(date.toDate(), format, timezone, locale);
  }
}
