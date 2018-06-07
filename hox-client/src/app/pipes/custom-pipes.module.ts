import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PricePipe } from './price.pipe';
import { AveragePricePipe } from './averagePrice.pipe';
import { EnumPipe } from './enum.pipe';
import { OrderDepthPipe } from './orderDepth.pipe'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PricePipe,
    AveragePricePipe,
    EnumPipe,
    OrderDepthPipe
  ],
  exports: [
    PricePipe,
    AveragePricePipe,
    EnumPipe,
    OrderDepthPipe
  ]
})

export class CustomPipesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CustomPipesModule,
      providers: [PricePipe, AveragePricePipe, EnumPipe, OrderDepthPipe]
    };
  }
}
