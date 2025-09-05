import { CompanyEthics } from '../../../../types';
import { ExternalLink } from 'lucide-react';
interface CompanyScoreCardProps {
  company: CompanyEthics;
  showLinks?: boolean;
}

export default function CompanyScoreCard({
  company,
  showLinks = true,
}: CompanyScoreCardProps) {
  const getScoreColor = (score: number): string => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 8) return 'EXCELLENT';
    if (score >= 6) return 'GOOD';
    if (score >= 4) return 'POOR';
    return 'TERRIBLE';
  };

  const hasSplitLinks =
    (company.goodImpactArticles && company.goodImpactArticles.length > 0) ||
    (company.badImpactArticles && company.badImpactArticles.length > 0);

  const LinkList = ({
    title,
    links,
    small,
    isPositive,
  }: {
    title: string;
    links: NonNullable<CompanyEthics['goodImpactArticles']>;
    small?: boolean;
    isPositive?: boolean;
  }) => {
    const titleColor = isPositive ? 'text-green-400' : 'text-red-400';
    const shadowHover = isPositive ? 'hover:shadow-2xl hover:shadow-green-500/30' : 'hover:shadow-2xl hover:shadow-red-500/30';
    
    return (
      <div>
        <h4
          className={`${titleColor} font-black font-mono ${small ? 'text-sm sm:text-lg' : 'text-2xl'} mb-3 uppercase tracking-wide`}
        >
          {title}
        </h4>
        <div className="grid gap-2">
          {links.map((link, index) => (
            <a
              key={`${title}-${index}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`brutalist-button text-left ${small ? 'px-3 py-2' : 'px-4 py-4'} flex items-start justify-between group hover:scale-[1.02] ${shadowHover} transition-all duration-200`}
            >
              <span
                className={`font-mono ${small ? 'text-xs sm:text-sm' : 'text-lg'} font-bold mr-2 leading-tight`}
              >
                {link.description}
              </span>
              <ExternalLink
                className={`${small ? 'w-4 h-4' : 'w-5 h-5'} flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}
              />
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="brutalist-border bg-black p-4 sm:p-6 mb-6 hover:bg-gray-900 transition-all duration-100">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        {/* Company Header */}
        <div className="mb-4">
          <h3 className="text-xl sm:text-2xl font-black font-mono text-white uppercase tracking-wider mb-2">
            {company.name}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <span className="text-white font-mono font-bold text-sm sm:text-base">
                ETHICS SCORE:
              </span>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span
                  className={`text-2xl sm:text-4xl font-black font-mono ${getScoreColor(company.ethicalScore)}`}
                >
                  {company.ethicalScore}/10
                </span>
                <span
                  className={`border-3 border-white text-xs sm:text-sm px-2 sm:px-3 py-1 font-mono font-bold uppercase tracking-wider ${getScoreColor(company.ethicalScore)} bg-black`}
                >
                  {getScoreLabel(company.ethicalScore)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4 overflow-hidden">
          <p className="text-white font-mono leading-relaxed text-sm sm:text-lg break-words max-w-full">
            {company.description}
          </p>
        </div>

        {showLinks && hasSplitLinks && (
          <div className="space-y-4">
            {company.goodImpactArticles &&
              company.goodImpactArticles.length > 0 && (
                <LinkList
                  title="POSITIVE IMPACT ARTICLES:"
                  links={company.goodImpactArticles}
                  small
                  isPositive={true}
                />
              )}
            {company.badImpactArticles &&
              company.badImpactArticles.length > 0 && (
                <LinkList
                  title="NEGATIVE IMPACT ARTICLES:"
                  links={company.badImpactArticles}
                  small
                  isPositive={false}
                />
              )}
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Company Header */}
        <div className="mb-8">
          <h3 className="text-4xl font-black font-mono text-white uppercase tracking-wider mb-6">
            {company.name}
          </h3>
          <div className="flex items-center space-x-8 mb-6">
            <span className="text-white font-mono font-bold text-xl">
              ETHICS SCORE:
            </span>
            <span
              className={`text-6xl font-black font-mono ${getScoreColor(company.ethicalScore)}`}
            >
              {company.ethicalScore}/10
            </span>
            <span
              className={`border-3 border-white text-xl px-6 py-3 font-mono font-bold uppercase tracking-wider ${getScoreColor(company.ethicalScore)} bg-black`}
            >
              {getScoreLabel(company.ethicalScore)}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6 overflow-hidden">
          <p className="text-white font-mono leading-relaxed text-2xl break-words max-w-full">
            {company.description}
          </p>
        </div>

        {showLinks && hasSplitLinks && (
          <div className="space-y-6">
            {company.goodImpactArticles &&
              company.goodImpactArticles.length > 0 && (
                <LinkList
                  title="POSITIVE IMPACT ARTICLES:"
                  links={company.goodImpactArticles}
                  isPositive={true}
                />
              )}
            {company.badImpactArticles &&
              company.badImpactArticles.length > 0 && (
                <LinkList
                  title="NEGATIVE IMPACT ARTICLES:"
                  links={company.badImpactArticles}
                  isPositive={false}
                />
              )}
          </div>
        )}
      </div>
    </div>
  );
}
