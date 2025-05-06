import { useEffect } from 'react';

/**
 * A hook to set the document title with an optional prefix or suffix
 * @param title The title to set
 * @param options Optional configuration for the title
 */
export function useDocumentTitle(
  title: string,
  options: { 
    prefix?: string;
    suffix?: string;
    includeAppName?: boolean;
  } = {}
) {
  const {
    prefix = '',
    suffix = '',
    includeAppName = false
  } = options;
  
  useEffect(() => {
    const appName = 'CHONK9K';
    let formattedTitle = title;
    
    if (prefix) {
      formattedTitle = `${prefix} ${formattedTitle}`;
    }
    
    if (suffix) {
      formattedTitle = `${formattedTitle} ${suffix}`;
    }
    
    if (includeAppName && !formattedTitle.includes(appName)) {
      formattedTitle = `${formattedTitle} | ${appName}`;
    }
    
    document.title = formattedTitle;
    
    return () => {
      // Reset title when component unmounts
      // This is optional and can be removed if not needed
    };
  }, [title, prefix, suffix, includeAppName]);
}
