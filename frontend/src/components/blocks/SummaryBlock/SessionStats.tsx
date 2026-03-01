interface SessionStatsProps {
  totalBlocks: number;
  sessionDuration: number;
}

/** SessionStats component - displays the total number of session blocks and the session duration */
export default function SessionStats({ totalBlocks, sessionDuration }: SessionStatsProps) {
  return (
    <div className={`grid gap-6 ${sessionDuration > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>

      {/* Total number of blocks completed */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <div>
          <div className="text-3xl font-bold text-foreground">{totalBlocks}</div>
          <div className="text-sm text-muted-foreground">Blocks Completed</div>
        </div>
      </div>

      {/* Session Duration (hidden when 0, e.g. when the summary block is shown after page reload) */}
      {sessionDuration > 0 && (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">
              {sessionDuration} {sessionDuration === 1 ? 'minute' : 'minutes'}
            </div>
            <div className="text-sm text-muted-foreground">Session Duration</div>
          </div>
        </div>
      )}
    </div>
  );
}
