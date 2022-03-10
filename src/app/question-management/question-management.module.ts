import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionManagementRoutingModule } from './question-management-routing.module';
import { QuestionManagementComponent } from './question-management/question-management.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [QuestionManagementComponent, EditQuestionComponent],
  imports: [
    CommonModule,
    QuestionManagementRoutingModule,
    ReactiveFormsModule
  ]
})
export class QuestionManagementModule { }
