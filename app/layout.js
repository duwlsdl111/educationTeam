// app/layout.js
import './globals.css';
import Header from './components/Header/page';
import Footer from './components/Footer/page';

export const metadata = {
  title: 'LittleFarmer',
  description: 'Seed to Table',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main id="app-main">{children}</main>
        <Footer />
        <div id="portal-root" />
      </body>
    </html>
  );
}
