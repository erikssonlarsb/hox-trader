import { Injectable, PipeTransform, Pipe } from '@angular/core';

import { Price } from '../models/index';

@Pipe({name: 'averagePrice'})
@Injectable()
export class AveragePricePipe implements PipeTransform  {
  transform(prices: Array<Price>, type: string): number|null {
    if(!prices) {
      return null;
    } else {
      prices = prices.filter(price => price.type == type);
      let sum = prices.reduce((sum, price) => sum + price.value, 0);
      try {
        return sum / prices.length;
      } catch (e) {
        return null;
      }
    }
  }
}
