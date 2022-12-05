import { useState, useEffect, useTransition } from 'react';
import { animated, useSpring } from '@react-spring/web';
import Question from './Question';
import axios from 'axios';
import { nanoid } from 'nanoid';
import _ from 'lodash';

function QuestionScreen() {
  const [isPending, startTransition] = useTransition();
  const [questions, setQuestions] = useState([]);
  const [questionElements, setQuestionElements] = useState('');
  const [userAnswers, setUserAnswers] = useState(() => []);
  const [isSubmmited, setIsSubmmited] = useState(() => false);
  const [restart, setRestart] = useState(false);
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
  const [message, setMessage] = useState('');
  const fade = useSpring({
    opacity: questions > 0 ? 1 : 0,
  });

  useEffect(() => {
    startTransition(() => {
      async function getQuestions() {
        try {
          const res = await axios.get('https://opentdb.com/api.php', {
            params: {
              amount: 7,
              category: 9,
              difficulty: 'easy',
              type: 'multiple',
            },
          });
          const data = await res.data.results;
          const shuffledQuestion = data.map((question) => {
            return {
              ...question,
              id: nanoid(),
              answers: _.shuffle([
                ...question.incorrect_answers,
                question.correct_answer,
              ]),
            };
          });
          setQuestions(shuffledQuestion);

          setIsSubmmited(false);
        } catch (error) {
          console.log(error);
        }
      }

      getQuestions();
    });
  }, [restart]);

  useEffect(() => {
    const initialUserAnswers = [];
    for (const q of questions) {
      initialUserAnswers.push({ id: q.id, user_answer: '' });
    }
    setUserAnswers(initialUserAnswers);
  }, [questions]);

  function setUserAnswer(userAnswer) {
    setUserAnswers((prevUserAnswers) => {
      return prevUserAnswers.map((answer) => {
        return answer.id === userAnswer.id
          ? { ...answer, user_answer: userAnswer.user_answer }
          : answer;
      });
    });
  }

  function checkAnswer() {
    const isAllQuestionAnswered = userAnswers.every(
      (answer) => answer.user_answer != null && answer.user_answer != ''
    );
    if (isAllQuestionAnswered) {
      let correctAnswerCount = 0;
      for (let i = 0; i < questions.length; i++) {
        if (userAnswers[i].user_answer === questions[i].correct_answer) {
          correctAnswerCount++;
        }
      }
      setIsSubmmited(true);

      setCorrectAnswerCount(correctAnswerCount);
    } else {
      console.log('Please answer all questions');
      setMessage('Please answer all questions');
      setTimeout(() => {
        setMessage('');
      }, 5000);
    }
  }

  function newQuiz() {
    setQuestions([]);
    setRestart((prevRestart) => !prevRestart);
  }

  useEffect(() => {
    setQuestionElements(
      questions.map((question, i) => {
        if (!isSubmmited) {
          return (
            <Question
              key={nanoid()}
              id={question.id}
              question={question.question}
              answers={question.answers}
              setUserAnswer={setUserAnswer}
            />
          );
        } else {
          return (
            <Question
              key={nanoid()}
              id={question.id}
              question={question.question}
              answers={question.answers}
              userAnswer={userAnswers[i].user_answer}
              correctAnswer={question.correct_answer}
            />
          );
        }
      })
    );
  }, [isSubmmited, questions]);

  if (questions.length <= 0) {
    return <h2 className="font-bold">Loading...</h2>;
  }

  return (
    <animated.div className="mx-auto flex max-w-5xl flex-col justify-center gap-3 p-14 ">
      {questionElements}
      {message && !isSubmmited ? (
        <p className="text-center text-red-500">{message}</p>
      ) : (
        ''
      )}
      <div className="mt-8 flex flex-row items-center justify-center gap-6">
        {isSubmmited ? (
          <h2 className="text-lg font-bold text-blueNavy">
            You scored {correctAnswerCount}/{questions.length} correct answers
          </h2>
        ) : (
          ''
        )}

        <button
          onClick={isSubmmited ? newQuiz : checkAnswer}
          className="w-40 self-center rounded-xl bg-purpleNavy p-3 text-sm text-slate-100  transition-all duration-75 hover:ring-1 active:shadow-insetShadow"
        >
          {isSubmmited ? 'Play again' : 'Check answers'}
        </button>
      </div>
    </animated.div>
  );
}

export default QuestionScreen;
