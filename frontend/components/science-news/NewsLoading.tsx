import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsLoading() {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
      <CardHeader className="p-4">
        <Skeleton className="h-48 w-full rounded-lg mb-3" />
        <Skeleton className="h-6 w-full" />
        <div className="flex items-center gap-2 mt-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-end">
        <Skeleton className="h-9 w-32" />
      </CardFooter>
    </Card>
  );
}