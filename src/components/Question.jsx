import { nanoid } from 'nanoid';
import he from 'he';
import { useEffect, useState } from 'react';
import { animated, useSpring } from '@react-spring/web';

function Question(props) {
  const answerElements = props.answers.map((answer) => {
    if (!props.correctAnswer) {
      if (answer !== props.userAnswer) {
        return (
          <div
            key={nanoid()}
            onClick={() => props.setAnswer(props.id, answer)}
            className="cursor-pointer whitespace-nowrap rounded-full border border-blueNavy bg-white px-4 py-1.5  text-center text-sm font-semibold text-blueNavy hover:bg-slate-300/80"
          >
            {he.decode(answer)}
          </div>
        );
      } else {
        return (
          <div
            key={nanoid()}
            onClick={() => props.setAnswer(props.id, '')}
            className="cursor-pointer whitespace-nowrap rounded-full bg-purpleLight px-4 py-1.5 text-center text-sm font-semibold text-blueNavy hover:bg-slate-300/80"
          >
            {he.decode(answer)}
          </div>
        );
      }
    } else {
      if (answer === props.correctAnswer) {
        return (
          <div
            key={nanoid()}
            className="whitespace-nowrap rounded-full bg-greenLight px-4 py-1.5 text-center text-sm font-semibold text-blueNavy"
          >
            {he.decode(answer)}
          </div>
        );
      }
      if (answer === props.userAnswer) {
        return (
          <div
            key={nanoid()}
            className="whitespace-nowrap rounded-full bg-redLight/50 px-4 py-1.5 text-center text-sm font-semibold text-blueNavy/50"
          >
            {he.decode(answer)}
          </div>
        );
      }

      return (
        <div
          key={nanoid()}
          className="whitespace-nowrap rounded-full border border-blueNavy/50 bg-white/50 px-4 py-1.5  text-center text-sm font-semibold text-blueNavy/50"
        >
          {he.decode(answer)}
        </div>
      );
    }
  });
  return (
    <section className="grid gap-4 overflow-auto ">
      <h2 className="text-xl font-bold text-blueNavy">
        {he.decode(props.question)}
      </h2>
      <div className="flex flex-row items-start gap-4 overflow-auto">
        {answerElements}
      </div>
      <hr />
    </section>
  );
}

export default Question;
