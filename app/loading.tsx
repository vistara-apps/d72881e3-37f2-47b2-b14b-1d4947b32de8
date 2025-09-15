export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold gradient-text">Loading CreatorShare</h2>
          <p className="text-muted-foreground">Preparing your creative workspace...</p>
        </div>
      </div>
    </div>
  );
}
