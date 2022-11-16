import { useState, useEffect, useTransition } from 'react';
import { animated, useSpring } from '@react-spring/web';
import Question from './Question';
import axios from 'axios';
import { nanoid } from 'nanoid';
import _ from 'lodash';

function QuestionScreen() {
  const [isPending, startTransition] = useTransition();
  const [questions, setQuestions] = useState(() => []);
  const [isSubmmited, setIsSubmmited] = useState(false);
  const [restart, setRestart] = useState(false);
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
  const [message, setMessage] = useState('');
  const fade = useSpring({
    opacity: questions != [] ? 1 : 0,
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

          setQuestions(await data);
          setQuestions((prevQuestions) => {
            return prevQuestions.map((question) => {
              return {
                ...question,
                user_answer: '',
                id: nanoid(),
                answers: _.shuffle([
                  ...question.incorrect_answers,
                  question.correct_answer,
                ]),
              };
            });
          });
          setIsSubmmited(false);
          console.log(await questions);
        } catch (error) {
          console.log(error);
        }
      }

      getQuestions();
    });
  }, [restart]);

  function setAnswer(id, answer) {
    setQuestions((prevQuestions) => {
      return prevQuestions.map((question) => {
        return question.id === id
          ? { ...question, user_answer: answer }
          : question;
      });
    });
  }

  function checkAnswer() {
    const allQuestionAnswered = questions.every(
      (question) => question.user_answer != null && question.user_answer != ''
    );
    if (allQuestionAnswered) {
      let correctAnswerCount = 0;
      for (const question of questions) {
        if (question.user_answer === question.correct_answer) {
          correctAnswerCount++;
        }
      }
      setCorrectAnswerCount(correctAnswerCount);
      setIsSubmmited(true);
    } else {
      console.log('Please answer all questions');
      setMessage('Please answer all questions');
      setTimeout(() => {
        setMessage('');
      }, 5000);
    }
  }

  function newQuiz() {
    setRestart((prevRestart) => !prevRestart);
  }

  const questionElements = questions.map((question) => {
    if (!isSubmmited) {
      return (
        <Question
          key={nanoid()}
          id={question.id}
          question={question.question}
          answers={question.answers}
          userAnswer={question.user_answer}
          setAnswer={setAnswer}
        />
      );
    } else {
      return (
        <Question
          key={nanoid()}
          id={question.id}
          question={question.question}
          answers={question.answers}
          userAnswer={question.user_answer}
          correctAnswer={question.correct_answer}
        />
      );
    }
  });

  return (
    <animated.div
      style={fade}
      className="mx-auto flex max-w-5xl flex-col justify-center gap-3 p-14 "
    >
      {questions == null ? <h2>Loading</h2> : questionElements}

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
