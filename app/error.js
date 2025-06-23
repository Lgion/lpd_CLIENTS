"use client";

export default function Error({ error, reset }) {
  return (
    <div style={{ padding: 40 }}>
      <h2>Something went wrong!</h2>
      {error && <pre style={{ color: 'red' }}>{error.message}</pre>}
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
