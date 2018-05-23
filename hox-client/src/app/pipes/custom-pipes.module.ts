import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PricePipe } from './price.pipe';
import { EnumPipe } from './enum.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PricePipe,
    EnumPipe
  ],
  exports: [
    PricePipe,
    EnumPipe
  ]
})

export class CustomPipesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CustomPipesModule,
      providers: [PricePipe, EnumPipe]
    };
  }
}
