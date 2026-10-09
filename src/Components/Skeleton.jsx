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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden space-y-2">
          <Skeleton className="w-full aspect-[3/4] rounded-xl" />
          <div className="p-2">
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
