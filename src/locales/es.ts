import type { Strings } from "../i18n";

/**
 * The Spanish table, on its own so the app can ship one language and
 * fetch the others on demand (Batch Z). It is data only: no logic lives here.
 */
export const es: Strings = {
  coffee: {
    nav: "Invítame a un café",
    cta: "Financia la próxima versión",
    fewer: "Un café menos",
    more: "Un café más",
  },
  appName: "WinCraft",
  appliedCount: "{applied} de {total} ajustes activos",
  headerNote:
    "Revisa cada cambio antes de aplicarlo. Las herramientas de restauración cubren los ajustes compatibles; las operaciones de limpieza y reparación tienen distintos límites de recuperación.",
  advisor: {
    eyebrow: "Recomendado para tu PC",
    applyButton: "Aplicar",
    confidenceHigh: "Confianza alta — basado en el hardware de este PC",
    confidenceStandard: "Recomendado para este tipo de equipo",
    reversible: "Reversible: el valor original se guarda antes de cada cambio.",
    empty: "Nada que recomendar ahora mismo: tu configuración ya sigue nuestros consejos.",
  },
  drift: {
    pickHint: "Desmarca lo que hayas cambiado a propósito.",
    titleAfterUpdate: "Windows volvió a cambiar tus ajustes",
    titleNoUpdate: "Algunos ajustes ya no están activos",
    afterUpdateOne:
      "Tras actualizar a {patch}, un ajuste que habías aplicado ya no está activo en el sistema.",
    afterUpdateMany:
      "Tras actualizar a {patch}, {count} ajustes que habías aplicado ya no están activos en el sistema.",
    noUpdateOne:
      "Un ajuste que habías aplicado ya no está activo en el sistema. No hubo ninguna actualización de Windows entretanto, así que lo cambió otra cosa.",
    noUpdateMany:
      "{count} ajustes que habías aplicado ya no están activos en el sistema. No hubo ninguna actualización de Windows entretanto, así que los cambió otra cosa.",
    reapplyOne: "Volver a aplicar el ajuste",
    reapplyMany: "Volver a aplicar {count} ajustes",
    reapplying: "Aplicando...",
    reappliedOne: "Ajuste aplicado de nuevo.",
    reappliedMany: "{count} ajustes aplicados de nuevo.",
  },
  crashes: {
    title: "Cierres inesperados",
    subtitle:
      "La aplicación se cerró sola. El informe se queda en este PC: cópialo y envíalo por Discord o GitHub si quieres que lo arregle.",
    copy: "Copiar informe",
    copied: "Informe copiado al portapapeles.",
    clear: "Borrar",
    cleared: "Informes borrados.",
    processApp: "ventana principal",
    processElevated: "operación con permisos de administrador",
  },
  ledger: {
    guardPaused: "Ajustes de aplicaciones en pausa",
    guardResumed: "Ajustes de aplicaciones reanudados",
    processes: "Procesos: {count}",
    restored: "Restaurado",
    postponed: "Aplazada mientras había un juego abierto",
    title: "Registro de cambios",
    subtitle:
      "Todo lo que esta aplicación cambió en este PC, de más reciente a más antiguo. Guardado en local, nunca se sube.",
    empty: "Aún no hay cambios registrados. Aplica tu primer ajuste y aparecerá aquí.",
    clear: "Borrar historial",
    clearing: "Borrando...",
    cleared: "Historial borrado.",
    revert: "Revertir",
    elevated: "con permisos de admin",
    failed: "falló",
    actions: {
      processGuard: "Juego que se gestiona solo",
      coreSteering: "Asignación de núcleos",
      ramTrim: "Limpieza de RAM",
      autoReverted: "Deshecho automáticamente",
      priorityRule: "Regla de prioridad",
      scheduledCleanup: "Limpieza programada",
      ecoqos: "Eficiencia de aplicaciones en segundo plano",
      applied: "Ajuste aplicado",
      reverted: "Ajuste revertido",
      cleanup: "Limpieza",
      filesDeleted: "Archivos eliminados",
      diskOptimize: "Optimización del disco",
      startupChange: "Cambio de inicio",
      restorePoint: "Punto de restauración",
    },
  },
  tabs: {
    groupWorkspace: "Espacio de trabajo",
    overview: "Resumen",
    groupMonitor: "Supervisar",
    groupOptimize: "Optimizar",
    groupManage: "Gestionar",
    scan: "Análisis",
    health: "Salud del PC",
    hardware: "Hardware",
    performance: "Rendimiento",
    privacy: "Privacidad",
    ui: "Interfaz",
    maintenance: "Mantenimiento",
    gaming: "Gaming",
    startup: "Inicio",
    profiles: "Perfiles",
    pricing: "Planes y precios",
    ledger: "Historial de cambios",
  },
  healthPanel: {
    title: "Puntuación de salud",
    subtitle: "Una puntuación explicable: cada número muestra los hechos de los que se calcula.",
    why: "¿Por qué {score}?",
    refresh: "Recalcular",
    compute: "Calcular la puntuación",
    showMore: "Ver detalles",
    showLess: "Ocultar detalles",
    stageProfile: "Leyendo el perfil del sistema",
    stageTweaks: "Comprobando tweaks aplicados",
    stageSecurity: "Leyendo el estado de seguridad",
    stageScoring: "Calculando la puntuación",
    verdictExcellent: "EXCELENTE",
    verdictGood: "BUENO",
    verdictFair: "ACEPTABLE",
    verdictNeedsWork: "MEJORABLE",
    computing: "Analizando...",
    idleHint:
      "Nada se ejecuta en segundo plano: la puntuación se calcula solo cuando lo pides, íntegramente en este PC.",
    changeSinceLast: "desde tu última comprobación",
    changeNone: "Sin cambios desde tu última comprobación.",
    changeFirstRun:
      "Primera medición registrada. Vuelve a ejecutarla tras un cambio para ver qué se movió.",
    changeWhyTitle: "Por qué cambió la puntuación",
    changeContributes: "Contribución a la puntuación global:",
    changeStructural:
      "Una actualización de la aplicación cambió qué categorías se evalúan: parte de esta diferencia no viene de tu PC.",
    changeTrend: "Evolución",
    categories: {
      performance: "Rendimiento",
      gaming: "Gaming",
      responsiveness: "Capacidad de respuesta",
      memory: "Memoria",
      storage: "Almacenamiento",
      startup: "Inicio",
      maintenance: "Mantenimiento",
      privacy: "Privacidad",
      security: "Seguridad",
    },
  },
  transparency: {
    title: "Qué modifica exactamente",
    key: "Clave",
    value: "Valor",
    setsTo: "Lo establece en",
    note: "El valor anterior se guarda antes de escribir, así que la reversión lo restaura exactamente como estaba.",
    kindRegistry: "Registro",
    kindCommand: "Comando",
    kindService: "Servicio",
    copy: "Copiar",
    copied: "Copiado",
  },
  command: {
    statusQuiet: "Todo en calma",
    statusScanning: "Analizando...",
    statusFindings: "{count} recomendaciones listas",
    domainsLine: "Inicio · Almacenamiento · Memoria · Privacidad · Rendimiento · Actualizaciones",
    consent: "Nada cambia sin tu aprobación.",
    runScan: "Iniciar análisis del sistema",
    reviewFindings: "Revisar {count} recomendaciones",
    memTitle: "Presión de memoria",
    pressureLow: "Baja",
    pressureElevated: "Elevada",
    pressureHigh: "Alta",
    memReview: "Revisar uso de memoria",
    memTopTitle: "Procesos principales",
    trimTitle: "Recortar working sets",
    trimExplainer:
      "Pide al administrador de memoria de Windows que saque las páginas inactivas de los working sets de las apps. Útil con presión alta; las apps pueden recargar páginas brevemente. No se pierde ningún dato. Windows pide permiso de administrador.",
    trimButton: "Recortar ahora",
    autoTitle: "Recorte automático",
    profilesTitle: "Perfiles de sesión",
    profileGame: "Sesión de juego",
    profileGameDesc: "Prepara el PC para jugar: energía, prioridad y captura DVR.",
    profileFocus: "Concentración",
    profileFocusDesc: "Menos distracciones y actividad no esencial bajo control.",
    profileQuiet: "Sesión silenciosa",
    profileQuietDesc: "Eficiencia, batería y bajo ruido primero.",
    profileDownload: "Sesión de descarga",
    profileDownloadDesc: "Controla el ancho de banda y la actividad en segundo plano.",
    previewBtn: "Vista previa de cambios",
    gameChange1: "Desactiva Game DVR (captura en segundo plano)",
    gameChange2: "Cambia al plan de energía Alto rendimiento",
    gameChange3: "Optimiza la prioridad de CPU para juegos (Win32PrioritySeparation)",
    previewReq: "Requiere derechos de administrador",
    previewCost: "Coste potencial: mayor consumo y calor mientras está activa.",
    previewRevert: "Reversible con un clic: cada valor original se guarda antes.",
    applySession: "Iniciar sesión",
    restoreSession: "Restaurar",
    statusActive: "Activa",
    statusOff: "No activa",
    soon: "Próximamente",
  },
  systemMonitor: {
    cpu: "CPU",
    ram: "Memoria",
    disk: "Disco",
    uptime: "Encendido desde hace",
    uptimeValue: "{hours} h {minutes} min",
    cores: "{count} núcleos",
  },
  startupManager: {
    title: "Programas de inicio",
    description:
      "Los programas que se abren solos al encender el PC. Desactivar algunos acorta el tiempo de arranque: el programa sigue instalado y puedes abrirlo a mano igualmente.",
    empty: "Ningún programa configurado para iniciarse automáticamente.",
    activeCount: "Activos: {enabled} / {total}",
    machineWide: "Todos los usuarios",
    impactNote: "Desactivar no desinstala nada y es reversible en cualquier momento.",
    refresh: "Actualizar",
    refreshing: "Reanalizando...",
    hiddenOrphans: "{count} entradas ocultas: el programa ya no está instalado.",
    locationRun: "Registro",
    locationRun32: "Registro (32 bits)",
    locationFolder: "Carpeta de Inicio",
  },
  systemRepair: {
    title: "Comprobación y reparación de Windows",
    description:
      "Comprueba si los archivos de sistema y el almacén de componentes de Windows están intactos y, si no lo están, los repara desde los servidores de Microsoft. Son las mismas herramientas DISM y SFC que pide ejecutar el soporte de Microsoft, sin línea de comandos.",
    adminNote:
      "Requiere permisos de administrador: Windows los pide una sola vez y se crea un punto de restauración antes de cualquier cambio.",
    timeNote:
      "Una reparación completa puede tardar 20 minutos o más. Puedes seguir usando el PC: solo no lo apagues.",
    checkButton: "Comprobar integridad",
    checking: "Comprobando...",
    cleanupButton: "Reducir el almacén de componentes",
    cleaningUp: "Reduciendo...",
    cleanupNote:
      "Elimina de WinSxS las versiones de componentes ya sustituidas. Las actualizaciones instaladas hace poco se pueden seguir desinstalando.",
    runningNote: "No apagues ni reinicies el PC mientras se ejecuta.",
    cannotStop:
      "Una vez iniciado no se puede detener: Windows está comprobando y reparando sus propios archivos del sistema, y cortarlo a mitad podría dejarlos reparados solo en parte. Mientras tanto puedes seguir usando el PC y WinCraft.",
    stepQuick: "Lectura rápida del estado",
    stepScan: "Comprobando el almacén de componentes",
    stepRestore: "Reparando el almacén de componentes",
    stepSfc: "Comprobando los archivos de sistema",
    stepCleanup: "Reduciendo el almacén de componentes",
    stepOf: "Paso {index} de {total}",
    statusHealthy: "Windows está intacto",
    statusRepairable: "Se han encontrado daños, pero son reparables",
    statusRepaired: "Daños encontrados y reparados",
    statusUnrepairable: "Se han encontrado daños que no se han podido reparar",
    statusCompleted: "Finalizado",
    hintUnrepairable:
      "El siguiente paso suele ser una actualización in situ de Windows. El código de error está en la salida de abajo.",
    hintCompleted:
      "Las herramientas se han ejecutado. Con el idioma de tu Windows el resultado no se ha podido leer automáticamente: los detalles están en la salida de abajo.",
    logTitle: "Salida",
    askRepair: "¿Quieres repararlo ahora?",
    askRepairYes: "Sí, reparar ahora",
    askRepairNo: "Ahora no",
    repairAnyway: "Ejecutar una reparación completa de todos modos",
    elapsed: "{time} transcurridos",
    holdingAt:
      "Sigue al {percent}% tras {time}. DISM se queda en el mismo porcentaje durante varios minutos mientras Windows reconstruye los componentes en segundo plano: no se ha bloqueado.",
    remaining: "~{minutes} min",
    underMinute: "< 1 min",
    estimating: "Calculando...",
    statElapsed: "Transcurrido",
    statRemaining: "Restante",
    statFinish: "Fin prevista",
    waiting: "En espera",
  },
  cookieCleaner: {
    title: "Limpieza selectiva de cookies",
    description:
      "Elimina las cookies de rastreo y publicidad y conserva las que mantienen tus sesiones abiertas. En los sitios de tu lista sigues con la sesión iniciada.",
    scanButton: "Analizar cookies",
    scanning: "Analizando...",
    cleanButton: "Limpiar",
    cleaning: "Limpiando...",
    noneFound: "No se han encontrado cookies de navegador en este PC.",
    totals: "{removable} para eliminar, {protected} cookies de sesión conservadas",
    runningWarning: "Cierra {browser} para limpiarlo. Las cifras de arriba ya son exactas.",
    backupNote:
      "La base de datos de cookies se copia antes de limpiar, así que la operación se puede deshacer.",
    restoreButton: "Deshacer la última limpieza",
    restoring: "Restaurando...",
    restoredToast: "{browser}: cookies restauradas desde la última copia.",
    cleanedToast: "{removed} cookies eliminadas, {kept} sesiones conservadas.",
    nothingToClean: "No hay nada que eliminar: todas las cookies están en tu lista.",
    topDomains: "La mayoría de las cookies vienen de",
    whitelistTitle: "Sitios en los que seguir con la sesión iniciada",
    whitelistNote:
      "También valen los subdominios: al añadir google.com se conserva igualmente accounts.google.com.",
    whitelistPlaceholder: "ejemplo.com",
    whitelistAdd: "Añadir",
    whitelistRemove: "Quitar",
    whitelistReset: "Restaurar los valores predeterminados",
  },
  appCache: {
    title: "Cachés de programas de terceros",
    description:
      "Las cachés de sombreadores, los lanzadores de juegos, las apps de mensajería y los gestores de paquetes acumulan gigabytes de archivos que ellos mismos reconstruyen. Esto los busca en los programas que realmente tienes instalados.",
    scanButton: "Analizar cachés",
    scanning: "Analizando...",
    cleanButton: "Limpiar lo seleccionado",
    cleaning: "Limpiando...",
    noneFound: "No se han encontrado cachés de terceros en este PC.",
    permanentNote:
      "Estos archivos se eliminan de forma definitiva y no van a la Papelera: enviar gigabytes allí no libera nada hasta vaciarla. Todo lo que aparece aquí lo reconstruye por su cuenta el programa que lo creó.",
    blockedBy: "{process} está en ejecución, así que sus archivos se omitirán.",
    selectedTotal: "{size} seleccionados",
    cleanedToast: "{freed} liberados.",
    skippedNote: "{count} archivos estaban en uso y se han dejado intactos.",
    catShaders: "Cachés de sombreadores",
    catLaunchers: "Lanzadores de juegos",
    catApps: "Aplicaciones",
    catDev: "Herramientas de desarrollo",
    catWindows: "Windows",
    names: {
      shader_dx: "Caché de sombreadores DirectX",
      shader_nvidia: "Caché de sombreadores NVIDIA",
      shader_amd: "Caché de sombreadores AMD",
      shader_intel: "Caché de sombreadores Intel",
      steam: "Caché web de Steam",
      epic: "Caché de Epic Games Launcher",
      battlenet: "Caché de Battle.net",
      discord: "Caché de Discord",
      vscode: "Caché de Visual Studio Code",
      npm: "Caché de paquetes npm",
      pip: "Caché de paquetes pip",
      crash_dumps: "Volcados de bloqueo de aplicaciones",
      error_reports: "Informes de errores de Windows",
    },
  },
  scheduledTasks: {
    title: "Tareas programadas al inicio",
    description:
      "Actualizadores y servicios en segundo plano que arrancan al iniciar sesión o al encender el PC desde el Programador de tareas, donde la lista de Inicio de Windows no los muestra. Las tareas propias de Windows no aparecen aquí.",
    empty: "No hay tareas de terceros al inicio en este PC.",
    activeCount: "Activas: {enabled} / {total}",
    triggerLogon: "Al iniciar sesión",
    triggerBoot: "Al encender",
    refresh: "Actualizar",
    refreshing: "Releyendo...",
    note: "Desactivar una tarea no desinstala nada y puedes volver a activarla cuando quieras.",
  },
  search: {
    placeholder: "Buscar un ajuste...",
    noResults: 'Sin resultados para "{query}".',
    clear: "Borrar",
  },
  pricing: {
    title: "Gratis para todos",
    intro:
      "WinCraft es gratis y de código abierto: todas las herramientas incluidas, sin suscripción y sin funciones de pago.",
    planName: "Todo incluido",
    planTagline:
      "Todas las herramientas, todos los ajustes, todas las funciones: sin restricciones.",
    priceAmount: "$0",
    priceNote: "para siempre",
    features: [
      "Todos los ajustes y optimizaciones del sistema",
      "Herramientas avanzadas de gaming y privacidad",
      "Limpieza de disco, desfragmentación y reparación del sistema",
      "Actualización de controladores y diagnóstico del hardware",
      "Sesiones de juego y perfiles de monitorización",
      "Purga de memoria Zero-Trace y destrucción segura de archivos",
      "Todas las actualizaciones futuras incluidas",
    ],
    commitmentTitle: "Nuestro compromiso",
    commitmentBody:
      "WinCraft es y seguirá siendo gratis. Todos deberían poder usar herramientas que ayuden a entender y optimizar su PC: sin costes ocultos, sin funciones bloqueadas, sin suscripciones.",
  },
  toggle: { on: "Activado", off: "Desactivado" },
  driverBooster: {
    title: "Driver Booster",
    subtitle:
      "Elige los controladores que se están quedando atrás y abre todas sus páginas de descarga de una vez.",
    scan: "Analizar controladores",
    scanning: "Analizando...",
    selectAll: "Seleccionar todo",
    selectNone: "Quitar selección",
    selectedCount: "{selected} de {total} seleccionados",
    pagesForSelection: "{pages} páginas por abrir",
    openSelected: "Abrir páginas de descarga ({count})",
    opened: "{count} páginas abiertas",
    openedCapped:
      "Abiertas {opened} de {total} páginas: las demás siguen seleccionadas, vuelve a ejecutarlo.",
    allCurrent: "Ningún controlador aparenta su edad.",
    nothingActionable: "Ningún controlador antiguo tiene una página del fabricante que abrir.",
    note: "WinCraft no descarga paquetes de controladores por su cuenta: no existe una API del fabricante que diga cuál es la versión correcta para tu dispositivo exacto, e instalar el controlador de vídeo equivocado es uno de los pocos errores que puede dejarte sin pantalla. Esto automatiza la parte tediosa — encontrar las páginas — no la elección. Para los controladores que Windows Update sí conoce, usa el botón de arriba.",
  },
  secureDefrag: {
    title: "Desfragmentación segura",
    willDefrag: "Este disco es mecánico: se ejecutará una desfragmentación real.",
    willRetrim:
      "Este disco no está confirmado como mecánico: se analiza el volumen completo y luego se ejecuta un retrim en vez de una desfragmentación. El retrim dura segundos y solo afecta al espacio libre — eso es lo que hace: indica al controlador qué bloques ya no se usan. Desfragmentar un SSD no lo acelera, solo lo desgasta.",
    start: "Iniciar",
    running: "En curso...",
    working: "Procesando...",
    phaseAnalyze: "Analizando",
    phaseOptimize: "Optimizando",
    analysisTitle: "Informe de análisis",
    doneDefrag: "Desfragmentación completada.",
    doneRetrim: "Retrim completado.",
    note: "Antes se crea un punto de restauración. El porcentaje viene de Windows, no de un temporizador.",
  },
  zeroTrace: {
    title: "Zero-Trace Cleaner",
    subtitle:
      "Borra lo que los programas cerrados dejan en memoria y destruye archivos sin posible recuperación.",
    purgeTitle: "Purga de memoria",
    purgeBody:
      "Windows mantiene en RAM las páginas de los programas cerrados como caché. Esto las libera: los fragmentos que deja un proceso terminado desaparecen de verdad de la memoria física.",
    purgeButton: "Purgar memoria",
    purging: "Purgando...",
    purgeResult: "Liberados {freed} MB — ahora {after} MB libres",
    purgeLimit:
      "No toca el archivo de paginación ni el de hibernación: están en disco y Windows no ofrece ninguna API para limpiarlos en caliente.",
    shredTitle: "Destrucción segura de archivos",
    shredBody:
      "Sobrescribe el contenido del archivo en tres pasadas antes de eliminarlo, dejándolo fuera del alcance de las herramientas de recuperación habituales.",
    shredButton: "Elegir archivos...",
    shredding: "Destruyendo...",
    shredDone: "{count} archivos destruidos ({size})",
    shredSummary: "{shredded} destruidos, {skipped} omitidos",
    shredWarning: "Definitivo: sin Papelera, sin recuperación.",
    ssdCaveat:
      "En un SSD, el nivelado de desgaste casi siempre escribe en celdas distintas del original. Las antiguas se liberan, no se reescriben: solo el borrado seguro del disco puede garantizar más.",
  },
  hud: {
    title: "Overlay de juego",
    subtitle:
      "Un panel transparente sobre el juego: carga de CPU/GPU, temperaturas, VRAM, proceso activo con su prioridad e indicador de cuello de botella.",
    fpsAbout:
      "Los FPS se cuentan a partir de los eventos de presentación que Windows emite en cada fotograma: la misma fuente que lee PresentMon, sin enganchar nada al juego. Requiere iniciar como administrador, porque abrir una sesión de rastreo es una operación privilegiada.",
    fpsLowExplained:
      "Junto al promedio aparece DROP: la velocidad del uno por ciento peor de fotogramas, lo que en otros sitios llaman «1% low». Es la cifra que se mueve cuando el juego tironea, mientras el promedio sigue alto y no lo cuenta. Cuanto más cerca esté DROP del promedio, más fluido va el juego.",
    fpsStart: "Medir FPS",
    fpsStop: "Detener medición",
    fpsNeedsAdmin: "Para medir los FPS hay que iniciar WinCraft como administrador.",
    fpsRunning: "Midiendo: los FPS aparecen en el overlay en cuanto un juego empieza a dibujar.",
    show: "Mostrar",
    hide: "Ocultar",
    lock: "Bloquear",
    unlock: "Desbloquear",
    dragHint: "Arrastra la superposición donde quieras y bloquéala antes de iniciar el juego.",
    lockedHint: "Bloqueada: los clics la atraviesan y llegan al juego. Desbloquéala para moverla.",
    sizeCompact: "Compacto",
    sizeNormal: "Normal",
  },
  updater: {
    title: "Actualización disponible: v{version}",
    body: "Se descarga e instala en un solo paso; la aplicación se reinicia sola al terminar.",
    install: "Instalar y reiniciar",
    later: "Más tarde",
    downloading: "Descargando... {percent}%",
    installing: "Instalando...",
    error: "Error al actualizar: {message}",
    checkFailed: "Error al comprobar actualizaciones: {message}",
  },
  badges: { admin: "Admin", soon: "PRÓXIMAMENTE" },
  emptyCategory: "Todavía no hay ajustes disponibles en esta categoría — próximamente.",
  gameSessions: {
    title: "Game Sessions",
    subtitle:
      "Detecta automáticamente tus juegos y aplica/revierte el preset Turbo Gaming por sí solo.",
    active: "Sesión activa: {name}",
    gamesCount: "{count} juegos registrados",
    addGame: "+ Añadir juego (.exe)",
    steeringTitle: "Asignación de núcleos",
    steeringVcache:
      "El juego se ejecuta en el die con 3D V-Cache ({count} hilos). Las demás aplicaciones siguen donde las coloca Windows.",
    steeringHybrid:
      "El juego se ejecuta en los núcleos de rendimiento ({game} hilos) y las demás aplicaciones de tu sesión pasan a los núcleos de eficiencia ({background} hilos). Las aplicaciones a las que subiste la prioridad por encima de lo normal no se tocan.",
    steeringActive: "{count} procesos asignados para este juego.",
    steeringNone:
      "No hay nada que asignar en esta CPU: no se encontró un tipo de núcleo más rápido ni una caché más grande que las demás.",
    steeringActiveVcache: "El juego se está ejecutando en el die con V-Cache.",
    steeringNeedsSessions:
      "Solo funciona con Game Sessions activado y mientras uno de tus juegos está en ejecución.",
  },
  latencyTrace: {
    title: "Latencia de DPC e interrupciones",
    subtitle:
      "Mide cuánto duran las llamadas a procedimientos diferidos (DPC) y las rutinas de servicio de interrupción (ISR) de cada controlador, leídas directamente del kernel de Windows. No cambia nada; requiere permisos de administrador.",
    duration: "Duración",
    secondsOption: "{seconds} s",
    run: "Medir",
    running: "Midiendo durante {seconds} s…",
    dpcSummary:
      "DPC más larga: {max} ms (límite {limit} ms). {over} de {count} superaron el límite.",
    isrSummary:
      "Rutina de interrupción más larga: {max} ms (límite {limit} ms). {over} de {count} superaron el límite.",
    colDriver: "Controlador",
    colDpc: "DPC más larga",
    colIsr: "Interrupción más larga",
    colOver: "Por encima del límite",
    unattributed: "Sin atribuir",
    hidden:
      "Windows ocultó las direcciones de los controladores, así que las rutinas no se pudieron atribuir.",
    verdictGood: "Ningún controlador superó los límites de Microsoft durante esta medición.",
    note: "Recomendación de Microsoft: una DPC debería terminar en menos de 0,1 ms y una ISR en menos de 0,025 ms. dxgkrnl.sys reparte las interrupciones de pantalla, así que su tiempo suele corresponder al controlador gráfico.",
    verdictBad:
      "{driver} ocupó un procesador durante {max} ms seguidos. Los bloqueos de más de un milisegundo pueden provocar chasquidos de audio y tirones en el tiempo de fotograma; actualizar ese controlador o volver a la versión anterior suele solucionarlo.",
    verdictMinor:
      "{over} rutinas superaron la recomendación de Microsoft; la más larga duró {max} ms. Excesos tan breves como estos son habituales y rara vez audibles.",
    lost: "Windows perdió {events} eventos y {buffers} búferes durante la medición, así que los tiempos máximos mostrados son un mínimo.",
    verdictBadUnattributed:
      "Una rutina que no se pudo atribuir a ningún controlador ocupó un procesador durante {max} ms seguidos. Los bloqueos de más de un milisegundo pueden provocar chasquidos de audio y tirones en el tiempo de fotograma.",
    spikesTitle: "Rutinas individuales más largas",
    spikeLine: "{kind} de {duration} ms en {driver}, a los {at} s de empezar",
  },
  networkCheck: {
    title: "Comprobación de red",
    subtitle:
      "Envía 32 pings a 1.1.1.1 y abre una conexión TCP, y luego muestra lo que hace realmente la pila de red de Windows. No cambia nada.",
    run: "Comprobar",
    running: "Comprobando…",
    offline: "No hay conexión a Internet.",
    rtt: "Ida y vuelta: mediana {median} ms (mín. {min}, máx. {max})",
    jitter: "Fluctuación (jitter): {jitter} ms",
    loss: "Respuestas: {received} de {sent}",
    tcpRtt: "Ida y vuelta según la pila TCP: {rtt} ms",
    nagleOn:
      "Las conexiones nuevas empiezan con el algoritmo de Nagle activado (TCP_NODELAY desactivado). Las aplicaciones que necesitan desactivarlo lo hacen en sus propios sockets.",
    nagleOff: "Las conexiones nuevas empiezan con el algoritmo de Nagle desactivado.",
    buffers:
      "Búfer de recepción: {reserved} reservados por socket, {autotuned} ajustados automáticamente por Windows",
    verdictNone:
      "Un ping no pasa por los ajustes de TCP, así que estas lecturas describen la propia conexión.",
    verdictInconclusive: "Muy pocas respuestas para comparar.",
    verdictLineChanged:
      "La propia línea cambió entre las dos lecturas (mediana {delta} ms). Un ping no pasa por los ajustes de TCP, así que no es el efecto del cambio.",
    lastTitle: "Tras {tweak}, {time}",
    socketsBeforeAfter:
      "Sockets nuevos, antes → después: Nagle {nagleBefore} → {nagleAfter}, búfer de recepción {bufBefore} → {bufAfter}",
    stateOn: "activado",
    stateOff: "desactivado",
  },
  turboBoost: {
    title: "Turbo Boost",
    subtitle:
      "Ajusta el modo turbo y el estado mínimo del procesador. El consumo y el calor pueden aumentar; los resultados dependen de la carga de trabajo.",
    startLabel: "Iniciar",
    stopLabel: "Detener",
    activating: "Activando turbo...",
    deactivating: "Restaurando...",
    active: "Turbo activo",
    inactive: "Turbo no activo",
    loadLabel: "CARGA CPU",
    loadCadence: "Medida cada segundo, suavizada en unos 3 segundos",
    ownLoad: "En los últimos segundos: el propio WinCraft {own} % · todo lo demás {rest} %",
    stageReading: "Leyendo el plan de energía",
    stageRaising: "Elevando el limite de boost",
    stageApplying: "Aplicando al sistema",
    stageMeasuringBefore: "Midiendo antes",
    stageMeasuringAfter: "Midiendo de nuevo",
    factAverage: "Velocidad media ahora",
    factFastest: "Núcleo más rápido ahora",
    factPeak: "Máximo en esta sesión",
    factFloor: "Estado mínimo del procesador",
    ofBase: "{pct} % de la frecuencia base",
    usersTitle: "Quién usa la CPU ahora",
    appliedAt:
      "Activado el {time} · modo turbo Agresivo, estado mínimo del procesador al 100 % con corriente",
    planAlreadyUses: "El plan de energía actual ya usa estos ajustes.",
    planAlreadyHad:
      "El plan de energía actual ya tenía estos ajustes, así que no cambió ningún valor.",
    loadExplain:
      "La carga es cuánto trabajo hace el procesador; Turbo Boost cambia lo rápido que puede ir, no lo ocupado que está. Un valor alto significa que hay programas trabajando en este PC ahora mismo.",
    chartLoad: "Carga",
    chartSpeed: "Velocidad",
    testTitle: "La misma prueba en cada modo",
    testHint:
      "Una carga fija de 3 segundos. Ejecútala una vez en cada modo para ver qué cambia con el boost.",
    testRun: "Ejecutar prueba de 3 segundos",
    testRunning: "Probando…",
    colDefault: "Predeterminado",
    colBoost: "Boost",
    rowWork: "Trabajo hecho",
    rowAvg: "Velocidad media",
    rowPeak: "Velocidad máxima",
    rowTemp: "Temperatura de la CPU",
    notRun: "Aún sin ejecutar",
    relative: "{pct} % del predeterminado",
  },
  profiles: {
    title: "Tus perfiles",
    subtitle:
      "Guarda tus ajustes activos en un perfil. Reutiliza una configuración o expórtala a otro PC.",
    saveHeading: "Guardar los ajustes activos",
    namePlaceholder: "Nombre (p. ej. Gaming)",
    saveButton: "Guardar",
    savedHeading: "Perfiles guardados",
    empty: "Todavía no hay perfiles guardados.",
    tweakCount: "{count} ajustes",
    apply: "Aplicar",
    applying: "Aplicando...",
    exportButton: "Exportar",
    importButton: "Importar de archivo",
    deleteButton: "Eliminar",
    savedToast: 'Configuración "{name}" guardada',
    appliedToast: "{count} ajustes aplicados",
    exportedToast: "Archivo exportado",
    importedToast: "Importada: {count} ajustes listos para revisar",
    droppedWarning: "Se descartaron {count} entradas que esta versión no reconoce",
    nameRequired: "Ponle un nombre a la configuración",
    reviewNotice: "Una configuración importada nunca se aplica sola: la revisas tú antes.",
    signInRequired: "Inicia sesión o crea una cuenta para guardar configuraciones.",
  },
  scan: {
    lastScan: "Último análisis: {time}",
    neverScanned: "Aún no hay análisis completados",
    extraChecks: "Comprobaciones adicionales",
    checksHint:
      "Solo lecturas del sistema: no se cambia nada automáticamente. Abre una categoría para ver los detalles.",
    unavailable: "Comprobación no disponible",
    startupSummary: "{enabled} activos · {orphaned} destinos ausentes",
    tasksSummary: "{enabled} tareas de inicio activas",
    partialScan: "Resultados parciales: algunas comprobaciones no están disponibles.",
    scanFailed: "El análisis falló. Inténtalo de nuevo.",
    title: "Análisis rápido",
    subtitle:
      "Comprueba el estado de tu PC y encuentra optimizaciones que aún no están activas, en un clic.",
    startLabel: "SCAN",
    stepPerformance: "Rendimiento",
    stepPrivacy: "Privacidad",
    stepGaming: "Gaming",
    stepJunk: "Archivos temporales",
    allGood: "Todo bien — no se encontraron problemas.",
    issuesFound: "{count} optimizaciones disponibles",
    selectAll: "Seleccionar todo",
    deselectAll: "Deseleccionar todo",
    fixAll: "Corregir todo",
    fixing: "Corrigiendo {done}/{total}...",
    fixedToast: "{count} problemas corregidos.",
    scanAgain: "Analizar de nuevo",
    verdictRecommended: "Recomendado en este PC",
    verdictNotRecommended: "No recomendado en este PC",
    verdictUnsupported: "No compatible",
    reasons: {
      laptop_battery: "este PC es un portátil: cuesta más batería de lo que aporta",
      hdd_index_cost:
        "el disco del sistema es mecánico, así que la indexación en segundo plano se nota",
      fast_disk_no_gain:
        "el disco del sistema es NVMe, lo bastante rápido para que la mejora sea insignificante",
      needs_win10_2004: "requiere Windows 10 versión 2004 o posterior",
      weak_gpu: "gráficos integrados: la transparencia les cuesta rendimiento aprovechable",
    },
    thisPc: "Este PC",
    dashDrivesTitle: "Almacenamiento",
    dashFreeOf: "{free} libres de {total}",
    dashAlmostFull: "Casi lleno",
    dashStartupTitle: "Apps de inicio",
    dashStartupCount: "{on} de {total} activas",
    dashManage: "Gestionar",
    dashUptimeTitle: "Encendido desde hace",
    dashUptimeDh: "{days}d {hours}h",
    dashUptimeHm: "{hours}h {minutes}min",
    dashUptimeLongHint:
      "Este PC no se reinicia desde hace tiempo. Un reinicio aplica las actualizaciones pendientes y libera la memoria retenida.",
    dashHistoryTitle: "Acciones recientes",
    dashHistoryEmpty: "Nada todavía. Tus acciones aparecerán aquí.",
    dashActTweakApplied: "Tweak aplicado",
    dashActTweakReverted: "Tweak revertido",
    dashActCleanup: "Limpieza",
    dashActFilesDeleted: "Archivos eliminados",
    dashActStartupChange: "Inicio modificado",
    dashActDiskOptimize: "Disco optimizado",
    dashActRestorePoint: "Punto de restauración",
    profileUnknown: "No detectado",
    diskHdd: "HDD",
    diskSsd: "SSD",
    diskNvme: "NVMe",
    formDesktop: "Sobremesa",
    formLaptop: "Portatil",
    groupRecommended: "Recomendado para este PC",
    groupOptional: "Opcional",
    groupNotRecommended: "No recomendado aqui",
    tailoredNote: "Cada elemento se evalua segun el hardware de arriba, no segun una lista fija.",
    fixRecommended: "Aplicar las {count} recomendadas",
    fixEverything: "Aplicar lo seleccionado ({count})",
    nothingSelected: "Nada seleccionado",
    foundHeadline: "{count} por corregir en este PC",
    foundNone: "Nada que corregir",
    doneTitle: "¡Listo!",
    doneBody: "{count} optimizaciones aplicadas. Tu PC está a punto.",
    fixHeading: "Listas para aplicar",
  },
  ram: {
    autoNeedsAdmin:
      "La limpieza automática solo funciona cuando WinCraft tiene permisos de administrador.",
    title: "Liberar RAM",
    subtitle:
      "Pide a Windows que libere la memoria que los programas ocupan sin usarla. Windows pide permiso de administrador cada vez, y la limpieza espera si hay un juego abierto.",
    button: "Liberar ahora",
    cleaning: "Limpiando...",
    freed: "{amount} liberados",
    freedNothing: "La memoria ya estaba optimizada",
    inUse: "{used} de {total} en uso",
    autoLabel: "Limpieza automática",
    autoOff: "Desactivada",
    autoEvery: "Cada {interval}",
    autoHint:
      "Con la limpieza automática activada, WinCraft libera la RAM por sí solo a intervalos regulares. Solo puede hacerlo mientras se ejecuta como administrador: Windows pide permiso para cada limpieza y una limpieza programada no puede pedirlo.",
    autoPausedNotAdmin:
      "En pausa: WinCraft no se está ejecutando como administrador, así que la limpieza automática no puede ejecutarse. Para usarla, cierra WinCraft y vuelve a abrirlo con «Ejecutar como administrador». La limpieza manual sigue funcionando: Windows pide permiso cada vez.",
    autoNext: "Próxima limpieza a las {time}",
    autoDue: "Limpieza inminente...",
    autoLast: "Última a las {time}: {amount} liberados",
    autoNoneYet: "Aún no se ha ejecutado ninguna limpieza automática.",
    autoFailed: "El último intento falló: {detail}",
  },
  restore: {
    button: "Restaurar ajustes activos",
    title: "¿Restaurar los ajustes activos?",
    body: "Restaura {count} ajustes desde los valores guardados. Las herramientas configurables tienen sus propios controles de restauración.",
    confirm: "Restaurar ajustes",
    cancel: "Cancelar",
    running: "Restaurando...",
    doneToast: "{count} optimizaciones restauradas.",
    nothingToast: "No hay nada que restaurar.",
  },
  passwordCheck: {
    title: "Comprobación de filtraciones de contraseña",
    description:
      "Comprueba si una contraseña ha aparecido en una filtración de datos conocida, sin enviarla nunca por completo: solo se envía un fragmento de su hash (k-anonimato, el mismo estándar que usa Have I Been Pwned).",
    placeholder: "Pega una contraseña para comprobar",
    button: "Comprobar",
    checking: "Comprobando...",
    safe: "No encontrada en ninguna filtración conocida. Buena señal.",
    breached:
      "Encontrada en {count} filtraciones conocidas. Cámbiala ya, en todos los sitios donde la uses.",
    error: "No se ha podido comprobar ahora: revisa tu conexión e inténtalo de nuevo.",
  },
  cleanupConfirm: {
    previewLoading: "Calculando qué se moverá a la Papelera...",
    previewEmpty: "No hay nada que limpiar: la carpeta ya está vacía.",
    previewNotAccessible:
      "El contenido no se puede leer sin permisos de administrador; el proceso autorizado lo listará y eliminará.",
    previewTruncated: "Se muestran los 500 elementos más grandes; los totales lo incluyen todo.",
    selectedSummary: "{count} elementos seleccionados · {size}",
    confirmSelected: "Limpiar seleccionados",
    title: "¿Confirmas la limpieza?",
    body: '"{name}" moverá los archivos correspondientes a la Papelera de reciclaje de Windows. Podrás recuperarlos desde ahí hasta que la vacíes.',
    confirm: "Mover a la Papelera",
    cancel: "Cancelar",
  },
  cleanupButton: "Limpiar",
  cleanupRunning: "...",
  cleanupResultToast: "{deleted} elementos movidos a la Papelera, {freed} liberados",
  cleanupResultToastSkipped: " ({skipped} en uso, omitidos).",
  diskOptimize: {
    title: "Optimizar disco",
    description:
      "Ejecuta el optimizador integrado de Windows: desfragmentacion en un HDD, o TRIM en un SSD (nunca una desfragmentacion completa, que solo lo desgastaria sin beneficio).",
    button: "Optimizar ahora",
    running: "Optimizando... puede tardar unos minutos",
    cannotStop:
      "Lo hace el optimizador de unidades de Windows con permisos de administrador, así que termina por sí solo y no se puede detener desde aquí. Puedes seguir trabajando sin problema.",
    resultToast: "Disco ({media}) optimizado correctamente.",
  },
  dnsFlush: {
    title: "Vaciar caché DNS",
    description:
      "Borra las direcciones DNS guardadas en memoria. Útil si un sitio cambió de servidor y tu navegador sigue mostrando la versión antigua.",
    button: "Vaciar ahora",
    running: "Vaciando...",
    resultToast: "Caché DNS vaciada.",
  },
  browserCleanup: {
    title: "Limpieza del navegador",
    description:
      "Vacía la caché y las cookies de Chrome, Edge y Firefox. El navegador los reconstruye solo en el próximo inicio, así que no se pierde nada para siempre.",
    noneFound: "No se encontró ningún navegador compatible en este PC.",
    cache: "Caché",
    cookies: "Cookies",
    clearButton: "Vaciar",
    clearing: "Vaciando...",
    runningWarning: "Cierra {browser} para poder vaciarlo.",
    clearedToast: "{browser}: {freed} liberados.",
  },
  tweakyDriverPromo: {
    title: "Tweaky Driver",
    description:
      "Busca paquetes de controladores de fuentes compatibles en nuestra aplicación dedicada. Revisa la compatibilidad antes de instalar. Aplicación independiente; cobertura variable.",
    button: "Explorar Tweaky Driver",
    error: "No se pudo abrir la página. Inténtalo de nuevo.",
  },
  redaxaPromo: {
    title: "Redaxa",
    description:
      "Has cortado telemetría y rastreo — pero ¿qué pegas en los chats de IA? Redaxa intercepta datos personales y credenciales antes de que un prompt llegue a cualquier modelo. Misma familia, misma regla: nada se guarda.",
    button: "Pruébalo en la web",
  },
  uninstallerPromo: {
    title: "WinCraft Uninstaller",
    description:
      "Elimina programas enteros de forma segura: punto de restauracion automatico, comando verificado, informe honesto. De la misma familia que WinCraft.",
    button: "Descargar",
    confirmTitle: "¿Descargar el desinstalador?",
    confirmBody:
      "WinCraft Uninstaller es una aplicación aparte de la misma suite y entra con la misma cuenta que esta. La descarga toma el instalador (unos 4 MB) directamente de su versión en GitHub, para Windows 10 y 11 de 64 bits.",
    confirmUnsigned:
      "WinCraft Uninstaller está firmado digitalmente por Aurelio Avila. Comprueba el editor y la firma en las propiedades del archivo. SmartScreen aún puede mostrar avisos.",
    confirmDownload: "Descargar",
    confirmOpenPage: "Abrir la página en su lugar",
    cancel: "Cancelar",
  },
  live: {
    title: "Ahora mismo",
    subtitle:
      "Se actualiza cada segundo mientras esta página está abierta y WinCraft está en primer plano. No se mide nada en segundo plano.",
    paused: "En pausa",
    pausedHint: "En pausa mientras WinCraft está en segundo plano. Se reanuda cuando vuelves.",
    measuring: "Midiendo…",
    smooth: "Funciona con fluidez",
    busy: "Ocupado",
    strained: "Con mucha carga",
    verdictDetail: "CPU al {cpu} % en los últimos 10 segundos · memoria en uso al {ram} %",
    failed: "Las lecturas en directo no están disponibles ahora mismo.",
    cpu: "Procesador",
    speed: "{ghz} GHz",
    cores: "{count} procesadores lógicos",
    core: "Procesador {n}",
    memory: "Memoria",
    used: "En uso",
    cached: "En caché",
    free: "Libre",
    total: "Total",
    cachedHint: "La memoria en caché se devuelve en cuanto un programa la necesita.",
    notAvailable: "No disponible en este PC",
    disk: "Actividad del disco",
    read: "Lectura",
    write: "Escritura",
    systemDrive: "Unidad del sistema: {used} usados de {total}",
    network: "Red",
    down: "Descarga",
    up: "Subida",
    gpu: "Gráficos",
    gpuLoad: "Carga",
    temp: "Temperatura",
    fan: "Ventilador",
    vram: "Memoria de vídeo",
    sensors: "Temperaturas y ventiladores",
    sensorsHint:
      "En este PC, Windows no expone estos sensores sin las herramientas del fabricante, así que no se inventa nada.",
    now: "ahora",
    secondsAgo: "hace {s} s",
    activity: "Actividad",
    zoomShort: "1 min",
    zoomLong: "5 min",
    minutesAgo: "hace {n} min",
    peak: "Pico {value}",
    insightRecovering:
      "El procesador está bajando: promediaba más del 75 % y la última lectura es del {pct} %.",
    insightCalm: "Todo está tranquilo. Ahora mismo nada necesita tu atención.",
    insightMemory:
      "La memoria está muy ocupada ({pct} %). Cierra las apps que no uses o revisa qué se inicia con Windows.",
    insightCpu:
      "El procesador lleva un rato ocupado ({pct} % de media). La lista de abajo muestra qué lo está usando.",
    insightDrive:
      "La unidad del sistema está casi llena ({pct} %). Windows se ralentiza cuando le falta espacio.",
    actionStartup: "Abrir Inicio",
    actionCleanup: "Liberar espacio",
    usingTitle: "Qué está usando recursos",
    usingHint:
      "Apps agrupadas por nombre, a partir de la lista de procesos de Windows. No se abre ni se cambia nada.",
    usingCpu: "Procesador",
    usingMemory: "Memoria",
    processes: "{count} procesos",
    processOne: "1 proceso",
  },
  pageError: {
    title: "Esta página ha tenido un problema",
    body: "El resto de WinCraft sigue funcionando y este error no ha cambiado nada en tu PC. Recarga la página para volver a intentarlo.",
    reload: "Recargar la página",
    reloadApp: "Recargar WinCraft",
    details: "Detalles técnicos",
    appTitle: "WinCraft ha tenido un problema",
    appBody: "Este error no ha cambiado nada en tu PC. Recarga WinCraft para continuar.",
  },
  folderScan: {
    stop: "Detener búsqueda",
    stopping: "Deteniendo…",
    stoppedEmpty: "Búsqueda detenida. No se ha movido ni eliminado nada.",
    stoppedPartial:
      "Búsqueda detenida. Estos son los resultados encontrados antes de que la detuvieras; lo que aún no se había alcanzado no se ha comprobado.",
  },
  largeFiles: {
    title: "Buscar archivos grandes",
    description:
      "Busca en una carpeta los archivos mas pesados (mas de 100 MB), para que puedas liberar espacio rapidamente eliminando los que ya no necesitas.",
    chooseFolder: "Elegir carpeta",
    scanning: "Buscando...",
    noneFound: "No se encontraron archivos de mas de {size}.",
    foundCount: "{count} archivos encontrados",
    moveSelected: "Enviar {count} seleccionados a la papelera",
    deleting: "Enviando a la papelera...",
    deletedToast: "{count} archivos enviados, {freed} liberados.",
  },
  diskHealth: {
    title: "Salud del disco",
    freeSpace: "{size} libres",
    selectDrive: "Disco",
    healthy: "Correcto",
    warning: "Advertencia",
    unhealthy: "Danado",
    unknown: "Desconocido",
    loading: "Comprobando...",
  },
  duplicateFinder: {
    title: "Buscar archivos duplicados",
    description:
      "Elige una carpeta: encuentra archivos idénticos y te deja elegir cuáles mover a la Papelera.",
    chooseFolder: "Elegir carpeta",
    scanning: "Escaneando...",
    noneFound: "No se encontraron archivos duplicados en esta carpeta.",
    copies: "{count} copias · {size} cada una",
    moveSelected: "Mover a la Papelera ({count} seleccionados)",
    deleting: "...",
    deletedToast: "{count} archivos movidos a la Papelera ({freed} liberados).",
  },
  ipMask: {
    title: "Enmascarar IP (VPN)",
    description:
      "Oculta tu dirección IP enrutando el tráfico a través de un servidor VPN. Requiere un servicio VPN externo: aún no integrado en esta versión.",
    button: "Más información",
    explainerToast:
      "El enmascaramiento real de IP necesita un backend VPN dedicado (servidor + protocolo). Todavía no está conectado: esto es solo un adelanto de la función.",
  },
  toasts: {
    applied: '"{name}" aplicado.',
    rolledBack: '"{name}" restaurado a su valor original.',
    elevationDeclined: "No se concedió el permiso de administrador, así que no se cambió nada.",
    accountRefreshFailed:
      "No pudimos verificar el estado de tu cuenta. Lo que se muestra aquí puede estar desactualizado: revisa tu conexión o inténtalo más tarde.",
  },
  titlebar: {
    applied: "{applied}/{total} activos",
    cpu: "CPU",
    ram: "RAM",
    minimize: "Minimizar",
    maximize: "Maximizar",
    restore: "Restaurar",
    close: "Cerrar",
  },
  x3d: {
    title: "Alineador de die 3D V-Cache",
    subtitle:
      "En CPU compatibles con caché L3 de distinto tamaño entre chips, limita un proceso en ejecución al chip con más caché. Esta elección sustituye la planificación automática de ese proceso y puede mejorar o empeorar el rendimiento.",
    cpuLabel: "Procesador",
    readyHeadline: "Die con V-Cache encontrado: {cores} hilos",
    readyBody: "Fija un juego a este die y todos sus hilos se quedan donde está la caché grande.",
    singleDie:
      "Este procesador tiene un solo die: todos los núcleos ya ven la misma caché, así que no hay nada que alinear. La función aparece sola en una CPU de dos dies con caché asimétrica.",
    uniformCache:
      "Este procesador tiene varios dies, todos con la misma cantidad de caché. Mover un juego de uno a otro no cambiaría nada, así que la función sigue desactivada.",
    unavailable: "Windows no devolvió un mapa de cachés para este procesador.",
    dieLabel: "Die {index}",
    dieCache: "{mb} MB L3",
    dieThreads: "{count} hilos",
    vcacheBadge: "V-Cache",
    processesTitle: "Procesos en ejecución",
    processesHint: "Los más activos arriba. Elige el juego y fíjalo al die de la caché.",
    refresh: "Actualizar",
    refreshing: "Leyendo...",
    align: "Alinear",
    reset: "Restablecer",
    alignedBadge: "Alineado",
    noProcesses: "Ningún proceso lo bastante grande como para listarlo.",
    persistenceNote:
      "La afinidad pertenece al proceso en ejecución: desaparece al cerrar el juego y hay que volver a fijarla en el siguiente arranque. No se cambia ningún ajuste del sistema.",
    alignedToast: "{name} fijado al die con V-Cache.",
    resetToast: "{name} devuelto a todos los núcleos.",
  },
  hardware: {
    intro:
      "Leído directamente de los sensores de tu hardware. Donde no existe un sensor te lo decimos, en lugar de mostrar un número que nadie puede verificar.",
    gpuLabel: "Tarjeta gráfica",
    cpuLabel: "Procesador",
    liveBadge: "En directo",
    gpuDriver: "Controlador {version}",
    load: "Uso de GPU",
    vram: "Memoria de vídeo",
    fan: "Ventilador",
    power: "Consumo",
    fanIdle: "parado: no hace falta bajo 50°",
    powerLimit: "límite {limit} W",
    tempCool: "fría",
    tempGood: "óptima",
    tempWarm: "caliente",
    tempHot: "muy caliente",
    traceLabel: "Esta sesión",
    traceRange: "mín {min}° · máx {max}°",
    noTempSensor: "Esta tarjeta no expone ningún sensor de temperatura.",
    cpuAcpiSource: "leída de la zona térmica ACPI",
    cpuNoSensor:
      "Temperatura de la CPU no disponible: el firmware no expone ninguna zona térmica ACPI. WinCraft solo muestra las lecturas disponibles a través de Windows.",
    noGpuTool:
      "No se detectó ninguna tarjeta NVIDIA. AMD e Intel no ofrecen una herramienta equivalente, por lo que sus temperaturas no se pueden leer sin el software del fabricante.",
    thermalsUnavailable: "No podemos leer los sensores de este sistema.",
    driversTitle: "Antigüedad de los controladores",
    driversSubtitle:
      "Cuántos años tienen los controladores del fabricante. Windows sabe qué está instalado, no qué está disponible: aquí ves la antigüedad real, nunca un aviso falso de actualización.",
    driversRescan: "Volver a analizar",
    driversScanning: "Analizando...",
    driversCounted: "{count} controladores de fabricantes",
    driversAging: "{count} de más de 2 años",
    driversStale: "{count} de más de 4 años",
    driversAllCurrent: "Todos recientes",
    driversNone: "No hay controladores de terceros en estas categorías.",
    driversShowAll: "Mostrar {count} más",
    driversShowLess: "Mostrar menos",
    driversInboxNote:
      "{count} controladores integrados de Microsoft excluidos: los mantiene Windows Update y su fecha es un marcador fijo, contarlos como antiguos sería una falsa alarma.",
    ageYears: "{years} años",
    ageYear: "{years} año",
    ageMonths: "{months} meses",
    ageMonth: "{months} mes",
    vendorSite: "Sitio del fabricante",
    watchLabel: "En observación desde hace",
    peakLabel: "Pico",
    verdictRisky: "Arriesgado",
    verdictNormal: "Normal",
    verdictBetter: "Mejor de lo esperado",
    verdictIdle: "En reposo",
    verdictRiskyHint:
      "La tarjeta superó los 84°, el punto en el que empieza a recortar su propio rendimiento para protegerse. Revisa el flujo de aire o cambia al perfil Silencioso.",
    verdictNormalHint: "Temperaturas habituales para una tarjeta bajo carga: nada preocupante.",
    verdictBetterHint:
      "Se mantuvo por debajo de 65° mientras trabajaba de verdad: mejor refrigeración que la media.",
    verdictIdleHint:
      "Todavía no ha trabajado lo suficiente para juzgar. Una tarjeta en reposo se mantiene fresca igualmente, así que no probaría nada.",
    profilesTitle: "Perfiles térmicos",
    profilesSubtitle:
      "Ajustan el límite de potencia de la tarjeta, la palanca que realmente gobierna el calor y el ruido del ventilador. Cada valor procede de los límites que declara la propia tarjeta.",
    currentLimit: "Ahora: {watts} W",
    modeSilent: "Silencioso",
    modeSilentHint:
      "Para trabajar, transmitir y sesiones largas: el ventilador queda casi mudo y la tarjeta calienta mucho menos, a cambio de unos fotogramas.",
    modeStandard: "Estándar",
    modeStandardHint:
      "Un límite equilibrado algo por debajo del techo de la tarjeta: ventilador más silencioso y temperaturas más bajas, con un coste en fotogramas de pocos puntos.",
    modeGaming: "Gaming",
    modeGamingHint:
      "Para sesiones competitivas: vatios al máximo y techo de reloj elevado, para mantener más estables los FPS mínimos cuando importa.",
    modeApplying: "Aplicando...",
    profileStageReading: "Leyendo los límites de la tarjeta",
    profileStageApplying: "Aplicando el límite",
    profileStageSettling: "Esperando la respuesta de los ventiladores",
    profileApplied: "Límite fijado en {watts} W.",
    profileNote:
      "Requiere permisos de administrador y se restablece al reiniciar. No es una curva de ventilador: NVIDIA no expone control directo del ventilador en nvidia-smi, y las herramientas que lo ofrecen usan API privadas no documentadas que esta aplicación no toca.",
    profileDefaultIsMax:
      "En esta tarjeta el límite de potencia de fábrica ya coincide con el máximo, así que Silencioso es el único perfil que cambia los vatios: Gaming se distingue subiendo el techo del reloj.",
    driverInstalled: "instalado v{version} el {date}",
    driversHardwareChanged:
      "Esta lista se analizó en un hardware distinto del que tiene el equipo ahora (por ejemplo, una tarjeta gráfica sustituida), así que se ha borrado. Vuelve a analizar para leer los dispositivos realmente instalados.",
    driversNoUpdateCheck:
      "Esta pantalla no contacta con ningún fabricante y no puede saber si existe una versión más reciente: muestra la versión instalada y su antigüedad, y te lleva a la página oficial para que lo compruebes tú.",
    driversCheckedAt: "Leído el {time}",
    modeClockLocked: "reloj hasta {mhz} MHz",
    modeClockAuto: "reloj automático",
    profileApply: "Aplicar perfil",
    profileActive: "Perfil activo",
    profileWillSet: "Fijará {watts} W, {clock}",
    scanStarting: "Iniciando análisis...",
    scanReading: "Leyendo la clase {class}",
    scanCount: "{done}/{total} · {pct}%",
    driversScannedAll: "{total} controladores examinados en {classes} categorías",
    winUpdateLabel: "Windows Update",
    winUpdateButton: "Buscar en Windows Update",
    winUpdateNote:
      "Esto solo revisa el catálogo propio de Windows Update, no los controladores concretos listados arriba: muchos fabricantes -sobre todo de audio y chipset integrados- nunca publican sus actualizaciones ahí, solo en su propio sitio. WinCraft no descarga paquetes de controladores por su cuenta: no existe una API del fabricante que diga cuál es la versión correcta para tu dispositivo exacto, e instalar el controlador de vídeo equivocado es uno de los pocos errores que puede dejarte sin pantalla.",
    winUpdateOpened: "Windows Update abierto.",
    winUpdateSearching: "Buscando...",
    winUpdateTakesAWhile: "Puede tardar un minuto: consulta el catálogo de Microsoft.",
    winUpdateInstall: "Descargar e instalar ({count})",
    winUpdateInstalling: "Descargando e instalando...",
    winUpdateNone:
      "Windows Update no tiene nada más reciente que ofrecer, incluso para los controladores marcados como antiguos arriba: muchos fabricantes publican sus actualizaciones a su manera, no a través de Windows Update.",
    winUpdateFailed: "La búsqueda falló: {detail}",
    winUpdateDone: "Instalados {installed}, fallidos {failed}.",
    rebootTitle: "Windows pide reiniciar",
    rebootBody:
      "Windows indica que una instalación solo se completa tras reiniciar. Puedes hacerlo ahora o cuando prefieras.",
    rebootNow: "Reiniciar ahora",
    rebootLater: "Más tarde",
  },
  menu: {
    account: "Cuenta",
    plan: "Plan",
    planFree: "Gratis",
    viewPlan: "Ver tu plan",
    language: "Idioma",
    theme: "Temas",
    about: "Acerca de",
    errorReports: "Informes de error anónimos",
    errorReportsBody:
      "Si algo falla, envía solo el mensaje de error (nunca datos personales) para ayudarnos a corregir errores. Desactivado por defecto.",
    changePhoto: "Cambiar foto de perfil",
    removePhoto: "Quitar foto",
    photoFailed: "No se pudo usar esa imagen como foto de perfil.",
    support: "Soporte",
    reportIssue: "Notificar un problema",
    aboutBody: "WinCraft — ajustes del sistema con copia de seguridad y restauración automáticas.",
    close: "Cerrar",
  },
  auth: {
    login: "Iniciar sesión",
    register: "Registrarse",
    email: "Correo electrónico",
    password: "Contraseña",
    loginButton: "Iniciar sesión",
    rememberMe: "Mantener la sesión iniciada",
    registerButton: "Crear cuenta",
    working: "...",
    logout: "Cerrar sesión",
    loggedInAs: "Sesión iniciada como {email}",
    backendNotConfigured:
      "Todavía no hay servidor conectado: configura API_BASE_URL cuando despliegues el backend.",
    switchToRegister: "¿No tienes cuenta? Regístrate",
    switchToLogin: "¿Ya tienes cuenta? Inicia sesión",
    emailInvalid: "Introduce un correo electrónico válido.",
    passwordTooShort: "La contraseña debe tener al menos 8 caracteres.",
    firstName: "Nombre",
    lastName: "Apellido",
    registerDetailsRequired: "Nombre, apellido y fecha de nacimiento son obligatorios.",
    loginRequiredToResend: "Inicia sesión primero y luego pide un enlace nuevo.",
    checkInboxAfterSignup:
      "Te enviamos un enlace de confirmación a {email}. Revisa también la carpeta de spam: en cuanto confirmes, tu cuenta estará lista.",
    forgotPasswordLink: "¿Olvidaste la contraseña?",
    forgotPasswordButton: "Enviar enlace de restablecimiento",
    forgotPasswordSent:
      "Si ese correo está registrado, recibirás un enlace para restablecer la contraseña.",
    backToLogin: "Volver al inicio de sesión",
    emailNotVerified: "Correo no verificado",
    emailVerified: "Correo verificado",
    resendVerification: "Reenviar",
    verificationSent: "Correo de verificación enviado.",
    deleteAccount: "Eliminar cuenta",
    deleteAccountBody:
      "Elimina tu dirección de correo, tu contraseña y los datos guardados, cierra la sesión en todos los dispositivos y no se puede deshacer. Una reseña que publicaste sigue visible, pero sin la dirección asociada.",
    deleteAccountPassword: "Tu contraseña actual",
    deleteAccountConfirmLabel: "Escribe DELETE para confirmar",
    deleteAccountSubmit: "Eliminar mi cuenta definitivamente",
    deleteAccountCancel: "Cancelar",
    deleteAccountDone:
      "Tu cuenta se ha eliminado. Se ha cerrado la sesión en todos los dispositivos.",
    deleteAccountBlocked:
      "Esta cuenta tiene una suscripción activa. Cancélala desde Gestionar suscripción; si no, eliminar la cuenta dejaría tu tarjeta con cargos.",
    deleteAccountWrongPassword: "Esa contraseña no coincide con esta cuenta.",
    deleteAccountNeedsLogin:
      "Tu sesión ha caducado. Inicia sesión de nuevo para eliminar la cuenta.",
    deleteAccountUnreachable:
      "No se pudo contactar con el servidor. No se eliminó nada: comprueba tu conexión e inténtalo de nuevo.",
  },
  driftWatch: {
    title: "Vigilar las actualizaciones de Windows",
    body: "Una actualización acumulativa repone lo que no reconoce: tus cambios desaparecen y te enteras semanas después, si acaso. Con esto activado, la comprobación se ejecuta al iniciar sesión y solo te avisa si algo ha dejado de estar en vigor.",
    on: "Activada",
    off: "Desactivada",
  },
  guard: {
    settingTitle: "No tocar los juegos que se gestionan solos",
    settingBody:
      "Algunos juegos gestionan su propio rendimiento. Mientras uno de ellos está abierto, WinCraft pausa sus ajustes por aplicación y deja el juego exactamente como está.",
    selfManaged: "Este juego gestiona su propio rendimiento, así que WinCraft lo deja como está.",
    gameRunning:
      "Hay un juego abierto que gestiona su propio rendimiento, así que WinCraft deja las aplicaciones como están hasta que lo cierres.",
    paused: "En pausa mientras haya abierto un juego que gestiona su propio rendimiento.",
    selfManagedBadge: "Gestiona su propio rendimiento",
    registeredGameRunning:
      "Uno de tus juegos está abierto, así que WinCraft espera a que se cierre.",
  },
  preview: {
    title: "Vista previa",
    loading: "Leyendo los valores actuales...",
    now: "Ahora",
    notSet: "Sin definir",
    willChange: "Aplicarlo cambia {count} de {total} valores.",
    noChange: "Ya está aplicado: aplicarlo no cambia nada.",
    readAtApply: "El estado actual se lee y se guarda en el momento de aplicarlo.",
    failed: "No se pudieron leer los valores actuales.",
  },
  requirements: {
    minBuild: "{version} o posterior",
    proEdition: "Pro, Enterprise o Education",
    unavailableVersion: "No disponible en este PC: necesita {version} o posterior.",
    unavailableEdition: "No disponible en este PC: necesita Windows Pro, Enterprise o Education.",
    enterpriseEdition: "Enterprise o Education",
    unavailableEnterpriseEdition:
      "No disponible en este PC: necesita Windows Enterprise o Education.",
    notPresent: "Este PC no tiene esta función, así que no hay nada que desactivar.",
    retired:
      "Retirado: este control antiguo ya no se puede aplicar. El estado guardado anteriormente todavía se puede restaurar.",
    windowsProtected:
      "En este PC, Windows protege esta opción y no acepta cambios de otras aplicaciones. Desactiva Widgets en Configuración > Personalización > Barra de tareas.",
  },
  scheduledCleanup: {
    title: "Limpieza semanal de archivos temporales",
    body: "Una vez por semana, unos minutos después de iniciar sesión, mueve a la Papelera de reciclaje los archivos temporales que nadie ha tocado en un día. Espera si hay un juego abierto y nunca toca la memoria ni las aplicaciones abiertas.",
  },
  priorityRules: {
    title: "Reglas de prioridad de aplicaciones",
    subtitle:
      "Elige una aplicación y una prioridad. WinCraft la aplica cada vez que la aplicación se inicia mientras WinCraft está abierto, y devuelve la prioridad anterior cuando quitas la regla o cierras WinCraft. Nunca por encima de Alta.",
    remove: "Quitar",
    empty: "Todavía no hay aplicaciones.",
    active: "Aplicaciones abiertas ajustadas: {count}",
    levelLabel: "Prioridad de {name}",
    idle: "Baja",
    belowNormal: "Por debajo de lo normal",
    normal: "Normal",
    aboveNormal: "Por encima de lo normal",
    high: "Alta",
  },
  skinpacks: {
    title: "Apariencia de Windows",
    description: "Aplica un aspecto reversible a la sesión de Windows de este usuario.",
    packName: "Aspecto oscuro inspirado en COSMIC",
    packBody:
      "Activa el modo oscuro, aplica un acento turquesa, reduce la transparencia, aplana los bordes de las ventanas y coloca la barra de tareas a la izquierda. Los nueve valores del Registro se guardan antes de modificarlos.",
    scope:
      "Solo cambia el aspecto de la interfaz de Windows. No instala COSMIC ni sustituye el entorno de escritorio de Windows.",
    apply: "Aplicar aspecto",
    restore: "Restaurar aspecto anterior",
    active: "Aspecto activo",
    applying: "Aplicando…",
    valuesSummary:
      "Este aspecto usa {count} valores del Registro; al aplicarlo se guardan los valores originales para poder restaurarlos.", // uses {count}
  },
  tweaks: {
    disable_click_to_do: {
      name: "Desactivar Click to Do",
      description:
        "Aplica la directiva de Windows que elimina Click to Do, la función que captura tu pantalla y la analiza para sugerir acciones. Sus accesos desaparecen para todas las cuentas de este PC. Configuración lo mostrará como administrado por tu organización: así es como Windows indica las directivas. Solo tiene efecto en los PC en los que Windows ofrece Click to Do.",
    },
    disable_edge_ai: {
      name: "Desactivar las funciones de IA de Microsoft Edge",
      description:
        "Aplica directivas de Microsoft Edge para sus funciones de IA. Cuáles surten efecto depende del perfil de Edge: impedir que Edge descargue su modelo de IA local funciona en todos los perfiles; ocultar la barra lateral y desactivar la búsqueda con IA en el historial y los temas generados por IA funciona en los perfiles que no han iniciado sesión con una cuenta Microsoft personal; desactivar el acceso de Copilot al contenido de las páginas y su ayuda para escribir solo funciona en perfiles profesionales o educativos. Edge los aplica sin reiniciar; puedes verlos en edge://policy. Edge indicará que lo administra tu organización: así es como señala las directivas.",
    },
    disable_paint_ai: {
      name: "Desactivar las funciones de IA de Paint",
      description:
        "Aplica las directivas de Windows que desactivan Cocreator, Image Creator y el relleno generativo en Paint. El resto de Paint funciona como siempre.",
    },
    disable_notepad_ai: {
      name: "Desactivar las funciones de IA del Bloc de notas",
      description:
        "Aplica la directiva del Bloc de notas que desactiva sus herramientas de escritura de Copilot (reescribir, resumir, escribir). Cierra y vuelve a abrir el Bloc de notas para ver el cambio.",
    },
    disable_fast_startup: {
      name: "Desactivar el inicio rápido",
      description:
        "Hace que Apagar sea un apagado real y no una hibernación parcial. Windows tarda unos segundos más en arrancar en frío, pero los controladores y las actualizaciones se cargan desde cero cada vez, y los equipos con arranque dual ya no encuentran bloqueado el disco de Windows.",
    },
    disable_storage_sense: {
      name: "Desactivar el Sensor de almacenamiento",
      description:
        "Impide que Windows elimine archivos temporales, vacíe la Papelera de reciclaje y deje archivos de OneDrive solo en línea según su propio calendario. Tú decides qué se limpia y cuándo.",
    },
    taskbar_end_task: {
      name: "Añadir Finalizar tarea a la barra de tareas",
      description:
        "Añade Finalizar tarea al menú contextual de las aplicaciones en la barra de tareas, para cerrar una aplicación bloqueada sin abrir el Administrador de tareas.",
    },
    disable_drag_tray: {
      name: "Desactivar el panel de arrastre",
      description:
        "Evita que el panel para compartir (llamado Drop tray en las compilaciones recientes) baje desde la parte superior de la pantalla cada vez que arrastras un archivo, para que arrastrar y soltar funcione sin estorbos. El valor procede de la documentación de la comunidad de Windows, no de Microsoft; las actualizaciones recientes de Windows 11 también ofrecen este interruptor en Configuración.",
    },
    explorer_open_this_pc: {
      name: "Abrir el Explorador de archivos en Este equipo",
      description:
        "Configura el Explorador de archivos para que se abra en Este equipo, con las unidades y carpetas, en lugar de en Inicio. Solo cambia la página inicial; la entrada Inicio sigue en el panel de navegación.",
    },
    block_oem_device_apps: {
      name: "Impedir que las aplicaciones de los fabricantes se instalen solas",
      description:
        "Impide que Windows descargue aplicaciones de los fabricantes e iconos personalizados para los dispositivos que conectas, que es como algunas utilidades de ratón, teclado y placa base llegan sin que nadie las pida. Los controladores se siguen instalando con normalidad.",
    },
    disable_windows_suggestions: {
      name: "Desactivar los consejos y sugerencias de Windows",
      description:
        "Un solo interruptor para los avisos que Windows añade por su cuenta: consejos y sugerencias, la pantalla de bienvenida tras las actualizaciones, sugerencias en Configuración, «terminar de configurar el dispositivo», notificaciones sugeridas, recomendaciones y avisos de cuenta en el menú Inicio, y anuncios de proveedores de sincronización en el Explorador de archivos. Son los valores que escriben los interruptores de Configuración de Windows, según la documentación de la comunidad de Windows; Microsoft no los documenta, así que una actualización de Windows puede cambiarlos.",
    },
    disable_widgets: {
      name: "Desactivar los widgets por completo",
      description:
        "Aplica la directiva de Windows que desactiva el panel de widgets en sí, no solo su botón en la barra de tareas, para que sus noticias dejen de cargarse en segundo plano. Configuración lo mostrará como administrado por tu organización: así es como Windows indica las directivas.",
    },
    hide_start_recommended: {
      name: "Quitar Recomendado del menú Inicio",
      description:
        "Aplica la directiva de Windows que quita la sección Recomendado de Inicio y deja todo el espacio a tus aplicaciones ancladas. Configuración lo mostrará como administrado por tu organización: así es como Windows indica las directivas.",
    },
    disable_game_bar_captures: {
      name: "Desactivar las capturas de Game Bar",
      description:
        "Desactiva la función de captura de Game Bar y su grabación en segundo plano, que guarda de forma continua un vídeo de tus últimos minutos de juego. Complementa el interruptor de Game Bar / Game DVR.",
    },
    disable_ai_fabric_service: {
      name: "Iniciar el host de componentes de IA de Windows solo cuando haga falta",
      description:
        "Detiene el servicio host de componentes de IA de Windows (WSAIFabricSvc) y lo configura como Manual, para que ya no se inicie con Windows. Windows puede seguir iniciándolo cuando una aplicación o una función de Windows lo pide. Windows lo describe como el servicio que proporciona servicios de componentes de IA a las aplicaciones y a otros servicios de Windows. Solo existe en los PC que lo tienen.",
    },
    disable_restart_apps: {
      name: "Evitar que las apps se reabran al iniciar sesión",
      description:
        "Impide que Windows reabra las apps reiniciables de la sesión anterior tras iniciar sesión. Se pierde la restauración automática; no cierra apps ahora ni cambia el inicio de sesión automático.",
    },
    enable_long_paths: {
      name: "Activar rutas largas en apps compatibles",
      description:
        "Permite superar el límite tradicional en apps que declaran soporte de rutas largas. Las apps antiguas y algunas operaciones del Explorador pueden seguir limitadas. Reinicia las apps; restaurar el ajuste puede dejar inaccesibles rutas largas ya creadas.",
    },
    disable_filter_keys_shortcut: {
      name: "Evitar la activación accidental de Teclas filtro",
      description:
        "Desactiva solo el atajo de Mayús derecha para Teclas filtro. La función de accesibilidad y sus tiempos no cambian; no reduce la latencia del teclado.",
    },
    ecoqos_rules: {
      name: "Reglas de eficiencia para apps en segundo plano",
      description:
        "Asigna menor prioridad energética a ejecutables elegidos mientras WinCraft está abierto. Las reglas se pausan cuando la app es interactiva; no es un límite porcentual de CPU.",
    },
    limit_do_background_download: {
      name: "Límite de descargas de Windows en segundo plano",
      description:
        "Configura un límite en KB/s para descargas Microsoft mediante Delivery Optimization. No limita Steam ni otros dispositivos y no garantiza menos ping.",
    },
    monitor_refresh_profile: {
      name: "Perfil de frecuencia del monitor para juegos",
      description:
        "Elige una frecuencia compatible para una pantalla durante una sesión de juego, con vista previa temporal y restauración. No aumenta los fotogramas generados por la GPU.",
    },
    cpu_energy_performance: {
      name: "Priorizar el rendimiento de la CPU conectada a la corriente",
      description:
        "Establece en 0 la preferencia energética de la CPU en el plan actual al conectar el equipo. Requiere CPPC autónomo; siguen vigentes los límites térmicos y del firmware. Puede aumentar el calor y el consumo. No cambia la batería. Prueba tu carga de trabajo.",
    },
    pcie_link_power: {
      name: "Mantener activos los enlaces PCIe con alimentación externa",
      description:
        "Desactiva el ahorro de energía de los enlaces PCIe en el plan actual al conectar el equipo. Opción de diagnóstico para transiciones energéticas; no garantiza menor latencia. Puede aumentar el consumo en reposo. No cambia la batería.",
    },
    usb_suspend_diagnostics: {
      name: "Diagnosticar la reactivación USB con alimentación externa",
      description:
        "Desactiva la suspensión selectiva USB al conectar el equipo para investigar problemas de reactivación o desconexión. Windows recomienda mantenerla activada normalmente. Restaura después de la prueba; puede aumentar el consumo en reposo. No cambia la batería.",
    },
    hybrid_short_threads: {
      name: "Preferir núcleos de rendimiento para hilos cortos",
      description:
        "En CPU con distintas clases de eficiencia, pide a Windows que prefiera núcleos de rendimiento para hilos cortos con alimentación externa. Es una preferencia, no una afinidad fija. La planificación automática puede funcionar mejor. No cambia la batería.",
    },
    hybrid_long_threads: {
      name: "Preferir núcleos de rendimiento para hilos largos",
      description:
        "En CPU con distintas clases de eficiencia, pide a Windows que prefiera núcleos de rendimiento para hilos largos con alimentación externa. Los demás núcleos siguen disponibles; no desactiva los E-cores. Compara rendimiento y respuesta. No cambia la batería.",
    },
    disable_startup_delay: {
      name: "Eliminar el retraso de los programas al inicio",
      description:
        "Windows espera a propósito unos 10 segundos tras iniciar sesión antes de abrir tus programas de inicio. Esta opción elimina esa espera.",
    },
    menu_show_delay: {
      name: "Respuesta instantánea de los menús",
      description:
        "Elimina el retraso con el que se abren los menús, lo que hace que todo el escritorio se sienta más ágil.",
    },
    disable_power_throttling: {
      name: "Desactivar la limitación de energía de la CPU",
      description:
        "Impide que Windows ralentice los procesos en segundo plano para ahorrar energía: útil en portátiles, donde provoca tirones en sesiones largas.",
    },
    games_gpu_priority: {
      name: "Establecer el valor heredado GPU Priority de juegos",
      description:
        "Escribe el valor GPU Priority de juegos, que Microsoft documenta como no utilizado. No se espera una mejora de prioridad de GPU ni de FPS.",
    },
    disable_tailored_experiences: {
      name: "Desactivar las experiencias personalizadas",
      description:
        "Impide que Windows use tus datos de diagnóstico para personalizar anuncios, sugerencias y recomendaciones.",
    },
    disable_app_launch_tracking: {
      name: "Dejar de registrar qué aplicaciones abres",
      description:
        "Windows registra con qué frecuencia abres cada programa para ordenar los resultados del menú Inicio. Esta opción desactiva ese registro.",
    },
    disable_feedback_requests: {
      name: "Bloquear las peticiones de opinión de Windows",
      description:
        "Evita que Windows te interrumpa con encuestas del tipo «¿Qué probabilidad hay de que recomiendes...?».",
    },
    disable_cortana: {
      name: "Desactivar Cortana",
      description:
        "Desactiva Cortana mediante directiva del sistema, liberando los recursos que reserva en segundo plano.",
    },
    show_file_extensions: {
      name: "Mostrar siempre las extensiones de archivo",
      description:
        "Revela la extensión real de cada archivo. Merece la pena activarlo solo por seguridad: destapa archivos como «factura.pdf.exe» que Windows oculta.",
    },
    hide_taskbar_widgets: {
      name: "Ocultar los Widgets de la barra de tareas",
      description:
        "Quita el botón de Widgets (tiempo/noticias), que carga contenido en segundo plano aunque nunca lo abras.",
    },
    network_latency: {
      name: "Confirmaciones TCP y agrupación de paquetes",
      description:
        "Establece TcpAckFrequency y TCPNoDelay en 1 en el adaptador que lleva la ruta hacia Internet. Afecta al comportamiento TCP; el tráfico UDP no cambia. La compatibilidad depende de Windows y las aplicaciones, por lo que no se garantiza una menor latencia en juegos.",
    },
    disable_window_animations: {
      name: "Animaciones de ventana instantaneas",
      description:
        "Elimina la animacion que Windows reproduce al abrir, cerrar o minimizar una ventana. Esa animacion es puro tiempo de espera: quitarla hace que el escritorio responda en el instante del clic y libera el trabajo de GPU asociado.",
    },
    disable_drag_full_windows: {
      name: "Arrastre de ventanas mas ligero",
      description:
        "Dibuja solo el contorno mientras arrastras una ventana en lugar de repintar todo su contenido en cada fotograma. Apenas se nota en una GPU rapida, se nota claramente en graficos integrados o en un equipo antiguo.",
    },
    mouse_hover_delay: {
      name: "Respuesta inmediata al pasar el raton",
      description:
        "Windows espera 400 ms antes de reaccionar al puntero detenido sobre algo: vistas previas de la barra de tareas, descripciones emergentes, menus. Esto reduce la espera casi a cero, asi la interfaz sigue al raton en vez de ir por detras.",
    },
    disable_background_apps: {
      name: "Detener las apps en segundo plano",
      description:
        "Impide que las aplicaciones de la Store se ejecuten, se actualicen y consulten la red mientras no las usas. Es CPU, RAM y bateria reales gastadas en aplicaciones que no has abierto.",
    },
    disable_delivery_optimization: {
      name: "Desactivar el intercambio entre equipos de Windows Update",
      description:
        "Configura Delivery Optimization en modo solo HTTP, para que este PC no descargue contenido de actualizaciones de otros PC ni lo suba a ellos. Windows Update sigue descargando desde Microsoft; esto no desactiva el servicio Delivery Optimization ni Windows Update.",
    },
    prevent_auto_restart_while_logged_on: {
      name: "Evitar los reinicios programados de Windows Update con la sesión iniciada",
      description:
        "Impide que Windows Update reinicie automáticamente el PC por una actualización programada mientras alguien tenga la sesión iniciada. Las actualizaciones pueden seguir descargándose e instalándose; esto no bloquea un reinicio que inicies tú. Una actualización de seguridad que requiere reiniciar no está plenamente activa hasta que se reinicie el PC, así que mantener la sesión abierta puede retrasar la protección. Mantén Windows Update activado y reinicia pronto.",
    },
    defer_quality_updates_7_days: {
      name: "Retrasar 7 días las actualizaciones de calidad",
      description:
        "Aplaza 7 días desde su publicación las actualizaciones de calidad de Windows, incluidos los parches de seguridad mensuales. Windows Update sigue activado: es un aplazamiento breve, no una pausa ni un bloqueo. Los parches de seguridad no se aplican durante la espera; instala pronto las actualizaciones urgentes y reinicia cuando Windows lo solicite. Restaurar este ajuste elimina el aplazamiento.",
    },
    defer_feature_updates_30_days: {
      name: "Retrasar 30 días las actualizaciones de características",
      description:
        "Aplaza 30 días desde su publicación las ofertas de actualizaciones de características de Windows. Las actualizaciones mensuales de calidad y seguridad continúan con su calendario habitual. No fija una versión ni amplía el soporte de la versión actual de Windows; restaurar este ajuste elimina el aplazamiento.",
    },
    exclude_windows_update_drivers: {
      name: "Excluir los controladores independientes de Windows Update",
      description:
        "Indica a Windows Update que excluya las actualizaciones independientes de controladores de su ciclo normal de actualizaciones de calidad. Windows Update y las actualizaciones de calidad y seguridad siguen activadas. Los controladores incluidos en actualizaciones de seguridad o críticas, y los instalados dinámicamente durante las actualizaciones de características, aún pueden llegar. Las herramientas de los fabricantes y las instalaciones manuales no se bloquean. Tendrás que gestionar los controladores independientes por tu cuenta; mientras este ajuste esté activo, el catálogo de controladores de Windows Update puede ofrecer menos actualizaciones o ninguna. Restaurarlo permite de nuevo que Windows Update ofrezca controladores.",
    },
    disable_copilot: {
      name: "Directiva antigua de Copilot (solo restauración)",
      description:
        "Esta directiva retirada no controla la aplicación Copilot actual. Aquí puedes restaurar el valor del registro guardado. Gestiona la aplicación Copilot independiente en Debloat; eliminarla no impide futuras reinstalaciones.",
    },
    keyboard_delay_zero: {
      name: "Valor antiguo de KeyboardDelay (solo restauración)",
      description:
        "Las versiones anteriores escribían KeyboardDelay en la clave de configuración del ratón, no en la del teclado. Esta entrada solo restaura la copia guardada anterior; para la repetición del teclado, usa «Reducir el retardo de entrada (teclado)».",
    },
    keyboard_speed_fast: {
      name: "Valor antiguo de KeyboardSpeed (solo restauración)",
      description:
        "Las versiones anteriores escribían KeyboardSpeed en la clave de configuración del ratón, no en la del teclado. Esta entrada solo restaura la copia guardada anterior; para la repetición del teclado, usa «Reducir el retardo de entrada (teclado)».",
    },
    disable_suggested_apps: {
      name: "Impedir que Windows instale aplicaciones por su cuenta",
      description:
        "Windows instala en silencio aplicaciones y juegos «sugeridos» en tu menú Inicio sin preguntarte, al instalar y de nuevo tras las actualizaciones grandes. Esto lo desactiva: en tu equipo ya no aparece nada que no hayas elegido tú.",
    },
    disable_mouse_acceleration: {
      name: "Desactivar la aceleración del ratón",
      description:
        "Desactiva «Mejorar la precisión del puntero», que hace que el cursor recorra más distancia cuando mueves el ratón deprisa. Esa respuesta variable es justo lo que no quieres al apuntar: el mismo gesto debe cubrir siempre la misma distancia en pantalla.",
    },
    disable_sticky_keys_prompt: {
      name: "Eliminar el aviso de Teclas especiales",
      description:
        "Pulsar Mayús cinco veces abre el cuadro de Teclas especiales, lo que en un juego significa salir de pantalla completa en el peor momento, normalmente en pleno combate. Esto desactiva el atajo y su aviso; las Teclas especiales siguen disponibles en Configuración.",
    },
    disable_recall: {
      name: "Desactivar Recall (capturas de pantalla con IA)",
      description:
        "Recall captura tu pantalla cada pocos segundos y construye un historial indexado por IA de todo lo que has mirado: contraseñas y mensajes privados incluidos, porque graba lo que haya en pantalla. Esto aplica la directiva del sistema que le impide analizar o guardar nada.",
    },
    global_timer_resolution: {
      name: "Resolución del temporizador global",
      description:
        "Establece el valor del registro GlobalTimerResolutionRequests en 1. Esta operación no solicita ni verifica una resolución concreta del temporizador. El comportamiento depende de la versión de Windows; no se garantiza menor latencia ni más FPS. Requiere reiniciar.",
    },
    disable_core_parking: {
      name: "Desactivar el aparcamiento de núcleos",
      description:
        "Impide que Windows aparque los núcleos inactivos con el equipo enchufado, para que un núcleo no tenga que despertarse antes de atender la entrada o un pico de trabajo repentino. Se aplica solo al perfil de red eléctrica: con batería, aparcar es justamente para lo que sirve. El valor anterior del plan se registra y se restaura exactamente (requiere permisos de administrador).",
    },
    disable_memory_integrity: {
      name: "Desactivar Integridad de memoria (VBS)",
      description:
        "Solicita desactivar Integridad de memoria (HVCI). Si se aplica, elimina una capa de protección del kernel; otras funciones VBS pueden seguir activas. El efecto en el rendimiento depende del hardware y la carga de trabajo. Las directivas del sistema o el bloqueo UEFI pueden impedir el cambio. Reinicia y comprueba el estado en Seguridad de Windows.",
    },
    disable_typing_personalization: {
      name: "Impedir que Windows aprenda cómo escribes",
      description:
        "Windows crea un diccionario personal a partir de lo que escribes con el teclado y a mano —también en gestores de contraseñas, chats y cuadros de búsqueda— y lo sincroniza con tu cuenta de Microsoft para mejorar sus sugerencias. Esto desactiva tanto la recopilación de texto como la de escritura a mano.",
    },
    classic_context_menu: {
      name: "Recuperar el menú contextual completo",
      description:
        "Windows 11 esconde la mayor parte del menú del botón derecho tras «Mostrar más opciones», convirtiendo un clic en dos para cosas que haces todo el día. Esto restaura el menú completo de Windows 10 en todas partes, en el Explorador y en el escritorio. El Explorador se reinicia para aplicarlo, así que las ventanas abiertas parpadearán una vez.",
    },
    disable_transparency: {
      name: "Desactivar los efectos de transparencia",
      description:
        "Desactiva los efectos de desenfoque/acrílico de la barra de tareas y los menús. Un ahorro de GPU pequeño pero real, que hace más fluidos los equipos antiguos o con gráficos integrados.",
    },
    dark_mode: {
      name: "Modo oscuro",
      description: "Activa el tema oscuro para apps y sistema.",
    },
    show_hidden_files: {
      name: "Mostrar archivos ocultos",
      description: "Muestra archivos y carpetas ocultos en el Explorador de archivos.",
    },
    priority_separation: {
      name: "Optimizar prioridad del procesador",
      description:
        "Ajusta Win32PrioritySeparation (0x26) para dar a la aplicación en primer plano cuantos de CPU cortos y variables con prioridad 3x — el valor clásico de capacidad de respuesta para escritorio/juegos.",
    },
    disable_game_dvr: {
      name: "Desactivar Xbox Game Bar / Game DVR",
      description:
        "Desactiva la grabación en segundo plano de Xbox Game Bar, que consume CPU/GPU durante el juego.",
    },
    disable_telemetry_tasks: {
      name: "Reducir la recopilación de datos de diagnóstico",
      description:
        "Establece la directiva de datos de diagnóstico de Windows en su nivel más bajo. Home y Pro la aplican como datos de diagnóstico obligatorios; solo Enterprise y Education los desactivan por completo.",
    },
    reset_advertising_id: {
      name: "Desactivar ID de publicidad",
      description: "Impide que las apps usen tu ID de publicidad para elaborar perfiles.",
    },
    disable_location_tracking: {
      name: "Desactivar seguimiento de ubicación",
      description:
        "Bloquea el acceso a la ubicación para todas las apps mediante directiva del sistema.",
    },
    disable_bing_search: {
      name: "Desactivar la búsqueda de Bing en el menú Inicio",
      description: "Impide que tus búsquedas del menú Inicio se envíen a Bing.",
    },
    power_plan_performance: {
      name: "Alto rendimiento (plan de energía)",
      description:
        'Cambia al plan de energía de Windows "Alto rendimiento". Útil en equipos de escritorio o conectados a la corriente; restaura el plan anterior al revertir.',
    },
    turbo_gaming: {
      name: "Turbo Gaming",
      description:
        "Preajuste: desactiva Game DVR, cambia el plan de energía a Alto rendimiento y optimiza la prioridad del procesador (requiere privilegios de administrador).",
    },
    privacy_dns: {
      name: "DNS privados (Cloudflare)",
      description:
        "Cambia a servidores DNS centrados en la privacidad (1.1.1.1), impidiendo que tu proveedor registre las consultas DNS. No oculta tu dirección IP (para eso hace falta una VPN, ver abajo).",
    },
    hardware_gpu_scheduling: {
      name: "Programación de GPU acelerada por hardware",
      description:
        "Solicita la programación de GPU acelerada por hardware (HAGS). Requiere GPU, controlador y versión de Windows compatibles. El rendimiento y la latencia pueden mejorar, empeorar o no cambiar según el juego. Reinicia y comprueba la disponibilidad en la configuración de gráficos de Windows.",
    },
    reduce_input_lag: {
      name: "Reducir el retardo de entrada (ratón)",
      description:
        'Desactiva la aceleración del puntero ("Mejorar precisión del puntero") para un movimiento del ratón 1:1, sin retardo añadido por el sistema.',
    },
    turbo_boost: {
      name: "Turbo Boost del procesador",
      description:
        "Establece el modo turbo en Agresivo con corriente y batería, y el estado mínimo del procesador al 100 % con corriente en el plan de energía actual. El consumo y el calor pueden aumentar. Siguen vigentes los límites de CPU, firmware y temperatura; no se garantizan más FPS (requiere permisos de administrador).",
    },
    network_throttling_index: {
      name: "Desactivar la limitación de red multimedia",
      description:
        "Elimina el límite que Windows impone al tráfico de red mientras usas apps multimedia/juegos, útil para reducir microlags online.",
    },
    system_responsiveness: {
      name: "Establecer la reserva de CPU en segundo plano de MMCSS",
      description:
        "Escribe SystemResponsiveness=0, que Windows trata como 20 %. No elimina la cuota de CPU para tareas de menor prioridad ni prioriza todas las apps en primer plano.",
    },
    games_task_priority: {
      name: "Establecer la categoría MMCSS Games",
      description:
        "Establece la categoría Games en High para los hilos registrados con MMCSS; High trata Priority como 2. Los valores GPU Priority y SFIO Priority también escritos no se utilizan. No prioriza todos los procesos de juego.",
    },
    reduce_keyboard_delay: {
      name: "Reducir el retardo de entrada (teclado)",
      description:
        "Reduce a cero el retardo antes de que una tecla mantenida empiece a repetirse y maximiza su velocidad de repetición, para una respuesta más inmediata en el juego.",
    },
    keep_kernel_in_ram: {
      name: "Mantener el kernel y los controladores en la RAM",
      description:
        "Windows puede pasar al disco partes del kernel y del código de los controladores incluso cuando sobra memoria, y volver a leerlas es una pausa que notas como un tirón. Esto los mantiene en memoria. Merece la pena si te sobra RAM; en un PC con poca memoria déjalo desactivado.",
    },
    auto_end_frozen_tasks: {
      name: "Que una app colgada no bloquee el apagado",
      description:
        'Cuando una aplicación deja de responder durante el apagado, Windows espera y muestra la pantalla "Esta aplicación impide el apagado" hasta que alguien hace clic. Esto cierra solo las aplicaciones que no responden, para que un programa colgado no deje el equipo encendido. Advertencia: cerrar aplicaciones automáticamente puede provocar la pérdida del trabajo sin guardar. Restaurar este ajuste no recupera ese trabajo.',
    },
    instant_folder_loading: {
      name: "Abrir cada carpeta al instante",
      description:
        "El Explorador inspecciona el contenido de una carpeta para adivinar si es Imágenes, Música o Documentos, y una carpeta con miles de archivos multimedia puede quedarse bloqueada varios segundos mientras decide. Esto fija todas las carpetas al diseño general, para que se abran de inmediato.",
    },
    tcp_congestion_bbr: {
      name: "Ping estable aunque la línea esté ocupada (BBR2)",
      description:
        "Windows usa CUBIC, que acelera hasta que algún búfer se desborda: por eso el ping sube en cuanto otra persona de la casa empieza una descarga. BBR2 mide el ancho de banda real y el tiempo de ida y vuelta de la línea y marca el ritmo en consecuencia, de modo que la tubería se llena sin llenar la cola. Microsoft incluye BBR2 en Windows 11; esto pasa la plantilla de Internet a BBR2 y sabe volver exactamente a como estaba (requiere permisos de administrador).",
    },
    taskbar_align_left: {
      name: "Alinear la barra de tareas a la izquierda",
      description:
        "Vuelve a alinear los iconos de la barra de tareas a la izquierda (estilo Windows 10) en vez de al centro.",
    },
    hide_taskbar_chat: {
      name: "Ocultar Chat/Teams de la barra de tareas",
      description: "Elimina el icono de Chat (Microsoft Teams) de la barra de tareas.",
    },
    disable_start_suggestions: {
      name: "Desactivar sugerencias y apps recomendadas en el menú Inicio",
      description:
        "Evita que Windows muestre apps recomendadas, anuncios y sugerencias en el menú Inicio.",
    },
    disable_activity_history: {
      name: "Desactivar el historial de actividad (Windows Timeline)",
      description:
        "Evita que Windows registre, guarde y envíe a Microsoft el historial de tus apps y documentos usados, mediante una política del sistema.",
    },
    hide_taskbar_search: {
      name: "Ocultar el cuadro de búsqueda de la barra de tareas",
      description:
        "Elimina el cuadro/icono de búsqueda de la barra de tareas, para una barra más limpia (la búsqueda sigue disponible desde la tecla Windows).",
    },
    disable_fullscreen_optimizations_global: {
      name: "Desactivar las optimizaciones de pantalla completa globalmente",
      description:
        "Obliga a DXGI a respetar el verdadero modo de pantalla completa exclusiva en lugar de la simulación de Windows, reduciendo microcortes y latencia de entrada en muchos juegos más antiguos.",
    },
    disable_windows_search_service: {
      name: "Desactivar el servicio de indexación (Windows Search)",
      description:
        "Detiene y desactiva el servicio de indexación de archivos de Windows, reduciendo la actividad de disco en segundo plano — útil en SSD pequeños o mientras juegas. La búsqueda de archivos en el menú Inicio se vuelve más lenta hasta que lo reactives (requiere privilegios de administrador).",
    },
    disable_dmwappush_service: {
      name: "Iniciar el servicio de inserción solo cuando se necesite",
      description:
        "Detiene el servicio de enrutamiento de inserciones WAP y lo configura como Manual, para que ya no se inicie con Windows pero pueda iniciarse cuando se solicite.",
    },
    disable_diagtrack_service: {
      name: "Desactivar el servicio de telemetría (experiencias conectadas)",
      description:
        "Detiene y desactiva el servicio de experiencias de usuario conectadas y telemetría, que envía datos de uso y diagnóstico a Microsoft. Windows Update y los informes de errores siguen funcionando.",
    },
    enable_regback: {
      name: "Activar copia de seguridad del Registro (RegBack)",
      description:
        "Reactiva las copias de seguridad periódicas automáticas del Registro de Windows en %SystemRoot%\\System32\\config\\RegBack para recuperación de emergencia.",
    },
    explorer_anti_hang: {
      name: "Evitar bloqueos del Explorador en accesos directos",
      description:
        "Desactiva la resolución de rutas y la búsqueda de red al abrir accesos directos, evitando que el Explorador de archivos se congele con unidades o recursos desconectados.",
    },
    no_internet_open_with: {
      name: "Omitir consulta a Microsoft Store para archivos desconocidos",
      description:
        "Abre de inmediato el cuadro local «Abrir con» en lugar de sugerir buscar en Microsoft Store al hacer doble clic en extensiones no reconocidas.",
    },
    detailed_bsod: {
      name: "Mostrar parámetros detallados en pantallas azules BSOD",
      description:
        "Muestra los códigos de parada hexadecimales exactos, los controladores afectados y las direcciones de memoria en la pantalla azul en vez de ocultarlos tras un código QR.",
    },
    disable_wpbt: {
      name: "Bloquear ejecución de software UEFI WPBT",
      description:
        "Impide que el firmware UEFI de la placa base instale automáticamente binarios OEM no deseados en Windows mediante la tabla WPBT.",
    },
    disable_ndu: {
      name: "Desactivar fuga de memoria no paginada de NDU",
      description:
        "Deshabilita el controlador Network Diagnostic Usage, evitando la acumulación excesiva de memoria no paginada durante descargas de red intensas.",
    },
    disable_search_highlights: {
      name: "Desactivar destacados e ilustraciones de búsqueda",
      description:
        "Elimina las ilustraciones web, los doodles diarios de Bing y las tendencias de la barra de búsqueda de Windows y la barra de tareas.",
    },
    auto_complete_run: {
      name: "Activar autocompletado en el cuadro Ejecutar",
      description:
        "Habilita el autocompletado instantáneo de comandos y sugerencias en el cuadro de diálogo Ejecutar de Windows (Win + R).",
    },
    disable_aero_shake: {
      name: "Desactivar minimización por agitación (Aero Shake)",
      description:
        "Evita que al sacudir la barra de título de una ventana se minimicen accidentalmente las demás ventanas abiertas en segundo plano.",
    },
    disable_remote_assistance: {
      name: "Desactivar invitaciones de Asistencia remota",
      description:
        "Deshabilita las conexiones e invitaciones de Asistencia remota de Windows para proteger el equipo de solicitudes de soporte no autorizadas.",
    },
    disable_llmnr: {
      name: "Desactivar protocolo LLMNR",
      description:
        "Deshabilita Link-Local Multicast Name Resolution (LLMNR) para proteger contra suplantaciones de red local e intercepción de credenciales.",
    },
    disable_wifi_sense: {
      name: "Desactivar uso compartido de puntos Wi-Fi Sense",
      description:
        "Evita que Windows se conecte automáticamente a redes Wi-Fi abiertas y comparta credenciales de red con tus contactos.",
    },
    disable_cloud_search: {
      name: "Desactivar búsqueda en la nube en Windows",
      description:
        "Impide que la búsqueda de Windows consulte el historial en la nube y los registros de la cuenta de Microsoft al buscar archivos locales.",
    },
    disable_app_suggestions_start: {
      name: "Desactivar sugerencias en el menú Inicio",
      description:
        "Desactiva las sugerencias promocionales de aplicaciones y consejos de funciones dentro del menú Inicio de Windows.",
    },
    disable_handwriting_sharing: {
      name: "Desactivar envío de errores de escritura manual",
      description:
        "Impide que Windows transmita a Microsoft los registros de errores de reconocimiento de escritura manual y muestras de trazos.",
    },
    disable_ceip: {
      name: "Desactivar Programa para la mejora de la experiencia (CEIP)",
      description:
        "Desactiva el cliente de telemetría SQM del Programa para la mejora de la experiencia del usuario de Windows (CEIP).",
    },
    disable_lockscreen_camera: {
      name: "Desactivar cámara en la pantalla de bloqueo",
      description:
        "Deshabilita el botón y gesto de la cámara en la pantalla de bloqueo para impedir la captura de fotos sin desbloquear el dispositivo.",
    },
    disable_cortana_consent: {
      name: "Desactivar consentimiento de búsqueda de Cortana",
      description:
        "Revoca el consentimiento de búsqueda de Cortana para evitar que consultas y datos de voz se compartan con los servicios en la nube de Microsoft.",
    },
    disable_wer_queuing: {
      name: "Desactivar cola de informes de errores de Windows",
      description:
        "Impide que Informe de errores de Windows guarde y ponga en cola informes de bloqueo en disco para su envío posterior.",
    },
    disable_experimentation: {
      name: "Desactivar telemetría de experimentación de Windows",
      description:
        "Desactiva las pruebas A/B y funciones de experimentación de Microsoft en Windows, manteniendo el sistema consistente y predecible.",
    },
    disable_app_inventory_collection: {
      name: "Desactivar inventario de compatibilidad de aplicaciones",
      description:
        "Deshabilita el recopilador de inventario de compatibilidad que analiza el software instalado y lo notifica a Microsoft.",
    },
    disable_problem_steps_recorder: {
      name: "Desactivar telemetría de Grabación de acciones",
      description:
        "Deshabilita la captura de errores y el envío de datos de diagnóstico de la Grabación de acciones de usuario (PSR).",
    },
    disable_ait_telemetry: {
      name: "Desactivar telemetría de impacto de aplicaciones (AIT)",
      description:
        "Desactiva la recopilación de datos de Application Impact Telemetry (AIT) al iniciar programas.",
    },
    disable_smartscreen_app_install: {
      name: "Desactivar telemetría de instalación de SmartScreen",
      description:
        "Deshabilita la telemetría de instalación y las consultas de verificación de URL de SmartScreen.",
    },
    disable_online_speech_privacy: {
      name: "Desactivar recopilación de reconocimiento de voz en línea",
      description:
        "Desactiva la recopilación de datos de voz en la nube para el dictado por voz y modelos de voz.",
    },
    disable_edge_shopping: {
      name: "Desactivar asistente de compras de Edge",
      description:
        "Deshabilita el asistente de compras y el rastreo de cupones de descuento en Microsoft Edge.",
    },
    disable_edge_metrics: {
      name: "Desactivar métricas de diagnóstico de Edge",
      description:
        "Deshabilita la transmisión de métricas de uso e informes de fallos de Microsoft Edge.",
    },
    disable_edge_startup_boost: {
      name: "Desactivar Inicio rápido de Edge",
      description:
        "Desactiva el inicio rápido de Microsoft Edge, evitando procesos en segundo plano al arrancar Windows.",
    },
    disable_edge_background_mode: {
      name: "Desactivar modo en segundo plano de Edge",
      description:
        "Impide que Microsoft Edge continúe ejecutándose en segundo plano al cerrarlo, liberando memoria del sistema.",
    },
    disable_bluetooth_le_discovery: {
      name: "Desactivar escaneo de Bluetooth LE en segundo plano",
      description:
        "Deshabilita el escaneo continuo en segundo plano de dispositivos Bluetooth Low Energy para ahorrar CPU y energía.",
    },
    disable_edge_wallet: {
      name: "Desactivar sugerencias de billetera de Edge",
      description:
        "Evita que Microsoft Edge consulte automáticamente los servicios de pago y billetera.",
    },
    disable_cortana_above_lock: {
      name: "Desactivar Cortana sobre la pantalla de bloqueo",
      description:
        "Evita que los asistentes de voz y la búsqueda escuchen o se activen mientras la pantalla está bloqueada.",
    },
    disable_device_history: {
      name: "Desactivar historial de actividad del dispositivo",
      description:
        "Evita que Windows registre y rastree el historial de aplicaciones y archivos en este dispositivo.",
    },
    disable_search_history: {
      name: "Desactivar historial de búsqueda de la barra de tareas",
      description:
        "Desactiva el registro de búsquedas anteriores en la barra de tareas y en el menú Inicio.",
    },
    disable_news_and_interests: {
      name: "Desactivar panel de Noticias e Intereses",
      description:
        "Oculta el widget del clima y noticias en la barra de tareas de Windows, ahorrando red y memoria en segundo plano.",
    },
    disable_auto_maintenance_wake: {
      name: "Desactivar reactivación por mantenimiento automático",
      description:
        "Evita que el mantenimiento automático de Windows reactive el equipo o consuma la batería por la noche.",
    },
    disable_diagnostic_data_viewer: {
      name: "Desactivar almacén de datos de diagnóstico local",
      description:
        "Evita que la telemetría de diagnóstico de Windows reserve y escriba bases de datos de caché locales en disco.",
    },
    disable_activity_feed: {
      name: "Desactivar fuente de actividades y línea de tiempo",
      description:
        "Evita que Windows genere gráficos de historial y rastree las actividades del usuario entre dispositivos.",
    },
    disable_publish_user_activities: {
      name: "Desactivar publicación de actividades de usuario en la nube",
      description:
        "Evita que Windows sincronice el historial de actividades con los servicios en la nube de Microsoft.",
    },
    disable_typing_insights: {
      name: "Desactivar información de escritura y telemetría",
      description:
        "Evita que Windows analice los patrones de pulsación de teclas y las estadísticas de autocompletado.",
    },
    disable_inking_typing_personalization: {
      name: "Desactivar personalización de entrada manuscrita y teclado",
      description:
        "Evita que Windows envíe a Microsoft el diccionario local de escritura a mano y teclado.",
    },
    disable_shared_experiences: {
      name: "Desactivar uso compartido entre dispositivos conectados",
      description:
        "Desactiva la sincronización en segundo plano de Connected Devices Platform (CDP) entre cuentas.",
    },
    disable_remote_desktop: {
      name: "Desactivar conexiones entrantes de Escritorio remoto",
      description:
        "Bloquea las conexiones entrantes de Escritorio remoto (RDP) para reducir la superficie de ataque.",
    },
    disable_edge_collections: {
      name: "Desactivar Colecciones de Microsoft Edge",
      description:
        "Desactiva las Colecciones de Edge y su sincronización en segundo plano para reducir el consumo de recursos.",
    },
    disable_edge_quick_search: {
      name: "Desactivar barra de búsqueda de escritorio de Edge",
      description:
        "Evita que Microsoft Edge muestre barras de búsqueda flotantes en el escritorio de Windows.",
    },
    disable_edge_personalization: {
      name: "Desactivar personalización y telemetría de Edge",
      description:
        "Desactiva el envío del historial de navegación y perfiles publicitarios en Microsoft Edge.",
    },
    disable_lockscreen_spotlight: {
      name: "Desactivar Contenido destacado de Windows en pantalla de bloqueo",
      description:
        "Evita la descarga de fondos de pantalla promocionales y sugerencias en la pantalla de bloqueo.",
    },
    disable_push_install_service: {
      name: "Desactivar servicio de instalación remota PushToInstall",
      description:
        "Evita que Microsoft Store envíe instalaciones de aplicaciones a este PC de forma remota.",
    },
    disable_compatibility_assistant: {
      name: "Desactivar Asistente para la compatibilidad de programas",
      description:
        "Desactiva las ventanas emergentes y análisis en segundo plano del Asistente para la compatibilidad de programas.",
    },
    disable_cortana_cloud_search: {
      name: "Desactivar indizador en la nube de Windows Search",
      description:
        "Evita que Windows Search consulte índices en la nube y servidores de Bing al buscar archivos locales.",
    },
    disable_find_my_device: {
      name: "Desactivar rastreo de Encontrar mi dispositivo",
      description:
        "Desactiva la transmisión continua de ubicación GPS y Wi-Fi para los servicios de Encontrar mi dispositivo.",
    },
    disable_sensors_data_collection: {
      name: "Desactivar recopilación de datos de sensores de hardware",
      description:
        "Desactiva la supervisión en segundo plano de sensores (luz ambiental, acelerómetro) y ubicación.",
    },
    disable_location_scripting: {
      name: "Desactivar acceso de scripts a la ubicación",
      description:
        "Evita que scripts en segundo plano y motores de navegador consulten la ubicación física del dispositivo.",
    },
    disable_advertising_info: {
      name: "Desactivar directiva de información publicitaria",
      description:
        "Aplica un bloqueo de directiva de grupo que desactiva el seguimiento del ID de publicidad para todos los usuarios.",
    },
    disable_sync_settings: {
      name: "Desactivar sincronización de configuración en la nube",
      description:
        "Evita que Windows sincronice personalización, contraseñas y preferencias del sistema con los servidores de Microsoft.",
    },
    disable_app_diagnostics_access: {
      name: "Desactivar acceso de aplicaciones a información de diagnóstico",
      description:
        "Bloquea que aplicaciones de terceros de la Tienda lean información de diagnóstico y telemetría.",
    },
    svchost_split_threshold: {
      name: "Consolidar procesos host de servicios",
      description:
        "Agrupa los servicios en segundo plano en procesos compartidos para reducir el número de procesos inactivos y el uso de memoria.",
    },
    disable_8dot3_names: {
      name: "Desactivar nombres cortos NTFS 8.3",
      description:
        "Detiene la generación de nombres cortos DOS 8.3 en unidades NTFS para acelerar las búsquedas de archivos y carpetas.",
    },
    disable_ntfs_last_access: {
      name: "Desactivar marcas de último acceso en NTFS",
      description:
        "Elimina escrituras innecesarias en disco al dejar de registrar la fecha de último acceso al abrir o leer archivos.",
    },
    disable_autologger_diagtrack: {
      name: "Desactivar sesión de autologger DiagTrack",
      description:
        "Detiene el registro circular continuo en disco de la sesión ETW de telemetría de DiagTrack.",
    },
    disable_autologger_sqm: {
      name: "Desactivar sesión de autologger SQM",
      description:
        "Detiene el registro en disco en segundo plano para el registrador de telemetría Software Quality Metrics (SQM).",
    },
    disable_autologger_ait: {
      name: "Desactivar sesión de autologger de eventos AIT",
      description:
        "Detiene el registro de eventos ETW en segundo plano del servicio Application Inventory and Telemetry (AIT).",
    },
    disable_autologger_diaglog: {
      name: "Desactivar sesión de autologger de diagnóstico",
      description:
        "Detiene la escritura circular en disco para las sesiones de seguimiento de errores y diagnóstico de Windows.",
    },
    disable_autologger_wifisession: {
      name: "Desactivar sesión de autologger de diagnóstico Wi-Fi",
      description:
        "Detiene el registro continuo de telemetría de diagnóstico para los estados de conexión Wi-Fi.",
    },
    disable_wersvc_service: {
      name: "Iniciar Informe de errores de Windows solo cuando sea necesario",
      description:
        "Detiene el servicio Informe de errores de Windows (WerSvc) y lo configura en Manual, reduciendo el trabajo en segundo plano.",
    },
    disable_mapsbroker_service: {
      name: "Desactivar servicio de Administrador de mapas descargados",
      description:
        "Detiene y deshabilita el servicio Administrador de mapas descargados (MapsBroker), evitando comprobaciones de red en segundo plano.",
    },
    disable_lfsvc_service: {
      name: "Iniciar el servicio de geolocalización solo cuando sea necesario",
      description:
        "Detiene el servicio de ubicación de Windows (lfsvc) y lo configura en Manual, evitando el sondeo continuo de ubicación.",
    },
    ads_in_settings: {
      name: "Ocultar el contenido promocional en Configuración",
      description:
        "Establece en 0 el valor por usuario SubscribedContent-338393Enabled. No modifica las demás superficies de sugerencias de Windows.",
    },
    quick_access_no_cloud: {
      name: "Ocultar archivos en la nube en Acceso rápido",
      description:
        "Establece ShowCloudFilesInQuickAccess en 0. Los elementos Recientes y Frecuentes usan ajustes distintos y no se modifican.",
    },
    hide_gallery_explorer: {
      name: "Ocultar Galería en el Explorador de archivos",
      description:
        "Establece en 1 el valor por usuario HideGallery. Oculta la entrada Galería del panel de navegación; no elimina ni mueve fotos.",
    },
    snap_assist_off: {
      name: "Limitar las sugerencias de Snap Assist",
      description:
        "Desactiva el ajuste de sugerencias de Snap Assist. No cambia el ajuste independiente del panel Snap Layouts, por lo que pueden quedar algunos avisos de acoplamiento.",
    },
    alt_tab_no_browser_tabs: {
      name: "Mostrar ventanas, no pestañas de Edge, en Alt+Tab",
      description:
        "Evita que las pestañas de Microsoft Edge aparezcan como entradas independientes en Alt+Tab. Las pestañas siguen abiertas; solo cambia el selector de ventanas.",
    },
    taskbar_button_combining: {
      name: "Agrupar los botones de la barra de tareas",
      description:
        "Establece TaskbarGlomLevel en 0 y agrupa las ventanas de una aplicación bajo un solo botón. Las ventanas individuales pueden ser menos visibles.",
    },
    no_toasts_fullscreen_video: {
      name: "Desactivar los avisos emergentes",
      description:
        "Establece NOC_GLOBAL_SETTING_TOASTS_ENABLED en 0. También podrían ocultarse avisos fuera de la reproducción a pantalla completa.",
    },
    no_window_snap_drag: {
      name: "Desactivar el acoplamiento al arrastrar ventanas",
      description:
        "Establece WindowArrangementActive en 0 para desactivar los diseños de acoplamiento que se activan al arrastrar una ventana. Otros atajos de gestión de ventanas pueden seguir funcionando.",
    },
    ui_classic_context_menu: {
      name: "Mostrar el menú contextual clásico",
      description:
        "Crea una modificación de Explorer por usuario para mostrar el menú contextual clásico en lugar del menú compacto de Windows 11. Puede ser necesario reiniciar Explorer o cerrar la sesión.",
    },
  },
  cleanup: {
    temp_cleanup: {
      name: "Limpiar archivos temporales",
      description:
        "Mueve el contenido de %TEMP% a la Papelera: puedes recuperarlo en cualquier momento, no es un borrado definitivo.",
    },
    winupdate_cache_cleanup: {
      name: "Vaciar la caché de Windows Update",
      description:
        "Mueve a la Papelera los paquetes de Windows Update ya instalados (requiere privilegios de administrador).",
    },
  },
};
