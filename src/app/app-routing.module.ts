import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'questions-list' },
  {
    path: 'question-management',
    loadChildren: () => import('./question-management/question-management.module').then((m) => m.QuestionManagementModule)
  },
  {
    path: 'questions-list',
    loadChildren: () => import('./questions-list/questions-list.module').then((m) => m.QuestionsListModule)
  },
];

@NgModule({

  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
