"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface Commit {
  id: string; // e.g. "c1"
  hash: string; // e.g. "a3b8cd2"
  message: string;
  parents: string[]; // List of parent IDs
  branch: string; // Branch under which commit was made
  author: string;
  timestamp: string;
  gridX: number; // Column index (chronological order of commits)
  gridY: number; // Lane index (vertical positioning)
  changedFiles: string[];
}

export interface Branch {
  name: string;
  headCommitId: string;
  color: string; // CSS class color
  lane: number; // Vertical lane position (0 for main, 1, -1, 2, -2...)
}

export interface MergeConflict {
  currentBranch: string;
  mergingBranch: string;
  incomingCommitId: string;
  file: string;
  currentContent: string;
  incomingContent: string;
  commonAncestorId: string;
}

export interface LogEntry {
  type: "command" | "success" | "error" | "info";
  text: string;
  timestamp: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  user: string;
  type: "commit" | "checkout" | "branch" | "merge" | "rebase" | "conflict";
}

const BRANCH_COLORS = [
  "#8b5cf6", // Purple (main/master)
  "#06b6d4", // Cyan (develop/feature)
  "#10b981", // Emerald (feature-2)
  "#f59e0b", // Amber (feature-3)
  "#ef4444", // Red (hotfix)
  "#ec4899", // Pink
];

// Default initial state
const createInitialState = () => {
  const initialCommit: Commit = {
    id: "c1",
    hash: "5d6a1fc",
    message: "Initial commit",
    parents: [],
    branch: "main",
    author: "Goutham (You)",
    timestamp: "10:14:02 PM",
    gridX: 0,
    gridY: 0,
    changedFiles: ["package.json", "src/app/page.tsx"],
  };

  const secondCommit: Commit = {
    id: "c2",
    hash: "9ba60a1",
    message: "feat: add next.js config and tailwind styles",
    parents: ["c1"],
    branch: "main",
    author: "Goutham (You)",
    timestamp: "10:35:19 PM",
    gridX: 1,
    gridY: 0,
    changedFiles: ["next.config.ts", "src/app/globals.css"],
  };

  const initialBranches: Branch[] = [
    {
      name: "main",
      headCommitId: "c2",
      color: BRANCH_COLORS[0],
      lane: 0,
    },
  ];

  return {
    commits: [initialCommit, secondCommit],
    branches: initialBranches,
    activeBranch: "main",
    selectedCommitId: "c2",
    stagingArea: [] as string[],
    logs: [
      {
        type: "info" as const,
        text: "Git repository initialized. Type 'git help' or click buttons to start.",
        timestamp: "11:20:00 PM",
      },
    ] as LogEntry[],
  };
};

export function useGitGraph() {
  const [state, setState] = useState(() => createInitialState());
  const [conflict, setConflict] = useState<MergeConflict | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Sync state using BroadcastChannel
  useEffect(() => {
    if (typeof window === "undefined") return;

    const channel = new BroadcastChannel("git-collab-canvas");
    channelRef.current = channel;

    channel.onmessage = (event) => {
      const { type, payload, user } = event.data;

      if (type === "SYNC_STATE") {
        setState(payload.state);
        if (payload.conflict) {
          setConflict(payload.conflict);
        } else {
          setConflict(null);
        }
        addToast(`Synced repository state from workspace`, user, "info" as any);
      } else if (type === "ACTION_BROADCAST") {
        const { action, newState, actionType, text } = payload;
        setState(newState);
        addToast(text, user, actionType);
      }
    };

    // Broadcast initial join to ask for state from existing tabs
    channel.postMessage({ type: "REQUEST_STATE", user: "New Peer" });

    // Answer requests for state
    const handleRequest = (e: MessageEvent) => {
      if (e.data.type === "REQUEST_STATE" && channelRef.current) {
        channelRef.current.postMessage({
          type: "SYNC_STATE",
          payload: { state, conflict },
          user: "Goutham (Peer)",
        });
      }
    };
    channel.addEventListener("message", handleRequest);

    return () => {
      channel.removeEventListener("message", handleRequest);
      channel.close();
    };
  }, [state, conflict]);

  const broadcastState = useCallback((newState: typeof state, actionText: string, actionType: ToastMessage["type"]) => {
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: "ACTION_BROADCAST",
        payload: {
          newState,
          text: actionText,
          actionType,
        },
        user: "Goutham (Peer)",
      });
    }
  }, []);

  const addToast = useCallback((message: string, user: string, type: ToastMessage["type"]) => {
    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(7),
      message,
      user,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  }, []);

  const addLog = useCallback((type: LogEntry["type"], text: string) => {
    setState((prev) => ({
      ...prev,
      logs: [
        ...prev.logs,
        {
          type,
          text,
          timestamp: new Date().toLocaleTimeString(),
        },
      ].slice(-50), // limit log history to 50 entries
    }));
  }, []);

  // Check if a branch name is valid and unique
  const isValidBranchName = useCallback(
    (name: string) => {
      if (!name || name.trim() === "") return false;
      return !state.branches.some((b) => b.name === name);
    },
    [state.branches]
  );

  // Get common ancestor of two commits
  const findCommonAncestor = useCallback(
    (commitIdA: string, commitIdB: string): string => {
      const getAncestors = (id: string, visited = new Set<string>()): Set<string> => {
        visited.add(id);
        const commit = state.commits.find((c) => c.id === id);
        if (commit) {
          commit.parents.forEach((parentId) => {
            getAncestors(parentId, visited);
          });
        }
        return visited;
      };

      const ancestorsA = getAncestors(commitIdA);
      
      // Find first commit in B's history that is in A's history
      const findFirstCommon = (id: string): string => {
        if (ancestorsA.has(id)) return id;
        const commit = state.commits.find((c) => c.id === id);
        if (commit && commit.parents.length > 0) {
          // Look down first parent
          return findFirstCommon(commit.parents[0]);
        }
        return "c1"; // Fallback to root
      };

      return findFirstCommon(commitIdB);
    },
    [state.commits]
  );

  // Commit operation
  const runCommit = useCallback(
    (message: string, author = "Goutham (You)", customParents?: string[]) => {
      if (conflict) {
        addLog("error", "Resolve merge conflicts before committing.");
        return false;
      }

      const activeBranchObj = state.branches.find((b) => b.name === state.activeBranch);
      if (!activeBranchObj) return false;

      const parentId = activeBranchObj.headCommitId;
      const parents = customParents || [parentId];

      // Assign sequence index (X coordinate)
      const nextX = Math.max(...state.commits.map((c) => c.gridX)) + 1;
      const newCommitId = `c_${Math.random().toString(36).substring(2, 6)}`;
      const hash = Math.random().toString(16).substring(2, 9);

      const newCommit: Commit = {
        id: newCommitId,
        hash,
        message: message || `chore: update code`,
        parents,
        branch: state.activeBranch,
        author,
        timestamp: new Date().toLocaleTimeString(),
        gridX: nextX,
        gridY: activeBranchObj.lane,
        changedFiles: state.stagingArea.length > 0 ? [...state.stagingArea] : ["src/components/Canvas.tsx"],
      };

      const updatedBranches = state.branches.map((b) =>
        b.name === state.activeBranch ? { ...b, headCommitId: newCommitId } : b
      );

      const nextState = {
        ...state,
        commits: [...state.commits, newCommit],
        branches: updatedBranches,
        selectedCommitId: newCommitId,
        stagingArea: [],
      };

      setState(nextState);
      addLog("success", `[${state.activeBranch} ${hash}] ${newCommit.message}`);
      broadcastState(nextState, `${author} committed: "${newCommit.message}"`, "commit");
      return true;
    },
    [state, conflict, addLog, broadcastState]
  );

  // Create branch operation
  const runBranch = useCallback(
    (name: string) => {
      if (!isValidBranchName(name)) {
        addLog("error", `Branch name '${name}' already exists or is invalid.`);
        return false;
      }

      const activeBranchObj = state.branches.find((b) => b.name === state.activeBranch);
      if (!activeBranchObj) return false;

      // Assign vertical lane
      const currentLanes = state.branches.map((b) => b.lane);
      let nextLane = 1;
      while (currentLanes.includes(nextLane) || currentLanes.includes(-nextLane)) {
        nextLane = nextLane > 0 ? -nextLane : -nextLane + 1;
      }
      // Alternate positive/negative lanes for distribution
      const isEven = state.branches.length % 2 === 0;
      const finalLane = isEven ? nextLane : -nextLane;

      const newBranch: Branch = {
        name,
        headCommitId: activeBranchObj.headCommitId,
        color: BRANCH_COLORS[state.branches.length % BRANCH_COLORS.length],
        lane: finalLane,
      };

      const nextState = {
        ...state,
        branches: [...state.branches, newBranch],
      };

      setState(nextState);
      addLog("success", `Created branch '${name}' at ${activeBranchObj.headCommitId.substring(0, 7)}`);
      broadcastState(nextState, `Created branch '${name}'`, "branch");
      return true;
    },
    [state, isValidBranchName, addLog, broadcastState]
  );

  // Checkout operation
  const runCheckout = useCallback(
    (name: string) => {
      const branchExists = state.branches.some((b) => b.name === name);
      if (!branchExists) {
        // Try to find a commit with this hash to check out detached HEAD
        const commit = state.commits.find((c) => c.hash === name || c.id === name);
        if (commit) {
          addLog("info", `Note: checking out '${name}'. You are in 'detached HEAD' state.`);
          // For simplicity in UI, check out parent branch or stay on main
          setState((prev) => ({
            ...prev,
            selectedCommitId: commit.id,
          }));
          return true;
        }

        addLog("error", `error: pathspec '${name}' did not match any file(s) known to git.`);
        return false;
      }

      const selectedBranch = state.branches.find((b) => b.name === name)!;

      const nextState = {
        ...state,
        activeBranch: name,
        selectedCommitId: selectedBranch.headCommitId,
      };

      setState(nextState);
      addLog("info", `Switched to branch '${name}'`);
      broadcastState(nextState, `Switched to branch '${name}'`, "checkout");
      return true;
    },
    [state, addLog, broadcastState]
  );

  // Hard Reset branch HEAD to a specific commit ID
  const runResetHard = useCallback(
    (commitId: string) => {
      const commit = state.commits.find((c) => c.id === commitId || c.hash === commitId);
      if (!commit) {
        addLog("error", `error: commit '${commitId}' not found.`);
        return false;
      }

      const nextState = {
        ...state,
        branches: state.branches.map((b) =>
          b.name === state.activeBranch ? { ...b, headCommitId: commit.id } : b
        ),
        selectedCommitId: commit.id,
      };

      setState(nextState);
      addLog("success", `HEAD is now at ${commit.hash} ${commit.message}`);
      broadcastState(nextState, `Reset ${state.activeBranch} branch to ${commit.hash}`, "checkout");
      return true;
    },
    [state, addLog, broadcastState]
  );

  // Rebase operation
  const runRebase = useCallback(
    (targetBranchName: string) => {
      if (state.activeBranch === targetBranchName) {
        addLog("error", `Cannot rebase a branch onto itself.`);
        return false;
      }

      const targetBranch = state.branches.find((b) => b.name === targetBranchName);
      const activeBranchObj = state.branches.find((b) => b.name === state.activeBranch);
      if (!targetBranch || !activeBranchObj) {
        addLog("error", `Branch '${targetBranchName}' not found.`);
        return false;
      }

      const activeHeadId = activeBranchObj.headCommitId;
      const targetHeadId = targetBranch.headCommitId;

      // Find common ancestor
      const commonAncestorId = findCommonAncestor(activeHeadId, targetHeadId);

      if (commonAncestorId === activeHeadId) {
        addLog("info", `Current branch is already up-to-date with '${targetBranchName}'.`);
        return true;
      }

      // Collect commits on activeBranch since the common ancestor
      const commitsToReplay: Commit[] = [];
      let currId = activeHeadId;
      while (currId !== commonAncestorId && currId) {
        const commit = state.commits.find((c) => c.id === currId);
        if (!commit) break;
        commitsToReplay.unshift(commit); // Order from oldest to newest
        currId = commit.parents.length > 0 ? commit.parents[0] : "";
      }

      if (commitsToReplay.length === 0) {
        // Fast forward rebase
        const nextState = {
          ...state,
          branches: state.branches.map((b) =>
            b.name === state.activeBranch ? { ...b, headCommitId: targetHeadId } : b
          ),
          selectedCommitId: targetHeadId,
        };
        setState(nextState);
        addLog("success", `Fast-forwarded '${state.activeBranch}' to '${targetBranchName}'`);
        broadcastState(nextState, `Rebased ${state.activeBranch} onto ${targetBranchName}`, "rebase");
        return true;
      }

      // Replay commits one by one on top of targetHeadId
      let currentParentId = targetHeadId;
      const newCommits: Commit[] = [];
      let nextX = Math.max(...state.commits.map((c) => c.gridX)) + 1;

      for (const origCommit of commitsToReplay) {
        const replayedCommitId = `c_reb_${Math.random().toString(36).substring(2, 6)}`;
        const replayedHash = Math.random().toString(16).substring(2, 9);
        const replayedCommit: Commit = {
          ...origCommit,
          id: replayedCommitId,
          hash: replayedHash,
          parents: [currentParentId],
          gridX: nextX++,
          gridY: activeBranchObj.lane,
          timestamp: new Date().toLocaleTimeString(),
          message: `${origCommit.message} (rebased)`,
        };
        newCommits.push(replayedCommit);
        currentParentId = replayedCommitId;
      }

      // Add replayed commits and point active branch head to the last replayed commit
      const nextState = {
        ...state,
        commits: [...state.commits, ...newCommits],
        branches: state.branches.map((b) =>
          b.name === state.activeBranch ? { ...b, headCommitId: currentParentId } : b
        ),
        selectedCommitId: currentParentId,
      };

      setState(nextState);
      addLog("success", `Successfully rebased and updated refs/heads/${state.activeBranch}`);
      broadcastState(nextState, `Rebased ${state.activeBranch} onto ${targetBranchName}`, "rebase");
      return true;
    },
    [state, findCommonAncestor, addLog, broadcastState]
  );

  // Merge operation
  const runMerge = useCallback(
    (sourceBranchName: string) => {
      if (state.activeBranch === sourceBranchName) {
        addLog("error", `Cannot merge branch into itself.`);
        return false;
      }

      const sourceBranch = state.branches.find((b) => b.name === sourceBranchName);
      const activeBranchObj = state.branches.find((b) => b.name === state.activeBranch);

      if (!sourceBranch || !activeBranchObj) {
        addLog("error", `Branch '${sourceBranchName}' not found.`);
        return false;
      }

      const activeHeadId = activeBranchObj.headCommitId;
      const sourceHeadId = sourceBranch.headCommitId;

      if (activeHeadId === sourceHeadId) {
        addLog("info", `Already up-to-date.`);
        return true;
      }

      // Find common ancestor
      const commonAncestorId = findCommonAncestor(activeHeadId, sourceHeadId);

      // Fast forward check: is the active branch head an ancestor of the source branch head?
      if (commonAncestorId === activeHeadId) {
        // Fast-forward merge: just move active head pointer to source head pointer
        const nextState = {
          ...state,
          branches: state.branches.map((b) =>
            b.name === state.activeBranch ? { ...b, headCommitId: sourceHeadId } : b
          ),
          selectedCommitId: sourceHeadId,
        };
        setState(nextState);
        addLog("success", `Fast-forward merged branch '${sourceBranchName}' into '${state.activeBranch}'`);
        broadcastState(nextState, `Merged ${sourceBranchName} into ${state.activeBranch}`, "merge");
        return true;
      }

      // Divergent history merge conflict simulation!
      // If we have concurrent commits on both branches since common ancestor, raise conflict.
      const hasDivergedCommits = state.commits.some(
        (c) => c.parents.includes(commonAncestorId) && c.branch === sourceBranchName
      ) && state.commits.some(
        (c) => c.parents.includes(commonAncestorId) && c.branch === state.activeBranch
      );

      if (hasDivergedCommits) {
        // Trigger visual conflict
        const newConflict: MergeConflict = {
          currentBranch: state.activeBranch,
          mergingBranch: sourceBranchName,
          incomingCommitId: sourceHeadId,
          file: "src/components/Preloader.tsx",
          currentContent: `// Local changes in ${state.activeBranch}\nexport default function Preloader() {\n  return <div className="bg-brand-500 animate-spin text-cyan-400">Loading portfolio...</div>;\n}`,
          incomingContent: `// Incoming changes in ${sourceBranchName}\nexport default function Preloader() {\n  return <div className="bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center select-none font-black text-xl">Loading...</div>;\n}`,
          commonAncestorId,
        };

        setConflict(newConflict);
        addLog("info", "CONFLICT (content): Merge conflict in src/components/Preloader.tsx");
        addLog("error", "Automatic merge failed; fix conflicts and then commit the result.");
        addToast("Merge conflict detected!", "System", "conflict");
        return false;
      }

      // Standard non-conflicting merge (creates a merge commit with 2 parents)
      const nextX = Math.max(...state.commits.map((c) => c.gridX)) + 1;
      const mergeCommitId = `c_merge_${Math.random().toString(36).substring(2, 6)}`;
      const hash = Math.random().toString(16).substring(2, 9);

      const mergeCommit: Commit = {
        id: mergeCommitId,
        hash,
        message: `Merge branch '${sourceBranchName}' into ${state.activeBranch}`,
        parents: [activeHeadId, sourceHeadId],
        branch: state.activeBranch,
        author: "Goutham (You)",
        timestamp: new Date().toLocaleTimeString(),
        gridX: nextX,
        gridY: activeBranchObj.lane,
        changedFiles: ["src/components/Preloader.tsx"],
      };

      const nextState = {
        ...state,
        commits: [...state.commits, mergeCommit],
        branches: state.branches.map((b) =>
          b.name === state.activeBranch ? { ...b, headCommitId: mergeCommitId } : b
        ),
        selectedCommitId: mergeCommitId,
      };

      setState(nextState);
      addLog("success", `Merged branch '${sourceBranchName}' (Merge commit: ${hash})`);
      broadcastState(nextState, `Merged branch '${sourceBranchName}'`, "merge");
      return true;
    },
    [state, findCommonAncestor, addLog, broadcastState, addToast]
  );

  // Resolve Merge Conflict
  const resolveConflict = useCallback(
    (resolvedContent: string) => {
      if (!conflict) return;

      const activeBranchObj = state.branches.find((b) => b.name === state.activeBranch);
      if (!activeBranchObj) return;

      const activeHeadId = activeBranchObj.headCommitId;
      const nextX = Math.max(...state.commits.map((c) => c.gridX)) + 1;
      const mergeCommitId = `c_merge_${Math.random().toString(36).substring(2, 6)}`;
      const hash = Math.random().toString(16).substring(2, 9);

      const mergeCommit: Commit = {
        id: mergeCommitId,
        hash,
        message: `Merge branch '${conflict.mergingBranch}' into ${state.activeBranch} (Resolved Conflicts)`,
        parents: [activeHeadId, conflict.incomingCommitId],
        branch: state.activeBranch,
        author: "Goutham (You)",
        timestamp: new Date().toLocaleTimeString(),
        gridX: nextX,
        gridY: activeBranchObj.lane,
        changedFiles: [conflict.file],
      };

      const nextState = {
        ...state,
        commits: [...state.commits, mergeCommit],
        branches: state.branches.map((b) =>
          b.name === state.activeBranch ? { ...b, headCommitId: mergeCommitId } : b
        ),
        selectedCommitId: mergeCommitId,
      };

      setState(nextState);
      setConflict(null);
      addLog("success", `Resolved conflicts. Created merge commit ${hash}`);
      broadcastState(nextState, `Resolved conflict and merged ${conflict.mergingBranch}`, "merge");
    },
    [state, conflict, addLog, broadcastState]
  );

  // Staging logic (visual aid)
  const stageFile = useCallback((file: string) => {
    setState((prev) => {
      const alreadyStaged = prev.stagingArea.includes(file);
      const newStaging = alreadyStaged
        ? prev.stagingArea.filter((f) => f !== file)
        : [...prev.stagingArea, file];
      return {
        ...prev,
        stagingArea: newStaging,
      };
    });
  }, []);

  // Set selected commit
  const selectCommit = useCallback((commitId: string) => {
    setState((prev) => ({
      ...prev,
      selectedCommitId: commitId,
    }));
  }, []);

  // Clear workspace
  const clearWorkspace = useCallback(() => {
    const initialState = createInitialState();
    setState(initialState);
    setConflict(null);
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: "SYNC_STATE",
        payload: { state: initialState, conflict: null },
        user: "Goutham (Peer)",
      });
    }
  }, []);

  // Trigger Simulated Teammate Action
  const triggerSimulatedAction = useCallback(() => {
    const PEERS = ["Alice (AI Developer)", "Bob (AI Designer)", "Sophia (Tech Lead)"];
    const randomPeer = PEERS[Math.floor(Math.random() * PEERS.length)];
    
    // Pick a task
    const actions = ["commit_feature", "create_branch", "commit_bugfix"];
    const chosenAction = actions[Math.floor(Math.random() * actions.length)];

    setState((prev) => {
      // Find or create a remote branch
      const featureBranches = prev.branches.filter((b) => b.name !== "main" && b.name !== "develop");
      let targetBranchName = "feature/analytics-dashboard";

      let nextBranches = [...prev.branches];
      let nextCommits = [...prev.commits];
      let activeHeadId = "";

      if (chosenAction === "create_branch" || featureBranches.length === 0) {
        // Create new branch
        targetBranchName = `feature/collab-${Math.random().toString(36).substring(2, 6)}`;
        if (prev.branches.some((b) => b.name === targetBranchName)) return prev;

        const mainBranch = prev.branches.find((b) => b.name === "main") || prev.branches[0];
        const currentLanes = prev.branches.map((b) => b.lane);
        let nextLane = 1;
        while (currentLanes.includes(nextLane) || currentLanes.includes(-nextLane)) {
          nextLane = nextLane > 0 ? -nextLane : -nextLane + 1;
        }

        const newBranch: Branch = {
          name: targetBranchName,
          headCommitId: mainBranch.headCommitId,
          color: BRANCH_COLORS[prev.branches.length % BRANCH_COLORS.length],
          lane: nextLane,
        };
        nextBranches.push(newBranch);
        activeHeadId = mainBranch.headCommitId;
      } else {
        // Choose existing branch
        const randomBranch = featureBranches[Math.floor(Math.random() * featureBranches.length)];
        targetBranchName = randomBranch.name;
        activeHeadId = randomBranch.headCommitId;
      }

      const activeBranchObj = nextBranches.find((b) => b.name === targetBranchName)!;
      const nextX = Math.max(...nextCommits.map((c) => c.gridX)) + 1;
      const newCommitId = `c_sim_${Math.random().toString(36).substring(2, 6)}`;
      const hash = Math.random().toString(16).substring(2, 9);

      const messages = [
        "docs: update readme API description",
        "style: polish button active states",
        "fix: solve memory leak in custom hook",
        "feat: add drag dynamics for commit nodes",
        "refactor: simplify layout mapping logic",
      ];
      const message = messages[Math.floor(Math.random() * messages.length)];

      const newCommit: Commit = {
        id: newCommitId,
        hash,
        message,
        parents: [activeHeadId],
        branch: targetBranchName,
        author: randomPeer,
        timestamp: new Date().toLocaleTimeString(),
        gridX: nextX,
        gridY: activeBranchObj.lane,
        changedFiles: ["src/app/sandbox/page.tsx", "README.md"],
      };

      nextCommits.push(newCommit);
      nextBranches = nextBranches.map((b) =>
        b.name === targetBranchName ? { ...b, headCommitId: newCommitId } : b
      );

      const newState = {
        ...prev,
        commits: nextCommits,
        branches: nextBranches,
        logs: [
          ...prev.logs,
          {
            type: "info" as const,
            text: `[Remote Node Alert] ${randomPeer} committed on ${targetBranchName}: ${hash} - ${message}`,
            timestamp: new Date().toLocaleTimeString(),
          },
        ].slice(-50),
      };

      // Broadcast update to other tabs
      if (channelRef.current) {
        channelRef.current.postMessage({
          type: "ACTION_BROADCAST",
          payload: {
            newState,
            text: `${randomPeer} committed to '${targetBranchName}'`,
            actionType: "commit",
          },
          user: randomPeer,
        });
      }

      addToast(`${randomPeer} committed: "${message}"`, randomPeer, "commit");
      return newState;
    });
  }, [addToast]);

  return {
    state,
    conflict,
    toasts,
    runCommit,
    runBranch,
    runCheckout,
    runResetHard,
    runRebase,
    runMerge,
    resolveConflict,
    stageFile,
    selectCommit,
    clearWorkspace,
    triggerSimulatedAction,
    addLog,
  };
}
