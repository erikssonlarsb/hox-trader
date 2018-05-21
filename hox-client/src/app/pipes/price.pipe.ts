import { Injectable, PipeTransform, Pipe } from '@angular/core';

import { Price } from '../models/index';

@Pipe({name: 'price'})
@Injectable()
export class PricePipe implements PipeTransform  {
  transform(prices: Array<Price>, type: string, index: number = -1): Price|null {
    prices = prices.filter(price => price.type == type);
    if(index < 0) {
      index = prices.length + index;
    }
    try {
      return prices[index];
    } catch (e) {
      return null;
    }
  }
}
