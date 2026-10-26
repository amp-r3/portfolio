'use client';

const themeScript = `(function(){try{var s=window.localStorage.getItem('theme');var t=(s==='light'||s==='dark')?s:'dark';document.documentElement.setAttribute('data-theme',t);if(typeof Element!=='undefined'&&Element.prototype.setAttribute){var origSet=Element.prototype.setAttribute;Element.prototype.setAttribute=function(n,v){var r=origSet.call(this,n,v);if(this===document.documentElement&&(n==='lang'||n==='class')){var th='dark';try{th=window.localStorage.getItem('theme')||'dark';}catch(e){}if(this.getAttribute('data-theme')!==th){origSet.call(this,'data-theme',th);}}return r;};var origRem=Element.prototype.removeAttribute;Element.prototype.removeAttribute=function(n){if(this===document.documentElement&&n==='data-theme')return;return origRem.call(this,n);};}if(window.MutationObserver){var o=new MutationObserver(function(){var c=document.documentElement.getAttribute('data-theme');if(!c){var v='dark';try{v=window.localStorage.getItem('theme')||'dark';}catch(e){}document.documentElement.setAttribute('data-theme',v);}});o.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});}}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

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
