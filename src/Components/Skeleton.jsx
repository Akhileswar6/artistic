export default function Skeleton({ className, ...props }) {
  return (
    <div
      className={`animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-md ${className}`}
      {...props}
    />
  );
}

export function OrderSkeleton() {
  return (
    <div className="rounded-lg p-4 border border-neutral-200 dark:border-neutral-800 space-y-4">
      <div className="flex gap-5 items-center">
        <Skeleton className="w-32 h-32 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-4">
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="flex justify-end pt-2 border-t border-neutral-100 dark:border-neutral-900">
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function GallerySkeleton() {
  return (
    <div className="columns-2 md:columns-3 xl:columns-4 gap-6 space-y-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="break-inside-avoid space-y-3">
          <Skeleton className={`w-full rounded-2xl ${i % 2 === 0 ? "h-64" : "h-96"}`} />
          <div className="flex justify-between items-center px-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
