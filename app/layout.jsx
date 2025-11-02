import './globals.css';

export const metadata = {
  title: 'Process Tree ? fork()',
  description: 'Visualization of processes spawned by repeated fork calls',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
