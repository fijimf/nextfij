import { Skeleton } from '@/components/ui/skeleton';

export default function TeamLoading() {
  return (
    <div className="container mx-auto p-4">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <Skeleton className="h-32 w-full mb-4" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
} 