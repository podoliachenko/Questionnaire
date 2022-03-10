import { Component, OnInit } from '@angular/core';
import { Answer, Question, QuestionsService } from '../questions.service';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit {

  notAnswered: Question[] = [];
  answered: Question[] = [];
  answersFormArray: FormArray = new FormArray([]);
  private questions: Question[] = [];
  private answers: Answer[] = [];

  constructor(private service: QuestionsService) {
  }

  ngOnInit(): void {
    this.reload();
  }

  getFormGroupById(id: string): FormGroup | null {
    return (this.answersFormArray.controls
      .find((control: AbstractControl) => (control as FormGroup).get('id')?.value === id)) as FormGroup || null;
  }


  reply(id: string, form: FormGroup) {
    this.service.addAnswer({ questionId: id, answer: form.get('answer')?.value, timestamp: Date.now() });
    this.reload();
  }

  cancel(id: string) {
    this.service.deleteAnswer(id);
    this.reload();
  }

  private reload() {
    this.questions = this.service.getQuestions().sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
    this.answers = this.service.getAnswers().sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
    this.notAnswered = this.questions.filter((question: Question) => !this.answers.map((answer) => answer.questionId).includes(question.id));
    this.answered = this.questions.filter((question: Question) => this.answers.map((answer) => answer.questionId).includes(question.id))
      .sort((a, b) =>
        ((this.answers.find(answer => answer.questionId === a.id)?.timestamp || 0) < (this.answers.find(answer => answer.questionId === b.id)?.timestamp || 0)) ? 1 : -1);

    for (const question of this.questions) {
      if (question.type === 'single') {
        this.answersFormArray.push(new FormGroup({
          id: new FormControl(question.id),
          answer: new FormControl(null, [Validators.required])
        }));
      } else if (question.type === 'multiple') {
        const formGroup = new FormGroup({
          id: new FormControl(question.id),
          answer: new FormArray([], [allOptionsFalse()])
        });
        for (const answerOption of question.answerOptions || []) {
          (formGroup.get('answer') as FormArray).push(new FormControl(false));
        }
        this.answersFormArray.push(formGroup);
      } else if (question.type === 'open') {
        this.answersFormArray.push(new FormGroup({
          id: new FormControl(question.id),
          answer: new FormControl(null, [Validators.required, Validators.maxLength(255)])
        }));
      }
      this.answersFormArray.enable();
      for (const answer of this.answers) {
        const answeredFormGroup = this.answersFormArray.controls.find((formGroup: AbstractControl) => formGroup.get('id')?.value === answer.questionId);
        if (answeredFormGroup) {
          answeredFormGroup?.get('answer')?.setValue(answer.answer);
          answeredFormGroup.disable();
        }
      }
    }
  }
}

export function allOptionsFalse(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control instanceof FormArray) {
      const trueCount = control.controls.filter((formControl) => formControl.value).length;
      if (trueCount === 0) {
        return { allOptionsFalse: false };
      }
    }

    return null;
  };
}
