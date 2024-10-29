interface ErrorMessageProps {
  message: string;
  retry?: () => void;
}

export function ErrorMessage({ message, retry }: ErrorMessageProps) {
  return (
    <div className="text-center p-4">
      <p className="text-red-500 mb-4">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="text-primary hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
} 