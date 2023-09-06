import { SessionProvider } from "next-auth/react";
import { Noto_Sans_KR } from "next/font/google";

import '@/styles/globals.css'
import { notoSansKR400 } from '@/styles/fonts.module.css';

const notoSansKR = Noto_Sans_KR({
  weight: ['400', '500', '700'],
  display: 'fallback',
  style: 'normal',
  subsets: ['latin'],
  variable: '--noto-sans-kr'
});

export default function App({Component, pageProps: { session, ...pageProps }}) {
  return (
    <SessionProvider session={session}>
      <main className={notoSansKR.variable}>
        <section className={notoSansKR400}>
          <Component {...pageProps} />
        </section>
      </main>
    </SessionProvider>
  );
}
