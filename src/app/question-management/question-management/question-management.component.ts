import { Component, OnInit } from '@angular/core';
import { Question, QuestionsService } from '../../questions.service';

@Component({
  selector: 'app-question-management',
  templateUrl: './question-management.component.html',
  styleUrls: ['./question-management.component.scss']
})
export class QuestionManagementComponent implements OnInit {

  questions: Question[] = [];

  constructor(private service: QuestionsService) {
  }

  ngOnInit(): void {
    this.questions = this.service.getQuestions().sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
  }

  deleteQuestion(id: string) {
    this.service.deleteQuestionById(id);
  }
}
