export const revalidate = 0;

export default function OurMissionPage() {
  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <div className="brutalist-border bg-black p-6 sm:p-10">
          <h1 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-wider mb-6">
            MISSION
          </h1>

          <div className="space-y-5 text-white font-mono leading-relaxed text-base sm:text-lg">
            <p>
              The goal of this project is to build the best possible algorithm
              for judging corporate ethics — one that is fair, transparent, and
              that encourages companies to become better through real actions,
              not lobbying.
            </p>
            <p>
              This project will forever remain open source. All ideas on how to
              make the scoring algorithm better are welcome and encouraged.
            </p>
            <p className="opacity-80">
              Suggestions, critiques, and data sources that should be
              incorporated are always appreciated. Together we can create a standard
              that rewards real progress and holds companies accountable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
