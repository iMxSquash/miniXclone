import Head from "next/head";
import "./globals.css";
import Navbar from "./components/container/navbar";
import { UserProvider } from "./context/UserContext";


export const metadata = {
  title: "Z. C'est ce qu'il se passe /Z",
  description: "Des dernières actualités et des divertissements aux sports et à la politique, accédez à tous les commentaires en direct pour ne rien manquer.",
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
        <body>
          <main className="flex max-w-4xl mx-auto border-r border-border-dark">
            <Navbar />
            {children}
          </main>
        </body>
      </html>
    </UserProvider>
  );
}


