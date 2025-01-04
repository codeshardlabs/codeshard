"use client";
import { useId } from "react";

export function FeaturesSectionDemo() {
  return (
    <div className="py-20">
      <h1 className="text-center text-2xl sm:text-4xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-8">
        Code with Confidence, Collaborate Seamlessly
      </h1>
      <div className="grid grid-cols-1  p-4 sm:grid-cols-2 md:grid-cols-3  gap-10 md:gap-2 max-w-7xl mx-auto">
        {grid.map((feature) => (
          <div
            key={feature.title}
            className="relative bg-gradient-to-b from-neutral-900 dark:from-gray-300 hover:from-neutral-800 border-1 border-gray-300 hover:to-neutral-900 to-neutral-950 dark:to-white p-6 rounded-3xl overflow-hidden cursor-pointer"
          >
            <Grid size={20} />
            <p className="text-base font-bold dark:text-neutral-800 text-white relative z-20">
              {feature.title}
            </p>
            <p className="dark:text-neutral-600 text-neutral-400 mt-4 text-base font-normal relative z-20">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const grid = [
  {
    title: "Browser-Based Collaborative Editor",
    description:
      "Real-time collaboration directly in your browser with no setup required.",
  },
  {
    title: "Built-In Frontend Templates",
    description:
      "Quick start with popular frameworks, multi-file support, and easy dependency management.",
  },
  {
    title: "In-Browser Code Execution",
    description:
      "Instantly run code in isolated iframe environments within the browser.",
  },
  {
    title: "No Login Required for Testing",
    description:
      "Try editors without signup; code state saved permanently even after closing.",
  },
  {
    title: "Signup/Login for Personalized Playgrounds",
    description:
      "Create, save, and organize personal code shards with customizable visibility.",
  },
  {
    title: "Like, Comment, and Follow",
    description:
      "Engage with the community through likes, comments, and following other developers.",
  },
  {
    title: "Personalized Activity Feed",
    description:
      "Stay updated with coding activities, interactions, and comments from followed users.",
  },
  {
    title: "Real-Time Collaborative Rooms",
    description:
      "Create rooms for simultaneous multi-file collaboration using CRDT-powered editors.",
  },
  {
    title: "Code Synchronization with CRDTs",
    description:
      "Real-time code updates synchronized using CRDTs for conflict-free collaboration.",
  },
];
export const Grid = ({ pattern, size }) => {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0  -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(black,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r  [mask-image:radial-gradient(farthest-side_at_top,black,transparent)] from-zinc-900/30 dark:from-zinc-100/30 dark:to-zinc-300/30 to-zinc-900/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full  mix-blend-overlay fill-white/10 stroke-white/15 dark:stroke-black/10 dark:fill-black/10"
        />
      </div>
    </div>
  );
};

export function GridPattern({ width, height, x, y, squares, ...props }) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
