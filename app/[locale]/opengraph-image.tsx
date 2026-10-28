import { ImageResponse } from 'next/og';

export const alt = 'Amir — Frontend Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #020617 0%, #0b1220 55%, #0f172a 100%)',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 28,
            letterSpacing: 2,
            color: '#94a3b8',
          }}
        >
          <span style={{ color: '#f8fafc', fontWeight: 700 }}>amp-r3</span>
          <span>amp-r3.is-a.dev</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2 }}>Amir</div>
          <div style={{ fontSize: 44, fontWeight: 600, color: '#38bdf8', marginTop: 12 }}>
            Frontend Developer
          </div>
          <div style={{ fontSize: 30, color: '#cbd5e1', marginTop: 28 }}>
            React · Next.js · TypeScript
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 26,
            color: '#94a3b8',
          }}
        >
          <span>Responsive interfaces and real API integrations</span>
          <span>Open to junior frontend roles</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
