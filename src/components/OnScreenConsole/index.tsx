import ReactDOM from "react-dom";
import React, { FC, useEffect, useState } from "react";

import tw, { styled } from "twin.macro";

import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { ResizableBox, ResizeCallbackData } from "react-resizable";

import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import * as SyntaxStyles from "react-syntax-highlighter/dist/esm/styles/hljs";
import SyntaxDefault from "react-syntax-highlighter/dist/esm/default-highlight";

import { IoIosMove, IoMdResize } from "react-icons/io";

const EVENT_NAME = "update-on-screen-console-data";

export const DEFAULT_WINDOW_POSITION: WindowPosition = { x: 20, y: 20 };
export const DEFAULT_WINDOW_SIZE: WindowSize = { width: 600, height: 600 };
export const DEFAULT_MINIUM_WINDOW_SIZE: WindowSize = {
  width: 500,
  height: 500,
};

export const writeDataToConsole = (data: any) => {
  document.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: data }));
};

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowPosition {
  x: number;
  y: number;
}

export interface OnScreenConsoleProps {
  minimumSize?: WindowSize;
  initialSize?: WindowSize;
  initialPosition?: WindowPosition;
}

const OnScreenConsole: FC<OnScreenConsoleProps> = ({
  minimumSize = DEFAULT_MINIUM_WINDOW_SIZE,
  initialSize,
  initialPosition,
}) => {
  const [data, setData] = useState<any>(null);

  const updateData = (e: CustomEvent) => {
    setData(e.detail);
  };

  useEffect(() => {
    if (!document.getElementById("on-screen-console-portal")) {
      const portal = document.createElement("div");
      portal.id = "on-screen-console-portal";
      portal.classList.add("fixed", "inset-0", "bg-transparent");
      document.body.appendChild(portal);
    }

    document.addEventListener(EVENT_NAME, updateData as EventListener);
    return () => {
      document.removeEventListener(EVENT_NAME, updateData as EventListener);
    };
  }, []);

  const [currentSize, setCurrentSize] = useState<WindowSize>(
    initialSize || DEFAULT_WINDOW_SIZE
  );
  const [currentPosition, setCurrentPosition] = useState<WindowPosition>(
    initialPosition || DEFAULT_WINDOW_POSITION
  );

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  const [wrapLongLines, setWrapLongLines] = useState<boolean>(false);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(false);

  const [selectedStyle, setSelectedStyle] = useState<string>("monokaiSublime");
  const [selectedLanguage, setSelectedLanguage] =
    useState<string>("javascript");

  const handleDragging = (e: DraggableEvent, data: DraggableData) => {
    setCurrentPosition({ x: data.x, y: data.y });
  };

  const handleResizing = (
    e: React.SyntheticEvent<Element, Event>,
    data: ResizeCallbackData
  ) => {
    setCurrentSize({ width: data.size.width, height: data.size.height });
  };

  const portalEl = document.getElementById("on-screen-console-portal");
  return portalEl
    ? ReactDOM.createPortal(
        <Draggable
          handle=".handle"
          bounds="#on-screen-console-portal"
          position={currentPosition}
          onStart={() => setIsDragging(true)}
          onStop={() => setIsDragging(false)}
          // @ts-ignore
          onDrag={handleDragging}
        >
          <ResizableBox
            width={currentSize.width} // @TODO: customizable
            height={currentSize.height} // @TODO: customizable
            minConstraints={[minimumSize.width, minimumSize.height]} // @TODO: customizable
            onResizeStart={() => setIsResizing(true)}
            onResizeStop={() => setIsResizing(false)}
            handle={<ResizeHandle active={isResizing} />}
            onResize={handleResizing}
          >
            <div tw="flex flex-col w-full h-full border rounded shadow-xl border-gray-300 shadow-lg overflow-hidden">
              <div
                className="handle"
                css={[
                  tw`flex flex-row items-center justify-between px-4 py-2 bg-white border-b border-gray-300`,
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
                <IoIosMove tw="flex-shrink-0" />
              </div>
              <SyntaxHighlighter
                tw="flex-1 p-4!"
                language={selectedLanguage} // @TODO: customizable
                wrapLines={wrapLongLines} // @TODO: customizable
                wrapLongLines={wrapLongLines} // @TODO: customizable
                showLineNumbers={showLineNumbers} // @TODO: customizable
                // @ts-ignore
                style={SyntaxStyles[selectedStyle]} // @TODO: customizable
              >
                {data ? JSON.stringify(data, null, 2) : ""}
              </SyntaxHighlighter>
            </div>
          </ResizableBox>
        </Draggable>,
        portalEl
      )
    : null;
};

interface ResizeHandleProps {
  active?: boolean;
}

const ResizeHandle = styled(IoMdResize)<ResizeHandleProps>`
  ${tw`text-white absolute right-0 bottom-0 mr-5 mb-5 transform rotate-90 hover:cursor-[nwse-resize]`}
`;

export default OnScreenConsole;
