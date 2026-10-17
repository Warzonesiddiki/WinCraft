import type { Strings } from "../i18n";

/**
 * The French table, on its own so the app can ship one language and
 * fetch the others on demand (Batch Z). It is data only: no logic lives here.
 */
export const fr: Strings = {
  coffee: {
    nav: "Offrez-moi un café",
    cta: "Financer la prochaine version",
    fewer: "Un café en moins",
    more: "Un café en plus",
  },
  appName: "WinCraft",
  appliedCount: "{applied} sur {total} optimisations actives",
  headerNote:
    "Examinez chaque modification avant de l'appliquer. Les outils de restauration couvrent les paramètres pris en charge ; les opérations de nettoyage et de réparation ont des limites de récupération différentes.",
  advisor: {
    eyebrow: "Recommandé pour votre PC",
    applyButton: "Appliquer",
    confidenceHigh: "Confiance élevée — basé sur le matériel de ce PC",
    confidenceStandard: "Recommandé pour ce type de machine",
    reversible: "Réversible — la valeur d'origine est enregistrée avant toute modification.",
    empty: "Rien à recommander pour l'instant — votre configuration suit déjà nos conseils.",
  },
  drift: {
    pickHint: "Décochez ce que vous avez modifié volontairement.",
    titleAfterUpdate: "Windows a modifié vos réglages",
    titleNoUpdate: "Certains réglages ne sont plus actifs",
    afterUpdateOne:
      "Après la mise à jour vers {patch}, un réglage que vous aviez appliqué n’est plus actif sur le système.",
    afterUpdateMany:
      "Après la mise à jour vers {patch}, {count} réglages que vous aviez appliqués ne sont plus actifs sur le système.",
    noUpdateOne:
      "Un réglage que vous aviez appliqué n’est plus actif sur le système. Aucune mise à jour de Windows entre-temps : autre chose l’a modifié.",
    noUpdateMany:
      "{count} réglages que vous aviez appliqués ne sont plus actifs sur le système. Aucune mise à jour de Windows entre-temps : autre chose les a modifiés.",
    reapplyOne: "Réappliquer le réglage",
    reapplyMany: "Réappliquer {count} réglages",
    reapplying: "Réapplication...",
    reappliedOne: "Réglage réappliqué.",
    reappliedMany: "{count} réglages réappliqués.",
  },
  crashes: {
    title: "Fermetures inattendues",
    subtitle:
      "L'application s'est fermée toute seule. Le rapport reste sur ce PC : copiez-le et envoyez-le sur Discord ou GitHub si vous voulez que ce soit corrigé.",
    copy: "Copier le rapport",
    copied: "Rapport copié dans le presse-papiers.",
    clear: "Effacer",
    cleared: "Rapports effacés.",
    processApp: "fenêtre principale",
    processElevated: "opération avec droits admin",
  },
  ledger: {
    guardPaused: "Réglages des applications en pause",
    guardResumed: "Réglages des applications repris",
    processes: "Processus : {count}",
    restored: "Rétabli",
    postponed: "Reporté pendant qu'un jeu était en cours",
    title: "Registre des modifications",
    subtitle:
      "Tout ce que cette application a modifié sur ce PC, du plus récent au plus ancien. Conservé en local, jamais envoyé en ligne.",
    empty: "Aucune modification enregistrée. Appliquez votre premier réglage et il apparaîtra ici.",
    clear: "Effacer l'historique",
    clearing: "Effacement...",
    cleared: "Historique effacé.",
    revert: "Rétablir",
    elevated: "avec droits admin",
    failed: "échec",
    actions: {
      processGuard: "Jeu qui se gère seul",
      coreSteering: "Répartition des cœurs",
      ramTrim: "Nettoyage de la RAM",
      autoReverted: "Annulé automatiquement",
      priorityRule: "Règle de priorité",
      scheduledCleanup: "Nettoyage planifié",
      ecoqos: "Efficacité des applications en arrière-plan",
      applied: "Réglage appliqué",
      reverted: "Réglage rétabli",
      cleanup: "Nettoyage",
      filesDeleted: "Fichiers supprimés",
      diskOptimize: "Optimisation du disque",
      startupChange: "Modification du démarrage",
      restorePoint: "Point de restauration",
    },
  },
  tabs: {
    groupWorkspace: "Espace de travail",
    overview: "Vue d’ensemble",
    groupMonitor: "Surveiller",
    groupOptimize: "Optimiser",
    groupManage: "Gérer",
    scan: "Analyse",
    health: "Santé du PC",
    hardware: "Matériel",
    performance: "Performances",
    privacy: "Confidentialité",
    ui: "Interface",
    maintenance: "Entretien",
    gaming: "Gaming",
    startup: "Démarrage",
    profiles: "Profils",
    pricing: "Offres et tarifs",
    ledger: "Historique des modifications",
  },
  healthPanel: {
    title: "Score de santé",
    subtitle: "Un score explicable : chaque nombre montre les faits dont il est calculé.",
    why: "Pourquoi {score} ?",
    refresh: "Recalculer",
    compute: "Calculer le score",
    showMore: "Voir les détails",
    showLess: "Masquer les détails",
    stageProfile: "Lecture du profil système",
    stageTweaks: "Vérification des tweaks appliqués",
    stageSecurity: "Lecture de l'état de sécurité",
    stageScoring: "Calcul du score",
    verdictExcellent: "EXCELLENT",
    verdictGood: "BON",
    verdictFair: "CORRECT",
    verdictNeedsWork: "À AMÉLIORER",
    computing: "Analyse en cours...",
    idleHint:
      "Rien ne tourne en arrière-plan : le score n'est calculé que lorsque vous le demandez, entièrement sur ce PC.",
    changeSinceLast: "depuis votre dernier contrôle",
    changeNone: "Aucun changement depuis votre dernier contrôle.",
    changeFirstRun:
      "Première mesure enregistrée. Relancez-la après une modification pour voir ce qui a bougé.",
    changeWhyTitle: "Pourquoi le score a changé",
    changeContributes: "Contribution au score global :",
    changeStructural:
      "Une mise à jour de l'application a changé les catégories évaluées : une partie de cet écart ne vient pas de votre PC.",
    changeTrend: "Tendance",
    categories: {
      performance: "Performances",
      gaming: "Gaming",
      responsiveness: "Réactivité",
      memory: "Mémoire",
      storage: "Stockage",
      startup: "Démarrage",
      maintenance: "Maintenance",
      privacy: "Confidentialité",
      security: "Sécurité",
    },
  },
  transparency: {
    title: "Ce que cela modifie, exactement",
    key: "Clé",
    value: "Valeur",
    setsTo: "Définit sur",
    note: "L'ancienne valeur est sauvegardée avant l'écriture : la restauration la remet exactement telle qu'elle était.",
    kindRegistry: "Registre",
    kindCommand: "Commande",
    kindService: "Service",
    copy: "Copier",
    copied: "Copié",
  },
  command: {
    statusQuiet: "Tout est calme",
    statusScanning: "Analyse en cours...",
    statusFindings: "{count} recommandations prêtes",
    domainsLine: "Démarrage · Stockage · Mémoire · Confidentialité · Performances · Mises à jour",
    consent: "Rien ne change sans votre approbation.",
    runScan: "Lancer l'analyse du système",
    reviewFindings: "Voir {count} recommandations",
    memTitle: "Pression mémoire",
    pressureLow: "Faible",
    pressureElevated: "Élevée",
    pressureHigh: "Forte",
    memReview: "Examiner l'utilisation mémoire",
    memTopTitle: "Processus principaux",
    trimTitle: "Réduire les working sets",
    trimExplainer:
      "Demande au gestionnaire de mémoire de Windows de déplacer les pages inactives hors des working sets des applications. Utile en cas de forte pression ; les applications peuvent recharger brièvement des pages. Aucune donnée n'est perdue. Windows demande l'autorisation d'administrateur.",
    trimButton: "Réduire maintenant",
    autoTitle: "Réduction automatique",
    profilesTitle: "Profils de session",
    profileGame: "Session de jeu",
    profileGameDesc: "Prépare le PC pour jouer : énergie, priorité et capture DVR.",
    profileFocus: "Concentration",
    profileFocusDesc: "Moins de distractions, activité non essentielle maîtrisée.",
    profileQuiet: "Session silencieuse",
    profileQuietDesc: "Efficacité, batterie et bruit réduit d'abord.",
    profileDownload: "Session téléchargement",
    profileDownloadDesc: "Contrôle la bande passante et l'activité en arrière-plan.",
    previewBtn: "Aperçu des modifications",
    gameChange1: "Désactive Game DVR (capture en arrière-plan)",
    gameChange2: "Bascule sur le mode d'alimentation Performances élevées",
    gameChange3: "Optimise la priorité CPU pour les jeux (Win32PrioritySeparation)",
    previewReq: "Droits administrateur requis",
    previewCost: "Coût potentiel : consommation et chaleur accrues pendant l'activation.",
    previewRevert: "Réversible en un clic : chaque valeur d'origine est sauvegardée avant.",
    applySession: "Démarrer la session",
    restoreSession: "Restaurer",
    statusActive: "Active",
    statusOff: "Inactive",
    soon: "Bientôt",
  },
  systemMonitor: {
    cpu: "Processeur",
    ram: "Mémoire",
    disk: "Disque",
    uptime: "Allumé depuis",
    uptimeValue: "{hours} h {minutes} min",
    cores: "{count} cœurs",
  },
  startupManager: {
    title: "Programmes au démarrage",
    description:
      "Les programmes qui s'ouvrent tout seuls au démarrage du PC. En désactiver certains raccourcit le démarrage : le programme reste installé et vous pouvez toujours l'ouvrir manuellement.",
    empty: "Aucun programme configuré pour le démarrage automatique.",
    activeCount: "Actifs : {enabled} / {total}",
    machineWide: "Tous les utilisateurs",
    impactNote: "Désactiver ne désinstalle rien et reste réversible à tout moment.",
    refresh: "Actualiser",
    refreshing: "Nouvelle analyse...",
    hiddenOrphans: "{count} entrées masquées : le programme n'est plus installé.",
    locationRun: "Registre",
    locationRun32: "Registre (32 bits)",
    locationFolder: "Dossier Démarrage",
  },
  systemRepair: {
    title: "Vérification et réparation de Windows",
    description:
      "Vérifie que les fichiers système et le magasin de composants de Windows sont intacts et, si ce n'est pas le cas, les répare depuis les serveurs de Microsoft. Ce sont les outils DISM et SFC que le support Microsoft fait exécuter, sans ligne de commande.",
    adminNote:
      "Nécessite les droits administrateur : Windows les demande une seule fois, et un point de restauration est créé avant toute modification.",
    timeNote:
      "Une réparation complète peut prendre 20 minutes ou plus. Vous pouvez continuer à utiliser le PC : il suffit de ne pas l'éteindre.",
    checkButton: "Vérifier l'intégrité",
    checking: "Vérification...",
    cleanupButton: "Réduire le magasin de composants",
    cleaningUp: "Réduction...",
    cleanupNote:
      "Supprime du dossier WinSxS les versions de composants remplacées. Les mises à jour récentes restent désinstallables.",
    runningNote: "N'éteignez pas et ne redémarrez pas le PC pendant l'opération.",
    cannotStop:
      "Une fois lancée, l'opération ne peut pas être arrêtée : Windows vérifie et répare ses propres fichiers système, et l'interrompre en cours de route pourrait les laisser à moitié réparés. Vous pouvez continuer à utiliser votre PC et WinCraft en attendant.",
    stepQuick: "Lecture rapide de l'état",
    stepScan: "Analyse du magasin de composants",
    stepRestore: "Réparation du magasin de composants",
    stepSfc: "Vérification des fichiers système",
    stepCleanup: "Réduction du magasin de composants",
    stepOf: "Étape {index} sur {total}",
    statusHealthy: "Windows est intact",
    statusRepairable: "Dommages détectés, mais réparables",
    statusRepaired: "Dommages détectés et réparés",
    statusUnrepairable: "Dommages détectés qui n'ont pas pu être réparés",
    statusCompleted: "Terminé",
    hintUnrepairable:
      "L'étape suivante est en général une mise à niveau sur place de Windows. Le code d'erreur figure dans la sortie ci-dessous.",
    hintCompleted:
      "Les outils se sont exécutés. Avec la langue de votre Windows, le résultat n'a pas pu être lu automatiquement : les détails sont dans la sortie ci-dessous.",
    logTitle: "Sortie",
    askRepair: "Voulez-vous le réparer maintenant ?",
    askRepairYes: "Oui, réparer maintenant",
    askRepairNo: "Pas maintenant",
    repairAnyway: "Lancer quand même une réparation complète",
    elapsed: "{time} écoulées",
    holdingAt:
      "Toujours à {percent}% après {time}. DISM reste sur le même pourcentage plusieurs minutes pendant que Windows reconstruit les composants en arrière-plan : il n'est pas bloqué.",
    remaining: "~{minutes} min",
    underMinute: "< 1 min",
    estimating: "Estimation...",
    statElapsed: "Écoulé",
    statRemaining: "Restant",
    statFinish: "Fin prévue",
    waiting: "En attente",
  },
  cookieCleaner: {
    title: "Nettoyage sélectif des cookies",
    description:
      "Supprime les cookies de suivi et de publicité tout en conservant ceux qui maintiennent vos connexions. Vous restez connecté aux sites de votre liste.",
    scanButton: "Analyser les cookies",
    scanning: "Analyse...",
    cleanButton: "Nettoyer",
    cleaning: "Nettoyage...",
    noneFound: "Aucun cookie de navigateur trouvé sur ce PC.",
    totals: "{removable} à supprimer, {protected} cookies de connexion conservés",
    runningWarning: "Fermez {browser} pour le nettoyer. Les chiffres ci-dessus sont déjà exacts.",
    backupNote:
      "La base de cookies est copiée avant le nettoyage : l'opération est donc annulable.",
    restoreButton: "Annuler le dernier nettoyage",
    restoring: "Restauration...",
    restoredToast: "{browser} : cookies restaurés depuis la dernière sauvegarde.",
    cleanedToast: "{removed} cookies supprimés, {kept} connexions conservées.",
    nothingToClean: "Rien à supprimer : tous les cookies figurent dans votre liste.",
    topDomains: "La plupart des cookies viennent de",
    whitelistTitle: "Sites où rester connecté",
    whitelistNote:
      "Les sous-domaines sont couverts : ajouter google.com conserve aussi accounts.google.com.",
    whitelistPlaceholder: "exemple.com",
    whitelistAdd: "Ajouter",
    whitelistRemove: "Retirer",
    whitelistReset: "Rétablir les valeurs par défaut",
  },
  appCache: {
    title: "Caches des applications tierces",
    description:
      "Caches de shaders, lanceurs de jeux, messageries et gestionnaires de paquets conservent des gigaoctets de fichiers qu'ils reconstruisent seuls. Cette analyse les trouve dans les programmes réellement installés.",
    scanButton: "Analyser les caches",
    scanning: "Analyse...",
    cleanButton: "Nettoyer la sélection",
    cleaning: "Nettoyage...",
    noneFound: "Aucun cache tiers trouvé sur ce PC.",
    permanentNote:
      "Ces fichiers sont supprimés définitivement et non placés dans la Corbeille : y envoyer des gigaoctets ne libère rien tant qu'elle n'est pas vidée. Tout ce qui figure ici est reconstruit automatiquement par le programme qui l'a créé.",
    blockedBy: "{process} est en cours d'exécution : ses fichiers seront ignorés.",
    selectedTotal: "{size} sélectionnés",
    cleanedToast: "{freed} libérés.",
    skippedNote: "{count} fichiers étaient utilisés et ont été laissés intacts.",
    catShaders: "Caches de shaders",
    catLaunchers: "Lanceurs de jeux",
    catApps: "Applications",
    catDev: "Outils de développement",
    catWindows: "Windows",
    names: {
      shader_dx: "Cache de shaders DirectX",
      shader_nvidia: "Cache de shaders NVIDIA",
      shader_amd: "Cache de shaders AMD",
      shader_intel: "Cache de shaders Intel",
      steam: "Cache web de Steam",
      epic: "Cache d'Epic Games Launcher",
      battlenet: "Cache de Battle.net",
      discord: "Cache de Discord",
      vscode: "Cache de Visual Studio Code",
      npm: "Cache des paquets npm",
      pip: "Cache des paquets pip",
      crash_dumps: "Vidages de plantage des applications",
      error_reports: "Rapports d'erreurs Windows",
    },
  },
  scheduledTasks: {
    title: "Tâches planifiées au démarrage",
    description:
      "Programmes de mise à jour et services d'arrière-plan lancés à l'ouverture de session ou au démarrage par le Planificateur de tâches, où la liste Démarrage de Windows ne les montre pas. Les tâches de Windows ne figurent pas ici.",
    empty: "Aucune tâche tierce au démarrage sur ce PC.",
    activeCount: "Activées : {enabled} / {total}",
    triggerLogon: "À l'ouverture de session",
    triggerBoot: "Au démarrage",
    refresh: "Actualiser",
    refreshing: "Relecture...",
    note: "Désactiver une tâche ne désinstalle rien, et vous pouvez la réactiver à tout moment.",
  },
  search: {
    placeholder: "Rechercher une optimisation...",
    noResults: 'Aucun résultat pour "{query}".',
    clear: "Effacer",
  },
  pricing: {
    title: "Gratuit pour tous",
    intro:
      "WinCraft est gratuit et open source : tous les outils inclus, sans abonnement ni fonction payante.",
    planName: "Tout est inclus",
    planTagline: "Tous les outils, tous les réglages, toutes les fonctions : aucune restriction.",
    priceAmount: "$0",
    priceNote: "pour toujours",
    features: [
      "Tous les réglages et optimisations du système",
      "Outils avancés de gaming et de confidentialité",
      "Nettoyage du disque, défragmentation et réparation du système",
      "Mises à jour des pilotes et diagnostic matériel",
      "Game Sessions et profils de surveillance",
      "Purge mémoire Zero-Trace et destruction sécurisée des fichiers",
      "Toutes les mises à jour futures incluses",
    ],
    commitmentTitle: "Notre engagement",
    commitmentBody:
      "WinCraft est et restera gratuit. Chacun doit pouvoir utiliser des outils qui aident à comprendre et à optimiser son PC : aucun coût caché, aucune fonction verrouillée, aucun abonnement.",
  },
  toggle: { on: "Activé", off: "Désactivé" },
  driverBooster: {
    title: "Driver Booster",
    subtitle:
      "Sélectionnez les pilotes qui prennent de l’âge et ouvrez toutes leurs pages de téléchargement d’un coup.",
    scan: "Analyser les pilotes",
    scanning: "Analyse...",
    selectAll: "Tout sélectionner",
    selectNone: "Tout désélectionner",
    selectedCount: "{selected} sur {total} sélectionnés",
    pagesForSelection: "{pages} pages à ouvrir",
    openSelected: "Ouvrir les pages de téléchargement ({count})",
    opened: "{count} pages ouvertes",
    openedCapped:
      "{opened} pages ouvertes sur {total} : les autres restent sélectionnées, relancez pour les ouvrir.",
    allCurrent: "Aucun pilote ne montre son âge.",
    nothingActionable: "Aucun pilote vieillissant n’a de page constructeur à ouvrir.",
    note: "WinCraft ne télécharge pas les pilotes lui-même : aucune API constructeur ne dit quelle version convient à votre appareil exact, et installer le mauvais pilote graphique est l’une des rares erreurs qui peut vous laisser sans écran. Ceci automatise la partie fastidieuse — trouver les pages — pas le choix. Pour les pilotes que Windows Update connaît vraiment, utilisez le bouton ci-dessus.",
  },
  secureDefrag: {
    title: "Défragmentation sécurisée",
    willDefrag: "Ce disque est mécanique : une véritable défragmentation sera lancée.",
    willRetrim:
      "Ce disque n’est pas confirmé mécanique : le volume entier est analysé, puis un retrim est lancé au lieu d’une défragmentation. Le retrim dure quelques secondes et ne concerne que l’espace libre — c’est son rôle : indiquer au contrôleur quels blocs ne servent plus. Défragmenter un SSD ne l’accélère pas, cela l’use.",
    start: "Démarrer",
    running: "En cours...",
    working: "Traitement...",
    phaseAnalyze: "Analyse",
    phaseOptimize: "Optimisation",
    analysisTitle: "Rapport d’analyse",
    doneDefrag: "Défragmentation terminée.",
    doneRetrim: "Retrim terminé.",
    note: "Un point de restauration est créé avant. Le pourcentage vient de Windows lui-même, pas d’un minuteur.",
  },
  zeroTrace: {
    title: "Zero-Trace Cleaner",
    subtitle:
      "Efface ce que les programmes fermés laissent en mémoire et détruit les fichiers sans retour possible.",
    purgeTitle: "Purge mémoire",
    purgeBody:
      "Windows conserve en RAM les pages des programmes fermés, en cache. Ceci les libère : les fragments laissés par un processus terminé disparaissent réellement de la mémoire physique.",
    purgeButton: "Purger la mémoire",
    purging: "Purge...",
    purgeResult: "{freed} Mo libérés — {after} Mo libres maintenant",
    purgeLimit:
      "Cela ne touche ni le fichier d’échange ni celui d’hibernation : ils sont sur le disque et Windows n’offre aucune API pour les nettoyer à chaud.",
    shredTitle: "Destruction sécurisée de fichiers",
    shredBody:
      "Écrase le contenu du fichier en trois passes avant de le supprimer, le mettant hors de portée des outils de récupération courants.",
    shredButton: "Choisir des fichiers...",
    shredding: "Destruction...",
    shredDone: "{count} fichiers détruits ({size})",
    shredSummary: "{shredded} détruits, {skipped} ignorés",
    shredWarning: "Définitif : pas de Corbeille, aucune récupération.",
    ssdCaveat:
      "Sur un SSD, le nivellement d’usure écrit presque toujours sur d’autres cellules que l’original. Les anciennes sont libérées, pas réécrites — seul l’effacement sécurisé du disque peut garantir davantage.",
  },
  hud: {
    title: "Overlay de jeu",
    subtitle:
      "Un panneau transparent au-dessus du jeu : charge CPU/GPU, températures, VRAM, processus actif avec sa priorité, et indicateur de goulot d’étranglement.",
    fpsAbout:
      "Les FPS sont comptés à partir des événements de présentation que Windows émet à chaque image — la source que lit PresentMon, sans rien accrocher au jeu. Nécessite un lancement en administrateur, car ouvrir une session de traçage est une opération privilégiée.",
    fpsLowExplained:
      "À côté de la moyenne s’affiche DROP : la vitesse du pire pour cent des images, ce qu’ailleurs on appelle le « 1% low ». C’est le chiffre qui bouge quand le jeu saccade, alors que la moyenne reste haute et n’en dit rien. Plus DROP est proche de la moyenne, plus le jeu est fluide.",
    fpsStart: "Mesurer les FPS",
    fpsStop: "Arrêter la mesure",
    fpsNeedsAdmin: "Mesurer les FPS demande de lancer WinCraft en tant qu’administrateur.",
    fpsRunning:
      "Mesure en cours : les FPS apparaissent dans l’overlay dès qu’un jeu commence à dessiner.",
    show: "Afficher",
    hide: "Masquer",
    lock: "Verrouiller",
    unlock: "Déverrouiller",
    dragHint:
      "Faites glisser l’overlay où vous voulez, puis verrouillez-le avant de lancer le jeu.",
    lockedHint:
      "Verrouillé : les clics le traversent et atteignent le jeu. Déverrouillez-le pour le déplacer.",
    sizeCompact: "Compact",
    sizeNormal: "Normal",
  },
  updater: {
    title: "Mise à jour disponible : v{version}",
    body: "Téléchargée et installée en une seule étape ; l'application redémarre toute seule à la fin.",
    install: "Installer et redémarrer",
    later: "Plus tard",
    downloading: "Téléchargement... {percent}%",
    installing: "Installation...",
    error: "Échec de la mise à jour : {message}",
    checkFailed: "Échec de la vérification des mises à jour : {message}",
  },
  badges: { admin: "Admin", soon: "BIENTÔT" },
  emptyCategory: "Aucune optimisation disponible dans cette catégorie pour l'instant — à venir.",
  gameSessions: {
    title: "Game Sessions",
    subtitle:
      "Détecte automatiquement vos jeux et applique/annule le préréglage Turbo Gaming tout seul.",
    active: "Session active : {name}",
    gamesCount: "{count} jeux enregistrés",
    addGame: "+ Ajouter un jeu (.exe)",
    steeringTitle: "Répartition des cœurs",
    steeringVcache:
      "Le jeu tourne sur le die 3D V-Cache ({count} threads). Les autres applications restent là où Windows les place.",
    steeringHybrid:
      "Le jeu tourne sur les cœurs performants ({game} threads) et les autres applications de votre session passent sur les cœurs économes ({background} threads). Les applications dont vous avez relevé la priorité au-dessus de la normale ne sont pas touchées.",
    steeringActive: "{count} processus répartis pour ce jeu.",
    steeringNone:
      "Rien à répartir sur ce processeur : aucun type de cœur plus rapide ni aucun cache plus grand que les autres n'a été trouvé.",
    steeringActiveVcache: "Le jeu tourne sur le die V-Cache.",
    steeringNeedsSessions:
      "Ne fonctionne que lorsque Game Sessions est activé et qu'un de vos jeux est lancé.",
  },
  latencyTrace: {
    title: "Latence des DPC et des interruptions",
    subtitle:
      "Mesure la durée des appels de procédure différés (DPC) et des routines de service d'interruption (ISR) de chaque pilote, lue directement dans le noyau Windows. Ne modifie rien ; nécessite les droits administrateur.",
    duration: "Durée",
    secondsOption: "{seconds} s",
    run: "Mesurer",
    running: "Mesure pendant {seconds} s…",
    dpcSummary:
      "DPC la plus longue : {max} ms (limite {limit} ms). {over} sur {count} ont dépassé la limite.",
    isrSummary:
      "Routine d'interruption la plus longue : {max} ms (limite {limit} ms). {over} sur {count} ont dépassé la limite.",
    colDriver: "Pilote",
    colDpc: "DPC la plus longue",
    colIsr: "Interruption la plus longue",
    colOver: "Au-delà de la limite",
    unattributed: "Non attribué",
    hidden:
      "Windows a masqué les adresses des pilotes : les routines n'ont pas pu être attribuées.",
    verdictGood: "Aucun pilote n'a dépassé les limites de Microsoft pendant cette mesure.",
    note: "Recommandation de Microsoft : une DPC doit se terminer en moins de 0,1 ms et une ISR en moins de 0,025 ms. dxgkrnl.sys distribue les interruptions d'affichage, son temps revient donc souvent au pilote graphique.",
    verdictBad:
      "{driver} a monopolisé un processeur pendant {max} ms d'affilée. Au-delà d'une milliseconde, ces blocages peuvent provoquer des craquements audio et des saccades d'images ; mettre à jour ce pilote ou revenir à la version précédente règle généralement le problème.",
    verdictMinor:
      "{over} routines ont dépassé la recommandation de Microsoft ; la plus longue a duré {max} ms. Des dépassements aussi courts sont fréquents et rarement audibles.",
    lost: "Windows a perdu {events} événements et {buffers} tampons pendant la mesure : les durées maximales affichées sont un minimum.",
    verdictBadUnattributed:
      "Une routine qui n'a pu être attribuée à aucun pilote a monopolisé un processeur pendant {max} ms d'affilée. Au-delà d'une milliseconde, ces blocages peuvent provoquer des craquements audio et des saccades d'images.",
    spikesTitle: "Routines les plus longues",
    spikeLine: "{kind} de {duration} ms dans {driver}, à {at} s du début",
  },
  networkCheck: {
    title: "Vérification réseau",
    subtitle:
      "Envoie 32 pings à 1.1.1.1 et ouvre une connexion TCP, puis indique ce que fait réellement la pile réseau de Windows. Ne modifie rien.",
    run: "Vérifier",
    running: "Vérification…",
    offline: "Aucune connexion à Internet.",
    rtt: "Aller-retour : médiane {median} ms (min {min}, max {max})",
    jitter: "Gigue : {jitter} ms",
    loss: "Réponses : {received} sur {sent}",
    tcpRtt: "Aller-retour selon la pile TCP : {rtt} ms",
    nagleOn:
      "Les nouvelles connexions démarrent avec l'algorithme de Nagle actif (TCP_NODELAY désactivé). Les applications qui ont besoin de le couper le font sur leurs propres sockets.",
    nagleOff: "Les nouvelles connexions démarrent avec l'algorithme de Nagle désactivé.",
    buffers:
      "Tampon de réception : {reserved} réservés par socket, {autotuned} ajustés automatiquement par Windows",
    verdictNone:
      "Un ping ne passe pas par les réglages TCP, donc ces mesures décrivent la connexion elle-même.",
    verdictInconclusive: "Trop peu de réponses pour comparer.",
    verdictLineChanged:
      "La ligne elle-même a changé entre les deux mesures (médiane {delta} ms). Un ping ne passe pas par les réglages TCP : ce n'est donc pas l'effet de la modification.",
    lastTitle: "Après {tweak}, {time}",
    socketsBeforeAfter:
      "Nouveaux sockets, avant → après : Nagle {nagleBefore} → {nagleAfter}, tampon de réception {bufBefore} → {bufAfter}",
    stateOn: "actif",
    stateOff: "désactivé",
  },
  turboBoost: {
    title: "Turbo Boost",
    subtitle:
      "Modifie le mode boost et l'état minimal du processeur. La consommation et la chaleur peuvent augmenter ; les résultats dépendent de la charge de travail.",
    startLabel: "Démarrer",
    stopLabel: "Arrêter",
    activating: "Activation du turbo...",
    deactivating: "Restauration...",
    active: "Turbo actif",
    inactive: "Turbo inactif",
    loadLabel: "CHARGE CPU",
    loadCadence: "Mesurée chaque seconde, lissée sur environ 3 secondes",
    ownLoad: "Ces dernières secondes : WinCraft lui-même {own} % · tout le reste {rest} %",
    stageReading: "Lecture du mode d'alimentation",
    stageRaising: "Augmentation de la limite de boost",
    stageApplying: "Application au système",
    stageMeasuringBefore: "Mesure avant",
    stageMeasuringAfter: "Nouvelle mesure",
    factAverage: "Vitesse moyenne actuelle",
    factFastest: "Cœur le plus rapide",
    factPeak: "Maximum de cette session",
    factFloor: "État minimal du processeur",
    ofBase: "{pct} % de la fréquence de base",
    usersTitle: "Qui utilise le processeur",
    appliedAt:
      "Activé le {time} · mode boost Agressif, état minimal du processeur à 100 % sur secteur",
    planAlreadyUses: "Le mode de gestion de l'alimentation actuel utilise déjà ces réglages.",
    planAlreadyHad:
      "Le mode de gestion de l'alimentation actuel avait déjà ces réglages, donc aucune valeur n'a changé.",
    loadExplain:
      "La charge indique le travail du processeur ; Turbo Boost change la vitesse à laquelle il peut tourner, pas son occupation. Une valeur élevée signifie que des programmes travaillent sur ce PC en ce moment.",
    chartLoad: "Charge",
    chartSpeed: "Vitesse",
    testTitle: "Même test dans chaque mode",
    testHint:
      "Une charge fixe de 3 secondes. Lancez-la une fois dans chaque mode pour voir ce que le boost change.",
    testRun: "Lancer le test de 3 secondes",
    testRunning: "Test en cours…",
    colDefault: "Par défaut",
    colBoost: "Boost",
    rowWork: "Travail effectué",
    rowAvg: "Vitesse moyenne",
    rowPeak: "Vitesse maximale",
    rowTemp: "Température du processeur",
    notRun: "Pas encore lancé",
    relative: "{pct} % du mode par défaut",
  },
  profiles: {
    title: "Vos profils",
    subtitle:
      "Enregistrez vos réglages actifs dans un profil. Réutilisez une configuration ou exportez-la vers un autre PC.",
    saveHeading: "Enregistrer les réglages actifs",
    namePlaceholder: "Nom (ex. Gaming)",
    saveButton: "Enregistrer",
    savedHeading: "Profils enregistrés",
    empty: "Aucun profil enregistré.",
    tweakCount: "{count} réglages",
    apply: "Appliquer",
    applying: "Application...",
    exportButton: "Exporter",
    importButton: "Importer un fichier",
    deleteButton: "Supprimer",
    savedToast: 'Configuration "{name}" enregistree',
    appliedToast: "{count} reglages appliques",
    exportedToast: "Fichier exporte",
    importedToast: "Importee : {count} reglages a verifier",
    droppedWarning: "{count} entrées non reconnues par cette version ont été ignorées",
    nameRequired: "Donnez un nom a la configuration",
    reviewNotice:
      "Une configuration importee n'est jamais appliquee toute seule : vous la verifiez d'abord.",
    signInRequired: "Connectez-vous ou creez un compte pour enregistrer des configurations.",
  },
  scan: {
    lastScan: "Dernière analyse : {time}",
    neverScanned: "Aucune analyse terminée",
    extraChecks: "Vérifications supplémentaires",
    checksHint:
      "Lectures du système uniquement : aucune modification automatique. Développez une catégorie pour voir les détails.",
    unavailable: "Vérification indisponible",
    startupSummary: "{enabled} actifs · {orphaned} cibles manquantes",
    tasksSummary: "{enabled} tâches de démarrage actives",
    partialScan: "Résultats partiels : certaines vérifications sont indisponibles.",
    scanFailed: "Échec de l’analyse. Réessayez.",
    title: "Analyse rapide",
    subtitle:
      "Vérifie l'état de votre PC et trouve les optimisations pas encore actives, en un clic.",
    startLabel: "SCAN",
    stepPerformance: "Performances",
    stepPrivacy: "Confidentialité",
    stepGaming: "Gaming",
    stepJunk: "Fichiers temporaires",
    allGood: "Tout est en ordre — aucun problème trouvé.",
    issuesFound: "{count} optimisations disponibles",
    selectAll: "Tout sélectionner",
    deselectAll: "Tout désélectionner",
    fixAll: "Tout corriger",
    fixing: "Correction {done}/{total}...",
    fixedToast: "{count} problèmes corrigés.",
    scanAgain: "Analyser à nouveau",
    verdictRecommended: "Recommandé sur ce PC",
    verdictNotRecommended: "Déconseillé sur ce PC",
    verdictUnsupported: "Non pris en charge",
    reasons: {
      laptop_battery: "ce PC est un portable : cela coûte plus d'autonomie que cela n'apporte",
      hdd_index_cost:
        "le disque système est mécanique, l'indexation en arrière-plan se ressent vraiment",
      fast_disk_no_gain:
        "le disque système est en NVMe, assez rapide pour rendre le gain négligeable",
      needs_win10_2004: "nécessite Windows 10 version 2004 ou ultérieure",
      weak_gpu: "graphiques intégrés : la transparence leur coûte des performances utiles",
    },
    thisPc: "Ce PC",
    dashDrivesTitle: "Stockage",
    dashFreeOf: "{free} libres sur {total}",
    dashAlmostFull: "Presque plein",
    dashStartupTitle: "Applis au démarrage",
    dashStartupCount: "{on} actives sur {total}",
    dashManage: "Gérer",
    dashUptimeTitle: "Allumé depuis",
    dashUptimeDh: "{days}j {hours}h",
    dashUptimeHm: "{hours}h {minutes}min",
    dashUptimeLongHint:
      "Ce PC n'a pas redémarré depuis un moment. Un redémarrage applique les mises à jour en attente et libère la mémoire retenue.",
    dashHistoryTitle: "Actions récentes",
    dashHistoryEmpty: "Rien pour l'instant. Vos actions apparaîtront ici.",
    dashActTweakApplied: "Tweak appliqué",
    dashActTweakReverted: "Tweak annulé",
    dashActCleanup: "Nettoyage",
    dashActFilesDeleted: "Fichiers supprimés",
    dashActStartupChange: "Démarrage modifié",
    dashActDiskOptimize: "Disque optimisé",
    dashActRestorePoint: "Point de restauration",
    profileUnknown: "Non detecte",
    diskHdd: "HDD",
    diskSsd: "SSD",
    diskNvme: "NVMe",
    formDesktop: "Ordinateur de bureau",
    formLaptop: "Portable",
    groupRecommended: "Recommande pour ce PC",
    groupOptional: "Facultatif",
    groupNotRecommended: "Deconseille ici",
    tailoredNote:
      "Chaque element est evalue selon le materiel ci-dessus, pas selon une liste figee.",
    fixRecommended: "Appliquer les {count} recommandees",
    fixEverything: "Appliquer la selection ({count})",
    nothingSelected: "Rien de selectionne",
    foundHeadline: "{count} a corriger sur ce PC",
    foundNone: "Rien a corriger",
    doneTitle: "Terminé !",
    doneBody: "{count} optimisations appliquées. Votre PC est prêt.",
    fixHeading: "Prêtes à appliquer",
  },
  ram: {
    autoNeedsAdmin:
      "Le nettoyage automatique ne fonctionne que lorsque WinCraft dispose des droits d'administrateur.",
    title: "Libérer la RAM",
    subtitle:
      "Demande à Windows de libérer la mémoire que les programmes occupent sans l'utiliser. Windows demande chaque fois l'autorisation d'administrateur, et le nettoyage attend si un jeu est en cours.",
    button: "Libérer maintenant",
    cleaning: "Nettoyage en cours...",
    freed: "{amount} libérés",
    freedNothing: "La mémoire était déjà optimisée",
    inUse: "{used} sur {total} utilises",
    autoLabel: "Nettoyage automatique",
    autoOff: "Désactivé",
    autoEvery: "Toutes les {interval}",
    autoHint:
      "Avec le nettoyage automatique, WinCraft libère la RAM tout seul à intervalle régulier. Il ne peut le faire que lorsqu'il s'exécute en tant qu'administrateur : Windows demande l'autorisation pour chaque nettoyage, et un nettoyage programmé ne peut pas la demander.",
    autoPausedNotAdmin:
      "En pause : WinCraft ne s'exécute pas en tant qu'administrateur, le nettoyage automatique ne peut donc pas se lancer. Pour l'utiliser, fermez WinCraft et rouvrez-le avec « Exécuter en tant qu'administrateur ». Le nettoyage manuel fonctionne toujours : Windows demande l'autorisation à chaque fois.",
    autoNext: "Prochain nettoyage à {time}",
    autoDue: "Nettoyage imminent...",
    autoLast: "Dernier à {time} : {amount} libérés",
    autoNoneYet: "Aucun nettoyage automatique n'a encore eu lieu.",
    autoFailed: "La dernière tentative a échoué : {detail}",
  },
  restore: {
    button: "Restaurer les réglages actifs",
    title: "Restaurer les réglages actifs ?",
    body: "Restaure {count} réglages à partir des valeurs enregistrées. Les outils configurables ont leurs propres commandes de restauration.",
    confirm: "Restaurer les réglages",
    cancel: "Annuler",
    running: "Restauration...",
    doneToast: "{count} optimisations restaurées.",
    nothingToast: "Il n'y a rien à restaurer.",
  },
  passwordCheck: {
    title: "Vérification des fuites de mot de passe",
    description:
      "Vérifie si un mot de passe est apparu dans une fuite de données connue, sans jamais l'envoyer en entier : seul un fragment de son hash est envoyé (k-anonymat, la norme utilisée par Have I Been Pwned).",
    placeholder: "Collez un mot de passe à vérifier",
    button: "Vérifier",
    checking: "Vérification...",
    safe: "Introuvable dans une fuite connue. Bon signe.",
    breached:
      "Trouvé dans {count} fuites connues. Changez-le immédiatement, partout où vous l'utilisez.",
    error: "Impossible de vérifier pour le moment : vérifiez votre connexion et réessayez.",
  },
  cleanupConfirm: {
    previewLoading: "Calcul de ce qui sera déplacé vers la Corbeille...",
    previewEmpty: "Rien à nettoyer : le dossier est déjà vide.",
    previewNotAccessible:
      "Le contenu ne peut pas être lu sans droits d'administrateur ; le processus autorisé le listera et le supprimera.",
    previewTruncated: "Affichage des 500 éléments les plus volumineux ; les totaux incluent tout.",
    selectedSummary: "{count} éléments sélectionnés · {size}",
    confirmSelected: "Nettoyer la sélection",
    title: "Confirmer le nettoyage ?",
    body: "« {name} » déplacera les fichiers correspondants vers la Corbeille de Windows. Vous pourrez les récupérer tant qu'elle n'est pas vidée.",
    confirm: "Déplacer vers la Corbeille",
    cancel: "Annuler",
  },
  cleanupButton: "Nettoyer",
  cleanupRunning: "...",
  cleanupResultToast: "{deleted} éléments déplacés vers la Corbeille, {freed} libérés",
  cleanupResultToastSkipped: " ({skipped} en cours d'utilisation, ignorés).",
  diskOptimize: {
    title: "Optimiser le disque",
    description:
      "Lance l'optimiseur integre de Windows : defragmentation sur un HDD, ou TRIM sur un SSD (jamais une defragmentation complete, qui ne ferait que l'user inutilement).",
    button: "Optimiser maintenant",
    running: "Optimisation en cours... cela peut prendre quelques minutes",
    cannotStop:
      "C'est l'optimiseur de lecteurs de Windows qui s'en charge, avec les droits d'administrateur : il va jusqu'au bout tout seul et ne peut pas être arrêté d'ici. Vous pouvez continuer à travailler sans risque.",
    resultToast: "Disque ({media}) optimise avec succes.",
  },
  dnsFlush: {
    title: "Vider le cache DNS",
    description:
      "Efface les adresses DNS mises en cache. Utile si un site a changé de serveur et que votre navigateur continue d'afficher l'ancienne version.",
    button: "Vider maintenant",
    running: "Vidage...",
    resultToast: "Cache DNS vidé.",
  },
  browserCleanup: {
    title: "Nettoyage du navigateur",
    description:
      "Vide le cache et les cookies de Chrome, Edge et Firefox. Le navigateur les reconstruit tout seul au prochain démarrage, rien n'est perdu pour de bon.",
    noneFound: "Aucun navigateur pris en charge trouvé sur ce PC.",
    cache: "Cache",
    cookies: "Cookies",
    clearButton: "Vider",
    clearing: "Vidage...",
    runningWarning: "Fermez {browser} pour le vider.",
    clearedToast: "{browser} : {freed} libérés.",
  },
  tweakyDriverPromo: {
    title: "Tweaky Driver",
    description:
      "Recherchez des pilotes auprès des sources prises en charge dans notre application dédiée. Vérifiez la compatibilité avant installation. Application distincte ; couverture variable.",
    button: "Découvrir Tweaky Driver",
    error: "Impossible d’ouvrir la page. Réessayez.",
  },
  redaxaPromo: {
    title: "Redaxa",
    description:
      "Vous avez coupé télémétrie et pistage — mais que collez-vous dans les chats IA ? Redaxa intercepte données personnelles et identifiants avant qu'un prompt n'atteigne un modèle. Même famille, même règle : rien n'est conservé.",
    button: "Essayer sur le web",
  },
  uninstallerPromo: {
    title: "WinCraft Uninstaller",
    description:
      "Supprimez des programmes entiers en toute sécurité : point de restauration automatique, commande vérifiée, rapport honnête. De la même famille que WinCraft.",
    button: "Télécharger",
    confirmTitle: "Télécharger le désinstalleur ?",
    confirmBody:
      "WinCraft Uninstaller est une application distincte de la même suite, et elle se connecte avec le même compte que celle-ci. Le téléchargement récupère l'installeur (environ 4 Mo) directement depuis sa version GitHub, pour Windows 10 et 11 en 64 bits.",
    confirmUnsigned:
      "WinCraft Uninstaller est signé numériquement par Aurelio Avila. Vérifiez l'éditeur et la signature dans les propriétés du fichier. SmartScreen peut encore afficher un avertissement.",
    confirmDownload: "Télécharger",
    confirmOpenPage: "Ouvrir plutôt la page",
    cancel: "Annuler",
  },
  live: {
    title: "En ce moment",
    subtitle:
      "Mis à jour chaque seconde tant que cette page est ouverte et que WinCraft est au premier plan. Rien n'est mesuré en arrière-plan.",
    paused: "En pause",
    pausedHint: "En pause tant que WinCraft est en arrière-plan. Reprise dès votre retour.",
    measuring: "Mesure…",
    smooth: "Tout est fluide",
    busy: "Occupé",
    strained: "Forte charge",
    verdictDetail:
      "Processeur à {cpu} % sur les 10 dernières secondes · mémoire utilisée à {ram} %",
    failed: "Les mesures en direct ne sont pas disponibles pour le moment.",
    cpu: "Processeur",
    speed: "{ghz} GHz",
    cores: "{count} processeurs logiques",
    core: "Processeur {n}",
    memory: "Mémoire",
    used: "Utilisée",
    cached: "En cache",
    free: "Libre",
    total: "Total",
    cachedHint: "La mémoire en cache est rendue dès qu'un programme en a besoin.",
    notAvailable: "Non disponible sur ce PC",
    disk: "Activité du disque",
    read: "Lecture",
    write: "Écriture",
    systemDrive: "Lecteur système : {used} utilisés sur {total}",
    network: "Réseau",
    down: "Téléchargement",
    up: "Envoi",
    gpu: "Graphismes",
    gpuLoad: "Charge",
    temp: "Température",
    fan: "Ventilateur",
    vram: "Mémoire vidéo",
    sensors: "Températures et ventilateurs",
    sensorsHint:
      "Sur ce PC, Windows n'expose pas ces capteurs sans les outils du fabricant : rien n'est donc deviné.",
    now: "maintenant",
    secondsAgo: "il y a {s} s",
    activity: "Activité",
    zoomShort: "1 min",
    zoomLong: "5 min",
    minutesAgo: "il y a {n} min",
    peak: "Pic {value}",
    insightRecovering:
      "Le processeur redescend : il tournait au-dessus de 75 % en moyenne et la dernière mesure est de {pct} %.",
    insightCalm: "Tout est calme. Rien ne demande votre attention pour le moment.",
    insightMemory:
      "La mémoire est très sollicitée ({pct} %). Fermez les applications inutilisées ou vérifiez ce qui démarre avec Windows.",
    insightCpu:
      "Le processeur est occupé depuis un moment ({pct} % en moyenne). La liste ci-dessous montre ce qui l'utilise.",
    insightDrive:
      "Le lecteur système est presque plein ({pct} %). Windows ralentit quand l'espace vient à manquer.",
    actionStartup: "Ouvrir Démarrage",
    actionCleanup: "Libérer de l'espace",
    usingTitle: "Ce qui utilise les ressources",
    usingHint:
      "Applications regroupées par nom, à partir de la liste des processus de Windows. Rien n'est ouvert ni modifié.",
    usingCpu: "Processeur",
    usingMemory: "Mémoire",
    processes: "{count} processus",
    processOne: "1 processus",
  },
  pageError: {
    title: "Cette page a rencontré un problème",
    body: "Le reste de WinCraft fonctionne toujours, et cette erreur n'a rien modifié sur votre PC. Rechargez la page pour réessayer.",
    reload: "Recharger la page",
    reloadApp: "Recharger WinCraft",
    details: "Détails techniques",
    appTitle: "WinCraft a rencontré un problème",
    appBody: "Cette erreur n'a rien modifié sur votre PC. Rechargez WinCraft pour continuer.",
  },
  folderScan: {
    stop: "Arrêter la recherche",
    stopping: "Arrêt…",
    stoppedEmpty: "Recherche arrêtée. Aucun fichier n'a été déplacé ni supprimé.",
    stoppedPartial:
      "Recherche arrêtée. Voici les résultats trouvés avant l'arrêt ; ce qui n'avait pas encore été atteint n'a pas été vérifié.",
  },
  largeFiles: {
    title: "Trouver les gros fichiers",
    description:
      "Recherche dans un dossier les fichiers les plus volumineux (plus de 100 Mo), pour libérer rapidement de l'espace en supprimant ceux dont vous n'avez plus besoin.",
    chooseFolder: "Choisir un dossier",
    scanning: "Recherche en cours...",
    noneFound: "Aucun fichier de plus de {size} trouve.",
    foundCount: "{count} fichiers trouves",
    moveSelected: "Mettre {count} elements a la corbeille",
    deleting: "Mise a la corbeille...",
    deletedToast: "{count} fichiers mis a la corbeille, {freed} liberes.",
  },
  diskHealth: {
    title: "Sante du disque",
    freeSpace: "{size} libres",
    selectDrive: "Disque",
    healthy: "Bon etat",
    warning: "Avertissement",
    unhealthy: "Mauvais etat",
    unknown: "Inconnu",
    loading: "Verification...",
  },
  duplicateFinder: {
    title: "Trouver les fichiers en double",
    description:
      "Choisissez un dossier : repère les fichiers identiques et laisse choisir lesquels déplacer vers la Corbeille.",
    chooseFolder: "Choisir un dossier",
    scanning: "Analyse...",
    noneFound: "Aucun fichier en double trouvé dans ce dossier.",
    copies: "{count} copies · {size} chacune",
    moveSelected: "Déplacer vers la Corbeille ({count} sélectionnés)",
    deleting: "...",
    deletedToast: "{count} fichiers déplacés vers la Corbeille ({freed} libérés).",
  },
  ipMask: {
    title: "Masquer l'IP (VPN)",
    description:
      "Masque votre adresse IP en routant le trafic via un serveur VPN. Nécessite un service VPN externe : pas encore intégré dans cette version.",
    button: "En savoir plus",
    explainerToast:
      "Le masquage d'IP réel nécessite un backend VPN dédié (serveur + protocole). Ce n'est pas encore connecté : ceci n'est qu'un aperçu de la fonction.",
  },
  toasts: {
    applied: "« {name} » appliqué.",
    rolledBack: "« {name} » restauré à sa valeur d'origine.",
    elevationDeclined:
      "L'autorisation administrateur n'a pas été accordée, donc rien n'a été modifié.",
    accountRefreshFailed:
      "Impossible de vérifier l'état de votre compte. Les informations affichées ici peuvent être obsolètes — vérifiez votre connexion ou réessayez plus tard.",
  },
  titlebar: {
    applied: "{applied}/{total} actifs",
    cpu: "Processeur",
    ram: "Mémoire",
    minimize: "Réduire",
    maximize: "Agrandir",
    restore: "Restaurer",
    close: "Fermer",
  },
  x3d: {
    title: "Aligneur de die 3D V-Cache",
    subtitle:
      "Sur les processeurs compatibles dont les puces ont des caches L3 de tailles différentes, limite un processus en cours à la puce dotée du plus grand cache. Ce choix remplace la planification automatique pour ce processus et peut améliorer ou dégrader les performances.",
    cpuLabel: "Processeur",
    readyHeadline: "Die V-Cache trouvé : {cores} threads",
    readyBody:
      "Épinglez un jeu sur ce die et tous ses threads restent là où le cache est le plus grand.",
    singleDie:
      "Ce processeur n'a qu'un seul die : tous les cœurs voient déjà le même cache, il n'y a donc rien à aligner. La fonction apparaît d'elle-même sur un processeur à deux dies au cache asymétrique.",
    uniformCache:
      "Ce processeur a plusieurs dies, tous avec la même quantité de cache. Déplacer un jeu de l'un à l'autre ne changerait rien, la fonction reste donc désactivée.",
    unavailable: "Windows n'a pas renvoyé de carte des caches pour ce processeur.",
    dieLabel: "Die {index}",
    dieCache: "{mb} Mo L3",
    dieThreads: "{count} threads",
    vcacheBadge: "V-Cache",
    processesTitle: "Processus en cours",
    processesHint: "Les plus actifs en tête. Choisissez le jeu et épinglez-le sur le die du cache.",
    refresh: "Actualiser",
    refreshing: "Lecture...",
    align: "Aligner",
    reset: "Réinitialiser",
    alignedBadge: "Aligné",
    noProcesses: "Aucun processus assez important à lister.",
    persistenceNote:
      "L'affinité appartient au processus en cours : elle disparaît à la fermeture du jeu et doit être refaite au lancement suivant. Aucun réglage système n'est modifié.",
    alignedToast: "{name} épinglé sur le die V-Cache.",
    resetToast: "{name} rendu à tous les cœurs.",
  },
  hardware: {
    intro:
      "Lu directement sur les capteurs de votre matériel. Là où un capteur n'existe pas, nous le disons, au lieu d'afficher un chiffre que personne ne peut vérifier.",
    gpuLabel: "Carte graphique",
    cpuLabel: "Processeur",
    liveBadge: "En direct",
    gpuDriver: "Pilote {version}",
    load: "Utilisation GPU",
    vram: "Mémoire vidéo",
    fan: "Ventilateur",
    power: "Consommation",
    fanIdle: "à l'arrêt : inutile sous 50°",
    powerLimit: "limite {limit} W",
    tempCool: "fraîche",
    tempGood: "optimale",
    tempWarm: "chaude",
    tempHot: "très chaude",
    traceLabel: "Cette session",
    traceRange: "min {min}° · max {max}°",
    noTempSensor: "Cette carte n'expose aucun capteur de température.",
    cpuAcpiSource: "lue depuis la zone thermique ACPI",
    cpuNoSensor:
      "Température du processeur indisponible : le firmware ne fournit aucune zone thermique ACPI. WinCraft affiche uniquement les mesures disponibles via Windows.",
    noGpuTool:
      "Aucune carte NVIDIA détectée. AMD et Intel ne fournissent pas d'outil équivalent, leurs températures sont donc illisibles sans le logiciel du fabricant.",
    thermalsUnavailable: "Impossible de lire les capteurs de ce système.",
    driversTitle: "Ancienneté des pilotes",
    driversSubtitle:
      "L'âge des pilotes fournis par les fabricants. Windows sait ce qui est installé, pas ce qui est disponible : voici l'âge réel, jamais une fausse alerte de mise à jour.",
    driversRescan: "Réanalyser",
    driversScanning: "Analyse...",
    driversCounted: "{count} pilotes de fabricants",
    driversAging: "{count} de plus de 2 ans",
    driversStale: "{count} de plus de 4 ans",
    driversAllCurrent: "Tous récents",
    driversNone: "Aucun pilote tiers dans ces catégories.",
    driversShowAll: "Afficher les {count} autres",
    driversShowLess: "Afficher moins",
    driversInboxNote:
      "{count} pilotes Microsoft intégrés exclus : Windows Update s'en charge et leur date est un marqueur fixe, les compter comme anciens serait une fausse alerte.",
    ageYears: "{years} ans",
    ageYear: "{years} an",
    ageMonths: "{months} mois",
    ageMonth: "{months} mois",
    vendorSite: "Site du fabricant",
    watchLabel: "Sous surveillance depuis",
    peakLabel: "Pic",
    verdictRisky: "Risqué",
    verdictNormal: "Normal",
    verdictBetter: "Mieux que prévu",
    verdictIdle: "Au repos",
    verdictRiskyHint:
      "La carte a dépassé 84°, le seuil à partir duquel elle réduit elle-même ses performances pour se protéger. Vérifiez la circulation d'air ou passez au profil Silencieux.",
    verdictNormalHint: "Températures habituelles pour une carte en charge : rien d'inquiétant.",
    verdictBetterHint:
      "Elle est restée sous 65° tout en travaillant vraiment : refroidissement meilleur que la moyenne.",
    verdictIdleHint:
      "Elle n'a pas encore assez travaillé pour juger. Une carte au repos reste fraîche de toute façon, cela ne prouverait rien.",
    profilesTitle: "Profils thermiques",
    profilesSubtitle:
      "Ils ajustent la limite de puissance de la carte, le levier qui gouverne réellement la chaleur et le bruit du ventilateur. Chaque valeur provient des limites déclarées par la carte elle-même.",
    currentLimit: "Actuel : {watts} W",
    modeSilent: "Silencieux",
    modeSilentHint:
      "Pour le travail, le streaming et les longues sessions : le ventilateur reste presque muet et la carte chauffe bien moins, au prix de quelques images.",
    modeStandard: "Standard",
    modeStandardHint:
      "Une limite équilibrée un peu sous le plafond de la carte : ventilateur plus discret et températures plus basses, pour un coût en images de quelques pour cent.",
    modeGaming: "Gaming",
    modeGamingHint:
      "Pour les sessions compétitives : watts au maximum et plafond d'horloge relevé, pour tenir vos 1% low plus stables quand ça compte.",
    modeApplying: "Application...",
    profileStageReading: "Lecture des limites de la carte",
    profileStageApplying: "Application de la limite",
    profileStageSettling: "Attente de la réponse des ventilateurs",
    profileApplied: "Limite réglée sur {watts} W.",
    profileNote:
      "Nécessite les droits administrateur et se réinitialise au redémarrage. Ce n'est pas une courbe de ventilateur : NVIDIA n'expose aucun contrôle direct du ventilateur dans nvidia-smi, et les outils qui en proposent un utilisent des API privées non documentées auxquelles cette application ne touche pas.",
    profileDefaultIsMax:
      "Sur cette carte, la limite de puissance d'usine égale déjà le maximum : Silencieux est donc le seul profil qui change les watts, Gaming se distingue en relevant le plafond d'horloge.",
    driverInstalled: "installé v{version} le {date}",
    driversHardwareChanged:
      "Cette liste a été analysée sur un matériel différent de celui de cet ordinateur (par exemple une carte graphique remplacée) : elle a donc été effacée. Relancez l’analyse pour lire les périphériques réellement installés.",
    driversNoUpdateCheck:
      "Cet écran ne contacte aucun fabricant et ne peut pas savoir s'il existe une version plus récente : il affiche la version installée et son âge, et vous conduit à la page officielle pour vérifier vous-même.",
    driversCheckedAt: "Lu le {time}",
    modeClockLocked: "horloge jusqu'à {mhz} MHz",
    modeClockAuto: "horloge automatique",
    profileApply: "Appliquer le profil",
    profileActive: "Profil actif",
    profileWillSet: "Réglera {watts} W, {clock}",
    scanStarting: "Démarrage de l'analyse...",
    scanReading: "Lecture de la classe {class}",
    scanCount: "{done}/{total} · {pct}%",
    driversScannedAll: "{total} pilotes examinés dans {classes} catégories",
    winUpdateLabel: "Windows Update",
    winUpdateButton: "Rechercher sur Windows Update",
    winUpdateNote:
      "Ceci vérifie uniquement le catalogue de Windows Update, pas les pilotes précis listés ci-dessus : de nombreux fabricants - surtout pour l'audio et le chipset intégrés - ne publient jamais leurs mises à jour là, seulement sur leur propre site. WinCraft ne télécharge pas de paquets de pilotes lui-même : il n'existe aucune API constructeur indiquant la version correcte pour votre appareil précis, et installer le mauvais pilote graphique est l'une des rares erreurs qui peut vous laisser sans écran.",
    winUpdateOpened: "Windows Update ouvert.",
    winUpdateSearching: "Recherche...",
    winUpdateTakesAWhile: "Cela peut prendre une minute : interrogation du catalogue Microsoft.",
    winUpdateInstall: "Télécharger et installer ({count})",
    winUpdateInstalling: "Téléchargement et installation...",
    winUpdateNone:
      "Windows Update n'a rien de plus récent à proposer, même pour les pilotes signalés comme anciens ci-dessus : de nombreux fabricants publient leurs mises à jour à leur façon, pas via Windows Update.",
    winUpdateFailed: "Échec de la recherche : {detail}",
    winUpdateDone: "Installés {installed}, échoués {failed}.",
    rebootTitle: "Windows demande un redémarrage",
    rebootBody:
      "Windows signale qu'une installation ne se termine qu'après un redémarrage. Vous pouvez le faire maintenant ou quand vous voulez.",
    rebootNow: "Redémarrer",
    rebootLater: "Plus tard",
  },
  menu: {
    account: "Compte",
    plan: "Forfait",
    planFree: "Gratuit",
    viewPlan: "Voir votre forfait",
    language: "Langue",
    theme: "Thèmes",
    about: "À propos",
    errorReports: "Rapports d'erreur anonymes",
    errorReportsBody:
      "En cas d'échec, envoie uniquement le message d'erreur (jamais de données personnelles) pour nous aider à corriger les bugs. Désactivé par défaut.",
    changePhoto: "Changer la photo de profil",
    removePhoto: "Retirer la photo",
    photoFailed: "Impossible d'utiliser cette image comme photo de profil.",
    support: "Assistance",
    reportIssue: "Signaler un problème",
    aboutBody: "WinCraft — optimisations système avec sauvegarde et restauration automatiques.",
    close: "Fermer",
  },
  auth: {
    login: "Connexion",
    register: "Inscription",
    email: "E-mail",
    password: "Mot de passe",
    loginButton: "Se connecter",
    rememberMe: "Rester connecte sur ce PC",
    registerButton: "Créer un compte",
    working: "...",
    logout: "Se déconnecter",
    loggedInAs: "Connecté en tant que {email}",
    backendNotConfigured:
      "Aucun serveur connecté pour l'instant : définissez API_BASE_URL une fois le backend déployé.",
    switchToRegister: "Pas de compte ? Inscrivez-vous",
    switchToLogin: "Déjà un compte ? Connectez-vous",
    emailInvalid: "Saisissez une adresse e-mail valide.",
    passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères.",
    firstName: "Prénom",
    lastName: "Nom",
    registerDetailsRequired: "Le prénom, le nom et la date de naissance sont obligatoires.",
    loginRequiredToResend: "Connectez-vous d'abord, puis demandez un nouveau lien.",
    checkInboxAfterSignup:
      "Nous avons envoyé un lien de confirmation à {email}. Vérifiez aussi vos spams : dès que vous confirmez, votre compte est prêt.",
    forgotPasswordLink: "Mot de passe oublié ?",
    forgotPasswordButton: "Envoyer le lien de réinitialisation",
    forgotPasswordSent: "Si cet e-mail est enregistré, vous recevrez un lien de réinitialisation.",
    backToLogin: "Retour à la connexion",
    emailNotVerified: "E-mail non vérifié",
    emailVerified: "E-mail vérifié",
    resendVerification: "Renvoyer",
    verificationSent: "E-mail de vérification envoyé.",
    deleteAccount: "Supprimer le compte",
    deleteAccountBody:
      "Cela supprime votre adresse e-mail, votre mot de passe et vos informations enregistrées, déconnecte tous les appareils et est irréversible. Un avis que vous avez publié reste visible, mais l’adresse en est détachée.",
    deleteAccountPassword: "Votre mot de passe actuel",
    deleteAccountConfirmLabel: "Tapez DELETE pour confirmer",
    deleteAccountSubmit: "Supprimer définitivement mon compte",
    deleteAccountCancel: "Annuler",
    deleteAccountDone: "Votre compte a été supprimé. Tous les appareils ont été déconnectés.",
    deleteAccountBlocked:
      "Ce compte a un abonnement actif. Annulez-le depuis Gérer l’abonnement, sinon supprimer le compte laisserait votre carte débitée.",
    deleteAccountWrongPassword: "Ce mot de passe ne correspond pas à ce compte.",
    deleteAccountNeedsLogin: "Votre session a expiré. Reconnectez-vous pour supprimer le compte.",
    deleteAccountUnreachable:
      "Le serveur est injoignable. Rien n’a été supprimé : vérifiez votre connexion et réessayez.",
  },
  driftWatch: {
    title: "Surveiller les mises à jour Windows",
    body: "Une mise à jour cumulative rétablit ce qu'elle ne reconnaît pas : vos modifications disparaissent et vous l'apprenez des semaines plus tard, si jamais. Activée, la vérification s'exécute à l'ouverture de session et ne vous prévient que si quelque chose a réellement cessé de s'appliquer.",
    on: "Activée",
    off: "Désactivée",
  },
  guard: {
    settingTitle: "Laisser tranquilles les jeux qui se gèrent seuls",
    settingBody:
      "Certains jeux gèrent eux-mêmes leurs performances. Pendant que l'un d'eux tourne, WinCraft met en pause ses réglages par application et laisse le jeu exactement tel qu'il est.",
    selfManaged: "Ce jeu gère lui-même ses performances : WinCraft le laisse tel quel.",
    gameRunning:
      "Un jeu qui gère lui-même ses performances est en cours : WinCraft laisse les applications telles quelles jusqu'à sa fermeture.",
    paused: "En pause pendant qu'un jeu qui gère lui-même ses performances est en cours.",
    selfManagedBadge: "Gère lui-même ses performances",
    registeredGameRunning: "L'un de vos jeux est en cours : WinCraft attend qu'il se ferme.",
  },
  preview: {
    title: "Aperçu",
    loading: "Lecture des valeurs actuelles...",
    now: "Actuel",
    notSet: "Non défini",
    willChange: "L'appliquer modifie {count} valeurs sur {total}.",
    noChange: "Déjà en place : l'appliquer ne change rien.",
    readAtApply: "L'état actuel est lu et enregistré au moment où vous l'appliquez.",
    failed: "Impossible de lire les valeurs actuelles.",
  },
  requirements: {
    minBuild: "{version} ou plus récent",
    proEdition: "Pro, Entreprise ou Éducation",
    unavailableVersion: "Indisponible sur ce PC : nécessite {version} ou plus récent.",
    unavailableEdition: "Indisponible sur ce PC : nécessite Windows Pro, Entreprise ou Éducation.",
    enterpriseEdition: "Entreprise ou Éducation",
    unavailableEnterpriseEdition:
      "Indisponible sur ce PC : nécessite Windows Entreprise ou Éducation.",
    notPresent: "Ce PC ne dispose pas de cette fonction, il n'y a donc rien à désactiver.",
    retired:
      "Retiré : cet ancien réglage ne peut plus être appliqué. Son état précédemment enregistré peut toujours être restauré.",
    windowsProtected:
      "Sur ce PC, Windows protège ce réglage et refuse les modifications venant d'autres applications. Désactivez Widgets dans Paramètres > Personnalisation > Barre des tâches.",
  },
  scheduledCleanup: {
    title: "Nettoyage hebdomadaire des fichiers temporaires",
    body: "Une fois par semaine, quelques minutes après votre connexion, place dans la Corbeille les fichiers temporaires que rien n'a modifiés depuis un jour. Il attend si un jeu est en cours et ne touche jamais à la mémoire ni aux applications ouvertes.",
  },
  priorityRules: {
    title: "Règles de priorité des applications",
    subtitle:
      "Choisissez une application et une priorité. WinCraft l'applique à chaque lancement de l'application tant qu'il est ouvert, et rétablit l'ancienne priorité quand vous supprimez la règle ou fermez WinCraft. Jamais au-dessus de Haute.",
    remove: "Supprimer",
    empty: "Aucune application pour l'instant.",
    active: "Applications en cours ajustées : {count}",
    levelLabel: "Priorité de {name}",
    idle: "Basse",
    belowNormal: "Inférieure à la normale",
    normal: "Normale",
    aboveNormal: "Supérieure à la normale",
    high: "Haute",
  },
  skinpacks: {
    title: "Apparence de Windows",
    description: "Applique une apparence réversible à la session Windows de cet utilisateur.",
    packName: "Apparence sombre inspirée de COSMIC",
    packBody:
      "Active le mode sombre, applique une touche turquoise, réduit la transparence, aplatit les bordures des fenêtres et aligne la barre des tâches à gauche. Les neuf valeurs du Registre sont enregistrées avant toute modification.",
    scope:
      "Seule l’apparence de l’interface Windows change. COSMIC n’est pas installé et l’environnement de bureau Windows n’est pas remplacé.",
    apply: "Appliquer l’apparence",
    restore: "Restaurer l’apparence précédente",
    active: "Apparence active",
    applying: "Application…",
    valuesSummary:
      "Cette apparence utilise {count} valeurs du Registre ; leur état d’origine est sauvegardé lors de l’application pour permettre la restauration.", // uses {count}
  },
  tweaks: {
    disable_click_to_do: {
      name: "Désactiver Click to Do",
      description:
        "Applique la stratégie Windows qui supprime Click to Do, la fonction qui capture votre écran et l'analyse pour proposer des actions. Ses points d'accès disparaissent pour tous les comptes de ce PC. Paramètres l'indiquera comme géré par votre organisation : c'est ainsi que Windows signale les stratégies. Elle n'a d'effet que sur les PC où Windows propose Click to Do.",
    },
    disable_edge_ai: {
      name: "Désactiver les fonctions d'IA de Microsoft Edge",
      description:
        "Applique les stratégies Microsoft Edge pour ses fonctions d'IA. Leur effet dépend du profil Edge : empêcher Edge de télécharger son modèle d'IA local fonctionne pour tous les profils ; masquer la barre latérale et désactiver la recherche par IA dans l'historique et les thèmes générés par IA fonctionne pour les profils qui ne sont pas connectés avec un compte Microsoft personnel ; désactiver l'accès de Copilot au contenu des pages et son aide à la rédaction ne fonctionne que pour les profils professionnels ou scolaires. Edge les prend en compte sans redémarrage ; edge://policy les affiche. Edge indiquera qu'il est géré par votre organisation : c'est ainsi qu'il signale les stratégies.",
    },
    disable_paint_ai: {
      name: "Désactiver les fonctions d'IA de Paint",
      description:
        "Applique les stratégies Windows qui désactivent Cocreator, Image Creator et le remplissage génératif dans Paint. Le reste de Paint fonctionne comme avant.",
    },
    disable_notepad_ai: {
      name: "Désactiver les fonctions d'IA du Bloc-notes",
      description:
        "Applique la stratégie du Bloc-notes qui désactive ses outils d'écriture Copilot (réécrire, résumer, écrire). Fermez puis rouvrez le Bloc-notes pour voir le changement.",
    },
    disable_fast_startup: {
      name: "Désactiver le démarrage rapide",
      description:
        "Fait d'Arrêter un véritable arrêt plutôt qu'une mise en veille prolongée partielle. Windows démarre à froid quelques secondes plus lentement, mais les pilotes et les mises à jour se chargent à neuf à chaque fois, et les configurations en double démarrage ne trouvent plus le disque de Windows verrouillé.",
    },
    disable_storage_sense: {
      name: "Désactiver l'Assistant Stockage",
      description:
        "Empêche Windows de supprimer les fichiers temporaires, de vider la Corbeille et de basculer des fichiers OneDrive en ligne selon son propre calendrier. C'est vous qui décidez quoi nettoyer, et quand.",
    },
    taskbar_end_task: {
      name: "Ajouter Fin de tâche à la barre des tâches",
      description:
        "Ajoute Fin de tâche au menu contextuel des applications dans la barre des tâches, pour fermer une application figée sans ouvrir le Gestionnaire des tâches.",
    },
    disable_drag_tray: {
      name: "Désactiver le panneau de partage au glissement",
      description:
        "Empêche le panneau de partage (appelé Drop tray dans les builds récentes) de descendre du haut de l'écran chaque fois que vous faites glisser un fichier, pour que le glisser-déposer habituel fonctionne sans gêne. La valeur provient de la documentation de la communauté Windows, pas de Microsoft ; les mises à jour récentes de Windows 11 proposent aussi ce réglage dans Paramètres.",
    },
    explorer_open_this_pc: {
      name: "Ouvrir l'Explorateur de fichiers sur Ce PC",
      description:
        "Configure l’ouverture de l’Explorateur de fichiers sur Ce PC, avec les lecteurs et dossiers, plutôt que sur Accueil. Seule la page de démarrage change ; l’entrée Accueil reste dans le volet de navigation.",
    },
    block_oem_device_apps: {
      name: "Empêcher les applications des fabricants de s'installer seules",
      description:
        "Empêche Windows de télécharger les applications des fabricants et les icônes personnalisées des périphériques que vous branchez : c'est ainsi que certains utilitaires de souris, de clavier ou de carte mère arrivent sans avoir été demandés. Les pilotes s'installent comme d'habitude.",
    },
    disable_windows_suggestions: {
      name: "Désactiver les conseils et suggestions de Windows",
      description:
        "Un seul interrupteur pour les messages que Windows ajoute de lui-même : conseils et suggestions, écran d'accueil après les mises à jour, suggestions dans Paramètres, « terminer la configuration de l'appareil », notifications suggérées, recommandations et avis de compte dans le menu Démarrer, et publicités des fournisseurs de synchronisation dans l'Explorateur de fichiers. Ce sont les valeurs qu'écrivent les interrupteurs de Paramètres de Windows, telles que documentées par la communauté Windows ; Microsoft ne les documente pas, donc une mise à jour de Windows peut les modifier.",
    },
    disable_widgets: {
      name: "Désactiver complètement les widgets",
      description:
        "Applique la stratégie Windows qui désactive le tableau des widgets lui-même, pas seulement son bouton dans la barre des tâches : son fil d'actualités cesse de se charger en arrière-plan. Paramètres l'indiquera comme géré par votre organisation : c'est ainsi que Windows signale les stratégies.",
    },
    hide_start_recommended: {
      name: "Retirer Recommandé du menu Démarrer",
      description:
        "Applique la stratégie Windows qui retire la section Recommandé du menu Démarrer et laisse toute la place à vos applications épinglées. Paramètres l'indiquera comme géré par votre organisation : c'est ainsi que Windows signale les stratégies.",
    },
    disable_game_bar_captures: {
      name: "Désactiver les captures de la Game Bar",
      description:
        "Désactive la fonction de capture de la Game Bar et son enregistrement en arrière-plan, qui conserve en continu une vidéo de vos dernières minutes de jeu. Complète l'interrupteur Game Bar / Game DVR.",
    },
    disable_ai_fabric_service: {
      name: "Ne démarrer l'hôte des composants d'IA de Windows qu'au besoin",
      description:
        "Arrête le service hôte des composants d'IA de Windows (WSAIFabricSvc) et le règle sur Manuel, pour qu'il ne démarre plus avec Windows. Windows peut toujours le démarrer quand une application ou une fonction de Windows le demande. Windows le décrit comme fournissant des services de composants d'IA aux applications et aux autres services Windows. Présent uniquement sur les PC qui l'ont.",
    },
    disable_restart_apps: {
      name: "Empêcher la réouverture des apps après connexion",
      description:
        "Empêche Windows de rouvrir les applications redémarrables de la session précédente après connexion. La session n'est plus restaurée automatiquement ; les apps ouvertes et la connexion automatique ne changent pas.",
    },
    enable_long_paths: {
      name: "Activer les chemins longs dans les apps compatibles",
      description:
        "Permet aux apps déclarant la prise en charge des chemins longs de dépasser la limite traditionnelle. Les anciennes apps et certaines opérations de l'Explorateur peuvent rester limitées. Redémarrez les apps ; une restauration peut rendre des chemins longs existants inaccessibles.",
    },
    disable_filter_keys_shortcut: {
      name: "Éviter l'activation accidentelle des touches filtres",
      description:
        "Désactive seulement le raccourci Maj droite des touches filtres. La fonction d'accessibilité et ses délais restent inchangés ; la latence du clavier ne diminue pas.",
    },
    ecoqos_rules: {
      name: "Règles d'efficacité des apps en arrière-plan",
      description:
        "Réduit la priorité énergétique des exécutables choisis tant que WinCraft est ouvert. Les règles se suspendent lorsque l'app devient interactive ; ce n'est pas un plafond CPU.",
    },
    limit_do_background_download: {
      name: "Limite des téléchargements Windows en arrière-plan",
      description:
        "Configure une limite en Ko/s pour les téléchargements Microsoft via Delivery Optimization. Steam et les autres appareils ne sont pas limités ; un ping inférieur n'est pas garanti.",
    },
    monitor_refresh_profile: {
      name: "Profil de fréquence du moniteur pour les jeux",
      description:
        "Choisissez une fréquence prise en charge pour un écran pendant une session de jeu, avec aperçu temporaire et restauration. Cela n'augmente pas les images produites par le GPU.",
    },
    cpu_energy_performance: {
      name: "Privilégier les performances du processeur sur secteur",
      description:
        "Règle la préférence énergétique du processeur sur 0 dans le mode actif, sur secteur. Nécessite CPPC autonome ; les limites thermiques et du micrologiciel restent applicables. Peut augmenter la chaleur et la consommation. La batterie reste inchangée. Testez votre charge de travail.",
    },
    pcie_link_power: {
      name: "Maintenir les liaisons PCIe actives sur secteur",
      description:
        "Désactive l'économie d'énergie des liaisons PCIe dans le mode actif, sur secteur. Option de diagnostic pour les transitions énergétiques ; aucune réduction de latence garantie. Peut augmenter la consommation au repos. La batterie reste inchangée.",
    },
    usb_suspend_diagnostics: {
      name: "Diagnostiquer le réveil USB sur secteur",
      description:
        "Désactive la suspension sélective USB sur secteur pour rechercher des problèmes de réveil ou de déconnexion. Windows recommande de la laisser normalement activée. Restaurez après le test ; la consommation au repos peut augmenter. La batterie reste inchangée.",
    },
    hybrid_short_threads: {
      name: "Préférer les cœurs performants pour les threads courts",
      description:
        "Sur un processeur avec plusieurs classes d'efficacité, demande à Windows de préférer les cœurs performants pour les threads courts sur secteur. C'est une préférence, pas une affinité fixe. La planification automatique peut être meilleure. La batterie reste inchangée.",
    },
    hybrid_long_threads: {
      name: "Préférer les cœurs performants pour les threads longs",
      description:
        "Sur un processeur avec plusieurs classes d'efficacité, demande à Windows de préférer les cœurs performants pour les threads longs sur secteur. Les autres cœurs restent disponibles ; les E-cores ne sont pas désactivés. Comparez le débit et la réactivité. La batterie reste inchangée.",
    },
    disable_startup_delay: {
      name: "Supprimer le délai des programmes au démarrage",
      description:
        "Windows attend volontairement environ 10 secondes après la connexion avant de lancer vos programmes de démarrage. Cette option supprime cette attente.",
    },
    menu_show_delay: {
      name: "Réponse instantanée des menus",
      description:
        "Supprime le délai d'ouverture des menus, ce qui rend tout le bureau nettement plus réactif.",
    },
    disable_power_throttling: {
      name: "Désactiver la limitation d'énergie du processeur",
      description:
        "Empêche Windows de ralentir les processus en arrière-plan pour économiser l'énergie - utile sur les portables, où cela provoque des saccades lors des longues sessions.",
    },
    games_gpu_priority: {
      name: "Définir l'ancienne valeur GPU Priority des jeux",
      description:
        "Écrit la valeur GPU Priority des jeux, que Microsoft indique comme inutilisée. Aucun gain de priorité GPU ni de fréquence d'images n'est attendu.",
    },
    disable_tailored_experiences: {
      name: "Désactiver les expériences personnalisées",
      description:
        "Empêche Windows d'utiliser vos données de diagnostic pour personnaliser publicités, conseils et recommandations.",
    },
    disable_app_launch_tracking: {
      name: "Ne plus suivre les applications que vous ouvrez",
      description:
        "Windows enregistre la fréquence de lancement de chaque programme pour classer les résultats du menu Démarrer. Cette option désactive ce suivi.",
    },
    disable_feedback_requests: {
      name: "Bloquer les demandes de commentaires de Windows",
      description:
        "Empêche Windows de vous interrompre avec les sondages « Quelle est la probabilité que vous recommandiez... ».",
    },
    disable_cortana: {
      name: "Désactiver Cortana",
      description:
        "Désactive Cortana via une stratégie système, libérant les ressources qu'il réserve en arrière-plan.",
    },
    show_file_extensions: {
      name: "Toujours afficher les extensions de fichiers",
      description:
        "Révèle la véritable extension de chaque fichier. À activer ne serait-ce que pour la sécurité : cela démasque les fichiers du type « facture.pdf.exe » que Windows masque autrement.",
    },
    hide_taskbar_widgets: {
      name: "Masquer les Widgets de la barre des tâches",
      description:
        "Supprime le bouton Widgets (météo/actualités), qui charge du contenu en arrière-plan même si vous ne l'ouvrez jamais.",
    },
    network_latency: {
      name: "Accusés de réception TCP et regroupement des paquets",
      description:
        "Définit TcpAckFrequency et TCPNoDelay sur 1 sur l'adaptateur qui porte la route vers Internet. Cela concerne TCP ; le trafic UDP reste inchangé. La prise en charge dépend de Windows et des applications : une latence plus faible dans les jeux n'est pas garantie.",
    },
    disable_window_animations: {
      name: "Animations de fenetres instantanees",
      description:
        "Supprime l'animation jouée à chaque ouverture, fermeture ou réduction d'une fenêtre. Cette animation n'est que du temps d'attente : la retirer fait répondre le bureau à l'instant du clic et libère le travail GPU correspondant.",
    },
    disable_drag_full_windows: {
      name: "Deplacement de fenetres allege",
      description:
        "Dessine un contour pendant que vous deplacez une fenetre au lieu de redessiner tout son contenu a chaque image. A peine perceptible sur un GPU rapide, nettement visible sur un circuit graphique integre ou une machine ancienne.",
    },
    mouse_hover_delay: {
      name: "Reaction immediate au survol de la souris",
      description:
        "Windows attend 400 ms avant de reagir au pointeur pose sur un element : apercus de la barre des taches, info-bulles, survol des menus. Ce delai tombe presque a zero, l'interface suit la souris au lieu de la suivre en retard.",
    },
    disable_background_apps: {
      name: "Arreter les applications en arriere-plan",
      description:
        "Empêche les applications du Store de s'exécuter, de s'actualiser et d'interroger le réseau pendant que vous ne les utilisez pas. C'est du processeur, de la mémoire et de la batterie dépensés pour des applications que vous n'avez pas ouvertes.",
    },
    disable_delivery_optimization: {
      name: "Désactiver le partage pair-à-pair des mises à jour Windows",
      description:
        "Configure Delivery Optimization en mode HTTP uniquement, afin que ce PC ne télécharge pas le contenu des mises à jour depuis d'autres PC et ne leur en envoie pas. Windows Update continue de télécharger les mises à jour depuis Microsoft ; le service Delivery Optimization et Windows Update restent activés.",
    },
    prevent_auto_restart_while_logged_on: {
      name: "Éviter les redémarrages planifiés de Windows Update pendant une session ouverte",
      description:
        "Empêche Windows Update de redémarrer automatiquement le PC pour une mise à jour planifiée tant qu’une personne est connectée. Les mises à jour peuvent toujours être téléchargées et installées ; cela ne bloque pas un redémarrage que vous lancez vous-même. Une mise à jour de sécurité qui nécessite un redémarrage n’est pleinement active qu’après celui-ci : une session prolongée peut donc retarder la protection. Laissez Windows Update activé et redémarrez rapidement.",
    },
    defer_quality_updates_7_days: {
      name: "Retarder les mises à jour de qualité de 7 jours",
      description:
        "Diffère de 7 jours après leur publication les mises à jour de qualité de Windows, y compris les correctifs de sécurité mensuels. Windows Update reste activé : il s'agit d'un court délai, pas d'une pause ni d'un blocage. Les correctifs de sécurité ne sont pas appliqués pendant ce délai ; installez rapidement les mises à jour urgentes et redémarrez lorsque Windows le demande. Restaurer ce réglage supprime le report.",
    },
    defer_feature_updates_30_days: {
      name: "Retarder les mises à jour de fonctionnalités de 30 jours",
      description:
        "Diffère de 30 jours après leur publication la proposition des mises à jour de fonctionnalités de Windows. Les mises à jour mensuelles de qualité et de sécurité continuent selon leur calendrier habituel. Ce réglage ne fixe pas une version et ne prolonge pas la prise en charge de votre version actuelle de Windows ; le restaurer supprime ce report.",
    },
    exclude_windows_update_drivers: {
      name: "Exclure les pilotes autonomes de Windows Update",
      description:
        "Demande à Windows Update d'exclure les mises à jour de pilotes autonomes de son cycle normal de mises à jour de qualité. Windows Update et les mises à jour de qualité et de sécurité restent activés. Les pilotes inclus dans des mises à jour de sécurité ou critiques, ainsi que ceux installés dynamiquement lors des mises à jour de fonctionnalités, peuvent toujours arriver. Les outils des fabricants et les installations manuelles ne sont pas bloqués. Vous devrez gérer vous-même les pilotes autonomes ; tant que ce réglage est actif, le catalogue de pilotes de Windows Update peut proposer moins de mises à jour, voire aucune. Restaurer ce réglage réautorise les offres de pilotes par Windows Update.",
    },
    disable_copilot: {
      name: "Ancienne stratégie Copilot (restauration uniquement)",
      description:
        "Cette stratégie abandonnée ne contrôle pas l’application Copilot actuelle. Vous pouvez restaurer ici la valeur du registre sauvegardée. Gérez l’application Copilot distincte dans Debloat ; sa suppression n’empêche pas une réinstallation future.",
    },
    keyboard_delay_zero: {
      name: "Ancienne valeur KeyboardDelay (restauration uniquement)",
      description:
        "Les versions précédentes écrivaient KeyboardDelay dans la clé des paramètres de la souris, et non dans celle du clavier. Cette entrée sert uniquement à restaurer l'ancienne sauvegarde ; pour la répétition du clavier, utilisez « Réduire le délai d'entrée (clavier) ».",
    },
    keyboard_speed_fast: {
      name: "Ancienne valeur KeyboardSpeed (restauration uniquement)",
      description:
        "Les versions précédentes écrivaient KeyboardSpeed dans la clé des paramètres de la souris, et non dans celle du clavier. Cette entrée sert uniquement à restaurer l'ancienne sauvegarde ; pour la répétition du clavier, utilisez « Réduire le délai d'entrée (clavier) ».",
    },
    disable_suggested_apps: {
      name: "Empêcher Windows d'installer des applications tout seul",
      description:
        "Windows installe discrètement des applications et des jeux « suggérés » dans votre menu Démarrer sans rien demander, à l'installation puis après chaque grosse mise à jour. Ceci désactive ce comportement : plus rien n'arrive sur votre machine sans votre accord.",
    },
    disable_mouse_acceleration: {
      name: "Désactiver l'accélération de la souris",
      description:
        "Désactive « Améliorer la précision du pointeur », qui fait parcourir au curseur une distance plus grande quand vous bougez vite. C'est exactement la réponse variable dont vous ne voulez pas pour viser : un même geste doit toujours couvrir la même distance à l'écran.",
    },
    disable_sticky_keys_prompt: {
      name: "Supprimer la fenêtre des touches rémanentes",
      description:
        "Appuyer cinq fois sur Maj ouvre la boîte de dialogue des touches rémanentes, ce qui en jeu signifie sortir du plein écran au pire moment, généralement en plein combat. Ceci désactive le raccourci et son avertissement ; les touches rémanentes restent disponibles dans les Paramètres.",
    },
    disable_recall: {
      name: "Désactiver Recall (captures d'écran par IA)",
      description:
        "Recall capture votre écran toutes les quelques secondes et construit un historique indexé par IA de tout ce que vous avez consulté — mots de passe et messages privés compris, puisqu'il enregistre tout ce qui s'affiche. Ceci applique la stratégie système qui l'empêche d'analyser ou de conserver quoi que ce soit.",
    },
    global_timer_resolution: {
      name: "Résolution du minuteur globale",
      description:
        "Définit la valeur de registre GlobalTimerResolutionRequests sur 1. Cette opération ne demande ni ne vérifie une résolution précise du minuteur. Le comportement dépend de la version de Windows ; une latence plus faible ou davantage de FPS ne sont pas garantis. Redémarrage requis.",
    },
    disable_core_parking: {
      name: "Désactiver le parcage des cœurs",
      description:
        "Empêche Windows de parquer les cœurs inactifs lorsque le PC est branché, afin qu'un cœur n'ait pas à être réveillé avant de traiter une entrée ou une charge soudaine. Appliqué au seul profil secteur : sur batterie, le parcage sert précisément à cela. La valeur précédente du plan est enregistrée et restaurée à l'identique (droits administrateur requis).",
    },
    disable_memory_integrity: {
      name: "Désactiver l'intégrité de la mémoire (VBS)",
      description:
        "Demande la désactivation de l'intégrité de la mémoire (HVCI). Si elle est appliquée, une couche de protection du noyau est supprimée ; d'autres fonctions VBS peuvent rester actives. L'effet sur les performances dépend du matériel et de la charge de travail. Une stratégie système ou un verrouillage UEFI peut empêcher la modification. Redémarrez et vérifiez l'état dans Sécurité Windows.",
    },
    disable_typing_personalization: {
      name: "Empêcher Windows d'apprendre votre façon d'écrire",
      description:
        "Windows constitue un dictionnaire personnel à partir de ce que vous tapez et écrivez à la main — y compris dans les gestionnaires de mots de passe, les fenêtres de discussion et les champs de recherche — et le synchronise avec votre compte Microsoft pour améliorer ses suggestions. Ceci désactive la collecte du texte et celle de l'écriture manuscrite.",
    },
    classic_context_menu: {
      name: "Rétablir le menu clic droit complet",
      description:
        "Windows 11 cache la majeure partie du menu contextuel derrière « Afficher d'autres options », transformant un clic en deux pour des gestes quotidiens. Ceci rétablit le menu complet de Windows 10 partout, dans l'Explorateur et sur le bureau. L'Explorateur redémarre pour l'appliquer, les fenêtres ouvertes clignoteront donc une fois.",
    },
    disable_transparency: {
      name: "Désactiver les effets de transparence",
      description:
        "Désactive les effets de flou/acrylique de la barre des tâches et des menus. Une économie de GPU modeste mais réelle, qui rend plus fluides les PC anciens ou à carte graphique intégrée.",
    },
    dark_mode: {
      name: "Mode sombre",
      description: "Active le thème sombre pour les applications et le système.",
    },
    show_hidden_files: {
      name: "Afficher les fichiers cachés",
      description: "Affiche les fichiers et dossiers cachés dans l'Explorateur.",
    },
    priority_separation: {
      name: "Optimiser la priorité du processeur",
      description:
        "Ajuste Win32PrioritySeparation (0x26) pour donner à l'application au premier plan des quanta CPU courts et variables avec une priorité 3x — la valeur classique de réactivité bureau/jeu.",
    },
    disable_game_dvr: {
      name: "Désactiver Xbox Game Bar / Game DVR",
      description:
        "Désactive l'enregistrement en arrière-plan de Xbox Game Bar, gourmand en CPU/GPU pendant le jeu.",
    },
    disable_telemetry_tasks: {
      name: "Réduire la collecte de données de diagnostic",
      description:
        "Règle la stratégie de données de diagnostic de Windows au niveau le plus bas. Les éditions Famille et Pro l'appliquent comme données de diagnostic obligatoires ; seules Entreprise et Éducation les désactivent complètement.",
    },
    reset_advertising_id: {
      name: "Désactiver l'ID publicitaire",
      description:
        "Empêche les applications d'utiliser votre ID publicitaire à des fins de profilage.",
    },
    disable_location_tracking: {
      name: "Désactiver le suivi de localisation",
      description:
        "Bloque l'accès à la localisation pour toutes les applications via une stratégie système.",
    },
    disable_bing_search: {
      name: "Désactiver la recherche Bing dans le menu Démarrer",
      description: "Empêche l'envoi de vos recherches du menu Démarrer à Bing.",
    },
    power_plan_performance: {
      name: "Performances élevées (mode d'alimentation)",
      description:
        "Passe au mode d'alimentation Windows « Performances élevées ». Utile sur un bureau ou branché sur secteur ; restaure le mode précédent lors de l'annulation.",
    },
    turbo_gaming: {
      name: "Turbo Gaming",
      description:
        "Préréglage : désactive Game DVR, passe le mode d'alimentation en Performances élevées et optimise la priorité du processeur (droits administrateur requis).",
    },
    privacy_dns: {
      name: "DNS privés (Cloudflare)",
      description:
        "Passe à des serveurs DNS axés confidentialité (1.1.1.1), empêchant votre fournisseur d'accès d'enregistrer vos requêtes DNS. Ne masque pas votre adresse IP (pour cela, il faut un VPN, voir ci-dessous).",
    },
    hardware_gpu_scheduling: {
      name: "Planification GPU accélérée par le matériel",
      description:
        "Demande la planification GPU accélérée par le matériel (HAGS). Une carte graphique, un pilote et une version de Windows compatibles sont nécessaires. Les performances et la latence peuvent s'améliorer, se dégrader ou rester inchangées selon le jeu. Redémarrez et vérifiez la disponibilité dans les paramètres graphiques de Windows.",
    },
    reduce_input_lag: {
      name: "Réduire le délai d'entrée (souris)",
      description:
        "Désactive l'accélération du pointeur (« Améliorer la précision du pointeur ») pour un mouvement de souris 1:1, sans délai ajouté par le système.",
    },
    turbo_boost: {
      name: "Turbo Boost du processeur",
      description:
        "Règle le mode boost sur Agressif sur secteur et sur batterie, et l'état minimal du processeur à 100 % sur secteur dans le mode de gestion de l'alimentation actuel. La consommation et la chaleur peuvent augmenter. Les limites du processeur, du micrologiciel et de température restent applicables ; une hausse des FPS n'est pas garantie (droits administrateur requis).",
    },
    network_throttling_index: {
      name: "Désactiver la limitation réseau multimédia",
      description:
        "Supprime la limite imposée par Windows au trafic réseau pendant l'utilisation d'apps multimédias/jeux, utile pour réduire les micro-latences en ligne.",
    },
    system_responsiveness: {
      name: "Définir la réserve CPU MMCSS en arrière-plan",
      description:
        "Écrit SystemResponsiveness=0, que Windows traite comme 20 %. Cela ne supprime pas la part CPU des tâches moins prioritaires et ne privilégie pas toutes les apps au premier plan.",
    },
    games_task_priority: {
      name: "Définir la catégorie MMCSS Games",
      description:
        "Définit la catégorie Games sur High pour les threads inscrits auprès de MMCSS ; High traite Priority comme 2. Les valeurs GPU Priority et SFIO Priority écrites sont inutilisées. Cela ne privilégie pas tous les processus de jeu.",
    },
    reduce_keyboard_delay: {
      name: "Réduire le délai d'entrée (clavier)",
      description:
        "Ramène à zéro le délai avant qu'une touche maintenue commence à se répéter et maximise sa vitesse de répétition, pour une réponse plus immédiate en jeu.",
    },
    keep_kernel_in_ram: {
      name: "Garder le noyau et les pilotes en RAM",
      description:
        "Windows peut déplacer sur le disque des parties du noyau et du code des pilotes même quand la mémoire est abondante, et les relire est une pause que vous ressentez comme un à-coup. Ceci les garde en mémoire. Utile si vous avez de la RAM à revendre ; sur un PC peu doté, laissez désactivé.",
    },
    auto_end_frozen_tasks: {
      name: "Empêcher une application figée de bloquer l'arrêt",
      description:
        "Quand une application cesse de répondre pendant l'arrêt, Windows attend et affiche l'écran \"Cette application empêche l'arrêt\" jusqu'à ce que quelqu'un clique. Ceci ferme automatiquement les applications qui ne répondent plus, pour qu'un programme figé ne laisse pas la machine allumée. Attention : la fermeture automatique des applications peut entraîner la perte du travail non enregistré. Restaurer ce réglage ne récupère pas ce travail.",
    },
    instant_folder_loading: {
      name: "Ouvrir chaque dossier instantanément",
      description:
        "L'Explorateur inspecte le contenu d'un dossier pour deviner s'il s'agit d'Images, Musique ou Documents, et un dossier contenant des milliers de fichiers multimédias peut se figer plusieurs secondes pendant qu'il décide. Ceci fixe tous les dossiers sur la disposition générale, pour qu'ils s'ouvrent aussitôt.",
    },
    tcp_congestion_bbr: {
      name: "Un ping stable même quand la ligne est chargée (BBR2)",
      description:
        "Windows utilise CUBIC, qui accélère jusqu'à ce qu'un tampon déborde quelque part : c'est pourquoi votre ping grimpe dès que quelqu'un d'autre lance un téléchargement. BBR2 mesure la bande passante réelle et le temps d'aller-retour de la ligne, et cadence le trafic en conséquence : le tuyau se remplit sans remplir la file. Microsoft fournit BBR2 dans Windows 11 ; ceci bascule le profil Internet dessus et sait revenir exactement à l'état précédent (droits administrateur requis).",
    },
    taskbar_align_left: {
      name: "Aligner la barre des tâches à gauche",
      description:
        "Replace les icônes de la barre des tâches à gauche (style Windows 10) au lieu du centre.",
    },
    hide_taskbar_chat: {
      name: "Masquer Chat/Teams de la barre des tâches",
      description: "Retire l'icône Chat (Microsoft Teams) de la barre des tâches.",
    },
    disable_start_suggestions: {
      name: "Désactiver les suggestions et apps recommandées du menu Démarrer",
      description:
        "Empêche Windows d'afficher des apps recommandées, publicités et suggestions dans le menu Démarrer.",
    },
    disable_activity_history: {
      name: "Désactiver l'historique d'activité (Windows Timeline)",
      description:
        "Empêche Windows d'enregistrer, de sauvegarder et d'envoyer à Microsoft l'historique de vos apps et documents utilisés, via une stratégie système.",
    },
    hide_taskbar_search: {
      name: "Masquer la barre de recherche de la barre des tâches",
      description:
        "Retire la case/icône de recherche de la barre des tâches pour une barre plus épurée (la recherche reste accessible via la touche Windows).",
    },
    disable_fullscreen_optimizations_global: {
      name: "Désactiver les optimisations plein écran globalement",
      description:
        "Force DXGI à respecter le vrai mode plein écran exclusif au lieu de la simulation de Windows, réduisant les micro-saccades et l'input lag dans de nombreux jeux plus anciens.",
    },
    disable_windows_search_service: {
      name: "Désactiver le service d'indexation (Windows Search)",
      description:
        "Arrête et désactive le service d'indexation des fichiers de Windows, réduisant l'activité disque en arrière-plan — utile sur les petits SSD ou pendant le jeu. La recherche de fichiers dans le menu Démarrer devient plus lente jusqu'à sa réactivation (droits administrateur requis).",
    },
    disable_dmwappush_service: {
      name: "Démarrer le service de notification push uniquement si nécessaire",
      description:
        "Arrête le service de routage push WAP et le règle sur Manuel, pour qu'il ne démarre plus avec Windows tout en restant démarrable à la demande.",
    },
    disable_diagtrack_service: {
      name: "Désactiver le service de télémétrie (expériences connectées)",
      description:
        "Arrête et désactive le service d'expériences utilisateur connectées et de télémétrie, qui envoie des données d'utilisation et de diagnostic à Microsoft. Windows Update et les rapports d'erreurs continuent de fonctionner.",
    },
    enable_regback: {
      name: "Activer la sauvegarde automatique du Registre (RegBack)",
      description:
        "Réactive les sauvegardes automatiques périodiques des ruches du Registre Windows dans %SystemRoot%\\System32\\config\\RegBack pour la récupération d'urgence.",
    },
    explorer_anti_hang: {
      name: "Éviter les blocages de l'Explorateur sur les raccourcis",
      description:
        "Désactive le suivi des cibles et la recherche réseau à l'ouverture des raccourcis, évitant ainsi le gel de l'Explorateur de fichiers sur des lecteurs ou partages réseau déconnectés.",
    },
    no_internet_open_with: {
      name: "Ignorer la recherche Microsoft Store pour fichiers inconnus",
      description:
        "Ouvre immédiatement le sélecteur local « Ouvrir avec » au lieu de suggérer une recherche sur le Microsoft Store lors d'un double-clic sur un fichier non reconnu.",
    },
    detailed_bsod: {
      name: "Afficher les paramètres détaillés des plantages BSOD",
      description:
        "Affiche les codes d'arrêt hexadécimaux exacts, les pilotes en cause et les adresses mémoire sur les écrans bleus au lieu de les masquer derrière un code QR générique.",
    },
    disable_wpbt: {
      name: "Bloquer l'exécution des logiciels UEFI WPBT",
      description:
        "Empêche le micrologiciel UEFI de la carte mère d'installer automatiquement des logiciels OEM dans Windows via la table WPBT.",
    },
    disable_ndu: {
      name: "Désactiver la fuite de mémoire non paginée de NDU",
      description:
        "Désactive le service du pilote Network Diagnostic Usage, évitant l'accumulation de mémoire non paginée lors de téléchargements réseau intensifs.",
    },
    disable_search_highlights: {
      name: "Désactiver les temps forts et illustrations de recherche",
      description:
        "Supprime les illustrations web, les doodles quotidiens de Bing et les tendances de la barre de recherche Windows et de la barre des tâches.",
    },
    auto_complete_run: {
      name: "Activer la saisie semi-automatique dans Exécuter",
      description:
        "Active l'autocomplétion instantanée des commandes et les suggestions dans la boîte de dialogue Exécuter de Windows (Win + R).",
    },
    disable_aero_shake: {
      name: "Désactiver la réduction par secousse (Aero Shake)",
      description:
        "Empêche le fait de secouer la barre de titre d'une fenêtre de réduire accidentellement toutes les autres fenêtres ouvertes.",
    },
    disable_remote_assistance: {
      name: "Désactiver les invitations d'Assistance à distance",
      description:
        "Désactive les connexions et invitations de l'Assistance à distance Windows pour protéger le système contre les demandes de support non sollicitées.",
    },
    disable_llmnr: {
      name: "Désactiver le protocole LLMNR",
      description:
        "Désactive la résolution de noms de multidiffusion locale (LLMNR) pour se protéger contre l'usurpation d'identité et l'interception sur le réseau local.",
    },
    disable_wifi_sense: {
      name: "Désactiver le partage d'accès Wi-Fi Sense",
      description:
        "Empêche Windows de se connecter automatiquement aux réseaux Wi-Fi ouverts et de partager des identifiants avec vos contacts.",
    },
    disable_cloud_search: {
      name: "Désactiver la recherche cloud dans Windows",
      description:
        "Empêche la recherche Windows d'interroger l'historique cloud et le compte Microsoft lors de la recherche de fichiers locaux.",
    },
    disable_app_suggestions_start: {
      name: "Désactiver les suggestions du menu Démarrer",
      description:
        "Désactive les suggestions d'applications promotionnelles et les conseils d'utilisation dans le menu Démarrer de Windows.",
    },
    disable_handwriting_sharing: {
      name: "Désactiver le partage des erreurs d'écriture manuscrite",
      description:
        "Empêche Windows de transmettre à Microsoft les journaux d'erreurs de reconnaissance manuscrite et les tracés.",
    },
    disable_ceip: {
      name: "Désactiver le programme d'amélioration du produit (CEIP)",
      description:
        "Désactive le client de télémétrie SQM pour le programme d'amélioration du produit Windows (CEIP).",
    },
    disable_lockscreen_camera: {
      name: "Désactiver l'appareil photo sur l'écran de verrouillage",
      description:
        "Désactive le bouton et le geste de l'appareil photo sur l'écran de verrouillage pour empêcher la prise de photos sans déverrouiller l'appareil.",
    },
    disable_cortana_consent: {
      name: "Désactiver le consentement de recherche Cortana",
      description:
        "Désactive le consentement Cortana pour empêcher le partage des requêtes de recherche et des données vocales avec les services cloud Microsoft.",
    },
    disable_wer_queuing: {
      name: "Désactiver la mise en file d'attente des rapports d'erreurs",
      description:
        "Empêche le rapport d'erreurs Windows d'enregistrer et de mettre en file d'attente les rapports de plantage sur le disque.",
    },
    disable_experimentation: {
      name: "Désactiver la télémétrie d'expérimentation de Windows",
      description:
        "Désactive les tests A/B et les fonctionnalités d'expérimentation de Microsoft sur Windows, garantissant un système stable et prévisible.",
    },
    disable_app_inventory_collection: {
      name: "Désactiver l'inventaire de compatibilité des applications",
      description:
        "Désactive le collecteur d'inventaire de compatibilité qui analyse les logiciels installés et les signale à Microsoft.",
    },
    disable_problem_steps_recorder: {
      name: "Désactiver la télémétrie de l'Enregistreur d'actions",
      description:
        "Désactive la capture d'erreurs et l'envoi de données de diagnostic par l'Enregistreur d'actions utilisateur (PSR).",
    },
    disable_ait_telemetry: {
      name: "Désactiver la télémétrie d'impact des applications (AIT)",
      description:
        "Désactive la collecte de données Application Impact Telemetry (AIT) lors du lancement des logiciels.",
    },
    disable_smartscreen_app_install: {
      name: "Désactiver la télémétrie d'installation SmartScreen",
      description:
        "Désactive la télémétrie d'installation et les requêtes de vérification d'URL de SmartScreen.",
    },
    disable_online_speech_privacy: {
      name: "Désactiver la collecte de reconnaissance vocale en ligne",
      description:
        "Désactive la collecte des données vocales dans le cloud pour la saisie vocale et les modèles vocaux.",
    },
    disable_edge_shopping: {
      name: "Désactiver l'assistant shopping d'Edge",
      description:
        "Désactive l'assistant shopping et le suivi des coupons promotionnels dans Microsoft Edge.",
    },
    disable_edge_metrics: {
      name: "Désactiver les métriques de diagnostic d'Edge",
      description:
        "Désactive la transmission des métriques d'utilisation et des rapports de plantage de Microsoft Edge.",
    },
    disable_edge_startup_boost: {
      name: "Désactiver le démarrage rapide d'Edge",
      description:
        "Désactive le démarrage rapide de Microsoft Edge, empêchant les processus en arrière-plan au démarrage de Windows.",
    },
    disable_edge_background_mode: {
      name: "Désactiver le mode arrière-plan d'Edge",
      description:
        "Empêche Microsoft Edge de s'exécuter en arrière-plan lorsqu'il est fermé, libérant ainsi de la mémoire.",
    },
    disable_bluetooth_le_discovery: {
      name: "Désactiver l'analyse Bluetooth LE en arrière-plan",
      description:
        "Désactive la recherche continue en arrière-plan des périphériques Bluetooth Low Energy pour économiser le processeur et la batterie.",
    },
    disable_edge_wallet: {
      name: "Désactiver les suggestions de portefeuille d'Edge",
      description:
        "Empêche Microsoft Edge d'interroger automatiquement les services de paiement et de portefeuille.",
    },
    disable_cortana_above_lock: {
      name: "Désactiver Cortana au-dessus de l'écran de verrouillage",
      description:
        "Empêche les assistants vocaux et la recherche d'écouter ou de s'activer lorsque l'écran est verrouillé.",
    },
    disable_device_history: {
      name: "Désactiver l'historique d'activité de l'appareil",
      description:
        "Empêche Windows d'enregistrer et de suivre l'historique des applications et des fichiers sur cet appareil.",
    },
    disable_search_history: {
      name: "Désactiver l'historique de recherche de la barre des tâches",
      description:
        "Désactive l'enregistrement des requêtes de recherche passées dans la barre des tâches et le menu Démarrer.",
    },
    disable_news_and_interests: {
      name: "Désactiver le flux Actualités et centres d'intérêt",
      description:
        "Masque le widget météo et actualités de la barre des tâches Windows, économisant réseau et mémoire en arrière-plan.",
    },
    disable_auto_maintenance_wake: {
      name: "Désactiver le réveil pour maintenance automatique",
      description:
        "Empêche la maintenance automatique de Windows de réveiller l'ordinateur ou d'épuiser la batterie la nuit.",
    },
    disable_diagnostic_data_viewer: {
      name: "Désactiver le magasin de données de diagnostic local",
      description:
        "Empêche la télémétrie de diagnostic de Windows d'écrire et de réserver des bases de données de cache locales sur le disque.",
    },
    disable_activity_feed: {
      name: "Désactiver le flux d'activité et la chronologie Windows",
      description:
        "Empêche Windows de générer des graphiques de chronologie et de suivre les activités de l'utilisateur entre appareils.",
    },
    disable_publish_user_activities: {
      name: "Désactiver la publication des activités dans le cloud",
      description:
        "Empêche Windows de synchroniser l'historique des activités avec les services cloud de Microsoft.",
    },
    disable_typing_insights: {
      name: "Désactiver la télémétrie des insights de saisie",
      description:
        "Empêche Windows d'analyser vos habitudes de frappe et les statistiques de saisie semi-automatique.",
    },
    disable_inking_typing_personalization: {
      name: "Désactiver la personnalisation de l'écriture et de la saisie",
      description:
        "Empêche Windows d'envoyer à Microsoft les données du dictionnaire manuscrit et de saisie.",
    },
    disable_shared_experiences: {
      name: "Désactiver le partage entre appareils connectés",
      description:
        "Désactive la synchronisation en arrière-plan de Connected Devices Platform (CDP) entre vos comptes.",
    },
    disable_remote_desktop: {
      name: "Désactiver les connexions Bureau à distance entrantes",
      description:
        "Bloque les connexions entrantes Bureau à distance (RDP) pour réduire la surface d'attaque réseau.",
    },
    disable_edge_collections: {
      name: "Désactiver les Collections de Microsoft Edge",
      description:
        "Désactive les Collections Edge et leur synchronisation en arrière-plan pour libérer des ressources.",
    },
    disable_edge_quick_search: {
      name: "Désactiver la barre de recherche Edge sur le bureau",
      description:
        "Empêche Microsoft Edge d'afficher des barres de recherche flottantes sur le bureau Windows.",
    },
    disable_edge_personalization: {
      name: "Désactiver la personnalisation et la télémétrie d'Edge",
      description:
        "Désactive l'envoi de l'historique de navigation et les profils publicitaires dans Microsoft Edge.",
    },
    disable_lockscreen_spotlight: {
      name: "Désactiver Windows à la une sur l'écran de verrouillage",
      description:
        "Empêche le téléchargement de fonds d'écran promotionnels et d'astuces sur l'écran de verrouillage.",
    },
    disable_push_install_service: {
      name: "Désactiver le service d'installation à distance PushToInstall",
      description:
        "Empêche le Microsoft Store d'installer des applications à distance depuis le web.",
    },
    disable_compatibility_assistant: {
      name: "Désactiver l'Assistant de compatibilité des programmes",
      description:
        "Désactive les fenêtres contextuelles et les analyses en arrière-plan lors de l'exécution d'anciens programmes.",
    },
    disable_cortana_cloud_search: {
      name: "Désactiver l'indexeur cloud de Windows Search",
      description:
        "Empêche Windows Search d'interroger les index cloud et les serveurs Bing lors de la recherche de fichiers locaux.",
    },
    disable_find_my_device: {
      name: "Désactiver la localisation Trouver mon appareil",
      description:
        "Désactive la transmission continue de la position GPS et Wi-Fi pour le service Trouver mon appareil.",
    },
    disable_sensors_data_collection: {
      name: "Désactiver la collecte de données des capteurs matériels",
      description:
        "Désactive la surveillance en arrière-plan des capteurs (luminosité, accéléromètre) et de localisation.",
    },
    disable_location_scripting: {
      name: "Désactiver l'accès à la localisation pour les scripts",
      description:
        "Empêche les scripts en arrière-plan et les moteurs de navigateur d'accéder à l'emplacement physique de l'appareil.",
    },
    disable_advertising_info: {
      name: "Désactiver la stratégie d'informations publicitaires",
      description:
        "Applique une stratégie de groupe désactivant le suivi de l'identifiant publicitaire pour tous les utilisateurs.",
    },
    disable_sync_settings: {
      name: "Désactiver la synchronisation des paramètres dans le cloud",
      description:
        "Empêche Windows de synchroniser la personnalisation, les mots de passe et les préférences sur les serveurs Microsoft.",
    },
    disable_app_diagnostics_access: {
      name: "Désactiver l'accès des applications aux diagnostics",
      description:
        "Empêche les applications tierces du Store d'accéder aux informations de diagnostic et à la télémétrie.",
    },
    svchost_split_threshold: {
      name: "Consolider les processus hôtes de services",
      description:
        "Regroupe les services d'arrière-plan dans des processus partagés pour réduire le nombre de processus inactifs et l'utilisation de mémoire.",
    },
    disable_8dot3_names: {
      name: "Désactiver les noms courts NTFS 8.3",
      description:
        "Arrête la génération des noms courts DOS 8.3 sur les volumes NTFS pour accélérer la recherche et la gestion des fichiers.",
    },
    disable_ntfs_last_access: {
      name: "Désactiver l'horodatage du dernier accès NTFS",
      description:
        "Supprime les écritures disque superflues en évitant d'enregistrer la date du dernier accès lors de la lecture des fichiers.",
    },
    disable_autologger_diagtrack: {
      name: "Désactiver la session d'autologger DiagTrack",
      description:
        "Arrête l'écriture circulaire continue sur disque de la session ETW de télémétrie de DiagTrack.",
    },
    disable_autologger_sqm: {
      name: "Désactiver la session d'autologger SQM",
      description:
        "Arrête l'enregistrement sur disque en arrière-plan pour le journal de télémétrie Software Quality Metrics (SQM).",
    },
    disable_autologger_ait: {
      name: "Désactiver la session d'autologger d'événements AIT",
      description:
        "Arrête la journalisation des événements ETW pour le service Application Inventory and Telemetry (AIT).",
    },
    disable_autologger_diaglog: {
      name: "Désactiver la session d'autologger de diagnostic",
      description:
        "Arrête l'écriture circulaire sur disque pour les sessions de diagnostic et de suivi d'erreurs Windows.",
    },
    disable_autologger_wifisession: {
      name: "Désactiver la session d'autologger de diagnostic Wi-Fi",
      description:
        "Arrête la journalisation continue de la télémétrie de diagnostic pour les états de connexion Wi-Fi.",
    },
    disable_wersvc_service: {
      name: "Démarrer le rapport d'erreurs Windows uniquement sur demande",
      description:
        "Arrête le service Rapport d'erreurs Windows (WerSvc) et le configure sur Manuel pour réduire les activités en arrière-plan.",
    },
    disable_mapsbroker_service: {
      name: "Désactiver le service Gestionnaire de cartes téléchargées",
      description:
        "Arrête et désactive le service Gestionnaire de cartes téléchargées (MapsBroker) pour empêcher les vérifications réseau en arrière-plan.",
    },
    disable_lfsvc_service: {
      name: "Démarrer le service de géolocalisation uniquement sur demande",
      description:
        "Arrête le service de géolocalisation Windows (lfsvc) et le configure sur Manuel, évitant la recherche constante de localisation.",
    },
    ads_in_settings: {
      name: "Masquer les contenus promotionnels dans Paramètres",
      description:
        "Définit à 0 la valeur utilisateur SubscribedContent-338393Enabled. Les autres surfaces de suggestions Windows ne sont pas modifiées.",
    },
    quick_access_no_cloud: {
      name: "Masquer les fichiers cloud dans Accès rapide",
      description:
        "Définit ShowCloudFilesInQuickAccess à 0. Les éléments Récents et Fréquents ont des paramètres distincts et ne sont pas modifiés.",
    },
    hide_gallery_explorer: {
      name: "Masquer Galerie dans l’Explorateur de fichiers",
      description:
        "Définit la valeur utilisateur HideGallery à 1. Masque l’entrée Galerie du volet de navigation ; les photos ne sont ni supprimées ni déplacées.",
    },
    snap_assist_off: {
      name: "Limiter les suggestions Snap Assist",
      description:
        "Désactive le réglage des suggestions Snap Assist. Il ne modifie pas le réglage distinct du volet Snap Layouts ; certaines suggestions liées à l’ancrage peuvent donc rester visibles.",
    },
    alt_tab_no_browser_tabs: {
      name: "Afficher les fenêtres, pas les onglets Edge, avec Alt+Tab",
      description:
        "Empêche les onglets Microsoft Edge d’apparaître comme entrées Alt+Tab distinctes. Les onglets restent ouverts ; seul le sélecteur de fenêtres change.",
    },
    taskbar_button_combining: {
      name: "Regrouper les boutons de la barre des tâches",
      description:
        "Définit TaskbarGlomLevel à 0 et regroupe les fenêtres d’une même application sous un seul bouton. Les fenêtres individuelles sont moins visibles.",
    },
    no_toasts_fullscreen_video: {
      name: "Désactiver les bannières de notification",
      description:
        "Définit NOC_GLOBAL_SETTING_TOASTS_ENABLED à 0. Les notifications peuvent aussi être masquées hors lecture vidéo en plein écran.",
    },
    no_window_snap_drag: {
      name: "Désactiver l’ancrage lors du déplacement des fenêtres",
      description:
        "Définit WindowArrangementActive à 0 pour désactiver l’ancrage déclenché en faisant glisser une fenêtre. D’autres raccourcis de gestion des fenêtres peuvent rester actifs.",
    },
    ui_classic_context_menu: {
      name: "Afficher le menu contextuel classique",
      description:
        "Crée un remplacement Explorer réservé à l’utilisateur pour afficher le menu contextuel classique plutôt que celui, compact, de Windows 11. Il peut être nécessaire de redémarrer Explorer ou de fermer la session.",
    },
  },
  cleanup: {
    temp_cleanup: {
      name: "Nettoyer les fichiers temporaires",
      description:
        "Déplace le contenu de %TEMP% vers la Corbeille : récupérable à tout moment, ce n'est pas une suppression définitive.",
    },
    winupdate_cache_cleanup: {
      name: "Vider le cache de Windows Update",
      description:
        "Déplace vers la Corbeille les paquets Windows Update déjà installés (droits administrateur requis).",
    },
  },
};
