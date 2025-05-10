import React from "react";

interface ErrorBoundaryProps {
  error: Error;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ error }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-2">Hiba</h1>
      <p className="text-lg">{error.message}</p>
    </div>
  );
};

export default ErrorBoundary;
