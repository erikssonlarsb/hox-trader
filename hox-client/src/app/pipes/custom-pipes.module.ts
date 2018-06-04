import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PricePipe } from './price.pipe';
import { AveragePricePipe } from './averagePrice.pipe';
import { EnumPipe } from './enum.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PricePipe,
    AveragePricePipe,
    EnumPipe
  ],
  exports: [
    PricePipe,
    AveragePricePipe,
    EnumPipe
  ]
})

export class CustomPipesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CustomPipesModule,
      providers: [PricePipe, AveragePricePipe, EnumPipe]
    };
  }
}
