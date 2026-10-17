import type { Strings } from "../i18n";

/**
 * The English table, on its own so the app can ship one language and
 * fetch the others on demand (Batch Z). It is data only: no logic lives here.
 */
export const en: Strings = {
  coffee: {
    nav: "Buy me a coffee",
    cta: "Fuel the next release",
    fewer: "One coffee fewer",
    more: "One coffee more",
  },
  appName: "WinCraft",
  appliedCount: "{applied} of {total} tweaks active",
  headerNote:
    "Review each change before applying it. Restore tools cover supported settings; cleanup and repair operations have different recovery limits.",
  advisor: {
    eyebrow: "Recommended for your PC",
    applyButton: "Apply",
    confidenceHigh: "High confidence — based on this PC's hardware",
    confidenceStandard: "Recommended for this machine type",
    reversible: "Reversible — the original value is saved before any change.",
    empty: "Nothing to recommend right now — your setup already matches our advice.",
  },
  drift: {
    pickHint: "Untick anything you changed on purpose.",
    titleAfterUpdate: "Windows changed your settings back",
    titleNoUpdate: "Some settings are no longer in effect",
    afterUpdateOne:
      "After updating to {patch}, one tweak you had applied is no longer in effect on the system.",
    afterUpdateMany:
      "After updating to {patch}, {count} tweaks you had applied are no longer in effect on the system.",
    noUpdateOne:
      "One tweak you had applied is no longer in effect on the system. No Windows update happened in between, so something else changed it.",
    noUpdateMany:
      "{count} tweaks you had applied are no longer in effect on the system. No Windows update happened in between, so something else changed them.",
    reapplyOne: "Re-apply the tweak",
    reapplyMany: "Re-apply {count} tweaks",
    reapplying: "Re-applying...",
    reappliedOne: "Tweak re-applied.",
    reappliedMany: "{count} tweaks re-applied.",
  },
  crashes: {
    title: "Unexpected shutdowns",
    subtitle:
      "The app closed on its own. The report stays on this PC: copy it and send it over on Discord or GitHub if you want it fixed.",
    copy: "Copy report",
    copied: "Report copied to the clipboard.",
    clear: "Clear",
    cleared: "Reports cleared.",
    processApp: "main window",
    processElevated: "admin-rights operation",
  },
  ledger: {
    guardPaused: "App adjustments paused",
    guardResumed: "App adjustments resumed",
    processes: "Processes: {count}",
    restored: "Restored",
    postponed: "Postponed while a game was running",
    title: "Change Ledger",
    subtitle:
      "Everything this app changed on this PC, newest first. Stored locally, never uploaded.",
    empty: "No changes recorded yet. Apply your first tweak and it will appear here.",
    clear: "Clear history",
    clearing: "Clearing...",
    cleared: "History cleared.",
    revert: "Revert",
    elevated: "with admin rights",
    failed: "failed",
    actions: {
      processGuard: "Self-managed game",
      coreSteering: "Core steering",
      ramTrim: "RAM cleanup",
      autoReverted: "Undone automatically",
      priorityRule: "Priority rule",
      scheduledCleanup: "Scheduled cleanup",
      ecoqos: "Background app efficiency",
      applied: "Tweak applied",
      reverted: "Tweak reverted",
      cleanup: "Cleanup",
      filesDeleted: "Files deleted",
      diskOptimize: "Disk optimization",
      startupChange: "Startup change",
      restorePoint: "Restore point",
    },
  },
  tabs: {
    groupWorkspace: "Workspace",
    overview: "Overview",
    groupMonitor: "Monitor",
    groupOptimize: "Optimize",
    groupManage: "Manage",
    scan: "Scan",
    health: "PC Health",
    hardware: "Hardware",
    performance: "Performance",
    privacy: "Privacy",
    ui: "UI",
    maintenance: "Maintenance",
    gaming: "Gaming",
    startup: "Startup",
    profiles: "Profiles",
    pricing: "Plans & pricing",
    ledger: "Change history",
  },
  healthPanel: {
    title: "Health score",
    subtitle: "An explainable score: every number shows the facts it was computed from.",
    why: "Why {score}?",
    refresh: "Recompute",
    compute: "Compute health score",
    showMore: "Show more",
    showLess: "Show less",
    stageProfile: "Reading system profile",
    stageTweaks: "Checking applied tweaks",
    stageSecurity: "Reading security state",
    stageScoring: "Scoring",
    verdictExcellent: "EXCELLENT",
    verdictGood: "GOOD",
    verdictFair: "FAIR",
    verdictNeedsWork: "NEEDS WORK",
    computing: "Analyzing...",
    idleHint:
      "Nothing runs in the background: the score is computed only when you ask, entirely on this PC.",
    changeSinceLast: "since your last check",
    changeNone: "No change since your last check.",
    changeFirstRun: "First measurement recorded. Run it again after a change to see what moved.",
    changeWhyTitle: "Why the score changed",
    changeContributes: "Contribution to the overall score:",
    changeStructural:
      "An app update changed which categories are scored — part of this difference did not come from your PC.",
    changeTrend: "Trend",
    categories: {
      performance: "Performance",
      gaming: "Gaming",
      responsiveness: "Responsiveness",
      memory: "Memory",
      storage: "Storage",
      startup: "Startup",
      maintenance: "Maintenance",
      privacy: "Privacy",
      security: "Security",
    },
  },
  transparency: {
    title: "What this changes, exactly",
    key: "Key",
    value: "Value",
    setsTo: "Sets to",
    note: "The previous value is saved before writing, so rollback restores it exactly as it was.",
    kindRegistry: "Registry",
    kindCommand: "Command",
    kindService: "Service",
    copy: "Copy",
    copied: "Copied",
  },
  command: {
    statusQuiet: "All systems quiet",
    statusScanning: "Scanning...",
    statusFindings: "{count} recommendations ready",
    domainsLine: "Startup · Storage · Memory · Privacy · Performance · Updates",
    consent: "Nothing changes without your approval.",
    runScan: "Run system scan",
    reviewFindings: "Review {count} recommendations",
    memTitle: "Memory pressure",
    pressureLow: "Low",
    pressureElevated: "Elevated",
    pressureHigh: "High",
    memReview: "Review memory use",
    memTopTitle: "Top processes",
    trimTitle: "Trim working sets",
    trimExplainer:
      "Asks the Windows memory manager to move idle pages out of app working sets. Useful under high pressure; apps may briefly reload pages on next use. No data is lost. Windows asks for administrator permission.",
    trimButton: "Trim now",
    autoTitle: "Automatic trim",
    profilesTitle: "Session profiles",
    profileGame: "Game Session",
    profileGameDesc: "Prepares the PC for play: power, priority and DVR capture.",
    profileFocus: "Focus",
    profileFocusDesc: "Fewer distractions, non-essential activity under control.",
    profileQuiet: "Quiet Session",
    profileQuietDesc: "Efficiency, battery and low noise first.",
    profileDownload: "Download Session",
    profileDownloadDesc: "Controls bandwidth and background activity.",
    previewBtn: "Preview changes",
    gameChange1: "Turns off Game DVR (background capture)",
    gameChange2: "Switches to the High performance power plan",
    gameChange3: "Optimizes CPU priority for games (Win32PrioritySeparation)",
    previewReq: "Requires administrator rights",
    previewCost: "Potential cost: higher power draw and heat while active.",
    previewRevert: "One-click reversible: every original value is saved first.",
    applySession: "Start session",
    restoreSession: "Restore",
    statusActive: "Active",
    statusOff: "Not active",
    soon: "Coming soon",
  },
  systemMonitor: {
    cpu: "CPU",
    ram: "Memory",
    disk: "Disk",
    uptime: "Up for",
    uptimeValue: "{hours}h {minutes}m",
    cores: "{count} cores",
  },
  startupManager: {
    title: "Startup programs",
    description:
      "Programs that open by themselves when your PC boots. Turning some off shortens startup time: the program stays installed and you can still open it manually.",
    empty: "No programs are set to start automatically.",
    activeCount: "Active: {enabled} / {total}",
    machineWide: "All users",
    impactNote: "Turning one off uninstalls nothing and is reversible at any time.",
    refresh: "Refresh",
    refreshing: "Rescanning...",
    hiddenOrphans: "{count} entries hidden: the program is no longer installed.",
    locationRun: "Registry",
    locationRun32: "Registry (32-bit)",
    locationFolder: "Startup folder",
  },
  systemRepair: {
    title: "Windows integrity check and repair",
    description:
      "Checks whether Windows' own system files and component store are intact, and repairs them from Microsoft's servers when they are not. The same DISM and SFC tools Microsoft support asks people to run, without the command line.",
    adminNote:
      "Runs as administrator: Windows asks once, and a restore point is taken before anything changes.",
    timeNote:
      "A full repair can take 20 minutes or more. You can keep using the PC — just don't shut it down.",
    checkButton: "Check integrity",
    checking: "Checking...",
    cleanupButton: "Shrink component store",
    cleaningUp: "Shrinking...",
    cleanupNote:
      "Removes superseded component versions from WinSxS. Recently installed updates stay uninstallable.",
    runningNote: "Don't shut down or restart while this is running.",
    cannotStop:
      "Once started it can't be stopped: Windows is checking and repairing its own system files, and cutting that off halfway could leave them half repaired. You can keep using your PC and WinCraft meanwhile.",
    stepQuick: "Quick status read",
    stepScan: "Checking the component store",
    stepRestore: "Repairing the component store",
    stepSfc: "Checking system files",
    stepCleanup: "Shrinking the component store",
    stepOf: "Step {index} of {total}",
    statusHealthy: "Windows is intact",
    statusRepairable: "Damage found, and it can be repaired",
    statusRepaired: "Damage found and repaired",
    statusUnrepairable: "Damage found that could not be repaired",
    statusCompleted: "Finished",
    hintUnrepairable:
      "An in-place upgrade of Windows is usually the next step. The output below has the error code.",
    hintCompleted:
      "The tools ran. Your Windows language means the result could not be read automatically — the output below has the details.",
    logTitle: "Output",
    askRepair: "Do you want to repair it now?",
    askRepairYes: "Yes, repair now",
    askRepairNo: "Not now",
    repairAnyway: "Run a full repair anyway",
    elapsed: "{time} elapsed",
    holdingAt:
      "Still at {percent}% after {time}. DISM parks on one number for minutes at a time while Windows rebuilds components in the background — it hasn't frozen.",
    remaining: "~{minutes} min",
    underMinute: "< 1 min",
    estimating: "Estimating...",
    statElapsed: "Elapsed",
    statRemaining: "Left",
    statFinish: "Expected finish",
    waiting: "Waiting",
  },
  cookieCleaner: {
    title: "Selective cookie cleaner",
    description:
      "Removes tracking and advertising cookies while keeping the ones holding your sign-ins. Sites on your keep-list stay logged in.",
    scanButton: "Scan cookies",
    scanning: "Scanning...",
    cleanButton: "Clean",
    cleaning: "Cleaning...",
    noneFound: "No browser cookies found on this PC.",
    totals: "{removable} to remove, {protected} sign-in cookies kept",
    runningWarning: "Close {browser} to clean it. The counts above are already accurate.",
    backupNote: "The cookie database is copied first, so a clean can be undone.",
    restoreButton: "Undo last clean",
    restoring: "Restoring...",
    restoredToast: "{browser}: cookies restored from the last backup.",
    cleanedToast: "{removed} cookies removed, {kept} sign-ins kept.",
    nothingToClean: "Nothing to remove: every cookie here is on your keep-list.",
    topDomains: "Most cookies come from",
    whitelistTitle: "Sites to stay signed in to",
    whitelistNote: "Subdomains are covered too: adding google.com also keeps accounts.google.com.",
    whitelistPlaceholder: "example.com",
    whitelistAdd: "Add",
    whitelistRemove: "Remove",
    whitelistReset: "Restore defaults",
  },
  appCache: {
    title: "Third-party app caches",
    description:
      "Shader caches, game launchers, chat apps and package managers hold on to gigabytes of files they rebuild by themselves. This finds them across the programs you actually have installed.",
    scanButton: "Scan caches",
    scanning: "Scanning...",
    cleanButton: "Clean selected",
    cleaning: "Cleaning...",
    noneFound: "No third-party caches found on this PC.",
    permanentNote:
      "These are deleted for good rather than moved to the Recycle Bin, because recycling gigabytes frees nothing until the bin is emptied. Everything listed here is rebuilt automatically by the program that created it.",
    blockedBy: "{process} is running, so its files will be skipped.",
    selectedTotal: "{size} selected",
    cleanedToast: "{freed} freed.",
    skippedNote: "{count} files were in use and were left alone.",
    catShaders: "Shader caches",
    catLaunchers: "Game launchers",
    catApps: "Anwendungen",
    catDev: "Developer tools",
    catWindows: "Windows",
    names: {
      shader_dx: "DirectX shader cache",
      shader_nvidia: "NVIDIA shader cache",
      shader_amd: "AMD shader cache",
      shader_intel: "Intel shader cache",
      steam: "Steam web cache",
      epic: "Epic Games Launcher cache",
      battlenet: "Battle.net cache",
      discord: "Discord cache",
      vscode: "Visual Studio Code cache",
      npm: "npm package cache",
      pip: "pip package cache",
      crash_dumps: "Application crash dumps",
      error_reports: "Windows error reports",
    },
  },
  scheduledTasks: {
    title: "Scheduled startup tasks",
    description:
      "Updaters and background helpers that run at sign-in or boot from the Task Scheduler, where the Windows Startup list never shows them. Windows' own tasks are not listed here.",
    empty: "No third-party startup tasks on this PC.",
    activeCount: "Enabled: {enabled} / {total}",
    triggerLogon: "At sign-in",
    triggerBoot: "At boot",
    refresh: "Refresh",
    refreshing: "Re-reading...",
    note: "Turning a task off uninstalls nothing, and you can turn it back on at any time.",
  },
  search: {
    placeholder: "Search a tweak...",
    noResults: 'No results for "{query}".',
    clear: "Clear",
  },
  pricing: {
    title: "Free for everyone",
    intro: "WinCraft is free and open source: every tool included, no subscription, no paywall.",
    planName: "Everything included",
    planTagline: "Every tool, every tweak, every feature — no restrictions.",
    priceAmount: "$0",
    priceNote: "forever",
    features: [
      "All system tweaks and optimizations",
      "Advanced gaming and privacy tools",
      "Disk cleanup, defragmentation and system repair",
      "Driver updates and hardware diagnostics",
      "Game Sessions and monitoring profiles",
      "Zero-Trace memory purge and secure shredder",
      "Every future update included",
    ],
    commitmentTitle: "Our commitment",
    commitmentBody:
      "WinCraft is and will remain free. Everyone should have access to tools that help them understand and optimize their PC: no hidden costs, no feature gates, no subscriptions.",
  },
  toggle: { on: "On", off: "Off" },
  driverBooster: {
    title: "Driver Booster",
    subtitle: "Pick the drivers that are falling behind and open all their download pages at once.",
    scan: "Scan drivers",
    scanning: "Scanning...",
    selectAll: "Select all",
    selectNone: "Clear selection",
    selectedCount: "{selected} of {total} selected",
    pagesForSelection: "{pages} pages to open",
    openSelected: "Open download pages ({count})",
    opened: "{count} pages opened",
    openedCapped:
      "Opened {opened} of {total} pages: the rest stay selected, run it again to open them.",
    allCurrent: "No driver is showing its age.",
    nothingActionable: "No ageing driver has a vendor page to open.",
    note: "WinCraft does not download driver packages on its own: there is no vendor API that says which version is right for your exact device, and installing the wrong display driver is one of the few mistakes that can leave you with no screen. This automates the tedious part — finding the pages — not the choice. For drivers Windows Update genuinely knows about, use the button above.",
  },
  secureDefrag: {
    title: "Secure Defragmentation",
    willDefrag: "This drive is mechanical: a real defragmentation pass will run.",
    willRetrim:
      "This drive is not confirmed mechanical: the whole volume is analysed, then a retrim runs instead of a defragmentation. The retrim takes seconds and only concerns free space — that is what it is: it tells the controller which blocks are no longer in use so it can reuse them without slowing down. Defragmenting an SSD does not speed it up, it only wears it out.",
    start: "Start",
    running: "Running...",
    working: "Working...",
    phaseAnalyze: "Analysing",
    phaseOptimize: "Optimising",
    analysisTitle: "Analysis report",
    doneDefrag: "Defragmentation complete.",
    doneRetrim: "Retrim complete.",
    note: "A System Restore point is taken first. The percentage comes from Windows itself, not from a timer.",
  },
  zeroTrace: {
    title: "Zero-Trace Cleaner",
    subtitle:
      "Clears what closed programs leave behind in memory, and destroys files beyond recovery.",
    purgeTitle: "Memory purge",
    purgeBody:
      "Windows keeps the pages of closed programs in RAM as cache. This releases them, so fragments left by a process that exited are genuinely gone from physical memory.",
    purgeButton: "Purge memory",
    purging: "Purging...",
    purgeResult: "Freed {freed} MB — {after} MB now free",
    purgeLimit:
      "It does not touch the pagefile or hibernation file: those are on disk, and Windows offers no runtime API to scrub them.",
    shredTitle: "Secure file shredder",
    shredBody:
      "Overwrites the file’s contents in three passes before deleting it, putting it beyond ordinary undelete tools.",
    shredButton: "Choose files...",
    shredding: "Shredding...",
    shredDone: "{count} files destroyed ({size})",
    shredSummary: "{shredded} destroyed, {skipped} skipped",
    shredWarning: "Permanent: no Recycle Bin, no recovery.",
    ssdCaveat:
      "On an SSD, wear levelling almost always writes to different cells than the original. The old cells are freed, not rewritten — only the drive’s own secure-erase can guarantee more.",
  },
  hud: {
    title: "Gaming overlay",
    subtitle:
      "A transparent panel over your game: CPU/GPU load, temperatures, VRAM, the active process with its scheduling priority, and a bottleneck indicator.",
    fpsAbout:
      "Frame rate is counted from the present events Windows emits for every frame — the same source PresentMon reads, with nothing hooked into the game. It needs administrator, because opening a trace session is a privileged operation.",
    fpsLowExplained:
      "Beside the average there is DROP: the rate of the worst one percent of frames, the figure elsewhere called the 1% low. It is the number that moves when a game stutters, while the average stays high and says nothing. The closer DROP sits to the average, the smoother the game.",
    fpsStart: "Measure FPS",
    fpsStop: "Stop measuring",
    fpsNeedsAdmin: "Measuring frame rate needs WinCraft started as administrator.",
    fpsRunning:
      "Measuring: the frame rate appears in the overlay as soon as a game starts drawing.",
    show: "Show",
    hide: "Hide",
    lock: "Lock",
    unlock: "Unlock",
    dragHint: "Drag the overlay where you want it, then lock it before starting the game.",
    lockedHint: "Locked: clicks pass through it to the game. Unlock it to move it again.",
    sizeCompact: "Compact",
    sizeNormal: "Normal",
  },
  updater: {
    title: "Update available: v{version}",
    body: "Downloads and installs in one step; the app restarts itself when done.",
    install: "Install and restart",
    later: "Later",
    downloading: "Downloading... {percent}%",
    installing: "Installing...",
    error: "Update failed: {message}",
    checkFailed: "Update check failed: {message}",
  },
  badges: { admin: "Admin", soon: "COMING SOON" },
  emptyCategory: "No tweaks available in this category yet — more coming soon.",
  gameSessions: {
    title: "Game Sessions",
    subtitle: "Auto-detects your games and applies/reverts the Turbo Gaming preset on its own.",
    active: "Session active: {name}",
    gamesCount: "{count} games registered",
    addGame: "+ Add game (.exe)",
    steeringTitle: "Core steering",
    steeringVcache:
      "The game runs on the 3D V-Cache die ({count} threads). Other apps stay where Windows puts them.",
    steeringHybrid:
      "The game runs on the performance cores ({game} threads) and the other apps in your session move to the efficiency cores ({background} threads). Apps you raise above normal priority are left alone.",
    steeringActive: "{count} processes steered for this game.",
    steeringNone:
      "Nothing to steer on this CPU: no faster core type and no single larger cache were found.",
    steeringActiveVcache: "The game is running on the V-Cache die.",
    steeringNeedsSessions: "Runs only while Game Sessions is on and one of your games is running.",
  },
  latencyTrace: {
    title: "DPC and interrupt latency",
    subtitle:
      "Measures how long each driver's deferred procedure calls (DPCs) and interrupt service routines (ISRs) run, read straight from the Windows kernel. Changes nothing; needs administrator rights.",
    duration: "Length",
    secondsOption: "{seconds} s",
    run: "Measure",
    running: "Measuring for {seconds} s…",
    dpcSummary: "Longest DPC: {max} ms (limit {limit} ms). {over} of {count} ran past the limit.",
    isrSummary:
      "Longest interrupt routine: {max} ms (limit {limit} ms). {over} of {count} ran past the limit.",
    colDriver: "Driver",
    colDpc: "Longest DPC",
    colIsr: "Longest interrupt",
    colOver: "Past the limit",
    unattributed: "Unattributed",
    hidden: "Windows hid the driver addresses, so routines could not be matched to drivers.",
    verdictGood: "No driver ran past Microsoft's limits during this capture.",
    note: "Microsoft's guidance: a DPC should finish within 0.1 ms and an ISR within 0.025 ms. dxgkrnl.sys dispatches display interrupts, so its time often belongs to the graphics driver.",
    verdictMinor:
      "{over} routines ran past Microsoft's guidance; the longest took {max} ms. Short overruns like these are common and rarely audible.",
    lost: "Windows dropped {events} events and {buffers} buffers during the capture, so the longest times shown are a floor.",
    verdictBad:
      "{driver} held a processor for {max} ms without a break. Stalls over a millisecond can cause audio crackle and frame-time hitches; updating or rolling back that driver is the usual fix.",
    verdictBadUnattributed:
      "A routine that could not be matched to a driver held a processor for {max} ms without a break. Stalls over a millisecond can cause audio crackle and frame-time hitches.",
    spikesTitle: "Longest single routines",
    spikeLine: "{kind} of {duration} ms in {driver}, {at} s into the capture",
  },
  networkCheck: {
    title: "Network check",
    subtitle:
      "Pings 1.1.1.1 32 times and opens one TCP connection, then reports what the Windows network stack is actually doing. Changes nothing.",
    run: "Check",
    running: "Checking…",
    offline: "No connection to the internet.",
    rtt: "Round trip: median {median} ms (min {min}, max {max})",
    jitter: "Jitter: {jitter} ms",
    loss: "Replies: {received} of {sent}",
    tcpRtt: "TCP stack round trip: {rtt} ms",
    nagleOn:
      "New connections start with Nagle's algorithm on (TCP_NODELAY off). Apps that need it off set it on their own sockets.",
    nagleOff: "New connections start with Nagle's algorithm off.",
    buffers: "Receive buffer: {reserved} reserved per socket, {autotuned} autotuned by Windows",
    verdictNone:
      "A ping does not go through TCP settings, so these readings describe the connection itself.",
    verdictInconclusive: "Too few replies to compare.",
    verdictLineChanged:
      "The line itself changed between the two readings (median {delta} ms). Ping does not go through TCP settings, so this is not the effect of the change.",
    lastTitle: "After {tweak}, {time}",
    socketsBeforeAfter:
      "New sockets, before → after: Nagle {nagleBefore} → {nagleAfter}, receive buffer {bufBefore} → {bufAfter}",
    stateOn: "on",
    stateOff: "off",
  },
  turboBoost: {
    title: "Turbo Boost",
    subtitle:
      "Adjust CPU boost behavior and minimum processor state. Power use and heat may increase; results depend on the workload.",
    startLabel: "Start",
    stopLabel: "Stop",
    activating: "Activating turbo...",
    deactivating: "Restoring...",
    active: "Turbo active",
    inactive: "Turbo not active",
    loadLabel: "CPU LOAD",
    loadCadence: "Measured every second, smoothed over about 3 seconds",
    ownLoad: "Over the last few seconds: WinCraft itself {own}% · everything else {rest}%",
    stageReading: "Reading the power plan",
    stageRaising: "Raising the boost ceiling",
    stageApplying: "Applying to the system",
    stageMeasuringBefore: "Measuring before",
    stageMeasuringAfter: "Measuring again",
    factAverage: "Average speed now",
    factFastest: "Fastest core now",
    factPeak: "Highest this session",
    factFloor: "Minimum processor state",
    ofBase: "{pct}% of base clock",
    usersTitle: "Using the CPU now",
    appliedAt:
      "Turned on {time} · boost mode Aggressive, minimum processor state 100% on mains power",
    planAlreadyUses: "The current power plan already uses these settings.",
    planAlreadyHad: "The current power plan already had these settings, so no value changed.",
    loadExplain:
      "Load is how much work the processor is doing; Turbo Boost changes how fast it may run, not how busy it is. A high reading means programs on this PC are busy right now.",
    chartLoad: "Load",
    chartSpeed: "Speed",
    testTitle: "Same test in each mode",
    testHint: "A fixed 3-second workload. Run it once in each mode to see what boost changes.",
    testRun: "Run 3-second test",
    testRunning: "Testing…",
    colDefault: "Default",
    colBoost: "Boost",
    rowWork: "Work done",
    rowAvg: "Average speed",
    rowPeak: "Peak speed",
    rowTemp: "CPU temperature",
    notRun: "Not run yet",
    relative: "{pct}% of Default",
  },
  profiles: {
    title: "Your profiles",
    subtitle:
      "Save your active tweaks as a profile. Reuse a configuration or export it to another PC.",
    saveHeading: "Save active tweaks",
    namePlaceholder: "Name (e.g. Gaming)",
    saveButton: "Save",
    savedHeading: "Saved profiles",
    empty: "No saved profiles yet.",
    tweakCount: "{count} tweaks",
    apply: "Apply",
    applying: "Applying...",
    exportButton: "Export",
    importButton: "Import from file",
    deleteButton: "Delete",
    savedToast: 'Configuration "{name}" saved',
    appliedToast: "{count} tweaks applied",
    exportedToast: "File exported",
    importedToast: "Imported: {count} tweaks ready to review",
    droppedWarning: "{count} entries this version doesn't recognise were dropped",
    nameRequired: "Give the configuration a name",
    reviewNotice: "An imported configuration is never applied on its own — you review it first.",
    signInRequired: "Sign in or create an account to save configurations.",
  },
  scan: {
    lastScan: "Last scan: {time}",
    neverScanned: "No completed scan yet",
    extraChecks: "Additional checks",
    checksHint:
      "System readings only: nothing is changed automatically. Expand a category to inspect the evidence.",
    unavailable: "Check unavailable",
    startupSummary: "{enabled} enabled · {orphaned} missing targets",
    tasksSummary: "{enabled} enabled startup tasks",
    partialScan: "Partial results: some checks are unavailable.",
    scanFailed: "Scan failed. Please try again.",
    title: "Quick scan",
    subtitle:
      "Checks your PC's status and finds optimizations that aren't active yet, in one click.",
    startLabel: "SCAN",
    stepPerformance: "Performance",
    stepPrivacy: "Privacy",
    stepGaming: "Gaming",
    stepJunk: "Temp files",
    allGood: "All good — no issues found.",
    issuesFound: "{count} optimizations available",
    selectAll: "Select all",
    deselectAll: "Deselect all",
    fixAll: "Fix all",
    fixing: "Fixing {done}/{total}...",
    fixedToast: "{count} issues fixed.",
    scanAgain: "Scan again",
    verdictRecommended: "Recommended on this PC",
    verdictNotRecommended: "Not recommended on this PC",
    verdictUnsupported: "Not supported",
    reasons: {
      laptop_battery: "this PC is a laptop: it costs more battery than it gives back",
      hdd_index_cost: "the system disk is mechanical, so background indexing is genuinely felt",
      fast_disk_no_gain: "the system disk is NVMe, fast enough to make the saving negligible",
      needs_win10_2004: "requires Windows 10 version 2004 or newer",
      weak_gpu: "integrated graphics: transparency costs performance they could use",
    },
    thisPc: "This PC",
    dashDrivesTitle: "Storage",
    dashFreeOf: "{free} free of {total}",
    dashAlmostFull: "Almost full",
    dashStartupTitle: "Startup apps",
    dashStartupCount: "{on} of {total} enabled",
    dashManage: "Manage",
    dashUptimeTitle: "Up for",
    dashUptimeDh: "{days}d {hours}h",
    dashUptimeHm: "{hours}h {minutes}min",
    dashUptimeLongHint:
      "This PC hasn't restarted in a while. A restart applies pending updates and releases held memory.",
    dashHistoryTitle: "Recent actions",
    dashHistoryEmpty: "Nothing yet. Actions you take will show up here.",
    dashActTweakApplied: "Tweak applied",
    dashActTweakReverted: "Tweak reverted",
    dashActCleanup: "Cleanup",
    dashActFilesDeleted: "Files deleted",
    dashActStartupChange: "Startup changed",
    dashActDiskOptimize: "Disk optimized",
    dashActRestorePoint: "Restore point",
    profileUnknown: "Not detected",
    diskHdd: "HDD",
    diskSsd: "SSD",
    diskNvme: "NVMe",
    formDesktop: "Desktop",
    formLaptop: "Laptop",
    groupRecommended: "Recommended for this PC",
    groupOptional: "Optional",
    groupNotRecommended: "Not recommended here",
    tailoredNote: "Each item is judged against the hardware above, not against a fixed list.",
    fixRecommended: "Apply the {count} recommended",
    fixEverything: "Apply selected ({count})",
    nothingSelected: "Nothing selected",
    foundHeadline: "{count} worth fixing on this PC",
    foundNone: "Nothing to fix",
    doneTitle: "Done!",
    doneBody: "{count} optimizations applied. Your PC is all set.",
    fixHeading: "Ready to apply",
  },
  ram: {
    autoNeedsAdmin: "Automatic cleanup runs only while WinCraft has administrator rights.",
    title: "Free up RAM",
    subtitle:
      "Asks Windows to release memory that programs are holding but not using. Windows asks for administrator permission each time, and it waits while a game is running.",
    button: "Free now",
    cleaning: "Cleaning up...",
    freed: "Freed {amount}",
    freedNothing: "Memory was already optimized",
    inUse: "{used} of {total} in use",
    autoLabel: "Automatic cleanup",
    autoOff: "Off",
    autoEvery: "Every {interval}",
    autoHint:
      "With automatic cleanup on, WinCraft frees RAM by itself at a regular interval. It can do this only while it runs as administrator: Windows asks for permission for every cleanup, and a scheduled one cannot ask.",
    autoPausedNotAdmin:
      "Paused: WinCraft is not running as administrator, so automatic cleanup cannot run. To use it, close WinCraft and open it with “Run as administrator”. Manual cleanup still works: Windows asks for permission each time.",
    autoNext: "Next cleanup at {time}",
    autoDue: "Cleanup due now...",
    autoLast: "Last at {time}: {amount} freed",
    autoNoneYet: "No automatic cleanup has run yet.",
    autoFailed: "The last attempt failed: {detail}",
  },
  restore: {
    button: "Restore active tweaks",
    title: "Restore active tweaks?",
    body: "Restore {count} tweaks from their saved values. Configurable tools have their own restore controls.",
    confirm: "Restore tweaks",
    cancel: "Cancel",
    running: "Restoring...",
    doneToast: "{count} optimizations restored.",
    nothingToast: "There is nothing to restore.",
  },
  passwordCheck: {
    title: "Password breach check",
    description:
      "Checks whether a password has shown up in a known data breach, without ever sending it in full: only a fragment of its hash is sent (k-anonymity, the same standard used by Have I Been Pwned).",
    placeholder: "Paste a password to check",
    button: "Check",
    checking: "Checking...",
    safe: "Not found in any known breach. Good sign.",
    breached: "Found in {count} known breaches. Change it now, everywhere you use it.",
    error: "Couldn't check right now: check your connection and try again.",
  },
  cleanupConfirm: {
    previewLoading: "Working out what will move to the Recycle Bin...",
    previewEmpty: "Nothing to clean - the folder is already empty.",
    previewNotAccessible:
      "The contents can't be read without administrator rights; the authorized process will list and remove them.",
    previewTruncated: "Showing the 500 largest items; totals include everything.",
    selectedSummary: "{count} items selected · {size}",
    confirmSelected: "Clean selected",
    title: "Confirm cleanup?",
    body: '"{name}" will move the matching files to the Windows Recycle Bin. You can restore them from there until it\'s emptied.',
    confirm: "Move to Recycle Bin",
    cancel: "Cancel",
  },
  cleanupButton: "Clean up",
  cleanupRunning: "...",
  cleanupResultToast: "{deleted} items moved to Recycle Bin, {freed} freed",
  cleanupResultToastSkipped: " ({skipped} in use, skipped).",
  diskOptimize: {
    title: "Optimize drive",
    description:
      "Runs Windows' own built-in optimizer: defragmentation on an HDD, or TRIM on an SSD (never a full defrag, which would only wear it out for no benefit).",
    button: "Optimize now",
    running: "Optimizing... this can take a few minutes",
    cannotStop:
      "Windows' own drive optimizer does this with administrator rights, so it runs to the end on its own and can't be stopped from here. It's safe to keep working.",
    resultToast: "Drive ({media}) optimized successfully.",
  },
  dnsFlush: {
    title: "Flush DNS cache",
    description:
      "Clears cached DNS lookups. Useful if a site changed servers and your browser keeps showing the old version.",
    button: "Flush now",
    running: "Flushing...",
    resultToast: "DNS cache flushed.",
  },
  browserCleanup: {
    title: "Browser cleanup",
    description:
      "Clears cache and cookies for Chrome, Edge and Firefox. The browser rebuilds them on its own next launch, so nothing is lost for good.",
    noneFound: "No supported browser found on this PC.",
    cache: "Cache",
    cookies: "Cookies",
    clearButton: "Clear",
    clearing: "Clearing...",
    runningWarning: "Close {browser} to clear it.",
    clearedToast: "{browser}: {freed} freed.",
  },
  tweakyDriverPromo: {
    title: "Tweaky Driver",
    description:
      "Find driver packages from supported sources in our dedicated app. Review compatibility before installing. Separate app; coverage varies.",
    button: "Explore Tweaky Driver",
    error: "Could not open the page. Please try again.",
  },
  redaxaPromo: {
    title: "Redaxa",
    description:
      "You've cut telemetry and tracking — but what do you paste into AI chats? Redaxa catches personal data and credentials before a prompt reaches any model. Same family, same rule: nothing gets stored.",
    button: "Try it on the web",
  },
  uninstallerPromo: {
    title: "WinCraft Uninstaller",
    description:
      "Remove entire programs safely: automatic restore point, verified command, honest report. From the same family as WinCraft.",
    button: "Download",
    confirmTitle: "Download the Uninstaller?",
    confirmBody:
      "WinCraft Uninstaller is a separate app in the same suite, and it signs in with the same account as this one. This downloads the installer (about 4 MB) straight from its GitHub release, for 64-bit Windows 10 and 11.",
    confirmUnsigned:
      "WinCraft Uninstaller is digitally signed by Aurelio Avila. Check the publisher and signature in the file properties. SmartScreen warnings can still appear.",
    confirmDownload: "Download",
    confirmOpenPage: "Open the page instead",
    cancel: "Cancel",
  },
  live: {
    title: "Right now",
    subtitle:
      "Updated every second while this page is open and WinCraft is in front. Nothing is measured in the background.",
    paused: "Paused",
    pausedHint: "Paused while WinCraft is in the background. It picks up again when you come back.",
    measuring: "Measuring…",
    smooth: "Running smoothly",
    busy: "Busy",
    strained: "Under heavy load",
    verdictDetail: "CPU {cpu}% over the last 10 seconds · memory {ram}% in use",
    failed: "Live readings are unavailable right now.",
    cpu: "Processor",
    speed: "{ghz} GHz",
    cores: "{count} logical processors",
    core: "Processor {n}",
    memory: "Memory",
    used: "In use",
    cached: "Cached",
    free: "Free",
    total: "Total",
    cachedHint: "Cached memory is handed back the moment a program needs it.",
    notAvailable: "Not available on this PC",
    disk: "Disk activity",
    read: "Read",
    write: "Write",
    systemDrive: "System drive: {used} of {total} used",
    network: "Network",
    down: "Download",
    up: "Upload",
    gpu: "Graphics",
    gpuLoad: "Load",
    temp: "Temperature",
    fan: "Fan",
    vram: "Video memory",
    sensors: "Temperatures and fans",
    sensorsHint:
      "Windows doesn't expose these sensors on this PC without the hardware maker's own tools, so nothing is guessed.",
    now: "now",
    secondsAgo: "{s} s ago",
    activity: "Activity",
    zoomShort: "1 min",
    zoomLong: "5 min",
    minutesAgo: "{n} min ago",
    peak: "Peak {value}",
    insightRecovering:
      "The processor is easing off: it averaged over 75% and the last reading is {pct}%.",
    insightCalm: "Everything looks calm. Nothing needs your attention right now.",
    insightMemory:
      "Memory is running high ({pct}%). Close apps you aren't using, or check what starts with Windows.",
    insightCpu:
      "The processor has been busy for a while ({pct}% on average). The list below shows what is using it.",
    insightDrive:
      "Your system drive is nearly full ({pct}%). Windows slows down when it runs short of space.",
    actionStartup: "Open Startup",
    actionCleanup: "Free up space",
    usingTitle: "What's using resources",
    usingHint:
      "Apps grouped by name, from Windows' own process list. Nothing is opened or changed.",
    usingCpu: "Processor",
    usingMemory: "Memory",
    processes: "{count} processes",
    processOne: "1 process",
  },
  pageError: {
    title: "This page ran into a problem",
    body: "The rest of WinCraft is still working, and nothing on your PC was changed by this error. Reload the page to try again.",
    reload: "Reload this page",
    reloadApp: "Reload WinCraft",
    details: "Technical details",
    appTitle: "WinCraft ran into a problem",
    appBody: "Nothing on your PC was changed by this error. Reload WinCraft to carry on.",
  },
  folderScan: {
    stop: "Stop search",
    stopping: "Stopping…",
    stoppedEmpty: "Search stopped. Nothing was moved or deleted.",
    stoppedPartial:
      "Search stopped. These are the results found before you stopped it; anything not reached yet wasn't checked.",
  },
  largeFiles: {
    title: "Find large files",
    description:
      "Scans a folder for its biggest files (over 100 MB), so you can quickly free up space by removing the ones you no longer need.",
    chooseFolder: "Choose folder",
    scanning: "Scanning...",
    noneFound: "No files found over {size}.",
    foundCount: "{count} files found",
    moveSelected: "Move {count} selected to Recycle Bin",
    deleting: "Moving to Recycle Bin...",
    deletedToast: "{count} files moved, {freed} freed.",
  },
  diskHealth: {
    title: "Drive health",
    freeSpace: "{size} free",
    selectDrive: "Drive",
    healthy: "Healthy",
    warning: "Warning",
    unhealthy: "Unhealthy",
    unknown: "Unknown",
    loading: "Checking...",
  },
  duplicateFinder: {
    title: "Find duplicate files",
    description:
      "Pick a folder: find identical files and choose which ones to move to the Recycle Bin.",
    chooseFolder: "Choose folder",
    scanning: "Scanning...",
    noneFound: "No duplicate files found in this folder.",
    copies: "{count} copies · {size} each",
    moveSelected: "Move to Recycle Bin ({count} selected)",
    deleting: "...",
    deletedToast: "{count} files moved to Recycle Bin ({freed} freed).",
  },
  ipMask: {
    title: "Mask IP (VPN)",
    description:
      "Hides your IP address by routing traffic through a VPN server. Requires an external VPN service: not integrated yet in this version.",
    button: "Learn more",
    explainerToast:
      "Real IP masking needs a dedicated VPN backend (server + protocol). It isn't connected yet — this is only a preview of the feature.",
  },
  toasts: {
    applied: '"{name}" applied.',
    rolledBack: '"{name}" restored to its original value.',
    elevationDeclined: "Administrator permission was not given, so nothing was changed.",
    accountRefreshFailed:
      "We couldn't verify your account status. What's shown here may be out of date — check your connection or try again later.",
  },
  titlebar: {
    applied: "{applied}/{total} active",
    cpu: "CPU",
    ram: "RAM",
    minimize: "Minimise",
    maximize: "Maximise",
    restore: "Restore",
    close: "Close",
  },
  x3d: {
    title: "3D V-Cache die aligner",
    subtitle:
      "On supported CPUs with unequal L3 cache across dies, restrict a running process to the die with the largest cache. This overrides automatic scheduling for that process and may help or hurt a workload.",
    cpuLabel: "Processor",
    readyHeadline: "V-Cache die found: {cores} threads",
    readyBody: "Pin a game to this die and every one of its threads stays where the cache is.",
    singleDie:
      "This processor has a single die: every core already sees the same cache, so there is nothing to align. The feature appears on its own on a two-die CPU with an asymmetric cache.",
    uniformCache:
      "This processor has several dies, all with the same amount of cache. Moving a game between them would change nothing, so the feature stays off.",
    unavailable: "Windows did not return a cache map for this processor.",
    dieLabel: "Die {index}",
    dieCache: "{mb} MB L3",
    dieThreads: "{count} threads",
    vcacheBadge: "V-Cache",
    processesTitle: "Running processes",
    processesHint: "Busiest first. Pick the game and pin it to the cache die.",
    refresh: "Refresh",
    refreshing: "Reading...",
    align: "Align",
    reset: "Reset",
    alignedBadge: "Aligned",
    noProcesses: "No process large enough to be worth listing.",
    persistenceNote:
      "Affinity belongs to the running process: it is gone when the game closes and has to be set again on the next launch. No system setting is changed.",
    alignedToast: "{name} pinned to the V-Cache die.",
    resetToast: "{name} returned to every core.",
  },
  hardware: {
    intro:
      "Read straight from your hardware's own sensors. Where a sensor doesn't exist we say so, instead of showing a number nobody can verify.",
    gpuLabel: "Graphics card",
    cpuLabel: "Processor",
    liveBadge: "Live",
    gpuDriver: "Driver {version}",
    load: "GPU usage",
    vram: "Video memory",
    fan: "Fan",
    power: "Power draw",
    fanIdle: "stopped: not needed below 50°",
    powerLimit: "{limit} W limit",
    tempCool: "cool",
    tempGood: "healthy",
    tempWarm: "warm",
    tempHot: "running hot",
    traceLabel: "This session",
    traceRange: "min {min}° · max {max}°",
    noTempSensor: "This card exposes no temperature sensor.",
    cpuAcpiSource: "read from the ACPI thermal zone",
    cpuNoSensor:
      "CPU temperature is unavailable: this firmware exposes no ACPI thermal zone. WinCraft only displays readings that Windows makes available.",
    noGpuTool:
      "No NVIDIA card detected. AMD and Intel ship no equivalent query tool, so their temperatures can't be read without the vendor's own software.",
    thermalsUnavailable: "We can't read the sensors on this system.",
    driversTitle: "Driver age",
    driversSubtitle:
      "How old your vendor-supplied drivers are. Windows knows what's installed, not what's available: this reports the age it can prove, never a fake update notice.",
    driversRescan: "Rescan",
    driversScanning: "Scanning...",
    driversCounted: "{count} vendor drivers",
    driversAging: "{count} over 2 years",
    driversStale: "{count} over 4 years",
    driversAllCurrent: "All recent",
    driversNone: "No third-party vendor drivers in these categories.",
    driversShowAll: "Show {count} more",
    driversShowLess: "Show less",
    driversInboxNote:
      "{count} Microsoft inbox drivers excluded: Windows Update services them and their date is a fixed placeholder, so counting them as old would be a false alarm.",
    ageYears: "{years} years",
    ageYear: "{years} year",
    ageMonths: "{months} months",
    ageMonth: "{months} month",
    vendorSite: "Vendor site",
    watchLabel: "Watching for",
    peakLabel: "Peak",
    verdictRisky: "Risky",
    verdictNormal: "Normal",
    verdictBetter: "Better than expected",
    verdictIdle: "Idle",
    verdictRiskyHint:
      "The card passed 84°, the point where it starts cutting its own performance to protect itself. Check airflow, or switch to the Silent profile.",
    verdictNormalHint: "Temperatures in the usual range for a card under load: nothing alarming.",
    verdictBetterHint: "It stayed under 65° while genuinely working: better cooling than most.",
    verdictIdleHint:
      "It hasn't worked hard enough yet to judge. An idle card runs cool regardless, so that would prove nothing.",
    profilesTitle: "Thermal profiles",
    profilesSubtitle:
      "These set the card's power limit, the lever that actually governs heat and fan noise. Every value comes from the limits the card itself reports.",
    currentLimit: "Now: {watts} W",
    modeSilent: "Silent",
    modeSilentHint:
      "For work, streaming and long sessions: the fan stays close to silent and the card runs far cooler, at the cost of a few frames.",
    modeStandard: "Standard",
    modeStandardHint:
      "A balanced cap a little under the card's ceiling: quieter fan and lower temperatures, for a frame cost in the low single digits.",
    modeGaming: "Gaming",
    modeGamingHint:
      "For competitive sessions: watts at maximum and a raised clock ceiling, to hold your 1% lows steadier when it matters.",
    modeApplying: "Applying...",
    profileStageReading: "Reading the card's limits",
    profileStageApplying: "Applying the limit",
    profileStageSettling: "Waiting for the fans to respond",
    profileApplied: "Limit set to {watts} W.",
    profileNote:
      "Needs administrator rights and resets on reboot. This is not a fan curve: NVIDIA exposes no direct fan control in nvidia-smi, and the tools that offer one use private, undocumented APIs this app does not touch.",
    profileDefaultIsMax:
      "On this card the factory power limit already equals the maximum, so Silent is the only profile that changes the wattage: Gaming differs by raising the clock ceiling instead.",
    driverInstalled: "installed v{version} on {date}",
    driversHardwareChanged:
      "This list was scanned on different hardware than the PC is running now (for example a replaced graphics card), so it has been cleared. Run Rescan to read the devices actually installed.",
    driversNoUpdateCheck:
      "This screen contacts no vendor and cannot know whether a newer version exists: it shows the installed version and its age, and takes you to the official page to check for yourself.",
    driversCheckedAt: "Read at {time}",
    modeClockLocked: "clock up to {mhz} MHz",
    modeClockAuto: "automatic clock",
    profileApply: "Apply profile",
    profileActive: "Profile active",
    profileWillSet: "Will set {watts} W, {clock}",
    scanStarting: "Starting scan...",
    scanReading: "Reading class {class}",
    scanCount: "{done}/{total} · {pct}%",
    driversScannedAll: "{total} drivers examined across {classes} categories",
    winUpdateLabel: "Windows Update",
    winUpdateButton: "Check Windows Update",
    winUpdateNote:
      "This only checks Windows Update's own catalogue, not the specific drivers listed above: many vendors - onboard audio and chipset ones especially - never publish updates there, only on their own site. WinCraft does not download driver packages itself: there is no vendor API for what is current for your exact device, and installing the wrong display driver is one of the few mistakes that can leave you without a screen.",
    winUpdateOpened: "Windows Update opened.",
    winUpdateSearching: "Searching...",
    winUpdateTakesAWhile: "This can take a minute - it queries Microsoft's catalogue.",
    winUpdateInstall: "Download and install ({count})",
    winUpdateInstalling: "Downloading and installing...",
    winUpdateNone:
      "Windows Update has nothing newer to offer, even for drivers shown as old above: many vendors publish updates their own way, not through Windows Update.",
    winUpdateFailed: "Search failed: {detail}",
    winUpdateDone: "Installed {installed}, failed {failed}.",
    rebootTitle: "Windows is asking for a restart",
    rebootBody:
      "Windows reports that an installation only finishes after a restart. You can do it now or whenever suits you.",
    rebootNow: "Restart now",
    rebootLater: "Later",
  },
  menu: {
    account: "Account",
    plan: "Plan",
    planFree: "Free",
    viewPlan: "View your plan",
    language: "Language",
    theme: "Themes",
    about: "About",
    errorReports: "Anonymous error reports",
    errorReportsBody:
      "When something fails, send only the error message (never personal data) to help us fix bugs. Off by default.",
    changePhoto: "Change profile photo",
    removePhoto: "Remove photo",
    photoFailed: "Could not use that image as a profile photo.",
    support: "Support",
    reportIssue: "Report an issue",
    aboutBody: "WinCraft — system tweaks with automatic backup and rollback.",
    close: "Close",
  },
  auth: {
    login: "Log in",
    register: "Sign up",
    email: "Email",
    password: "Password",
    loginButton: "Log in",
    rememberMe: "Keep me signed in",
    registerButton: "Create account",
    working: "...",
    logout: "Log out",
    loggedInAs: "Logged in as {email}",
    backendNotConfigured: "No server connected yet: set API_BASE_URL once the backend is deployed.",
    switchToRegister: "No account? Sign up",
    switchToLogin: "Already have an account? Log in",
    emailInvalid: "Enter a valid email address.",
    passwordTooShort: "Password must be at least 8 characters.",
    firstName: "First name",
    lastName: "Last name",
    registerDetailsRequired: "First name, last name and date of birth are required.",
    loginRequiredToResend: "Sign in first, then request a new link.",
    checkInboxAfterSignup:
      "We sent a confirmation link to {email}. Check your spam folder too. Once you confirm, your account is ready.",
    forgotPasswordLink: "Forgot password?",
    forgotPasswordButton: "Send reset link",
    forgotPasswordSent: "If that email is registered, you'll receive a password reset link.",
    backToLogin: "Back to login",
    emailNotVerified: "Email not verified",
    emailVerified: "Email verified",
    resendVerification: "Resend",
    verificationSent: "Verification email sent.",
    deleteAccount: "Delete account",
    deleteAccountBody:
      "This removes your email address, password and saved details, signs out every device, and cannot be undone. A review you published stays visible, with the address detached from it.",
    deleteAccountPassword: "Your current password",
    deleteAccountConfirmLabel: "Type DELETE to confirm",
    deleteAccountSubmit: "Delete my account for good",
    deleteAccountCancel: "Cancel",
    deleteAccountDone: "Your account has been deleted. Every device has been signed out.",
    deleteAccountBlocked:
      "This account has an active subscription. Cancel it from Manage subscription first; deleting the account would otherwise leave your card being charged.",
    deleteAccountWrongPassword: "That password does not match this account.",
    deleteAccountNeedsLogin: "Your session has expired. Sign in again to delete the account.",
    deleteAccountUnreachable:
      "The server could not be reached. Nothing was deleted — check your connection and try again.",
  },
  driftWatch: {
    title: "Watch for Windows updates",
    body: "A cumulative update puts back what it does not recognise: your changes disappear and you find out weeks later, if at all. With this on, the check runs at logon and tells you only when something has actually stopped being in effect.",
    on: "On",
    off: "Off",
  },
  guard: {
    settingTitle: "Leave self-managed games alone",
    settingBody:
      "Some games manage their own performance. While one is running, WinCraft pauses its per-app adjustments and leaves the game exactly as it is.",
    selfManaged: "This game manages its own performance, so WinCraft leaves it as it is.",
    gameRunning:
      "A game that manages its own performance is running, so WinCraft leaves apps as they are until it closes.",
    paused: "Paused while a game that manages its own performance is running.",
    selfManagedBadge: "Manages its own performance",
    registeredGameRunning: "One of your games is running, so WinCraft waits until it closes.",
  },
  preview: {
    title: "Preview",
    loading: "Reading the current values...",
    now: "Now",
    notSet: "Not set",
    willChange: "Applying this changes {count} of {total} values.",
    noChange: "Already in place: applying this changes nothing.",
    readAtApply: "The current state is read and saved the moment you apply it.",
    failed: "The current values could not be read.",
  },
  requirements: {
    minBuild: "{version} or later",
    proEdition: "Pro, Enterprise or Education",
    unavailableVersion: "Not available on this PC: it needs {version} or later.",
    unavailableEdition: "Not available on this PC: it needs Windows Pro, Enterprise or Education.",
    enterpriseEdition: "Enterprise or Education",
    unavailableEnterpriseEdition:
      "Not available on this PC: it needs Windows Enterprise or Education.",
    notPresent: "This PC does not have this feature, so there is nothing to turn off.",
    retired:
      "Retired: this legacy control cannot be applied again. Its previously saved state can still be restored.",
    windowsProtected:
      "Windows protects this switch on this PC and refuses changes from other apps. Turn Widgets off in Settings > Personalization > Taskbar.",
  },
  scheduledCleanup: {
    title: "Weekly temporary file cleanup",
    body: "Once a week, a few minutes after you sign in, moves temporary files nobody has touched for a day to the Recycle Bin. It waits while a game is running and never touches memory or open apps.",
  },
  priorityRules: {
    title: "App priority rules",
    subtitle:
      "Pick an app and a priority. WinCraft sets it each time the app starts while WinCraft is open, and puts the old priority back when you remove the rule or close WinCraft. Never above High.",
    remove: "Remove",
    empty: "No apps yet.",
    active: "Running apps adjusted: {count}",
    levelLabel: "Priority for {name}",
    idle: "Low",
    belowNormal: "Below normal",
    normal: "Normal",
    aboveNormal: "Above normal",
    high: "High",
  },
  skinpacks: {
    title: "Windows appearance",
    description: "Apply a reversible, per-user shell look.",
    packName: "COSMIC-inspired dark look",
    packBody:
      "Sets dark mode, a teal accent, reduced transparency, flat window borders and a left-aligned taskbar. All nine registry values are saved before they are changed.",
    scope:
      "Changes the look of the Windows shell only. It does not install COSMIC or replace the Windows desktop environment.",
    apply: "Apply look",
    restore: "Restore previous look",
    active: "Look active",
    applying: "Applying…",
    valuesSummary:
      "This look uses {count} registry values; applying it saves the originals for restore.", // uses {count}
  },
  tweaks: {
    disable_click_to_do: {
      name: "Turn off Click to Do",
      description:
        "Sets the Windows policy that removes Click to Do, the feature that takes a screenshot of your screen and analyzes it to suggest actions. Its entry points disappear for every account on this PC. Settings will show it as managed by your organization, which is how Windows labels policies. It has an effect only on PCs where Windows offers Click to Do.",
    },
    disable_edge_ai: {
      name: "Turn off AI features in Microsoft Edge",
      description:
        "Sets Microsoft Edge policies for its AI features. Which ones take effect depends on the Edge profile: stopping Edge from downloading its on-device AI model works for every profile; hiding the sidebar and turning off AI history search and AI-generated themes work for profiles not signed in with a personal Microsoft account; turning off Copilot's access to page content and its writing help works only for work or school profiles. Edge picks them up without a restart; edge://policy lists them. Edge will show that it is managed by your organization, which is how it labels policies.",
    },
    disable_paint_ai: {
      name: "Turn off AI features in Paint",
      description:
        "Sets the Windows policies that turn off Cocreator, Image Creator and generative fill in Paint. Everything else in Paint works as before.",
    },
    disable_notepad_ai: {
      name: "Turn off AI features in Notepad",
      description:
        "Sets the Notepad policy that turns off its Copilot writing tools (rewrite, summarize, write). Close and reopen Notepad to see the change.",
    },
    disable_fast_startup: {
      name: "Turn off Fast Startup",
      description:
        "Makes Shut down a real shutdown instead of a partial hibernation. Windows starts a few seconds slower from cold, but drivers and updates load fresh every time, and dual-boot setups no longer find the Windows drive locked.",
    },
    disable_storage_sense: {
      name: "Turn off Storage Sense",
      description:
        "Stops Windows from deleting temporary files, emptying the Recycle Bin and moving OneDrive files online on its own schedule. You decide what gets cleaned and when.",
    },
    taskbar_end_task: {
      name: "Add End task to the taskbar",
      description:
        "Adds End task to the right-click menu of apps on the taskbar, so a frozen app can be closed without opening Task Manager.",
    },
    disable_drag_tray: {
      name: "Turn off the drag tray",
      description:
        "Stops the sharing tray (called Drop tray on newer builds) from sliding down from the top of the screen every time you drag a file, so ordinary drag and drop works without it getting in the way. The value comes from Windows community documentation, not from Microsoft; recent Windows 11 updates also offer this switch in Settings.",
    },
    explorer_open_this_pc: {
      name: "Open File Explorer to This PC",
      description:
        "File Explorer opens on This PC, with your drives and folders, instead of opening on Home. This changes the starting page only; the Home entry remains in the navigation pane.",
    },
    block_oem_device_apps: {
      name: "Stop device makers' apps from installing themselves",
      description:
        "Stops Windows from downloading manufacturers' apps and custom icons for the devices you plug in, which is how some mouse, keyboard and motherboard utilities arrive without being asked for. Drivers still install as usual.",
    },
    disable_windows_suggestions: {
      name: "Turn off Windows tips and suggestions",
      description:
        'One switch for the prompts Windows adds on its own: tips and suggestions, the welcome screen after updates, suggestions in Settings, "finish setting up your device", suggested notifications, Start menu recommendations and account notices, and sync provider ads in File Explorer. These are the values Windows\' own Settings switches write, as documented by the Windows community; Microsoft does not document them, so a Windows update can change them.',
    },
    disable_widgets: {
      name: "Turn off Widgets entirely",
      description:
        "Sets the Windows policy that turns off the Widgets board itself, not just its taskbar button, so its news feed stops loading in the background. Settings will show it as managed by your organization, which is how Windows labels policies.",
    },
    hide_start_recommended: {
      name: "Remove Recommended from the Start menu",
      description:
        "Sets the Windows policy that removes the Recommended section from Start, giving your pinned apps the space to themselves. Settings will show it as managed by your organization, which is how Windows labels policies.",
    },
    disable_game_bar_captures: {
      name: "Turn off Game Bar captures",
      description:
        "Turns off Game Bar's capture feature and its background recording, which keeps a rolling video of your last few minutes of play. Complements the Game Bar / Game DVR switch.",
    },
    disable_ai_fabric_service: {
      name: "Start Windows AI Components Host only when needed",
      description:
        "Stops the Windows AI Components Host service (WSAIFabricSvc) and sets it to Manual, so it no longer starts with Windows. Windows can still start it when an app or Windows feature asks for it. Windows describes it as providing AI component services to apps and other Windows services. Only present on PCs that have it.",
    },
    disable_restart_apps: {
      name: "Stop apps reopening after sign-in",
      description:
        "Stops Windows from reopening restartable apps from the previous session after sign-in. Automatic session restore is lost; this does not close apps now or change automatic sign-in.",
    },
    enable_long_paths: {
      name: "Enable long paths in compatible apps",
      description:
        "Lets apps that declare long-path support exceed the traditional limit. Older apps and some File Explorer operations may remain limited. Restart apps; restoring this setting may make existing long paths inaccessible.",
    },
    disable_filter_keys_shortcut: {
      name: "Prevent accidental Filter Keys activation",
      description:
        "Disables only the right Shift shortcut for Filter Keys. The accessibility feature and its timing settings remain unchanged; this does not reduce keyboard latency.",
    },
    ecoqos_rules: {
      name: "Background app efficiency rules",
      description:
        "Assign lower energy priority to chosen executables while WinCraft is open. Rules pause when the app is interactive; this is not a CPU percentage cap.",
    },
    limit_do_background_download: {
      name: "Windows background download limit",
      description:
        "Configure a KB/s limit for Microsoft downloads handled by Delivery Optimization. It does not limit Steam or other devices and does not guarantee lower ping.",
    },
    monitor_refresh_profile: {
      name: "Game monitor refresh profile",
      description:
        "Choose a supported refresh rate for one display during a game session, with a temporary preview and restore. It does not increase GPU frame output.",
    },
    cpu_energy_performance: {
      name: "Favor CPU performance on mains power",
      description:
        "Sets CPU energy-performance preference to 0 in the current plan while plugged in. Requires autonomous CPPC support; firmware and thermal limits still apply. May increase heat and power use. Battery settings stay unchanged. Test your workload before keeping it.",
    },
    pcie_link_power: {
      name: "Keep PCIe links active on mains power",
      description:
        "Disables PCIe link-state power saving in the current plan while plugged in. A troubleshooting option for devices affected by power transitions; latency improvements are not guaranteed. May increase idle power use. Battery settings stay unchanged.",
    },
    usb_suspend_diagnostics: {
      name: "USB wake troubleshooting on mains power",
      description:
        "Disables USB selective suspend while plugged in to investigate device wake or disconnect problems. Windows recommends leaving it enabled normally. Restore after testing; idle power use may increase. Battery settings stay unchanged.",
    },
    hybrid_short_threads: {
      name: "Prefer performance cores for short threads",
      description:
        "On a CPU with different efficiency classes, asks Windows to prefer performant cores for short-running threads while plugged in. This is a preference, not a fixed affinity mask. Automatic scheduling may work better. Battery settings stay unchanged.",
    },
    hybrid_long_threads: {
      name: "Prefer performance cores for long threads",
      description:
        "On a CPU with different efficiency classes, asks Windows to prefer performant cores for long-running threads while plugged in. Other cores remain available; E-cores are not disabled. Compare throughput and responsiveness. Battery settings stay unchanged.",
    },
    disable_startup_delay: {
      name: "Remove the startup app delay",
      description:
        "Windows deliberately waits about 10 seconds after sign-in before launching your startup programs. This removes that wait.",
    },
    menu_show_delay: {
      name: "Instant menu response",
      description:
        "Removes the built-in delay before menus open, which makes the whole desktop feel noticeably snappier.",
    },
    disable_power_throttling: {
      name: "Disable CPU power throttling",
      description:
        "Stops Windows from slowing down background processes to save power - useful on laptops where throttling causes stutter during long sessions.",
    },
    games_gpu_priority: {
      name: "Set legacy Games GPU Priority value",
      description:
        "Writes the Games GPU Priority value, which Microsoft documents as unused. No GPU priority or frame-rate gain is expected.",
    },
    disable_tailored_experiences: {
      name: "Disable tailored experiences",
      description:
        "Stops Windows from using your diagnostic data to personalize ads, tips and recommendations.",
    },
    disable_app_launch_tracking: {
      name: "Stop tracking which apps you open",
      description:
        "Windows records how often you launch each program to rank Start menu results. This turns that logging off.",
    },
    disable_feedback_requests: {
      name: "Stop Windows feedback prompts",
      description:
        "Prevents Windows from interrupting you with 'How likely are you to recommend...' surveys.",
    },
    disable_cortana: {
      name: "Disable Cortana",
      description:
        "Turns Cortana off through system policy, freeing the background resources it reserves.",
    },
    show_file_extensions: {
      name: "Always show file extensions",
      description:
        "Reveals the real extension of every file. Worth turning on for safety alone: it exposes files like 'invoice.pdf.exe' that Windows otherwise hides.",
    },
    hide_taskbar_widgets: {
      name: "Hide Widgets from the taskbar",
      description:
        "Removes the weather/news Widgets button, which loads content in the background even when you never open it.",
    },
    network_latency: {
      name: "TCP acknowledgments and packet buffering",
      description:
        "Sets TcpAckFrequency and TCPNoDelay to 1 on the adapter that carries the route to the internet. This targets TCP behavior; UDP traffic is unaffected. Windows and application support vary, so lower game latency is not guaranteed.",
    },
    disable_window_animations: {
      name: "Instant window animations",
      description:
        "Removes the slide/fade animation Windows plays every time a window opens, closes or minimizes. The animation is pure waiting time - cutting it makes the desktop respond the moment you click, and frees the GPU work behind it.",
    },
    disable_drag_full_windows: {
      name: "Lighter window dragging",
      description:
        "Draws an outline while you drag a window instead of repainting its whole contents every frame. Barely noticeable on a fast GPU, a clear difference on integrated graphics or an older machine.",
    },
    mouse_hover_delay: {
      name: "Instant mouse hover response",
      description:
        "Windows waits 400 ms before reacting to the pointer resting on something - taskbar previews, tooltips, menu hovers. This drops that wait to almost nothing, so the interface follows the mouse instead of trailing it.",
    },
    disable_background_apps: {
      name: "Stop apps running in the background",
      description:
        "Stops Store apps from running, refreshing and polling the network while you are not using them. This is real CPU, RAM and battery spent on apps you did not open.",
    },
    disable_delivery_optimization: {
      name: "Disable peer-to-peer Windows Update sharing",
      description:
        "Sets Delivery Optimization to HTTP-only mode, stopping this PC from downloading update content from or uploading it to other PCs. Windows Update still downloads from Microsoft; this does not turn off the Delivery Optimization service or Windows Update.",
    },
    prevent_auto_restart_while_logged_on: {
      name: "Prevent scheduled Windows Update restarts while signed in",
      description:
        "Stops Windows Update from automatically restarting the PC for a scheduled update while someone is signed in. Updates can still download and install; this does not block a restart you request yourself. A security update that needs a restart is not fully active until the PC restarts, so staying signed in can delay protection. Keep Windows Update enabled and restart promptly.",
    },
    defer_quality_updates_7_days: {
      name: "Delay quality updates by 7 days",
      description:
        "Defers Windows quality updates, including monthly security fixes, for 7 days after release. Windows Update stays enabled; this is a short delay, not a pause or a block. Security fixes remain unapplied during the delay, so install urgent updates promptly and restart when Windows asks. Restoring this setting removes the deferral.",
    },
    defer_feature_updates_30_days: {
      name: "Delay feature updates by 30 days",
      description:
        "Defers offers of Windows feature updates by 30 days after release. Monthly quality and security updates continue on their normal schedule. This is not a version pin and does not extend support for your current Windows release; restoring this setting removes the deferral.",
    },
    exclude_windows_update_drivers: {
      name: "Exclude standalone driver updates from Windows Update",
      description:
        "Tells Windows Update to leave standalone driver-classified updates out of its normal quality-update cycle. Windows Update and security/quality updates remain enabled. Drivers bundled into security or critical updates, and drivers installed dynamically during feature updates, can still arrive. Vendor tools and manual installs are unaffected. You must manage standalone drivers yourself; while this is active, Windows Update's driver catalogue may show fewer or no offers. Restoring this setting allows Windows Update to offer drivers again.",
    },
    disable_copilot: {
      name: "Legacy Copilot policy (restore only)",
      description:
        "This retired policy does not control the current Copilot app. You can restore its saved registry value here. Manage the separate Copilot app in Debloat; removing it does not prevent future reinstallation.",
    },
    keyboard_delay_zero: {
      name: "Legacy KeyboardDelay value (restore only)",
      description:
        "Older versions wrote KeyboardDelay to the mouse settings key instead of the keyboard settings key. This entry only restores that old snapshot; use “Reduce input delay (keyboard)” for keyboard repeat.",
    },
    keyboard_speed_fast: {
      name: "Legacy KeyboardSpeed value (restore only)",
      description:
        "Older versions wrote KeyboardSpeed to the mouse settings key instead of the keyboard settings key. This entry only restores that old snapshot; use “Reduce input delay (keyboard)” for keyboard repeat.",
    },
    disable_suggested_apps: {
      name: "Stop Windows installing apps by itself",
      description:
        "Windows quietly installs “suggested” apps and games into your Start menu without asking, on a fresh install and again after big updates. This turns that off, so nothing lands on your machine that you didn't choose.",
    },
    disable_mouse_acceleration: {
      name: "Disable mouse acceleration",
      description:
        "Turns off “Enhance pointer precision”, which makes the cursor travel further when you move the mouse faster. That variable response is exactly what you don't want when aiming: the same physical flick should always cover the same distance on screen.",
    },
    disable_sticky_keys_prompt: {
      name: "Stop the Sticky Keys popup",
      description:
        "Tapping Shift five times normally opens the Sticky Keys dialog — which in a game means an alt-tab out of fullscreen at the worst possible moment, usually mid-fight. This disables the shortcut and its prompt; Sticky Keys itself stays available in Settings.",
    },
    disable_recall: {
      name: "Disable Recall (AI screen snapshots)",
      description:
        "Recall takes a screenshot of your desktop every few seconds and builds a searchable, AI-indexed history of everything you have looked at — passwords and private messages included, since it captures whatever is on screen. This sets the system policy that stops it analysing or storing anything.",
    },
    global_timer_resolution: {
      name: "Global timer resolution",
      description:
        "Sets the GlobalTimerResolutionRequests registry flag to 1. This does not itself request or verify a specific timer resolution. Behavior depends on the Windows version; lower latency or higher FPS is not guaranteed. Restart required.",
    },
    disable_core_parking: {
      name: "Disable core parking",
      description:
        "Stops Windows parking idle CPU cores while plugged in, so a core does not have to be woken before it can service input or a sudden burst of work. Applied to the mains profile only — on battery, parking is what it is there for. The plan's previous value is recorded and restored exactly on rollback (requires administrator rights).",
    },
    disable_memory_integrity: {
      name: "Disable Memory Integrity (VBS)",
      description:
        "Requests that Memory Integrity (HVCI) be disabled. If applied, this removes a layer of kernel protection; other VBS features may remain active. Performance impact varies by hardware and workload. Policy or UEFI lock may prevent the change. Restart and verify the status in Windows Security.",
    },
    disable_typing_personalization: {
      name: "Stop Windows learning how you type",
      description:
        "Windows builds a personal dictionary from what you type and handwrite — including in password managers, chat windows and search boxes — and syncs it to your Microsoft account to improve its suggestions. This turns off both the text and the handwriting collection.",
    },
    classic_context_menu: {
      name: "Bring back the full right-click menu",
      description:
        "Windows 11 hides most of the right-click menu behind “Show more options”, turning one click into two for things you do all day. This restores the complete Windows 10 menu everywhere in File Explorer and on the desktop. Explorer restarts to apply it, so open windows will flicker once.",
    },
    disable_transparency: {
      name: "Disable transparency effects",
      description:
        "Turns off the blur/acrylic effects in the taskbar and menus. Small but real GPU saving, and it makes older or integrated-graphics machines feel smoother.",
    },
    dark_mode: {
      name: "Dark mode",
      description: "Turns on dark theme for apps and system.",
    },
    show_hidden_files: {
      name: "Show hidden files",
      description: "Shows hidden files and folders in File Explorer.",
    },
    priority_separation: {
      name: "Optimize CPU priority",
      description:
        "Tunes Win32PrioritySeparation (0x26) so the foreground app gets short, variable CPU time slices with a 3x priority boost — the classic desktop/gaming responsiveness value.",
    },
    disable_game_dvr: {
      name: "Disable Xbox Game Bar / Game DVR",
      description:
        "Turns off Xbox Game Bar's background recording, which eats CPU/GPU while gaming.",
    },
    disable_telemetry_tasks: {
      name: "Reduce diagnostic data collection",
      description:
        "Sets the Windows diagnostic data policy to its lowest level. Home and Pro treat that as Required diagnostic data; only Enterprise and Education turn it off completely.",
    },
    reset_advertising_id: {
      name: "Disable advertising ID",
      description: "Stops apps from using your advertising ID for profiling.",
    },
    disable_location_tracking: {
      name: "Disable location tracking",
      description: "Blocks location access for all apps via system policy.",
    },
    disable_bing_search: {
      name: "Disable Bing search in the Start menu",
      description: "Stops your Start menu searches from being sent to Bing.",
    },
    power_plan_performance: {
      name: "High performance (power plan)",
      description:
        'Switches to the Windows "High performance" power plan. Useful on desktops or when plugged in; restores the previous plan on rollback.',
    },
    turbo_gaming: {
      name: "Turbo Gaming",
      description:
        "Preset: disables Game DVR, switches the power plan to High performance, and optimizes CPU priority (requires administrator rights).",
    },
    privacy_dns: {
      name: "Private DNS (Cloudflare)",
      description:
        "Switches to privacy-focused DNS servers (1.1.1.1), stopping your ISP from logging DNS lookups. Does not hide your IP address (that needs a VPN, see below).",
    },
    hardware_gpu_scheduling: {
      name: "Hardware-accelerated GPU scheduling",
      description:
        "Requests hardware-accelerated GPU scheduling (HAGS). Requires a compatible GPU, driver and Windows version. Performance and latency can improve, worsen or remain unchanged depending on the game. Restart and verify availability in Windows Graphics settings.",
    },
    reduce_input_lag: {
      name: "Reduce input lag (mouse)",
      description:
        'Disables pointer acceleration ("Enhance pointer precision") for 1:1 mouse movement, with no delay added by the system.',
    },
    turbo_boost: {
      name: "CPU Turbo Boost",
      description:
        "Sets boost mode to Aggressive on mains power and battery, and minimum processor state to 100% on mains power in the current power plan. Power use and heat may increase. CPU, firmware and thermal limits still apply; higher FPS is not guaranteed (administrator rights required).",
    },
    network_throttling_index: {
      name: "Disable multimedia network throttling",
      description:
        "Removes the limit Windows places on network traffic while multimedia/gaming apps are active, useful for reducing online micro-lag.",
    },
    system_responsiveness: {
      name: "Set MMCSS background CPU reserve",
      description:
        "Writes SystemResponsiveness=0, which Windows treats as 20%. This does not eliminate the CPU share for lower-priority tasks or prioritize every foreground app.",
    },
    games_task_priority: {
      name: "Set MMCSS Games task category",
      description:
        "Sets the Games task category to High for threads registered with MMCSS; High treats Priority as 2. The GPU and SFIO Priority values also written here are unused. This does not prioritize every game process.",
    },
    reduce_keyboard_delay: {
      name: "Reduce input delay (keyboard)",
      description:
        "Zeroes out the delay before a held key starts repeating and maximizes its repeat rate, for a snappier response in games.",
    },
    keep_kernel_in_ram: {
      name: "Keep the kernel and drivers in RAM",
      description:
        "Windows may page parts of the kernel and driver code out to disk even when memory is plentiful, and paging them back in is a stall you feel as a stutter. This keeps them resident. Worth it on machines with RAM to spare; on a low-memory PC leave it off.",
    },
    auto_end_frozen_tasks: {
      name: "Don't let a frozen app block shutdown",
      description:
        'When an application stops responding during shutdown, Windows waits and shows the "This app is preventing shutdown" screen until someone clicks it. This closes unresponsive apps automatically instead, so a hung program cannot leave the machine sitting powered on. Warning: automatically closing apps can lose unsaved work. Restoring this setting cannot recover that work.',
    },
    instant_folder_loading: {
      name: "Open every folder instantly",
      description:
        "Explorer inspects a folder's contents to guess whether it is Pictures, Music or Documents, and a folder holding thousands of media files can hang for seconds while it decides. This pins every folder to the general layout so it opens at once.",
    },
    tcp_congestion_bbr: {
      name: "Keep latency low when the line is busy (BBR2)",
      description:
        "Windows uses CUBIC, which speeds up until a buffer somewhere overflows - which is why your ping climbs the moment someone else in the house starts a download. BBR2 measures the line's real bandwidth and round trip instead and paces traffic to fit, so the pipe fills without the queue filling. Microsoft ships BBR2 in Windows 11; this switches the Internet template over to it, and switches back to exactly what was there before (requires administrator rights).",
    },
    taskbar_align_left: {
      name: "Align the taskbar to the left",
      description: "Moves taskbar icons back to the left (Windows 10 style) instead of centered.",
    },
    hide_taskbar_chat: {
      name: "Hide Chat/Teams from the taskbar",
      description: "Removes the Chat (Microsoft Teams) icon from the taskbar.",
    },
    disable_start_suggestions: {
      name: "Disable Start menu suggestions and recommended apps",
      description:
        "Stops Windows from showing recommended apps, ads, and suggestions in the Start menu.",
    },
    disable_activity_history: {
      name: "Disable activity history (Windows Timeline)",
      description:
        "Stops Windows from recording, saving, and sending Microsoft your app and document usage history, via system policy.",
    },
    hide_taskbar_search: {
      name: "Hide the search box from the taskbar",
      description:
        "Removes the search box/icon from the taskbar for a cleaner bar (search is still available from the Windows key).",
    },
    disable_fullscreen_optimizations_global: {
      name: "Disable fullscreen optimizations globally",
      description:
        "Forces DXGI to honor true exclusive fullscreen instead of Windows' simulated mode, reducing micro-stutter and input lag in many older games.",
    },
    disable_windows_search_service: {
      name: "Disable the indexing service (Windows Search)",
      description:
        "Stops and disables Windows' file indexing service, reducing background disk activity — useful on small SSDs or while gaming. Start menu file search becomes slower until you turn it back on (requires administrator rights).",
    },
    disable_dmwappush_service: {
      name: "Start the Device Management push service only when needed",
      description:
        "Stops the WAP Push Message Routing service and sets it to Manual, so it no longer starts with Windows but anything that asks for it can still start it.",
    },
    disable_diagtrack_service: {
      name: "Disable the telemetry service (Connected User Experiences)",
      description:
        "Stops and disables the Connected User Experiences and Telemetry service, which uploads usage and diagnostic data to Microsoft. Windows Update and error reporting keep working.",
    },
    enable_regback: {
      name: "Enable automatic registry backup (RegBack)",
      description:
        "Re-enables periodic automatic backups of the Windows registry hives to %SystemRoot%\\System32\\config\\RegBack for emergency recovery.",
    },
    explorer_anti_hang: {
      name: "Prevent File Explorer shortcut hangs",
      description:
        "Disables resolving target tracking and network search when opening shortcuts, preventing File Explorer from freezing when shortcuts point to disconnected drives or network shares.",
    },
    no_internet_open_with: {
      name: "Skip Microsoft Store query for unknown files",
      description:
        "Opens the local “Open with” application picker immediately instead of prompting to search the Microsoft Store when double-clicking unrecognized file types.",
    },
    detailed_bsod: {
      name: "Show detailed BSOD crash parameters",
      description:
        "Displays exact hexadecimal stop codes, faulting drivers, and memory addresses on blue screens instead of hiding them behind a generic QR code.",
    },
    disable_wpbt: {
      name: "Block WPBT UEFI software execution",
      description:
        "Prevents motherboard UEFI firmware from automatically installing OEM bloatware binaries into Windows via the Windows Platform Binary Table.",
    },
    disable_ndu: {
      name: "Disable NDU non-paged pool RAM leak",
      description:
        "Disables the Network Diagnostic Usage driver service, preventing high non-paged memory pool accumulation during large network downloads.",
    },
    disable_search_highlights: {
      name: "Disable search highlights and doodles",
      description:
        "Removes web search illustrations, daily Bing doodles, and dynamic trending topics from the Windows Search bar and taskbar search box.",
    },
    auto_complete_run: {
      name: "Enable Run dialog auto-completion",
      description:
        "Enables instant command auto-completion and suggestions in the Windows Run dialog (Win + R).",
    },
    disable_aero_shake: {
      name: "Disable Aero Shake window minimization",
      description:
        "Prevents shaking a window's title bar from accidentally minimizing all other background open windows.",
    },
    disable_remote_assistance: {
      name: "Disable Remote Assistance invitations",
      description:
        "Disables Windows Remote Assistance connections and invitations to protect against unsolicited remote support requests.",
    },
    disable_llmnr: {
      name: "Disable LLMNR protocol",
      description:
        "Disables Link-Local Multicast Name Resolution (LLMNR) to protect against local network spoofing and hash-harvesting attacks.",
    },
    disable_wifi_sense: {
      name: "Disable Wi-Fi Sense hotspot sharing",
      description:
        "Prevents Windows from automatically connecting to open Wi-Fi networks and sharing credentials with contacts.",
    },
    disable_cloud_search: {
      name: "Disable cloud search in Windows search",
      description:
        "Stops Windows Search from querying cloud account history and Microsoft account search logs when looking for local files.",
    },
    disable_app_suggestions_start: {
      name: "Disable Start menu suggestions and tips",
      description:
        "Turns off promotional application suggestions and feature tips inside the Windows Start menu.",
    },
    disable_handwriting_sharing: {
      name: "Disable handwriting error report sharing",
      description:
        "Prevents Windows from transmitting handwriting recognition error logs and stroke samples to Microsoft.",
    },
    disable_ceip: {
      name: "Disable Customer Experience Improvement Program",
      description:
        "Turns off the Windows SQM telemetry client for the Customer Experience Improvement Program (CEIP).",
    },
    disable_lockscreen_camera: {
      name: "Disable lock screen camera",
      description:
        "Disables the lock screen camera gesture and button to prevent photo capture without unlocking the device.",
    },
    disable_cortana_consent: {
      name: "Disable Cortana search consent",
      description:
        "Disables Cortana search consent to stop search queries and voice data from being shared with Microsoft cloud services.",
    },
    disable_wer_queuing: {
      name: "Disable Windows error report queuing",
      description:
        "Prevents Windows Error Reporting from saving and queuing crash reports on disk for later transmission.",
    },
    disable_experimentation: {
      name: "Disable Windows experimentation telemetry",
      description:
        "Disables Microsoft A/B testing and experimentation features on Windows, keeping features consistent and predictable.",
    },
    disable_app_inventory_collection: {
      name: "Disable Application Compatibility Inventory",
      description:
        "Disables the Application Compatibility Inventory collector that scans installed software and reports application catalogs to Microsoft.",
    },
    disable_problem_steps_recorder: {
      name: "Disable Problem Steps Recorder telemetry",
      description:
        "Disables Problem Steps Recorder (PSR) error capture and diagnostic data submission.",
    },
    disable_ait_telemetry: {
      name: "Disable Application Impact Telemetry",
      description:
        "Disables Application Impact Telemetry (AIT) data collection across software launches.",
    },
    disable_smartscreen_app_install: {
      name: "Disable SmartScreen app install telemetry",
      description:
        "Disables SmartScreen application installation telemetry and URL lookup queries.",
    },
    disable_online_speech_privacy: {
      name: "Disable online speech recognition data collection",
      description:
        "Disables cloud speech recognition data harvesting for voice typing and speech models.",
    },
    disable_edge_shopping: {
      name: "Disable Edge shopping assistant",
      description: "Disables Microsoft Edge shopping assistant and coupon tracking telemetry.",
    },
    disable_edge_metrics: {
      name: "Disable Edge diagnostic metrics reporting",
      description:
        "Disables Microsoft Edge usage metrics and diagnostic crash report transmission.",
    },
    disable_edge_startup_boost: {
      name: "Disable Edge Startup Boost",
      description:
        "Disables Edge Startup Boost, preventing Edge background processes from launching at Windows boot.",
    },
    disable_edge_background_mode: {
      name: "Disable Edge background extensions mode",
      description:
        "Prevents Microsoft Edge from running in the background when closed, freeing system memory.",
    },
    disable_bluetooth_le_discovery: {
      name: "Disable background Bluetooth LE scanning",
      description:
        "Disables continuous background Bluetooth Low Energy scanning to reduce background CPU cycles and power drain.",
    },
    disable_edge_wallet: {
      name: "Disable Edge wallet autofill suggestions",
      description:
        "Prevents Microsoft Edge from querying payment and wallet services automatically.",
    },
    disable_cortana_above_lock: {
      name: "Disable Cortana above lock screen",
      description:
        "Prevents voice assistants and search from listening or activating while your screen is locked.",
    },
    disable_device_history: {
      name: "Disable Windows device activity history",
      description: "Stops Windows from recording and tracking app and file history on this device.",
    },
    disable_search_history: {
      name: "Disable taskbar search history",
      description:
        "Disables tracking and storing past search queries in the taskbar and Start menu search box.",
    },
    disable_news_and_interests: {
      name: "Disable News and Interests taskbar feed",
      description:
        "Hides the weather and news widget on the Windows taskbar, saving background network and memory.",
    },
    disable_auto_maintenance_wake: {
      name: "Disable wake-to-run automatic maintenance",
      description:
        "Prevents Windows Automatic Maintenance from waking your computer or draining laptop battery overnight.",
    },
    disable_diagnostic_data_viewer: {
      name: "Disable diagnostic data local datastore",
      description:
        "Stops Windows diagnostic telemetry from reserving and writing local telemetry database caches on disk.",
    },
    disable_activity_feed: {
      name: "Disable Windows activity feed and timeline",
      description:
        "Prevents Windows from generating timeline graphs and tracking cross-device user activities.",
    },
    disable_publish_user_activities: {
      name: "Disable publishing user activities to cloud",
      description:
        "Prevents Windows from publishing activity timeline history to Microsoft cloud services.",
    },
    disable_typing_insights: {
      name: "Disable typing insights telemetry",
      description:
        "Prevents Windows from analyzing your keystroke patterns and autocomplete statistics.",
    },
    disable_inking_typing_personalization: {
      name: "Disable inking and typing personalization",
      description:
        "Prevents Windows from sending local handwriting and typing dictionary data to Microsoft.",
    },
    disable_shared_experiences: {
      name: "Disable Connected Devices cross-device sharing",
      description:
        "Disables Connected Devices Platform (CDP) background synchronization across your accounts.",
    },
    disable_remote_desktop: {
      name: "Disable Remote Desktop inbound connections",
      description:
        "Blocks incoming RDP remote desktop connections to reduce network attack surface.",
    },
    disable_edge_collections: {
      name: "Disable Microsoft Edge Collections",
      description:
        "Disables Edge Collections and background sync to minimize browser resource footprint.",
    },
    disable_edge_quick_search: {
      name: "Disable Edge desktop search bar widget",
      description:
        "Prevents Microsoft Edge from displaying floating search widgets on the Windows desktop.",
    },
    disable_edge_personalization: {
      name: "Disable Edge personalization and browsing telemetry",
      description:
        "Disables reporting browsing history and personal advertising profiles inside Microsoft Edge.",
    },
    disable_lockscreen_spotlight: {
      name: "Disable Windows Spotlight on lock screen",
      description:
        "Stops Windows Spotlight from downloading promotional wallpaper images and tips on the lock screen.",
    },
    disable_push_install_service: {
      name: "Disable Windows PushToInstall remote app service",
      description:
        "Prevents Microsoft Store from pushing app installations to this PC remotely from the web.",
    },
    disable_compatibility_assistant: {
      name: "Disable Program Compatibility Assistant",
      description:
        "Disables Program Compatibility Assistant popups and background application scans when launching legacy tools.",
    },
    disable_cortana_cloud_search: {
      name: "Disable Windows Search cloud indexer",
      description:
        "Prevents Windows Search from querying cloud indices and Bing servers when searching local files.",
    },
    disable_find_my_device: {
      name: "Disable Find My Device tracking",
      description:
        "Disables continuous GPS and Wi-Fi location broadcasting for Find My Device services.",
    },
    disable_sensors_data_collection: {
      name: "Disable hardware sensors data collection",
      description:
        "Disables background sensor monitoring (ambient light, accelerometer) and location polling.",
    },
    disable_location_scripting: {
      name: "Disable location scripting access",
      description:
        "Prevents background scripts and browser engines from querying device physical location.",
    },
    disable_advertising_info: {
      name: "Disable Windows advertising info policy",
      description:
        "Enforces a group policy lock disabling advertising ID tracking system-wide for all users.",
    },
    disable_sync_settings: {
      name: "Disable Windows Settings cloud sync",
      description:
        "Stops Windows from syncing your personalization, passwords, and system preferences to Microsoft servers.",
    },
    disable_app_diagnostics_access: {
      name: "Disable app access to diagnostic information",
      description:
        "Blocks third-party Store applications from reading diagnostic information and system telemetry.",
    },
    svchost_split_threshold: {
      name: "Consolidate service host processes",
      description:
        "Groups non-critical background services into shared host processes to reduce idle process counts and memory overhead.",
    },
    disable_8dot3_names: {
      name: "Disable legacy NTFS 8.3 short names",
      description:
        "Stops generating legacy 8.3 short file names on NTFS drives to speed up directory lookups and file operations.",
    },
    disable_ntfs_last_access: {
      name: "Disable NTFS last access timestamps",
      description:
        "Eliminates disk write overhead by no longer recording access timestamps whenever files or folders are read.",
    },
    disable_autologger_diagtrack: {
      name: "Disable DiagTrack autologger session",
      description:
        "Stops continuous circular disk logging for the Connected User Experiences and Telemetry ETW session.",
    },
    disable_autologger_sqm: {
      name: "Disable SQM autologger session",
      description:
        "Stops background disk logging for the Software Quality Metrics (SQM) telemetry logger.",
    },
    disable_autologger_ait: {
      name: "Disable AIT event autologger session",
      description:
        "Stops background ETW event logging for the Application Inventory and Telemetry (AIT) service.",
    },
    disable_autologger_diaglog: {
      name: "Disable Diagnostic autologger session",
      description: "Stops circular disk logging for Windows diagnostic and fault-tracing sessions.",
    },
    disable_autologger_wifisession: {
      name: "Disable Wi-Fi diagnostic autologger session",
      description:
        "Stops continuous diagnostic telemetry logging of Wi-Fi connection states and hotspot transitions.",
    },
    disable_wersvc_service: {
      name: "Start Windows Error Reporting only when needed",
      description:
        "Stops the Windows Error Reporting Service (WerSvc) and sets it to Manual, reducing background crash monitoring overhead.",
    },
    disable_mapsbroker_service: {
      name: "Disable the Downloaded Maps Manager service",
      description:
        "Stops and disables the Downloaded Maps Manager service (MapsBroker), preventing background network checks and disk reads for map packages.",
    },
    disable_lfsvc_service: {
      name: "Start the Geolocation service only when needed",
      description:
        "Stops the Windows Geolocation Service (lfsvc) and sets it to Manual, preventing continuous background sensor polling.",
    },
    ads_in_settings: {
      name: "Hide promotional content in Settings",
      description:
        "Sets the per-user SubscribedContent-338393Enabled value to 0. It does not change the other Windows suggestion surfaces.",
    },
    quick_access_no_cloud: {
      name: "Hide cloud files in Quick Access",
      description:
        "Sets ShowCloudFilesInQuickAccess to 0. Recent and Frequent items use separate settings and are not changed.",
    },
    hide_gallery_explorer: {
      name: "Hide Gallery in File Explorer",
      description:
        "Sets the per-user HideGallery value to 1. This hides the Gallery navigation entry; it does not delete or move photos.",
    },
    snap_assist_off: {
      name: "Limit Snap Assist suggestions",
      description:
        "Turns off the Snap Assist suggestions setting. It does not change the separate Snap Layouts flyout setting, so some snap-related prompts may remain.",
    },
    alt_tab_no_browser_tabs: {
      name: "Show windows, not Edge tabs, in Alt+Tab",
      description:
        "Stops Microsoft Edge tabs from appearing as separate Alt+Tab entries. Open tabs remain open; only the task switcher changes.",
    },
    taskbar_button_combining: {
      name: "Combine taskbar buttons",
      description:
        "Sets TaskbarGlomLevel to 0, grouping windows from the same app under one taskbar button. Individual windows may be less visible.",
    },
    no_toasts_fullscreen_video: {
      name: "Turn off notification toasts",
      description:
        "Sets NOC_GLOBAL_SETTING_TOASTS_ENABLED to 0. This may suppress notification toasts outside full-screen video too.",
    },
    no_window_snap_drag: {
      name: "Turn off snap while dragging windows",
      description:
        "Sets WindowArrangementActive to 0 to disable snap arrangements triggered by dragging a window. Other window-management shortcuts may still work.",
    },
    ui_classic_context_menu: {
      name: "Show the classic right-click menu",
      description:
        "Creates a per-user Explorer override for the classic context menu instead of the compact Windows 11 menu. Restarting Explorer or signing out may be needed.",
    },
  },
  cleanup: {
    temp_cleanup: {
      name: "Clean temporary files",
      description:
        "Moves the contents of %TEMP% to the Recycle Bin: you can recover it any time, it's not a permanent delete.",
    },
    winupdate_cache_cleanup: {
      name: "Clear Windows Update cache",
      description:
        "Moves already-installed Windows Update packages to the Recycle Bin (requires administrator rights).",
    },
  },
};
