import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionManagementComponent } from './question-management/question-management.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';

const routes: Routes = [{
  path: '', component: QuestionManagementComponent, pathMatch: 'full'
}, {
  path: 'create-question', component: EditQuestionComponent
}, {
  path: 'edit-question/:id', component: EditQuestionComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionManagementRoutingModule {
}
