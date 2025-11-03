export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-0 m-0">
      <div className="w-full max-w-[320px] h-[220px]">
        {children}
      </div>
    </div>
  );
}