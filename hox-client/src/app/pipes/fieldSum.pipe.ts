import { Injectable, PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'fieldSum', pure: false})
@Injectable()
export class FieldSumPipe implements PipeTransform  {
  transform(objects: Array<any>, field: string, filter: any, type: string = 'Include', positiveOnly: boolean = false): number|null {
    if(!objects) {
      return null;
    } else {
      try {
        objects = objects.filter(object => {
          if(type == 'Include') {
            return evaluate(object, filter);
          } else {
            return !evaluate(object, filter);
          }
        });
        return objects.reduce((sum, object) => sum + (positiveOnly ? object[field] > 0 ? object[field] : 0 : object[field]), 0);
      } catch (e) {
        return null;
      }
    }
  }
}

function evaluate(object: any, filter: any): boolean {
  if (filter == null) {
    return true;
  }
  if(filter !== Object(filter)) {
    // Is end-node. Check filter condition.
    if (object != filter) {
      return false;
    }
  } else {
    // Has sub-nodes. Recurse.
    for(let path in filter) {
      if(!evaluate(object[path], filter[path])) {
        return false;
      }
    }
  }
  return true;  // All filters passed. Include object.
}
