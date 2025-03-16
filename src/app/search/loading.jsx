import SearchResultsSkeleton from "@/components/search/SearchResultsSkeleton";

export default function SearchLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <SearchResultsSkeleton count={7} />
    </div>
  );
} 