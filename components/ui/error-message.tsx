"use client";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="text-center p-4">
      <p className="text-red-500 mb-4">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="text-primary hover:underline"
      >
        Try again
      </button>
    </div>
  );
} 