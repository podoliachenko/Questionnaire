import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionsService, QuestionType } from '../../questions.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent implements OnInit, OnDestroy {

  submitted = false;

  form: FormGroup = new FormGroup({
    id: new FormControl(this.service.newId()),
    timestamp: new FormControl(),
    title: new FormControl('', [Validators.required]),
    type: new FormControl(null, [Validators.required]),
  });

  unsubscribe$: Subject<void> = new Subject<void>();
  isEdit: boolean = false;

  constructor(private service: QuestionsService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.form.get('type')?.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((type: QuestionType | null) => {
        this.questionTypeChanged(type);
      });
    this.route.params.pipe(takeUntil(this.unsubscribe$))
      .subscribe((params: { id?: string }) => {
        if (params.id) {
          this.isEdit = true;
          const question = this.service.getQuestionById(params.id);
          if (question) {
            this.form.setValue({
              id: question.id,
              type: question.type,
              title: question.title,
              timestamp: question.timestamp
            });
            for (let i = 0; i < (question.answerOptions?.length || 1) - 1; i++) {
              this.getAnswersFormArray().push(new FormControl('', [Validators.required]));
            }
            this.form.get('answerOptions')?.setValue(question.answerOptions);
          }
        } else {
          this.isEdit = false;
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addQuestion() {
    (this.form.get('answerOptions') as FormArray)
      .push(new FormControl('', [Validators.required]));
  }

  getAnswersFormArray(): FormArray {
    return this.form.get('answerOptions') as FormArray;
  }

  removeAnswer(i: number) {
    this.getAnswersFormArray().removeAt(i);
  }

  submit() {
    this.submitted = true;
    if (this.form.valid) {
      this.form.get('timestamp')?.setValue(Date.now());
      if (this.isEdit) {
        this.service.editQuestionById(this.form.get('id')?.value, this.form.value);
      } else {
        this.service.createQuestion(this.form.value);
      }
      this.router.navigate(['/question-management']);
    }
  }

  private questionTypeChanged(type: QuestionType | null) {
    if (this.form.get('answerOptions')) {
      this.form.removeControl('answerOptions');
    }
    switch (type) {
      case 'single':
      case 'multiple':
        this.form.addControl('answerOptions', new FormArray([new FormControl('', [Validators.required])], [Validators.minLength(2)]));
        break;
      case 'open':
        break;
      default:
        break;
    }
  }
}
