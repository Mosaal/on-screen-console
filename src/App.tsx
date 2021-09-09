import React, { FC, useEffect, useState } from "react";

import OnScreenConsole, {
  writeDataToConsole,
} from "./components/OnScreenConsole";

const App: FC = () => {
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(counter + 1);
      writeDataToConsole({ lmao: counter });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [counter]);

  return <OnScreenConsole />;
};

export default App;
