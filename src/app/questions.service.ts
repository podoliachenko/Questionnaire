import { Injectable } from '@angular/core';

export interface Question {
  id: string;
  timestamp: number;
  title: string;
  type: QuestionType;
  answerOptions?: string[];
}

export type QuestionType = 'single' | 'multiple' | 'open';

export interface Answer {
  timestamp: number;
  questionId: string;
  answer: string | boolean[];
}

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  private questions: Question[] = [];
  private answers: Answer[] = [];

  constructor() {
    const questionsFromLocalStorage = localStorage.getItem('questions');
    const answersFromLocalStorage = localStorage.getItem('answers');
    if (questionsFromLocalStorage) {
      this.questions = JSON.parse(questionsFromLocalStorage);
    }
    if (answersFromLocalStorage) {
      this.answers = JSON.parse(answersFromLocalStorage);
    }
  }

  getQuestions(): Question[] {
    return this.questions;
  }

  getAnswers(): Answer[] {
    return this.answers;
  }

  getQuestionById(id: string): Question | null {
    return this.questions.find((question: Question) => question.id === id) || null;
  }

  createQuestion(data: Question) {
    this.questions.push(data);
    this.save();
  }

  editQuestionById(id: string, data: Question) {
    Object.assign(this.getQuestionById(id), data);
    this.deleteAnswer(id);
    this.save();
  }

  deleteQuestionById(id: string) {
    const index = this.questions.findIndex((question: Question) => question.id === id);
    this.questions.splice(index, 1);
    this.deleteAnswer(id);
    this.save();
  }

  newId(): string {
    return Math.random().toString(36).slice(2);
  }

  addAnswer(answer: Answer) {
    this.answers.push(answer);
    this.save();
  }

  deleteAnswer(questionId: string) {
    const index = this.answers.findIndex((answer: Answer) => answer.questionId === questionId);
    this.answers.splice(index, 1);
    this.save();
  }

  private save() {
    localStorage.setItem('questions', JSON.stringify(this.questions));
    localStorage.setItem('answers', JSON.stringify(this.answers));
  }
}
