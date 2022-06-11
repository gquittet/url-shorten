import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import './styles.css';

export const fixVhForMobile = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

function CustomApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    fixVhForMobile();
    window.addEventListener('resize', fixVhForMobile);

    return () => {
      window.removeEventListener('resize', fixVhForMobile);
    };
  });

  return (
    <ChakraProvider>
      <Head>
        <title>Url Shorten 🔗</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </ChakraProvider>
  );
}

export default CustomApp;
