export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="border-4 border-white p-8 bg-black">
        <div className="text-white font-mono text-2xl font-bold tracking-wider animate-pulse">
          LOADING COMPANIES...
        </div>
      </div>
    </div>
  );
}
