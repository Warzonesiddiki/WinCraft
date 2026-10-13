import type { Strings } from "../i18n";

/**
 * The Italian table, on its own so the app can ship one language and
 * fetch the others on demand (Batch Z). It is data only: no logic lives here.
 */
export const it: Strings = {
  coffee: {
    nav: "Offrimi un caffè",
    cta: "Finanzia la prossima release",
    fewer: "Un caffè in meno",
    more: "Un caffè in più",
  },
  appName: "WinCraft",
  appliedCount: "{applied} di {total} tweak attivi",
  headerNote:
    "Esamina ogni modifica prima di applicarla. Gli strumenti di ripristino coprono le impostazioni supportate; pulizia e riparazione hanno limiti di recupero diversi.",
  advisor: {
    eyebrow: "Consigliato per il tuo PC",
    applyButton: "Applica",
    confidenceHigh: "Alta affidabilità — basato sull'hardware di questo PC",
    confidenceStandard: "Consigliato per questo tipo di macchina",
    reversible: "Reversibile — il valore originale viene salvato prima di ogni modifica.",
    empty:
      "Niente da consigliare al momento — la tua configurazione rispecchia già i nostri consigli.",
  },
  drift: {
    pickHint: "Togli la spunta a ciò che hai cambiato di proposito.",
    titleAfterUpdate: "Windows ha rimesso mano alle tue impostazioni",
    titleNoUpdate: "Alcune impostazioni non sono più attive",
    afterUpdateOne:
      "Dopo l’aggiornamento a {patch}, un tweak che avevi applicato non risulta più attivo sul sistema.",
    afterUpdateMany:
      "Dopo l’aggiornamento a {patch}, {count} tweak che avevi applicato non risultano più attivi sul sistema.",
    noUpdateOne:
      "Un tweak che avevi applicato non risulta più attivo sul sistema. Nessun aggiornamento di Windows nel frattempo, quindi l’ha cambiato qualcos’altro.",
    noUpdateMany:
      "{count} tweak che avevi applicato non risultano più attivi sul sistema. Nessun aggiornamento di Windows nel frattempo, quindi li ha cambiati qualcos’altro.",
    reapplyOne: "Riapplica il tweak",
    reapplyMany: "Riapplica {count} tweak",
    reapplying: "Riapplicazione...",
    reappliedOne: "Tweak riapplicato.",
    reappliedMany: "{count} tweak riapplicati.",
  },
  crashes: {
    title: "Chiusure impreviste",
    subtitle:
      "L'app si è chiusa da sola. Il rapporto resta su questo PC: copialo e inviamelo su Discord o su GitHub se vuoi che lo sistemi.",
    copy: "Copia rapporto",
    copied: "Rapporto copiato negli appunti.",
    clear: "Cancella",
    cleared: "Rapporti cancellati.",
    processApp: "finestra principale",
    processElevated: "operazione con diritti admin",
  },
  ledger: {
    guardPaused: "Regolazioni sulle app in pausa",
    guardResumed: "Regolazioni sulle app riprese",
    processes: "Processi: {count}",
    restored: "Ripristinato",
    postponed: "Rimandata mentre era in corso un gioco",
    title: "Registro modifiche",
    subtitle:
      "Tutto ciò che questa app ha modificato su questo PC, dal più recente. Salvato in locale, mai caricato online.",
    empty: "Nessuna modifica registrata. Applica il tuo primo tweak e comparirà qui.",
    clear: "Cancella cronologia",
    clearing: "Cancellazione...",
    cleared: "Cronologia cancellata.",
    revert: "Ripristina",
    elevated: "con diritti admin",
    failed: "non riuscita",
    actions: {
      processGuard: "Gioco che si gestisce da solo",
      coreSteering: "Smistamento dei core",
      ramTrim: "Pulizia della RAM",
      autoReverted: "Annullato automaticamente",
      priorityRule: "Regola di priorità",
      scheduledCleanup: "Pulizia pianificata",
      ecoqos: "Efficienza delle app in background",
      applied: "Tweak applicato",
      reverted: "Tweak ripristinato",
      cleanup: "Pulizia",
      filesDeleted: "File eliminati",
      diskOptimize: "Ottimizzazione disco",
      startupChange: "Modifica avvio",
      restorePoint: "Punto di ripristino",
    },
  },
  tabs: {
    groupWorkspace: "Area di lavoro",
    overview: "Panoramica",
    groupMonitor: "Monitoraggio",
    groupOptimize: "Ottimizza",
    groupManage: "Gestisci",
    scan: "Scansione",
    health: "Salute PC",
    hardware: "Hardware",
    performance: "Prestazioni",
    privacy: "Privacy",
    ui: "Interfaccia",
    maintenance: "Manutenzione",
    gaming: "Gaming",
    startup: "Avvio",
    profiles: "Profili",
    pricing: "Piani e prezzi",
    ledger: "Cronologia modifiche",
  },
  healthPanel: {
    title: "Punteggio di salute",
    subtitle: "Un punteggio spiegabile: ogni numero mostra i fatti da cui è calcolato.",
    why: "Perché {score}?",
    refresh: "Ricalcola",
    compute: "Calcola il punteggio",
    showMore: "Mostra dettagli",
    showLess: "Nascondi dettagli",
    stageProfile: "Lettura profilo di sistema",
    stageTweaks: "Verifica tweak applicati",
    stageSecurity: "Controllo stato sicurezza",
    stageScoring: "Calcolo del punteggio",
    verdictExcellent: "ECCELLENTE",
    verdictGood: "BUONO",
    verdictFair: "DISCRETO",
    verdictNeedsWork: "DA MIGLIORARE",
    computing: "Analisi in corso...",
    idleHint:
      "Nessuna analisi in background: il punteggio viene calcolato solo quando lo chiedi tu, interamente su questo PC.",
    changeSinceLast: "dall'ultimo controllo",
    changeNone: "Nessun cambiamento dall'ultimo controllo.",
    changeFirstRun:
      "Prima misurazione registrata. Eseguila di nuovo dopo una modifica per vedere cosa si è mosso.",
    changeWhyTitle: "Perché il punteggio è cambiato",
    changeContributes: "Contributo al punteggio complessivo:",
    changeStructural:
      "Un aggiornamento dell'app ha cambiato quali categorie vengono valutate: parte di questa differenza non dipende dal tuo PC.",
    changeTrend: "Andamento",
    categories: {
      performance: "Prestazioni",
      gaming: "Gaming",
      responsiveness: "Reattività",
      memory: "Memoria",
      storage: "Archiviazione",
      startup: "Avvio",
      maintenance: "Manutenzione",
      privacy: "Privacy",
      security: "Sicurezza",
    },
  },
  transparency: {
    title: "Cosa modifica esattamente",
    key: "Chiave",
    value: "Valore",
    setsTo: "Imposta a",
    note: "Il valore precedente viene salvato prima della scrittura, così il rollback lo ripristina esattamente com'era.",
    kindRegistry: "Registro",
    kindCommand: "Comando",
    kindService: "Servizio",
    copy: "Copia",
    copied: "Copiato",
  },
  command: {
    statusQuiet: "Tutto tranquillo",
    statusScanning: "Analisi in corso...",
    statusFindings: "{count} raccomandazioni pronte",
    domainsLine: "Avvio · Spazio · Memoria · Privacy · Prestazioni · Aggiornamenti",
    consent: "Nulla cambia senza la tua approvazione.",
    runScan: "Avvia scansione di sistema",
    reviewFindings: "Rivedi {count} raccomandazioni",
    memTitle: "Pressione memoria",
    pressureLow: "Bassa",
    pressureElevated: "Elevata",
    pressureHigh: "Alta",
    memReview: "Analizza l'uso della memoria",
    memTopTitle: "Processi principali",
    trimTitle: "Riduci i working set",
    trimExplainer:
      "Chiede al gestore della memoria di Windows di spostare le pagine inattive fuori dai working set delle app. Utile quando la pressione è alta; le app potrebbero ricaricare brevemente le pagine al prossimo uso. Nessun dato viene perso. Windows chiede il permesso di amministratore.",
    trimButton: "Riduci ora",
    autoTitle: "Riduzione automatica",
    profilesTitle: "Profili sessione",
    profileGame: "Sessione di gioco",
    profileGameDesc: "Prepara il PC per giocare: energia, priorità e registrazione DVR.",
    profileFocus: "Focus",
    profileFocusDesc: "Meno distrazioni e attività non essenziali sotto controllo.",
    profileQuiet: "Sessione silenziosa",
    profileQuietDesc: "Efficienza, batteria e rumore contenuto.",
    profileDownload: "Sessione download",
    profileDownloadDesc: "Controlla banda e attività in background.",
    previewBtn: "Anteprima modifiche",
    gameChange1: "Disattiva Game DVR (registrazione in background)",
    gameChange2: "Passa al piano energetico Prestazioni elevate",
    gameChange3: "Ottimizza la priorità CPU per i giochi (Win32PrioritySeparation)",
    previewReq: "Richiede diritti di amministratore",
    previewCost: "Costo potenziale: maggiore consumo e calore finché attiva.",
    previewRevert: "Reversibile con un click: ogni valore originale viene salvato prima.",
    applySession: "Avvia sessione",
    restoreSession: "Ripristina",
    statusActive: "Attiva",
    statusOff: "Non attiva",
    soon: "In arrivo",
  },
  systemMonitor: {
    cpu: "CPU",
    ram: "Memoria",
    disk: "Disco",
    uptime: "Acceso da",
    uptimeValue: "{hours}h {minutes}m",
    cores: "{count} core",
  },
  startupManager: {
    title: "Programmi all'avvio",
    description:
      "I programmi che si aprono da soli all'accensione del PC. Disattivarne qualcuno accorcia i tempi di avvio: il programma resta installato e lo puoi comunque aprire a mano.",
    empty: "Nessun programma configurato per l'avvio automatico.",
    activeCount: "Attivi: {enabled} / {total}",
    machineWide: "Tutti gli utenti",
    impactNote: "Disattivare non disinstalla nulla ed è reversibile in qualsiasi momento.",
    refresh: "Aggiorna",
    refreshing: "Rilettura...",
    hiddenOrphans: "{count} voci nascoste: il programma non è più installato.",
    locationRun: "Registro",
    locationRun32: "Registro (32 bit)",
    locationFolder: "Cartella Esecuzione automatica",
  },
  systemRepair: {
    title: "Verifica e riparazione di Windows",
    description:
      "Controlla se i file di sistema e l'archivio componenti di Windows sono integri e, se non lo sono, li ripara dai server Microsoft. Sono gli stessi strumenti DISM e SFC che il supporto Microsoft fa eseguire, senza riga di comando.",
    adminNote:
      "Serve l'autorizzazione da amministratore: Windows la chiede una volta sola e viene creato un punto di ripristino prima di ogni modifica.",
    timeNote:
      "Una riparazione completa può richiedere 20 minuti o più. Puoi continuare a usare il PC: basta non spegnerlo.",
    checkButton: "Verifica integrità",
    checking: "Verifica in corso...",
    cleanupButton: "Riduci archivio componenti",
    cleaningUp: "Riduzione in corso...",
    cleanupNote:
      "Rimuove dalla cartella WinSxS le versioni dei componenti ormai sostituite. Gli aggiornamenti installati di recente restano disinstallabili.",
    runningNote: "Non spegnere né riavviare il PC mentre è in corso.",
    cannotStop:
      "Una volta avviato non si può interrompere: Windows sta controllando e riparando i propri file di sistema, e fermarlo a metà potrebbe lasciarli riparati solo in parte. Nel frattempo puoi continuare a usare il PC e WinCraft.",
    stepQuick: "Lettura rapida dello stato",
    stepScan: "Controllo dell'archivio componenti",
    stepRestore: "Riparazione dell'archivio componenti",
    stepSfc: "Controllo dei file di sistema",
    stepCleanup: "Riduzione dell'archivio componenti",
    stepOf: "Passaggio {index} di {total}",
    statusHealthy: "Windows è integro",
    statusRepairable: "Trovati danni, ma sono riparabili",
    statusRepaired: "Danni trovati e riparati",
    statusUnrepairable: "Trovati danni che non è stato possibile riparare",
    statusCompleted: "Operazione conclusa",
    hintUnrepairable:
      "Di solito il passo successivo è un aggiornamento sul posto di Windows. Nel registro qui sotto trovi il codice di errore.",
    hintCompleted:
      "Gli strumenti sono stati eseguiti. Con la lingua di Windows in uso il risultato non è leggibile automaticamente: i dettagli sono nel registro qui sotto.",
    logTitle: "Dettagli",
    askRepair: "Vuoi ripararlo adesso?",
    askRepairYes: "Sì, ripara ora",
    askRepairNo: "Non ora",
    repairAnyway: "Esegui comunque una riparazione completa",
    elapsed: "{time} trascorsi",
    holdingAt:
      "Fermo al {percent}% da {time}. DISM resta sulla stessa percentuale anche per diversi minuti mentre Windows ricostruisce i componenti in background: non si è bloccato.",
    remaining: "~{minutes} min",
    underMinute: "< 1 min",
    estimating: "Stima in corso...",
    statElapsed: "Trascorso",
    statRemaining: "Rimanente",
    statFinish: "Fine prevista",
    waiting: "In attesa",
  },
  cookieCleaner: {
    title: "Pulizia selettiva dei cookie",
    description:
      "Elimina i cookie di tracciamento e pubblicità e conserva quelli che tengono attivi i tuoi accessi. Sui siti nella tua lista resti connesso.",
    scanButton: "Analizza i cookie",
    scanning: "Analisi in corso...",
    cleanButton: "Pulisci",
    cleaning: "Pulizia in corso...",
    noneFound: "Nessun cookie del browser trovato su questo PC.",
    totals: "{removable} da rimuovere, {protected} cookie di accesso conservati",
    runningWarning: "Chiudi {browser} per pulirlo. I numeri qui sopra sono comunque corretti.",
    backupNote:
      "Prima della pulizia il database dei cookie viene copiato, così l'operazione è annullabile.",
    restoreButton: "Annulla l'ultima pulizia",
    restoring: "Ripristino in corso...",
    restoredToast: "{browser}: cookie ripristinati dall'ultima copia.",
    cleanedToast: "{removed} cookie rimossi, {kept} accessi conservati.",
    nothingToClean: "Non c'è nulla da rimuovere: tutti i cookie sono nella tua lista.",
    topDomains: "La maggior parte dei cookie arriva da",
    whitelistTitle: "Siti su cui restare connesso",
    whitelistNote:
      "Valgono anche i sottodomini: aggiungendo google.com resta attivo anche accounts.google.com.",
    whitelistPlaceholder: "esempio.com",
    whitelistAdd: "Aggiungi",
    whitelistRemove: "Rimuovi",
    whitelistReset: "Ripristina i predefiniti",
  },
  appCache: {
    title: "Cache dei programmi di terze parti",
    description:
      "Cache degli shader, launcher di giochi, app di messaggistica e gestori di pacchetti trattengono gigabyte di file che ricostruiscono da soli. Qui li trovi nei programmi che hai davvero installato.",
    scanButton: "Analizza le cache",
    scanning: "Analisi in corso...",
    cleanButton: "Pulisci le voci scelte",
    cleaning: "Pulizia in corso...",
    noneFound: "Nessuna cache di terze parti trovata su questo PC.",
    permanentNote:
      "Questi file vengono eliminati definitivamente e non spostati nel Cestino: riciclare gigabyte non libera nulla finché il Cestino non viene svuotato. Tutto ciò che vedi qui viene ricostruito da solo dal programma che l'ha creato.",
    blockedBy: "{process} è in esecuzione, quindi i suoi file verranno saltati.",
    selectedTotal: "{size} selezionati",
    cleanedToast: "Liberati {freed}.",
    skippedNote: "{count} file erano in uso e sono stati lasciati intatti.",
    catShaders: "Cache degli shader",
    catLaunchers: "Launcher di giochi",
    catApps: "App",
    catDev: "Strumenti di sviluppo",
    catWindows: "Windows",
    names: {
      shader_dx: "Cache shader DirectX",
      shader_nvidia: "Cache shader NVIDIA",
      shader_amd: "Cache shader AMD",
      shader_intel: "Cache shader Intel",
      steam: "Cache web di Steam",
      epic: "Cache di Epic Games Launcher",
      battlenet: "Cache di Battle.net",
      discord: "Cache di Discord",
      vscode: "Cache di Visual Studio Code",
      npm: "Cache dei pacchetti npm",
      pip: "Cache dei pacchetti pip",
      crash_dumps: "Dump dei crash delle applicazioni",
      error_reports: "Segnalazioni errori di Windows",
    },
  },
  scheduledTasks: {
    title: "Attività pianificate all'avvio",
    description:
      "Programmi di aggiornamento e servizi in background che partono all'accesso o all'accensione tramite l'Utilità di pianificazione, dove l'elenco Avvio di Windows non li mostra. Le attività di Windows non compaiono qui.",
    empty: "Nessuna attività di terze parti all'avvio su questo PC.",
    activeCount: "Attive: {enabled} / {total}",
    triggerLogon: "All'accesso",
    triggerBoot: "All'accensione",
    refresh: "Aggiorna",
    refreshing: "Rilettura...",
    note: "Disattivare un'attività non disinstalla nulla e puoi riattivarla in qualsiasi momento.",
  },
  search: {
    placeholder: "Cerca un tweak...",
    noResults: 'Nessun risultato per "{query}".',
    clear: "Cancella",
  },
  pricing: {
    title: "Gratis per tutti",
    intro:
      "WinCraft è gratuito e open source: tutti gli strumenti inclusi, nessun abbonamento e nessuna funzione a pagamento.",
    planName: "Tutto incluso",
    planTagline: "Ogni strumento, ogni tweak, ogni funzione: nessuna restrizione.",
    priceAmount: "$0",
    priceNote: "per sempre",
    features: [
      "Tutti i tweak e le ottimizzazioni di sistema",
      "Strumenti avanzati per gaming e privacy",
      "Pulizia disco, deframmentazione e riparazione del sistema",
      "Aggiornamento driver e diagnostica hardware",
      "Sessioni di gioco e profili di monitoraggio",
      "Purga della memoria Zero-Trace e distruzione sicura dei file",
      "Tutti gli aggiornamenti futuri inclusi",
    ],
    commitmentTitle: "Il nostro impegno",
    commitmentBody:
      "WinCraft è e resterà gratuito. Tutti devono poter usare strumenti che aiutano a capire e ottimizzare il proprio PC: niente costi nascosti, niente funzioni bloccate, niente abbonamenti.",
  },
  toggle: { on: "Attivato", off: "Disattivato" },
  driverBooster: {
    title: "Driver Booster",
    subtitle:
      "Seleziona i driver più vecchi e apri tutte le loro pagine di download in un colpo solo.",
    scan: "Analizza driver",
    scanning: "Analisi...",
    selectAll: "Seleziona tutti",
    selectNone: "Deseleziona tutti",
    selectedCount: "{selected} di {total} selezionati",
    pagesForSelection: "{pages} pagine da aprire",
    openSelected: "Apri le pagine di download ({count})",
    opened: "{count} pagine aperte",
    openedCapped:
      "Aperte {opened} pagine su {total}: le altre restano selezionate, riprova per aprirle.",
    allCurrent: "Nessun driver risulta datato.",
    nothingActionable: "Nessun driver datato con una pagina del produttore disponibile.",
    note: "WinCraft non scarica pacchetti driver da solo: non esiste un’API dei produttori che dica qual è la versione giusta per il tuo esatto dispositivo, e installare il driver video sbagliato è uno dei pochi errori che può lasciarti senza schermo. Qui si automatizza la parte noiosa — trovare le pagine — non la scelta. Per i driver che Windows Update conosce davvero, usa il pulsante qui sopra.",
  },
  secureDefrag: {
    title: "Deframmentazione sicura",
    willDefrag: "Questo disco è meccanico: verrà eseguita una vera deframmentazione.",
    willRetrim:
      "Questo disco non risulta meccanico: viene analizzato per intero, poi viene eseguito un retrim invece di una deframmentazione. Il retrim dura pochi secondi e riguarda solo lo spazio libero — è così che funziona: comunica al controller quali blocchi non servono più, così può riutilizzarli senza rallentare. Deframmentare un SSD non lo velocizza, lo consuma soltanto.",
    start: "Avvia",
    running: "In corso...",
    working: "Elaborazione...",
    phaseAnalyze: "Analisi",
    phaseOptimize: "Ottimizzazione",
    analysisTitle: "Rapporto di analisi",
    doneDefrag: "Deframmentazione completata.",
    doneRetrim: "Retrim completato.",
    note: "Prima dell’operazione viene creato un punto di ripristino. La percentuale arriva da Windows stesso, non da un timer.",
  },
  zeroTrace: {
    title: "Zero-Trace Cleaner",
    subtitle:
      "Rimuove ciò che resta in memoria dopo la chiusura dei programmi e distrugge i file in modo irreversibile.",
    purgeTitle: "Pulizia memoria",
    purgeBody:
      "Windows tiene in RAM le pagine dei programmi chiusi come cache. Questo le rilascia: i frammenti lasciati da un processo terminato spariscono davvero dalla memoria fisica.",
    purgeButton: "Pulisci memoria",
    purging: "Pulizia...",
    purgeResult: "Liberati {freed} MB — ora liberi {after} MB",
    purgeLimit:
      "Non tocca il file di paging né quello di ibernazione: sono su disco e Windows non offre un’API per ripulirli a caldo.",
    shredTitle: "Distruzione sicura file",
    shredBody:
      "Sovrascrive il contenuto del file in tre passaggi prima di eliminarlo, rendendolo irrecuperabile dai normali strumenti di undelete.",
    shredButton: "Scegli file...",
    shredding: "Distruzione...",
    shredDone: "{count} file distrutti ({size})",
    shredSummary: "{shredded} distrutti, {skipped} saltati",
    shredWarning: "Definitivo: nessun passaggio dal Cestino, nessun recupero possibile.",
    ssdCaveat:
      "Su SSD il wear levelling scrive quasi sempre su celle diverse dall’originale: le celle vecchie vengono liberate, non riscritte. Solo il secure-erase del disco può garantire di più.",
  },
  hud: {
    title: "Overlay di gioco",
    subtitle:
      "Pannello trasparente sopra il gioco: carico CPU/GPU, temperature, VRAM, processo attivo con la sua priorità e indicatore di collo di bottiglia.",
    fpsAbout:
      "Gli FPS si contano dagli eventi di present che Windows emette per ogni fotogramma — la stessa fonte di PresentMon, senza alcun aggancio al gioco. Richiede l’avvio come amministratore, perché aprire una sessione di tracciamento è un’operazione privilegiata.",
    fpsLowExplained:
      "Accanto agli FPS medi c’è DROP: la velocità dell’1% di fotogrammi peggiori, quello che altrove trovi chiamato «1% low». È il numero che si muove quando il gioco scatta, mentre la media resta alta e non te lo dice. Più DROP è vicino alla media, più il gioco è fluido.",
    fpsStart: "Misura FPS",
    fpsStop: "Ferma misura",
    fpsNeedsAdmin: "Per misurare gli FPS serve avviare WinCraft come amministratore.",
    fpsRunning:
      "Misurazione attiva: gli FPS compaiono nell’overlay appena un gioco inizia a disegnare.",
    show: "Mostra",
    hide: "Nascondi",
    lock: "Blocca",
    unlock: "Sblocca",
    dragHint: "Trascina l’overlay dove vuoi, poi bloccalo prima di avviare il gioco.",
    lockedHint: "Bloccato: i clic lo attraversano e raggiungono il gioco. Sbloccalo per spostarlo.",
    sizeCompact: "Compatto",
    sizeNormal: "Normale",
  },
  updater: {
    title: "Aggiornamento disponibile: v{version}",
    body: "Si scarica e si installa in un passaggio; al termine l'app si riavvia da sola.",
    install: "Installa e riavvia",
    later: "Più tardi",
    downloading: "Download... {percent}%",
    installing: "Installazione...",
    error: "Aggiornamento non riuscito: {message}",
    checkFailed: "Controllo aggiornamenti non riuscito: {message}",
  },
  badges: { admin: "Admin", soon: "IN ARRIVO" },
  emptyCategory: "Nessun tweak disponibile in questa categoria — presto in arrivo.",
  gameSessions: {
    title: "Game Sessions",
    subtitle:
      "Rileva automaticamente i tuoi giochi e applica/annulla il preset Turbo Gaming da solo.",
    active: "Sessione attiva: {name}",
    gamesCount: "{count} giochi registrati",
    addGame: "+ Aggiungi gioco (.exe)",
    steeringTitle: "Smistamento dei core",
    steeringVcache:
      "Il gioco gira sul die con 3D V-Cache ({count} thread). Le altre app restano dove le mette Windows.",
    steeringActive: "{count} processi smistati per questo gioco.",
    steeringNone:
      "Su questa CPU non c'è nulla da smistare: non risultano né un tipo di core più veloce né una cache più grande delle altre.",
    steeringActiveVcache: "Il gioco sta girando sul die con V-Cache.",
    steeringNeedsSessions:
      "Funziona solo con Game Sessions attivo e mentre uno dei tuoi giochi è in esecuzione.",
    steeringHybrid:
      "Il gioco gira sui core ad alte prestazioni ({game} thread) e le altre app della tua sessione passano ai core ad alta efficienza ({background} thread). Le app a cui hai dato una priorità superiore al normale non vengono toccate.",
  },
  latencyTrace: {
    title: "Latenza di DPC e interrupt",
    subtitle:
      "Misura quanto durano le chiamate di procedura differite (DPC) e le routine di servizio degli interrupt (ISR) di ogni driver, leggendole direttamente dal kernel di Windows. Non modifica nulla; richiede privilegi di amministratore.",
    duration: "Durata",
    secondsOption: "{seconds} s",
    run: "Misura",
    running: "Misurazione per {seconds} s…",
    dpcSummary:
      "DPC più lunga: {max} ms (limite {limit} ms). {over} su {count} hanno superato il limite.",
    isrSummary:
      "Routine di interrupt più lunga: {max} ms (limite {limit} ms). {over} su {count} hanno superato il limite.",
    colDriver: "Driver",
    colDpc: "DPC più lunga",
    colIsr: "Interrupt più lungo",
    colOver: "Oltre il limite",
    unattributed: "Non attribuito",
    hidden:
      "Windows ha nascosto gli indirizzi dei driver, quindi le routine non si possono attribuire ai driver.",
    verdictGood:
      "Durante questa misurazione nessun driver ha superato i limiti indicati da Microsoft.",
    note: "Indicazioni di Microsoft: una DPC dovrebbe terminare entro 0,1 ms e una ISR entro 0,025 ms. dxgkrnl.sys smista gli interrupt dello schermo, quindi il suo tempo spesso appartiene al driver grafico.",
    verdictBad:
      "{driver} ha occupato un processore per {max} ms di fila. Blocchi oltre il millisecondo possono causare crepitii nell'audio e scatti nel frame time; di solito si risolve aggiornando il driver o tornando alla versione precedente.",
    verdictMinor:
      "{over} routine hanno superato le indicazioni di Microsoft; la più lunga è durata {max} ms. Sforamenti brevi come questi sono comuni e raramente udibili.",
    lost: "Durante la misurazione Windows ha perso {events} eventi e {buffers} buffer: i tempi massimi mostrati sono un minimo.",
    verdictBadUnattributed:
      "Una routine che non è stato possibile attribuire a un driver ha occupato un processore per {max} ms di fila. Blocchi oltre il millisecondo possono causare crepitii nell'audio e scatti nel frame time.",
    spikesTitle: "Singole routine più lunghe",
    spikeLine: "{kind} di {duration} ms in {driver}, a {at} s dall'inizio",
  },
  networkCheck: {
    title: "Verifica di rete",
    subtitle:
      "Invia 32 ping a 1.1.1.1 e apre una connessione TCP, poi mostra cosa sta facendo davvero lo stack di rete di Windows. Non modifica nulla.",
    run: "Verifica",
    running: "Verifica in corso…",
    offline: "Nessuna connessione a Internet.",
    rtt: "Andata e ritorno: mediana {median} ms (min {min}, max {max})",
    jitter: "Variazione (jitter): {jitter} ms",
    loss: "Risposte: {received} su {sent}",
    tcpRtt: "Andata e ritorno secondo lo stack TCP: {rtt} ms",
    nagleOn:
      "Le nuove connessioni partono con l'algoritmo di Nagle attivo (TCP_NODELAY disattivato). Le app che hanno bisogno di disattivarlo lo fanno sui propri socket.",
    nagleOff: "Le nuove connessioni partono con l'algoritmo di Nagle disattivato.",
    buffers:
      "Buffer di ricezione: {reserved} riservati per socket, {autotuned} regolati automaticamente da Windows",
    verdictNone:
      "Un ping non passa dalle impostazioni TCP, quindi queste letture descrivono la connessione stessa.",
    verdictLineChanged:
      "La linea stessa è cambiata tra le due letture (mediana {delta} ms). Un ping non passa dalle impostazioni TCP, quindi non è l'effetto della modifica.",
    lastTitle: "Dopo {tweak}, {time}",
    verdictInconclusive: "Troppo poche risposte per un confronto.",
    socketsBeforeAfter:
      "Nuovi socket, prima → dopo: Nagle {nagleBefore} → {nagleAfter}, buffer di ricezione {bufBefore} → {bufAfter}",
    stateOn: "attivo",
    stateOff: "disattivato",
  },
  turboBoost: {
    title: "Turbo Boost",
    subtitle:
      "Modifica la modalità boost della CPU e lo stato minimo del processore. Consumi e calore possono aumentare; i risultati dipendono dal carico di lavoro.",
    startLabel: "Avvia",
    stopLabel: "Ferma",
    activating: "Attivazione turbo in corso...",
    deactivating: "Ripristino in corso...",
    active: "Turbo attivo",
    inactive: "Turbo non attivo",
    loadLabel: "CARICO CPU",
    loadCadence: "Misurato ogni secondo, smussato su circa 3 secondi",
    ownLoad: "Negli ultimi secondi: WinCraft stesso {own}% · tutto il resto {rest}%",
    stageReading: "Lettura del piano energetico",
    stageRaising: "Aumento del limite di boost",
    stageApplying: "Applicazione al sistema",
    stageMeasuringBefore: "Misurazione prima",
    stageMeasuringAfter: "Nuova misurazione",
    factAverage: "Velocità media ora",
    factFastest: "Core più veloce ora",
    factPeak: "Massimo in questa sessione",
    factFloor: "Stato minimo del processore",
    ofBase: "{pct}% della frequenza base",
    usersTitle: "Chi usa la CPU ora",
    appliedAt:
      "Attivato il {time} · modalità boost Aggressiva, stato minimo del processore al 100% con alimentazione da rete",
    planAlreadyUses: "Il piano energetico corrente usa già queste impostazioni.",
    planAlreadyHad:
      "Il piano energetico corrente aveva già queste impostazioni, quindi nessun valore è cambiato.",
    loadExplain:
      "Il carico è quanto lavoro sta facendo il processore; Turbo Boost cambia quanto veloce può andare, non quanto è occupato. Un valore alto significa che i programmi su questo PC sono al lavoro in questo momento.",
    chartLoad: "Carico",
    chartSpeed: "Velocità",
    testTitle: "Stessa prova in ogni modalità",
    testHint:
      "Un carico fisso di 3 secondi. Eseguilo una volta per modalità per vedere cosa cambia con il boost.",
    testRun: "Esegui prova di 3 secondi",
    testRunning: "Prova in corso…",
    colDefault: "Predefinita",
    colBoost: "Boost",
    rowWork: "Lavoro svolto",
    rowAvg: "Velocità media",
    rowPeak: "Velocità di picco",
    rowTemp: "Temperatura CPU",
    notRun: "Non ancora eseguita",
    relative: "{pct}% della predefinita",
  },
  profiles: {
    title: "I tuoi profili",
    subtitle:
      "Salva i tweak attivi in un profilo. Riutilizza una configurazione o esportala su un altro PC.",
    saveHeading: "Salva i tweak attivi",
    namePlaceholder: "Nome (es. Gaming)",
    saveButton: "Salva",
    savedHeading: "Profili salvati",
    empty: "Nessun profilo salvato.",
    tweakCount: "{count} tweak",
    apply: "Applica",
    applying: "Applico...",
    exportButton: "Esporta",
    importButton: "Importa da file",
    deleteButton: "Elimina",
    savedToast: 'Configurazione "{name}" salvata',
    appliedToast: "{count} tweak applicati",
    exportedToast: "File esportato",
    importedToast: "Importata: {count} tweak pronti da rivedere",
    droppedWarning: "{count} voci non riconosciute da questa versione sono state scartate",
    nameRequired: "Dai un nome alla configurazione",
    reviewNotice:
      "Le configurazioni importate non vengono mai applicate da sole: le rivedi tu prima.",
    signInRequired: "Accedi o crea un account per salvare le configurazioni.",
  },
  scan: {
    lastScan: "Ultima scansione: {time}",
    neverScanned: "Nessuna scansione completata",
    extraChecks: "Controlli aggiuntivi",
    checksHint:
      "Letture del sistema: nessuna modifica automatica. Apri una categoria per vedere i dettagli.",
    unavailable: "Controllo non disponibile",
    startupSummary: "{enabled} attivi · {orphaned} collegamenti mancanti",
    tasksSummary: "{enabled} attività di avvio attive",
    partialScan: "Risultati parziali: alcuni controlli non sono disponibili.",
    scanFailed: "Scansione non riuscita. Riprova.",
    title: "Scansione rapida",
    subtitle: "Controlla lo stato del PC e trova ottimizzazioni non ancora attive, in un click.",
    startLabel: "SCAN",
    stepPerformance: "Prestazioni",
    stepPrivacy: "Privacy",
    stepGaming: "Gaming",
    stepJunk: "File temporanei",
    allGood: "Tutto ok — nessun problema trovato.",
    issuesFound: "{count} ottimizzazioni disponibili",
    selectAll: "Seleziona tutto",
    deselectAll: "Deseleziona tutto",
    fixAll: "Correggi tutto",
    fixing: "Correzione {done}/{total}...",
    fixedToast: "{count} problemi corretti.",
    scanAgain: "Scansiona di nuovo",
    verdictRecommended: "Consigliato su questo PC",
    verdictNotRecommended: "Sconsigliato su questo PC",
    verdictUnsupported: "Non supportato",
    reasons: {
      laptop_battery: "questo PC è un portatile: costa autonomia più di quanto renda",
      hdd_index_cost:
        "il disco di sistema è meccanico, l'indicizzazione in background si sente davvero",
      fast_disk_no_gain:
        "il disco di sistema è NVMe, già abbastanza veloce da rendere il guadagno trascurabile",
      needs_win10_2004: "richiede Windows 10 versione 2004 o successiva",
      weak_gpu: "grafica integrata: la trasparenza le costa prestazioni utili",
    },
    thisPc: "Questo PC",
    dashDrivesTitle: "Spazio disco",
    dashFreeOf: "{free} liberi di {total}",
    dashAlmostFull: "Quasi pieno",
    dashStartupTitle: "App all'avvio",
    dashStartupCount: "{on} attive su {total}",
    dashManage: "Gestisci",
    dashUptimeTitle: "Acceso da",
    dashUptimeDh: "{days}g {hours}h",
    dashUptimeHm: "{hours}h {minutes}min",
    dashUptimeLongHint:
      "Questo PC non viene riavviato da un po'. Un riavvio applica gli aggiornamenti in sospeso e libera la memoria trattenuta.",
    dashHistoryTitle: "Azioni recenti",
    dashHistoryEmpty: "Ancora nulla. Le azioni che esegui compariranno qui.",
    dashActTweakApplied: "Tweak applicato",
    dashActTweakReverted: "Tweak ripristinato",
    dashActCleanup: "Pulizia",
    dashActFilesDeleted: "File eliminati",
    dashActStartupChange: "Avvio modificato",
    dashActDiskOptimize: "Disco ottimizzato",
    dashActRestorePoint: "Punto di ripristino",
    profileUnknown: "Non rilevato",
    diskHdd: "HDD",
    diskSsd: "SSD",
    diskNvme: "NVMe",
    formDesktop: "Desktop",
    formLaptop: "Portatile",
    groupRecommended: "Consigliate per questo PC",
    groupOptional: "Facoltative",
    groupNotRecommended: "Sconsigliate su questo PC",
    tailoredNote: "Ogni voce è valutata sull'hardware qui sopra, non su una lista fissa.",
    fixRecommended: "Applica le {count} consigliate",
    fixEverything: "Applica le selezionate ({count})",
    nothingSelected: "Nessuna voce selezionata",
    foundHeadline: "{count} da sistemare su questo PC",
    foundNone: "Niente da sistemare",
    doneTitle: "Fatto!",
    doneBody: "{count} ottimizzazioni applicate. Il tuo PC è a posto.",
    fixHeading: "Pronte da applicare",
  },
  ram: {
    autoNeedsAdmin:
      "La pulizia automatica funziona solo quando WinCraft ha i diritti di amministratore.",
    title: "Libera RAM",
    subtitle:
      "Chiede a Windows di rilasciare la memoria che i programmi tengono occupata senza usarla. Windows chiede ogni volta il permesso di amministratore, e la pulizia aspetta se è in corso un gioco.",
    button: "Libera ora",
    cleaning: "Pulizia in corso...",
    freed: "Liberati {amount}",
    freedNothing: "La memoria era già ottimizzata",
    inUse: "{used} di {total} in uso",
    autoLabel: "Pulizia automatica",
    autoOff: "Disattivata",
    autoEvery: "Ogni {interval}",
    autoHint:
      "Con la pulizia automatica attiva, WinCraft libera la RAM da solo a intervalli regolari. Può farlo solo quando è in esecuzione come amministratore: Windows chiede il permesso per ogni pulizia e una pulizia programmata non può chiederlo.",
    autoPausedNotAdmin:
      "In pausa: WinCraft non è in esecuzione come amministratore, quindi la pulizia automatica non può partire. Per usarla, chiudi WinCraft e riaprilo con «Esegui come amministratore». La pulizia manuale funziona comunque: Windows chiede il permesso ogni volta.",
    autoNext: "Prossima pulizia alle {time}",
    autoDue: "Pulizia in corso...",
    autoLast: "Ultima alle {time}: {amount} liberati",
    autoNoneYet: "Nessuna pulizia automatica ancora eseguita.",
    autoFailed: "Ultimo tentativo non riuscito: {detail}",
  },
  restore: {
    button: "Ripristina i tweak attivi",
    title: "Ripristinare i tweak attivi?",
    body: "Ripristina {count} tweak dai valori salvati. Gli strumenti configurabili hanno controlli di ripristino propri.",
    confirm: "Ripristina i tweak",
    cancel: "Annulla",
    running: "Ripristino...",
    doneToast: "{count} ottimizzazioni ripristinate.",
    nothingToast: "Non c'è nulla da ripristinare.",
  },
  passwordCheck: {
    title: "Controllo violazioni password",
    description:
      "Verifica se una password è comparsa in una violazione di dati nota, senza mai inviarla per intero: solo un frammento del suo hash viene inviato (k-anonymity, standard usato da Have I Been Pwned).",
    placeholder: "Incolla una password da controllare",
    button: "Controlla",
    checking: "Controllo in corso...",
    safe: "Non risulta in nessuna violazione nota. Ottimo segno.",
    breached: "Trovata in {count} violazioni note. Cambiala subito, ovunque la usi.",
    error: "Impossibile controllare ora: verifica la connessione e riprova.",
  },
  cleanupConfirm: {
    previewLoading: "Calcolo di cosa verrà spostato nel Cestino...",
    previewEmpty: "Non c'è nulla da pulire: la cartella è già vuota.",
    previewNotAccessible:
      "Il contenuto non è leggibile senza permessi di amministratore; verrà elencato ed eliminato dal processo autorizzato.",
    previewTruncated: "Mostrati i 500 elementi più grandi; i totali includono tutto.",
    selectedSummary: "{count} elementi selezionati · {size}",
    confirmSelected: "Pulisci selezionati",
    title: "Confermi la pulizia?",
    body: '"{name}" sposterà i file corrispondenti nel Cestino di Windows. Potrai recuperarli da lì finché non lo svuoti.',
    confirm: "Sposta nel Cestino",
    cancel: "Annulla",
  },
  cleanupButton: "Pulisci",
  cleanupRunning: "...",
  cleanupResultToast: "{deleted} elementi spostati nel Cestino, {freed} liberati",
  cleanupResultToastSkipped: " ({skipped} in uso, saltati).",
  diskOptimize: {
    title: "Ottimizza disco",
    description:
      "Esegue lo strumento di ottimizzazione integrato di Windows: deframmentazione su HDD, oppure TRIM sugli SSD (mai una deframmentazione completa, che li usurerebbe inutilmente).",
    button: "Ottimizza ora",
    running: "Ottimizzazione in corso... può richiedere qualche minuto",
    cannotStop:
      "Lo fa l'ottimizzatore di unità di Windows con i diritti di amministratore, quindi arriva alla fine da solo e non si può fermare da qui. Puoi continuare a lavorare tranquillamente.",
    resultToast: "Disco ({media}) ottimizzato con successo.",
  },
  dnsFlush: {
    title: "Svuota cache DNS",
    description:
      "Cancella gli indirizzi DNS salvati in memoria. Utile se un sito ha cambiato server e nel browser continui a vedere la versione vecchia.",
    button: "Svuota ora",
    running: "Svuotamento...",
    resultToast: "Cache DNS svuotata.",
  },
  browserCleanup: {
    title: "Pulizia browser",
    description:
      "Svuota cache e cookie di Chrome, Edge e Firefox. Il browser li ricrea da solo al prossimo avvio, quindi non perdi nulla di permanente.",
    noneFound: "Nessun browser supportato trovato su questo PC.",
    cache: "Cache",
    cookies: "Cookie",
    clearButton: "Svuota",
    clearing: "Svuotamento...",
    runningWarning: "Chiudi {browser} per poterlo svuotare.",
    clearedToast: "{browser}: {freed} liberati.",
  },
  tweakyDriverPromo: {
    title: "Tweaky Driver",
    description:
      "Cerca pacchetti driver dalle fonti supportate nella nostra app dedicata. Controlla la compatibilità prima di installare. App separata; copertura variabile.",
    button: "Esplora Tweaky Driver",
    error: "Impossibile aprire la pagina. Riprova.",
  },
  redaxaPromo: {
    title: "Redaxa",
    description:
      "Hai bloccato telemetria e tracciamento — ma cosa incolli nelle chat AI? Redaxa intercetta dati personali e credenziali prima che un prompt raggiunga qualsiasi modello. Stessa famiglia, stessa regola: niente viene salvato.",
    button: "Prova sul web",
  },
  uninstallerPromo: {
    title: "WinCraft Uninstaller",
    description:
      "Rimuovi interi programmi in sicurezza: punto di ripristino automatico, comando verificato e report onesto. Della stessa famiglia di WinCraft.",
    button: "Scarica",
    confirmTitle: "Scaricare il disinstallatore?",
    confirmBody:
      "WinCraft Uninstaller è un'app separata della stessa suite e accede con lo stesso account di questa. Il download prende l'installer (circa 4 MB) direttamente dalla sua release su GitHub, per Windows 10 e 11 a 64 bit.",
    confirmUnsigned:
      "WinCraft Uninstaller è firmato digitalmente da Aurelio Avila. Verifica autore e firma nelle proprietà del file. SmartScreen può comunque mostrare avvisi.",
    confirmDownload: "Scarica",
    confirmOpenPage: "Apri invece la pagina",
    cancel: "Annulla",
  },
  live: {
    title: "In questo momento",
    subtitle:
      "Aggiornato ogni secondo mentre questa pagina è aperta e WinCraft è in primo piano. In background non viene misurato nulla.",
    paused: "In pausa",
    pausedHint: "In pausa mentre WinCraft è in background. Riprende quando torni.",
    measuring: "Misurazione…",
    smooth: "Tutto fluido",
    busy: "Impegnato",
    strained: "Sotto forte carico",
    verdictDetail: "CPU al {cpu}% negli ultimi 10 secondi · memoria in uso al {ram}%",
    failed: "Le letture in tempo reale non sono disponibili al momento.",
    cpu: "Processore",
    speed: "{ghz} GHz",
    cores: "{count} processori logici",
    core: "Processore {n}",
    memory: "Memoria",
    used: "In uso",
    cached: "Cache",
    free: "Libera",
    total: "Totale",
    cachedHint: "La memoria in cache viene restituita appena un programma ne ha bisogno.",
    notAvailable: "Non disponibile su questo PC",
    disk: "Attività del disco",
    read: "Lettura",
    write: "Scrittura",
    systemDrive: "Unità di sistema: {used} usati su {total}",
    network: "Rete",
    down: "Download",
    up: "Upload",
    gpu: "Grafica",
    gpuLoad: "Carico",
    temp: "Temperatura",
    fan: "Ventola",
    vram: "Memoria video",
    sensors: "Temperature e ventole",
    sensorsHint:
      "Su questo PC Windows non espone questi sensori senza gli strumenti del produttore, quindi non tiriamo a indovinare.",
    now: "ora",
    secondsAgo: "{s} s fa",
    activity: "Attività",
    zoomShort: "1 min",
    zoomLong: "5 min",
    minutesAgo: "{n} min fa",
    peak: "Picco {value}",
    insightRecovering:
      "Il processore si sta scaricando: era sopra il 75% di media e l’ultima lettura è {pct}%.",
    insightCalm: "È tutto tranquillo. Al momento nulla richiede la tua attenzione.",
    insightMemory:
      "La memoria è quasi piena ({pct}%). Chiudi le app che non usi o controlla cosa parte con Windows.",
    insightCpu:
      "Il processore è impegnato da un po' ({pct}% in media). L'elenco qui sotto mostra cosa lo sta usando.",
    insightDrive:
      "L'unità di sistema è quasi piena ({pct}%). Windows rallenta quando resta senza spazio.",
    actionStartup: "Apri Avvio",
    actionCleanup: "Libera spazio",
    usingTitle: "Cosa sta usando le risorse",
    usingHint:
      "App raggruppate per nome, dall'elenco dei processi di Windows. Non viene aperto né modificato nulla.",
    usingCpu: "Processore",
    usingMemory: "Memoria",
    processes: "{count} processi",
    processOne: "1 processo",
  },
  pageError: {
    title: "Questa pagina ha avuto un problema",
    body: "Il resto di WinCraft funziona ancora e questo errore non ha modificato nulla sul PC. Ricarica la pagina per riprovare.",
    reload: "Ricarica la pagina",
    reloadApp: "Ricarica WinCraft",
    details: "Dettagli tecnici",
    appTitle: "WinCraft ha avuto un problema",
    appBody: "Questo errore non ha modificato nulla sul PC. Ricarica WinCraft per continuare.",
  },
  folderScan: {
    stop: "Interrompi ricerca",
    stopping: "Interruzione…",
    stoppedEmpty: "Ricerca interrotta. Nessun file è stato spostato o eliminato.",
    stoppedPartial:
      "Ricerca interrotta. Questi sono i risultati trovati prima dell'interruzione; ciò che non era ancora stato raggiunto non è stato controllato.",
  },
  largeFiles: {
    title: "Trova file di grandi dimensioni",
    description:
      "Cerca in una cartella i file più pesanti (oltre 100 MB), così puoi liberare spazio velocemente eliminando quelli che non ti servono più.",
    chooseFolder: "Scegli cartella",
    scanning: "Ricerca in corso...",
    noneFound: "Nessun file sopra {size} trovato.",
    foundCount: "{count} file trovati",
    moveSelected: "Cestina {count} selezionati",
    deleting: "Cestinamento...",
    deletedToast: "{count} file cestinati, {freed} liberati.",
  },
  diskHealth: {
    title: "Salute disco",
    freeSpace: "{size} liberi",
    selectDrive: "Disco",
    healthy: "Integro",
    warning: "Attenzione",
    unhealthy: "Compromesso",
    unknown: "Sconosciuto",
    loading: "Controllo...",
  },
  duplicateFinder: {
    title: "Trova file duplicati",
    description:
      "Scegli una cartella: individua i file identici e ti lascia scegliere quali spostare nel Cestino.",
    chooseFolder: "Scegli cartella",
    scanning: "Scansione...",
    noneFound: "Nessun file duplicato trovato in questa cartella.",
    copies: "{count} copie · {size} ciascuna",
    moveSelected: "Sposta nel Cestino ({count} selezionati)",
    deleting: "...",
    deletedToast: "{count} file spostati nel Cestino ({freed} liberati).",
  },
  ipMask: {
    title: "Maschera IP (VPN)",
    description:
      "Nasconde il tuo indirizzo IP instradando il traffico su un server VPN. Richiede un servizio VPN esterno: non ancora integrato in questa versione.",
    button: "Scopri di più",
    explainerToast:
      "Il mascheramento IP reale richiede un backend VPN dedicato (server + protocollo). Non è ancora collegato: qui trovi solo l'anteprima della funzione.",
  },
  toasts: {
    applied: '"{name}" applicato.',
    rolledBack: '"{name}" ripristinato al valore originale.',
    elevationDeclined:
      "L'autorizzazione di amministratore non è stata concessa, quindi non è stato modificato nulla.",
    accountRefreshFailed:
      "Non riusciamo a verificare lo stato del tuo account. Lo stato mostrato qui potrebbe non essere aggiornato — controlla la connessione o riprova più tardi.",
  },
  titlebar: {
    applied: "{applied}/{total} attive",
    cpu: "CPU",
    ram: "RAM",
    minimize: "Riduci a icona",
    maximize: "Ingrandisci",
    restore: "Ripristina",
    close: "Chiudi",
  },
  x3d: {
    title: "Allineatore die 3D V-Cache",
    subtitle:
      "Sulle CPU supportate con cache L3 diversa tra i die, limita un processo in esecuzione al die con più cache. Questa scelta prevale sulla pianificazione automatica per quel processo e può migliorare o peggiorare le prestazioni.",
    cpuLabel: "Processore",
    readyHeadline: "Die con V-Cache individuato: {cores} thread",
    readyBody: "Blocca un gioco su questo die e ogni suo thread resta dove la cache è più grande.",
    singleDie:
      "Questo processore ha un solo die: tutti i core vedono già la stessa cache, quindi non c'è nulla da allineare. La funzione compare da sola su una CPU a due die con cache asimmetrica.",
    uniformCache:
      "Questo processore ha più die ma con la stessa quantità di cache. Spostare un gioco da uno all'altro non cambierebbe nulla, quindi la funzione resta disattivata.",
    unavailable: "Windows non ha restituito la mappa delle cache di questo processore.",
    dieLabel: "Die {index}",
    dieCache: "{mb} MB L3",
    dieThreads: "{count} thread",
    vcacheBadge: "V-Cache",
    processesTitle: "Processi in esecuzione",
    processesHint: "I più attivi in cima. Scegli il gioco e bloccalo sul die con la cache.",
    refresh: "Aggiorna",
    refreshing: "Lettura...",
    align: "Allinea",
    reset: "Ripristina",
    alignedBadge: "Allineato",
    noProcesses: "Nessun processo abbastanza grande da mostrare.",
    persistenceNote:
      "L'affinità appartiene al processo in esecuzione: alla chiusura del gioco sparisce e va rifatta al lancio successivo. Nessuna impostazione di sistema viene modificata.",
    alignedToast: "{name} bloccato sul die con la V-Cache.",
    resetToast: "{name} riportato su tutti i core.",
  },
  hardware: {
    intro:
      "Letture dirette dai sensori del tuo hardware. Dove un sensore non esiste te lo diciamo, invece di mostrare un numero che nessuno può verificare.",
    gpuLabel: "Scheda video",
    cpuLabel: "Processore",
    liveBadge: "In tempo reale",
    gpuDriver: "Driver {version}",
    load: "Utilizzo GPU",
    vram: "Memoria video",
    fan: "Ventola",
    power: "Consumo",
    fanIdle: "ferma: sotto i 50° non serve",
    powerLimit: "limite {limit} W",
    tempCool: "fresca",
    tempGood: "ottimale",
    tempWarm: "calda",
    tempHot: "molto calda",
    traceLabel: "Andamento sessione",
    traceRange: "min {min}° · max {max}°",
    noTempSensor: "Questa scheda non espone un sensore di temperatura.",
    cpuAcpiSource: "letta dalla zona termica ACPI",
    cpuNoSensor:
      "Temperatura CPU non disponibile: il firmware non espone una zona termica ACPI. WinCraft mostra solo le letture rese disponibili da Windows.",
    noGpuTool:
      "Nessuna scheda NVIDIA rilevata. AMD e Intel non forniscono uno strumento di interrogazione equivalente, quindi le loro temperature non sono leggibili senza software del produttore.",
    thermalsUnavailable: "Non riusciamo a leggere i sensori su questo sistema.",
    driversTitle: "Età dei driver",
    driversSubtitle:
      "Quanti anni hanno i driver installati dai produttori. Windows sa cosa è installato, non cosa è disponibile: qui trovi l'età reale, mai un falso avviso di aggiornamento.",
    driversRescan: "Rianalizza",
    driversScanning: "Analisi...",
    driversCounted: "{count} driver dei produttori",
    driversAging: "{count} oltre 2 anni",
    driversStale: "{count} oltre 4 anni",
    driversAllCurrent: "Tutti recenti",
    driversNone: "Nessun driver di produttori terzi in queste categorie.",
    driversShowAll: "Mostra gli altri {count}",
    driversShowLess: "Mostra meno",
    driversInboxNote:
      "Esclusi {count} driver Microsoft integrati: li aggiorna Windows Update e la loro data è un segnaposto fisso, quindi contarli come vecchi sarebbe un falso allarme.",
    ageYears: "{years} anni",
    ageYear: "{years} anno",
    ageMonths: "{months} mesi",
    ageMonth: "{months} mese",
    vendorSite: "Sito del produttore",
    watchLabel: "Sotto osservazione da",
    peakLabel: "Picco",
    verdictRisky: "Rischioso",
    verdictNormal: "Normale",
    verdictBetter: "Meglio delle aspettative",
    verdictIdle: "A riposo",
    verdictRiskyHint:
      "La scheda ha superato gli 84°, la soglia oltre la quale riduce da sola le prestazioni per proteggersi. Controlla il flusso d'aria o passa al profilo Silenzioso.",
    verdictNormalHint:
      "Temperature nella norma per una scheda sotto carico: nessun segnale di allarme.",
    verdictBetterHint:
      "È rimasta sotto i 65° pur lavorando davvero: raffreddamento migliore della media.",
    verdictIdleHint:
      "Non ha ancora lavorato abbastanza per dare un giudizio. Una scheda ferma resta fresca comunque, quindi non dimostrerebbe nulla.",
    profilesTitle: "Profili termici",
    profilesSubtitle:
      "Regolano il limite di potenza della scheda, cioè la leva che governa davvero calore e rumore della ventola. Ogni valore viene dai limiti dichiarati dalla scheda stessa.",
    currentLimit: "Ora: {watts} W",
    modeSilent: "Silenzioso",
    modeSilentHint:
      "Per lavoro, streaming e sessioni lunghe: la ventola resta quasi muta e la scheda scalda molto meno, al prezzo di qualche frame.",
    modeStandard: "Standard",
    modeStandardHint:
      "Un limite equilibrato poco sotto il tetto della scheda: ventola più quieta e temperature più basse, con un costo in frame nell'ordine di pochi punti percentuali.",
    modeGaming: "Gaming",
    modeGamingHint:
      "Per le sessioni competitive: watt al massimo e tetto del clock alzato, per tenere più stabili gli FPS minimi nei momenti concitati.",
    modeApplying: "Applico...",
    profileStageReading: "Lettura dei limiti della scheda",
    profileStageApplying: "Applicazione del limite",
    profileStageSettling: "Attesa della risposta delle ventole",
    profileApplied: "Limite impostato a {watts} W.",
    profileNote:
      "Richiede i permessi di amministratore e si azzera al riavvio. Non è una curva della ventola: NVIDIA non espone il controllo diretto della ventola in nvidia-smi, e i programmi che lo offrono usano API private non documentate che questa app non tocca.",
    profileDefaultIsMax:
      "Su questa scheda il limite di potenza di fabbrica coincide già con il massimo, quindi Silenzioso è l'unico profilo che cambia i watt: Gaming si distingue alzando il tetto del clock.",
    driverInstalled: "installato v{version} il {date}",
    driversHardwareChanged:
      "Questo elenco è stato analizzato su un hardware diverso da quello attuale (ad esempio una scheda grafica sostituita), quindi è stato cancellato. Avvia una nuova scansione per leggere i dispositivi realmente installati.",
    driversNoUpdateCheck:
      "Questa schermata non contatta i produttori e non può sapere se esiste una versione più recente: mostra la versione installata e la sua età, e ti porta alla pagina ufficiale per verificarlo tu.",
    driversCheckedAt: "Letto il {time}",
    modeClockLocked: "clock fino a {mhz} MHz",
    modeClockAuto: "clock automatico",
    profileApply: "Applica profilo",
    profileActive: "Profilo attivo",
    profileWillSet: "Imposterà {watts} W, {clock}",
    scanStarting: "Avvio scansione...",
    scanReading: "Lettura classe {class}",
    scanCount: "{done}/{total} · {pct}%",
    driversScannedAll: "{total} driver esaminati in {classes} categorie",
    winUpdateLabel: "Windows Update",
    winUpdateButton: "Cerca su Windows Update",
    winUpdateNote:
      "Questo controlla solo il catalogo di Windows Update, non i driver specifici elencati sopra: molti produttori (soprattutto per audio e chipset integrati) non pubblicano mai i loro aggiornamenti lì, solo sul proprio sito. WinCraft non scarica pacchetti driver per conto suo: non esiste un'API dei produttori per sapere qual è la versione giusta per il tuo esatto dispositivo, e installare il driver video sbagliato è uno dei pochi errori che può lasciarti senza schermo.",
    winUpdateOpened: "Windows Update aperto.",
    winUpdateSearching: "Ricerca in corso...",
    winUpdateTakesAWhile: "Può richiedere un minuto: interroga il catalogo Microsoft.",
    winUpdateInstall: "Scarica e installa ({count})",
    winUpdateInstalling: "Download e installazione...",
    winUpdateNone:
      "Windows Update non ha nulla di più recente da offrire, anche per i driver segnati come vecchi qui sopra: molti produttori pubblicano gli aggiornamenti a modo loro, non tramite Windows Update.",
    winUpdateFailed: "Ricerca non riuscita: {detail}",
    winUpdateDone: "Installati {installed}, non riusciti {failed}.",
    rebootTitle: "Windows chiede un riavvio",
    rebootBody:
      "Windows segnala che un'installazione si completa solo al riavvio. Puoi farlo adesso o quando preferisci.",
    rebootNow: "Riavvia ora",
    rebootLater: "Più tardi",
  },
  menu: {
    account: "Account",
    plan: "Piano",
    planFree: "Gratuito",
    viewPlan: "Vedi il piano",
    language: "Lingua",
    theme: "Temi",
    about: "Informazioni",
    errorReports: "Report errori anonimi",
    errorReportsBody:
      "Se qualcosa fallisce, invia solo il messaggio di errore (mai dati personali) per aiutarci a correggere i bug. Disattivato di default.",
    changePhoto: "Cambia foto profilo",
    removePhoto: "Rimuovi foto",
    photoFailed: "Impossibile usare questa immagine come foto profilo.",
    support: "Supporto",
    reportIssue: "Segnala un problema",
    aboutBody: "WinCraft — tweak di sistema con backup e ripristino automatico.",
    close: "Chiudi",
  },
  auth: {
    login: "Accedi",
    register: "Registrati",
    email: "Email",
    password: "Password",
    loginButton: "Accedi",
    rememberMe: "Ricordami su questo PC",
    registerButton: "Crea account",
    working: "...",
    logout: "Esci",
    loggedInAs: "Accesso effettuato come {email}",
    backendNotConfigured:
      "Nessun server collegato ancora: configura API_BASE_URL dopo aver distribuito il backend.",
    switchToRegister: "Non hai un account? Registrati",
    switchToLogin: "Hai già un account? Accedi",
    emailInvalid: "Inserisci un'email valida.",
    passwordTooShort: "La password deve avere almeno 8 caratteri.",
    firstName: "Nome",
    lastName: "Cognome",
    registerDetailsRequired: "Nome, cognome e data di nascita sono obbligatori.",
    loginRequiredToResend: "Accedi prima, poi richiedi un nuovo link.",
    checkInboxAfterSignup:
      "Ti abbiamo inviato un link di conferma a {email}. Controlla anche lo spam: appena confermi, il tuo account è pronto.",
    forgotPasswordLink: "Password dimenticata?",
    forgotPasswordButton: "Invia link di ripristino",
    forgotPasswordSent: "Se l'email è registrata, riceverai un link per reimpostare la password.",
    backToLogin: "Torna al login",
    emailNotVerified: "Email non verificata",
    emailVerified: "Email verificata",
    resendVerification: "Invia di nuovo",
    verificationSent: "Email di verifica inviata.",
    deleteAccount: "Elimina account",
    deleteAccountBody:
      "Rimuove il tuo indirizzo email, la password e i dettagli salvati, disconnette tutti i dispositivi e non può essere annullata. Una recensione che hai pubblicato resta visibile, ma l’indirizzo viene rimosso.",
    deleteAccountPassword: "La tua password attuale",
    deleteAccountConfirmLabel: "Scrivi DELETE per confermare",
    deleteAccountSubmit: "Elimina definitivamente il mio account",
    deleteAccountCancel: "Annulla",
    deleteAccountDone:
      "Il tuo account è stato eliminato. Tutti i dispositivi sono stati disconnessi.",
    deleteAccountBlocked:
      "Questo account ha un abbonamento attivo. Annullalo da Gestisci abbonamento: altrimenti eliminare l’account lascerebbe la carta ancora addebitata.",
    deleteAccountWrongPassword: "Questa password non corrisponde all’account.",
    deleteAccountNeedsLogin: "La sessione è scaduta. Accedi di nuovo per eliminare l’account.",
    deleteAccountUnreachable:
      "Impossibile raggiungere il server. Non è stato eliminato nulla: controlla la connessione e riprova.",
  },
  driftWatch: {
    title: "Sorveglia gli aggiornamenti di Windows",
    body: "Un aggiornamento cumulativo rimette a posto ciò che non riconosce: le tue modifiche spariscono e lo scopri settimane dopo, se mai. Con questa attiva il controllo gira all'accesso e ti avvisa solo se qualcosa ha smesso davvero di essere in vigore.",
    on: "Attiva",
    off: "Disattivata",
  },
  guard: {
    settingTitle: "Lascia stare i giochi che si gestiscono da soli",
    settingBody:
      "Alcuni giochi gestiscono da soli le proprie prestazioni. Mentre uno di questi è in esecuzione, WinCraft sospende le regolazioni sulle app e lascia il gioco esattamente com'è.",
    selfManaged: "Questo gioco gestisce da solo le sue prestazioni: WinCraft lo lascia com'è.",
    gameRunning:
      "È in esecuzione un gioco che gestisce da solo le sue prestazioni: WinCraft lascia le app come sono finché non lo chiudi.",
    paused: "In pausa mentre è in esecuzione un gioco che gestisce da solo le sue prestazioni.",
    selfManagedBadge: "Gestisce da solo le prestazioni",
    registeredGameRunning: "È in esecuzione uno dei tuoi giochi: WinCraft aspetta che si chiuda.",
  },
  preview: {
    title: "Anteprima",
    loading: "Lettura dei valori attuali...",
    now: "Ora",
    notSet: "Non impostato",
    willChange: "Applicandolo cambiano {count} valori su {total}.",
    noChange: "Già in vigore: applicandolo non cambia nulla.",
    readAtApply: "Lo stato attuale viene letto e salvato nel momento in cui lo applichi.",
    failed: "Non è stato possibile leggere i valori attuali.",
  },
  requirements: {
    minBuild: "{version} o successivo",
    proEdition: "Pro, Enterprise o Education",
    unavailableVersion: "Non disponibile su questo PC: richiede {version} o successivo.",
    unavailableEdition:
      "Non disponibile su questo PC: richiede Windows Pro, Enterprise o Education.",
    enterpriseEdition: "Enterprise o Education",
    unavailableEnterpriseEdition:
      "Non disponibile su questo PC: richiede Windows Enterprise o Education.",
    notPresent: "Questo PC non ha questa funzione, quindi non c'è nulla da disattivare.",
    windowsProtected:
      "Su questo PC Windows protegge questa opzione e non accetta modifiche da altre app. Disattiva Widget in Impostazioni > Personalizzazione > Barra delle applicazioni.",
  },
  scheduledCleanup: {
    title: "Pulizia settimanale dei file temporanei",
    body: "Una volta a settimana, pochi minuti dopo l'accesso, sposta nel Cestino i file temporanei che nessuno tocca da almeno un giorno. Aspetta se è in corso un gioco e non tocca mai la memoria né le app aperte.",
  },
  priorityRules: {
    title: "Regole di priorità per le app",
    subtitle:
      "Scegli un'app e una priorità. WinCraft la imposta ogni volta che l'app si avvia mentre WinCraft è aperto, e rimette la priorità di prima quando rimuovi la regola o chiudi WinCraft. Mai oltre Alta.",
    remove: "Rimuovi",
    empty: "Nessuna app per ora.",
    active: "App in esecuzione regolate: {count}",
    levelLabel: "Priorità di {name}",
    idle: "Bassa",
    belowNormal: "Inferiore al normale",
    normal: "Normale",
    aboveNormal: "Superiore al normale",
    high: "Alta",
  },
  tweaks: {
    disable_click_to_do: {
      name: "Disattiva Click to Do",
      description:
        "Imposta il criterio di Windows che rimuove Click to Do, la funzione che cattura lo schermo e lo analizza per proporre azioni. I suoi punti di accesso spariscono per tutti gli account di questo PC. Impostazioni lo mostrerà come gestito dall'organizzazione: è così che Windows indica i criteri. Ha effetto solo sui PC in cui Windows offre Click to Do.",
    },
    disable_edge_ai: {
      name: "Disattiva le funzioni IA di Microsoft Edge",
      description:
        "Imposta i criteri di Microsoft Edge per le sue funzioni IA. Quali hanno effetto dipende dal profilo di Edge: impedire a Edge di scaricare il suo modello IA locale funziona per tutti i profili; disattivare la ricerca nella cronologia con l'IA e i temi generati dall'IA funziona per i profili non connessi con un account Microsoft personale; disattivare l'accesso di Copilot al contenuto delle pagine e il suo aiuto alla scrittura funziona solo per i profili di lavoro o scuola. La barra laterale di Edge ha un controllo a parte in questo elenco. Edge applica i criteri senza riavvio; li trovi elencati in edge://policy. Edge indicherà di essere gestito dall'organizzazione: è così che segnala i criteri.",
    },
    disable_paint_ai: {
      name: "Disattiva le funzioni IA di Paint",
      description:
        "Imposta i criteri di Windows che disattivano Cocreator, Image Creator e il riempimento generativo in Paint. Tutto il resto di Paint funziona come prima.",
    },
    disable_notepad_ai: {
      name: "Disattiva le funzioni IA del Blocco note",
      description:
        "Imposta il criterio del Blocco note che disattiva i suoi strumenti di scrittura Copilot (riscrivi, riassumi, scrivi). Chiudi e riapri il Blocco note per vedere la modifica.",
    },
    disable_fast_startup: {
      name: "Disattiva l'avvio rapido",
      description:
        "Fa sì che Arresta il sistema spenga davvero il PC invece di ibernarlo in parte. Da spento Windows si avvia qualche secondo più lentamente, ma driver e aggiornamenti si caricano da zero ogni volta, e chi usa il dual boot non trova più il disco di Windows bloccato.",
    },
    disable_storage_sense: {
      name: "Disattiva Sensore memoria",
      description:
        "Impedisce a Windows di eliminare i file temporanei, svuotare il Cestino e lasciare online i file di OneDrive secondo un suo calendario. Decidi tu cosa pulire e quando.",
    },
    taskbar_end_task: {
      name: "Aggiungi Termina attività alla barra delle applicazioni",
      description:
        "Aggiunge Termina attività al menu del tasto destro delle app sulla barra delle applicazioni, così chiudi un'app bloccata senza aprire Gestione attività.",
    },
    disable_drag_tray: {
      name: "Disattiva il pannello di condivisione al trascinamento",
      description:
        "Impedisce al pannello di condivisione (chiamato Drop tray nelle build più recenti) di scendere dall'alto dello schermo ogni volta che trascini un file, così il normale trascinamento funziona senza intralci. Il valore proviene dalla documentazione della community di Windows, non da Microsoft; gli aggiornamenti recenti di Windows 11 offrono questo interruttore anche in Impostazioni.",
    },
    explorer_open_this_pc: {
      name: "Apri Esplora file su Questo PC",
      description:
        "Esplora file si apre su Questo PC, con unità e cartelle, invece che su Home con i file recenti.",
    },
    block_oem_device_apps: {
      name: "Impedisci alle app dei produttori di installarsi da sole",
      description:
        "Impedisce a Windows di scaricare le app dei produttori e le icone personalizzate per i dispositivi che colleghi: è così che alcune utility per mouse, tastiere e schede madri arrivano senza che tu le abbia chieste. I driver si installano come sempre.",
    },
    disable_windows_suggestions: {
      name: "Disattiva consigli e suggerimenti di Windows",
      description:
        "Un solo interruttore per i messaggi che Windows aggiunge di sua iniziativa: consigli e suggerimenti, la schermata di benvenuto dopo gli aggiornamenti, i suggerimenti in Impostazioni, «completa la configurazione del dispositivo», le notifiche suggerite, i consigli e gli avvisi sull'account nel menu Start e la pubblicità dei provider di sincronizzazione in Esplora file. Sono i valori che scrivono gli interruttori di Impostazioni di Windows, come documentato dalla community di Windows; Microsoft non li documenta, quindi un aggiornamento di Windows può cambiarli.",
    },
    disable_widgets: {
      name: "Disattiva completamente i Widget",
      description:
        "Imposta il criterio di Windows che disattiva la bacheca dei Widget, non solo il suo pulsante sulla barra delle applicazioni, così le notizie smettono di caricarsi in background. Impostazioni lo mostrerà come gestito dall'organizzazione: è così che Windows indica i criteri.",
    },
    hide_start_recommended: {
      name: "Rimuovi Consigliati dal menu Start",
      description:
        "Imposta il criterio di Windows che rimuove la sezione Consigliati da Start e lascia tutto lo spazio alle app aggiunte. Impostazioni lo mostrerà come gestito dall'organizzazione: è così che Windows indica i criteri.",
    },
    disable_game_bar_captures: {
      name: "Disattiva le acquisizioni della Game Bar",
      description:
        "Disattiva la funzione di acquisizione della Game Bar e la registrazione in background, che conserva di continuo un video degli ultimi minuti di gioco. Completa l'interruttore Game Bar / Game DVR.",
    },
    disable_ai_fabric_service: {
      name: "Avvia l'host dei componenti IA di Windows solo quando serve",
      description:
        "Arresta il servizio Host dei componenti IA di Windows (WSAIFabricSvc) e lo imposta su Manuale, così non parte più insieme a Windows. Windows può comunque avviarlo quando un'app o una funzione di Windows lo richiede. Windows lo descrive così: «Fornisce servizi di componenti di intelligenza artificiale alle app e ad altri servizi di Windows». Presente solo sui PC che lo hanno.",
    },
    disable_restart_apps: {
      name: "Non riaprire automaticamente le app dopo l'accesso",
      description:
        "Impedisce a Windows di riaprire le app riavviabili della sessione precedente dopo l'accesso. La sessione non sarà ripristinata automaticamente; non chiude app ora e non modifica l'accesso automatico.",
    },
    enable_long_paths: {
      name: "Abilita i percorsi lunghi nelle app compatibili",
      description:
        "Consente alle app che dichiarano supporto ai percorsi lunghi di superare il limite tradizionale. Le app vecchie e alcune operazioni di Esplora file possono restare limitate. Riavvia le app; il ripristino può rendere inaccessibili i percorsi lunghi già creati.",
    },
    disable_filter_keys_shortcut: {
      name: "Evita l'attivazione accidentale di Filtro tasti",
      description:
        "Disattiva solo la scorciatoia di Shift destro per Filtro tasti. La funzione di accessibilità e i suoi tempi restano invariati; non riduce la latenza della tastiera.",
    },
    ecoqos_rules: {
      name: "Regole di efficienza per le app in background",
      description:
        "Assegna una priorità energetica ridotta a eseguibili scelti mentre WinCraft è aperto. Le regole si sospendono quando l'app è interattiva; non sono un limite percentuale della CPU.",
    },
    limit_do_background_download: {
      name: "Limite ai download Windows in background",
      description:
        "Configura un limite in KB/s per i download Microsoft gestiti da Delivery Optimization. Non limita Steam o altri dispositivi e non garantisce ping inferiore.",
    },
    monitor_refresh_profile: {
      name: "Profilo frequenza monitor per gioco",
      description:
        "Scegli una frequenza supportata per un monitor durante una sessione di gioco, con anteprima temporanea e ripristino. Non aumenta i frame prodotti dalla GPU.",
    },
    cpu_energy_performance: {
      name: "Privilegia le prestazioni CPU con alimentazione di rete",
      description:
        "Imposta a 0 la preferenza energetica della CPU nel piano corrente quando il PC è collegato alla rete elettrica. Richiede CPPC autonomo; restano i limiti termici e del firmware. Può aumentare calore e consumi. Non modifica la batteria. Valuta il tuo carico prima di mantenerlo.",
    },
    pcie_link_power: {
      name: "Mantieni attivi i collegamenti PCIe con alimentazione di rete",
      description:
        "Disattiva il risparmio energetico dei collegamenti PCIe nel piano corrente con alimentazione di rete. Serve a diagnosticare problemi durante le transizioni energetiche; non garantisce una latenza inferiore. Può aumentare i consumi a riposo. Non modifica la batteria.",
    },
    usb_suspend_diagnostics: {
      name: "Diagnostica il risveglio USB con alimentazione di rete",
      description:
        "Disattiva la sospensione selettiva USB con alimentazione di rete per indagare problemi di risveglio o disconnessione. Windows consiglia di lasciarla normalmente attiva. Ripristina dopo la prova: i consumi a riposo possono aumentare. Non modifica la batteria.",
    },
    hybrid_short_threads: {
      name: "Preferisci i core prestanti per i thread brevi",
      description:
        "Su CPU con classi di efficienza differenti, chiede a Windows di preferire i core prestanti per i thread brevi con alimentazione di rete. È una preferenza, non un'affinità fissa. Lo scheduling automatico può funzionare meglio. Non modifica la batteria.",
    },
    hybrid_long_threads: {
      name: "Preferisci i core prestanti per i thread lunghi",
      description:
        "Su CPU con classi di efficienza differenti, chiede a Windows di preferire i core prestanti per i thread lunghi con alimentazione di rete. Gli altri core restano disponibili: non disattiva gli E-core. Confronta produttività e reattività. Non modifica la batteria.",
    },
    disable_startup_delay: {
      name: "Rimuovi il ritardo dei programmi all'avvio",
      description:
        "Windows aspetta di proposito circa 10 secondi dopo l'accesso prima di lanciare i programmi all'avvio. Questa opzione elimina quell'attesa.",
    },
    menu_show_delay: {
      name: "Risposta immediata dei menu",
      description:
        "Elimina il ritardo con cui si aprono i menu: tutto il desktop risulta subito più reattivo.",
    },
    disable_power_throttling: {
      name: "Disattiva il risparmio energetico della CPU",
      description:
        "Impedisce a Windows di rallentare i processi in background per risparmiare energia: utile sui portatili, dove questo causa scatti durante le sessioni lunghe.",
    },
    games_gpu_priority: {
      name: "Imposta il valore GPU Priority legacy dei giochi",
      description:
        "Scrive il valore GPU Priority dei giochi, che Microsoft documenta come non utilizzato. Non sono previsti aumenti della priorità GPU o dei fotogrammi al secondo.",
    },
    disable_tailored_experiences: {
      name: "Disattiva le esperienze personalizzate",
      description:
        "Impedisce a Windows di usare i tuoi dati diagnostici per personalizzare pubblicità, suggerimenti e consigli.",
    },
    disable_app_launch_tracking: {
      name: "Non tracciare le app che apri",
      description:
        "Windows registra quanto spesso avvii ogni programma per ordinare i risultati del menu Start. Questa opzione disattiva quel tracciamento.",
    },
    disable_feedback_requests: {
      name: "Blocca le richieste di feedback di Windows",
      description:
        'Impedisce a Windows di interromperti con i sondaggi "Quanto consiglieresti...".',
    },
    disable_cortana: {
      name: "Disattiva Cortana",
      description:
        "Disattiva Cortana tramite policy di sistema, liberando le risorse che riserva in background.",
    },
    show_file_extensions: {
      name: "Mostra sempre le estensioni dei file",
      description:
        'Rivela la vera estensione di ogni file. Vale la pena attivarla anche solo per sicurezza: smaschera file come "fattura.pdf.exe" che Windows altrimenti nasconde.',
    },
    hide_taskbar_widgets: {
      name: "Nascondi i Widget dalla barra delle applicazioni",
      description:
        "Rimuove il pulsante Widget (meteo/notizie), che carica contenuti in background anche se non lo apri mai.",
    },
    network_latency: {
      name: "Conferme TCP e raggruppamento dei pacchetti",
      description:
        "Imposta TcpAckFrequency e TCPNoDelay a 1 sull'adattatore che porta la route verso Internet. Riguarda il comportamento TCP; il traffico UDP resta invariato. Il supporto dipende da Windows e dalle applicazioni, quindi una minore latenza nei giochi non è garantita.",
    },
    disable_window_animations: {
      name: "Animazioni finestre istantanee",
      description:
        "Elimina l'animazione di apertura, chiusura e riduzione a icona delle finestre. Quell'animazione è puro tempo di attesa: toglierla fa rispondere il desktop nell'istante in cui clicchi e libera il lavoro GPU dietro di essa.",
    },
    disable_drag_full_windows: {
      name: "Trascinamento finestre più leggero",
      description:
        "Mentre trascini una finestra ne disegna solo il contorno invece di ridisegnarne tutto il contenuto a ogni fotogramma. Quasi impercettibile su una GPU veloce, differenza netta su grafica integrata o su un PC datato.",
    },
    mouse_hover_delay: {
      name: "Risposta immediata al passaggio del mouse",
      description:
        "Windows aspetta 400 ms prima di reagire al puntatore fermo su un elemento: anteprime della barra, suggerimenti, menu. Questo riduce l'attesa quasi a zero, così l'interfaccia segue il mouse invece di inseguirlo.",
    },
    disable_background_apps: {
      name: "Blocca le app in background",
      description:
        "Impedisce alle app dello Store di girare, aggiornarsi e interrogare la rete mentre non le stai usando. Sono CPU, RAM e batteria reali spese per app che non hai aperto.",
    },
    disable_delivery_optimization: {
      name: "Smetti di condividere gli aggiornamenti Windows",
      description:
        "Per impostazione predefinita Windows carica i file di aggiornamento scaricati verso altri PC usando la tua connessione. Questo limita Delivery Optimization al tuo solo computer, così quell'upload non ti mangia banda mentre giochi.",
    },
    disable_copilot: {
      name: "Criterio Copilot legacy (solo ripristino)",
      description:
        "Questo criterio ritirato non controlla l’app Copilot attuale. Qui puoi ripristinare il valore del registro salvato. Gestisci l’app Copilot separata in Debloat; la rimozione non impedisce installazioni future.",
    },
    disable_suggested_apps: {
      name: "Impedisci a Windows di installare app da solo",
      description:
        "Windows installa in silenzio app e giochi “consigliati” nel menu Start senza chiedertelo, all'installazione e di nuovo dopo i grandi aggiornamenti. Questo lo disattiva: sul tuo PC non finisce più niente che non hai scelto tu.",
    },
    disable_mouse_acceleration: {
      name: "Disattiva l'accelerazione del mouse",
      description:
        "Disattiva “Aumenta la precisione del puntatore”, che fa percorrere al cursore più strada quando muovi il mouse velocemente. È esattamente la risposta variabile che non vuoi quando miri: lo stesso gesto deve coprire sempre la stessa distanza sullo schermo.",
    },
    disable_sticky_keys_prompt: {
      name: "Elimina il popup del Filtro tasti",
      description:
        "Premere Maiusc cinque volte apre la finestra del Filtro tasti, che in un gioco significa uscire dallo schermo intero nel momento peggiore, di solito durante uno scontro. Questo disattiva la scorciatoia e il suo avviso; il Filtro tasti resta disponibile nelle Impostazioni.",
    },
    disable_recall: {
      name: "Disattiva Recall (istantanee AI dello schermo)",
      description:
        "Recall cattura lo schermo ogni pochi secondi e costruisce una cronologia indicizzata dall'AI di tutto ciò che hai guardato: password e messaggi privati inclusi, perché registra qualunque cosa sia a schermo. Questo imposta il criterio di sistema che gli impedisce di analizzare o conservare alcunché.",
    },
    global_timer_resolution: {
      name: "Risoluzione timer globale",
      description:
        "Imposta il valore di registro GlobalTimerResolutionRequests a 1. Questa operazione non richiede né verifica una risoluzione specifica del timer. Il comportamento dipende dalla versione di Windows; latenza inferiore o FPS superiori non sono garantiti. Richiede un riavvio.",
    },
    disable_core_parking: {
      name: "Disattiva il parcheggio dei core",
      description:
        "Impedisce a Windows di parcheggiare i core inattivi quando sei collegato alla rete elettrica, così un core non deve essere risvegliato prima di servire l'input o un picco di lavoro improvviso. Applicato al solo profilo con alimentazione: a batteria il parcheggio serve proprio a quello. Il valore precedente del piano viene registrato e ripristinato esattamente (richiede diritti di amministratore).",
    },
    disable_memory_integrity: {
      name: "Disattiva Integrità della memoria (VBS)",
      description:
        "Richiede la disattivazione di Integrità della memoria (HVCI). Se applicata, rimuove un livello di protezione del kernel; altre funzioni VBS possono restare attive. L'impatto sulle prestazioni dipende da hardware e carico di lavoro. Criteri di sistema o blocco UEFI possono impedire la modifica. Riavvia e verifica lo stato in Sicurezza di Windows.",
    },
    disable_typing_personalization: {
      name: "Impedisci a Windows di studiare come scrivi",
      description:
        "Windows costruisce un dizionario personale da ciò che digiti e scrivi a mano — anche nei gestori di password, nelle chat e nelle caselle di ricerca — e lo sincronizza con il tuo account Microsoft per migliorare i suggerimenti. Questo disattiva sia la raccolta del testo sia quella della scrittura a mano.",
    },
    classic_context_menu: {
      name: "Riporta il menu del tasto destro completo",
      description:
        "Windows 11 nasconde gran parte del menu contestuale dietro “Mostra altre opzioni”, trasformando un clic in due per cose che fai tutto il giorno. Questo ripristina il menu completo di Windows 10 ovunque, in Esplora file e sul desktop. Esplora risorse viene riavviato per applicarlo, quindi le finestre aperte lampeggeranno una volta.",
    },
    disable_transparency: {
      name: "Disattiva gli effetti di trasparenza",
      description:
        "Disattiva gli effetti sfocatura/acrilico di barra e menu. Un risparmio di GPU piccolo ma reale, che rende più fluidi i PC datati o con grafica integrata.",
    },
    dark_mode: {
      name: "Modalità scura",
      description: "Attiva il tema scuro per app e sistema.",
    },
    show_hidden_files: {
      name: "Mostra file nascosti",
      description: "Mostra i file e le cartelle nascosti in Esplora file.",
    },
    priority_separation: {
      name: "Ottimizza priorità processore",
      description:
        "Regola Win32PrioritySeparation (0x26) per dare all'app in primo piano quanti di CPU brevi e variabili con priorità 3x — il classico valore per reattività desktop/gaming.",
    },
    disable_game_dvr: {
      name: "Disattiva Xbox Game Bar / Game DVR",
      description:
        "Disattiva la registrazione in background di Xbox Game Bar, che consuma CPU/GPU durante il gioco.",
    },
    disable_telemetry_tasks: {
      name: "Riduci raccolta dati diagnostici",
      description:
        "Imposta il criterio dei dati di diagnostica di Windows al livello più basso. Home e Pro lo trattano come dati di diagnostica obbligatori; solo Enterprise ed Education li disattivano del tutto.",
    },
    reset_advertising_id: {
      name: "Disattiva ID pubblicità",
      description: "Impedisce alle app di usare il tuo ID pubblicitario per la profilazione.",
    },
    disable_location_tracking: {
      name: "Disattiva tracciamento posizione",
      description:
        "Blocca l'accesso alla posizione geografica per tutte le app tramite policy di sistema.",
    },
    disable_bing_search: {
      name: "Disattiva ricerca Bing nel menu Start",
      description:
        "Applica il criterio Explorer che tiene i risultati web e i suggerimenti di Bing fuori dalla ricerca di Start, così la ricerca resta su questo PC. Impostazioni lo mostrerà come gestito dall'organizzazione: è così che Windows indica i criteri.",
    },
    power_plan_performance: {
      name: "Prestazioni elevate (piano di alimentazione)",
      description:
        'Passa al piano di alimentazione Windows "Prestazioni elevate". Utile su desktop o quando sei collegato alla corrente; ripristina il piano precedente al rollback.',
    },
    turbo_gaming: {
      name: "Turbo Gaming",
      description:
        "Preset: disattiva Game DVR, imposta il piano di alimentazione su Prestazioni elevate e ottimizza la priorità del processore (richiede privilegi di amministratore).",
    },
    privacy_dns: {
      name: "DNS privati (Cloudflare)",
      description:
        "Passa a server DNS orientati alla privacy (1.1.1.1) impedendo al tuo provider di registrare le richieste DNS. Non nasconde il tuo indirizzo IP (per quello serve una VPN, vedi sotto).",
    },
    hardware_gpu_scheduling: {
      name: "Pianificazione GPU con accelerazione hardware",
      description:
        "Richiede la pianificazione GPU con accelerazione hardware (HAGS). Servono GPU, driver e versione di Windows compatibili. Prestazioni e latenza possono migliorare, peggiorare o restare invariate secondo il gioco. Riavvia e verifica la disponibilità nelle impostazioni Grafica di Windows.",
    },
    reduce_input_lag: {
      name: "Riduci ritardo di input (mouse)",
      description:
        'Disattiva l\'accelerazione del puntatore ("Migliora precisione puntatore") per un movimento del mouse 1:1, senza ritardi introdotti dal sistema.',
    },
    turbo_boost: {
      name: "Turbo Boost processore",
      description:
        "Imposta la modalità boost su Aggressiva con alimentazione da rete e a batteria, e lo stato minimo del processore al 100% con alimentazione da rete nel piano energetico corrente. Consumi e calore possono aumentare. Restano validi i limiti di CPU, firmware e temperatura; più FPS non sono garantiti (richiede privilegi di amministratore).",
    },
    network_throttling_index: {
      name: "Disattiva limitazione di rete multimediale",
      description:
        "Rimuove il limite che Windows impone al traffico di rete durante l'uso di app multimediali/giochi, utile per ridurre micro-lag online.",
    },
    system_responsiveness: {
      name: "Imposta la quota CPU in background di MMCSS",
      description:
        "Scrive SystemResponsiveness=0, che Windows tratta come 20%. Non elimina la quota CPU per i task a priorità inferiore né dà priorità a tutte le app in primo piano.",
    },
    games_task_priority: {
      name: "Imposta la categoria MMCSS Games",
      description:
        "Imposta su High la categoria Games per i thread registrati con MMCSS; High tratta Priority come 2. I valori GPU Priority e SFIO Priority scritti sono inutilizzati. Non dà priorità a tutti i processi di gioco.",
    },
    reduce_keyboard_delay: {
      name: "Riduci ritardo di input (tastiera)",
      description:
        "Azzera il ritardo prima che una pressione prolungata dei tasti inizi a ripetersi e ne massimizza la velocità di ripetizione, per una risposta più immediata in gioco.",
    },
    keep_kernel_in_ram: {
      name: "Tieni kernel e driver nella RAM",
      description:
        "Windows può spostare su disco parti del kernel e del codice dei driver anche quando la memoria abbonda, e rileggerle è una pausa che senti come uno scatto. Questo li tiene in memoria. Conviene se hai RAM in abbondanza; su un PC con poca memoria lascialo disattivato.",
    },
    auto_end_frozen_tasks: {
      name: "Non far bloccare lo spegnimento da un'app freezata",
      description:
        'Quando un programma smette di rispondere durante lo spegnimento, Windows aspetta e mostra la schermata "Questa app impedisce l\'arresto" finché qualcuno non clicca. Questo chiude da solo le app bloccate, così un programma piantato non può lasciare il PC acceso. Attenzione: la chiusura automatica delle app può causare la perdita del lavoro non salvato. Ripristinare questa impostazione non recupera quel lavoro.',
    },
    instant_folder_loading: {
      name: "Apri ogni cartella all'istante",
      description:
        "Esplora file analizza il contenuto di una cartella per indovinare se è Immagini, Musica o Documenti, e una cartella con migliaia di file multimediali può restare bloccata per secondi mentre decide. Questo fissa tutte le cartelle sul layout generale, così si aprono subito.",
    },
    tcp_congestion_bbr: {
      name: "Ping stabile anche con la linea occupata (BBR2)",
      description:
        "Windows usa CUBIC, che accelera finché un buffer da qualche parte non trabocca: è il motivo per cui il ping sale appena qualcun altro in casa scarica qualcosa. BBR2 misura la banda reale e il tempo di andata e ritorno della linea e regola il ritmo di conseguenza, così il tubo si riempie senza riempire la coda. Microsoft include BBR2 in Windows 11; questo passa il profilo Internet a BBR2 e sa tornare esattamente a com'era (richiede diritti di amministratore).",
    },
    taskbar_align_left: {
      name: "Allinea la barra delle applicazioni a sinistra",
      description:
        "Riporta le icone della taskbar allineate a sinistra (stile Windows 10) invece che al centro.",
    },
    hide_taskbar_chat: {
      name: "Nascondi Chat/Teams dalla barra delle applicazioni",
      description: "Rimuove l'icona Chat (Microsoft Teams) dalla taskbar.",
    },
    disable_start_suggestions: {
      name: "Disattiva suggerimenti e app consigliate nel menu Start",
      description:
        "Impedisce a Windows di mostrare app consigliate, annunci e suggerimenti nel menu Start.",
    },
    disable_activity_history: {
      name: "Disattiva cronologia attività (Windows Timeline)",
      description:
        "Impedisce a Windows di registrare, salvare e inviare a Microsoft la cronologia delle app e dei documenti usati, tramite policy di sistema.",
    },
    hide_taskbar_search: {
      name: "Nascondi la casella di ricerca dalla barra delle applicazioni",
      description:
        "Rimuove la casella/icona di ricerca dalla taskbar, per una barra più pulita (la ricerca resta comunque disponibile dal tasto Windows).",
    },
    disable_fullscreen_optimizations_global: {
      name: "Disattiva ottimizzazioni schermo intero globalmente",
      description:
        "Forza DXGI a rispettare la vera modalità a schermo intero esclusiva invece della simulazione di Windows, riducendo micro-scatti e input lag in molti giochi più datati.",
    },
    disable_windows_search_service: {
      name: "Disattiva servizio di indicizzazione (Windows Search)",
      description:
        "Ferma e disattiva il servizio di indicizzazione dei file di Windows, riducendo l'attività su disco in background — utile su SSD piccoli o mentre giochi. La ricerca file nel menu Start diventa più lenta finché non lo riattivi (richiede privilegi di amministratore).",
    },
    enable_regback: {
      name: "Attiva backup automatico del registro (RegBack)",
      description:
        "Riattiva i backup periodici automatici degli hive del registro di Windows in %SystemRoot%\\System32\\config\\RegBack per il ripristino di emergenza.",
    },
    explorer_anti_hang: {
      name: "Previeni blocchi di Esplora file sui collegamenti",
      description:
        "Disattiva la risoluzione dei percorsi e la ricerca di rete all'apertura dei collegamenti, evitando che Esplora file si blocchi quando puntano a unità disconnesse o condivisioni di rete.",
    },
    no_internet_open_with: {
      name: "Salta la ricerca nel Microsoft Store per file sconosciuti",
      description:
        "Apre subito il selettore locale «Apri con» anziché suggerire di cercare nel Microsoft Store quando fai doppio clic su estensioni non riconosciute.",
    },
    detailed_bsod: {
      name: "Mostra parametri dettagliati sui crash BSOD",
      description:
        "Mostra i codici di errore esadecimali, i driver responsabili e gli indirizzi di memoria sulle schermate blu anziché nasconderli dietro un codice QR generico.",
    },
    disable_wpbt: {
      name: "Blocca l'esecuzione di software UEFI WPBT",
      description:
        "Impedisce al firmware UEFI della scheda madre di installare automaticamente binari OEM non desiderati in Windows tramite la tabella WPBT.",
    },
    disable_ndu: {
      name: "Disattiva il leak di memoria non paginata di NDU",
      description:
        "Disabilita il driver Network Diagnostic Usage, prevenendo l'accumulo di memoria RAM nel pool non paginato durante download di rete intensi.",
    },
    disable_search_highlights: {
      name: "Disattiva illustrazioni e notizie nella ricerca",
      description:
        "Rimuove le illustrazioni web, i doodle giornalieri di Bing e le tendenze dalla barra di ricerca di Windows e dalla barra delle applicazioni.",
    },
    auto_complete_run: {
      name: "Attiva completamento automatico nella finestra Esegui",
      description:
        "Abilita il completamento istantaneo dei comandi e i suggerimenti nella finestra di dialogo Esegui di Windows (Win + R).",
    },
    disable_aero_shake: {
      name: "Disattiva minimizzazione con scuotimento (Aero Shake)",
      description:
        "Evita che lo scuotimento della barra del titolo di una finestra minimizzi accidentalmente tutte le altre finestre aperte in background.",
    },
    disable_remote_assistance: {
      name: "Disattiva inviti di Assistenza remota",
      description:
        "Disabilita le connessioni e gli inviti di Assistenza remota di Windows per proteggere il sistema da richieste di supporto non autorizzate.",
    },
    disable_llmnr: {
      name: "Disattiva protocollo LLMNR",
      description:
        "Disabilita Link-Local Multicast Name Resolution (LLMNR) per proteggersi da attacchi di spoofing e intercettazione credenziali sulla rete locale.",
    },
    disable_wifi_sense: {
      name: "Disattiva condivisione hotspot Wi-Fi Sense",
      description:
        "Impedisce a Windows di connettersi automaticamente a reti Wi-Fi aperte e di condividere le credenziali di rete con i contatti.",
    },
    disable_cloud_search: {
      name: "Disattiva ricerca cloud nella ricerca di Windows",
      description:
        "Impedisce alla ricerca di Windows di interrogare la cronologia cloud e i registri dell'account Microsoft durante la ricerca di file locali.",
    },
    disable_app_suggestions_start: {
      name: "Disattiva suggerimenti e consigli nel menu Start",
      description:
        "Disabilita i suggerimenti promozionali di applicazioni e i consigli sulle funzionalità all'interno del menu Start di Windows.",
    },
    disable_handwriting_sharing: {
      name: "Disattiva condivisione errori di scrittura manuale",
      description:
        "Impedisce a Windows di trasmettere a Microsoft i registri degli errori di riconoscimento della scrittura e i tratti tracciati.",
    },
    disable_ceip: {
      name: "Disattiva Analisi utilizzo software (CEIP)",
      description:
        "Disattiva il client di telemetria SQM per il programma Analisi utilizzo software (CEIP) di Windows.",
    },
    disable_lockscreen_camera: {
      name: "Disattiva fotocamera nella schermata di blocco",
      description:
        "Disabilita il pulsante e il gesto della fotocamera nella schermata di blocco per impedire lo scatto di foto senza sbloccare il dispositivo.",
    },
    disable_cortana_consent: {
      name: "Disattiva consenso alla ricerca con Cortana",
      description:
        "Revoca il consenso alla ricerca di Cortana per evitare che query di ricerca e dati vocali vengano condivisi con i servizi cloud Microsoft.",
    },
    disable_wer_queuing: {
      name: "Disattiva accodamento segnalazioni errori di Windows",
      description:
        "Impedisce a Segnalazione errori Windows di salvare e accodare i report di arresto anomalo su disco per l'invio posticipato.",
    },
    disable_experimentation: {
      name: "Disattiva telemetria di sperimentazione di Windows",
      description:
        "Disabilita le funzionalità di test A/B e sperimentazione di Microsoft su Windows, mantenendo il comportamento del sistema coerente e prevedibile.",
    },
    disable_app_inventory_collection: {
      name: "Disattiva inventario compatibilità applicazioni",
      description:
        "Disabilita il raccoglitore di inventario di compatibilità delle applicazioni che scansiona i programmi installati e li segnala a Microsoft.",
    },
    disable_problem_steps_recorder: {
      name: "Disattiva telemetria Registratore azioni utente",
      description:
        "Disabilita l'acquisizione di errori e l'invio di dati diagnostici da parte dello Strumento di registrazione azioni utente (PSR).",
    },
    disable_ait_telemetry: {
      name: "Disattiva telemetria di impatto applicazioni (AIT)",
      description:
        "Disattiva la raccolta dei dati di Application Impact Telemetry (AIT) all'avvio dei software.",
    },
    disable_smartscreen_app_install: {
      name: "Disattiva telemetria di installazione SmartScreen",
      description:
        "Disabilita l'invio di dati di telemetria e le query di verifica URL di SmartScreen all'installazione delle applicazioni.",
    },
    disable_online_speech_privacy: {
      name: "Disattiva raccolta dati riconoscimento vocale online",
      description:
        "Disattiva la raccolta dei dati vocali su cloud per la digitazione vocale e i modelli di parlato.",
    },
    disable_edge_shopping: {
      name: "Disattiva assistente allo shopping di Edge",
      description:
        "Disabilita l'assistente agli acquisti e il tracciamento dei coupon in Microsoft Edge.",
    },
    disable_edge_metrics: {
      name: "Disattiva segnalazione metriche diagnostiche di Edge",
      description:
        "Disabilita la trasmissione di metriche di utilizzo e report di arresto anomalo di Microsoft Edge.",
    },
    disable_edge_startup_boost: {
      name: "Disattiva Avvio rapido di Edge",
      description:
        "Disabilita l'avvio rapido di Microsoft Edge, evitando che processi in background vengano eseguiti all'avvio di Windows.",
    },
    disable_edge_background_mode: {
      name: "Disattiva estensioni in background di Edge",
      description:
        "Impedisce a Microsoft Edge di rimanere in esecuzione in background quando viene chiuso, liberando memoria di sistema.",
    },
    disable_bluetooth_le_discovery: {
      name: "Disattiva scansione Bluetooth LE in background",
      description:
        "Disabilita la scansione continua in background di dispositivi Bluetooth Low Energy per ridurre l'utilizzo della CPU e il consumo energetico.",
    },
    disable_edge_hub_sidebar: {
      name: "Disattiva barra laterale di Microsoft Edge",
      description: "Disattiva la barra laterale di Edge e i widget web integrati in background.",
    },
    disable_edge_wallet: {
      name: "Disattiva suggerimenti portafoglio di Edge",
      description:
        "Impedisce a Microsoft Edge di richiedere automaticamente i servizi di pagamento e portafoglio.",
    },
    disable_cortana_above_lock: {
      name: "Disattiva Cortana sopra la schermata di blocco",
      description:
        "Impedisce agli assistenti vocali e alla ricerca di ascoltare o attivarsi a schermo bloccato.",
    },
    disable_device_history: {
      name: "Disattiva cronologia attività del dispositivo Windows",
      description:
        "Impedisce a Windows di registrare e tracciare la cronologia di app e file su questo dispositivo.",
    },
    disable_search_history: {
      name: "Disattiva cronologia di ricerca della barra delle applicazioni",
      description:
        "Disattiva il tracciamento e la memorizzazione delle ricerche passate nella barra delle applicazioni e nel menu Start.",
    },
    disable_news_and_interests: {
      name: "Disattiva feed Notizie e Interessi",
      description:
        "Nasconde il widget meteo e notizie sulla barra delle applicazioni di Windows, risparmiando rete e memoria in background.",
    },
    disable_auto_maintenance_wake: {
      name: "Disattiva risveglio per manutenzione automatica",
      description:
        "Impedisce alla manutenzione automatica di Windows di risvegliare il computer o consumare la batteria durante la notte.",
    },
    disable_diagnostic_data_viewer: {
      name: "Disattiva archivio dati di diagnostica locale",
      description:
        "Impedisce alla telemetria di diagnostica di Windows di riservare e scrivere database di cache locali sul disco.",
    },
    disable_consumer_experiences: {
      name: "Disattiva le esperienze per i consumatori di Microsoft",
      description:
        "Attiva il criterio che impedisce a Windows di installare automaticamente app dello Store promosse, app suggerite e suggerimenti per i consumatori. Impostazioni lo mostrerà come gestito dall'organizzazione: è così che Windows indica i criteri. Le app installate da te non vengono rimosse.",
    },
    disable_cloud_clipboard: {
      name: "Disattiva la sincronizzazione degli appunti tra dispositivi",
      description:
        "Applica il criterio che impedisce a Windows di sincronizzare il contenuto degli appunti con il tuo account Microsoft e gli altri tuoi dispositivi. Gli appunti di questo PC continuano a funzionare come prima. Il ripristino rimuove il criterio.",
    },
    disable_error_reporting: {
      name: "Disattiva la segnalazione errori di Windows",
      description:
        "Attiva il criterio che impedisce a Windows di inviare a Microsoft i rapporti sugli arresti anomali e sui blocchi. Windows continua a mostrarti l'errore, ma non viene inviato alcun rapporto. Il ripristino rimuove il criterio.",
    },
    disable_typing_insights: {
      name: "Disattiva dati di digitazione e statistiche",
      description:
        "Impedisce a Windows di analizzare i modelli di digitazione e le statistiche di completamento automatico.",
    },
    disable_inking_typing_personalization: {
      name: "Disattiva personalizzazione input penna e digitazione",
      description:
        "Impedisce a Windows di inviare a Microsoft i dati del dizionario locale di scrittura a mano e digitazione.",
    },
    disable_shared_experiences: {
      name: "Disattiva condivisione tra dispositivi connessi",
      description:
        "Disattiva la sincronizzazione in background della piattaforma Connected Devices Platform (CDP).",
    },
    disable_remote_desktop: {
      name: "Disattiva connessioni Desktop remoto in entrata",
      description:
        "Blocca le connessioni desktop remoto RDP in entrata per ridurre la superficie di attacco.",
    },
    disable_edge_collections: {
      name: "Disattiva Raccolte di Microsoft Edge",
      description:
        "Disattiva le raccolte di Edge e la sincronizzazione in background per ridurre il consumo di risorse.",
    },
    disable_edge_quick_search: {
      name: "Disattiva widget barra di ricerca desktop di Edge",
      description:
        "Impedisce a Microsoft Edge di visualizzare widget di ricerca mobili sul desktop di Windows.",
    },
    disable_edge_personalization: {
      name: "Disattiva personalizzazione e telemetria di Edge",
      description:
        "Disattiva l'invio della cronologia di navigazione e i profili pubblicitari in Microsoft Edge.",
    },
    disable_lockscreen_spotlight: {
      name: "Disattiva Contenuti in evidenza di Windows nella schermata di blocco",
      description:
        "Impedisce a Windows di scaricare sfondi promozionali e suggerimenti nella schermata di blocco.",
    },
    disable_push_install_service: {
      name: "Disattiva servizio di installazione remota PushToInstall",
      description:
        "Impedisce a Microsoft Store di inviare installazioni di app a questo PC da remoto dal Web.",
    },
    disable_sqm_telemetry: {
      name: "Disattiva la sessione di autologging SQM",
      description:
        "Disattiva la sessione di autologging SQMLogger: la traccia Software Quality Metrics che alimenta il client CEIP di Microsoft non parte più all'avvio. Windows può riattivare la sessione con un aggiornamento; riapplica il controllo se ritorna. Il ripristino riscrive il valore Start originale.",
    },
    disable_diagtrack_autologger: {
      name: "Disattiva la sessione di autologging DiagTrack",
      description:
        "Disattiva la sessione AutoLogger-Diagtrack-Listener: la traccia diagnostica usata dal servizio DiagTrack non parte più all'avvio. Il servizio non viene toccato: si ferma solo la sessione di traccia, non il servizio. Il ripristino riscrive il valore Start originale.",
    },
    disable_compatibility_assistant: {
      name: "Disattiva Assistente compatibilità programmi",
      description:
        "Disattiva i popup e le scansioni in background dell'Assistente compatibilità programmi all'avvio di software datato.",
    },
    disable_cortana_cloud_search: {
      name: "Disattiva indicizzatore cloud di Windows Search",
      description:
        "Impedisce a Windows Search di interrogare indici cloud e server Bing durante la ricerca di file locali.",
    },
    disable_find_my_device: {
      name: "Disattiva rilevamento Trova il mio dispositivo",
      description:
        "Disattiva la trasmissione continua della posizione GPS e Wi-Fi per i servizi Trova il mio dispositivo.",
    },
    disable_sensors_data_collection: {
      name: "Disattiva raccolta dati dai sensori hardware",
      description:
        "Disattiva il monitoraggio in background dei sensori (luce ambientale, accelerometro) e della posizione.",
    },
    disable_location_scripting: {
      name: "Disattiva accesso alla posizione per gli script",
      description:
        "Impedisce a script in background e motori browser di richiedere la posizione fisica del dispositivo.",
    },
    disable_advertising_info: {
      name: "Disattiva ID annunci tramite criteri di gruppo",
      description:
        "Applica un blocco dei criteri per disattivare il tracciamento dell'ID annunci a livello di sistema per tutti gli utenti.",
    },
    disable_sync_settings: {
      name: "Disattiva sincronizzazione impostazioni nel cloud",
      description:
        "Impedisce a Windows di sincronizzare personalizzazione, password e preferenze di sistema sui server Microsoft.",
    },
    disable_app_diagnostics_access: {
      name: "Disattiva accesso delle app alle informazioni di diagnostica",
      description:
        "Blocca le app di terze parti del Microsoft Store dalla lettura di informazioni di diagnostica e telemetria.",
    },
  },
  cleanup: {
    temp_cleanup: {
      name: "Pulisci file temporanei",
      description:
        "Sposta nel Cestino il contenuto di %TEMP%: puoi recuperarlo in qualsiasi momento, non è una cancellazione definitiva.",
    },
    winupdate_cache_cleanup: {
      name: "Svuota cache aggiornamenti Windows",
      description:
        "Sposta nel Cestino i pacchetti di Windows Update già installati (richiede privilegi di amministratore).",
    },
  },
};
