import React from "react";
import Button from "../button/Button";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="text-black bg-red-50 border-red-600 border-[2px] h-[350px] overflow-auto overflow-x-auto font-medium p-3">
      <p className="text-red-500 font-bold">{error.message}</p>
      <p>Something went wrong</p>
      <div className="flex justify-center items-center py-1">
        <Button
          className="bg-red-600 flex justify-center px-4 py-2 text-white rounded-md hover:bg-red-700 duration-200"
          onClick={resetErrorBoundary}
        >
          Try again
        </Button>
      </div>
      <details className="overflow-auto">
        <summary>Click to view the error</summary>
        <pre>{error.stack}</pre>
      </details>
    </div>
  );
}

export default ErrorFallback;
