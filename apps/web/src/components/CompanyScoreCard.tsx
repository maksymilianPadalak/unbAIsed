import { CompanyEthics } from '../../../../types';
import { ExternalLink } from 'lucide-react';

interface CompanyScoreCardProps {
  company: CompanyEthics;
}

export default function CompanyScoreCard({ company }: CompanyScoreCardProps) {
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

  return (
    <div className="brutalist-border bg-black p-6 mb-6 hover:bg-gray-900 transition-all duration-100">
      {/* Company Header */}
      <div className="mb-4">
        <h3 className="text-2xl font-black font-mono text-white uppercase tracking-wider mb-2">
          {company.name}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <span className="text-white font-mono font-bold">
              ETHICS SCORE:
            </span>
            <span
              className={`text-4xl font-black font-mono ${getScoreColor(company.ethicalScore)}`}
            >
              {company.ethicalScore}/10
            </span>
            <span
              className={`border-3 border-white text-sm px-3 py-1 font-mono font-bold uppercase tracking-wider ${getScoreColor(company.ethicalScore)} bg-black`}
            >
              {getScoreLabel(company.ethicalScore)}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-white font-mono leading-relaxed text-lg">
          {company.description}
        </p>
      </div>

      {/* Useful Links */}
      {company.usefulLinks && company.usefulLinks.length > 0 && (
        <div>
          <h4 className="text-white font-black font-mono text-lg mb-3 uppercase tracking-wide">
            RESEARCH LINKS:
          </h4>
          <div className="grid gap-2">
            {company.usefulLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="brutalist-button text-left px-3 py-2 flex items-start justify-between group"
              >
                <span className="font-mono text-sm font-bold mr-2 leading-tight">
                  {link.description}
                </span>
                <ExternalLink className="w-4 h-4 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
