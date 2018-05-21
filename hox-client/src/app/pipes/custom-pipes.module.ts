import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PricePipe } from './price.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PricePipe
  ],
  exports: [
    PricePipe
  ]
})

export class CustomPipesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CustomPipesModule,
      providers: [PricePipe]
    };
  }
}
