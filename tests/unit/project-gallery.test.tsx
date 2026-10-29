import { describe, expect, it } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import type { ProjectImages } from '@/entities/project';
import { ProjectGallery } from '@/features/project-gallery/ui/project-gallery';
import enMessages from '../../messages/en.json';

const images: ProjectImages = {
  light: '/desktop-light.png',
  dark: '/desktop-dark.png',
  mobileLight: '/mobile-light.png',
  mobileDark: '/mobile-dark.png',
};

function renderGallery(galleryImages: ProjectImages = images, title = 'Weather App') {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <ProjectGallery images={galleryImages} title={title} />
    </NextIntlClientProvider>
  );
}

describe('ProjectGallery', () => {
  it('renders both theme pictures and an accessible fullscreen trigger', () => {
    renderGallery();

    expect(screen.getAllByAltText('Screenshot of the Weather App project')).toHaveLength(2);
    expect(
      screen.getByRole('button', { name: enMessages.projects.viewer.open })
    ).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('opens the desktop screenshot and switches to the mobile variant', async () => {
    const user = userEvent.setup();
    renderGallery();

    const openButton = screen.getByRole('button', { name: enMessages.projects.viewer.open });
    await user.click(openButton);

    const dialog = screen.getByRole('dialog', {
      name: 'Weather App screenshots',
    });
    expect(within(dialog).getByRole('img')).toHaveAttribute('src', '/desktop-dark.png');
    expect(within(dialog).getByRole('tab', { name: enMessages.projects.viewer.desktop })).toHaveAttribute(
      'aria-selected',
      'true'
    );

    await user.click(
      within(dialog).getByRole('tab', { name: enMessages.projects.viewer.mobile })
    );

    await waitFor(() => {
      expect(within(dialog).getByRole('img')).toHaveAttribute('src', '/mobile-dark.png');
    });
  });

  it('closes the viewer and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    renderGallery();

    const openButton = screen.getByRole('button', { name: enMessages.projects.viewer.open });
    await user.click(openButton);

    await user.click(
      screen.getByRole('button', { name: enMessages.projects.viewer.close })
    );

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(openButton).toHaveFocus();
    });
  });

  it('hides the variant navigation when the project has no mobile screenshot', async () => {
    const user = userEvent.setup();
    renderGallery({ light: '/desktop.png' });

    await user.click(screen.getByRole('button', { name: enMessages.projects.viewer.open }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).queryByRole('tablist')).not.toBeInTheDocument();
    expect(within(dialog).getByRole('img')).toHaveAttribute('src', '/desktop.png');
  });
});
