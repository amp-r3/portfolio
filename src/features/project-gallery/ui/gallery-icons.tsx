import { Maximize2, Monitor, Smartphone } from 'lucide-react';

export function DesktopIcon() {
  return <Monitor aria-hidden="true" focusable="false" />;
}

export function MobileIcon() {
  return <Smartphone aria-hidden="true" focusable="false" />;
}

export function ExpandIcon() {
  return <Maximize2 aria-hidden="true" focusable="false" />;
}
