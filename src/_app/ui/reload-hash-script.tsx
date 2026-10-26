'use client';

const reloadHashScript = `(function(){try{var nav=performance.getEntriesByType('navigation')[0];if(nav&&nav.type==='reload'&&location.hash){history.replaceState(history.state,'',location.pathname+location.search);}}catch(e){}})();`;

export function ReloadHashScript() {
  return (
    <script
      // Reload strips the hash before the browser resolves the fragment. On the
      // client the script is inert data, so soft navigation never re-runs it.
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: reloadHashScript }}
    />
  );
}
