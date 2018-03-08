import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeaheadModule, BsDatepickerModule  } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    TypeaheadModule.forRoot(),
    BsDatepickerModule.forRoot()
  ],
  exports: [TypeaheadModule, BsDatepickerModule]
})
export class BootstrapModule {}
