import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeaheadModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    TypeaheadModule.forRoot(),
  ],
  exports: [TypeaheadModule]
})
export class BootstrapModule {}
