import { Injectable, PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'fieldSum', pure: false})
@Injectable()
export class FieldSumPipe implements PipeTransform  {
  transform(objects: Array<any>, field: string, filters: any, onlyPositive: false): number|null {
    if(!objects) {
      return null;
    } else {
      try {
        objects = objects.filter(object => {
          for (let field in filters) {
            if(object[field] != filters[field]) {
              return false;
            }
          }
          return true;  // All filters passed. Include object.
        });
        return objects.reduce((sum, object) => sum + (onlyPositive ? object[field] > 0 ? object[field] : 0 : object[field]), 0);
      } catch (e) {
        return null;
      }
    }
  }
}
