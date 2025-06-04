export default function TetelCardSkeleton() {
  return (
    <div className="h-48 bg-secondary rounded-lg p-6 shadow-xl animate-pulse flex items-center justify-center">
      <div className="space-y-4 text-center w-full">
        <div className="h-6 w-3/4 bg-muted-foreground/20 rounded mx-auto" />
        <div className="h-4 w-2/3 bg-muted-foreground/20 rounded mx-auto" />
      </div>
    </div>
  );
}
