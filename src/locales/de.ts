import type { Strings } from "../i18n";

/**
 * The German table, on its own so the app can ship one language and
 * fetch the others on demand (Batch Z). It is data only: no logic lives here.
 */
export const de: Strings = {
  coffee: {
    nav: "Spendier mir einen Kaffee",
    cta: "Nächstes Release finanzieren",
    fewer: "Ein Kaffee weniger",
    more: "Ein Kaffee mehr",
  },
  appName: "WinCraft",
  appliedCount: "{applied} von {total} Optimierungen aktiv",
  headerNote:
    "Prüfe jede Änderung vor dem Anwenden. Die Wiederherstellung unterstützt bestimmte Einstellungen; für Bereinigungs- und Reparaturvorgänge gelten andere Grenzen.",
  advisor: {
    eyebrow: "Für deinen PC empfohlen",
    applyButton: "Anwenden",
    confidenceHigh: "Hohe Zuverlässigkeit — basierend auf der Hardware dieses PCs",
    confidenceStandard: "Empfohlen für diesen Gerätetyp",
    reversible: "Umkehrbar — der ursprüngliche Wert wird vor jeder Änderung gespeichert.",
    empty:
      "Derzeit nichts zu empfehlen — deine Konfiguration entspricht bereits unseren Empfehlungen.",
  },
  drift: {
    pickHint: "Entferne das Häkchen bei allem, was du absichtlich geändert hast.",
    titleAfterUpdate: "Windows hat Ihre Einstellungen zurückgesetzt",
    titleNoUpdate: "Einige Einstellungen sind nicht mehr aktiv",
    afterUpdateOne:
      "Nach dem Update auf {patch} ist eine von Ihnen angewendete Optimierung im System nicht mehr aktiv.",
    afterUpdateMany:
      "Nach dem Update auf {patch} sind {count} von Ihnen angewendete Optimierungen im System nicht mehr aktiv.",
    noUpdateOne:
      "Eine von Ihnen angewendete Optimierung ist im System nicht mehr aktiv. Zwischenzeitlich gab es kein Windows-Update, also hat etwas anderes sie geändert.",
    noUpdateMany:
      "{count} von Ihnen angewendete Optimierungen sind im System nicht mehr aktiv. Zwischenzeitlich gab es kein Windows-Update, also hat etwas anderes sie geändert.",
    reapplyOne: "Optimierung erneut anwenden",
    reapplyMany: "{count} Optimierungen erneut anwenden",
    reapplying: "Wird angewendet...",
    reappliedOne: "Optimierung erneut angewendet.",
    reappliedMany: "{count} Optimierungen erneut angewendet.",
  },
  crashes: {
    title: "Unerwartete Abstürze",
    subtitle:
      "Die App hat sich von selbst beendet. Der Bericht bleibt auf diesem PC: Kopieren Sie ihn und schicken Sie ihn über Discord oder GitHub, wenn er behoben werden soll.",
    copy: "Bericht kopieren",
    copied: "Bericht in die Zwischenablage kopiert.",
    clear: "Löschen",
    cleared: "Berichte gelöscht.",
    processApp: "Hauptfenster",
    processElevated: "Vorgang mit Administratorrechten",
  },
  ledger: {
    guardPaused: "App-Anpassungen pausiert",
    guardResumed: "App-Anpassungen fortgesetzt",
    processes: "Prozesse: {count}",
    restored: "Wiederhergestellt",
    postponed: "Verschoben, weil ein Spiel lief",
    title: "Änderungsprotokoll",
    subtitle:
      "Alles, was diese App auf diesem PC geändert hat, neueste zuerst. Lokal gespeichert, nie hochgeladen.",
    empty:
      "Noch keine Änderungen aufgezeichnet. Wende deinen ersten Tweak an und er erscheint hier.",
    clear: "Verlauf löschen",
    clearing: "Wird gelöscht...",
    cleared: "Verlauf gelöscht.",
    revert: "Zurücksetzen",
    elevated: "mit Adminrechten",
    failed: "fehlgeschlagen",
    actions: {
      processGuard: "Spiel mit eigener Leistungssteuerung",
      coreSteering: "Kernzuweisung",
      ramTrim: "RAM-Bereinigung",
      autoReverted: "Automatisch rückgängig gemacht",
      priorityRule: "Prioritätsregel",
      scheduledCleanup: "Geplante Bereinigung",
      ecoqos: "Effizienz von Hintergrund-Apps",
      applied: "Tweak angewendet",
      reverted: "Tweak zurückgesetzt",
      cleanup: "Bereinigung",
      filesDeleted: "Dateien gelöscht",
      diskOptimize: "Datenträgeroptimierung",
      startupChange: "Autostart-Änderung",
      restorePoint: "Wiederherstellungspunkt",
    },
  },
  tabs: {
    groupWorkspace: "Arbeitsbereich",
    overview: "Übersicht",
    groupMonitor: "Überwachen",
    groupOptimize: "Optimieren",
    groupManage: "Verwalten",
    scan: "Systemscan",
    health: "PC-Zustand",
    hardware: "Hardware",
    performance: "Leistung",
    privacy: "Datenschutz",
    ui: "Oberfläche",
    maintenance: "Wartung",
    gaming: "Gaming",
    startup: "Autostart",
    profiles: "Profile",
    pricing: "Tarife & Preise",
    ledger: "Änderungsverlauf",
  },
  healthPanel: {
    title: "Gesundheitswert",
    subtitle: "Ein erklärbarer Wert: jede Zahl zeigt die Fakten, aus denen sie berechnet wurde.",
    why: "Warum {score}?",
    refresh: "Neu berechnen",
    compute: "Wert berechnen",
    showMore: "Details anzeigen",
    showLess: "Details ausblenden",
    stageProfile: "Systemprofil wird gelesen",
    stageTweaks: "Angewendete Tweaks werden geprüft",
    stageSecurity: "Sicherheitsstatus wird gelesen",
    stageScoring: "Bewertung läuft",
    verdictExcellent: "AUSGEZEICHNET",
    verdictGood: "GUT",
    verdictFair: "ORDENTLICH",
    verdictNeedsWork: "VERBESSERUNGSWÜRDIG",
    computing: "Analyse läuft...",
    idleHint:
      "Nichts läuft im Hintergrund: Der Wert wird nur auf Ihre Anfrage berechnet, vollständig auf diesem PC.",
    changeSinceLast: "seit Ihrer letzten Prüfung",
    changeNone: "Keine Änderung seit Ihrer letzten Prüfung.",
    changeFirstRun:
      "Erste Messung gespeichert. Führen Sie sie nach einer Änderung erneut aus, um zu sehen, was sich bewegt hat.",
    changeWhyTitle: "Warum sich der Wert geändert hat",
    changeContributes: "Beitrag zum Gesamtwert:",
    changeStructural:
      "Ein App-Update hat geändert, welche Kategorien bewertet werden - ein Teil dieser Differenz stammt nicht von Ihrem PC.",
    changeTrend: "Verlauf",
    categories: {
      performance: "Leistung",
      gaming: "Gaming",
      responsiveness: "Reaktionsschnelligkeit",
      memory: "Arbeitsspeicher",
      storage: "Speicherplatz",
      startup: "Autostart",
      maintenance: "Wartung",
      privacy: "Datenschutz",
      security: "Sicherheit",
    },
  },
  transparency: {
    title: "Was genau geändert wird",
    key: "Schlüssel",
    value: "Wert",
    setsTo: "Setzt auf",
    note: "Der vorherige Wert wird vor dem Schreiben gesichert - die Wiederherstellung setzt ihn exakt zurück.",
    kindRegistry: "Registrierung",
    kindCommand: "Befehl",
    kindService: "Dienst",
    copy: "Kopieren",
    copied: "Kopiert",
  },
  command: {
    statusQuiet: "Alles ruhig",
    statusScanning: "Analyse läuft...",
    statusFindings: "{count} Empfehlungen bereit",
    domainsLine: "Autostart · Speicherplatz · Arbeitsspeicher · Datenschutz · Leistung · Updates",
    consent: "Nichts ändert sich ohne deine Zustimmung.",
    runScan: "Systemanalyse starten",
    reviewFindings: "{count} Empfehlungen ansehen",
    memTitle: "Speicherdruck",
    pressureLow: "Niedrig",
    pressureElevated: "Erhöht",
    pressureHigh: "Hoch",
    memReview: "Speichernutzung prüfen",
    memTopTitle: "Top-Prozesse",
    trimTitle: "Working Sets trimmen",
    trimExplainer:
      "Bittet die Speicherverwaltung von Windows, inaktive Seiten aus den Working Sets der Apps zu verschieben. Nützlich bei hohem Druck; Apps laden Seiten beim nächsten Zugriff kurz nach. Es gehen keine Daten verloren. Windows fragt nach Administratorrechten.",
    trimButton: "Jetzt trimmen",
    autoTitle: "Automatisches Trimmen",
    profilesTitle: "Sitzungsprofile",
    profileGame: "Spielsitzung",
    profileGameDesc: "Bereitet den PC aufs Spielen vor: Energie, Priorität und DVR-Aufnahme.",
    profileFocus: "Fokus",
    profileFocusDesc: "Weniger Ablenkung, unwichtige Aktivität unter Kontrolle.",
    profileQuiet: "Leise Sitzung",
    profileQuietDesc: "Effizienz, Akku und wenig Lärm zuerst.",
    profileDownload: "Download-Sitzung",
    profileDownloadDesc: "Steuert Bandbreite und Hintergrundaktivität.",
    previewBtn: "Änderungen ansehen",
    gameChange1: "Deaktiviert Game DVR (Hintergrundaufnahme)",
    gameChange2: "Wechselt zum Energiesparplan Höchstleistung",
    gameChange3: "Optimiert die CPU-Priorität für Spiele (Win32PrioritySeparation)",
    previewReq: "Erfordert Administratorrechte",
    previewCost: "Möglicher Preis: mehr Verbrauch und Wärme, solange aktiv.",
    previewRevert: "Mit einem Klick umkehrbar: jeder Originalwert wird vorher gesichert.",
    applySession: "Sitzung starten",
    restoreSession: "Wiederherstellen",
    statusActive: "Aktiv",
    statusOff: "Nicht aktiv",
    soon: "Bald verfügbar",
  },
  systemMonitor: {
    cpu: "CPU",
    ram: "Arbeitsspeicher",
    disk: "Datenträger",
    uptime: "Läuft seit",
    uptimeValue: "{hours} Std. {minutes} Min.",
    cores: "{count} Kerne",
  },
  startupManager: {
    title: "Autostart-Programme",
    description:
      "Programme, die sich beim Hochfahren des PCs von selbst öffnen. Einige zu deaktivieren verkürzt den Systemstart: Das Programm bleibt installiert und lässt sich weiterhin manuell öffnen.",
    empty: "Keine Programme für den automatischen Start eingerichtet.",
    activeCount: "Aktiv: {enabled} / {total}",
    machineWide: "Alle Benutzer",
    impactNote: "Deaktivieren deinstalliert nichts und ist jederzeit umkehrbar.",
    refresh: "Aktualisieren",
    refreshing: "Neu einlesen...",
    hiddenOrphans: "{count} Einträge ausgeblendet: das Programm ist nicht mehr installiert.",
    locationRun: "Registrierung",
    locationRun32: "Registrierung (32 Bit)",
    locationFolder: "Autostart-Ordner",
  },
  systemRepair: {
    title: "Windows prüfen und reparieren",
    description:
      "Prüft, ob die Systemdateien und der Komponentenspeicher von Windows unbeschädigt sind, und repariert sie andernfalls über die Server von Microsoft. Es sind dieselben Werkzeuge DISM und SFC, die der Microsoft-Support ausführen lässt — nur ohne Eingabeaufforderung.",
    adminNote:
      "Läuft mit Administratorrechten: Windows fragt einmal nach, und vor jeder Änderung wird ein Wiederherstellungspunkt angelegt.",
    timeNote:
      "Eine vollständige Reparatur kann 20 Minuten oder länger dauern. Sie können den PC weiter benutzen — nur nicht ausschalten.",
    checkButton: "Integrität prüfen",
    checking: "Prüfung läuft...",
    cleanupButton: "Komponentenspeicher verkleinern",
    cleaningUp: "Wird verkleinert...",
    cleanupNote:
      "Entfernt überholte Komponentenversionen aus WinSxS. Kürzlich installierte Updates lassen sich weiterhin deinstallieren.",
    runningNote: "Den PC währenddessen nicht herunterfahren oder neu starten.",
    cannotStop:
      "Einmal gestartet, lässt sich der Vorgang nicht abbrechen: Windows prüft und repariert gerade seine eigenen Systemdateien, und ein Abbruch mittendrin könnte sie halb repariert zurücklassen. Du kannst den PC und WinCraft in der Zwischenzeit weiter nutzen.",
    stepQuick: "Schnelle Statusabfrage",
    stepScan: "Komponentenspeicher wird geprüft",
    stepRestore: "Komponentenspeicher wird repariert",
    stepSfc: "Systemdateien werden geprüft",
    stepCleanup: "Komponentenspeicher wird verkleinert",
    stepOf: "Schritt {index} von {total}",
    statusHealthy: "Windows ist unbeschädigt",
    statusRepairable: "Schäden gefunden, sie lassen sich aber reparieren",
    statusRepaired: "Schäden gefunden und repariert",
    statusUnrepairable: "Schäden gefunden, die sich nicht reparieren ließen",
    statusCompleted: "Abgeschlossen",
    hintUnrepairable:
      "Der nächste Schritt ist meist ein Inplace-Upgrade von Windows. Der Fehlercode steht in der Ausgabe unten.",
    hintCompleted:
      "Die Werkzeuge sind durchgelaufen. In Ihrer Windows-Sprache ließ sich das Ergebnis nicht automatisch auswerten — die Einzelheiten stehen in der Ausgabe unten.",
    logTitle: "Ausgabe",
    askRepair: "Möchten Sie das jetzt reparieren?",
    askRepairYes: "Ja, jetzt reparieren",
    askRepairNo: "Jetzt nicht",
    repairAnyway: "Trotzdem eine vollständige Reparatur ausführen",
    elapsed: "{time} vergangen",
    holdingAt:
      "Seit {time} bei {percent}%. DISM bleibt minutenlang auf derselben Zahl stehen, während Windows im Hintergrund Komponenten neu aufbaut — es hängt nicht.",
    remaining: "~{minutes} Min.",
    underMinute: "< 1 Min.",
    estimating: "Wird geschätzt...",
    statElapsed: "Vergangen",
    statRemaining: "Verbleibend",
    statFinish: "Voraussichtlich fertig",
    waiting: "Wartet",
  },
  cookieCleaner: {
    title: "Selektive Cookie-Bereinigung",
    description:
      "Entfernt Tracking- und Werbe-Cookies und behält die, in denen Ihre Anmeldungen stecken. Bei Seiten auf Ihrer Liste bleiben Sie angemeldet.",
    scanButton: "Cookies prüfen",
    scanning: "Prüfung läuft...",
    cleanButton: "Bereinigen",
    cleaning: "Bereinigung läuft...",
    noneFound: "Auf diesem PC wurden keine Browser-Cookies gefunden.",
    totals: "{removable} zu entfernen, {protected} Anmelde-Cookies bleiben",
    runningWarning:
      "Schließen Sie {browser}, um ihn zu bereinigen. Die Zahlen oben stimmen bereits.",
    backupNote:
      "Die Cookie-Datenbank wird vorher kopiert, eine Bereinigung lässt sich also rückgängig machen.",
    restoreButton: "Letzte Bereinigung rückgängig machen",
    restoring: "Wird wiederhergestellt...",
    restoredToast: "{browser}: Cookies aus der letzten Sicherung wiederhergestellt.",
    cleanedToast: "{removed} Cookies entfernt, {kept} Anmeldungen behalten.",
    nothingToClean: "Nichts zu entfernen: Alle Cookies stehen auf Ihrer Liste.",
    topDomains: "Die meisten Cookies stammen von",
    whitelistTitle: "Seiten, bei denen Sie angemeldet bleiben",
    whitelistNote:
      "Subdomains sind eingeschlossen: Mit google.com bleibt auch accounts.google.com erhalten.",
    whitelistPlaceholder: "beispiel.de",
    whitelistAdd: "Hinzufügen",
    whitelistRemove: "Entfernen",
    whitelistReset: "Standard wiederherstellen",
  },
  appCache: {
    title: "Caches von Fremdprogrammen",
    description:
      "Shader-Caches, Spiele-Launcher, Chat-Apps und Paketmanager halten Gigabytes an Dateien vor, die sie selbst wieder aufbauen. Diese Suche findet sie in den Programmen, die Sie tatsächlich installiert haben.",
    scanButton: "Caches prüfen",
    scanning: "Prüfung läuft...",
    cleanButton: "Auswahl bereinigen",
    cleaning: "Bereinigung läuft...",
    noneFound: "Auf diesem PC wurden keine Caches von Fremdprogrammen gefunden.",
    permanentNote:
      "Diese Dateien werden endgültig gelöscht und nicht in den Papierkorb verschoben: Gigabytes dorthin zu schieben gibt nichts frei, solange er nicht geleert wird. Alles hier Aufgeführte wird vom jeweiligen Programm selbst wieder angelegt.",
    blockedBy: "{process} läuft gerade, seine Dateien werden daher übersprungen.",
    selectedTotal: "{size} ausgewählt",
    cleanedToast: "{freed} freigegeben.",
    skippedNote: "{count} Dateien waren in Benutzung und wurden nicht angetastet.",
    catShaders: "Shader-Caches",
    catLaunchers: "Spiele-Launcher",
    catApps: "Apps",
    catDev: "Entwicklerwerkzeuge",
    catWindows: "Windows",
    names: {
      shader_dx: "DirectX-Shader-Cache",
      shader_nvidia: "NVIDIA-Shader-Cache",
      shader_amd: "AMD-Shader-Cache",
      shader_intel: "Intel-Shader-Cache",
      steam: "Steam-Web-Cache",
      epic: "Cache des Epic Games Launchers",
      battlenet: "Battle.net-Cache",
      discord: "Discord-Cache",
      vscode: "Visual-Studio-Code-Cache",
      npm: "npm-Paket-Cache",
      pip: "pip-Paket-Cache",
      crash_dumps: "Absturzabbilder von Anwendungen",
      error_reports: "Windows-Fehlerberichte",
    },
  },
  scheduledTasks: {
    title: "Geplante Aufgaben beim Start",
    description:
      "Updater und Hintergrunddienste, die bei der Anmeldung oder beim Hochfahren über die Aufgabenplanung starten — dort, wo die Windows-Autostartliste sie nie zeigt. Aufgaben von Windows selbst erscheinen hier nicht.",
    empty: "Auf diesem PC gibt es keine Startaufgaben von Fremdprogrammen.",
    activeCount: "Aktiv: {enabled} / {total}",
    triggerLogon: "Bei der Anmeldung",
    triggerBoot: "Beim Hochfahren",
    refresh: "Aktualisieren",
    refreshing: "Wird neu gelesen...",
    note: "Eine Aufgabe abzuschalten deinstalliert nichts, und Sie können sie jederzeit wieder einschalten.",
  },
  search: {
    placeholder: "Tweak suchen...",
    noResults: 'Keine Treffer für "{query}".',
    clear: "Löschen",
  },
  pricing: {
    title: "Kostenlos für alle",
    intro:
      "WinCraft ist kostenlos und Open Source: alle Werkzeuge inklusive, kein Abo und keine Bezahlschranke.",
    planName: "Alles inklusive",
    planTagline: "Jedes Werkzeug, jeder Tweak, jede Funktion – ohne Einschränkungen.",
    priceAmount: "$0",
    priceNote: "für immer",
    features: [
      "Alle System-Tweaks und Optimierungen",
      "Erweiterte Gaming- und Datenschutz-Werkzeuge",
      "Datenaufräumung, Defragmentierung und Systemreparatur",
      "Treiberupdates und Hardware-Diagnose",
      "Game Sessions und Überwachungsprofile",
      "Zero-Trace-Speicherbereinigung und sicheres Schreddern",
      "Alle künftigen Updates inklusive",
    ],
    commitmentTitle: "Unser Versprechen",
    commitmentBody:
      "WinCraft ist und bleibt kostenlos. Jeder soll Werkzeuge nutzen können, die helfen, den eigenen PC zu verstehen und zu optimieren: keine versteckten Kosten, keine gesperrten Funktionen, keine Abos.",
  },
  toggle: { on: "Ein", off: "Aus" },
  driverBooster: {
    title: "Driver Booster",
    subtitle:
      "Wähle die Treiber, die in die Jahre kommen, und öffne alle ihre Download-Seiten auf einmal.",
    scan: "Treiber prüfen",
    scanning: "Wird geprüft...",
    selectAll: "Alle auswählen",
    selectNone: "Auswahl aufheben",
    selectedCount: "{selected} von {total} ausgewählt",
    pagesForSelection: "{pages} Seiten zu öffnen",
    openSelected: "Download-Seiten öffnen ({count})",
    opened: "{count} Seiten geöffnet",
    openedCapped:
      "{opened} von {total} Seiten geöffnet: der Rest bleibt ausgewählt, einfach erneut ausführen.",
    allCurrent: "Kein Treiber zeigt sein Alter.",
    nothingActionable: "Kein alternder Treiber hat eine Herstellerseite zum Öffnen.",
    note: "WinCraft lädt Treiberpakete nicht selbst herunter: es gibt keine Hersteller-API, die sagt, welche Version für genau dein Gerät richtig ist, und den falschen Grafiktreiber zu installieren ist einer der wenigen Fehler, der dich ohne Bildschirm zurücklassen kann. Das hier automatisiert den mühsamen Teil — die Seiten zu finden — nicht die Entscheidung. Für Treiber, die Windows Update wirklich kennt, nimm die Schaltfläche oben.",
  },
  secureDefrag: {
    title: "Sichere Defragmentierung",
    willDefrag: "Dieses Laufwerk ist mechanisch: eine echte Defragmentierung wird ausgeführt.",
    willRetrim:
      "Dieses Laufwerk ist nicht bestätigt mechanisch: das gesamte Volume wird analysiert, dann läuft ein Retrim statt einer Defragmentierung. Das Retrim dauert Sekunden und betrifft nur den freien Speicher — genau das ist seine Aufgabe: dem Controller mitzuteilen, welche Blöcke nicht mehr belegt sind. Eine SSD zu defragmentieren macht sie nicht schneller, nur älter.",
    start: "Starten",
    running: "Läuft...",
    working: "Wird bearbeitet...",
    phaseAnalyze: "Analyse",
    phaseOptimize: "Optimierung",
    analysisTitle: "Analysebericht",
    doneDefrag: "Defragmentierung abgeschlossen.",
    doneRetrim: "Retrim abgeschlossen.",
    note: "Zuvor wird ein Wiederherstellungspunkt erstellt. Der Prozentwert kommt von Windows selbst, nicht von einem Timer.",
  },
  zeroTrace: {
    title: "Zero-Trace Cleaner",
    subtitle:
      "Entfernt, was geschlossene Programme im Speicher hinterlassen, und vernichtet Dateien unwiederbringlich.",
    purgeTitle: "Speicherbereinigung",
    purgeBody:
      "Windows behält die Seiten geschlossener Programme als Cache im RAM. Dies gibt sie frei: Fragmente eines beendeten Prozesses verschwinden wirklich aus dem physischen Speicher.",
    purgeButton: "Speicher leeren",
    purging: "Wird geleert...",
    purgeResult: "{freed} MB freigegeben — jetzt {after} MB frei",
    purgeLimit:
      "Auslagerungs- und Ruhezustandsdatei bleiben unberührt: sie liegen auf der Platte, und Windows bietet keine Laufzeit-API, um sie zu bereinigen.",
    shredTitle: "Sicheres Dateischreddern",
    shredBody:
      "Überschreibt den Dateiinhalt in drei Durchläufen vor dem Löschen — außer Reichweite üblicher Wiederherstellungswerkzeuge.",
    shredButton: "Dateien wählen...",
    shredding: "Wird vernichtet...",
    shredDone: "{count} Dateien vernichtet ({size})",
    shredSummary: "{shredded} vernichtet, {skipped} übersprungen",
    shredWarning: "Endgültig: kein Papierkorb, keine Wiederherstellung.",
    ssdCaveat:
      "Auf einer SSD schreibt Wear-Levelling fast immer in andere Zellen als das Original. Die alten werden freigegeben, nicht überschrieben — mehr garantiert nur das Secure-Erase des Laufwerks.",
  },
  hud: {
    title: "Spiel-Overlay",
    subtitle:
      "Ein transparentes Panel über dem Spiel: CPU-/GPU-Last, Temperaturen, VRAM, aktiver Prozess samt Priorität und ein Engpass-Indikator.",
    fpsAbout:
      "Die Bildrate wird aus den Present-Ereignissen gezählt, die Windows für jedes Bild ausgibt — dieselbe Quelle, die PresentMon liest, ohne etwas im Spiel einzuklinken. Erfordert den Start als Administrator, denn eine Ablaufverfolgungssitzung zu öffnen ist ein privilegierter Vorgang.",
    fpsLowExplained:
      "Neben dem Durchschnitt steht DROP: die Rate des schlechtesten Prozents der Bilder, andernorts 1% Low genannt. Das ist die Zahl, die sich bewegt, wenn ein Spiel stockt, während der Durchschnitt hoch bleibt und nichts davon verrät. Je näher DROP am Durchschnitt liegt, desto flüssiger läuft es.",
    fpsStart: "FPS messen",
    fpsStop: "Messung beenden",
    fpsNeedsAdmin: "Zum Messen der Bildrate muss WinCraft als Administrator gestartet werden.",
    fpsRunning:
      "Messung läuft: Die Bildrate erscheint im Overlay, sobald ein Spiel zu zeichnen beginnt.",
    show: "Anzeigen",
    hide: "Ausblenden",
    lock: "Sperren",
    unlock: "Entsperren",
    dragHint:
      "Ziehen Sie das Overlay an die gewünschte Stelle und sperren Sie es vor dem Spielstart.",
    lockedHint: "Gesperrt: Klicks gehen hindurch zum Spiel. Zum Verschieben entsperren.",
    sizeCompact: "Kompakt",
    sizeNormal: "Normal",
  },
  updater: {
    title: "Update verfügbar: v{version}",
    body: "Wird in einem Schritt heruntergeladen und installiert; die App startet danach von selbst neu.",
    install: "Installieren und neu starten",
    later: "Später",
    downloading: "Wird heruntergeladen... {percent}%",
    installing: "Wird installiert...",
    error: "Update fehlgeschlagen: {message}",
    checkFailed: "Update-Prüfung fehlgeschlagen: {message}",
  },
  badges: { admin: "Admin", soon: "DEMNÄCHST" },
  emptyCategory: "In dieser Kategorie sind noch keine Optimierungen verfügbar — bald verfügbar.",
  gameSessions: {
    title: "Game Sessions",
    subtitle:
      "Erkennt deine Spiele automatisch und wendet das Turbo-Gaming-Preset selbstständig an/rückgängig.",
    active: "Sitzung aktiv: {name}",
    gamesCount: "{count} Spiele registriert",
    addGame: "+ Spiel hinzufügen (.exe)",
    steeringTitle: "Kernzuweisung",
    steeringVcache:
      "Das Spiel läuft auf dem Die mit 3D V-Cache ({count} Threads). Andere Apps bleiben, wo Windows sie einplant.",
    steeringHybrid:
      "Das Spiel läuft auf den Leistungskernen ({game} Threads), die übrigen Apps deiner Sitzung wechseln auf die Effizienzkerne ({background} Threads). Apps, deren Priorität du über „Normal“ gesetzt hast, bleiben unberührt.",
    steeringActive: "{count} Prozesse für dieses Spiel zugewiesen.",
    steeringNone:
      "Auf dieser CPU gibt es nichts zuzuweisen: Weder eine schnellere Kernart noch ein einzelner größerer Cache wurde gefunden.",
    steeringActiveVcache: "Das Spiel läuft auf dem Die mit V-Cache.",
    steeringNeedsSessions: "Läuft nur, wenn Game Sessions aktiv ist und eines deiner Spiele läuft.",
  },
  latencyTrace: {
    title: "DPC- und Interrupt-Latenz",
    subtitle:
      "Misst, wie lange die verzögerten Prozeduraufrufe (DPCs) und Interrupt-Service-Routinen (ISRs) jedes Treibers laufen, direkt aus dem Windows-Kernel gelesen. Ändert nichts; erfordert Administratorrechte.",
    duration: "Dauer",
    secondsOption: "{seconds} s",
    run: "Messen",
    running: "Messung läuft {seconds} s…",
    dpcSummary:
      "Längster DPC: {max} ms (Grenze {limit} ms). {over} von {count} lagen über der Grenze.",
    isrSummary:
      "Längste Interrupt-Routine: {max} ms (Grenze {limit} ms). {over} von {count} lagen über der Grenze.",
    colDriver: "Treiber",
    colDpc: "Längster DPC",
    colIsr: "Längster Interrupt",
    colOver: "Über der Grenze",
    unattributed: "Nicht zugeordnet",
    hidden:
      "Windows hat die Treiberadressen verborgen, daher ließen sich die Routinen keinem Treiber zuordnen.",
    verdictGood: "Während dieser Messung hat kein Treiber die Grenzen von Microsoft überschritten.",
    note: "Microsofts Vorgabe: Ein DPC sollte in unter 0,1 ms fertig sein, eine ISR in unter 0,025 ms. dxgkrnl.sys verteilt die Anzeige-Interrupts, seine Zeit gehört daher oft zum Grafiktreiber.",
    verdictBad:
      "{driver} hat einen Prozessor {max} ms am Stück belegt. Blockaden über einer Millisekunde können Knacken im Ton und Ruckler bei der Frametime verursachen; meist hilft es, diesen Treiber zu aktualisieren oder auf die vorige Version zurückzusetzen.",
    verdictMinor:
      "{over} Routinen lagen über Microsofts Vorgabe; die längste dauerte {max} ms. So kurze Überschreitungen sind häufig und selten hörbar.",
    lost: "Windows hat während der Messung {events} Ereignisse und {buffers} Puffer verloren, die angezeigten Höchstwerte sind also eine Untergrenze.",
    verdictBadUnattributed:
      "Eine Routine, die keinem Treiber zugeordnet werden konnte, hat einen Prozessor {max} ms am Stück belegt. Blockaden über einer Millisekunde können Knacken im Ton und Ruckler bei der Frametime verursachen.",
    spikesTitle: "Längste einzelne Routinen",
    spikeLine: "{kind} von {duration} ms in {driver}, {at} s nach Beginn",
  },
  networkCheck: {
    title: "Netzwerkprüfung",
    subtitle:
      "Sendet 32 Pings an 1.1.1.1 und öffnet eine TCP-Verbindung und zeigt dann, was der Netzwerkstack von Windows tatsächlich tut. Ändert nichts.",
    run: "Prüfen",
    running: "Prüfung läuft…",
    offline: "Keine Verbindung zum Internet.",
    rtt: "Umlaufzeit: Median {median} ms (min. {min}, max. {max})",
    jitter: "Schwankung (Jitter): {jitter} ms",
    loss: "Antworten: {received} von {sent}",
    tcpRtt: "Umlaufzeit laut TCP-Stack: {rtt} ms",
    nagleOn:
      "Neue Verbindungen starten mit aktivem Nagle-Algorithmus (TCP_NODELAY aus). Apps, die ihn abschalten müssen, tun das an ihren eigenen Sockets.",
    nagleOff: "Neue Verbindungen starten mit abgeschaltetem Nagle-Algorithmus.",
    buffers:
      "Empfangspuffer: {reserved} pro Socket reserviert, {autotuned} von Windows automatisch angepasst",
    verdictNone:
      "Ein Ping läuft nicht über die TCP-Einstellungen, daher beschreiben diese Werte die Verbindung selbst.",
    verdictInconclusive: "Zu wenige Antworten für einen Vergleich.",
    verdictLineChanged:
      "Die Leitung selbst hat sich zwischen den beiden Messungen verändert (Median {delta} ms). Ein Ping läuft nicht über die TCP-Einstellungen, das ist also nicht die Wirkung der Änderung.",
    lastTitle: "Nach {tweak}, {time}",
    socketsBeforeAfter:
      "Neue Sockets, vorher → nachher: Nagle {nagleBefore} → {nagleAfter}, Empfangspuffer {bufBefore} → {bufAfter}",
    stateOn: "an",
    stateOff: "aus",
  },
  turboBoost: {
    title: "Turbo Boost",
    subtitle:
      "Passt den CPU-Boost-Modus und den minimalen Prozessorzustand an. Stromverbrauch und Wärme können steigen; die Ergebnisse hängen von der Arbeitslast ab.",
    startLabel: "Starten",
    stopLabel: "Stoppen",
    activating: "Turbo wird aktiviert...",
    deactivating: "Wird wiederhergestellt...",
    active: "Turbo aktiv",
    inactive: "Turbo nicht aktiv",
    loadLabel: "CPU-LAST",
    loadCadence: "Jede Sekunde gemessen, über etwa 3 Sekunden geglättet",
    ownLoad: "In den letzten Sekunden: WinCraft selbst {own} % · alles andere {rest} %",
    stageReading: "Energieplan wird gelesen",
    stageRaising: "Boost-Grenze wird angehoben",
    stageApplying: "Wird auf das System angewendet",
    stageMeasuringBefore: "Messung vorher",
    stageMeasuringAfter: "Erneute Messung",
    factAverage: "Durchschnittstakt jetzt",
    factFastest: "Schnellster Kern jetzt",
    factPeak: "Höchstwert dieser Sitzung",
    factFloor: "Minimaler Leistungszustand des Prozessors",
    ofBase: "{pct} % des Basistakts",
    usersTitle: "Wer die CPU gerade nutzt",
    appliedAt:
      "Aktiviert am {time} · Boost-Modus Aggressiv, minimaler Prozessorzustand im Netzbetrieb 100 %",
    planAlreadyUses: "Der aktuelle Energiesparplan nutzt diese Einstellungen bereits.",
    planAlreadyHad:
      "Der aktuelle Energiesparplan hatte diese Einstellungen bereits, daher hat sich kein Wert geändert.",
    loadExplain:
      "Die Last zeigt, wie viel der Prozessor arbeitet; Turbo Boost ändert, wie schnell er laufen darf, nicht wie ausgelastet er ist. Ein hoher Wert heißt, dass gerade Programme auf diesem PC arbeiten.",
    chartLoad: "Last",
    chartSpeed: "Takt",
    testTitle: "Derselbe Test in jedem Modus",
    testHint:
      "Eine feste 3-Sekunden-Last. Führe sie in jedem Modus einmal aus, um zu sehen, was Boost ändert.",
    testRun: "3-Sekunden-Test starten",
    testRunning: "Test läuft…",
    colDefault: "Standard",
    colBoost: "Boost",
    rowWork: "Geleistete Arbeit",
    rowAvg: "Durchschnittstakt",
    rowPeak: "Spitzentakt",
    rowTemp: "CPU-Temperatur",
    notRun: "Noch nicht ausgeführt",
    relative: "{pct} % von Standard",
  },
  profiles: {
    title: "Deine Profile",
    subtitle:
      "Speichere deine aktiven Einstellungen als Profil. Nutze eine Konfiguration erneut oder exportiere sie auf einen anderen PC.",
    saveHeading: "Aktive Einstellungen speichern",
    namePlaceholder: "Name (z. B. Gaming)",
    saveButton: "Sichern",
    savedHeading: "Gespeicherte Profile",
    empty: "Noch keine gespeicherten Profile.",
    tweakCount: "{count} Optimierungen",
    apply: "Anwenden",
    applying: "Wird angewendet...",
    exportButton: "Exportieren",
    importButton: "Aus Datei importieren",
    deleteButton: "Loeschen",
    savedToast: 'Konfiguration "{name}" gesichert',
    appliedToast: "{count} Optimierungen angewendet",
    exportedToast: "Datei exportiert",
    importedToast: "Importiert: {count} Optimierungen zur Pruefung",
    droppedWarning: "{count} von dieser Version nicht erkannte Einträge wurden verworfen",
    nameRequired: "Geben Sie der Konfiguration einen Namen",
    reviewNotice:
      "Eine importierte Konfiguration wird nie von selbst angewendet - Sie pruefen sie zuerst.",
    signInRequired:
      "Melden Sie sich an oder erstellen Sie ein Konto, um Konfigurationen zu speichern.",
  },
  scan: {
    lastScan: "Letzter Scan: {time}",
    neverScanned: "Noch kein abgeschlossener Scan",
    extraChecks: "Zusätzliche Prüfungen",
    checksHint:
      "Nur Systemabfragen: Es wird nichts automatisch geändert. Öffne eine Kategorie für Details.",
    unavailable: "Prüfung nicht verfügbar",
    startupSummary: "{enabled} aktiviert · {orphaned} fehlende Ziele",
    tasksSummary: "{enabled} aktivierte Autostart-Aufgaben",
    partialScan: "Teilergebnisse: Einige Prüfungen sind nicht verfügbar.",
    scanFailed: "Scan fehlgeschlagen. Bitte erneut versuchen.",
    title: "Schnellscan",
    subtitle:
      "Prüft den Zustand deines PCs und findet noch nicht aktive Optimierungen, mit einem Klick.",
    startLabel: "SCAN",
    stepPerformance: "Leistung",
    stepPrivacy: "Datenschutz",
    stepGaming: "Gaming",
    stepJunk: "Temporäre Dateien",
    allGood: "Alles in Ordnung — keine Probleme gefunden.",
    issuesFound: "{count} Optimierungen verfügbar",
    selectAll: "Alles auswählen",
    deselectAll: "Alles abwählen",
    fixAll: "Alles beheben",
    fixing: "Behebe {done}/{total}...",
    fixedToast: "{count} Probleme behoben.",
    scanAgain: "Erneut scannen",
    verdictRecommended: "Auf diesem PC empfohlen",
    verdictNotRecommended: "Auf diesem PC nicht empfohlen",
    verdictUnsupported: "Nicht unterstützt",
    reasons: {
      laptop_battery: "dieser PC ist ein Notebook: Es kostet mehr Akkulaufzeit, als es bringt",
      hdd_index_cost: "die Systemfestplatte ist mechanisch, die Hintergrundindizierung ist spürbar",
      fast_disk_no_gain:
        "die Systemplatte ist NVMe und schnell genug, dass der Gewinn vernachlässigbar ist",
      needs_win10_2004: "erfordert Windows 10 Version 2004 oder neuer",
      weak_gpu: "integrierte Grafik: Transparenz kostet sie nutzbare Leistung",
    },
    thisPc: "Dieser PC",
    dashDrivesTitle: "Speicher",
    dashFreeOf: "{free} frei von {total}",
    dashAlmostFull: "Fast voll",
    dashStartupTitle: "Autostart-Apps",
    dashStartupCount: "{on} von {total} aktiv",
    dashManage: "Verwalten",
    dashUptimeTitle: "Eingeschaltet seit",
    dashUptimeDh: "{days}T {hours}h",
    dashUptimeHm: "{hours}h {minutes}min",
    dashUptimeLongHint:
      "Dieser PC wurde länger nicht neu gestartet. Ein Neustart wendet ausstehende Updates an und gibt zurückgehaltenen Speicher frei.",
    dashHistoryTitle: "Letzte Aktionen",
    dashHistoryEmpty: "Noch nichts. Deine Aktionen erscheinen hier.",
    dashActTweakApplied: "Tweak angewendet",
    dashActTweakReverted: "Tweak zurückgesetzt",
    dashActCleanup: "Bereinigung",
    dashActFilesDeleted: "Dateien gelöscht",
    dashActStartupChange: "Autostart geändert",
    dashActDiskOptimize: "Laufwerk optimiert",
    dashActRestorePoint: "Wiederherstellungspunkt",
    profileUnknown: "Nicht erkannt",
    diskHdd: "HDD",
    diskSsd: "SSD",
    diskNvme: "NVMe",
    formDesktop: "Desktop",
    formLaptop: "Notebook",
    groupRecommended: "Fuer diesen PC empfohlen",
    groupOptional: "Optional",
    groupNotRecommended: "Hier nicht empfohlen",
    tailoredNote: "Jeder Punkt wird an der Hardware oben gemessen, nicht an einer festen Liste.",
    fixRecommended: "Die {count} empfohlenen anwenden",
    fixEverything: "Auswahl anwenden ({count})",
    nothingSelected: "Nichts ausgewaehlt",
    foundHeadline: "{count} auf diesem PC verbesserbar",
    foundNone: "Nichts zu tun",
    doneTitle: "Fertig!",
    doneBody: "{count} Optimierungen angewendet. Dein PC ist bereit.",
    fixHeading: "Bereit zum Anwenden",
  },
  ram: {
    autoNeedsAdmin:
      "Die automatische Bereinigung läuft nur, solange WinCraft Administratorrechte hat.",
    title: "RAM freigeben",
    subtitle:
      "Fordert Windows auf, Speicher freizugeben, den Programme belegen, aber nicht nutzen. Windows fragt jedes Mal nach Administratorrechten, und läuft gerade ein Spiel, wartet die Bereinigung.",
    button: "Jetzt freigeben",
    cleaning: "Wird bereinigt...",
    freed: "{amount} freigegeben",
    freedNothing: "Der Speicher war bereits optimiert",
    inUse: "{used} von {total} belegt",
    autoLabel: "Automatische Bereinigung",
    autoOff: "Aus",
    autoEvery: "Alle {interval}",
    autoHint:
      "Bei aktiver automatischer Bereinigung gibt WinCraft den RAM selbstständig in regelmäßigen Abständen frei. Das geht nur, solange es als Administrator läuft: Windows fragt bei jeder Bereinigung nach der Berechtigung, und eine geplante Bereinigung kann nicht fragen.",
    autoPausedNotAdmin:
      "Pausiert: WinCraft läuft nicht als Administrator, daher kann die automatische Bereinigung nicht starten. Um sie zu nutzen, schließe WinCraft und öffne es mit „Als Administrator ausführen“. Die manuelle Bereinigung funktioniert weiterhin: Windows fragt jedes Mal nach der Berechtigung.",
    autoNext: "Nächste Bereinigung um {time}",
    autoDue: "Bereinigung steht an...",
    autoLast: "Zuletzt um {time}: {amount} freigegeben",
    autoNoneYet: "Es wurde noch keine automatische Bereinigung ausgeführt.",
    autoFailed: "Der letzte Versuch ist fehlgeschlagen: {detail}",
  },
  restore: {
    button: "Aktive Einstellungen zurücksetzen",
    title: "Aktive Einstellungen zurücksetzen?",
    body: "Setzt {count} Einstellungen auf ihre gespeicherten Werte zurück. Konfigurierbare Werkzeuge haben eigene Wiederherstellungsfunktionen.",
    confirm: "Einstellungen zurücksetzen",
    cancel: "Abbrechen",
    running: "Wird zurückgesetzt...",
    doneToast: "{count} Optimierungen zurückgesetzt.",
    nothingToast: "Es gibt nichts zurückzusetzen.",
  },
  passwordCheck: {
    title: "Passwort-Datenleck-Prüfung",
    description:
      "Prüft, ob ein Passwort in einem bekannten Datenleck aufgetaucht ist, ohne es je vollständig zu senden: Es wird nur ein Fragment seines Hashes gesendet (k-Anonymität, derselbe Standard wie bei Have I Been Pwned).",
    placeholder: "Ein zu prüfendes Passwort einfügen",
    button: "Prüfen",
    checking: "Wird geprüft...",
    safe: "In keinem bekannten Datenleck gefunden. Gutes Zeichen.",
    breached:
      "In {count} bekannten Datenlecks gefunden. Ändere es sofort, überall wo du es verwendest.",
    error: "Konnte gerade nicht geprüft werden: Verbindung prüfen und erneut versuchen.",
  },
  cleanupConfirm: {
    previewLoading: "Es wird berechnet, was in den Papierkorb verschoben wird...",
    previewEmpty: "Nichts zu bereinigen - der Ordner ist bereits leer.",
    previewNotAccessible:
      "Der Inhalt kann ohne Administratorrechte nicht gelesen werden; der autorisierte Prozess listet und entfernt ihn.",
    previewTruncated: "Die 500 größten Elemente werden angezeigt; die Summen umfassen alles.",
    selectedSummary: "{count} Elemente ausgewählt · {size}",
    confirmSelected: "Auswahl bereinigen",
    title: "Bereinigung bestätigen?",
    body: '„{name}" verschiebt die betreffenden Dateien in den Windows-Papierkorb. Du kannst sie von dort wiederherstellen, solange er nicht geleert wird.',
    confirm: "In den Papierkorb verschieben",
    cancel: "Abbrechen",
  },
  cleanupButton: "Bereinigen",
  cleanupRunning: "...",
  cleanupResultToast: "{deleted} Elemente in den Papierkorb verschoben, {freed} freigegeben",
  cleanupResultToastSkipped: " ({skipped} in Verwendung, übersprungen).",
  diskOptimize: {
    title: "Laufwerk optimieren",
    description:
      "Fuhrt das integrierte Windows-Optimierungstool aus: Defragmentierung bei einer HDD oder TRIM bei einer SSD (nie eine vollstandige Defragmentierung, die sie nur unnotig abnutzen wurde).",
    button: "Jetzt optimieren",
    running: "Optimierung lauft... kann einige Minuten dauern",
    cannotStop:
      "Das übernimmt die Laufwerksoptimierung von Windows mit Administratorrechten. Sie läuft von selbst zu Ende und lässt sich hier nicht abbrechen. Du kannst bedenkenlos weiterarbeiten.",
    resultToast: "Laufwerk ({media}) erfolgreich optimiert.",
  },
  dnsFlush: {
    title: "DNS-Cache leeren",
    description:
      "Löscht zwischengespeicherte DNS-Einträge. Nützlich, wenn eine Website den Server gewechselt hat und dein Browser weiterhin die alte Version anzeigt.",
    button: "Jetzt leeren",
    running: "Wird geleert...",
    resultToast: "DNS-Cache geleert.",
  },
  browserCleanup: {
    title: "Browser-Bereinigung",
    description:
      "Leert Cache und Cookies von Chrome, Edge und Firefox. Der Browser baut sie beim nächsten Start von selbst wieder auf, es geht also nichts endgültig verloren.",
    noneFound: "Kein unterstützter Browser auf diesem PC gefunden.",
    cache: "Cache",
    cookies: "Cookies",
    clearButton: "Leeren",
    clearing: "Wird geleert...",
    runningWarning: "Schließe {browser}, um ihn zu leeren.",
    clearedToast: "{browser}: {freed} freigegeben.",
  },
  tweakyDriverPromo: {
    title: "Tweaky Driver",
    description:
      "Finde Treiberpakete aus unterstützten Quellen in unserer separaten App. Prüfe vor der Installation die Kompatibilität. Die Abdeckung variiert.",
    button: "Tweaky Driver entdecken",
    error: "Die Seite konnte nicht geöffnet werden. Bitte erneut versuchen.",
  },
  redaxaPromo: {
    title: "Redaxa",
    description:
      "Telemetrie und Tracking sind aus — aber was fügst du in KI-Chats ein? Redaxa fängt persönliche Daten und Zugangsdaten ab, bevor ein Prompt irgendein Modell erreicht. Gleiche Familie, gleiche Regel: nichts wird gespeichert.",
    button: "Im Web ausprobieren",
  },
  uninstallerPromo: {
    title: "WinCraft Uninstaller",
    description:
      "Entferne ganze Programme sicher: automatischer Wiederherstellungspunkt, gepruefter Befehl, ehrlicher Bericht. Aus derselben Familie wie WinCraft.",
    button: "Herunterladen",
    confirmTitle: "Uninstaller herunterladen?",
    confirmBody:
      "WinCraft Uninstaller ist eine eigene App derselben Suite und meldet sich mit demselben Konto an wie diese. Der Download holt das Installationsprogramm (rund 4 MB) direkt aus seinem GitHub-Release, für Windows 10 und 11 in 64 Bit.",
    confirmUnsigned:
      "WinCraft Uninstaller ist von Aurelio Avila digital signiert. Prüfe Herausgeber und Signatur in den Dateieigenschaften. SmartScreen kann weiterhin warnen.",
    confirmDownload: "Herunterladen",
    confirmOpenPage: "Stattdessen die Seite öffnen",
    cancel: "Abbrechen",
  },
  live: {
    title: "Gerade jetzt",
    subtitle:
      "Wird jede Sekunde aktualisiert, solange diese Seite offen und WinCraft im Vordergrund ist. Im Hintergrund wird nichts gemessen.",
    paused: "Pausiert",
    pausedHint:
      "Pausiert, solange WinCraft im Hintergrund ist. Geht weiter, sobald du zurückkommst.",
    measuring: "Wird gemessen…",
    smooth: "Läuft flüssig",
    busy: "Ausgelastet",
    strained: "Unter hoher Last",
    verdictDetail: "CPU {cpu} % in den letzten 10 Sekunden · Arbeitsspeicher zu {ram} % belegt",
    failed: "Live-Werte sind gerade nicht verfügbar.",
    cpu: "Prozessor",
    speed: "{ghz} GHz",
    cores: "{count} logische Prozessoren",
    core: "Prozessor {n}",
    memory: "Arbeitsspeicher",
    used: "Belegt",
    cached: "Im Cache",
    free: "Frei",
    total: "Gesamt",
    cachedHint: "Speicher im Cache wird freigegeben, sobald ein Programm ihn braucht.",
    notAvailable: "Auf diesem PC nicht verfügbar",
    disk: "Datenträgeraktivität",
    read: "Lesen",
    write: "Schreiben",
    systemDrive: "Systemlaufwerk: {used} von {total} belegt",
    network: "Netzwerk",
    down: "Download",
    up: "Upload",
    gpu: "Grafik",
    gpuLoad: "Auslastung",
    temp: "Temperatur",
    fan: "Lüfter",
    vram: "Grafikspeicher",
    sensors: "Temperaturen und Lüfter",
    sensorsHint:
      "Windows stellt diese Sensoren auf diesem PC ohne die Tools des Herstellers nicht bereit, deshalb wird nichts geschätzt.",
    now: "jetzt",
    secondsAgo: "vor {s} s",
    activity: "Aktivität",
    zoomShort: "1 Min.",
    zoomLong: "5 Min.",
    minutesAgo: "vor {n} Min.",
    peak: "Spitze {value}",
    insightRecovering:
      "Der Prozessor kommt zur Ruhe: Er lag im Mittel über 75 %, der letzte Messwert beträgt {pct} %.",
    insightCalm: "Alles ruhig. Gerade braucht nichts deine Aufmerksamkeit.",
    insightMemory:
      "Der Arbeitsspeicher ist stark belegt ({pct} %). Schließe Apps, die du nicht nutzt, oder prüfe, was mit Windows startet.",
    insightCpu:
      "Der Prozessor ist schon eine Weile ausgelastet ({pct} % im Schnitt). Die Liste unten zeigt, was ihn nutzt.",
    insightDrive:
      "Das Systemlaufwerk ist fast voll ({pct} %). Windows wird langsamer, wenn der Platz knapp wird.",
    actionStartup: "Autostart öffnen",
    actionCleanup: "Speicher freigeben",
    usingTitle: "Was Ressourcen nutzt",
    usingHint:
      "Apps nach Namen gruppiert, aus der Prozessliste von Windows. Es wird nichts geöffnet oder geändert.",
    usingCpu: "Prozessor",
    usingMemory: "Arbeitsspeicher",
    processes: "{count} Prozesse",
    processOne: "1 Prozess",
  },
  pageError: {
    title: "Auf dieser Seite ist ein Problem aufgetreten",
    body: "Der Rest von WinCraft funktioniert weiter, und dieser Fehler hat nichts an deinem PC geändert. Lade die Seite neu, um es noch einmal zu versuchen.",
    reload: "Seite neu laden",
    reloadApp: "WinCraft neu laden",
    details: "Technische Details",
    appTitle: "In WinCraft ist ein Problem aufgetreten",
    appBody:
      "Dieser Fehler hat nichts an deinem PC geändert. Lade WinCraft neu, um weiterzumachen.",
  },
  folderScan: {
    stop: "Suche abbrechen",
    stopping: "Wird abgebrochen…",
    stoppedEmpty: "Suche abgebrochen. Es wurde nichts verschoben oder gelöscht.",
    stoppedPartial:
      "Suche abgebrochen. Das sind die Ergebnisse bis zum Abbruch; was noch nicht erreicht war, wurde nicht geprüft.",
  },
  largeFiles: {
    title: "Grosse Dateien finden",
    description:
      "Durchsucht einen Ordner nach den grossten Dateien (uber 100 MB), damit du schnell Speicherplatz freigeben kannst, indem du nicht mehr benotigte loschst.",
    chooseFolder: "Ordner wahlen",
    scanning: "Wird durchsucht...",
    noneFound: "Keine Dateien uber {size} gefunden.",
    foundCount: "{count} Dateien gefunden",
    moveSelected: "{count} ausgewahlte in den Papierkorb verschieben",
    deleting: "Wird in den Papierkorb verschoben...",
    deletedToast: "{count} Dateien verschoben, {freed} freigegeben.",
  },
  diskHealth: {
    title: "Laufwerksgesundheit",
    freeSpace: "{size} frei",
    selectDrive: "Laufwerk",
    healthy: "Intakt",
    warning: "Warnung",
    unhealthy: "Beeintrachtigt",
    unknown: "Unbekannt",
    loading: "Wird gepruft...",
  },
  duplicateFinder: {
    title: "Doppelte Dateien finden",
    description:
      "Ordner wählen: findet identische Dateien und lässt dich auswählen, welche in den Papierkorb verschoben werden.",
    chooseFolder: "Ordner wählen",
    scanning: "Wird gescannt...",
    noneFound: "Keine doppelten Dateien in diesem Ordner gefunden.",
    copies: "{count} Kopien · je {size}",
    moveSelected: "In den Papierkorb verschieben ({count} ausgewählt)",
    deleting: "...",
    deletedToast: "{count} Dateien in den Papierkorb verschoben ({freed} freigegeben).",
  },
  ipMask: {
    title: "IP maskieren (VPN)",
    description:
      "Verbirgt deine IP-Adresse, indem der Datenverkehr über einen VPN-Server geleitet wird. Erfordert einen externen VPN-Dienst: in dieser Version noch nicht integriert.",
    button: "Mehr erfahren",
    explainerToast:
      "Echtes IP-Masking braucht ein eigenes VPN-Backend (Server + Protokoll). Das ist noch nicht angebunden — hier siehst du nur eine Vorschau der Funktion.",
  },
  toasts: {
    applied: '„{name}" angewendet.',
    rolledBack: '„{name}" auf den ursprünglichen Wert zurückgesetzt.',
    elevationDeclined:
      "Die Administratorberechtigung wurde nicht erteilt, daher wurde nichts geändert.",
    accountRefreshFailed:
      "Wir konnten den Status Ihres Kontos nicht überprüfen. Die hier angezeigten Informationen sind möglicherweise veraltet — prüfen Sie Ihre Verbindung oder versuchen Sie es später erneut.",
  },
  titlebar: {
    applied: "{applied}/{total} aktiv",
    cpu: "CPU",
    ram: "RAM",
    minimize: "Minimieren",
    maximize: "Maximieren",
    restore: "Wiederherstellen",
    close: "Schließen",
  },
  x3d: {
    title: "3D-V-Cache-Die-Ausrichtung",
    subtitle:
      "Beschränkt auf unterstützten CPUs mit unterschiedlich großen L3-Caches einen laufenden Prozess auf den Chip mit dem größten Cache. Diese Wahl ersetzt die automatische Planung für diesen Prozess und kann die Leistung verbessern oder verschlechtern.",
    cpuLabel: "Prozessor",
    readyHeadline: "V-Cache-Die gefunden: {cores} Threads",
    readyBody:
      "Heften Sie ein Spiel an dieses Die, dann bleibt jeder seiner Threads dort, wo der Cache ist.",
    singleDie:
      "Dieser Prozessor hat nur ein Die: Alle Kerne sehen bereits denselben Cache, es gibt also nichts auszurichten. Die Funktion erscheint von selbst auf einer CPU mit zwei Dies und asymmetrischem Cache.",
    uniformCache:
      "Dieser Prozessor hat mehrere Dies, alle mit gleich viel Cache. Ein Spiel zwischen ihnen zu verschieben würde nichts ändern, die Funktion bleibt daher aus.",
    unavailable: "Windows hat keine Cache-Karte für diesen Prozessor zurückgegeben.",
    dieLabel: "Die {index}",
    dieCache: "{mb} MB L3",
    dieThreads: "{count} Threads",
    vcacheBadge: "V-Cache",
    processesTitle: "Laufende Prozesse",
    processesHint: "Die aktivsten zuerst. Spiel auswählen und an das Cache-Die heften.",
    refresh: "Aktualisieren",
    refreshing: "Wird gelesen...",
    align: "Ausrichten",
    reset: "Zurücksetzen",
    alignedBadge: "Ausgerichtet",
    noProcesses: "Kein Prozess groß genug, um ihn aufzuführen.",
    persistenceNote:
      "Die Affinität gehört zum laufenden Prozess: Sie ist weg, sobald das Spiel schließt, und muss beim nächsten Start erneut gesetzt werden. Keine Systemeinstellung wird geändert.",
    alignedToast: "{name} an das V-Cache-Die geheftet.",
    resetToast: "{name} wieder auf allen Kernen.",
  },
  hardware: {
    intro:
      "Direkt von den Sensoren Ihrer Hardware gelesen. Wo es keinen Sensor gibt, sagen wir es Ihnen, statt eine Zahl anzuzeigen, die niemand überprüfen kann.",
    gpuLabel: "Grafikkarte",
    cpuLabel: "Prozessor",
    liveBadge: "Live",
    gpuDriver: "Treiber {version}",
    load: "GPU-Auslastung",
    vram: "Grafikspeicher",
    fan: "Lüfter",
    power: "Leistungsaufnahme",
    fanIdle: "steht: unter 50° nicht nötig",
    powerLimit: "Grenze {limit} W",
    tempCool: "kühl",
    tempGood: "optimal",
    tempWarm: "warm",
    tempHot: "sehr warm",
    traceLabel: "Diese Sitzung",
    traceRange: "min {min}° · max {max}°",
    noTempSensor: "Diese Karte stellt keinen Temperatursensor bereit.",
    cpuAcpiSource: "aus der ACPI-Thermalzone gelesen",
    cpuNoSensor:
      "CPU-Temperatur nicht verfügbar: Die Firmware stellt keine ACPI-Thermalzone bereit. WinCraft zeigt nur Messwerte an, die Windows bereitstellt.",
    noGpuTool:
      "Keine NVIDIA-Karte erkannt. AMD und Intel liefern kein vergleichbares Abfragewerkzeug, ihre Temperaturen sind daher ohne Herstellersoftware nicht auslesbar.",
    thermalsUnavailable: "Wir können die Sensoren dieses Systems nicht auslesen.",
    driversTitle: "Treiberalter",
    driversSubtitle:
      "Wie alt Ihre Herstellertreiber sind. Windows weiß, was installiert ist, nicht was verfügbar ist: Hier steht das belegbare Alter, nie eine erfundene Update-Meldung.",
    driversRescan: "Neu prüfen",
    driversScanning: "Wird geprüft...",
    driversCounted: "{count} Herstellertreiber",
    driversAging: "{count} älter als 2 Jahre",
    driversStale: "{count} älter als 4 Jahre",
    driversAllCurrent: "Alle aktuell",
    driversNone: "Keine Treiber von Drittherstellern in diesen Kategorien.",
    driversShowAll: "{count} weitere anzeigen",
    driversShowLess: "Weniger anzeigen",
    driversInboxNote:
      "{count} mitgelieferte Microsoft-Treiber ausgeschlossen: Windows Update pflegt sie und ihr Datum ist ein fester Platzhalter — sie als alt zu zählen wäre ein Fehlalarm.",
    ageYears: "{years} Jahre",
    ageYear: "{years} Jahr",
    ageMonths: "{months} Monate",
    ageMonth: "{months} Monat",
    vendorSite: "Herstellerseite",
    watchLabel: "Beobachtet seit",
    peakLabel: "Spitze",
    verdictRisky: "Riskant",
    verdictNormal: "Normal",
    verdictBetter: "Besser als erwartet",
    verdictIdle: "Im Leerlauf",
    verdictRiskyHint:
      "Die Karte hat 84° überschritten — ab da drosselt sie sich selbst, um sich zu schützen. Prüfen Sie den Luftstrom oder wechseln Sie zum Profil Leise.",
    verdictNormalHint:
      "Übliche Temperaturen für eine Karte unter Last: nichts Besorgniserregendes.",
    verdictBetterHint:
      "Sie blieb unter 65°, während sie wirklich gearbeitet hat: bessere Kühlung als üblich.",
    verdictIdleHint:
      "Sie hat noch nicht genug gearbeitet, um das zu beurteilen. Eine Karte im Leerlauf bleibt ohnehin kühl — das würde nichts beweisen.",
    profilesTitle: "Thermische Profile",
    profilesSubtitle:
      "Sie setzen das Leistungslimit der Karte — den Hebel, der Hitze und Lüftergeräusch tatsächlich bestimmt. Jeder Wert stammt aus den Grenzen, die die Karte selbst meldet.",
    currentLimit: "Jetzt: {watts} W",
    modeSilent: "Leise",
    modeSilentHint:
      "Für Arbeit, Streaming und lange Sitzungen: Der Lüfter bleibt fast lautlos und die Karte wird deutlich kühler — auf Kosten einiger Bilder.",
    modeStandard: "Standard",
    modeStandardHint:
      "Ein ausgewogenes Limit knapp unter der Obergrenze der Karte: leiserer Lüfter und niedrigere Temperaturen, bei wenigen Prozent weniger Bildrate.",
    modeGaming: "Gaming",
    modeGamingHint:
      "Für kompetitive Sitzungen: Watt am Maximum und angehobene Taktobergrenze, damit die 1%-Lows stabiler bleiben, wenn es darauf ankommt.",
    modeApplying: "Wird angewendet...",
    profileStageReading: "Grenzwerte der Karte werden gelesen",
    profileStageApplying: "Grenzwert wird angewendet",
    profileStageSettling: "Warten auf die Lüfter",
    profileApplied: "Limit auf {watts} W gesetzt.",
    profileNote:
      "Erfordert Administratorrechte und wird beim Neustart zurückgesetzt. Das ist keine Lüfterkurve: NVIDIA bietet in nvidia-smi keine direkte Lüftersteuerung, und die Programme, die eine anbieten, nutzen private, undokumentierte APIs, die diese App nicht anfasst.",
    profileDefaultIsMax:
      "Bei dieser Karte entspricht das Werks-Leistungslimit bereits dem Maximum, daher ändert nur Leise die Wattzahl: Gaming unterscheidet sich, indem es die Taktobergrenze anhebt.",
    driverInstalled: "installiert v{version} am {date}",
    driversHardwareChanged:
      "Diese Liste wurde auf anderer Hardware erstellt als der, auf der der PC jetzt läuft (zum Beispiel eine getauschte Grafikkarte) und wurde deshalb verworfen. Starte die Analyse neu, um die tatsächlich installierten Geräte zu lesen.",
    driversNoUpdateCheck:
      "Dieser Bildschirm kontaktiert keinen Hersteller und kann nicht wissen, ob eine neuere Version existiert: Er zeigt die installierte Version und ihr Alter und führt Sie zur offiziellen Seite, damit Sie es selbst prüfen.",
    driversCheckedAt: "Gelesen am {time}",
    modeClockLocked: "Takt bis {mhz} MHz",
    modeClockAuto: "automatischer Takt",
    profileApply: "Profil anwenden",
    profileActive: "Profil aktiv",
    profileWillSet: "Setzt {watts} W, {clock}",
    scanStarting: "Analyse startet...",
    scanReading: "Klasse {class} wird gelesen",
    scanCount: "{done}/{total} · {pct}%",
    driversScannedAll: "{total} Treiber in {classes} Kategorien geprüft",
    winUpdateLabel: "Windows Update",
    winUpdateButton: "In Windows Update suchen",
    winUpdateNote:
      "Dies prüft nur den eigenen Katalog von Windows Update, nicht die oben aufgeführten einzelnen Treiber: Viele Hersteller - besonders bei Onboard-Audio und Chipsatz - veröffentlichen ihre Updates dort nie, nur auf der eigenen Website. WinCraft lädt keine Treiberpakete selbst herunter: Es gibt keine Hersteller-API dafür, was für genau Ihr Gerät aktuell ist, und den falschen Grafiktreiber zu installieren ist einer der wenigen Fehler, die Sie ohne Bild zurücklassen können.",
    winUpdateOpened: "Windows Update geöffnet.",
    winUpdateSearching: "Wird gesucht...",
    winUpdateTakesAWhile: "Das kann eine Minute dauern - der Microsoft-Katalog wird abgefragt.",
    winUpdateInstall: "Herunterladen und installieren ({count})",
    winUpdateInstalling: "Wird heruntergeladen und installiert...",
    winUpdateNone:
      "Windows Update hat nichts Neueres zu bieten, selbst für die oben als alt markierten Treiber: Viele Hersteller veröffentlichen Updates auf eigenem Weg, nicht über Windows Update.",
    winUpdateFailed: "Suche fehlgeschlagen: {detail}",
    winUpdateDone: "Installiert {installed}, fehlgeschlagen {failed}.",
    rebootTitle: "Windows verlangt einen Neustart",
    rebootBody:
      "Windows meldet, dass eine Installation erst nach einem Neustart abgeschlossen ist. Sie können das jetzt oder später tun.",
    rebootNow: "Jetzt neu starten",
    rebootLater: "Später",
  },
  menu: {
    account: "Konto",
    plan: "Tarif",
    planFree: "Kostenlos",
    viewPlan: "Plan ansehen",
    language: "Sprache",
    theme: "Designs",
    about: "Info",
    errorReports: "Anonyme Fehlerberichte",
    errorReportsBody:
      "Wenn etwas fehlschlägt, wird nur die Fehlermeldung gesendet (niemals persönliche Daten), um Fehler schneller zu beheben. Standardmäßig deaktiviert.",
    changePhoto: "Profilfoto ändern",
    removePhoto: "Foto entfernen",
    photoFailed: "Dieses Bild konnte nicht als Profilfoto verwendet werden.",
    support: "Support",
    reportIssue: "Ein Problem melden",
    aboutBody: "WinCraft — Systemoptimierungen mit automatischer Sicherung und Wiederherstellung.",
    close: "Schließen",
  },
  auth: {
    login: "Anmelden",
    register: "Registrieren",
    email: "E-Mail",
    password: "Passwort",
    loginButton: "Anmelden",
    rememberMe: "Angemeldet bleiben",
    registerButton: "Konto erstellen",
    working: "...",
    logout: "Abmelden",
    loggedInAs: "Angemeldet als {email}",
    backendNotConfigured:
      "Noch kein Server verbunden: API_BASE_URL setzen, sobald das Backend bereitgestellt ist.",
    switchToRegister: "Noch kein Konto? Registrieren",
    switchToLogin: "Schon ein Konto? Anmelden",
    emailInvalid: "Bitte eine gültige E-Mail-Adresse eingeben.",
    passwordTooShort: "Das Passwort muss mindestens 8 Zeichen lang sein.",
    firstName: "Vorname",
    lastName: "Nachname",
    registerDetailsRequired: "Vorname, Nachname und Geburtsdatum sind erforderlich.",
    loginRequiredToResend: "Melde dich zuerst an und fordere dann einen neuen Link an.",
    checkInboxAfterSignup:
      "Wir haben einen Bestätigungslink an {email} gesendet. Sieh auch im Spam nach: Nach der Bestätigung ist dein Konto bereit.",
    forgotPasswordLink: "Passwort vergessen?",
    forgotPasswordButton: "Link zum Zurücksetzen senden",
    forgotPasswordSent:
      "Falls diese E-Mail registriert ist, erhältst du einen Link zum Zurücksetzen des Passworts.",
    backToLogin: "Zurück zur Anmeldung",
    emailNotVerified: "E-Mail nicht bestätigt",
    emailVerified: "E-Mail bestätigt",
    resendVerification: "Erneut senden",
    verificationSent: "Bestätigungs-E-Mail gesendet.",
    deleteAccount: "Konto löschen",
    deleteAccountBody:
      "Entfernt deine E-Mail-Adresse, dein Passwort und gespeicherte Angaben, meldet alle Geräte ab und lässt sich nicht rückgängig machen. Eine veröffentlichte Bewertung bleibt sichtbar, die Adresse wird davon gelöst.",
    deleteAccountPassword: "Dein aktuelles Passwort",
    deleteAccountConfirmLabel: "DELETE eingeben zum Bestätigen",
    deleteAccountSubmit: "Mein Konto endgültig löschen",
    deleteAccountCancel: "Abbrechen",
    deleteAccountDone: "Dein Konto wurde gelöscht. Alle Geräte wurden abgemeldet.",
    deleteAccountBlocked:
      "Dieses Konto hat ein aktives Abo. Kündige es zuerst unter Abo verwalten, sonst würde deine Karte nach dem Löschen weiter belastet.",
    deleteAccountWrongPassword: "Dieses Passwort passt nicht zu diesem Konto.",
    deleteAccountNeedsLogin:
      "Deine Sitzung ist abgelaufen. Melde dich erneut an, um das Konto zu löschen.",
    deleteAccountUnreachable:
      "Der Server war nicht erreichbar. Es wurde nichts gelöscht — prüfe deine Verbindung und versuche es erneut.",
  },
  driftWatch: {
    title: "Windows-Updates überwachen",
    body: "Ein kumulatives Update stellt wieder her, was es nicht kennt: Ihre Änderungen verschwinden und Sie erfahren es Wochen später, wenn überhaupt. Ist dies aktiviert, läuft die Prüfung bei der Anmeldung und meldet sich nur, wenn etwas tatsächlich nicht mehr wirksam ist.",
    on: "Aktiv",
    off: "Inaktiv",
  },
  guard: {
    settingTitle: "Spiele mit eigener Leistungssteuerung in Ruhe lassen",
    settingBody:
      "Manche Spiele steuern ihre Leistung selbst. Solange eines davon läuft, pausiert WinCraft seine Anpassungen an Apps und lässt das Spiel genau so, wie es ist.",
    selfManaged:
      "Dieses Spiel steuert seine Leistung selbst, deshalb lässt WinCraft es, wie es ist.",
    gameRunning:
      "Ein Spiel, das seine Leistung selbst steuert, läuft gerade. WinCraft lässt die Apps, wie sie sind, bis es geschlossen ist.",
    paused: "Pausiert, solange ein Spiel läuft, das seine Leistung selbst steuert.",
    selfManagedBadge: "Steuert seine Leistung selbst",
    registeredGameRunning:
      "Eines deiner Spiele läuft gerade, deshalb wartet WinCraft, bis es geschlossen ist.",
  },
  preview: {
    title: "Vorschau",
    loading: "Aktuelle Werte werden gelesen...",
    now: "Jetzt",
    notSet: "Nicht gesetzt",
    willChange: "Beim Anwenden ändern sich {count} von {total} Werten.",
    noChange: "Bereits aktiv: Anwenden ändert nichts.",
    readAtApply: "Der aktuelle Zustand wird beim Anwenden gelesen und gesichert.",
    failed: "Die aktuellen Werte konnten nicht gelesen werden.",
  },
  requirements: {
    minBuild: "{version} oder neuer",
    proEdition: "Pro, Enterprise oder Education",
    unavailableVersion: "Auf diesem PC nicht verfügbar: erfordert {version} oder neuer.",
    unavailableEdition:
      "Auf diesem PC nicht verfügbar: erfordert Windows Pro, Enterprise oder Education.",
    enterpriseEdition: "Enterprise oder Education",
    unavailableEnterpriseEdition:
      "Auf diesem PC nicht verfügbar: erfordert Windows Enterprise oder Education.",
    notPresent: "Dieser PC hat diese Funktion nicht, es gibt also nichts abzuschalten.",
    windowsProtected:
      "Auf diesem PC schützt Windows diese Einstellung und lässt keine Änderungen durch andere Apps zu. Schalte Widgets unter Einstellungen > Personalisierung > Taskleiste aus.",
  },
  scheduledCleanup: {
    title: "Wöchentliche Bereinigung temporärer Dateien",
    body: "Einmal pro Woche, ein paar Minuten nach der Anmeldung, verschiebt sie temporäre Dateien, die seit einem Tag niemand angefasst hat, in den Papierkorb. Läuft gerade ein Spiel, wartet sie, und sie rührt weder den Arbeitsspeicher noch geöffnete Apps an.",
  },
  priorityRules: {
    title: "Prioritätsregeln für Apps",
    subtitle:
      "Wähle eine App und eine Priorität. WinCraft setzt sie bei jedem Start der App, solange WinCraft geöffnet ist, und stellt die vorherige Priorität wieder her, wenn du die Regel entfernst oder WinCraft schließt. Nie über Hoch.",
    remove: "Entfernen",
    empty: "Noch keine Apps.",
    active: "Angepasste laufende Apps: {count}",
    levelLabel: "Priorität für {name}",
    idle: "Niedrig",
    belowNormal: "Niedriger als normal",
    normal: "Normal",
    aboveNormal: "Höher als normal",
    high: "Hoch",
  },
  tweaks: {
    disable_click_to_do: {
      name: "Click to Do deaktivieren",
      description:
        "Setzt die Windows-Richtlinie, die Click to Do entfernt – die Funktion, die deinen Bildschirm aufnimmt und analysiert, um Aktionen vorzuschlagen. Ihre Einstiegspunkte verschwinden für alle Konten auf diesem PC. Die Einstellungen zeigen die Option dann als von deiner Organisation verwaltet an – so kennzeichnet Windows Richtlinien. Sie wirkt nur auf PCs, auf denen Windows Click to Do anbietet.",
    },
    disable_edge_ai: {
      name: "KI-Funktionen in Microsoft Edge deaktivieren",
      description:
        "Setzt Microsoft-Edge-Richtlinien für seine KI-Funktionen. Welche wirken, hängt vom Edge-Profil ab: Edge am Herunterladen seines lokalen KI-Modells zu hindern, wirkt in jedem Profil; die Seitenleiste auszublenden sowie die KI-Suche im Verlauf und KI-generierte Designs abzuschalten, wirkt in Profilen, die nicht mit einem privaten Microsoft-Konto angemeldet sind; den Zugriff von Copilot auf Seiteninhalte und seine Schreibhilfe abzuschalten, wirkt nur in Geschäfts- oder Schulprofilen. Edge übernimmt sie ohne Neustart; edge://policy listet sie auf. Edge zeigt dann an, dass es von deiner Organisation verwaltet wird – so kennzeichnet es Richtlinien.",
    },
    disable_paint_ai: {
      name: "KI-Funktionen in Paint deaktivieren",
      description:
        "Setzt die Windows-Richtlinien, die Cocreator, Image Creator und generatives Füllen in Paint abschalten. Alles andere in Paint funktioniert wie bisher.",
    },
    disable_notepad_ai: {
      name: "KI-Funktionen im Editor deaktivieren",
      description:
        "Setzt die Editor-Richtlinie, die dessen Copilot-Schreibwerkzeuge (Umschreiben, Zusammenfassen, Schreiben) abschaltet. Schließe den Editor und öffne ihn erneut, um die Änderung zu sehen.",
    },
    disable_fast_startup: {
      name: "Schnellstart deaktivieren",
      description:
        "Macht Herunterfahren zu einem echten Herunterfahren statt eines teilweisen Ruhezustands. Windows startet aus dem ausgeschalteten Zustand ein paar Sekunden langsamer, dafür laden Treiber und Updates jedes Mal frisch, und Dual-Boot-Systeme finden das Windows-Laufwerk nicht mehr gesperrt vor.",
    },
    disable_storage_sense: {
      name: "Speicheroptimierung deaktivieren",
      description:
        "Verhindert, dass Windows nach eigenem Zeitplan temporäre Dateien löscht, den Papierkorb leert und OneDrive-Dateien nur noch online vorhält. Du entscheidest, was wann bereinigt wird.",
    },
    taskbar_end_task: {
      name: "„Task beenden“ zur Taskleiste hinzufügen",
      description:
        "Fügt dem Rechtsklickmenü von Apps in der Taskleiste den Eintrag „Task beenden“ hinzu, sodass sich eine eingefrorene App ohne den Task-Manager schließen lässt.",
    },
    disable_drag_tray: {
      name: "Freigabeleiste beim Ziehen deaktivieren",
      description:
        "Verhindert, dass die Freigabeleiste (in neueren Builds „Drop tray“) bei jedem Ziehen einer Datei vom oberen Bildschirmrand herunterfährt, damit normales Drag & Drop ungestört funktioniert. Der Wert stammt aus Dokumentation der Windows-Community, nicht von Microsoft; neuere Windows-11-Updates bieten diesen Schalter auch in den Einstellungen.",
    },
    explorer_open_this_pc: {
      name: "Datei-Explorer bei „Dieser PC“ öffnen",
      description:
        "Der Datei-Explorer öffnet sich bei „Dieser PC“ mit deinen Laufwerken und Ordnern statt bei „Start“ mit den zuletzt verwendeten Dateien.",
    },
    block_oem_device_apps: {
      name: "Hersteller-Apps nicht mehr selbst installieren lassen",
      description:
        "Verhindert, dass Windows Hersteller-Apps und benutzerdefinierte Symbole für angeschlossene Geräte herunterlädt – so landen manche Maus-, Tastatur- und Mainboard-Tools auf dem PC, ohne dass jemand danach gefragt hat. Treiber werden weiterhin wie gewohnt installiert.",
    },
    disable_windows_suggestions: {
      name: "Windows-Tipps und -Vorschläge deaktivieren",
      description:
        "Ein Schalter für die Hinweise, die Windows von sich aus einblendet: Tipps und Vorschläge, den Willkommensbildschirm nach Updates, Vorschläge in den Einstellungen, „Einrichtung des Geräts abschließen“, vorgeschlagene Benachrichtigungen, Empfehlungen und Kontohinweise im Startmenü sowie Werbung von Synchronisierungsanbietern im Datei-Explorer. Es sind die Werte, die die Schalter in den Windows-Einstellungen schreiben, wie von der Windows-Community dokumentiert; Microsoft dokumentiert sie nicht, daher kann ein Windows-Update sie ändern.",
    },
    disable_widgets: {
      name: "Widgets vollständig deaktivieren",
      description:
        "Setzt die Windows-Richtlinie, die das Widgets-Board selbst abschaltet, nicht nur seine Schaltfläche in der Taskleiste – der Nachrichten-Feed lädt dann nicht mehr im Hintergrund. Die Einstellungen zeigen die Option dann als von deiner Organisation verwaltet an – so kennzeichnet Windows Richtlinien.",
    },
    hide_start_recommended: {
      name: "„Empfohlen“ aus dem Startmenü entfernen",
      description:
        "Setzt die Windows-Richtlinie, die den Bereich „Empfohlen“ aus dem Startmenü entfernt und deinen angehefteten Apps den ganzen Platz überlässt. Die Einstellungen zeigen die Option dann als von deiner Organisation verwaltet an – so kennzeichnet Windows Richtlinien.",
    },
    disable_game_bar_captures: {
      name: "Game-Bar-Aufnahmen deaktivieren",
      description:
        "Schaltet die Aufnahmefunktion der Game Bar und ihre Hintergrundaufzeichnung ab, die fortlaufend ein Video deiner letzten Spielminuten vorhält. Ergänzt den Schalter für Game Bar / Game DVR.",
    },
    disable_ai_fabric_service: {
      name: "Windows-KI-Komponentenhost nur bei Bedarf starten",
      description:
        "Beendet den Dienst Windows-KI-Komponentenhost (WSAIFabricSvc) und stellt ihn auf Manuell, damit er nicht mehr mit Windows startet. Windows kann ihn weiterhin starten, wenn eine App oder Windows-Funktion ihn anfordert. Windows beschreibt ihn als Dienst, der Apps und anderen Windows-Diensten KI-Komponentendienste bereitstellt. Nur auf PCs vorhanden, die ihn haben.",
    },
    disable_restart_apps: {
      name: "Apps nach der Anmeldung nicht erneut öffnen",
      description:
        "Verhindert, dass Windows neu startbare Apps der vorigen Sitzung nach der Anmeldung erneut öffnet. Die automatische Sitzungswiederherstellung entfällt; laufende Apps und automatische Anmeldung bleiben unverändert.",
    },
    enable_long_paths: {
      name: "Lange Pfade in kompatiblen Apps aktivieren",
      description:
        "Apps mit erklärter Unterstützung für lange Pfade können die traditionelle Grenze überschreiten. Ältere Apps und manche Explorer-Vorgänge bleiben eventuell begrenzt. Apps neu starten; nach Rücknahme können vorhandene lange Pfade unzugänglich sein.",
    },
    disable_filter_keys_shortcut: {
      name: "Versehentliche Aktivierung der Filtertasten verhindern",
      description:
        "Deaktiviert nur die Tastenkombination mit der rechten Umschalttaste. Die Barrierefreiheitsfunktion und ihre Zeitwerte bleiben unverändert; die Tastaturlatenz sinkt nicht.",
    },
    ecoqos_rules: {
      name: "Effizienzregeln für Hintergrund-Apps",
      description:
        "Gibt ausgewählten Programmen eine niedrigere Energiepriorität, solange WinCraft geöffnet ist. Bei interaktiver Nutzung pausieren die Regeln; sie sind keine CPU-Prozentgrenze.",
    },
    limit_do_background_download: {
      name: "Limit für Windows-Hintergrunddownloads",
      description:
        "Konfiguriert ein KB/s-Limit für Microsoft-Downloads über Delivery Optimization. Steam und andere Geräte bleiben unbegrenzt; ein niedrigerer Ping ist nicht garantiert.",
    },
    monitor_refresh_profile: {
      name: "Monitorfrequenzprofil für Spiele",
      description:
        "Wählt eine unterstützte Frequenz für einen Monitor während einer Spielesitzung mit zeitlich begrenzter Vorschau und Wiederherstellung. Die GPU erzeugt dadurch nicht mehr Bilder.",
    },
    cpu_energy_performance: {
      name: "CPU-Leistung im Netzbetrieb bevorzugen",
      description:
        "Setzt die Energie-Leistungspräferenz der CPU im aktuellen Energiesparplan bei Netzbetrieb auf 0. Autonomes CPPC ist erforderlich; Temperatur- und Firmwaregrenzen gelten weiterhin. Wärme und Stromverbrauch können steigen. Der Akkubetrieb bleibt unverändert. Mit eigener Arbeitslast testen.",
    },
    pcie_link_power: {
      name: "PCIe-Verbindungen im Netzbetrieb aktiv halten",
      description:
        "Deaktiviert das Energiesparen der PCIe-Verbindungen im aktuellen Plan bei Netzbetrieb. Zur Diagnose von Problemen bei Energiezustandswechseln; geringere Latenz ist nicht garantiert. Kann den Leerlaufverbrauch erhöhen. Der Akkubetrieb bleibt unverändert.",
    },
    usb_suspend_diagnostics: {
      name: "USB-Aufwachprobleme im Netzbetrieb untersuchen",
      description:
        "Deaktiviert selektives USB-Energiesparen bei Netzbetrieb zur Untersuchung von Aufwachproblemen oder Verbindungsabbrüchen. Windows empfiehlt, es normalerweise aktiviert zu lassen. Nach dem Test wiederherstellen; der Leerlaufverbrauch kann steigen. Der Akkubetrieb bleibt unverändert.",
    },
    hybrid_short_threads: {
      name: "Leistungskerne für kurze Threads bevorzugen",
      description:
        "Bittet Windows auf CPUs mit unterschiedlichen Effizienzklassen, im Netzbetrieb Leistungskerne für kurze Threads zu bevorzugen. Eine Präferenz, keine feste Affinität. Automatische Planung kann besser funktionieren. Der Akkubetrieb bleibt unverändert.",
    },
    hybrid_long_threads: {
      name: "Leistungskerne für lange Threads bevorzugen",
      description:
        "Bittet Windows auf CPUs mit unterschiedlichen Effizienzklassen, im Netzbetrieb Leistungskerne für lange Threads zu bevorzugen. Andere Kerne bleiben verfügbar; E-Kerne werden nicht deaktiviert. Durchsatz und Reaktionsfähigkeit vergleichen. Der Akkubetrieb bleibt unverändert.",
    },
    disable_startup_delay: {
      name: "Verzögerung der Autostart-Programme entfernen",
      description:
        "Windows wartet nach der Anmeldung absichtlich etwa 10 Sekunden, bevor Autostart-Programme gestartet werden. Diese Option entfernt die Wartezeit.",
    },
    menu_show_delay: {
      name: "Sofortige Menüreaktion",
      description:
        "Entfernt die Verzögerung beim Öffnen von Menüs, wodurch sich der gesamte Desktop spürbar flotter anfühlt.",
    },
    disable_power_throttling: {
      name: "CPU-Energiedrosselung deaktivieren",
      description:
        "Verhindert, dass Windows Hintergrundprozesse zum Energiesparen ausbremst - nützlich bei Notebooks, wo das bei langen Sitzungen zu Rucklern führt.",
    },
    games_gpu_priority: {
      name: "Veralteten GPU-Priority-Wert für Spiele setzen",
      description:
        "Schreibt den GPU-Priority-Wert für Spiele, den Microsoft als ungenutzt dokumentiert. Eine höhere GPU-Priorität oder Bildrate ist nicht zu erwarten.",
    },
    disable_tailored_experiences: {
      name: "Personalisierte Erlebnisse deaktivieren",
      description:
        "Verhindert, dass Windows deine Diagnosedaten nutzt, um Werbung, Tipps und Empfehlungen zu personalisieren.",
    },
    disable_app_launch_tracking: {
      name: "Nicht mehr erfassen, welche Apps du öffnest",
      description:
        "Windows protokolliert, wie oft du jedes Programm startest, um Startmenü-Ergebnisse zu sortieren. Diese Option schaltet das ab.",
    },
    disable_feedback_requests: {
      name: "Windows-Feedback-Abfragen unterbinden",
      description:
        'Verhindert, dass Windows dich mit Umfragen wie „Wie wahrscheinlich ist es, dass du ... weiterempfiehlst" unterbricht.',
    },
    disable_cortana: {
      name: "Cortana deaktivieren",
      description:
        "Schaltet Cortana per Systemrichtlinie ab und gibt die im Hintergrund reservierten Ressourcen frei.",
    },
    show_file_extensions: {
      name: "Dateiendungen immer anzeigen",
      description:
        'Zeigt die echte Endung jeder Datei. Allein aus Sicherheitsgründen sinnvoll: Dateien wie „rechnung.pdf.exe" werden so sichtbar, die Windows sonst verbirgt.',
    },
    hide_taskbar_widgets: {
      name: "Widgets aus der Taskleiste ausblenden",
      description:
        "Entfernt die Widgets-Schaltfläche (Wetter/Nachrichten), die auch dann Inhalte im Hintergrund lädt, wenn du sie nie öffnest.",
    },
    network_latency: {
      name: "TCP-Bestätigungen und Paketbündelung",
      description:
        "Setzt TcpAckFrequency und TCPNoDelay für den Adapter, über den die Route ins Internet läuft, auf 1. Dies betrifft TCP; UDP-Verkehr bleibt unverändert. Die Unterstützung hängt von Windows und den Anwendungen ab. Eine niedrigere Latenz in Spielen ist nicht garantiert.",
    },
    disable_window_animations: {
      name: "Sofortige Fensteranimationen",
      description:
        "Entfernt die Animation, die Windows bei jedem Oeffnen, Schliessen oder Minimieren eines Fensters abspielt. Diese Animation ist reine Wartezeit: Ohne sie reagiert der Desktop im Moment des Klicks, und die dahinterliegende GPU-Arbeit entfaellt.",
    },
    disable_drag_full_windows: {
      name: "Leichteres Verschieben von Fenstern",
      description:
        "Zeichnet beim Verschieben eines Fensters nur dessen Umriss, statt den gesamten Inhalt in jedem Einzelbild neu zu zeichnen. Auf einer schnellen GPU kaum spuerbar, auf integrierter Grafik oder einem aelteren Rechner deutlich.",
    },
    mouse_hover_delay: {
      name: "Sofortige Reaktion beim Ueberfahren mit der Maus",
      description:
        "Windows wartet 400 ms, bevor es auf den ruhenden Mauszeiger reagiert - Taskleistenvorschauen, QuickInfos, Menues. Diese Wartezeit sinkt auf nahezu null, die Oberflaeche folgt der Maus, statt ihr hinterherzuhinken.",
    },
    disable_background_apps: {
      name: "Apps im Hintergrund stoppen",
      description:
        "Verhindert, dass Store-Apps laufen, sich aktualisieren und das Netzwerk abfragen, waehrend Sie sie nicht nutzen. Das sind echte CPU-, RAM- und Akkuressourcen fuer Apps, die Sie nie geoeffnet haben.",
    },
    disable_delivery_optimization: {
      name: "Windows-Updates nicht mehr mit Fremden teilen",
      description:
        "Windows laedt heruntergeladene Updatedateien standardmaessig ueber Ihre Verbindung zu anderen PCs hoch. Dies beschraenkt die Uebermittlungsoptimierung auf Ihren eigenen Rechner, damit dieser Upload nicht mitten im Spiel Bandbreite frisst.",
    },
    disable_copilot: {
      name: "Alte Copilot-Richtlinie (nur Wiederherstellung)",
      description:
        "Diese eingestellte Richtlinie steuert die aktuelle Copilot-App nicht. Hier kannst du den gespeicherten Registrierungswert wiederherstellen. Verwalte die separate Copilot-App in Debloat; das Entfernen verhindert keine spätere Neuinstallation.",
    },
    disable_suggested_apps: {
      name: "Verhindern, dass Windows selbst Apps installiert",
      description:
        "Windows installiert unaufgefordert „vorgeschlagene“ Apps und Spiele in Ihr Startmenü — bei der Installation und erneut nach großen Updates. Dies schaltet das ab, sodass nichts mehr auf Ihrem Rechner landet, was Sie nicht selbst ausgewählt haben.",
    },
    disable_mouse_acceleration: {
      name: "Mausbeschleunigung deaktivieren",
      description:
        "Schaltet „Zeigerbeschleunigung verbessern“ ab, wodurch der Zeiger bei schnellen Bewegungen weiter läuft. Genau diese variable Reaktion will man beim Zielen nicht: Dieselbe Handbewegung muss immer dieselbe Strecke auf dem Bildschirm zurücklegen.",
    },
    disable_sticky_keys_prompt: {
      name: "Die Einrastfunktion-Meldung abschalten",
      description:
        "Fünfmal Umschalt öffnet den Einrastfunktion-Dialog — im Spiel bedeutet das ein Verlassen des Vollbilds im ungünstigsten Moment, meist mitten im Kampf. Dies deaktiviert das Tastenkürzel und seine Meldung; die Einrastfunktion selbst bleibt in den Einstellungen verfügbar.",
    },
    disable_recall: {
      name: "Recall deaktivieren (KI-Bildschirmaufnahmen)",
      description:
        "Recall nimmt alle paar Sekunden ein Bild Ihres Bildschirms auf und baut daraus einen KI-durchsuchbaren Verlauf von allem, was Sie angesehen haben — Passwörter und private Nachrichten eingeschlossen, denn es erfasst alles, was auf dem Bildschirm steht. Dies setzt die Systemrichtlinie, die jede Analyse und Speicherung unterbindet.",
    },
    global_timer_resolution: {
      name: "Globale Timer-Auflösung",
      description:
        "Setzt den Registrierungswert GlobalTimerResolutionRequests auf 1. Dies fordert keine bestimmte Timerauflösung an und prüft sie auch nicht. Das Verhalten hängt von der Windows-Version ab; niedrigere Latenz oder höhere FPS sind nicht garantiert. Neustart erforderlich.",
    },
    disable_core_parking: {
      name: "Core-Parking deaktivieren",
      description:
        "Verhindert, dass Windows im Netzbetrieb ungenutzte CPU-Kerne parkt, damit ein Kern nicht erst geweckt werden muss, bevor er Eingaben oder eine plötzliche Lastspitze bedienen kann. Gilt nur für das Netzprofil — im Akkubetrieb ist Parken genau dafür da. Der vorherige Wert des Plans wird gesichert und exakt wiederhergestellt (erfordert Administratorrechte).",
    },
    disable_memory_integrity: {
      name: "Speicherintegrität (VBS) deaktivieren",
      description:
        "Fordert die Deaktivierung der Speicherintegrität (HVCI) an. Wird sie umgesetzt, entfällt eine Schutzschicht des Kernels; andere VBS-Funktionen können aktiv bleiben. Die Auswirkungen auf die Leistung hängen von Hardware und Arbeitslast ab. Systemrichtlinien oder eine UEFI-Sperre können die Änderung verhindern. Starte neu und prüfe den Status in Windows-Sicherheit.",
    },
    disable_typing_personalization: {
      name: "Verhindern, dass Windows Ihren Schreibstil lernt",
      description:
        "Windows baut aus dem, was Sie tippen und handschriftlich eingeben, ein persönliches Wörterbuch auf — auch in Passwort-Managern, Chatfenstern und Suchfeldern — und synchronisiert es mit Ihrem Microsoft-Konto, um seine Vorschläge zu verbessern. Dies schaltet sowohl die Text- als auch die Handschrifterfassung ab.",
    },
    classic_context_menu: {
      name: "Das vollständige Rechtsklick-Menü zurückholen",
      description:
        "Windows 11 versteckt den größten Teil des Kontextmenüs hinter „Weitere Optionen anzeigen“ und macht aus einem Klick zwei — bei Dingen, die man den ganzen Tag tut. Dies stellt das vollständige Windows-10-Menü überall wieder her, im Explorer und auf dem Desktop. Der Explorer startet zum Anwenden neu, offene Fenster flackern daher einmal.",
    },
    disable_transparency: {
      name: "Transparenzeffekte deaktivieren",
      description:
        "Schaltet die Weichzeichner-/Acryleffekte in Taskleiste und Menüs ab. Eine kleine, aber echte GPU-Ersparnis, die ältere Rechner oder Systeme mit integrierter Grafik flüssiger macht.",
    },
    dark_mode: {
      name: "Dunkler Modus",
      description: "Aktiviert das dunkle Design für Apps und System.",
    },
    show_hidden_files: {
      name: "Versteckte Dateien anzeigen",
      description: "Zeigt versteckte Dateien und Ordner im Explorer an.",
    },
    priority_separation: {
      name: "CPU-Priorität optimieren",
      description:
        "Stellt Win32PrioritySeparation (0x26) so ein, dass die Vordergrund-App kurze, variable CPU-Zeitscheiben mit 3x-Priorität erhält — der klassische Wert für Desktop-/Gaming-Reaktionsschnelligkeit.",
    },
    disable_game_dvr: {
      name: "Xbox Game Bar / Game DVR deaktivieren",
      description:
        "Deaktiviert die Hintergrundaufnahme der Xbox Game Bar, die beim Spielen CPU/GPU beansprucht.",
    },
    disable_telemetry_tasks: {
      name: "Diagnosedatenerfassung reduzieren",
      description:
        "Setzt die Windows-Richtlinie für Diagnosedaten auf die niedrigste Stufe. Home und Pro behandeln das als erforderliche Diagnosedaten; nur Enterprise und Education schalten sie vollständig ab.",
    },
    reset_advertising_id: {
      name: "Werbe-ID deaktivieren",
      description: "Verhindert, dass Apps deine Werbe-ID zur Profilbildung nutzen.",
    },
    disable_location_tracking: {
      name: "Standortverfolgung deaktivieren",
      description: "Blockiert den Standortzugriff für alle Apps per Systemrichtlinie.",
    },
    disable_bing_search: {
      name: "Bing-Suche im Startmenü deaktivieren",
      description: "Verhindert, dass deine Suchanfragen im Startmenü an Bing gesendet werden.",
    },
    power_plan_performance: {
      name: "Hohe Leistung (Energiesparplan)",
      description:
        'Wechselt zum Windows-Energiesparplan „Hohe Leistung". Nützlich bei Desktop-PCs oder im Netzbetrieb; stellt beim Rückgängigmachen den vorherigen Plan wieder her.',
    },
    turbo_gaming: {
      name: "Turbo Gaming",
      description:
        "Preset: deaktiviert Game DVR, stellt den Energiesparplan auf Hohe Leistung und optimiert die CPU-Priorität (Administratorrechte erforderlich).",
    },
    privacy_dns: {
      name: "Privates DNS (Cloudflare)",
      description:
        "Wechselt zu datenschutzfreundlichen DNS-Servern (1.1.1.1), damit dein Provider DNS-Anfragen nicht protokollieren kann. Verbirgt nicht deine IP-Adresse (dafür ist ein VPN nötig, siehe unten).",
    },
    hardware_gpu_scheduling: {
      name: "Hardwarebeschleunigte GPU-Planung",
      description:
        "Fordert hardwarebeschleunigte GPU-Planung (HAGS) an. Erfordert eine kompatible GPU, einen passenden Treiber und eine unterstützte Windows-Version. Leistung und Latenz können sich je nach Spiel verbessern, verschlechtern oder unverändert bleiben. Starte neu und prüfe die Verfügbarkeit in den Windows-Grafikeinstellungen.",
    },
    reduce_input_lag: {
      name: "Eingabeverzögerung reduzieren (Maus)",
      description:
        'Deaktiviert die Zeigerbeschleunigung („Mauspräzision verbessern") für eine 1:1-Mausbewegung ohne systemseitige Verzögerung.',
    },
    turbo_boost: {
      name: "Prozessor-Turbo-Boost",
      description:
        "Setzt im aktuellen Energiesparplan den Boost-Modus im Netz- und Akkubetrieb auf Aggressiv und den minimalen Prozessorzustand im Netzbetrieb auf 100 %. Stromverbrauch und Wärme können steigen. CPU-, Firmware- und Temperaturgrenzen gelten weiterhin; höhere FPS sind nicht garantiert (Administratorrechte erforderlich).",
    },
    network_throttling_index: {
      name: "Netzwerk-Drosselung für Multimedia deaktivieren",
      description:
        "Entfernt die Begrenzung, die Windows dem Netzwerkverkehr bei Multimedia-/Spiele-Apps auferlegt — nützlich, um Online-Mikroruckler zu reduzieren.",
    },
    system_responsiveness: {
      name: "MMCSS-CPU-Reserve für Hintergrundaufgaben setzen",
      description:
        "Schreibt SystemResponsiveness=0, was Windows als 20 % behandelt. Das beseitigt den CPU-Anteil für Aufgaben mit niedrigerer Priorität nicht und priorisiert nicht jede Vordergrund-App.",
    },
    games_task_priority: {
      name: "MMCSS-Kategorie Games setzen",
      description:
        "Setzt die Kategorie Games für bei MMCSS registrierte Threads auf High; bei High gilt Priority als 2. Die ebenfalls geschriebenen GPU- und SFIO-Priority-Werte werden nicht verwendet. Das priorisiert nicht jeden Spielprozess.",
    },
    reduce_keyboard_delay: {
      name: "Eingabeverzögerung reduzieren (Tastatur)",
      description:
        "Setzt die Verzögerung, bevor eine gehaltene Taste zu wiederholen beginnt, auf null und maximiert die Wiederholrate — für eine unmittelbarere Reaktion beim Spielen.",
    },
    keep_kernel_in_ram: {
      name: "Kernel und Treiber im RAM halten",
      description:
        "Windows kann Teile des Kernels und des Treibercodes selbst bei reichlich Speicher auf die Festplatte auslagern, und sie zurückzulesen ist eine Pause, die sich als Ruckler anfühlt. Dies hält sie resident. Lohnt sich, wenn RAM übrig ist; auf einem PC mit wenig Speicher besser aus lassen.",
    },
    auto_end_frozen_tasks: {
      name: "Eine eingefrorene App soll das Herunterfahren nicht blockieren",
      description:
        'Wenn eine Anwendung beim Herunterfahren nicht mehr reagiert, wartet Windows und zeigt den Bildschirm "Diese App verhindert das Herunterfahren", bis jemand klickt. Dies schließt nicht reagierende Anwendungen automatisch, damit ein hängendes Programm den Rechner nicht eingeschaltet stehen lässt. Warnung: Das automatische Schließen von Apps kann nicht gespeicherte Arbeit verlieren. Das Wiederherstellen dieser Einstellung stellt diese Arbeit nicht wieder her.',
    },
    instant_folder_loading: {
      name: "Jeden Ordner sofort öffnen",
      description:
        "Der Explorer durchsucht den Inhalt eines Ordners, um zu raten, ob es Bilder, Musik oder Dokumente sind, und ein Ordner mit Tausenden Mediendateien kann dabei sekundenlang hängen. Dies legt alle Ordner auf das allgemeine Layout fest, sodass sie sofort öffnen.",
    },
    tcp_congestion_bbr: {
      name: "Niedrige Latenz auch bei ausgelasteter Leitung (BBR2)",
      description:
        "Windows verwendet CUBIC, das so lange beschleunigt, bis irgendwo ein Puffer überläuft — deshalb steigt der Ping, sobald jemand anders im Haus einen Download startet. BBR2 misst stattdessen die tatsächliche Bandbreite und die Umlaufzeit der Leitung und taktet den Verkehr passend dazu, sodass die Leitung voll wird, ohne dass die Warteschlange voll wird. Microsoft liefert BBR2 mit Windows 11 aus; dies stellt die Internet-Vorlage darauf um und stellt exakt den vorherigen Zustand wieder her (erfordert Administratorrechte).",
    },
    taskbar_align_left: {
      name: "Taskleiste links ausrichten",
      description:
        "Richtet die Taskleisten-Symbole wieder links aus (Windows-10-Stil) statt zentriert.",
    },
    hide_taskbar_chat: {
      name: "Chat/Teams aus der Taskleiste ausblenden",
      description: "Entfernt das Chat-Symbol (Microsoft Teams) aus der Taskleiste.",
    },
    disable_start_suggestions: {
      name: "Startmenü-Vorschläge und empfohlene Apps deaktivieren",
      description:
        "Verhindert, dass Windows empfohlene Apps, Werbung und Vorschläge im Startmenü anzeigt.",
    },
    disable_activity_history: {
      name: "Aktivitätsverlauf deaktivieren (Windows Timeline)",
      description:
        "Verhindert, dass Windows deinen App- und Dokumentenverlauf per Systemrichtlinie aufzeichnet, speichert und an Microsoft sendet.",
    },
    hide_taskbar_search: {
      name: "Suchfeld aus der Taskleiste ausblenden",
      description:
        "Entfernt das Suchfeld/-symbol aus der Taskleiste für eine aufgeräumtere Leiste (die Suche bleibt über die Windows-Taste verfügbar).",
    },
    disable_fullscreen_optimizations_global: {
      name: "Vollbildoptimierungen global deaktivieren",
      description:
        "Zwingt DXGI dazu, den echten exklusiven Vollbildmodus statt der simulierten Windows-Variante zu verwenden, was Mikroruckler und Eingabeverzögerung in vielen älteren Spielen reduziert.",
    },
    disable_windows_search_service: {
      name: "Indizierungsdienst deaktivieren (Windows Search)",
      description:
        "Stoppt und deaktiviert den Datei-Indizierungsdienst von Windows und reduziert so die Festplattenaktivität im Hintergrund — nützlich bei kleinen SSDs oder beim Spielen. Die Dateisuche im Startmenü wird langsamer, bis du ihn wieder aktivierst (Administratorrechte erforderlich).",
    },
    disable_dmwappush_service: {
      name: "Push-Dienst für Geräteverwaltung nur bei Bedarf starten",
      description:
        "Stoppt den WAP-Push-Routingdienst und stellt ihn auf Manuell, sodass er nicht mehr mit Windows startet, aber bei Bedarf weiterhin gestartet werden kann.",
    },
    disable_diagtrack_service: {
      name: "Telemetriedienst deaktivieren (Benutzererfahrung)",
      description:
        "Stoppt und deaktiviert den Dienst für verbundene Benutzererfahrungen und Telemetrie, der Nutzungs- und Diagnosedaten an Microsoft sendet. Windows Update und Fehlerberichterstattung funktionieren weiterhin.",
    },
    enable_regback: {
      name: "Automatische Registrierungssicherung aktivieren (RegBack)",
      description:
        "Aktiviert regelmäßige automatische Sicherungen der Windows-Registrierungsstruktur in %SystemRoot%\\System32\\config\\RegBack für die Notfallwiederherstellung.",
    },
    explorer_anti_hang: {
      name: "Hänger des Explorers bei Verknüpfungen verhindern",
      description:
        "Deaktiviert die Zielverfolgung und Netzwerksuche beim Öffnen von Verknüpfungen, damit der Datei-Explorer nicht einfriert, wenn Verknüpfungen auf getrennte Laufwerke oder Netzwerkfreigaben zeigen.",
    },
    no_internet_open_with: {
      name: "Microsoft-Store-Suche für unbekannte Dateien überspringen",
      description:
        "Öffnet sofort den lokalen Dialog „Öffnen mit“, anstatt beim Doppelklick auf unbekannte Dateitypen eine Suche im Microsoft Store vorzuschlagen.",
    },
    detailed_bsod: {
      name: "Detaillierte BSOD-Absturzparameter anzeigen",
      description:
        "Zeigt exakte hexadezimale Stoppcodes, fehlerhafte Treiber und Speicheradressen auf Bluescreens an, anstatt sie hinter einem QR-Code zu verbergen.",
    },
    disable_wpbt: {
      name: "Ausführung von UEFI-WPBT-Software blockieren",
      description:
        "Verhindert, dass die UEFI-Firmware des Mainboards über die Windows Platform Binary Table automatisch unerwünschte OEM-Programme in Windows installiert.",
    },
    disable_ndu: {
      name: "NDU-Speicherleck im nicht ausgelagerten Pool beheben",
      description:
        "Deaktiviert den Treiberdienst Network Diagnostic Usage und verhindert so eine hohe Belegung des nicht ausgelagerten Speicherpools bei großen Netzwerkübertragungen.",
    },
    disable_search_highlights: {
      name: "Suchhervorhebungen und Doodles deaktivieren",
      description:
        "Entfernt Webgrafiken, tägliche Bing-Doodles und Trendthemen aus der Windows-Suchleiste und der Taskleiste.",
    },
    auto_complete_run: {
      name: "Automatische Vervollständigung im Ausführen-Dialog aktivieren",
      description:
        "Aktiviert die sofortige automatische Befehlsvervollständigung und Vorschläge im Windows-Ausführen-Dialog (Win + R).",
    },
    disable_aero_shake: {
      name: "Fensterminimierung durch Schütteln (Aero Shake) deaktivieren",
      description:
        "Verhindert, dass das Schütteln an der Titelleiste eines Fensters versehentlich alle anderen geöffneten Fenster minimiert.",
    },
    disable_remote_assistance: {
      name: "Remoteunterstützungseinladungen deaktivieren",
      description:
        "Deaktiviert Verbindungen und Einladungen zur Windows-Remoteunterstützung, um das System vor unaufgeforderten Supportanfragen zu schützen.",
    },
    disable_llmnr: {
      name: "LLMNR-Protokoll deaktivieren",
      description:
        "Deaktiviert Link-Local Multicast Name Resolution (LLMNR), um sich vor Spoofing-Angriffen und Anmeldeinformationsabfängen im lokalen Netzwerk zu schützen.",
    },
    disable_wifi_sense: {
      name: "Wi-Fi Sense Hotspot-Freigabe deaktivieren",
      description:
        "Verhindert, dass sich Windows automatisch mit offenen WLAN-Netzwerken verbindet oder Netzwerkdaten mit Kontakten teilt.",
    },
    disable_cloud_search: {
      name: "Cloud-Suche in der Windows-Suche deaktivieren",
      description:
        "Verhindert, dass die Windows-Suche den Cloud-Verlauf und Suchprotokolle des Microsoft-Kontos abfragt, wenn nach lokalen Dateien gesucht wird.",
    },
    disable_app_suggestions_start: {
      name: "Vorschläge und Tipps im Startmenü deaktivieren",
      description: "Schaltet werbliche App-Vorschläge und Funktionstipps im Windows-Startmenü aus.",
    },
    disable_handwriting_sharing: {
      name: "Teilen von Handschriftfehlerberichten deaktivieren",
      description:
        "Verhindert, dass Windows Fehlerprotokolle der Handschrifterkennung und Stiftstriche an Microsoft überträgt.",
    },
    disable_ceip: {
      name: "Programm zur Verbesserung der Benutzerfreundlichkeit (CEIP) deaktivieren",
      description:
        "Schaltet den Windows-SQM-Telemetrie-Client für das Programm zur Verbesserung der Benutzerfreundlichkeit (CEIP) aus.",
    },
    disable_lockscreen_camera: {
      name: "Kamera auf dem Sperrbildschirm deaktivieren",
      description:
        "Deaktiviert die Kamerafunktion auf dem Sperrbildschirm, um Fotoaufnahmen ohne Entsperren des Geräts zu verhindern.",
    },
    disable_cortana_consent: {
      name: "Cortana-Suchzustimmung widerrufen",
      description:
        "Widerruft die Zustimmung zur Cortana-Suche, damit Suchanfragen und Sprachdaten nicht an Microsoft-Clouddienste übermittelt werden.",
    },
    disable_wer_queuing: {
      name: "Warteschlange für Windows-Fehlerberichte deaktivieren",
      description:
        "Verhindert, dass die Windows-Fehlerberichterstattung Absturzberichte auf der Festplatte zwischenspeichert und wartet.",
    },
    disable_experimentation: {
      name: "Windows-Experimentiertelemetrie deaktivieren",
      description:
        "Deaktiviert Microsoft-A/B-Tests und Experimentierfunktionen in Windows, um ein einheitliches und vorhersehbares Systemverhalten zu gewährleisten.",
    },
    disable_app_inventory_collection: {
      name: "Anwendungskompatibilitätsinventar deaktivieren",
      description:
        "Deaktiviert den Kompatibilitätsinventar-Sammler, der installierte Software scannt und an Microsoft meldet.",
    },
    disable_problem_steps_recorder: {
      name: "Telemetrie der Problemaufzeichnung deaktivieren",
      description:
        "Deaktiviert die Fehlererfassung und Übermittlung von Diagnosedaten durch die Problemaufzeichnung (PSR).",
    },
    disable_ait_telemetry: {
      name: "Anwendungsauswirkungstelemetrie (AIT) deaktivieren",
      description:
        "Deaktiviert die Erfassung von Application Impact Telemetry (AIT) beim Starten von Anwendungen.",
    },
    disable_smartscreen_app_install: {
      name: "SmartScreen-App-Installations-Telemetrie deaktivieren",
      description:
        "Deaktiviert die Übermittlung von Installations-Telemetriedaten und URL-Abfragen von SmartScreen.",
    },
    disable_online_speech_privacy: {
      name: "Datenerfassung für Online-Spracherkennung deaktivieren",
      description:
        "Deaktiviert die Erfassung von Sprachdaten in der Cloud für Spracheingabe und Sprachmodelle.",
    },
    disable_edge_shopping: {
      name: "Edge-Shopping-Assistenten deaktivieren",
      description:
        "Deaktiviert den Einkaufsassistenten und die Gutscheinverfolgung in Microsoft Edge.",
    },
    disable_edge_metrics: {
      name: "Edge-Diagnosemetrikberichte deaktivieren",
      description:
        "Deaktiviert die Übermittlung von Nutzungsmetriken und Absturzberichten von Microsoft Edge.",
    },
    disable_edge_startup_boost: {
      name: "Edge-Startverstärkung deaktivieren",
      description:
        "Deaktiviert den Schnellstart von Microsoft Edge und verhindert Hintergrundprozesse beim Windows-Start.",
    },
    disable_edge_background_mode: {
      name: "Edge-Hintergrunderweiterungsmodus deaktivieren",
      description:
        "Verhindert, dass Microsoft Edge nach dem Schließen im Hintergrund weiterläuft, und spart Arbeitsspeicher.",
    },
    disable_bluetooth_le_discovery: {
      name: "Hintergrundsuche nach Bluetooth LE deaktivieren",
      description:
        "Deaktiviert die kontinuierliche Hintergrundsuche nach Bluetooth-Low-Energy-Geräten, um CPU-Last und Stromverbrauch zu senken.",
    },
    disable_edge_wallet: {
      name: "Edge-Wallet-Vorschläge deaktivieren",
      description:
        "Verhindert, dass Microsoft Edge automatisch Zahlungs- und Wallet-Dienste abfragt.",
    },
    disable_cortana_above_lock: {
      name: "Cortana über dem Sperrbildschirm deaktivieren",
      description:
        "Verhindert, dass Sprachassistenten und die Suche bei gesperrtem Bildschirm zuhören oder aktiviert werden.",
    },
    disable_device_history: {
      name: "Geräteaktivitätsverlauf von Windows deaktivieren",
      description:
        "Verhindert, dass Windows den App- und Dateiverlauf auf diesem Gerät aufzeichnet.",
    },
    disable_search_history: {
      name: "Suchverlauf der Taskleiste deaktivieren",
      description:
        "Deaktiviert die Speicherung vergangener Suchanfragen in der Taskleiste und im Startmenü.",
    },
    disable_news_and_interests: {
      name: "Neuigkeiten und interessante Themen deaktivieren",
      description:
        "Blendet das Wetter- und News-Widget in der Taskleiste aus und spart Netzwerk sowie Arbeitsspeicher.",
    },
    disable_auto_maintenance_wake: {
      name: "Aufwachen für automatische Wartung deaktivieren",
      description:
        "Verhindert, dass die automatische Windows-Wartung das Gerät nachts aufweckt oder den Akku entlädt.",
    },
    disable_diagnostic_data_viewer: {
      name: "Lokalen Diagnosedatenspeicher deaktivieren",
      description:
        "Verhindert, dass die Windows-Diagnosetelemetrie lokale Cache-Datenbanken auf dem Datenträger reserviert.",
    },
    disable_activity_feed: {
      name: "Aktivitätsfeed und Zeitachse deaktivieren",
      description:
        "Verhindert, dass Windows Zeitachsen-Graphen erstellt und Benutzeraktivitäten geräteübergreifend verfolgt.",
    },
    disable_publish_user_activities: {
      name: "Veröffentlichung von Benutzeraktivitäten in der Cloud deaktivieren",
      description:
        "Verhindert, dass Windows den Aktivitätsverlauf an Microsoft-Clouddienste synchronisiert.",
    },
    disable_typing_insights: {
      name: "Eingabeerkenntnisse-Telemetrie deaktivieren",
      description:
        "Verhindert, dass Windows Tastenanschlagsmuster und Autovervollständigungsstatistiken analysiert.",
    },
    disable_inking_typing_personalization: {
      name: "Handschrift- und Tastatureingabe-Personalisierung deaktivieren",
      description:
        "Verhindert, dass Windows lokale Wörterbuchdaten für Handschrift und Tastatur an Microsoft sendet.",
    },
    disable_shared_experiences: {
      name: "Freigabe für verbundene Geräte deaktivieren",
      description:
        "Deaktiviert die Hintergrundsynchronisierung der Connected Devices Platform (CDP) über Konten hinweg.",
    },
    disable_remote_desktop: {
      name: "Eingehende Remotedesktop-Verbindungen deaktivieren",
      description:
        "Blockiert eingehende RDP-Remotedesktopverbindungen, um die Angriffsfläche zu verringern.",
    },
    disable_edge_collections: {
      name: "Microsoft Edge-Sammlungen deaktivieren",
      description:
        "Deaktiviert Edge-Sammlungen und die Hintergrundsynchronisierung, um Ressourcen zu sparen.",
    },
    disable_edge_quick_search: {
      name: "Edge-Desktop-Suchleisten-Widget deaktivieren",
      description:
        "Verhindert, dass Microsoft Edge unverankerte Such-Widgets auf dem Windows-Desktop anzeigt.",
    },
    disable_edge_personalization: {
      name: "Edge-Personalisierung und Browsing-Telemetrie deaktivieren",
      description:
        "Deaktiviert das Melden des Browserverlaufs und personalisierter Werbeprofile in Microsoft Edge.",
    },
    disable_lockscreen_spotlight: {
      name: "Windows-Blickpunkt auf dem Sperrbildschirm deaktivieren",
      description:
        "Verhindert das Herunterladen von Werbehintergrundbildern und Tipps auf dem Sperrbildschirm.",
    },
    disable_push_install_service: {
      name: "PushToInstall-Remoteverteilungsdienst deaktivieren",
      description:
        "Verhindert, dass der Microsoft Store App-Installationen remote aus dem Web auf diesen PC überträgt.",
    },
    disable_compatibility_assistant: {
      name: "Programmkompatibilitäts-Assistenten deaktivieren",
      description:
        "Deaktiviert Popups und Hintergrundprüfungen des Programmkompatibilitäts-Assistenten beim Starten älterer Tools.",
    },
    disable_cortana_cloud_search: {
      name: "Windows Search-Cloud-Indexer deaktivieren",
      description:
        "Verhindert, dass Windows Search bei der lokalen Dateisuche Cloud-Indizes und Bing-Server abfragt.",
    },
    disable_find_my_device: {
      name: "Mein Gerät suchen-Ortung deaktivieren",
      description:
        "Deaktiviert die kontinuierliche GPS- und WLAN-Standortübertragung für Mein Gerät suchen.",
    },
    disable_sensors_data_collection: {
      name: "Datenerfassung von Hardwaresensoren deaktivieren",
      description:
        "Deaktiviert die Hintergrundüberwachung von Sensoren (Umgebungslicht, Beschleunigungsmesser) und Ortung.",
    },
    disable_location_scripting: {
      name: "Standortzugriff für Skripte deaktivieren",
      description:
        "Verhindert, dass Hintergrundskripte und Browser-Engines den physischen Gerätestandort abfragen.",
    },
    disable_advertising_info: {
      name: "Richtlinie für Werbeinformationen deaktivieren",
      description:
        "Erzwingt eine Gruppenrichtliniensperre, die das Werbe-ID-Tracking systemweit für alle Benutzer deaktiviert.",
    },
    disable_sync_settings: {
      name: "Cloud-Synchronisierung von Windows-Einstellungen deaktivieren",
      description:
        "Verhindert, dass Windows Personalisierung, Kennwörter und Systemeinstellungen mit Microsoft-Servern synchronisiert.",
    },
    disable_app_diagnostics_access: {
      name: "App-Zugriff auf Diagnoseinformationen deaktivieren",
      description:
        "Blockiert den Zugriff von Store-Apps von Drittanbietern auf Diagnoseinformationen und Systemtelemetrie.",
    },
  },
  cleanup: {
    temp_cleanup: {
      name: "Temporäre Dateien bereinigen",
      description:
        "Verschiebt den Inhalt von %TEMP% in den Papierkorb: jederzeit wiederherstellbar, kein endgültiges Löschen.",
    },
    winupdate_cache_cleanup: {
      name: "Windows Update-Cache leeren",
      description:
        "Verschiebt bereits installierte Windows Update-Pakete in den Papierkorb (Administratorrechte erforderlich).",
    },
  },
};
