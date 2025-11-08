export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Logo */}
        <div className="w-20 h-20">
          <img
            src="/Nairamet.svg"
            alt="NairaMet Logo"
            className="w-20 h-20 animate-bounce"
          />
        </div>

        {/* Brand name */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Naira<span className="text-emerald-600">Met</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Loading...</p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
