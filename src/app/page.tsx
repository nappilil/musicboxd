import Header from "@/components/Header";

import seed from "../../seed.js";

// seed();

export default async function HomePage() {
  return (
    <div className="mx-auto flex min-h-screen flex-col bg-spotify-black text-spotify-green">
      <Header />
      <main className="flex grow flex-col items-center justify-center gap-y-4 text-spotify-green">
        <h1 className="text-4xl">
          <strong>Musicboxd</strong>
        </h1>
        <p className="text-spotify-white">An application built using Next.js 14 and MongoDB.</p>
      </main>
    </div>
  );
}
