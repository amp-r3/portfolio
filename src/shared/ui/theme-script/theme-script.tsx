'use client';

import {
  DEFAULT_THEME,
  THEME_COOKIE_NAME,
  THEME_STORAGE_KEY,
} from '@/shared/lib';

const themeScript = `(function(){var theme='${DEFAULT_THEME}';var stored=null;try{stored=window.localStorage.getItem('${THEME_STORAGE_KEY}');}catch(e){}if(stored==='light'||stored==='dark'){theme=stored;}else{try{var match=document.cookie.match(/(?:^|; )${THEME_COOKIE_NAME}=(light|dark)(?:;|$)/);if(match){theme=match[1];}}catch(e){}}var root=document.documentElement;root.setAttribute('data-theme',theme);root.style.colorScheme=theme;})();`;

export function ThemeScript() {
  return (
    <script
      // React must not execute this script again on client navigation. On the
      // server it is executable and runs before the first paint; on the client
      // it is inert data, which React explicitly allows inside components.
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  );
}
