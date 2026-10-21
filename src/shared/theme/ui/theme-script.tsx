const themeScript = `(function(){try{var s=window.localStorage.getItem('theme');if(s==='light'||s==='dark'){document.documentElement.setAttribute('data-theme',s);return;}}catch(e){}document.documentElement.setAttribute('data-theme','dark');})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
