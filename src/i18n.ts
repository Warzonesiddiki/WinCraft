import { en as enTable } from "./locales/en";

export type Lang = "it" | "en" | "fr" | "es" | "de" | "pt";

export const LANGUAGES: { code: Lang; native: string }[] = [
  { code: "it", native: "Italiano" },
  { code: "en", native: "English" },
  { code: "fr", native: "Français" },
  { code: "es", native: "Español" },
  { code: "de", native: "Deutsch" },
  { code: "pt", native: "Português (Portugal)" },
];

export interface TweakText {
  name: string;
  description: string;
}

export interface Strings {
  appName: string;
  appliedCount: string; // "{applied} of {total} tweaks active" — use {applied}/{total}
  headerNote: string;
  advisor: {
    eyebrow: string;
    applyButton: string;
    confidenceHigh: string;
    confidenceStandard: string;
    reversible: string;
    empty: string;
  };
  drift: {
    // Two titles, because the card describes two different situations and a
    // title blaming Windows above a body saying Windows was not involved
    // contradicts itself.
    titleAfterUpdate: string;
    titleNoUpdate: string;
    // Singular and plural spelled out: there is no plural helper in this
    // file, and "1 tweak non risultano" is the kind of sentence that makes a
    // product feel machine-made.
    afterUpdateOne: string; // uses {patch}
    afterUpdateMany: string; // uses {count} {patch}
    noUpdateOne: string;
    noUpdateMany: string; // uses {count}
    reapplyOne: string;
    reapplyMany: string; // uses {count}
    reapplying: string;
    reappliedOne: string;
    reappliedMany: string; // uses {count}
    pickHint: string;
  };
  crashes: {
    title: string;
    subtitle: string;
    copy: string;
    copied: string;
    clear: string;
    cleared: string;
    processApp: string;
    processElevated: string;
  };
  ledger: {
    title: string;
    subtitle: string;
    empty: string;
    clear: string;
    clearing: string;
    cleared: string;
    revert: string;
    elevated: string;
    failed: string;
    guardPaused: string;
    guardResumed: string;
    processes: string; // uses {count}
    restored: string;
    postponed: string;
    actions: {
      applied: string;
      reverted: string;
      cleanup: string;
      filesDeleted: string;
      diskOptimize: string;
      startupChange: string;
      restorePoint: string;
      processGuard: string;
      coreSteering: string;
      ramTrim: string;
      autoReverted: string;
      priorityRule: string;
      scheduledCleanup: string;
      ecoqos: string;
    };
  };
  tabs: {
    groupWorkspace: string;
    overview: string;
    groupMonitor: string;
    groupOptimize: string;
    groupManage: string;
    scan: string;
    health: string;
    hardware: string;
    performance: string;
    privacy: string;
    ui: string;
    maintenance: string;
    gaming: string;
    startup: string;
    profiles: string;
    pricing: string;
    ledger: string;
  };
  healthPanel: {
    title: string;
    subtitle: string;
    why: string;
    refresh: string;
    compute: string;
    computing: string;
    idleHint: string;
    showMore: string;
    showLess: string;
    stageProfile: string;
    stageTweaks: string;
    stageSecurity: string;
    stageScoring: string;
    verdictExcellent: string;
    verdictGood: string;
    verdictFair: string;
    verdictNeedsWork: string;
    changeSinceLast: string;
    changeNone: string;
    changeFirstRun: string;
    changeWhyTitle: string;
    changeContributes: string;
    changeStructural: string;
    changeTrend: string;
    categories: {
      performance: string;
      gaming: string;
      responsiveness: string;
      memory: string;
      storage: string;
      startup: string;
      maintenance: string;
      privacy: string;
      security: string;
    };
  };
  transparency: {
    title: string;
    key: string;
    value: string;
    setsTo: string;
    note: string;
    kindRegistry: string;
    kindCommand: string;
    kindService: string;
    copy: string;
    copied: string;
  };
  command: {
    statusQuiet: string;
    statusScanning: string;
    statusFindings: string; // uses {count}
    domainsLine: string;
    consent: string;
    runScan: string;
    reviewFindings: string; // uses {count}
    memTitle: string;
    pressureLow: string;
    pressureElevated: string;
    pressureHigh: string;
    memReview: string;
    memTopTitle: string;
    trimTitle: string;
    trimExplainer: string;
    trimButton: string;
    autoTitle: string;
    profilesTitle: string;
    profileGame: string;
    profileGameDesc: string;
    profileFocus: string;
    profileFocusDesc: string;
    profileQuiet: string;
    profileQuietDesc: string;
    profileDownload: string;
    profileDownloadDesc: string;
    previewBtn: string;
    gameChange1: string;
    gameChange2: string;
    gameChange3: string;
    previewReq: string;
    previewCost: string;
    previewRevert: string;
    applySession: string;
    restoreSession: string;
    statusActive: string;
    statusOff: string;
    soon: string;
  };
  systemMonitor: {
    cpu: string;
    ram: string;
    disk: string;
    uptime: string;
    uptimeValue: string; // uses {hours} {minutes}
    cores: string; // uses {count}
  };
  startupManager: {
    title: string;
    description: string;
    empty: string;
    activeCount: string; // uses {enabled} {total}
    machineWide: string;
    impactNote: string;
    refresh: string;
    refreshing: string;
    hiddenOrphans: string;
    /** Which of Windows' three startup mechanisms a row came from. */
    locationRun: string;
    locationRun32: string;
    locationFolder: string;
  };
  systemRepair: {
    title: string;
    description: string;
    adminNote: string;
    timeNote: string;
    checkButton: string;
    checking: string;
    cleanupButton: string;
    cleaningUp: string;
    cleanupNote: string;
    runningNote: string;
    cannotStop: string;
    stepQuick: string;
    stepScan: string;
    stepRestore: string;
    stepSfc: string;
    stepCleanup: string;
    stepOf: string; // uses {index} {total}
    statusHealthy: string;
    statusRepairable: string;
    statusRepaired: string;
    statusUnrepairable: string;
    statusCompleted: string;
    hintUnrepairable: string;
    hintCompleted: string;
    logTitle: string;
    askRepair: string;
    askRepairYes: string;
    askRepairNo: string;
    repairAnyway: string;
    elapsed: string; // uses {time}
    holdingAt: string; // uses {percent} {time}
    remaining: string; // uses {minutes}
    underMinute: string;
    estimating: string;
    statElapsed: string;
    statRemaining: string;
    statFinish: string;
    waiting: string;
  };
  cookieCleaner: {
    title: string;
    description: string;
    scanButton: string;
    scanning: string;
    cleanButton: string;
    cleaning: string;
    noneFound: string;
    totals: string; // uses {removable} {protected}
    runningWarning: string; // uses {browser}
    backupNote: string;
    restoreButton: string;
    restoring: string;
    restoredToast: string; // uses {browser}
    cleanedToast: string; // uses {removed} {kept}
    nothingToClean: string;
    topDomains: string;
    whitelistTitle: string;
    whitelistNote: string;
    whitelistPlaceholder: string;
    whitelistAdd: string;
    whitelistRemove: string;
    whitelistReset: string;
  };
  appCache: {
    title: string;
    description: string;
    scanButton: string;
    scanning: string;
    cleanButton: string;
    cleaning: string;
    noneFound: string;
    permanentNote: string;
    blockedBy: string; // uses {process}
    selectedTotal: string; // uses {size}
    cleanedToast: string; // uses {freed}
    skippedNote: string; // uses {count}
    catShaders: string;
    catLaunchers: string;
    catApps: string;
    catDev: string;
    catWindows: string;
    /** Display name per cache id; falls back to the Rust-side English name. */
    names: Record<string, string>;
  };
  scheduledTasks: {
    title: string;
    description: string;
    empty: string;
    activeCount: string; // uses {enabled} {total}
    triggerLogon: string;
    triggerBoot: string;
    refresh: string;
    refreshing: string;
    note: string;
  };
  search: {
    placeholder: string;
    noResults: string; // uses {query}
    clear: string;
  };
  pricing: {
    title: string;
    intro: string;
    planName: string;
    planTagline: string;
    priceAmount: string;
    priceNote: string;
    features: string[];
    commitmentTitle: string;
    commitmentBody: string;
  };
  toggle: { on: string; off: string };
  driverBooster: {
    title: string;
    subtitle: string;
    scan: string;
    scanning: string;
    selectAll: string;
    selectNone: string;
    selectedCount: string;
    pagesForSelection: string;
    openSelected: string;
    opened: string;
    openedCapped: string;
    allCurrent: string;
    nothingActionable: string;
    note: string;
  };
  secureDefrag: {
    title: string;
    willDefrag: string;
    willRetrim: string;
    start: string;
    running: string;
    working: string;
    phaseAnalyze: string;
    phaseOptimize: string;
    analysisTitle: string;
    doneDefrag: string;
    doneRetrim: string;
    note: string;
  };
  zeroTrace: {
    title: string;
    subtitle: string;
    purgeTitle: string;
    purgeBody: string;
    purgeButton: string;
    purging: string;
    purgeResult: string;
    purgeLimit: string;
    shredTitle: string;
    shredBody: string;
    shredButton: string;
    shredding: string;
    shredDone: string;
    shredSummary: string;
    shredWarning: string;
    ssdCaveat: string;
  };
  hud: {
    title: string;
    subtitle: string;
    fpsAbout: string;
    fpsLowExplained: string;
    fpsStart: string;
    fpsStop: string;
    fpsNeedsAdmin: string;
    fpsRunning: string;
    show: string;
    hide: string;
    lock: string;
    unlock: string;
    dragHint: string;
    lockedHint: string;
    sizeCompact: string;
    sizeNormal: string;
  };
  updater: {
    title: string; // uses {version}
    body: string;
    install: string;
    later: string;
    downloading: string; // uses {percent}
    installing: string;
    error: string; // uses {message}
    checkFailed: string; // uses {message}
  };
  badges: { admin: string; soon: string };
  emptyCategory: string;
  gameSessions: {
    title: string;
    subtitle: string;
    active: string; // uses {name}
    gamesCount: string; // uses {count}
    addGame: string;
    steeringTitle: string;
    steeringVcache: string; // uses {count}
    steeringHybrid: string; // uses {game} {background}
    steeringNone: string;
    steeringActive: string; // uses {count}
    steeringActiveVcache: string;
    steeringNeedsSessions: string;
  };
  latencyTrace: {
    title: string;
    subtitle: string;
    duration: string;
    secondsOption: string;
    run: string;
    running: string;
    dpcSummary: string;
    isrSummary: string;
    colDriver: string;
    colDpc: string;
    colIsr: string;
    colOver: string;
    unattributed: string;
    lost: string;
    hidden: string;
    verdictGood: string;
    verdictBad: string;
    note: string;
    verdictMinor: string;
    verdictBadUnattributed: string;
    spikesTitle: string;
    spikeLine: string;
  };
  networkCheck: {
    title: string;
    subtitle: string;
    run: string;
    running: string;
    offline: string;
    rtt: string;
    jitter: string;
    loss: string;
    tcpRtt: string;
    nagleOn: string;
    nagleOff: string;
    buffers: string;
    lastTitle: string;
    verdictNone: string;
    verdictInconclusive: string;
    verdictLineChanged: string;
    socketsBeforeAfter: string;
    stateOn: string;
    stateOff: string;
  };
  turboBoost: {
    title: string;
    subtitle: string;
    startLabel: string;
    stopLabel: string;
    activating: string;
    deactivating: string;
    active: string;
    inactive: string;
    /** The real steps the Rust side performs, shown as it works through them. */
    loadLabel: string;
    loadCadence: string;
    ownLoad: string; // uses {own} {rest}: the app's own CPU share and everything else's
    stageReading: string;
    stageRaising: string;
    stageApplying: string;
    /** Benchmark stages and the measured outcome. */
    stageMeasuringBefore: string;
    stageMeasuringAfter: string;
    factAverage: string;
    factFastest: string;
    factPeak: string;
    factFloor: string;
    ofBase: string; // uses {pct}
    usersTitle: string;
    appliedAt: string; // uses {time}
    planAlreadyUses: string;
    planAlreadyHad: string;
    loadExplain: string;
    chartLoad: string;
    chartSpeed: string;
    testTitle: string;
    testHint: string;
    testRun: string;
    testRunning: string;
    colDefault: string;
    colBoost: string;
    rowWork: string;
    rowAvg: string;
    rowPeak: string;
    rowTemp: string;
    notRun: string;
    relative: string;
  };
  profiles: {
    title: string;
    subtitle: string;
    saveHeading: string;
    namePlaceholder: string;
    saveButton: string;
    savedHeading: string;
    empty: string;
    tweakCount: string; // uses {count}
    apply: string;
    applying: string;
    exportButton: string;
    importButton: string;
    deleteButton: string;
    savedToast: string; // uses {name}
    appliedToast: string; // uses {count}
    exportedToast: string;
    importedToast: string; // uses {count}
    droppedWarning: string; // uses {count}
    nameRequired: string;
    reviewNotice: string;
    signInRequired: string;
  };
  scan: {
    lastScan: string;
    neverScanned: string;
    extraChecks: string;
    checksHint: string;
    unavailable: string;
    startupSummary: string;
    tasksSummary: string;
    partialScan: string;
    scanFailed: string;
    title: string;
    subtitle: string;
    startLabel: string;
    stepPerformance: string;
    stepPrivacy: string;
    stepGaming: string;
    stepJunk: string;
    allGood: string;
    issuesFound: string; // uses {count}
    selectAll: string;
    deselectAll: string;
    fixAll: string;
    fixing: string; // uses {done} {total}
    fixedToast: string; // uses {count}
    scanAgain: string;
    /** Hardware-derived verdicts shown under a scanned item. */
    verdictRecommended: string;
    verdictNotRecommended: string;
    verdictUnsupported: string;
    /** Keyed by `reason_key` from the Rust recommendation engine. */
    reasons: {
      laptop_battery: string;
      hdd_index_cost: string;
      fast_disk_no_gain: string;
      needs_win10_2004: string;
      weak_gpu: string;
    };
    /** The hardware strip shown above the scan button. */
    thisPc: string;
    dashDrivesTitle: string;
    dashFreeOf: string; // uses {free} {total}
    dashAlmostFull: string;
    dashStartupTitle: string;
    dashStartupCount: string; // uses {on} {total}
    dashManage: string;
    dashUptimeTitle: string;
    dashUptimeDh: string; // uses {days} {hours}
    dashUptimeHm: string; // uses {hours} {minutes}
    dashUptimeLongHint: string;
    dashHistoryTitle: string;
    dashHistoryEmpty: string;
    dashActTweakApplied: string;
    dashActTweakReverted: string;
    dashActCleanup: string;
    dashActFilesDeleted: string;
    dashActStartupChange: string;
    dashActDiskOptimize: string;
    dashActRestorePoint: string;
    profileUnknown: string;
    diskHdd: string;
    diskSsd: string;
    diskNvme: string;
    formDesktop: string;
    formLaptop: string;
    /** Result groups, ordered by how much the hardware argues for them. */
    groupRecommended: string;
    groupOptional: string;
    groupNotRecommended: string;
    tailoredNote: string;
    /** The two primary actions, each carrying its own count. */
    fixRecommended: string; // uses {count}
    fixEverything: string; // uses {count}
    nothingSelected: string;
    foundHeadline: string; // uses {count}
    foundNone: string;
    doneTitle: string;
    doneBody: string; // uses {count}
    fixHeading: string;
  };
  ram: {
    title: string;
    subtitle: string;
    button: string;
    cleaning: string;
    freed: string; // uses {amount}
    freedNothing: string;
    inUse: string; // uses {used} {total}
    autoLabel: string;
    autoOff: string;
    autoEvery: string; // uses {interval}
    autoHint: string;
    autoNext: string; // uses {time}
    autoDue: string;
    autoLast: string; // uses {time} and {amount}
    autoNoneYet: string;
    autoFailed: string; // uses {detail}
    autoNeedsAdmin: string;
    autoPausedNotAdmin: string;
  };
  restore: {
    button: string;
    title: string;
    body: string; // uses {count}
    confirm: string;
    cancel: string;
    running: string;
    doneToast: string; // uses {count}
    nothingToast: string;
  };
  passwordCheck: {
    title: string;
    description: string;
    placeholder: string;
    button: string;
    checking: string;
    safe: string;
    breached: string; // uses {count}
    error: string;
  };
  cleanupConfirm: {
    previewLoading: string;
    previewEmpty: string;
    previewNotAccessible: string;
    previewTruncated: string;
    selectedSummary: string; // uses {count} {size}
    confirmSelected: string;
    title: string;
    body: string; // uses {name}
    confirm: string;
    cancel: string;
  };
  cleanupButton: string;
  cleanupRunning: string;
  cleanupResultToast: string; // uses {deleted} {freed} {skipped}
  cleanupResultToastSkipped: string; // appended fragment, uses {skipped}
  diskOptimize: {
    title: string;
    description: string;
    button: string;
    running: string;
    cannotStop: string;
    resultToast: string; // uses {media}
  };
  dnsFlush: {
    title: string;
    description: string;
    button: string;
    running: string;
    resultToast: string;
  };
  browserCleanup: {
    title: string;
    description: string;
    noneFound: string;
    cache: string;
    cookies: string;
    clearButton: string;
    clearing: string;
    runningWarning: string; // uses {browser}
    clearedToast: string; // uses {browser} {freed}
  };
  tweakyDriverPromo: {
    title: string;
    description: string;
    button: string;
    error: string;
  };
  redaxaPromo: {
    title: string;
    description: string;
    button: string;
  };
  uninstallerPromo: {
    title: string;
    description: string;
    button: string;
    confirmTitle: string;
    confirmBody: string;
    confirmUnsigned: string;
    confirmDownload: string;
    confirmOpenPage: string;
    cancel: string;
  };
  live: {
    title: string;
    subtitle: string;
    paused: string;
    pausedHint: string;
    measuring: string;
    smooth: string;
    busy: string;
    strained: string;
    verdictDetail: string;
    failed: string;
    cpu: string;
    speed: string;
    cores: string;
    core: string;
    memory: string;
    used: string;
    cached: string;
    free: string;
    total: string;
    cachedHint: string;
    notAvailable: string;
    disk: string;
    read: string;
    write: string;
    systemDrive: string;
    network: string;
    down: string;
    up: string;
    gpu: string;
    gpuLoad: string;
    temp: string;
    fan: string;
    vram: string;
    sensors: string;
    sensorsHint: string;
    now: string;
    secondsAgo: string;
    activity: string;
    zoomShort: string;
    zoomLong: string;
    minutesAgo: string;
    peak: string;
    insightCalm: string;
    insightRecovering: string;
    insightMemory: string;
    insightCpu: string;
    insightDrive: string;
    actionStartup: string;
    actionCleanup: string;
    usingTitle: string;
    usingHint: string;
    usingCpu: string;
    usingMemory: string;
    processes: string;
    processOne: string;
  };
  pageError: {
    title: string;
    body: string;
    reload: string;
    reloadApp: string;
    details: string;
    appTitle: string;
    appBody: string;
  };
  folderScan: {
    stop: string;
    stopping: string;
    stoppedEmpty: string;
    stoppedPartial: string;
  };
  largeFiles: {
    title: string;
    description: string;
    chooseFolder: string;
    scanning: string;
    noneFound: string; // uses {size}
    foundCount: string; // uses {count}
    moveSelected: string; // uses {count}
    deleting: string;
    deletedToast: string; // uses {count} {freed}
  };
  diskHealth: {
    title: string;
    freeSpace: string; // uses {size}
    selectDrive: string;
    healthy: string;
    warning: string;
    unhealthy: string;
    unknown: string;
    loading: string;
  };
  duplicateFinder: {
    title: string;
    description: string;
    chooseFolder: string;
    scanning: string;
    noneFound: string;
    copies: string; // uses {count} {size}
    moveSelected: string; // uses {count}
    deleting: string;
    deletedToast: string; // uses {count} {freed}
  };
  ipMask: {
    title: string;
    description: string;
    button: string;
    explainerToast: string;
  };
  toasts: {
    applied: string; // uses {name}
    rolledBack: string; // uses {name}
    elevationDeclined: string;
    accountRefreshFailed: string;
  };
  titlebar: {
    applied: string; // uses {applied} and {total}
    cpu: string;
    ram: string;
    minimize: string;
    maximize: string;
    restore: string;
    close: string;
  };
  x3d: {
    title: string;
    subtitle: string;
    cpuLabel: string;
    readyHeadline: string; // uses {cores}
    readyBody: string;
    singleDie: string;
    uniformCache: string;
    unavailable: string;
    dieLabel: string; // uses {index}
    dieCache: string; // uses {mb}
    dieThreads: string; // uses {count}
    vcacheBadge: string;
    processesTitle: string;
    processesHint: string;
    refresh: string;
    refreshing: string;
    align: string;
    reset: string;
    alignedBadge: string;
    noProcesses: string;
    persistenceNote: string;
    alignedToast: string; // uses {name}
    resetToast: string; // uses {name}
  };
  hardware: {
    intro: string;
    gpuLabel: string;
    cpuLabel: string;
    liveBadge: string;
    gpuDriver: string; // uses {version}
    load: string;
    vram: string;
    fan: string;
    power: string;
    fanIdle: string;
    powerLimit: string; // uses {limit}
    tempCool: string;
    tempGood: string;
    tempWarm: string;
    tempHot: string;
    traceLabel: string;
    traceRange: string; // uses {min} and {max}
    noTempSensor: string;
    cpuAcpiSource: string;
    cpuNoSensor: string;
    noGpuTool: string;
    thermalsUnavailable: string;
    driversTitle: string;
    driversSubtitle: string;
    driversRescan: string;
    driversScanning: string;
    driversCounted: string; // uses {count}
    driversAging: string; // uses {count}
    driversStale: string; // uses {count}
    driversAllCurrent: string;
    driversNone: string;
    driversShowAll: string; // uses {count}
    driversShowLess: string;
    driversInboxNote: string; // uses {count}
    ageYears: string; // uses {years}
    ageYear: string; // uses {years}, singular form
    ageMonths: string; // uses {months}
    ageMonth: string; // uses {months}, singular form
    vendorSite: string;
    watchLabel: string;
    peakLabel: string;
    verdictRisky: string;
    verdictNormal: string;
    verdictBetter: string;
    verdictIdle: string;
    verdictRiskyHint: string;
    verdictNormalHint: string;
    verdictBetterHint: string;
    verdictIdleHint: string;
    profilesTitle: string;
    profilesSubtitle: string;
    currentLimit: string; // uses {watts}
    modeSilent: string;
    modeSilentHint: string;
    modeStandard: string;
    modeStandardHint: string;
    modeGaming: string;
    modeGamingHint: string;
    modeApplying: string;
    profileStageReading: string;
    profileStageApplying: string;
    profileStageSettling: string;
    profileApplied: string; // uses {watts}
    profileNote: string;
    profileDefaultIsMax: string;
    driverInstalled: string; // uses {version} and {date}
    driversNoUpdateCheck: string;
    driversHardwareChanged: string;
    driversCheckedAt: string; // uses {time}
    modeClockLocked: string; // uses {mhz}
    modeClockAuto: string;
    profileApply: string;
    profileActive: string;
    profileWillSet: string; // uses {watts} and {clock}
    scanStarting: string;
    scanReading: string; // uses {class}
    scanCount: string; // uses {done}, {total} and {pct}
    driversScannedAll: string; // uses {total} and {classes}
    winUpdateLabel: string;
    winUpdateButton: string;
    winUpdateNote: string;
    winUpdateOpened: string;
    winUpdateSearching: string;
    winUpdateTakesAWhile: string;
    winUpdateInstall: string; // uses {count}
    winUpdateInstalling: string;
    winUpdateNone: string;
    winUpdateFailed: string; // uses {detail}
    winUpdateDone: string; // uses {installed} and {failed}
    rebootTitle: string;
    rebootBody: string;
    rebootNow: string;
    rebootLater: string;
  };
  menu: {
    account: string;
    plan: string;
    planFree: string;
    viewPlan: string;
    language: string;
    theme: string;
    about: string;
    errorReports: string;
    errorReportsBody: string;
    changePhoto: string;
    removePhoto: string;
    photoFailed: string;
    support: string;
    reportIssue: string;
    aboutBody: string;
    close: string;
  };
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    loginButton: string;
    rememberMe: string;
    registerButton: string;
    working: string;
    logout: string;
    loggedInAs: string; // uses {email}
    backendNotConfigured: string;
    switchToRegister: string;
    switchToLogin: string;
    emailInvalid: string;
    passwordTooShort: string;
    firstName: string;
    lastName: string;
    registerDetailsRequired: string;
    loginRequiredToResend: string;
    checkInboxAfterSignup: string;
    forgotPasswordLink: string;
    forgotPasswordButton: string;
    forgotPasswordSent: string;
    backToLogin: string;
    emailNotVerified: string;
    emailVerified: string;
    resendVerification: string;
    verificationSent: string;
    deleteAccount: string;
    deleteAccountBody: string;
    deleteAccountPassword: string;
    deleteAccountConfirmLabel: string;
    deleteAccountSubmit: string;
    deleteAccountCancel: string;
    deleteAccountDone: string;
    deleteAccountBlocked: string;
    deleteAccountWrongPassword: string;
    deleteAccountNeedsLogin: string;
    deleteAccountUnreachable: string;
  };
  driftWatch: {
    title: string;
    body: string;
    on: string;
    off: string;
  };
  guard: {
    settingTitle: string;
    settingBody: string;
    selfManaged: string;
    gameRunning: string;
    paused: string;
    selfManagedBadge: string;
    registeredGameRunning: string;
  };
  preview: {
    title: string;
    loading: string;
    now: string;
    notSet: string;
    willChange: string; // uses {count} {total}
    noChange: string;
    readAtApply: string;
    failed: string;
  };
  requirements: {
    minBuild: string; // uses {version}
    proEdition: string;
    unavailableVersion: string; // uses {version}
    unavailableEdition: string;
    enterpriseEdition: string;
    unavailableEnterpriseEdition: string;
    notPresent: string;
    /** Windows refuses other apps' changes to this switch (User Choice Protection). */
    windowsProtected: string;
  };
  scheduledCleanup: {
    title: string;
    body: string;
  };
  priorityRules: {
    title: string;
    subtitle: string;
    remove: string;
    empty: string;
    active: string; // uses {count}
    levelLabel: string; // uses {name}
    idle: string;
    belowNormal: string;
    normal: string;
    aboveNormal: string;
    high: string;
  };
  tweaks: Record<string, TweakText>;
  cleanup: Record<string, TweakText>;
  coffee: {
    nav: string;
    cta: string;
    fewer: string;
    more: string;
  };
}

function format(template: string, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

export { format };

/**
 * The tables, one language at a time.
 *
 * Every locale used to be a plain object in this file, so the entry chunk
 * carried all six of them — 562 kB of strings, two thirds of the bundle —
 * whether or not the reader ever changed language. Each one now lives in
 * `src/locales/<code>.ts` and is fetched when it is first needed. English stays
 * here, because it is the product's primary language and the fallback for every
 * other.
 */
const loaded: Partial<Record<Lang, Strings>> = { en: enTable };

/**
 * The table for a language right now. A language whose table has not arrived
 * yet reads as English rather than as an empty window; `main.tsx` fetches the
 * saved one before the first render, so that fallback is a safety net rather
 * than something a reader sees.
 */
export function stringsFor(lang: Lang): Strings {
  return loaded[lang] ?? enTable;
}

/**
 * Which language a table belongs to, by identity. Panels that are handed a
 * table rather than a code (the list filter) need to name it. Only the tables
 * that have actually been read are compared, so English is never reported as a
 * language it merely stands in for.
 */
export function langOfTable(table: Strings): Lang {
  for (const { code } of LANGUAGES) {
    if (code === "en" ? table === enTable : loaded[code] === table) return code;
  }
  return "en";
}

/** One dynamic import per locale: the bundler emits one chunk each, 90 kB or so,
 *  fetched the first time that language is chosen and cached by the browser. */
const LOADERS = {
  it: () => import("./locales/it").then((m) => m.it),
  fr: () => import("./locales/fr").then((m) => m.fr),
  es: () => import("./locales/es").then((m) => m.es),
  de: () => import("./locales/de").then((m) => m.de),
  pt: () => import("./locales/pt").then((m) => m.pt),
} satisfies Record<Exclude<Lang, "en">, () => Promise<Strings>>;

/** Reads a locale's table, once. The second call for the same language is a
 *  cache hit, which is what makes switching back and forth free. */
export async function loadStrings(lang: Lang): Promise<Strings> {
  const already = loaded[lang];
  if (already) return already;
  if (lang === "en") return enTable;
  const table = await LOADERS[lang]();
  loaded[lang] = table;
  return table;
}

/**
 * English is the product's primary language: a first-time user always sees
 * English regardless of their Windows locale, and only an explicit choice in
 * the language menu (persisted here) changes that. Auto-detecting from
 * `navigator.language` used to mean an Italian Windows install silently got
 * the Italian build on first launch, which made the app feel region-specific
 * rather than international.
 */
/** The BCP 47 tag for dates and numbers: Portuguese is always European
 *  (pt-PT), never the Brazilian default that a bare "pt" resolves to. */
export function localeOf(lang?: string): string | undefined {
  return lang === "pt" ? "pt-PT" : lang;
}

export function detectInitialLang(): Lang {
  const stored = localStorage.getItem("wincraft-lang");
  // Validated against the languages the app offers, not against the tables in
  // memory: a stored "fr" is a real choice even before its table is fetched.
  if (stored && LANGUAGES.some((entry) => entry.code === stored)) return stored as Lang;
  return "en";
}
