import { useState } from "react";
import Home from "./pages/Home";
import Ranking from "./pages/Ranking";

export default function App() {
  const [page, setPage] = useState<"home" | "ranking">("home");

  return (
    <>
      {page === "home" ? (
        <Home onOpenRanking={() => setPage("ranking")} />
      ) : (
       <Ranking onBack={() => setPage("home")} />
      )}
    </>
  );
}