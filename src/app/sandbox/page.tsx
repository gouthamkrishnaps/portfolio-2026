"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GitCommit, 
  GitBranch, 
  GitMerge, 
  GitPullRequest, 
  Terminal as TerminalIcon, 
  RefreshCw, 
  Users, 
  Info, 
  Plus, 
  Check, 
  ArrowLeft, 
  FileCode, 
  Code,
  Flame,
  AlertTriangle,
  Play,
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import { useGitGraph, Commit, Branch, LogEntry } from "./useGitGraph";

export default function SandboxPage() {
  const {
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
  } = useGitGraph();

  const [cmdInput, setCmdInput] = useState("");
  const [newBranchName, setNewBranchName] = useState("");
  const [showNewBranchModal, setShowNewBranchModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"canvas" | "terminal" | "inspector">("canvas");
  
  // Terminal commands history and suggestions
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const activeBranchObj = state.branches.find((b) => b.name === state.activeBranch);
  const selectedCommit = state.commits.find((c) => c.id === state.selectedCommitId);

  // Toggle system cursor visibility by modifying document class
  useEffect(() => {
    document.documentElement.classList.add("route-sandbox");
    return () => {
      document.documentElement.classList.remove("route-sandbox");
    };
  }, []);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [state.logs]);

  // Center canvas on load
  useEffect(() => {
    if (canvasContainerRef.current) {
      canvasContainerRef.current.scrollLeft = canvasContainerRef.current.scrollWidth / 2 - canvasContainerRef.current.clientWidth / 2;
    }
  }, []);

  // Simple unstaged files representation
  const UNSTAGED_FILES = [
    { name: "src/components/Preloader.tsx", lines: 25 },
    { name: "src/components/Navbar.tsx", lines: 182 },
    { name: "README.md", lines: 84 }
  ];

  // Git CLI command handler
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;

    const cmd = cmdInput.trim();
    runGitCLI(cmd);
    setCmdInput("");
    setSuggestions([]);
  };

  const runGitCLI = (cmdText: string) => {
    const parts = cmdText.split(/\s+/);
    if (parts[0] !== "git") {
      addTerminalLog("error", `Command must start with 'git'. Try 'git help'`);
      return;
    }

    const subCommand = parts[1];

    if (!subCommand || subCommand === "help") {
      addTerminalLog("info", "Available Git Commands:");
      addTerminalLog("info", "  git commit -m \"message\"    Create a new commit");
      addTerminalLog("info", "  git branch <name>          Create a new branch");
      addTerminalLog("info", "  git checkout <branch>      Switch branches");
      addTerminalLog("info", "  git merge <branch>         Merge branch into active branch");
      addTerminalLog("info", "  git rebase <branch>        Rebase active branch onto target");
      addTerminalLog("info", "  git reset --hard <hash>    Reset active branch HEAD to hash");
      addTerminalLog("info", "  git status                 Show working tree status");
      addTerminalLog("info", "  git log                    Display commit history list");
      addTerminalLog("info", "  git clean                  Reset entire sandbox state");
      return;
    }

    switch (subCommand) {
      case "commit": {
        // Extract message inside quotes
        const match = cmdText.match(/-m\s+["'](.+?)["']/);
        const msg = match ? match[1] : "chore: local update";
        runCommit(msg);
        break;
      }
      case "branch": {
        const name = parts[2];
        if (!name) {
          addTerminalLog("info", `Active branches: ${state.branches.map((b) => b.name).join(", ")}`);
        } else {
          runBranch(name);
        }
        break;
      }
      case "checkout": {
        const name = parts[2];
        if (!name) {
          addTerminalLog("error", "Error: checkout requires a branch name or commit hash.");
        } else {
          runCheckout(name);
        }
        break;
      }
      case "merge": {
        const name = parts[2];
        if (!name) {
          addTerminalLog("error", "Error: merge requires a source branch name.");
        } else {
          runMerge(name);
        }
        break;
      }
      case "rebase": {
        const name = parts[2];
        if (!name) {
          addTerminalLog("error", "Error: rebase requires a target branch name.");
        } else {
          runRebase(name);
        }
        break;
      }
      case "reset": {
        const isHard = parts[2] === "--hard";
        const target = isHard ? parts[3] : parts[2];
        if (!target) {
          addTerminalLog("error", "Error: reset requires a commit hash.");
        } else {
          runResetHard(target);
        }
        break;
      }
      case "status": {
        addTerminalLog("info", `On branch ${state.activeBranch}`);
        if (state.stagingArea.length === 0) {
          addTerminalLog("info", "No changes staged for commit (use file list to stage files).");
        } else {
          addTerminalLog("success", "Changes to be committed:");
          state.stagingArea.forEach((f) => addTerminalLog("success", `  staged:   ${f}`));
        }
        break;
      }
      case "log": {
        addTerminalLog("info", "--- Commit History ---");
        // Sort commits by X position, newest first
        const sorted = [...state.commits].sort((a, b) => b.gridX - a.gridX);
        sorted.forEach((c) => {
          addTerminalLog("info", `${c.hash} - (${c.branch}) ${c.message} [${c.author}]`);
        });
        break;
      }
      case "clean": {
        clearWorkspace();
        addTerminalLog("success", "Sandbox workspace reset successfully.");
        break;
      }
      default:
        addTerminalLog("error", `git: '${subCommand}' is not a recognized command. Type 'git help'`);
    }
  };

  const addTerminalLog = (type: LogEntry["type"], text: string) => {
    addLog(type, text);
  };

  // Autocomplete hints
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setCmdInput(input);

    if (input.startsWith("git ")) {
      const remaining = input.substring(4);
      const commands = ["commit -m \"", "checkout ", "branch ", "merge ", "rebase ", "reset --hard ", "status", "log", "clean", "help"];
      const filtered = commands
        .filter((c) => c.startsWith(remaining) && c !== remaining)
        .map((c) => "git " + c);
      setSuggestions(filtered);
    } else if (input === "g" || input === "gi") {
      setSuggestions(["git commit -m \"", "git checkout ", "git branch ", "git merge ", "git rebase "]);
    } else {
      setSuggestions([]);
    }
  };

  // Branch creation callback
  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBranchName.trim()) {
      const success = runBranch(newBranchName.trim());
      if (success) {
        setNewBranchName("");
        setShowNewBranchModal(false);
      }
    }
  };

  // Compute layout coordinates for SVG Commit Graph
  const computeCoordinates = (commit: Commit) => {
    const paddingLeft = 80;
    const paddingRight = 100;
    const spacingX = 110;
    const spacingY = 70;
    const centerY = 240;

    const x = paddingLeft + commit.gridX * spacingX;
    const y = centerY + commit.gridY * spacingY;

    return { x, y };
  };

  // Dimensions of SVG canvas based on maximum commit X level
  const maxGridX = Math.max(...state.commits.map((c) => c.gridX), 4);
  const canvasWidth = 200 + maxGridX * 110 + 200;
  const canvasHeight = 480;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-outfit relative overflow-hidden select-none">
      
      {/* Grid background & Spotlights */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px] z-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[150px]" />
      </div>

      {/* HEADER NAVBAR */}
      <header className="relative z-20 border-b border-neutral-900 bg-neutral-950/60 backdrop-blur-md px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link 
            href="/"
            className="p-1.5 sm:p-2 rounded-full border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200 transition-all duration-300 shrink-0"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="flex flex-col min-w-0">
            <h1 className="text-xs sm:text-base md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400 truncate max-w-[120px] xs:max-w-[160px] sm:max-w-[320px] md:max-w-none">
              Zero-Latency Collaborative Canvas
            </h1>
            <p className="text-[9px] sm:text-xs text-neutral-500 font-medium truncate max-w-[120px] xs:max-w-[160px] sm:max-w-[320px] md:max-w-none">
              Interactive Git Visualizer & Merge Conflict Simulator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Simulated user activity */}
          <button
            onClick={triggerSimulatedAction}
            className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-300 transition-all duration-300 hover:text-cyan-400"
            title="Trigger Peer Committer"
          >
            <Users size={14} className="text-cyan-500" />
            <span className="hidden sm:inline">Trigger Peer Committer</span>
          </button>
          
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-1.5 sm:p-2 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200 transition-all duration-300"
            title="Show Guide"
          >
            <HelpCircle size={16} />
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE GRID */}
      <div className="flex-1 grid lg:grid-cols-12 overflow-hidden relative z-10">
        
        {/* LEFT COLUMN: THE VISUAL SVG CANVAS & TERMINAL */}
        <div className={`lg:col-span-8 flex flex-col overflow-hidden border-r border-neutral-900 ${
          activeMobileTab === "inspector" ? "hidden lg:flex" : "flex flex-1"
        }`}>
          
          {/* UPPER PART: THE SVG GRAPH CANVAS */}
          <div 
            ref={canvasContainerRef}
            className={`flex-1 overflow-auto bg-neutral-950 p-4 sm:p-6 flex items-center justify-start scrollbar-thin relative cursor-grab active:cursor-grabbing ${
              activeMobileTab === "canvas" ? "flex" : "hidden lg:flex"
            }`}
          >
            <div 
              className="relative sm:rounded-2xl sm:border sm:border-neutral-900 bg-neutral-950/40 backdrop-blur-sm"
              style={{ width: canvasWidth, height: canvasHeight }}
            >
              {/* Canvas Coordinates HUD Overlay */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-md px-2.5 py-1 bg-neutral-900/50 border border-neutral-800 text-[10px] text-neutral-500 font-mono tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                PEER-TO-PEER CANVAS ACTIVE
              </div>

              {/* Dynamic SVG Drawing Graph */}
              <svg 
                width={canvasWidth} 
                height={canvasHeight} 
                className="absolute inset-0 z-10 overflow-visible pointer-events-none"
              >
                {/* SVG Definitions for Glows/Markers */}
                <defs>
                  <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX="22"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#4b5563" />
                  </marker>
                  <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* GRAPH LINES (COMMIT PATHS) */}
                {state.commits.map((commit) => {
                  const currentPos = computeCoordinates(commit);
                  
                  return commit.parents.map((parentId) => {
                    const parent = state.commits.find((c) => c.id === parentId);
                    if (!parent) return null;
                    const parentPos = computeCoordinates(parent);

                    // Bezier points for organic curved paths
                    const controlX1 = parentPos.x + (currentPos.x - parentPos.x) / 1.7;
                    const controlY1 = parentPos.y;
                    const controlX2 = parentPos.x + (currentPos.x - parentPos.x) / 2.3;
                    const controlY2 = currentPos.y;

                    const pathData = `M ${parentPos.x} ${parentPos.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${currentPos.x} ${currentPos.y}`;

                    // Color coordinate path by the branch of target/source
                    const branchObj = state.branches.find((b) => b.name === commit.branch);
                    const lineColor = branchObj ? branchObj.color : "#4b5563";

                    return (
                      <g key={`${commit.id}-${parentId}`}>
                        {/* Animated background glow path */}
                        <motion.path
                          d={pathData}
                          fill="none"
                          stroke={lineColor}
                          strokeWidth={6}
                          strokeOpacity={0.12}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                        {/* Core vector line */}
                        <motion.path
                          d={pathData}
                          fill="none"
                          stroke={lineColor}
                          strokeWidth={2}
                          strokeOpacity={0.7}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                          markerEnd="url(#arrow)"
                        />
                      </g>
                    );
                  });
                })}

                {/* DYNAMIC SVG POINTER LABELS (BRANCH pointers GLIDING in Real-time) */}
                {state.branches.map((branch) => {
                  const targetCommit = state.commits.find((c) => c.id === branch.headCommitId);
                  if (!targetCommit) return null;
                  const pos = computeCoordinates(targetCommit);

                  const isActive = state.activeBranch === branch.name;

                  return (
                    <g key={branch.name}>
                      {/* Branch line guide marker */}
                      <motion.line
                        x1={pos.x}
                        y1={pos.y}
                        x2={pos.x}
                        y2={pos.y + 40}
                        stroke={branch.color}
                        strokeWidth={1.5}
                        strokeDasharray="3 3"
                        animate={{ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y + 40 }}
                        transition={{ type: "spring", stiffness: 120, damping: 18 }}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* INTERACTIVE NODES (Rendered as HTML overlay inside absolute divs for easy clicking & Framer Motion drag effects) */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                
                {/* COMMIT NODES */}
                {state.commits.map((commit) => {
                  const pos = computeCoordinates(commit);
                  const isSelected = state.selectedCommitId === commit.id;
                  const isHead = state.branches.some(
                    (b) => b.name === state.activeBranch && b.headCommitId === commit.id
                  );
                  const commitBranchObj = state.branches.find((b) => b.name === commit.branch);
                  const nodeColor = commitBranchObj ? commitBranchObj.color : "#4b5563";

                  return (
                    <motion.div
                      key={commit.id}
                      className="absolute pointer-events-auto cursor-pointer"
                      style={{ 
                        left: pos.x - 20, 
                        top: pos.y - 20, 
                        width: 40, 
                        height: 40 
                      }}
                      animate={{ left: pos.x - 20, top: pos.y - 20 }}
                      transition={{ type: "spring", stiffness: 120, damping: 18 }}
                      onClick={() => selectCommit(commit.id)}
                    >
                      <div className="w-full h-full flex items-center justify-center relative group">
                        
                        {/* Hover card info popover */}
                        <div className="absolute bottom-11 scale-0 group-hover:scale-100 origin-bottom bg-neutral-900 border border-neutral-800 text-[10px] py-1.5 px-2.5 rounded-lg w-44 z-50 transition-all shadow-xl pointer-events-none font-mono flex flex-col gap-0.5 leading-snug">
                          <span className="font-semibold text-cyan-400 truncate">{commit.hash}</span>
                          <span className="text-neutral-300 font-semibold truncate">{commit.message}</span>
                          <span className="text-neutral-500 font-medium truncate">By: {commit.author}</span>
                        </div>

                        {/* Node glow wrapper if selected */}
                        {isSelected && (
                          <motion.div 
                            layoutId="nodeSelectGlow"
                            className="absolute -inset-2.5 rounded-full filter blur-md"
                            style={{ backgroundColor: `${nodeColor}25` }}
                            transition={{ type: "spring", stiffness: 150, damping: 20 }}
                          />
                        )}

                        {/* Selected outline */}
                        {isSelected && (
                          <motion.div 
                            layoutId="nodeSelectRing"
                            className="absolute -inset-1.5 rounded-full border-2 animate-pulse"
                            style={{ borderColor: nodeColor }}
                            transition={{ type: "spring", stiffness: 150, damping: 20 }}
                          />
                        )}

                        {/* HEAD marker inner glow */}
                        {isHead && (
                          <div className="absolute inset-0 rounded-full border border-white/60 animate-ping opacity-25" />
                        )}

                        {/* Real commit node */}
                        <div 
                          className={`w-6 h-6 rounded-full border-3 flex items-center justify-center bg-neutral-950 transition-all group-hover:scale-125 duration-300 ${
                            isSelected ? "scale-110" : ""
                          }`}
                          style={{ borderColor: nodeColor }}
                        >
                          {/* Inner dot */}
                          <div 
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                              isHead ? "scale-100" : "scale-75"
                            }`}
                            style={{ backgroundColor: nodeColor }}
                          />
                        </div>

                        {/* Commit hash helper text */}
                        <div className="absolute -bottom-5 text-[9px] font-semibold font-mono text-neutral-500 group-hover:text-neutral-300 transition-colors">
                          {commit.hash}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* DYNAMIC BRANCH HEAD LABELS (Click-to-checkout, drag-and-drop support) */}
                {state.branches.map((branch) => {
                  const targetCommit = state.commits.find((c) => c.id === branch.headCommitId);
                  if (!targetCommit) return null;
                  const pos = computeCoordinates(targetCommit);
                  const isActive = state.activeBranch === branch.name;

                  return (
                    <motion.div
                      key={branch.name}
                      className="absolute pointer-events-auto cursor-grab active:cursor-grabbing"
                      style={{ 
                        left: pos.x - 50, 
                        top: pos.y + 35, 
                        width: 100, 
                        height: 28 
                      }}
                      animate={{ left: pos.x - 50, top: pos.y + 35 }}
                      transition={{ type: "spring", stiffness: 120, damping: 18 }}
                      drag
                      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // Returns back if not reset
                      onDragEnd={(e, info) => {
                        // Find if dropped over any commit node
                        const dropX = pos.x + info.offset.x;
                        const dropY = pos.y + info.offset.y + 35;
                        
                        // Find closest commit
                        let closestCommit: Commit | null = null;
                        let minDistance = 60; // Max snap radius

                        state.commits.forEach((commit) => {
                          const cPos = computeCoordinates(commit);
                          const dist = Math.sqrt(Math.pow(dropX - cPos.x, 2) + Math.pow(dropY - cPos.y, 2));
                          if (dist < minDistance) {
                            minDistance = dist;
                            closestCommit = commit;
                          }
                        });

                        if (closestCommit && (closestCommit as Commit).id !== branch.headCommitId) {
                          // Perform reset head!
                          runResetHard((closestCommit as Commit).id);
                        }
                      }}
                    >
                      <div 
                        onClick={() => runCheckout(branch.name)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide shadow-lg border transition-all duration-300 ${
                          isActive 
                            ? "bg-neutral-900 border-white/20 text-white ring-2 ring-white/10" 
                            : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                        }`}
                      >
                        <div 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: branch.color }}
                        />
                        <span className="truncate max-w-[65px] font-mono">{branch.name}</span>
                        {isActive && <Check size={8} className="text-cyan-400 shrink-0" />}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* LOWER PART: THE COMMAND LINE TERMINAL */}
          <div className={`border-t border-neutral-900 bg-neutral-950 flex flex-col font-mono relative ${
            activeMobileTab === "terminal" ? "flex-1 h-full animate-fadeIn" : "h-60 hidden lg:flex"
          }`}>
            <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-900 bg-neutral-950/80">
              <div className="flex items-center gap-2">
                <TerminalIcon size={12} className="text-cyan-400" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                  Interactive Terminal
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-neutral-500 font-sans">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800">Tab</kbd> Autocomplete
                </span>
                <span>Type <span className="text-cyan-400 font-mono font-semibold">git help</span> for assistance</span>
              </div>
            </div>

            {/* Terminal output area */}
            <div className="flex-1 overflow-y-auto p-4 text-xs space-y-1.5 scrollbar-thin">
              {state.logs.map((log, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-neutral-600 select-none text-[10px] mt-0.5">{log.timestamp}</span>
                  {log.type === "command" && (
                    <span className="text-neutral-400 flex gap-1">
                      <span className="text-cyan-400 select-none">$</span> {log.text}
                    </span>
                  )}
                  {log.type === "success" && (
                    <span className="text-emerald-400">{log.text}</span>
                  )}
                  {log.type === "error" && (
                    <span className="text-rose-400 font-semibold">{log.text}</span>
                  )}
                  {log.type === "info" && (
                    <span className="text-neutral-400 whitespace-pre-wrap">{log.text}</span>
                  )}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Command input & Autocomplete suggestion bar */}
            <form onSubmit={handleCommandSubmit} className="relative border-t border-neutral-900">
              {/* suggestions list */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 right-0 bg-neutral-900 border-t border-neutral-800 p-2 flex flex-wrap gap-2 z-30"
                  >
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          setCmdInput(suggestion);
                          setSuggestions([]);
                        }}
                        className="text-[10px] px-2 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-cyan-500/30 transition-all font-mono"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center bg-neutral-950 px-4 py-2.5">
                <span className="text-cyan-400 font-bold select-none mr-2">$</span>
                <input
                  type="text"
                  value={cmdInput}
                  onChange={handleInputChange}
                  placeholder="git commit -m &quot;feat: auth hook&quot; or git checkout main..."
                  className="flex-1 bg-transparent text-neutral-100 border-none outline-none focus:ring-0 placeholder-neutral-600 text-xs font-mono"
                />
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: WORKSPACE INSPECTOR & ACTIONS PANEL */}
        <div className={`lg:col-span-4 flex flex-col bg-neutral-950/40 backdrop-blur-md overflow-hidden select-text ${
          activeMobileTab === "inspector" ? "flex flex-1" : "hidden lg:flex"
        }`}>
          
          {/* REGION 1: STAGING AREA & WORKSPACE METRICS */}
          <div className="p-5 border-b border-neutral-900 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <FileCode size={14} className="text-indigo-400" />
                Working Directory
              </span>
              <span className="text-[10px] text-neutral-500 font-semibold font-mono bg-neutral-900 px-2 py-0.5 rounded-md border border-neutral-800">
                Staged: {state.stagingArea.length} / {UNSTAGED_FILES.length}
              </span>
            </div>

            {/* Unstaged / Staged list */}
            <div className="space-y-2">
              {UNSTAGED_FILES.map((file) => {
                const isStaged = state.stagingArea.includes(file.name);
                return (
                  <div 
                    key={file.name}
                    onClick={() => stageFile(file.name)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all duration-300 hover:-translate-y-px ${
                      isStaged
                        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 hover:border-emerald-500/40"
                        : "bg-neutral-900/40 border-neutral-800/80 text-neutral-300 hover:border-neutral-700/80 hover:bg-neutral-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${isStaged ? "bg-emerald-500/10" : "bg-neutral-950 border border-neutral-800"}`}>
                        <Code size={12} className={isStaged ? "text-emerald-400" : "text-neutral-500"} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold font-mono truncate max-w-[170px]">{file.name.split("/").pop()}</span>
                        <span className="text-[9px] text-neutral-500 font-medium">{file.name}</span>
                      </div>
                    </div>
                    
                    <button 
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md border tracking-wider uppercase transition-colors ${
                        isStaged 
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                    >
                      {isStaged ? "Staged" : "Stage"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions Commit Row */}
            <div className="flex gap-2">
              <button
                onClick={() => runCommit("feat: update staged components")}
                disabled={state.stagingArea.length === 0}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                <GitCommit size={14} />
                Commit Staged
              </button>
              
              <button
                onClick={() => setShowNewBranchModal(true)}
                className="py-2 px-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-850 hover:border-neutral-700 text-neutral-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                title="Create Branch"
              >
                <Plus size={14} />
                Branch
              </button>
            </div>
          </div>

          {/* REGION 2: BRANCH MERGING AND REBASING CONTROLS */}
          <div className="p-5 border-b border-neutral-900 flex flex-col gap-3.5">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <GitPullRequest size={14} className="text-cyan-400" />
              Branch Operations
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] text-neutral-500 font-bold font-sans">MERGE INTO {state.activeBranch.toUpperCase()}</span>
                <div className="flex flex-col gap-1">
                  {state.branches
                    .filter((b) => b.name !== state.activeBranch)
                    .map((b) => (
                      <button
                        key={b.name}
                        onClick={() => runMerge(b.name)}
                        className="py-1.5 px-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-left truncate flex items-center gap-1.5 text-neutral-300 hover:text-cyan-400 transition-colors"
                      >
                        <GitMerge size={10} className="text-neutral-500 shrink-0" />
                        {b.name}
                      </button>
                    ))}
                  {state.branches.length <= 1 && (
                    <span className="text-[10px] text-neutral-600 italic">No other branches</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] text-neutral-500 font-bold font-sans">REBASE {state.activeBranch.toUpperCase()} ONTO</span>
                <div className="flex flex-col gap-1">
                  {state.branches
                    .filter((b) => b.name !== state.activeBranch)
                    .map((b) => (
                      <button
                        key={b.name}
                        onClick={() => runRebase(b.name)}
                        className="py-1.5 px-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-left truncate flex items-center gap-1.5 text-neutral-300 hover:text-indigo-400 transition-colors"
                      >
                        <RefreshCw size={10} className="text-neutral-500 shrink-0" />
                        {b.name}
                      </button>
                    ))}
                  {state.branches.length <= 1 && (
                    <span className="text-[10px] text-neutral-600 italic">No other branches</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* REGION 3: SELECTED COMMIT DETAILS PANEL */}
          <div className="flex-1 p-5 flex flex-col justify-between overflow-y-auto scrollbar-thin">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Info size={14} className="text-purple-400" />
                Commit Inspector
              </span>

              {selectedCommit ? (
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-4 space-y-3 font-mono">
                  <div className="flex items-center justify-between border-b border-neutral-850 pb-2">
                    <span className="text-xs text-neutral-500 font-bold">COMMIT DETAILS</span>
                    <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">
                      {selectedCommit.hash}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-neutral-500 block text-[10px] font-sans font-bold">MESSAGE</span>
                      <span className="text-neutral-200 font-semibold">{selectedCommit.message}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-neutral-500 block text-[10px] font-sans font-bold">AUTHOR</span>
                        <span className="text-neutral-300 font-medium truncate block">{selectedCommit.author}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[10px] font-sans font-bold">TIMESTAMP</span>
                        <span className="text-neutral-300 font-medium text-[11px]">{selectedCommit.timestamp}</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-neutral-500 block text-[10px] font-sans font-bold">BRANCH</span>
                      <span 
                        className="font-bold inline-block px-2 py-0.5 rounded text-[10px] mt-0.5 border"
                        style={{ 
                          borderColor: `${state.branches.find((b) => b.name === selectedCommit.branch)?.color}40`,
                          color: state.branches.find((b) => b.name === selectedCommit.branch)?.color,
                          backgroundColor: `${state.branches.find((b) => b.name === selectedCommit.branch)?.color}08`
                        }}
                      >
                        {selectedCommit.branch}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-neutral-850">
                      <span className="text-neutral-500 block text-[10px] font-sans font-bold mb-1">CHANGED FILES</span>
                      <div className="space-y-1">
                        {selectedCommit.changedFiles.map((f) => (
                          <div key={f} className="flex items-center gap-1.5 text-neutral-400 text-[10px]">
                            <FileCode size={10} className="text-neutral-600" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/10">
                  <GitCommit size={28} className="text-neutral-700 animate-pulse mb-2" />
                  <span className="text-xs text-neutral-500 font-medium font-sans">Click on any commit node in the graph tree to inspect details.</span>
                </div>
              )}
            </div>

            <div className="pt-5 mt-5 border-t border-neutral-900">
              <button
                onClick={clearWorkspace}
                className="w-full py-2 px-3 border border-dashed border-neutral-850 text-neutral-500 hover:text-rose-400 hover:border-rose-500/40 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 bg-neutral-950/20"
              >
                Reset Sandbox Repository
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MERGE CONFLICT RESOLUTION MODAL OVERLAY */}
      <AnimatePresence>
        {conflict && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-5"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-neutral-950 border border-neutral-800 w-full max-w-3xl rounded-[24px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              {/* Modal header */}
              <div className="px-6 py-4 border-b border-neutral-900 bg-neutral-900/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-rose-500" size={18} />
                  <div>
                    <h3 className="font-bold text-sm text-white">Merge Conflict detected</h3>
                    <p className="text-[11px] text-neutral-500">File: {conflict.file}</p>
                  </div>
                </div>
                <div className="text-[10px] font-mono bg-rose-950/40 border border-rose-800/30 text-rose-400 px-2 py-0.5 rounded">
                  {conflict.currentBranch} ⟷ {conflict.mergingBranch}
                </div>
              </div>

              {/* Conflict Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Both branches modified <span className="font-mono text-white bg-neutral-900 px-1 py-0.5 rounded border border-neutral-850">Preloader.tsx</span>. Choose which implementation to accept to resolve the conflict.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Left Side: Current Branch */}
                  <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/20 flex flex-col">
                    <div className="px-4 py-2 border-b border-neutral-850 bg-neutral-900/50 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-cyan-400 tracking-wider">CURRENT CHANGES (HEAD)</span>
                      <span className="text-[9px] font-mono text-neutral-500">branch: {conflict.currentBranch}</span>
                    </div>
                    <pre className="flex-1 p-4 overflow-x-auto text-[11px] font-mono text-neutral-300 leading-normal scrollbar-thin max-h-48">
                      <code>{conflict.currentContent}</code>
                    </pre>
                    <button
                      onClick={() => resolveConflict(conflict.currentContent)}
                      className="m-3 py-2 px-3 bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/20 text-cyan-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Accept Current Changes
                    </button>
                  </div>

                  {/* Right Side: Incoming Branch */}
                  <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/20 flex flex-col">
                    <div className="px-4 py-2 border-b border-neutral-850 bg-neutral-900/50 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-400 tracking-wider">INCOMING CHANGES</span>
                      <span className="text-[9px] font-mono text-neutral-500">branch: {conflict.mergingBranch}</span>
                    </div>
                    <pre className="flex-1 p-4 overflow-x-auto text-[11px] font-mono text-neutral-300 leading-normal scrollbar-thin max-h-48">
                      <code>{conflict.incomingContent}</code>
                    </pre>
                    <button
                      onClick={() => resolveConflict(conflict.incomingContent)}
                      className="m-3 py-2 px-3 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 text-indigo-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Accept Incoming Changes
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE BRANCH POPUP MODAL */}
      <AnimatePresence>
        {showNewBranchModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-5"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-neutral-950 border border-neutral-800 w-full max-w-sm rounded-[24px] overflow-hidden shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <GitBranch size={16} className="text-cyan-400" />
                  Create New Branch
                </h3>
                <button 
                  onClick={() => setShowNewBranchModal(false)}
                  className="text-neutral-500 hover:text-neutral-200 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateBranch} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase">BRANCH NAME</label>
                  <input
                    type="text"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    placeholder="e.g. feature/auth-api"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-neutral-100 placeholder-neutral-600 outline-none focus:border-cyan-500 transition-colors font-mono"
                    autoFocus
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewBranchModal(false)}
                    className="flex-1 py-2 px-3 border border-neutral-850 text-neutral-400 hover:text-neutral-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-400 hover:to-indigo-500 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HELP GUIDE POPUP MODAL */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-5"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-neutral-950 border border-neutral-800 w-full max-w-md rounded-[24px] overflow-hidden shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <HelpCircle size={16} className="text-indigo-400" />
                  Workspace Guide & Info
                </h3>
                <button 
                  onClick={() => setShowHelpModal(false)}
                  className="text-neutral-500 hover:text-neutral-200 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-neutral-400 leading-relaxed font-sans">
                <p>
                  Welcome to the **Git Visualizer Sandbox**. This tool simulates real-world git repository topologies and collaborative conflicts.
                </p>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-neutral-200 uppercase tracking-wider block">KEY INTERACTIONS:</span>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      <strong className="text-neutral-200">Stage & Commit:</strong> Click files in the "Working Directory" panel to stage, then hit **Commit Staged** (or type <span className="font-mono text-cyan-400">git commit -m &quot;msg&quot;</span> in CLI).
                    </li>
                    <li>
                      <strong className="text-neutral-200">Switch Branches:</strong> Click on any branch pill floating below the nodes, or type <span className="font-mono text-cyan-400">git checkout &lt;branch&gt;</span>.
                    </li>
                    <li>
                      <strong className="text-neutral-200">Rebase / Merge:</strong> Merge or Rebase using side action buttons, or through terminal commands.
                    </li>
                    <li>
                      <strong className="text-neutral-200">Drag & Drop Reset:</strong> Click and drag a branch label and drop it directly onto any commit node to perform a <span className="font-mono text-rose-400">git reset --hard</span>.
                    </li>
                    <li>
                      <strong className="text-neutral-200">Collaborator Simulator:</strong> Trigger peer committer events to simulate colleagues committing and pushing, creating merges or conflicts.
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-neutral-900 border border-neutral-850 rounded-xl flex items-start gap-2">
                  <Users size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-neutral-500 leading-snug">
                    <strong className="text-neutral-300 block mb-0.5">Real-time sync:</strong> Open this page in two browser tabs side-by-side. Every commit, checkout, rebase, and reset will replicate immediately.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full py-2 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Close Guide
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING ACTION TOASTS (COLLABORATION INDICATORS) */}
      <div className="fixed top-20 right-6 z-50 flex flex-col gap-2 pointer-events-none w-72">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="p-3.5 bg-neutral-900/90 border border-neutral-800/80 rounded-2xl shadow-xl flex gap-3 pointer-events-auto backdrop-blur-md"
            >
              <div className="w-8 h-8 rounded-full bg-cyan-950/50 border border-cyan-800/30 flex items-center justify-center text-cyan-400 font-mono text-[10px] font-black uppercase shrink-0">
                {t.user.substring(0, 2)}
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <span className="text-[10px] font-bold text-neutral-400">{t.user}</span>
                <span className="text-[11px] text-neutral-200 truncate mt-0.5 leading-snug">{t.message}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* MOBILE BOTTOM TAB BAR */}
      <div className="sticky bottom-0 left-0 right-0 z-30 bg-neutral-950 border-t border-neutral-900 px-2 py-3 flex lg:hidden justify-around text-xs font-semibold select-none pb-[calc(12px+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.5)]">
        <button
          onClick={() => setActiveMobileTab("canvas")}
          className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all duration-300 ${
            activeMobileTab === "canvas"
              ? "text-cyan-400 bg-cyan-950/20"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <GitCommit size={16} />
          <span>Graph</span>
        </button>

        <button
          onClick={() => setActiveMobileTab("terminal")}
          className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all duration-300 ${
            activeMobileTab === "terminal"
              ? "text-cyan-400 bg-cyan-950/20"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <TerminalIcon size={16} />
          <span>Terminal</span>
        </button>

        <button
          onClick={() => setActiveMobileTab("inspector")}
          className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all duration-300 ${
            activeMobileTab === "inspector"
              ? "text-purple-400 bg-purple-950/20"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <Info size={16} />
          <span>Inspector</span>
        </button>
      </div>

    </main>
  );
}
