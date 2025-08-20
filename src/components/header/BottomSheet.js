import React from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import Interval from "./İnterval";

const MyBottomSheet = ({
  open,
  onDismiss,
  selectedKeywordId,
  keywordRedux,
  handleKeywordChange,
}) => {
  return (
    <BottomSheet
      open={open}
      onDismiss={onDismiss}
      snapPoints={({ maxHeight }) => [0.45 * maxHeight, 0.83 * maxHeight]}
      defaultSnap={({ lastSnap, snapPoints }) => {
        lastSnap ?? Math.max(...snapPoints);
      }}
      blocking={false}
    >
      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col items-center text-white gap-2">
          Interval :
          <Interval />
        </div>
        <div className="flex flex-col items-center text-white gap-2">
          Keywords :
          <select
            onChange={handleKeywordChange}
            className="text-white  bg-[#36394c]  max-w-[250px] min-w-[200px] max-2xl:px-2 px-4 py-3 rounded font-medium border-[#6e727d] border-[1px] outline-none"
            value={selectedKeywordId || ""}
          >
            {keywordRedux &&
              keywordRedux.map((keyword) => (
                <option
                  className="border-[2px]"
                  key={keyword.id}
                  value={keyword.id}
                >
                  {keyword.title}
                </option>
              ))}
          </select>
        </div>
      </div>
    </BottomSheet>
  );
};

export default MyBottomSheet;
