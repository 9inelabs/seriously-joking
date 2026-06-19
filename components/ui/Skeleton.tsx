export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-sm bg-[rgba(255,255,255,.05)] ${className}`}
      aria-hidden
    />
  );
}
