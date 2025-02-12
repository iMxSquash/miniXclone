import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/container/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Z",
  description: "Z. C'est ce qu'il se passe /Z",
};

export default function RootLayout({ children }) {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
        <style>{geistSans.styles}</style>
        <style>{geistMono.styles}</style>
      </Head>
      <html lang="fr">
        <body className='bg-white'>
          <Navbar />
          {children}
        </body>
      </html>
    </>
  );
}
