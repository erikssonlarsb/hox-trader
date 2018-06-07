import { Injectable, PipeTransform, Pipe } from '@angular/core';

import { OrderDepth } from '../models/index';

@Pipe({name: 'orderDepth'})
@Injectable()
export class OrderDepthPipe implements PipeTransform  {
  transform(orderDepths: Array<OrderDepth>, name: string): Array<OrderDepth> {
    if(!orderDepths) {
      return null;
    } else if (!name) {
      return orderDepths;
    } else {
      return orderDepths.filter(
        orderDepth => orderDepth.instrument.name.toLowerCase().includes(name.toLowerCase())
      );
    }
  }
}
