import Head from "next/head";
import "./globals.css";
import Navbar from "./components/container/navbar";
import { UserProvider } from "./context/UserContext";


export const metadata = {
  title: "Z",
  description: "Z. C'est ce qu'il se passe /Z",
};

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <html lang="fr">
        <body className='bg-black text-text-dark'>
          <Navbar />
          {children}
        </body>
      </html>
    </UserProvider>
  );
}


