"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-4 px-4 py-16 sm:px-6 lg:px-8">
      <div className="alert alert-error w-full">
        <span>No hay contenido disponible en este momento</span>
      </div>
      <p className="text-sm text-base-content/70">{error.message}</p>
      <button type="button" className="btn btn-primary" onClick={() => reset()}>
        Reintentar
      </button>
    </div>
  );
}
