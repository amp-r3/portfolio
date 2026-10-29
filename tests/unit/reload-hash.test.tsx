import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ReloadHashScript } from '@/_app';

describe('ReloadHashScript', () => {
  it('renders a script that strips the hash only on reload', () => {
    const { container } = render(<ReloadHashScript />);
    const script = container.querySelector('script');

    expect(script).toBeInTheDocument();
    expect(script?.innerHTML).toContain("getEntriesByType('navigation')");
    expect(script?.innerHTML).toContain("nav.type==='reload'");
    expect(script?.innerHTML).toContain('history.replaceState');
    expect(script?.innerHTML).toContain('location.hash');
  });
});
