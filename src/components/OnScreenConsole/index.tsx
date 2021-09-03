import React, { FC, useState } from "react";
import tw, { styled } from "twin.macro";

import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";

import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import * as SyntaxStyles from "react-syntax-highlighter/dist/esm/styles/hljs";
import SyntaxDefault from "react-syntax-highlighter/dist/esm/default-highlight";

import { IoIosMove, IoMdResize } from "react-icons/io";

export interface OnScreenConsoleProps {
  data?: any;
}

const OnScreenConsole: FC<OnScreenConsoleProps> = ({ data }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [wrapLongLines, setWrapLongLines] = useState<boolean>(false);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(false);
  const [selectedStyle, setSelectedStyle] = useState<string>("monokaiSublime");
  const [selectedLanguage, setSelectedLanguage] =
    useState<string>("javascript");

  return (
    <Draggable
      handle=".handle"
      onStart={() => setIsDragging(true)}
      onStop={() => setIsDragging(false)}
    >
      <ResizableBox
        width={600} // @TODO: customizable
        height={400} // @TODO: customizable
        minConstraints={[600, 300]} // @TODO: customizable
        onResizeStart={() => setIsResizing(true)}
        onResizeStop={() => setIsResizing(false)}
        handle={<ResizeHandle active={isResizing} />}
      >
        <div tw="flex flex-col w-full h-full border rounded shadow-xl border-gray-300 overflow-hidden">
          <div
            className="handle"
            css={[
              tw`flex flex-row items-center justify-between px-4 py-2 border-b border-gray-300`,
              isDragging
                ? tw`hover:cursor-[grabbing]`
                : tw`hover:cursor-[grab]`,
            ]}
          >
            <div>
              <input
                type="checkbox"
                id="wrap-lines"
                name="wrap-lines"
                tw="mr-2"
                checked={wrapLongLines}
                onChange={() => setWrapLongLines(!wrapLongLines)}
              />
              <label htmlFor="wrap-lines">Wrap long lines</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="line-numbers"
                name="line-numbers"
                tw="mr-2"
                checked={showLineNumbers}
                onChange={() => setShowLineNumbers(!showLineNumbers)}
              />
              <label htmlFor="line-numbers">Show line numbers</label>
            </div>
            <div>
              <label htmlFor="language">Style:</label>
              <select
                id="style"
                name="style"
                value={selectedStyle}
                // @ts-ignore
                onChange={(e) => setSelectedStyle(e.target.value)}
              >
                {Object.keys(SyntaxStyles).map((styleKey) => (
                  <option key={styleKey} value={styleKey}>
                    {styleKey}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="language">Language:</label>
              <select
                id="language"
                name="language"
                value={selectedLanguage}
                // @ts-ignore
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {SyntaxDefault.supportedLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <IoIosMove />
          </div>
          <SyntaxHighlighter
            tw="flex-1"
            language={selectedLanguage} // @TODO: customizable
            wrapLines={wrapLongLines} // @TODO: customizable
            wrapLongLines={wrapLongLines} // @TODO: customizable
            showLineNumbers={showLineNumbers} // @TODO: customizable
            // @ts-ignore
            style={SyntaxStyles[selectedStyle]} // @TODO: customizable
          >
            {JSON.stringify(data, null, 2)}
          </SyntaxHighlighter>
        </div>
      </ResizableBox>
    </Draggable>
  );
};

interface ResizeHandleProps {
  active?: boolean;
}

const ResizeHandle = styled(IoMdResize)<ResizeHandleProps>`
  ${tw`text-white absolute right-0 bottom-0 mr-5 mb-5 transform rotate-90`}
  ${({ active }) =>
    active ? tw`hover:cursor-[grabbing]` : tw`hover:cursor-[grab]`}
`;

export default OnScreenConsole;
