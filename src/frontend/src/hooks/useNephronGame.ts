import { NEPHRON_STAGES } from "@/data/nephronStages";
import type { ExplorationPhase } from "@/types/nephron";
import { useCallback, useState } from "react";

export interface NephronExplorerState {
  currentStageIndex: number;
  explorationPhase: ExplorationPhase;
  visitedStages: Set<number>;
  isTransitioning: boolean;
}

export interface NephronExplorerActions {
  goToStage: (index: number) => void;
  startExploring: () => void;
  returnToMap: () => void;
  goToWelcome: () => void;
  completeJourney: () => void;
}

const INITIAL_STATE: NephronExplorerState = {
  currentStageIndex: 0,
  explorationPhase: "welcome",
  visitedStages: new Set<number>(),
  isTransitioning: false,
};

export function useNephronGame(): NephronExplorerState &
  NephronExplorerActions {
  const [state, setState] = useState<NephronExplorerState>(INITIAL_STATE);

  const goToStage = useCallback((index: number) => {
    if (index < 0 || index >= NEPHRON_STAGES.length) return;
    setState((prev) => ({
      ...prev,
      currentStageIndex: index,
      explorationPhase: "exploring",
      isTransitioning: false,
    }));
  }, []);

  const startExploring = useCallback(() => {
    setState((prev) => ({
      ...prev,
      explorationPhase: "map",
      isTransitioning: false,
    }));
  }, []);

  const returnToMap = useCallback(() => {
    setState((prev) => ({
      ...prev,
      explorationPhase: "map",
      visitedStages: new Set([...prev.visitedStages, prev.currentStageIndex]),
      isTransitioning: false,
    }));
  }, []);

  const goToWelcome = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const completeJourney = useCallback(() => {
    setState((prev) => ({
      ...prev,
      explorationPhase: "done",
      visitedStages: new Set([...prev.visitedStages, prev.currentStageIndex]),
      isTransitioning: false,
    }));
  }, []);

  return {
    ...state,
    goToStage,
    startExploring,
    returnToMap,
    goToWelcome,
    completeJourney,
  };
}
