function StartScreen(props) {
  return (
    <div className="align-center flex flex-col justify-center gap-3 p-32 text-center">
      <h1 className=" text-2xl font-bold tracking-widest text-blueNavy">
        Quizzical
      </h1>
      <p className="mb-2 text-sm font-normal leading-4 text-blueNavy">
        An app with various questions that you wouldn't expect
      </p>
      <button
        className="w-40 self-center rounded-xl bg-purpleNavy p-3 text-sm text-slate-100  transition-all duration-75 hover:ring-1 active:shadow-insetShadow"
        onClick={props.startQuiz}
      >
        Start Quiz
      </button>
    </div>
  );
}

export default StartScreen;
