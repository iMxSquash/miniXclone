import Head from "next/head";
import "./globals.css";
import Navbar from "./components/container/navbar";
import { UserProvider } from "./context/UserContext";
import { ToastProvider } from './context/ToastContext';

export const metadata = {
  title: "Z. C'est ce qu'il se passe /Z",
  description: "Des dernières actualités et des divertissements aux sports et à la politique, accédez à tous les commentaires en direct pour ne rien manquer.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <ToastProvider>
          <UserProvider>
            <Head>
              <title>{metadata.title}</title>
              <meta name="description" content={metadata.description} />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex max-w-4xl mx-auto">
              <Navbar />
              <main className="w-full h-[100dvh] overflow-y-auto">
                {children}
              </main>
            </main>
          </UserProvider>
        </ToastProvider>
      </body>
    </html>
  );
}


