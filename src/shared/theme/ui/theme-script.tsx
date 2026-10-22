'use client';

const themeScript = `(function(){try{var s=window.localStorage.getItem('theme');if(s==='light'||s==='dark'){document.documentElement.setAttribute('data-theme',s);return;}}catch(e){}document.documentElement.setAttribute('data-theme','dark');})();`;

export function ThemeScript() {
  return (
    <script
      // The browser executes the script during HTML parsing, before the first
      // paint. On the client it is rendered as inert text so React does not
      // warn about scripts created during hydration.
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  );
}
