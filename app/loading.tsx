import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo with Container */}
        <div className="relative">
          <div className="w-28 h-28 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shadow-2xl border-2 border-emerald-200 dark:border-emerald-800 animate-bounce">
            <Image
              src="/Nairamet.svg"
              alt="NairaMet Logo"
              className="w-20 h-20"
              width={80}
              height={80}
            />
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-xl animate-pulse"></div>
        </div>

        {/* Brand name */}
        <div className="text-center animate-pulse">
          <h2 className="text-4xl font-bold">
            <span className="text-gray-900 dark:text-gray-100">Naira</span>
            <span className="text-emerald-600 dark:text-emerald-400">Met</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2 font-medium">
            Nigeria's FX Platform, Simplified
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-2">
          <div
            className="w-3 h-3 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-bounce shadow-lg"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-3 h-3 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-bounce shadow-lg"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-3 h-3 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-bounce shadow-lg"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
