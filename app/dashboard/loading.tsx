import { Loading } from "@/components/ui/loading";

export default function DashboardLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loading />
      </div>
    </div>
  );
} 