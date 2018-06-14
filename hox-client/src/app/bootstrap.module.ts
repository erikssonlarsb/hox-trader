import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeaheadModule, ModalModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    TypeaheadModule.forRoot(),
    ModalModule.forRoot()
  ],
  exports: [TypeaheadModule]
})
export class BootstrapModule {}
