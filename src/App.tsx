import React, { FC } from "react";

import OnScreenConsole from "./components/OnScreenConsole";

const App: FC = () => {
  return (
    <OnScreenConsole
      data={{
        a: 1,
        b: {
          c: 2,
          dasd: {
            easd: {
              fasd: {
                gasd: {
                  hasd: {
                    iasd: {
                      jasd: {
                        kasd: {
                          lasddfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfd: 3,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }}
    />
  );
};

export default App;
