import { useState } from 'react';
import Grid from './components/Grid';
import QuestionScreen from './components/QuestionScreen';
import StartScreen from './components/StartScreen';

function App() {
  const [isStart, setIsStart] = useState(false);

  return (
    <div className="App ">
      {/* <Grid /> */}
      <main className=" flex h-full flex-col justify-center bg-[#F5F7FB] p-4">
        {!isStart && <StartScreen startQuiz={() => setIsStart(true)} />}
        {isStart && <QuestionScreen />}
      </main>
    </div>
  );
}

export default App;
