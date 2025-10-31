import React, { useState, useEffect, useCallback } from 'react';
import { ElementData, QuizQuestion } from '../types';
import { formatConfigShells } from './ElectronConfigDisplay';

interface QuizViewProps {
  elements: ElementData[];
}

const generateQuestion = (elements: ElementData[]): QuizQuestion => {
  const element = elements[Math.floor(Math.random() * elements.length)];
  const questionTypes = ['symbol', 'atomicNumber', 'name', 'state', 'electronConfiguration'] as const;
  const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
  
  let question = '';
  let correctAnswer = '';
  let electronConfiguration: string | undefined;
  const options: string[] = [];

  switch (questionType) {
    case 'symbol':
      question = `What is the symbol for ${element.name}?`;
      correctAnswer = element.symbol;
      break;
    case 'atomicNumber':
      question = `What is the atomic number of ${element.name}?`;
      correctAnswer = element.atomicNumber.toString();
      break;
    case 'name':
      question = `Which element has the symbol ${element.symbol}?`;
      correctAnswer = element.name;
      break;
    case 'state': {
      const stateToAsk = (['Gas', 'Liquid', 'Solid'] as const)[Math.floor(Math.random() * 3)];
      const correctElements = elements.filter(el => el.state === stateToAsk);
      const correctElement = correctElements[Math.floor(Math.random() * correctElements.length)];
      
      question = `Which of these elements is a ${stateToAsk} at 20°C?`;
      correctAnswer = correctElement.name;
      options.push(correctAnswer);

      const incorrectElements = elements.filter(el => el.state !== stateToAsk);
      while (options.length < 4) {
        const randomIncorrect = incorrectElements[Math.floor(Math.random() * incorrectElements.length)];
        if (!options.includes(randomIncorrect.name)) {
          options.push(randomIncorrect.name);
        }
      }
      break;
    }
    case 'electronConfiguration': {
      question = `Which element has this electron configuration?`;
      electronConfiguration = element.electronConfiguration;
      correctAnswer = element.name;
      options.push(correctAnswer);
       while (options.length < 4) {
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        if (randomElement.name !== correctAnswer && !options.includes(randomElement.name)) {
          options.push(randomElement.name);
        }
      }
      break;
    }
  }

  // Fallback for types that build options differently
  if (options.length === 0) {
    options.push(correctAnswer);
    while (options.length < 4) {
      const randomElement = elements[Math.floor(Math.random() * elements.length)];
      let randomAnswer = '';
      switch (questionType) {
        case 'symbol': randomAnswer = randomElement.symbol; break;
        case 'atomicNumber': randomAnswer = randomElement.atomicNumber.toString(); break;
        case 'name': randomAnswer = randomElement.name; break;
      }
      if (randomAnswer && !options.includes(randomAnswer)) {
        options.push(randomAnswer);
      }
    }
  }

  return {
    element,
    question,
    options: options.sort(() => Math.random() - 0.5),
    correctAnswer,
    type: questionType,
    electronConfiguration,
  };
};

const QuizView: React.FC<QuizViewProps> = ({ elements }) => {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isQuizOver, setIsQuizOver] = useState(false);

  const totalQuestions = 10;

  const nextQuestion = useCallback(() => {
    if (questionsAnswered >= totalQuestions) {
      setIsQuizOver(true);
      return;
    }
    setSelectedAnswer(null);
    setIsCorrect(null);
    setQuestion(generateQuestion(elements));
  }, [elements, questionsAnswered]);
  
  useEffect(() => {
    nextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; // Prevent multiple answers

    setSelectedAnswer(answer);
    
    if (answer === question?.correctAnswer) {
      setScore(prev => prev + 1);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    setTimeout(() => {
      setQuestionsAnswered(prev => prev + 1);
      nextQuestion();
    }, 1500);
  };
  
  const restartQuiz = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setIsQuizOver(false);
    nextQuestion();
  };

  if (isQuizOver) {
    return (
      <div className="max-w-2xl mx-auto text-center p-8 bg-custom-lightblue dark:bg-custom-blue/80 rounded-lg shadow-lg animate-fade-in">
        <h2 className="text-4xl font-orbitron font-bold mb-4">Quiz Complete!</h2>
        <p className="text-2xl mb-6">Your final score is:</p>
        <p className="text-6xl font-bold text-glow-cyan mb-8">{score} / {totalQuestions}</p>
        <button
          onClick={restartQuiz}
          className="px-8 py-3 bg-glow-magenta text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          Play Again
        </button>
      </div>
    );
  }
  
  if (!question) {
    return <div>Loading quiz...</div>;
  }

  return (
    <div className={`max-w-2xl mx-auto p-4 sm:p-8 bg-custom-lightblue dark:bg-custom-blue/80 rounded-lg shadow-lg animate-fade-in`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-orbitron font-bold">Quiz Mode</h2>
        <div className="text-lg font-bold">Score: {score}</div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm text-custom-grey mb-1">
          <span>Progress</span>
          <span>Question {questionsAnswered + 1} of {totalQuestions}</span>
        </div>
        <div className="w-full bg-custom-blue/50 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-glow-cyan to-glow-magenta h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${(questionsAnswered / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="text-xl sm:text-2xl text-center font-semibold min-h-[8rem] mb-8 flex flex-col items-center justify-center">
        <p>{question.question}</p>
        {question.type === 'electronConfiguration' && question.electronConfiguration && (
          <p className="font-orbitron tracking-wider mt-2 text-glow-cyan">
            {formatConfigShells(question.electronConfiguration)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options.map((option, index) => {
          let buttonClass = 'bg-custom-midblue/50 hover:bg-custom-midblue/80';
          if (selectedAnswer) {
            if (option === question.correctAnswer) {
              buttonClass = 'bg-green-500/80';
            } else if (option === selectedAnswer) {
              buttonClass = 'bg-red-500/80';
            } else {
              buttonClass = 'bg-custom-midblue/30 opacity-50';
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={!!selectedAnswer}
              className={`p-4 rounded-lg text-lg font-bold text-white transition-all duration-300 active:shadow-inner ${buttonClass}`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {isCorrect !== null && (
        <div className={`mt-6 text-center text-xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
          {isCorrect ? 'Correct!' : `Incorrect! The answer was ${question.correctAnswer}.`}
        </div>
      )}
    </div>
  );
};

export default QuizView;