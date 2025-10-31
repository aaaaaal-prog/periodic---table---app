
export interface ElementData {
  name: string;
  symbol: string;
  atomicNumber: number;
  atomicMass: string;
  category: string;
  electronConfiguration: string;
  group: number;
  period: number;
  state: 'Gas' | 'Liquid' | 'Solid';
}

export enum AppView {
  TABLE = 'TABLE',
  QUIZ = 'QUIZ',
}

export interface QuizQuestion {
  element: ElementData;
  question: string;
  options: string[];
  correctAnswer: string;
  type: 'symbol' | 'atomicNumber' | 'name' | 'state' | 'electronConfiguration';
  electronConfiguration?: string;
}
