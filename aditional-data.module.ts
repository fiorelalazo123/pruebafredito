import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AditionalDataModalComponent } from './aditional-data.component';
import { AditionalDataModalContainer } from './aditional-data.container';
import { ReactiveFormsModule } from '@angular/forms';
import { DirectiveModule } from '@commons/directives';

@NgModule({
  imports: [
    ReactiveFormsModule,
    DirectiveModule
  ],
  declarations: [
    AditionalDataModalComponent,
    AditionalDataModalContainer
  ],
  exports: [
    AditionalDataModalComponent,
    AditionalDataModalContainer
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AditionalDataModalModule { }
