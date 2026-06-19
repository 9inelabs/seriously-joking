"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          background: "#050B14",
          color: "#F5EDD8",
          fontFamily: "system-ui, sans-serif",
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>Something went wrong</h1>
          <p style={{ color: "#8A93A6", marginBottom: 24 }}>
            Please refresh and try again.
          </p>
          <button
            onClick={reset}
            style={{
              background: "linear-gradient(135deg,#F4D58F,#D4A74A 35%,#9C7325 70%,#D4A74A)",
              color: "#050B14",
              border: 0,
              padding: "14px 24px",
              borderRadius: 8,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
