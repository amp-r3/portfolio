import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageViewer, type IImageViewerLabels, type IImageViewerSlide, type IImageViewerTab } from '@/shared/ui';

const labels: IImageViewerLabels = {
  close: 'Close fullscreen view',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  resetZoom: 'Reset zoom',
  tabsLabel: 'Screenshot version',
};

const slides: IImageViewerSlide[] = [
  { id: 'desktop', src: '/desktop.png', alt: 'Desktop screenshot', width: 1920, height: 1080 },
  { id: 'mobile', src: '/mobile.png', alt: 'Mobile screenshot', width: 1080, height: 2400 },
];

const tabs: IImageViewerTab[] = [
  { id: 'desktop', label: 'Desktop' },
  { id: 'mobile', label: 'Mobile' },
];

function Harness({ onClose = () => {} }: { onClose?: () => void }) {
  const [activeTabId, setActiveTabId] = useState('desktop');

  return (
    <ImageViewer
      slides={slides}
      tabs={tabs}
      activeTabId={activeTabId}
      onTabChange={setActiveTabId}
      onClose={onClose}
      dialogLabel="Weather screenshots"
      labels={labels}
    />
  );
}

function stubLayout() {
  const image = within(screen.getByRole('dialog')).getByRole('img');
  const viewport = image.parentElement;
  if (!viewport) throw new Error('Viewport was not found');

  Object.defineProperty(image, 'offsetWidth', { configurable: true, value: 1000 });
  Object.defineProperty(image, 'offsetHeight', { configurable: true, value: 1000 });
  Object.defineProperty(viewport, 'clientWidth', { configurable: true, value: 1000 });
  Object.defineProperty(viewport, 'clientHeight', { configurable: true, value: 1000 });
}

describe('ImageViewer', () => {
  it('renders a modal dialog with accessible tabs', () => {
    render(<Harness />);

    const dialog = screen.getByRole('dialog', { name: 'Weather screenshots' });
    expect(dialog).toHaveAttribute('open');
    expect(within(dialog).getByRole('tab', { name: 'Desktop' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(within(dialog).getByRole('tab', { name: 'Mobile' })).toHaveAttribute(
      'aria-selected',
      'false'
    );
  });

  it('switches slides when a tab is clicked', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('tab', { name: 'Mobile' }));

    await waitFor(() => {
      expect(within(dialog).getByRole('img')).toHaveAttribute('src', '/mobile.png');
    });
    expect(within(dialog).getByRole('tab', { name: 'Mobile' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  it('switches slides with arrow keys', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const dialog = screen.getByRole('dialog');
    const desktopTab = within(dialog).getByRole('tab', { name: 'Desktop' });
    desktopTab.focus();

    await user.keyboard('{ArrowRight}');

    await waitFor(() => {
      expect(within(dialog).getByRole('tab', { name: 'Mobile' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });
    expect(within(dialog).getByRole('tab', { name: 'Mobile' })).toHaveFocus();
  });

  it('zooms in and out with the controls', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const dialog = screen.getByRole('dialog');
    stubLayout();

    const zoomOut = within(dialog).getByRole('button', { name: 'Zoom out' });
    expect(zoomOut).toBeDisabled();

    await user.click(within(dialog).getByRole('button', { name: 'Zoom in' }));
    expect(within(dialog).getByText('150%')).toBeInTheDocument();
    expect(within(dialog).getByRole('img').style.transform).toContain('scale(1.5)');
    expect(zoomOut).toBeEnabled();

    await user.click(within(dialog).getByRole('button', { name: 'Reset zoom' }));
    expect(within(dialog).getByText('100%')).toBeInTheDocument();
    expect(within(dialog).getByRole('img').style.transform).toContain('scale(1)');
  });

  it('closes with the close button', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: labels.close }));

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it('closes on Escape', async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it('closes when the backdrop is clicked', async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);

    const dialog = screen.getByRole('dialog');
    const backdrop = dialog.firstElementChild;
    if (!backdrop) throw new Error('Backdrop was not found');

    fireEvent.click(backdrop);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });
});
