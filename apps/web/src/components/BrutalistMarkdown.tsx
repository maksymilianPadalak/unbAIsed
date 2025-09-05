import ReactMarkdown from 'react-markdown';

interface BrutalistMarkdownProps {
  children: string;
  className?: string;
}

export default function BrutalistMarkdown({ children, className = '' }: BrutalistMarkdownProps) {
  return (
    <div className={`font-mono leading-relaxed break-words ${className}`}>
      <ReactMarkdown
        components={{
          // Only render paragraphs and links, ignore all other markdown
          p: ({ children }) => <p className="mb-3">{children}</p>,
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white underline font-bold hover:text-gray-300 transition-colors"
            >
              {children}
            </a>
          ),
          // Render all other elements as plain text
          strong: ({ children }) => <span>{children}</span>,
          em: ({ children }) => <span>{children}</span>,
          h1: ({ children }) => <span>{children}</span>,
          h2: ({ children }) => <span>{children}</span>,
          h3: ({ children }) => <span>{children}</span>,
          h4: ({ children }) => <span>{children}</span>,
          h5: ({ children }) => <span>{children}</span>,
          h6: ({ children }) => <span>{children}</span>,
          ul: ({ children }) => <span>{children}</span>,
          ol: ({ children }) => <span>{children}</span>,
          li: ({ children }) => <span>{children}</span>,
          blockquote: ({ children }) => <span>{children}</span>,
          code: ({ children }) => <span>{children}</span>,
          pre: ({ children }) => <span>{children}</span>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
