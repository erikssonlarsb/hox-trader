import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PricePipe } from './price.pipe';
import { AveragePricePipe } from './averagePrice.pipe';
import { EnumPipe } from './enum.pipe';
import { OrderDepthPipe } from './orderDepth.pipe';
import { InstrumentPipe } from './instrument.pipe';
import { FieldSumPipe } from './fieldSum.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PricePipe,
    AveragePricePipe,
    EnumPipe,
    OrderDepthPipe,
    InstrumentPipe,
    FieldSumPipe
  ],
  exports: [
    PricePipe,
    AveragePricePipe,
    EnumPipe,
    OrderDepthPipe,
    InstrumentPipe,
    FieldSumPipe
  ]
})

export class CustomPipesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CustomPipesModule,
      providers: [
        PricePipe,
        AveragePricePipe,
        EnumPipe,
        OrderDepthPipe,
        InstrumentPipe,
        FieldSumPipe
      ]
    };
  }
}
