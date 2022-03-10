import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionsListRoutingModule } from './questions-list-routing.module';
import { QuestionsListComponent } from './questions-list.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [QuestionsListComponent],
  imports: [
    CommonModule,
    QuestionsListRoutingModule,
    ReactiveFormsModule
  ]
})
export class QuestionsListModule {
}
