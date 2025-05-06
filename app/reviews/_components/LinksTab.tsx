interface Link {
  href: string;
  text: string | null;
  rel: string;
}

interface LinksTabProps {
  links: Link[];
}

export function LinksTab({ links }: LinksTabProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Links</h2>
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-[calc(100vh-400px)] overflow-y-auto">
        <div className="space-y-2">
          {links.map((link, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {link.text || link.href}
              </a>
              {link.rel && (
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({link.rel})
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 