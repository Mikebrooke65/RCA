import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RCA Membership',
  description: 'Riverhead Community Association Membership Portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
