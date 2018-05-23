import { Injectable, PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'enum'
})
export class EnumPipe implements PipeTransform {
  transform(data: Object) {
    return Object.keys(data);
  }
}
