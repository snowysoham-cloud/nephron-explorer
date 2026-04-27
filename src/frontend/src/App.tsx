import { Layout } from "@/components/Layout";
import { useNephronGame } from "@/hooks/useNephronGame";
import { AdventureMapPage } from "@/pages/AdventureMapPage";
import { WelcomePage } from "@/pages/WelcomePage";

export default function App() {
  const game = useNephronGame();

  return (
    <Layout
      explorationPhase={game.explorationPhase}
      onBackToMap={game.returnToMap}
    >
      {game.explorationPhase === "welcome" && (
        <WelcomePage onEnter={game.startExploring} />
      )}
      {(game.explorationPhase === "map" ||
        game.explorationPhase === "exploring" ||
        game.explorationPhase === "done") && <AdventureMapPage game={game} />}
    </Layout>
  );
}
