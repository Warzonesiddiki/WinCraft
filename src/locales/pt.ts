import type { Strings } from "../i18n";

/**
 * The Portuguese (European) table, on its own so the app can ship one language and
 * fetch the others on demand (Batch Z). It is data only: no logic lives here.
 */
export const pt: Strings = {
  coffee: {
    nav: "Ofereça-me um café",
    cta: "Financiar a próxima versão",
    fewer: "Um café menos",
    more: "Um café mais",
  },
  appName: "WinCraft",
  appliedCount: "{applied} de {total} ajustes ativos",
  headerNote:
    "Reveja cada alteração antes de a aplicar. As ferramentas de restauro abrangem as definições compatíveis; as operações de limpeza e reparação têm limites de recuperação diferentes.",
  advisor: {
    eyebrow: "Recomendado para o seu PC",
    applyButton: "Aplicar",
    confidenceHigh: "Alta confiança — baseado no hardware deste PC",
    confidenceStandard: "Recomendado para este tipo de máquina",
    reversible: "Reversível — o valor original é guardado antes de qualquer alteração.",
    empty: "Nada a recomendar por agora — a sua configuração já cumpre os nossos critérios.",
  },
  drift: {
    pickHint: "Desmarque o que alterou de propósito.",
    titleAfterUpdate: "O Windows voltou a mexer nas suas definições",
    titleNoUpdate: "Algumas definições já não estão ativas",
    afterUpdateOne:
      "Após a atualização para {patch}, um ajuste que tinha aplicado já não está ativo no sistema.",
    afterUpdateMany:
      "Após a atualização para {patch}, {count} ajustes que tinha aplicado já não estão ativos no sistema.",
    noUpdateOne:
      "Um ajuste que tinha aplicado já não está ativo no sistema. Não houve nenhuma atualização do Windows entretanto, por isso foi outra coisa a alterá-lo.",
    noUpdateMany:
      "{count} ajustes que tinha aplicado já não estão ativos no sistema. Não houve nenhuma atualização do Windows entretanto, por isso foi outra coisa a alterá-los.",
    reapplyOne: "Reaplicar o ajuste",
    reapplyMany: "Reaplicar {count} ajustes",
    reapplying: "A reaplicar...",
    reappliedOne: "Ajuste reaplicado.",
    reappliedMany: "{count} ajustes reaplicados.",
  },
  crashes: {
    title: "Encerramentos inesperados",
    subtitle:
      "A aplicação fechou sozinha. O relatório fica neste PC: copie-o e envie-o pelo Discord ou GitHub se quiser que seja corrigido.",
    copy: "Copiar relatório",
    copied: "Relatório copiado para a área de transferência.",
    clear: "Limpar",
    cleared: "Relatórios limpos.",
    processApp: "janela principal",
    processElevated: "operação com direitos de administrador",
  },
  ledger: {
    guardPaused: "Ajustes de aplicações em pausa",
    guardResumed: "Ajustes de aplicações retomados",
    processes: "Processos: {count}",
    restored: "Restaurado",
    postponed: "Adiada enquanto um jogo estava aberto",
    title: "Registo de alterações",
    subtitle:
      "Tudo o que esta aplicação alterou neste PC, do mais recente para o mais antigo. Guardado localmente, nunca enviado.",
    empty:
      "Ainda não há alterações registadas. Aplique o seu primeiro ajuste e ele aparecerá aqui.",
    clear: "Limpar histórico",
    clearing: "A limpar...",
    cleared: "Histórico limpo.",
    revert: "Reverter",
    elevated: "com privilégios de administrador",
    failed: "falhou",
    actions: {
      processGuard: "Jogo que se gere sozinho",
      coreSteering: "Distribuição de núcleos",
      ramTrim: "Limpeza de RAM",
      autoReverted: "Desfeito automaticamente",
      priorityRule: "Regra de prioridade",
      scheduledCleanup: "Limpeza agendada",
      ecoqos: "Eficiência de aplicações em segundo plano",
      applied: "Ajuste aplicado",
      reverted: "Ajuste revertido",
      cleanup: "Limpeza",
      filesDeleted: "Ficheiros eliminados",
      diskOptimize: "Otimização de disco",
      startupChange: "Alteração no arranque",
      restorePoint: "Ponto de restauro",
    },
  },
  tabs: {
    groupWorkspace: "Área de trabalho",
    overview: "Visão geral",
    groupMonitor: "Monitorizar",
    groupOptimize: "Otimizar",
    groupManage: "Gerir",
    scan: "Verificação",
    health: "Saúde do PC",
    hardware: "Hardware",
    performance: "Desempenho",
    privacy: "Privacidade",
    ui: "Interface",
    maintenance: "Manutenção",
    gaming: "Jogos",
    startup: "Arranque",
    profiles: "Perfis",
    pricing: "Planos e preços",
    ledger: "Histórico de alterações",
  },
  healthPanel: {
    title: "Pontuação de saúde",
    subtitle:
      "Uma pontuação explicável: cada número mostra os factos a partir dos quais foi calculado.",
    why: "Por que {score}?",
    refresh: "Recalcular",
    compute: "Calcular pontuação de saúde",
    showMore: "Mostrar mais",
    showLess: "Mostrar menos",
    stageProfile: "A ler o perfil do sistema",
    stageTweaks: "A verificar os ajustes aplicados",
    stageSecurity: "A ler o estado de segurança",
    stageScoring: "A calcular a pontuação",
    verdictExcellent: "EXCELENTE",
    verdictGood: "BOM",
    verdictFair: "RAZOÁVEL",
    verdictNeedsWork: "PRECISA MELHORAR",
    computing: "A analisar...",
    idleHint:
      "Nada é executado em segundo plano: a pontuação só é calculada quando a pede, inteiramente neste PC.",
    changeSinceLast: "desde a sua última verificação",
    changeNone: "Nenhuma alteração desde a sua última verificação.",
    changeFirstRun:
      "Primeira medição registada. Volte a executar após uma alteração para ver o que mudou.",
    changeWhyTitle: "Por que a pontuação mudou",
    changeContributes: "Contribuição para a pontuação geral:",
    changeStructural:
      "Uma atualização da aplicação mudou as categorias pontuadas — parte desta diferença não veio do seu PC.",
    changeTrend: "Tendência",
    categories: {
      performance: "Desempenho",
      gaming: "Jogos",
      responsiveness: "Capacidade de resposta",
      memory: "Memória",
      storage: "Armazenamento",
      startup: "Arranque",
      maintenance: "Manutenção",
      privacy: "Privacidade",
      security: "Segurança",
    },
  },
  transparency: {
    title: "O que isto altera, exatamente",
    key: "Chave",
    value: "Valor",
    setsTo: "Define como",
    note: "O valor anterior é guardado antes da escrita, por isso a reversão repõe-no exatamente como estava.",
    kindRegistry: "Registo",
    kindCommand: "Comando",
    kindService: "Serviço",
    copy: "Copiar",
    copied: "Copiado",
  },
  command: {
    statusQuiet: "Tudo tranquilo",
    statusScanning: "A verificar...",
    statusFindings: "{count} recomendações prontas",
    domainsLine: "Arranque · Armazenamento · Memória · Privacidade · Desempenho · Atualizações",
    consent: "Nada muda sem a sua aprovação.",
    runScan: "Executar verificação do sistema",
    reviewFindings: "Rever {count} recomendações",
    memTitle: "Pressão de memória",
    pressureLow: "Baixa",
    pressureElevated: "Elevada",
    pressureHigh: "Alta",
    memReview: "Rever a utilização de memória",
    memTopTitle: "Principais processos",
    trimTitle: "Reduzir conjuntos de trabalho",
    trimExplainer:
      "Pede ao gestor de memória do Windows que retire as páginas inativas dos conjuntos de trabalho das aplicações. Útil sob pressão elevada; as aplicações podem voltar a carregar páginas brevemente na utilização seguinte. Nenhum dado se perde. O Windows pede permissão de administrador.",
    trimButton: "Reduzir agora",
    autoTitle: "Redução automática",
    profilesTitle: "Perfis de sessão",
    profileGame: "Sessão de jogo",
    profileGameDesc: "Prepara o PC para jogar: energia, prioridade e captura DVR.",
    profileFocus: "Foco",
    profileFocusDesc: "Menos distrações, atividade não essencial sob controlo.",
    profileQuiet: "Sessão silenciosa",
    profileQuietDesc: "Eficiência, bateria e baixo ruído em primeiro lugar.",
    profileDownload: "Sessão de transferência",
    profileDownloadDesc: "Controla a largura de banda e a atividade em segundo plano.",
    previewBtn: "Pré-visualizar alterações",
    gameChange1: "Desativa o Game DVR (captura em segundo plano)",
    gameChange2: "Muda para o plano de energia Alto desempenho",
    gameChange3: "Otimiza a prioridade da CPU para jogos (Win32PrioritySeparation)",
    previewReq: "Requer privilégios de administrador",
    previewCost: "Custo potencial: maior consumo de energia e mais calor enquanto estiver ativa.",
    previewRevert: "Reversível com um clique: cada valor original é guardado antes.",
    applySession: "Iniciar sessão",
    restoreSession: "Restaurar",
    statusActive: "Ativa",
    statusOff: "Inativa",
    soon: "Em breve",
  },
  systemMonitor: {
    cpu: "CPU",
    ram: "Memória",
    disk: "Disco",
    uptime: "Ativo há",
    uptimeValue: "{hours}h {minutes}m",
    cores: "{count} núcleos",
  },
  startupManager: {
    title: "Programas de arranque",
    description:
      "Programas que abrem sozinhos quando o PC liga. Desativar alguns encurta o tempo de arranque: o programa continua instalado e pode sempre abri-lo manualmente.",
    empty: "Nenhum programa está configurado para iniciar automaticamente.",
    activeCount: "Ativos: {enabled} / {total}",
    machineWide: "Todos os utilizadores",
    impactNote: "Desativar um não desinstala nada e é reversível a qualquer momento.",
    refresh: "Atualizar",
    refreshing: "A reanalisar...",
    hiddenOrphans: "{count} entradas ocultas: o programa já não está instalado.",
    locationRun: "Registo",
    locationRun32: "Registo (32 bits)",
    locationFolder: "Pasta Arranque",
  },
  systemRepair: {
    title: "Verificação e reparação do Windows",
    description:
      "Verifica se os ficheiros de sistema e o arquivo de componentes do Windows estão intactos e, quando não estão, repara-os a partir dos servidores da Microsoft. São as mesmas ferramentas DISM e SFC que o suporte da Microsoft manda executar, sem linha de comandos.",
    adminNote:
      "Precisa de permissões de administrador: o Windows pede-as uma única vez e é criado um ponto de restauro antes de qualquer alteração.",
    timeNote:
      "Uma reparação completa pode demorar 20 minutos ou mais. Pode continuar a usar o PC — basta não o desligar.",
    checkButton: "Verificar integridade",
    checking: "A verificar...",
    cleanupButton: "Reduzir o arquivo de componentes",
    cleaningUp: "A reduzir...",
    cleanupNote:
      "Remove do WinSxS as versões de componentes já substituídas. As atualizações instaladas há pouco continuam a poder ser desinstaladas.",
    runningNote: "Não desligue nem reinicie o PC enquanto isto decorre.",
    cannotStop:
      "Depois de iniciado, não pode ser interrompido: o Windows está a verificar e a reparar os próprios ficheiros de sistema, e pará-lo a meio pode deixá-los reparados só em parte. Entretanto, pode continuar a usar o PC e o WinCraft.",
    stepQuick: "Leitura rápida do estado",
    stepScan: "A verificar o arquivo de componentes",
    stepRestore: "A reparar o arquivo de componentes",
    stepSfc: "A verificar os ficheiros de sistema",
    stepCleanup: "A reduzir o arquivo de componentes",
    stepOf: "Passo {index} de {total}",
    statusHealthy: "O Windows está intacto",
    statusRepairable: "Foram encontrados danos, mas são reparáveis",
    statusRepaired: "Danos encontrados e reparados",
    statusUnrepairable: "Foram encontrados danos que não foi possível reparar",
    statusCompleted: "Concluído",
    hintUnrepairable:
      "O passo seguinte costuma ser uma atualização no local do Windows. O código de erro está no resultado abaixo.",
    hintCompleted:
      "As ferramentas foram executadas. Com o idioma do seu Windows o resultado não pôde ser lido automaticamente — os detalhes estão no resultado abaixo.",
    logTitle: "Resultado",
    askRepair: "Quer repará-lo agora?",
    askRepairYes: "Sim, reparar agora",
    askRepairNo: "Agora não",
    repairAnyway: "Executar mesmo assim uma reparação completa",
    elapsed: "{time} decorridos",
    holdingAt:
      "Ainda nos {percent}% ao fim de {time}. O DISM fica na mesma percentagem durante vários minutos enquanto o Windows reconstrói os componentes em segundo plano: não bloqueou.",
    remaining: "~{minutes} min",
    underMinute: "< 1 min",
    estimating: "A estimar...",
    statElapsed: "Decorrido",
    statRemaining: "Restante",
    statFinish: "Fim previsto",
    waiting: "Em espera",
  },
  cookieCleaner: {
    title: "Limpeza seletiva de cookies",
    description:
      "Remove os cookies de rastreio e publicidade e mantém os que guardam as suas sessões. Nos sites da sua lista continua com sessão iniciada.",
    scanButton: "Analisar cookies",
    scanning: "A analisar...",
    cleanButton: "Limpar",
    cleaning: "A limpar...",
    noneFound: "Não foram encontrados cookies de navegador neste PC.",
    totals: "{removable} a remover, {protected} cookies de sessão mantidos",
    runningWarning: "Feche o {browser} para o limpar. Os números acima já estão corretos.",
    backupNote:
      "A base de dados de cookies é copiada antes da limpeza, por isso a operação pode ser anulada.",
    restoreButton: "Anular a última limpeza",
    restoring: "A restaurar...",
    restoredToast: "{browser}: cookies restaurados a partir da última cópia.",
    cleanedToast: "{removed} cookies removidos, {kept} sessões mantidas.",
    nothingToClean: "Não há nada a remover: todos os cookies estão na sua lista.",
    topDomains: "A maioria dos cookies vem de",
    whitelistTitle: "Sites onde manter a sessão iniciada",
    whitelistNote:
      "Os subdomínios também contam: ao adicionar google.com mantém-se igualmente accounts.google.com.",
    whitelistPlaceholder: "exemplo.com",
    whitelistAdd: "Adicionar",
    whitelistRemove: "Remover",
    whitelistReset: "Repor as predefinições",
  },
  appCache: {
    title: "Caches de programas de terceiros",
    description:
      "Caches de shaders, lançadores de jogos, aplicações de mensagens e gestores de pacotes guardam gigabytes de ficheiros que reconstroem sozinhos. Isto encontra-os nos programas que tem mesmo instalados.",
    scanButton: "Analisar caches",
    scanning: "A analisar...",
    cleanButton: "Limpar a seleção",
    cleaning: "A limpar...",
    noneFound: "Não foram encontradas caches de terceiros neste PC.",
    permanentNote:
      "Estes ficheiros são eliminados definitivamente e não vão para a Reciclagem: enviar gigabytes para lá não liberta nada enquanto não for esvaziada. Tudo o que aparece aqui é reconstruído sozinho pelo programa que o criou.",
    blockedBy: "O {process} está em execução, por isso os ficheiros dele serão ignorados.",
    selectedTotal: "{size} selecionados",
    cleanedToast: "{freed} libertados.",
    skippedNote: "{count} ficheiros estavam em utilização e foram deixados intactos.",
    catShaders: "Caches de shaders",
    catLaunchers: "Lançadores de jogos",
    catApps: "Aplicações",
    catDev: "Ferramentas de programação",
    catWindows: "Windows",
    names: {
      shader_dx: "Cache de shaders DirectX",
      shader_nvidia: "Cache de shaders NVIDIA",
      shader_amd: "Cache de shaders AMD",
      shader_intel: "Cache de shaders Intel",
      steam: "Cache web do Steam",
      epic: "Cache do Epic Games Launcher",
      battlenet: "Cache do Battle.net",
      discord: "Cache do Discord",
      vscode: "Cache do Visual Studio Code",
      npm: "Cache de pacotes npm",
      pip: "Cache de pacotes pip",
      crash_dumps: "Despejos de falhas de aplicações",
      error_reports: "Relatórios de erros do Windows",
    },
  },
  scheduledTasks: {
    title: "Tarefas agendadas no arranque",
    description:
      "Atualizadores e serviços em segundo plano que arrancam ao iniciar sessão ou ao ligar o PC a partir do Agendador de Tarefas, onde a lista de Arranque do Windows nunca os mostra. As tarefas do próprio Windows não aparecem aqui.",
    empty: "Não há tarefas de terceiros no arranque deste PC.",
    activeCount: "Ativas: {enabled} / {total}",
    triggerLogon: "Ao iniciar sessão",
    triggerBoot: "Ao ligar",
    refresh: "Atualizar",
    refreshing: "A reler...",
    note: "Desativar uma tarefa não desinstala nada e pode voltar a ativá-la quando quiser.",
  },
  search: {
    placeholder: "Procurar um ajuste...",
    noResults: 'Nenhum resultado para "{query}".',
    clear: "Limpar",
  },
  pricing: {
    title: "Grátis para todos",
    intro:
      "O WinCraft é gratuito e de código aberto: todas as ferramentas incluídas, sem subscrição e sem funcionalidades pagas.",
    planName: "Tudo incluído",
    planTagline:
      "Todas as ferramentas, todos os ajustes, todas as funcionalidades: sem restrições.",
    priceAmount: "$0",
    priceNote: "para sempre",
    features: [
      "Todos os ajustes e otimizações do sistema",
      "Ferramentas avançadas de gaming e privacidade",
      "Limpeza do disco, desfragmentação e reparação do sistema",
      "Atualização de drivers e diagnóstico de hardware",
      "Sessões de jogo e perfis de monitorização",
      "Purga de memória Zero-Trace e destruição segura de ficheiros",
      "Todas as atualizações futuras incluídas",
    ],
    commitmentTitle: "O nosso compromisso",
    commitmentBody:
      "O WinCraft é e continuará a ser gratuito. Todos devem poder usar ferramentas que ajudam a compreender e a otimizar o seu PC: sem custos escondidos, sem funcionalidades bloqueadas, sem subscrições.",
  },
  toggle: { on: "Ativado", off: "Desativado" },
  driverBooster: {
    title: "Driver Booster",
    subtitle:
      "Escolha os drivers que estão a ficar para trás e abra todas as respetivas páginas de transferência de uma vez.",
    scan: "Analisar drivers",
    scanning: "A analisar...",
    selectAll: "Selecionar tudo",
    selectNone: "Limpar seleção",
    selectedCount: "{selected} de {total} selecionados",
    pagesForSelection: "{pages} páginas a abrir",
    openSelected: "Abrir páginas de transferência ({count})",
    opened: "{count} páginas abertas",
    openedCapped:
      "Abertas {opened} de {total} páginas: as restantes ficam selecionadas, execute de novo.",
    allCurrent: "Nenhum driver parece desatualizado.",
    nothingActionable: "Nenhum driver antigo tem uma página do fabricante para abrir.",
    note: "O WinCraft não transfere pacotes de drivers sozinho: não existe uma API do fabricante que indique a versão certa para o seu dispositivo exato, e instalar o driver de vídeo errado é um dos poucos erros capazes de o deixar sem imagem. Isto automatiza a parte aborrecida — encontrar as páginas — e não a escolha. Para os drivers que o Windows Update conhece de facto, use o botão acima.",
  },
  secureDefrag: {
    title: "Desfragmentação segura",
    willDefrag: "Este disco é mecânico: será executada uma desfragmentação real.",
    willRetrim:
      "Este disco não está confirmado como mecânico: o volume inteiro é analisado e depois é executado um retrim em vez de uma desfragmentação. O retrim demora segundos e só diz respeito ao espaço livre — é esse o seu papel: indicar ao controlador que blocos já não são usados. Desfragmentar um SSD não o acelera, apenas o desgasta.",
    start: "Iniciar",
    running: "A executar...",
    working: "A processar...",
    phaseAnalyze: "Análise",
    phaseOptimize: "Otimização",
    analysisTitle: "Relatório de análise",
    doneDefrag: "Desfragmentação concluída.",
    doneRetrim: "Retrim concluído.",
    note: "É criado antes um ponto de restauro. A percentagem vem do próprio Windows, não de um temporizador.",
  },
  zeroTrace: {
    title: "Zero-Trace Cleaner",
    subtitle:
      "Remove o que os programas fechados deixam na memória e destrói ficheiros sem recuperação possível.",
    purgeTitle: "Limpeza de memória",
    purgeBody:
      "O Windows mantém na RAM as páginas dos programas fechados como cache. Isto liberta-as: os fragmentos deixados por um processo terminado desaparecem mesmo da memória física.",
    purgeButton: "Limpar memória",
    purging: "A limpar...",
    purgeResult: "Libertados {freed} MB — agora {after} MB livres",
    purgeLimit:
      "Não toca no ficheiro de paginação nem no de hibernação: estão em disco e o Windows não oferece uma API para os limpar em execução.",
    shredTitle: "Destruição segura de ficheiros",
    shredBody:
      "Sobrescreve o conteúdo do ficheiro em três passagens antes de o eliminar, colocando-o fora do alcance das ferramentas de recuperação comuns.",
    shredButton: "Escolher ficheiros...",
    shredding: "A destruir...",
    shredDone: "{count} ficheiros destruídos ({size})",
    shredSummary: "{shredded} destruídos, {skipped} ignorados",
    shredWarning: "Definitivo: sem Reciclagem, sem recuperação.",
    ssdCaveat:
      "Num SSD, o nivelamento de desgaste escreve quase sempre em células diferentes do original. As antigas são libertadas, não reescritas — só o secure-erase do disco pode garantir mais.",
  },
  hud: {
    title: "Overlay de jogo",
    subtitle:
      "Um painel transparente sobre o jogo: carga de CPU/GPU, temperaturas, VRAM, processo ativo com a sua prioridade e indicador de estrangulamento.",
    fpsAbout:
      "Os FPS são contados a partir dos eventos de apresentação que o Windows emite a cada fotograma — a mesma fonte que o PresentMon lê, sem prender nada ao jogo. Exige iniciar como administrador, porque abrir uma sessão de rastreio é uma operação privilegiada.",
    fpsLowExplained:
      "Ao lado da média aparece DROP: a velocidade do um por cento de fotogramas piores, aquilo a que noutros sítios chamam «1% low». É o número que se mexe quando o jogo engasga, enquanto a média fica alta e não o diz. Quanto mais perto DROP estiver da média, mais fluido está o jogo.",
    fpsStart: "Medir FPS",
    fpsStop: "Parar medição",
    fpsNeedsAdmin: "Para medir os FPS é preciso iniciar o WinCraft como administrador.",
    fpsRunning: "A medir: os FPS aparecem no overlay assim que um jogo começar a desenhar.",
    show: "Mostrar",
    hide: "Ocultar",
    lock: "Bloquear",
    unlock: "Desbloquear",
    dragHint: "Arraste a sobreposição para onde quiser e bloqueie-a antes de iniciar o jogo.",
    lockedHint: "Bloqueada: os cliques atravessam-na e chegam ao jogo. Desbloqueie-a para a mover.",
    sizeCompact: "Compacto",
    sizeNormal: "Normal",
  },
  updater: {
    title: "Atualização disponível: v{version}",
    body: "Transfere e instala num só passo; a aplicação reinicia-se sozinha ao terminar.",
    install: "Instalar e reiniciar",
    later: "Mais tarde",
    downloading: "A transferir... {percent}%",
    installing: "A instalar...",
    error: "A atualização falhou: {message}",
    checkFailed: "Não foi possível procurar atualizações: {message}",
  },
  badges: { admin: "Admin", soon: "EM BREVE" },
  emptyCategory: "Ainda não há ajustes disponíveis nesta categoria — mais em breve.",
  gameSessions: {
    title: "Sessões de jogo",
    subtitle:
      "Deteta os seus jogos automaticamente e aplica e reverte sozinho o preset Turbo Gaming.",
    active: "Sessão ativa: {name}",
    gamesCount: "{count} jogos registados",
    addGame: "+ Adicionar jogo (.exe)",
    steeringTitle: "Distribuição de núcleos",
    steeringVcache:
      "O jogo corre no die com 3D V-Cache ({count} threads). As outras aplicações ficam onde o Windows as coloca.",
    steeringHybrid:
      "O jogo corre nos núcleos de desempenho ({game} threads) e as outras aplicações da sua sessão passam para os núcleos de eficiência ({background} threads). As aplicações a que subiu a prioridade acima do normal não são tocadas.",
    steeringActive: "{count} processos distribuídos para este jogo.",
    steeringNone:
      "Não há nada a distribuir neste processador: não foi encontrado um tipo de núcleo mais rápido nem uma cache maior do que as outras.",
    steeringActiveVcache: "O jogo está a correr no die com V-Cache.",
    steeringNeedsSessions:
      "Só funciona com o Game Sessions ativo e enquanto um dos seus jogos está a correr.",
  },
  latencyTrace: {
    title: "Latência de DPC e interrupções",
    subtitle:
      "Mede quanto tempo duram as chamadas de procedimento diferidas (DPC) e as rotinas de serviço de interrupção (ISR) de cada controlador, lidas diretamente do kernel do Windows. Não altera nada; requer privilégios de administrador.",
    duration: "Duração",
    secondsOption: "{seconds} s",
    run: "Medir",
    running: "A medir durante {seconds} s…",
    dpcSummary:
      "DPC mais longa: {max} ms (limite {limit} ms). {over} de {count} passaram o limite.",
    isrSummary:
      "Rotina de interrupção mais longa: {max} ms (limite {limit} ms). {over} de {count} passaram o limite.",
    colDriver: "Controlador",
    colDpc: "DPC mais longa",
    colIsr: "Interrupção mais longa",
    colOver: "Acima do limite",
    unattributed: "Não atribuído",
    hidden:
      "O Windows ocultou os endereços dos controladores, por isso as rotinas não puderam ser atribuídas.",
    verdictGood: "Nenhum controlador passou os limites da Microsoft durante esta medição.",
    note: "Recomendação da Microsoft: uma DPC deve terminar em menos de 0,1 ms e uma ISR em menos de 0,025 ms. O dxgkrnl.sys distribui as interrupções do ecrã, por isso o seu tempo pertence muitas vezes ao controlador gráfico.",
    verdictBad:
      "{driver} ocupou um processador durante {max} ms seguidos. Bloqueios acima de um milissegundo podem causar estalidos no áudio e engasgos no tempo de fotograma; atualizar esse controlador ou voltar à versão anterior costuma resolver.",
    verdictMinor:
      "{over} rotinas passaram a recomendação da Microsoft; a mais longa durou {max} ms. Excessos curtos como estes são comuns e raramente audíveis.",
    lost: "O Windows perdeu {events} eventos e {buffers} buffers durante a medição, por isso os tempos máximos mostrados são um mínimo.",
    verdictBadUnattributed:
      "Uma rotina que não foi possível atribuir a nenhum controlador ocupou um processador durante {max} ms seguidos. Bloqueios acima de um milissegundo podem causar estalidos no áudio e engasgos no tempo de fotograma.",
    spikesTitle: "Rotinas individuais mais longas",
    spikeLine: "{kind} de {duration} ms em {driver}, aos {at} s do início",
  },
  networkCheck: {
    title: "Verificação de rede",
    subtitle:
      "Envia 32 pings para 1.1.1.1 e abre uma ligação TCP, e depois mostra o que a pilha de rede do Windows está realmente a fazer. Não altera nada.",
    run: "Verificar",
    running: "A verificar…",
    offline: "Sem ligação à Internet.",
    rtt: "Ida e volta: mediana {median} ms (mín. {min}, máx. {max})",
    jitter: "Variação (jitter): {jitter} ms",
    loss: "Respostas: {received} de {sent}",
    tcpRtt: "Ida e volta segundo a pilha TCP: {rtt} ms",
    nagleOn:
      "As novas ligações começam com o algoritmo de Nagle ativo (TCP_NODELAY desligado). As aplicações que precisam de o desligar fazem-no nos seus próprios sockets.",
    nagleOff: "As novas ligações começam com o algoritmo de Nagle desligado.",
    buffers:
      "Buffer de receção: {reserved} reservados por socket, {autotuned} ajustados automaticamente pelo Windows",
    verdictNone:
      "Um ping não passa pelas definições TCP, por isso estas leituras descrevem a própria ligação.",
    verdictInconclusive: "Poucas respostas para comparar.",
    verdictLineChanged:
      "A própria linha mudou entre as duas leituras (mediana {delta} ms). Um ping não passa pelas definições TCP, por isso não é o efeito da alteração.",
    lastTitle: "Depois de {tweak}, {time}",
    socketsBeforeAfter:
      "Novos sockets, antes → depois: Nagle {nagleBefore} → {nagleAfter}, buffer de receção {bufBefore} → {bufAfter}",
    stateOn: "ativo",
    stateOff: "desligado",
  },
  turboBoost: {
    title: "Turbo Boost",
    subtitle:
      "Ajusta o modo boost e o estado mínimo do processador. O consumo e o calor podem aumentar; os resultados dependem da carga de trabalho.",
    startLabel: "Iniciar",
    stopLabel: "Parar",
    activating: "A ativar o turbo...",
    deactivating: "A restaurar...",
    active: "Turbo ativo",
    inactive: "Turbo inativo",
    loadLabel: "CARGA DA CPU",
    loadCadence: "Medida a cada segundo, suavizada em cerca de 3 segundos",
    ownLoad: "Nos últimos segundos: o próprio WinCraft {own}% · tudo o resto {rest}%",
    stageReading: "A ler o plano de energia",
    stageRaising: "A elevar o limite de boost",
    stageApplying: "A aplicar ao sistema",
    stageMeasuringBefore: "A medir antes",
    stageMeasuringAfter: "A medir de novo",
    factAverage: "Velocidade média agora",
    factFastest: "Núcleo mais rápido agora",
    factPeak: "Máximo nesta sessão",
    factFloor: "Estado mínimo do processador",
    ofBase: "{pct}% da frequência base",
    usersTitle: "Quem está a usar a CPU agora",
    appliedAt:
      "Ativado em {time} · modo boost Agressivo, estado mínimo do processador a 100% com alimentação elétrica",
    planAlreadyUses: "O plano de energia atual já usa estas definições.",
    planAlreadyHad:
      "O plano de energia atual já tinha estas definições, por isso nenhum valor mudou.",
    loadExplain:
      "A carga é o trabalho que o processador está a fazer; o Turbo Boost muda a velocidade a que pode trabalhar, não quão ocupado está. Um valor alto significa que há programas a trabalhar neste PC neste momento.",
    chartLoad: "Carga",
    chartSpeed: "Velocidade",
    testTitle: "O mesmo teste em cada modo",
    testHint:
      "Uma carga fixa de 3 segundos. Execute-a uma vez em cada modo para ver o que o boost muda.",
    testRun: "Executar teste de 3 segundos",
    testRunning: "A testar…",
    colDefault: "Predefinido",
    colBoost: "Boost",
    rowWork: "Trabalho feito",
    rowAvg: "Velocidade média",
    rowPeak: "Velocidade máxima",
    rowTemp: "Temperatura da CPU",
    notRun: "Ainda não executado",
    relative: "{pct}% do predefinido",
  },
  profiles: {
    title: "Os seus perfis",
    subtitle:
      "Guarde os ajustes ativos num perfil. Reutilize uma configuração ou exporte-a para outro PC.",
    saveHeading: "Guardar os ajustes ativos",
    namePlaceholder: "Nome (ex.: Jogos)",
    saveButton: "Guardar",
    savedHeading: "Perfis guardados",
    empty: "Ainda não há perfis guardados.",
    tweakCount: "{count} ajustes",
    apply: "Aplicar",
    applying: "A aplicar...",
    exportButton: "Exportar",
    importButton: "Importar de ficheiro",
    deleteButton: "Eliminar",
    savedToast: 'Configuração "{name}" guardada',
    appliedToast: "{count} ajustes aplicados",
    exportedToast: "Ficheiro exportado",
    importedToast: "Importado: {count} ajustes prontos para revisão",
    droppedWarning: "{count} entradas que esta versão não reconhece foram descartadas",
    nameRequired: "Dê um nome à configuração",
    reviewNotice:
      "Uma configuração importada nunca é aplicada sozinha — revê-la primeiro é sempre o seu passo.",
    signInRequired: "Inicie sessão ou crie uma conta para guardar configurações.",
  },
  scan: {
    lastScan: "Última análise: {time}",
    neverScanned: "Nenhuma análise concluída",
    extraChecks: "Verificações adicionais",
    checksHint:
      "Apenas leituras do sistema: nada é alterado automaticamente. Abra uma categoria para ver os detalhes.",
    unavailable: "Verificação indisponível",
    startupSummary: "{enabled} ativos · {orphaned} destinos ausentes",
    tasksSummary: "{enabled} tarefas de arranque ativas",
    partialScan: "Resultados parciais: algumas verificações estão indisponíveis.",
    scanFailed: "A análise falhou. Tente novamente.",
    title: "Verificação rápida",
    subtitle:
      "Verifica o estado do seu PC e encontra otimizações que ainda não estão ativas, com um clique.",
    startLabel: "VERIFICAR",
    stepPerformance: "Desempenho",
    stepPrivacy: "Privacidade",
    stepGaming: "Jogos",
    stepJunk: "Ficheiros temporários",
    allGood: "Tudo certo — nenhum problema encontrado.",
    issuesFound: "{count} otimizações disponíveis",
    selectAll: "Selecionar tudo",
    deselectAll: "Desmarcar tudo",
    fixAll: "Corrigir tudo",
    fixing: "A corrigir {done}/{total}...",
    fixedToast: "{count} problemas corrigidos.",
    scanAgain: "Verificar novamente",
    verdictRecommended: "Recomendado neste PC",
    verdictNotRecommended: "Não recomendado para este PC",
    verdictUnsupported: "Não suportado",
    reasons: {
      laptop_battery: "este PC é um portátil: gasta mais bateria do que devolve",
      hdd_index_cost:
        "o disco do sistema é mecânico, por isso a indexação em segundo plano nota-se mesmo",
      fast_disk_no_gain:
        "o disco do sistema é NVMe, suficientemente rápido para tornar a poupança insignificante",
      needs_win10_2004: "requer o Windows 10 versão 2004 ou mais recente",
      weak_gpu: "gráficos integrados: a transparência custa desempenho que poderia ser aproveitado",
    },
    thisPc: "Este PC",
    dashDrivesTitle: "Armazenamento",
    dashFreeOf: "{free} livres de {total}",
    dashAlmostFull: "Quase cheio",
    dashStartupTitle: "Aplicações de arranque",
    dashStartupCount: "{on} de {total} ativados",
    dashManage: "Gerir",
    dashUptimeTitle: "Ativo há",
    dashUptimeDh: "{days}d {hours}h",
    dashUptimeHm: "{hours}h {minutes}min",
    dashUptimeLongHint:
      "Este PC não reinicia há bastante tempo. Um reinício aplica as atualizações pendentes e liberta memória retida.",
    dashHistoryTitle: "Ações recentes",
    dashHistoryEmpty: "Ainda nada. As ações que realizar aparecerão aqui.",
    dashActTweakApplied: "Ajuste aplicado",
    dashActTweakReverted: "Ajuste revertido",
    dashActCleanup: "Limpeza",
    dashActFilesDeleted: "Ficheiros eliminados",
    dashActStartupChange: "Arranque alterado",
    dashActDiskOptimize: "Disco otimizado",
    dashActRestorePoint: "Ponto de restauro",
    profileUnknown: "Não detetado",
    diskHdd: "HDD",
    diskSsd: "SSD",
    diskNvme: "NVMe",
    formDesktop: "Computador de secretária",
    formLaptop: "Portátil",
    groupRecommended: "Recomendado para este PC",
    groupOptional: "Opcional",
    groupNotRecommended: "Não recomendado aqui",
    tailoredNote: "Cada item é avaliado com base no hardware acima, e não numa lista fixa.",
    fixRecommended: "Aplicar os {count} recomendados",
    fixEverything: "Aplicar selecionados ({count})",
    nothingSelected: "Nada selecionado",
    foundHeadline: "{count} vale a pena corrigir neste PC",
    foundNone: "Nada a corrigir",
    doneTitle: "Pronto!",
    doneBody: "{count} otimizações aplicadas. O seu PC está em ordem.",
    fixHeading: "Pronto para aplicar",
  },
  ram: {
    autoNeedsAdmin:
      "A limpeza automática só funciona quando o WinCraft tem direitos de administrador.",
    title: "Libertar RAM",
    subtitle:
      "Pede ao Windows que liberte a memória que os programas retêm sem a usar. O Windows pede permissão de administrador de cada vez, e a limpeza espera se houver um jogo aberto.",
    button: "Libertar agora",
    cleaning: "A limpar...",
    freed: "{amount} libertados",
    freedNothing: "A memória já estava otimizada",
    inUse: "{used} de {total} em utilização",
    autoLabel: "Limpeza automática",
    autoOff: "Desativada",
    autoEvery: "A cada {interval}",
    autoHint:
      "Com a limpeza automática ativada, o WinCraft liberta RAM sozinho a intervalos regulares. Só o consegue fazer enquanto é executado como administrador: o Windows pede permissão para cada limpeza, e uma limpeza agendada não pode pedi-la.",
    autoPausedNotAdmin:
      "Em pausa: o WinCraft não está a ser executado como administrador, por isso a limpeza automática não pode ser executada. Para a usar, feche o WinCraft e volte a abri-lo com «Executar como administrador». A limpeza manual continua a funcionar: o Windows pede permissão de cada vez.",
    autoNext: "Próxima limpeza às {time}",
    autoDue: "Limpeza prestes a decorrer...",
    autoLast: "Última às {time}: {amount} libertados",
    autoNoneYet: "Ainda não foi executada nenhuma limpeza automática.",
    autoFailed: "A última tentativa falhou: {detail}",
  },
  restore: {
    button: "Restaurar ajustes ativos",
    title: "Restaurar os ajustes ativos?",
    body: "Restaura {count} ajustes a partir dos valores guardados. As ferramentas configuráveis têm os seus próprios controlos de restauro.",
    confirm: "Restaurar ajustes",
    cancel: "Cancelar",
    running: "A restaurar...",
    doneToast: "{count} otimizações restauradas.",
    nothingToast: "Não há nada para restaurar.",
  },
  passwordCheck: {
    title: "Verificação de fugas de palavras-passe",
    description:
      "Verifica se uma palavra-passe apareceu em alguma fuga de dados conhecida, sem nunca a enviar completa: só é enviado um fragmento do respetivo hash (k-anonimato, o mesmo padrão usado pelo Have I Been Pwned).",
    placeholder: "Cole uma palavra-passe para verificar",
    button: "Verificar",
    checking: "A verificar...",
    safe: "Não encontrada em nenhuma fuga conhecida. Bom sinal.",
    breached:
      "Encontrada em {count} fugas conhecidas. Mude-a agora, em todos os sítios onde a usa.",
    error: "Não foi possível verificar agora: confirme a sua ligação e tente novamente.",
  },
  cleanupConfirm: {
    previewLoading: "A calcular o que irá para a Reciclagem...",
    previewEmpty: "Nada a limpar - a pasta já está vazia.",
    previewNotAccessible:
      "O conteúdo não pode ser lido sem privilégios de administrador; o processo autorizado vai listá-lo e removê-lo.",
    previewTruncated: "A mostrar os 500 maiores itens; os totais incluem tudo.",
    selectedSummary: "{count} itens selecionados · {size}",
    confirmSelected: "Limpar selecionados",
    title: "Confirmar limpeza?",
    body: '"{name}" vai mover os ficheiros correspondentes para a Reciclagem do Windows. Pode restaurá-los a partir daí até a esvaziar.',
    confirm: "Mover para a Reciclagem",
    cancel: "Cancelar",
  },
  cleanupButton: "Limpar",
  cleanupRunning: "...",
  cleanupResultToast: "{deleted} itens movidos para a Reciclagem, {freed} libertados",
  cleanupResultToastSkipped: " ({skipped} em utilização, ignorados).",
  diskOptimize: {
    title: "Otimizar unidade",
    description:
      "Executa o próprio otimizador do Windows: desfragmentação num HDD ou TRIM num SSD (nunca uma desfragmentação completa, que só o desgastaria sem qualquer benefício).",
    button: "Otimizar agora",
    running: "A otimizar... pode demorar alguns minutos",
    cannotStop:
      "Quem o faz é o otimizador de unidades do Windows, com direitos de administrador, por isso vai até ao fim sozinho e não pode ser parado daqui. Pode continuar a trabalhar sem problema.",
    resultToast: "Unidade ({media}) otimizada com sucesso.",
  },
  dnsFlush: {
    title: "Limpar cache de DNS",
    description:
      "Limpa as consultas DNS em cache. Útil se um site mudou de servidor e o navegador continua a mostrar a versão antiga.",
    button: "Limpar agora",
    running: "A limpar...",
    resultToast: "Cache de DNS limpo.",
  },
  browserCleanup: {
    title: "Limpeza do navegador",
    description:
      "Limpa a cache e os cookies do Chrome, do Edge e do Firefox. O navegador recria-os sozinho na próxima abertura, por isso nada se perde realmente.",
    noneFound: "Não foi encontrado nenhum navegador compatível neste PC.",
    cache: "Cache",
    cookies: "Cookies",
    clearButton: "Limpar",
    clearing: "A limpar...",
    runningWarning: "Feche o {browser} para limpar.",
    clearedToast: "{browser}: {freed} libertados.",
  },
  tweakyDriverPromo: {
    title: "Tweaky Driver",
    description:
      "Encontre pacotes de drivers de fontes compatíveis na nossa aplicação dedicada. Verifique a compatibilidade antes de instalar. Aplicação separada; cobertura variável.",
    button: "Explorar Tweaky Driver",
    error: "Não foi possível abrir a página. Tente novamente.",
  },
  redaxaPromo: {
    title: "Redaxa",
    description:
      "Já cortou a telemetria e o rastreio — mas o que cola em chats de IA? O Redaxa deteta dados pessoais e credenciais antes de um prompt chegar a qualquer modelo. Mesma família, mesma regra: nada é guardado.",
    button: "Experimentar na web",
  },
  uninstallerPromo: {
    title: "WinCraft Uninstaller",
    description:
      "Remova programas inteiros em segurança: ponto de restauro automático, comando verificado, relatório honesto. Da mesma família do WinCraft.",
    button: "Transferir",
    confirmTitle: "Transferir o desinstalador?",
    confirmBody:
      "O WinCraft Uninstaller é uma aplicação separada do mesmo conjunto e inicia sessão com a mesma conta que esta. A transferência obtém o instalador (cerca de 4 MB) diretamente da versão no GitHub, para o Windows 10 e 11 de 64 bits.",
    confirmUnsigned:
      "O WinCraft Uninstaller é assinado digitalmente por Aurelio Avila. Verifique o editor e a assinatura nas propriedades do ficheiro. O SmartScreen ainda pode apresentar avisos.",
    confirmDownload: "Transferir",
    confirmOpenPage: "Abrir a página",
    cancel: "Cancelar",
  },
  live: {
    title: "Neste momento",
    subtitle:
      "Atualizado a cada segundo enquanto esta página está aberta e o WinCraft está em primeiro plano. Nada é medido em segundo plano.",
    paused: "Em pausa",
    pausedHint: "Em pausa enquanto o WinCraft está em segundo plano. Retoma quando voltar.",
    measuring: "A medir…",
    smooth: "Tudo fluido",
    busy: "Ocupado",
    strained: "Sob carga elevada",
    verdictDetail: "CPU a {cpu}% nos últimos 10 segundos · memória em utilização a {ram}%",
    failed: "As leituras em tempo real não estão disponíveis neste momento.",
    cpu: "Processador",
    speed: "{ghz} GHz",
    cores: "{count} processadores lógicos",
    core: "Processador {n}",
    memory: "Memória",
    used: "Em utilização",
    cached: "Em cache",
    free: "Livre",
    total: "Total",
    cachedHint: "A memória em cache é devolvida assim que um programa precisa dela.",
    notAvailable: "Não disponível neste PC",
    disk: "Atividade do disco",
    read: "Leitura",
    write: "Escrita",
    systemDrive: "Unidade do sistema: {used} usados de {total}",
    network: "Rede",
    down: "Transferência",
    up: "Envio",
    gpu: "Gráficos",
    gpuLoad: "Carga",
    temp: "Temperatura",
    fan: "Ventoinha",
    vram: "Memória de vídeo",
    sensors: "Temperaturas e ventoinhas",
    sensorsHint:
      "Neste PC, o Windows não expõe estes sensores sem as ferramentas do fabricante, por isso nada é estimado.",
    now: "agora",
    secondsAgo: "há {s} s",
    activity: "Atividade",
    zoomShort: "1 min",
    zoomLong: "5 min",
    minutesAgo: "há {n} min",
    peak: "Pico {value}",
    insightRecovering:
      "O processador está a acalmar: estava acima de 75 % em média e a última leitura é {pct} %.",
    insightCalm: "Está tudo calmo. Neste momento nada precisa da sua atenção.",
    insightMemory:
      "A memória está muito ocupada ({pct}%). Feche as aplicações que não está a usar ou veja o que arranca com o Windows.",
    insightCpu:
      "O processador está ocupado há algum tempo ({pct}% em média). A lista abaixo mostra o que o está a usar.",
    insightDrive:
      "A unidade do sistema está quase cheia ({pct}%). O Windows fica mais lento quando falta espaço.",
    actionStartup: "Abrir Arranque",
    actionCleanup: "Libertar espaço",
    usingTitle: "O que está a usar recursos",
    usingHint:
      "Aplicações agrupadas por nome, a partir da lista de processos do Windows. Nada é aberto nem alterado.",
    usingCpu: "Processador",
    usingMemory: "Memória",
    processes: "{count} processos",
    processOne: "1 processo",
  },
  pageError: {
    title: "Esta página teve um problema",
    body: "O resto do WinCraft continua a funcionar e este erro não alterou nada no seu PC. Recarregue a página para tentar novamente.",
    reload: "Recarregar a página",
    reloadApp: "Recarregar o WinCraft",
    details: "Detalhes técnicos",
    appTitle: "O WinCraft teve um problema",
    appBody: "Este erro não alterou nada no seu PC. Recarregue o WinCraft para continuar.",
  },
  folderScan: {
    stop: "Parar pesquisa",
    stopping: "A parar…",
    stoppedEmpty: "Pesquisa interrompida. Nada foi movido nem eliminado.",
    stoppedPartial:
      "Pesquisa interrompida. Estes são os resultados encontrados antes da interrupção; o que ainda não tinha sido alcançado não foi verificado.",
  },
  largeFiles: {
    title: "Encontrar ficheiros grandes",
    description:
      "Procura numa pasta os maiores ficheiros (acima de 100 MB), para libertar espaço rapidamente removendo os que já não precisa.",
    chooseFolder: "Escolher pasta",
    scanning: "A verificar...",
    noneFound: "Não foi encontrado nenhum ficheiro acima de {size}.",
    foundCount: "{count} ficheiros encontrados",
    moveSelected: "Mover {count} selecionados para a Reciclagem",
    deleting: "A mover para a Reciclagem...",
    deletedToast: "{count} ficheiros movidos, {freed} libertados.",
  },
  diskHealth: {
    title: "Saúde da unidade",
    freeSpace: "{size} livres",
    selectDrive: "Unidade",
    healthy: "Saudável",
    warning: "Alerta",
    unhealthy: "Comprometida",
    unknown: "Desconhecida",
    loading: "A verificar...",
  },
  duplicateFinder: {
    title: "Encontrar ficheiros duplicados",
    description:
      "Escolha uma pasta: encontre ficheiros idênticos e decida quais mover para a Reciclagem.",
    chooseFolder: "Escolher pasta",
    scanning: "A verificar...",
    noneFound: "Não foram encontrados ficheiros duplicados nesta pasta.",
    copies: "{count} cópias · {size} cada",
    moveSelected: "Mover para a Reciclagem ({count} selecionados)",
    deleting: "...",
    deletedToast: "{count} ficheiros movidos para a Reciclagem ({freed} libertados).",
  },
  ipMask: {
    title: "Mascarar IP (VPN)",
    description:
      "Oculta o seu endereço IP encaminhando o tráfego por um servidor VPN. Requer um serviço de VPN externo: ainda não integrado nesta versão.",
    button: "Saiba mais",
    explainerToast:
      "O mascaramento real do IP precisa de um back-end de VPN dedicado (servidor e protocolo). Ainda não está ligado — isto é apenas uma pré-visualização da funcionalidade.",
  },
  toasts: {
    applied: '"{name}" aplicado.',
    rolledBack: '"{name}" restaurado ao valor original.',
    elevationDeclined:
      "A permissão de administrador não foi concedida, por isso nada foi alterado.",
    accountRefreshFailed:
      "Não foi possível verificar o estado da sua conta. O que aparece aqui pode estar desatualizado — verifique a sua ligação ou tente novamente mais tarde.",
  },
  titlebar: {
    applied: "{applied}/{total} ativos",
    cpu: "CPU",
    ram: "RAM",
    minimize: "Minimizar",
    maximize: "Maximizar",
    restore: "Restaurar",
    close: "Fechar",
  },
  x3d: {
    title: "Alinhador de die 3D V-Cache",
    subtitle:
      "Em processadores compatíveis com caches L3 de tamanhos diferentes entre chips, limita um processo em execução ao chip com mais cache. Esta escolha substitui o agendamento automático desse processo e pode melhorar ou piorar o desempenho.",
    cpuLabel: "Processador",
    readyHeadline: "Die com V-Cache encontrado: {cores} threads",
    readyBody: "Fixe um jogo neste die e cada uma das suas threads fica onde está a cache.",
    singleDie:
      "Este processador tem apenas um die: todos os núcleos veem a mesma cache, por isso não há nada para alinhar. A funcionalidade aparece sozinha numa CPU de dois dies com cache assimétrica.",
    uniformCache:
      "Este processador tem vários dies, todos com a mesma quantidade de cache. Mover um jogo entre eles não mudaria nada, por isso a funcionalidade fica desativada.",
    unavailable: "O Windows não devolveu um mapa de cache para este processador.",
    dieLabel: "Die {index}",
    dieCache: "{mb} MB L3",
    dieThreads: "{count} threads",
    vcacheBadge: "V-Cache",
    processesTitle: "Processos em execução",
    processesHint: "Os mais ativos primeiro. Escolha o jogo e fixe-o no die da cache.",
    refresh: "Atualizar",
    refreshing: "A ler...",
    align: "Alinhar",
    reset: "Repor",
    alignedBadge: "Alinhado",
    noProcesses: "Nenhum processo suficientemente grande para valer a pena listar.",
    persistenceNote:
      "A afinidade pertence ao processo em execução: desaparece quando o jogo fecha e tem de ser definida de novo da próxima vez. Nenhuma definição do sistema é alterada.",
    alignedToast: "{name} fixado no die com V-Cache.",
    resetToast: "{name} devolvido a todos os núcleos.",
  },
  hardware: {
    intro:
      "Lido diretamente dos próprios sensores do seu hardware. Onde um sensor não existe, dizemo-lo, em vez de mostrar um número que ninguém pode verificar.",
    gpuLabel: "Placa gráfica",
    cpuLabel: "Processador",
    liveBadge: "Em direto",
    gpuDriver: "Driver {version}",
    load: "Utilização da GPU",
    vram: "Memória de vídeo",
    fan: "Ventoinha",
    power: "Consumo de energia",
    fanIdle: "parada: desnecessária abaixo de 50°",
    powerLimit: "limite de {limit} W",
    tempCool: "fria",
    tempGood: "saudável",
    tempWarm: "quente",
    tempHot: "muito quente",
    traceLabel: "Esta sessão",
    traceRange: "mín {min}° · máx {max}°",
    noTempSensor: "Esta placa não expõe um sensor de temperatura.",
    cpuAcpiSource: "lido da zona térmica ACPI",
    cpuNoSensor:
      "Temperatura da CPU indisponível: o firmware não expõe nenhuma zona térmica ACPI. O WinCraft mostra apenas as leituras disponibilizadas pelo Windows.",
    noGpuTool:
      "Nenhuma placa NVIDIA detetada. A AMD e a Intel não oferecem uma ferramenta de consulta equivalente, por isso as respetivas temperaturas não podem ser lidas sem o software do próprio fabricante.",
    thermalsUnavailable: "Não foi possível ler os sensores neste sistema.",
    driversTitle: "Idade dos drivers",
    driversSubtitle:
      "Há quanto tempo existem os drivers fornecidos pelo fabricante. O Windows sabe o que está instalado, não o que está disponível: isto indica a idade que consegue comprovar, nunca um falso aviso de atualização.",
    driversRescan: "Voltar a analisar",
    driversScanning: "A verificar...",
    driversCounted: "{count} drivers de fabricantes",
    driversAging: "{count} com mais de 2 anos",
    driversStale: "{count} com mais de 4 anos",
    driversAllCurrent: "Todos recentes",
    driversNone: "Nenhum driver de terceiros nestas categorias.",
    driversShowAll: "Mostrar mais {count}",
    driversShowLess: "Mostrar menos",
    driversInboxNote:
      "{count} drivers nativos da Microsoft excluídos: o Windows Update trata deles e a data é um valor fixo, por isso contá-los como antigos seria um falso alarme.",
    ageYears: "{years} anos",
    ageYear: "{years} ano",
    ageMonths: "{months} meses",
    ageMonth: "{months} mês",
    vendorSite: "Site do fabricante",
    watchLabel: "A observar",
    peakLabel: "Pico",
    verdictRisky: "Arriscado",
    verdictNormal: "Normal",
    verdictBetter: "Melhor do que o esperado",
    verdictIdle: "Inativo",
    verdictRiskyHint:
      "A placa passou dos 84°, o ponto em que começa a reduzir o próprio desempenho para se proteger. Verifique a ventilação ou mude para o perfil Silencioso.",
    verdictNormalHint: "Temperaturas no intervalo normal para uma placa sob carga: nada alarmante.",
    verdictBetterHint:
      "Ficou abaixo dos 65° enquanto trabalhava a sério: arrefecimento melhor do que a média.",
    verdictIdleHint:
      "Ainda não trabalhou o suficiente para avaliar. Uma placa inativa está fria de qualquer forma, por isso isso não provaria nada.",
    profilesTitle: "Perfis térmicos",
    profilesSubtitle:
      "Estes definem o limite de energia da placa, a alavanca que realmente controla o calor e o ruído da ventoinha. Cada valor vem dos limites que a própria placa indica.",
    currentLimit: "Agora: {watts} W",
    modeSilent: "Silencioso",
    modeSilentHint:
      "Para trabalho, streaming e sessões longas: a ventoinha fica quase silenciosa e a placa trabalha bem mais fria, à custa de alguns fotogramas.",
    modeStandard: "Padrão",
    modeStandardHint:
      "Um limite equilibrado um pouco abaixo do teto da placa: ventoinha mais silenciosa e temperaturas mais baixas, com um custo de poucos pontos em fotogramas.",
    modeGaming: "Jogos",
    modeGamingHint:
      "Para sessões competitivas: watts no máximo e um teto de clock elevado, para manter os 1% mais baixos mais estáveis quando importa.",
    modeApplying: "A aplicar...",
    profileStageReading: "A ler os limites da placa",
    profileStageApplying: "A aplicar o limite",
    profileStageSettling: "A aguardar a resposta das ventoinhas",
    profileApplied: "Limite definido para {watts} W.",
    profileNote:
      "Requer privilégios de administrador e é reposto ao reiniciar. Isto não é uma curva de ventoinha: a NVIDIA não expõe controlo direto da ventoinha no nvidia-smi, e as ferramentas que o oferecem usam APIs privadas e não documentadas que esta aplicação não utiliza.",
    profileDefaultIsMax:
      "Nesta placa o limite de energia de fábrica já é igual ao máximo, por isso Silencioso é o único perfil que muda a potência: Jogos distingue-se elevando antes o teto de clock.",
    driverInstalled: "instalado v{version} em {date}",
    driversHardwareChanged:
      "Esta lista foi analisada num hardware diferente do que o PC tem agora (por exemplo, uma placa gráfica substituída), por isso foi apagada. Analisa novamente para ler os dispositivos realmente instalados.",
    driversNoUpdateCheck:
      "Este ecrã não contacta nenhum fabricante e não pode saber se existe uma versão mais recente: mostra a versão instalada e a respetiva idade, e leva-o à página oficial para verificar por si.",
    driversCheckedAt: "Lido às {time}",
    modeClockLocked: "clock até {mhz} MHz",
    modeClockAuto: "clock automático",
    profileApply: "Aplicar perfil",
    profileActive: "Perfil ativo",
    profileWillSet: "Vai definir {watts} W, {clock}",
    scanStarting: "A iniciar a verificação...",
    scanReading: "A ler a classe {class}",
    scanCount: "{done}/{total} · {pct}%",
    driversScannedAll: "{total} drivers examinados em {classes} categorias",
    winUpdateLabel: "Windows Update",
    winUpdateButton: "Verificar no Windows Update",
    winUpdateNote:
      "Isto verifica apenas o próprio catálogo do Windows Update, não os drivers específicos listados acima: muitos fabricantes - sobretudo de áudio e chipset integrados - nunca publicam ali as suas atualizações, só no próprio site. O WinCraft não transfere pacotes de drivers sozinho: não existe uma API do fabricante que indique o que é atual para o seu dispositivo exato, e instalar o driver de vídeo errado é um dos poucos erros capazes de o deixar sem imagem.",
    winUpdateOpened: "Windows Update aberto.",
    winUpdateSearching: "A procurar...",
    winUpdateTakesAWhile: "Pode demorar um minuto: consulta o catálogo da Microsoft.",
    winUpdateInstall: "Transferir e instalar ({count})",
    winUpdateInstalling: "A transferir e a instalar...",
    winUpdateNone:
      "O Windows Update não tem nada mais recente a oferecer, mesmo para os drivers marcados como antigos acima: muitos fabricantes publicam as suas atualizações à sua maneira, não pelo Windows Update.",
    winUpdateFailed: "A pesquisa falhou: {detail}",
    winUpdateDone: "Instalados {installed}, falharam {failed}.",
    rebootTitle: "O Windows está a pedir um reinício",
    rebootBody:
      "O Windows indica que uma instalação só termina após um reinício. Pode fazê-lo agora ou quando lhe for conveniente.",
    rebootNow: "Reiniciar agora",
    rebootLater: "Mais tarde",
  },
  menu: {
    account: "Conta",
    plan: "Plano",
    planFree: "Grátis",
    viewPlan: "Ver o seu plano",
    language: "Idioma",
    theme: "Temas",
    about: "Sobre",
    errorReports: "Relatórios de erros anónimos",
    errorReportsBody:
      "Quando algo falha, envia apenas a mensagem de erro (nunca dados pessoais) para nos ajudar a corrigir erros. Desativado por predefinição.",
    changePhoto: "Alterar foto de perfil",
    removePhoto: "Remover foto",
    photoFailed: "Não foi possível usar essa imagem como foto de perfil.",
    support: "Suporte",
    reportIssue: "Comunicar um problema",
    aboutBody: "WinCraft — ajustes de sistema com cópia de segurança e reversão automáticas.",
    close: "Fechar",
  },
  auth: {
    login: "Iniciar sessão",
    register: "Registar-se",
    email: "E-mail",
    password: "Palavra-passe",
    loginButton: "Iniciar sessão",
    rememberMe: "Manter sessão iniciada",
    registerButton: "Criar conta",
    working: "...",
    logout: "Terminar sessão",
    loggedInAs: "Sessão iniciada como {email}",
    backendNotConfigured:
      "Ainda não há nenhum servidor ligado: defina API_BASE_URL assim que o back-end estiver implementado.",
    switchToRegister: "Não tem conta? Registe-se",
    switchToLogin: "Já tem uma conta? Inicie sessão",
    emailInvalid: "Introduza um endereço de e-mail válido.",
    passwordTooShort: "A palavra-passe deve ter pelo menos 8 caracteres.",
    firstName: "Nome",
    lastName: "Apelido",
    registerDetailsRequired: "Nome, apelido e data de nascimento são obrigatórios.",
    loginRequiredToResend: "Inicie sessão primeiro e depois peça um link novo.",
    checkInboxAfterSignup:
      "Enviámos uma ligação de confirmação para {email}. Verifique também o spam: assim que confirmar, a sua conta fica pronta.",
    forgotPasswordLink: "Esqueceu-se da palavra-passe?",
    forgotPasswordButton: "Enviar ligação de reposição",
    forgotPasswordSent:
      "Se esse e-mail estiver registado, receberá uma ligação para repor a palavra-passe.",
    backToLogin: "Voltar ao início de sessão",
    emailNotVerified: "E-mail não verificado",
    emailVerified: "E-mail verificado",
    resendVerification: "Reenviar",
    verificationSent: "E-mail de verificação enviado.",
    deleteAccount: "Eliminar conta",
    deleteAccountBody:
      "Remove o teu endereço de email, a palavra-passe e os dados guardados, termina a sessão em todos os dispositivos e não pode ser anulado. Uma avaliação que publicaste continua visível, sem o endereço associado.",
    deleteAccountPassword: "A tua palavra-passe atual",
    deleteAccountConfirmLabel: "Escreve DELETE para confirmar",
    deleteAccountSubmit: "Eliminar a minha conta definitivamente",
    deleteAccountCancel: "Cancelar",
    deleteAccountDone:
      "A tua conta foi eliminada. A sessão foi terminada em todos os dispositivos.",
    deleteAccountBlocked:
      "Esta conta tem uma subscrição ativa. Cancela-a em Gerir subscrição; caso contrário, eliminar a conta deixaria o cartão a ser cobrado.",
    deleteAccountWrongPassword: "Essa palavra-passe não corresponde a esta conta.",
    deleteAccountNeedsLogin: "A tua sessão expirou. Inicia sessão novamente para eliminar a conta.",
    deleteAccountUnreachable:
      "Não foi possível contactar o servidor. Nada foi eliminado — verifica a ligação e tenta de novo.",
  },
  driftWatch: {
    title: "Vigiar as atualizações do Windows",
    body: "Uma atualização cumulativa repõe aquilo que não reconhece: as suas alterações desaparecem e só dá por isso semanas depois, se der. Com isto ligado, a verificação corre no início de sessão e só o avisa quando algo deixou mesmo de estar em vigor.",
    on: "Ligada",
    off: "Desligada",
  },
  guard: {
    settingTitle: "Deixar em paz os jogos que se gerem sozinhos",
    settingBody:
      "Alguns jogos gerem o próprio desempenho. Enquanto um deles está aberto, o WinCraft suspende os ajustes por aplicação e deixa o jogo exatamente como está.",
    selfManaged: "Este jogo gere o próprio desempenho, por isso o WinCraft deixa-o como está.",
    gameRunning:
      "Há um jogo aberto que gere o próprio desempenho, por isso o WinCraft deixa as aplicações como estão até o fechar.",
    paused: "Em pausa enquanto houver um jogo aberto que gere o próprio desempenho.",
    selfManagedBadge: "Gere o próprio desempenho",
    registeredGameRunning:
      "Um dos seus jogos está aberto, por isso o WinCraft espera até que feche.",
  },
  preview: {
    title: "Pré-visualização",
    loading: "A ler os valores atuais...",
    now: "Agora",
    notSet: "Não definido",
    willChange: "Aplicar muda {count} de {total} valores.",
    noChange: "Já está em vigor: aplicar não muda nada.",
    readAtApply: "O estado atual é lido e guardado no momento em que aplica.",
    failed: "Não foi possível ler os valores atuais.",
  },
  requirements: {
    minBuild: "{version} ou mais recente",
    proEdition: "Pro, Enterprise ou Education",
    unavailableVersion: "Indisponível neste PC: requer {version} ou mais recente.",
    unavailableEdition: "Indisponível neste PC: requer Windows Pro, Enterprise ou Education.",
    enterpriseEdition: "Enterprise ou Education",
    unavailableEnterpriseEdition: "Indisponível neste PC: requer Windows Enterprise ou Education.",
    notPresent: "Este PC não tem esta funcionalidade, por isso não há nada para desativar.",
    retired:
      "Retirado: este controlo antigo já não pode ser aplicado. O estado guardado anteriormente ainda pode ser restaurado.",
    windowsProtected:
      "Neste PC, o Windows protege esta opção e recusa alterações de outras aplicações. Desative os Widgets em Definições > Personalização > Barra de tarefas.",
  },
  scheduledCleanup: {
    title: "Limpeza semanal de ficheiros temporários",
    body: "Uma vez por semana, alguns minutos depois de iniciar sessão, move para a Reciclagem os ficheiros temporários em que ninguém mexe há um dia. Espera se houver um jogo aberto e nunca mexe na memória nem nas aplicações abertas.",
  },
  priorityRules: {
    title: "Regras de prioridade de aplicações",
    subtitle:
      "Escolha uma aplicação e uma prioridade. O WinCraft aplica-a sempre que a aplicação inicia enquanto o WinCraft está aberto, e repõe a prioridade anterior quando remove a regra ou fecha o WinCraft. Nunca acima de Alta.",
    remove: "Remover",
    empty: "Ainda nenhuma aplicação.",
    active: "Aplicações abertas ajustadas: {count}",
    levelLabel: "Prioridade de {name}",
    idle: "Baixa",
    belowNormal: "Abaixo do normal",
    normal: "Normal",
    aboveNormal: "Acima do normal",
    high: "Alta",
  },
  skinpacks: {
    title: "Aspeto do Windows",
    description: "Aplica um aspeto reversível à shell do Windows deste utilizador.",
    packName: "Aspeto escuro inspirado no COSMIC",
    packBody:
      "Ativa o modo escuro, aplica um destaque turquesa, reduz a transparência, aplana os rebordos das janelas e alinha a barra de tarefas à esquerda. Os nove valores do Registo são guardados antes de serem alterados.",
    scope:
      "Só altera o aspeto da shell do Windows. Não instala o COSMIC nem substitui o ambiente de trabalho do Windows.",
    apply: "Aplicar aspeto",
    restore: "Restaurar aspeto anterior",
    active: "Aspeto ativo",
    applying: "A aplicar…",
    valuesSummary:
      "Este aspeto utiliza {count} valores do Registo; ao aplicá-lo, os valores originais são guardados para permitir o restauro.", // uses {count}
  },
  tweaks: {
    disable_click_to_do: {
      name: "Desativar o Click to Do",
      description:
        "Aplica a política do Windows que remove o Click to Do, a funcionalidade que captura o seu ecrã e o analisa para sugerir ações. Os pontos de acesso desaparecem para todas as contas deste PC. As Definições vão mostrá-la como gerida pela sua organização: é assim que o Windows indica as políticas. Só tem efeito nos PCs em que o Windows oferece o Click to Do.",
    },
    disable_edge_ai: {
      name: "Desativar as funcionalidades de IA do Microsoft Edge",
      description:
        "Aplica políticas do Microsoft Edge para as suas funcionalidades de IA. As que têm efeito dependem do perfil do Edge: impedir que o Edge transfira o seu modelo de IA local funciona em todos os perfis; ocultar a barra lateral e desativar a pesquisa com IA no histórico e os temas gerados por IA funciona nos perfis que não têm sessão iniciada com uma conta Microsoft pessoal; desativar o acesso do Copilot ao conteúdo das páginas e a respetiva ajuda de escrita funciona apenas em perfis profissionais ou escolares. O Edge aplica-as sem reiniciar; edge://policy mostra a lista. O Edge vai indicar que é gerido pela sua organização: é assim que indica as políticas.",
    },
    disable_paint_ai: {
      name: "Desativar as funcionalidades de IA do Paint",
      description:
        "Aplica as políticas do Windows que desativam o Cocreator, o Image Creator e o preenchimento generativo no Paint. O resto do Paint funciona como antes.",
    },
    disable_notepad_ai: {
      name: "Desativar as funcionalidades de IA do Bloco de Notas",
      description:
        "Aplica a política do Bloco de Notas que desativa as ferramentas de escrita do Copilot (reescrever, resumir, escrever). Feche e volte a abrir o Bloco de Notas para ver a alteração.",
    },
    disable_fast_startup: {
      name: "Desativar o arranque rápido",
      description:
        "Faz com que o comando Encerrar desligue mesmo o PC, em vez de o hibernar parcialmente. O Windows demora alguns segundos a mais a arrancar a frio, mas os drivers e as atualizações carregam do zero de cada vez, e os sistemas com dual boot deixam de encontrar o disco do Windows bloqueado.",
    },
    disable_storage_sense: {
      name: "Desativar o Sensor de Armazenamento",
      description:
        "Impede que o Windows elimine ficheiros temporários, esvazie a Reciclagem e deixe ficheiros do OneDrive apenas online segundo o seu próprio calendário. Decide o que é limpo e quando.",
    },
    taskbar_end_task: {
      name: "Adicionar Terminar tarefa à barra de tarefas",
      description:
        "Adiciona Terminar tarefa ao menu de clique direito das aplicações na barra de tarefas, para fechar uma aplicação bloqueada sem abrir o Gestor de Tarefas.",
    },
    disable_drag_tray: {
      name: "Desativar o painel de arrastar",
      description:
        "Impede que o painel de partilha (chamado Drop tray nas versões mais recentes) desça do topo do ecrã sempre que arrasta um ficheiro, para que o arrastar e largar normal funcione sem interferências. O valor vem da documentação da comunidade do Windows, não da Microsoft; as atualizações recentes do Windows 11 também oferecem esta opção nas Definições.",
    },
    explorer_open_this_pc: {
      name: "Abrir o Explorador de Ficheiros em Este PC",
      description:
        "Configura o Explorador de Ficheiros para abrir em Este PC, com as unidades e pastas, em vez de abrir em Início. Só altera a página inicial; a entrada Início continua disponível no painel de navegação.",
    },
    block_oem_device_apps: {
      name: "Impedir que aplicações dos fabricantes se instalem sozinhas",
      description:
        "Impede que o Windows transfira aplicações dos fabricantes e ícones personalizados para os dispositivos que liga, que é como alguns utilitários de rato, teclado e placa-mãe chegam sem ninguém os pedir. Os drivers continuam a ser instalados normalmente.",
    },
    disable_windows_suggestions: {
      name: "Desativar dicas e sugestões do Windows",
      description:
        'Um único botão para os avisos que o Windows acrescenta por iniciativa própria: dicas e sugestões, o ecrã de boas-vindas após atualizações, sugestões nas Definições, "concluir a configuração do dispositivo", notificações sugeridas, recomendações e avisos de conta no menu Iniciar e anúncios de fornecedores de sincronização no Explorador de Ficheiros. São os valores que os botões das Definições do Windows gravam, conforme documentado pela comunidade do Windows; a Microsoft não os documenta, por isso uma atualização do Windows pode alterá-los.',
    },
    disable_widgets: {
      name: "Desativar os widgets por completo",
      description:
        "Aplica a política do Windows que desativa o próprio painel de widgets, não só o botão na barra de tarefas, para que o feed de notícias deixe de carregar em segundo plano. As Definições vão mostrá-la como gerida pela sua organização: é assim que o Windows indica as políticas.",
    },
    hide_start_recommended: {
      name: "Remover Recomendados do menu Iniciar",
      description:
        "Aplica a política do Windows que remove a secção Recomendados do Iniciar e deixa todo o espaço para as suas aplicações afixadas. As Definições vão mostrá-la como gerida pela sua organização: é assim que o Windows indica as políticas.",
    },
    disable_game_bar_captures: {
      name: "Desativar as capturas da Game Bar",
      description:
        "Desativa a funcionalidade de captura da Game Bar e a gravação em segundo plano, que mantém um vídeo contínuo dos seus últimos minutos de jogo. Complementa o botão Game Bar / Game DVR.",
    },
    disable_ai_fabric_service: {
      name: "Iniciar o anfitrião de componentes de IA do Windows só quando necessário",
      description:
        "Para o serviço anfitrião de componentes de IA do Windows (WSAIFabricSvc) e define-o como Manual, para que deixe de arrancar com o Windows. O Windows pode continuar a iniciá-lo quando uma aplicação ou funcionalidade do Windows o pedir. O Windows descreve-o como o serviço que fornece serviços de componentes de IA a aplicações e a outros serviços do Windows. Só existe nos PCs que o têm.",
    },
    disable_restart_apps: {
      name: "Impedir a reabertura de apps após iniciar sessão",
      description:
        "Impede o Windows de reabrir apps reiniciáveis da sessão anterior. A sessão deixa de ser restaurada automaticamente; não fecha apps agora nem altera o início de sessão automático.",
    },
    enable_long_paths: {
      name: "Ativar caminhos longos em apps compatíveis",
      description:
        "Permite a apps que declaram suporte de caminhos longos ultrapassar o limite tradicional. Apps antigas e algumas operações do Explorador podem continuar limitadas. Reinicie as apps; restaurar pode tornar caminhos longos existentes inacessíveis.",
    },
    disable_filter_keys_shortcut: {
      name: "Evitar a ativação acidental das Teclas de Filtro",
      description:
        "Desativa apenas o atalho Shift direito para as Teclas de Filtro. A função de acessibilidade e os tempos configurados não mudam; a latência do teclado não diminui.",
    },
    ecoqos_rules: {
      name: "Regras de eficiência para apps em segundo plano",
      description:
        "Atribui menor prioridade energética aos executáveis escolhidos enquanto o WinCraft está aberto. As regras pausam quando a app fica interativa; não são um limite percentual da CPU.",
    },
    limit_do_background_download: {
      name: "Limite das transferências do Windows em segundo plano",
      description:
        "Configura um limite em KB/s para as transferências da Microsoft através da Otimização da Entrega. Não limita o Steam nem outros dispositivos e não garante menor latência.",
    },
    monitor_refresh_profile: {
      name: "Perfil de frequência do monitor para jogos",
      description:
        "Escolhe uma frequência suportada para um monitor durante uma sessão de jogo, com pré-visualização temporária e restauro. Não aumenta os fotogramas produzidos pela GPU.",
    },
    cpu_energy_performance: {
      name: "Priorizar o desempenho da CPU ligada à tomada",
      description:
        "Define como 0 a preferência energética da CPU no plano atual quando ligada à tomada. Requer CPPC autónomo; os limites térmicos e do firmware continuam válidos. Pode aumentar o calor e o consumo. Não altera a bateria. Teste a sua carga de trabalho.",
    },
    pcie_link_power: {
      name: "Manter as ligações PCIe ativas na tomada",
      description:
        "Desativa a poupança de energia das ligações PCIe no plano atual quando ligado à tomada. Opção de diagnóstico para transições de energia; não garante menor latência. Pode aumentar o consumo em repouso. Não altera a bateria.",
    },
    usb_suspend_diagnostics: {
      name: "Diagnosticar a reativação USB na tomada",
      description:
        "Desativa a suspensão seletiva USB na tomada para investigar problemas de reativação ou desconexão. O Windows recomenda mantê-la ativada normalmente. Restaure após o teste; o consumo em repouso pode aumentar. Não altera a bateria.",
    },
    hybrid_short_threads: {
      name: "Preferir núcleos de desempenho para threads curtas",
      description:
        "Em CPUs com diferentes classes de eficiência, solicita ao Windows que prefira núcleos de desempenho para threads curtas na tomada. É uma preferência, não uma afinidade fixa. O agendamento automático pode funcionar melhor. Não altera a bateria.",
    },
    hybrid_long_threads: {
      name: "Preferir núcleos de desempenho para threads longas",
      description:
        "Em CPUs com diferentes classes de eficiência, solicita ao Windows que prefira núcleos de desempenho para threads longas na tomada. Os outros núcleos continuam disponíveis; não desativa os E-cores. Compare rendimento e resposta. Não altera a bateria.",
    },
    disable_startup_delay: {
      name: "Remover o atraso das aplicações no arranque",
      description:
        "O Windows espera propositadamente cerca de 10 segundos após o início de sessão antes de abrir os seus programas de arranque. Isto remove essa espera.",
    },
    menu_show_delay: {
      name: "Resposta instantânea dos menus",
      description:
        "Remove o atraso integrado antes de os menus abrirem, o que torna toda a área de trabalho visivelmente mais ágil.",
    },
    disable_power_throttling: {
      name: "Desativar limitação de energia da CPU",
      description:
        "Impede o Windows de reduzir a velocidade de processos em segundo plano para poupar energia - útil em portáteis onde a limitação causa pequenas paragens em sessões longas.",
    },
    games_gpu_priority: {
      name: "Definir o valor legado GPU Priority dos jogos",
      description:
        "Grava o valor GPU Priority dos jogos, que a Microsoft documenta como não utilizado. Não se espera ganho de prioridade de GPU nem de fotogramas por segundo.",
    },
    disable_tailored_experiences: {
      name: "Desativar experiências personalizadas",
      description:
        "Impede o Windows de usar os seus dados de diagnóstico para personalizar anúncios, dicas e recomendações.",
    },
    disable_app_launch_tracking: {
      name: "Deixar de registar que aplicações abre",
      description:
        "O Windows regista a frequência com que abre cada programa para ordenar os resultados do menu Iniciar. Isto desativa esse registo.",
    },
    disable_feedback_requests: {
      name: "Parar os pedidos de feedback do Windows",
      description:
        "Impede que o Windows o interrompa com inquéritos do tipo 'Qual a probabilidade de recomendar...'.",
    },
    disable_cortana: {
      name: "Desativar a Cortana",
      description:
        "Desativa a Cortana através de política de sistema, libertando os recursos em segundo plano que ela reserva.",
    },
    show_file_extensions: {
      name: "Mostrar sempre as extensões de ficheiro",
      description:
        "Revela a extensão real de cada ficheiro. Vale a pena ativar só pela segurança: expõe ficheiros como 'fatura.pdf.exe' que o Windows normalmente esconde.",
    },
    hide_taskbar_widgets: {
      name: "Ocultar Widgets da barra de tarefas",
      description:
        "Remove o botão de Widgets de meteorologia/notícias, que carrega conteúdo em segundo plano mesmo quando nunca o abre.",
    },
    network_latency: {
      name: "Confirmações TCP e agrupamento de pacotes",
      description:
        "Define TcpAckFrequency e TCPNoDelay como 1 no adaptador que leva a rota para a Internet. Isto afeta o comportamento TCP; o tráfego UDP não muda. O suporte depende do Windows e das aplicações, pelo que não há garantia de menor latência nos jogos.",
    },
    disable_window_animations: {
      name: "Animações de janela instantâneas",
      description:
        "Remove a animação de deslizar/desvanecer que o Windows mostra sempre que uma janela abre, fecha ou minimiza. A animação é tempo de espera puro - removê-la faz a área de trabalho responder no instante do clique e liberta o trabalho da GPU por trás dela.",
    },
    disable_drag_full_windows: {
      name: "Arrastamento de janelas mais leve",
      description:
        "Desenha um contorno enquanto arrasta uma janela em vez de redesenhar todo o seu conteúdo a cada fotograma. Quase impercetível numa GPU rápida, uma diferença clara em gráficos integrados ou máquinas mais antigas.",
    },
    mouse_hover_delay: {
      name: "Resposta instantânea ao passar o rato",
      description:
        "O Windows espera 400 ms antes de reagir ao ponteiro parado sobre algo - pré-visualizações da barra de tarefas, descrições, menus. Isto reduz essa espera a quase nada, para que a interface acompanhe o rato em vez de ficar atrás dele.",
    },
    disable_background_apps: {
      name: "Impedir aplicações de correr em segundo plano",
      description:
        "Impede que as aplicações da Store corram, se atualizem e consultem a rede enquanto não as está a usar. Isso é CPU, RAM e bateria gastos a sério em aplicações que não abriu.",
    },
    disable_delivery_optimization: {
      name: "Desativar a partilha ponto a ponto das atualizações do Windows",
      description:
        "Configura a Otimização da Entrega no modo apenas HTTP, impedindo este PC de transferir conteúdo de atualizações de outros PCs ou de o enviar para eles. O Windows Update continua a transferir conteúdo da Microsoft; isto não desativa o serviço de Otimização da Entrega nem o Windows Update.",
    },
    prevent_auto_restart_while_logged_on: {
      name: "Impedir reinícios agendados do Windows Update com uma sessão iniciada",
      description:
        "Impede o Windows Update de reiniciar automaticamente o PC por causa de uma atualização agendada enquanto alguém tiver sessão iniciada. As atualizações podem continuar a ser transferidas e instaladas; isto não impede um reinício iniciado por si. Uma atualização de segurança que exige reinício só fica plenamente ativa depois de reiniciar, por isso manter a sessão aberta pode atrasar a proteção. Mantenha o Windows Update ativo e reinicie o PC assim que possível.",
    },
    defer_quality_updates_7_days: {
      name: "Adiar atualizações de qualidade por 7 dias",
      description:
        "Adia por 7 dias após a publicação as atualizações de qualidade do Windows, incluindo as correções de segurança mensais. O Windows Update continua ativo: é um adiamento curto, não uma pausa nem um bloqueio. As correções de segurança não são aplicadas durante a espera; instale prontamente as atualizações urgentes e reinicie quando o Windows o solicitar. Restaurar esta definição remove o adiamento.",
    },
    defer_feature_updates_30_days: {
      name: "Adiar atualizações de funcionalidades por 30 dias",
      description:
        "Adia por 30 dias após a publicação a oferta de atualizações de funcionalidades do Windows. As atualizações mensais de qualidade e segurança continuam no calendário normal. Não fixa uma versão nem prolonga o suporte da versão atual do Windows; restaurar esta definição remove o adiamento.",
    },
    exclude_windows_update_drivers: {
      name: "Excluir controladores autónomos do Windows Update",
      description:
        "Indica ao Windows Update para excluir atualizações autónomas de controladores do ciclo normal de atualizações de qualidade. O Windows Update e as atualizações de qualidade e segurança continuam ativos. Os controladores incluídos em atualizações de segurança ou críticas, e os instalados dinamicamente durante atualizações de funcionalidades, podem continuar a chegar. As ferramentas dos fabricantes e as instalações manuais não são bloqueadas. Terá de gerir os controladores autónomos por sua conta; enquanto esta definição estiver ativa, o catálogo de controladores do Windows Update poderá apresentar menos ofertas ou nenhumas. Restaurar esta definição permite novamente as ofertas de controladores do Windows Update.",
    },
    disable_copilot: {
      name: "Política antiga do Copilot (apenas restauro)",
      description:
        "Esta política descontinuada não controla a aplicação Copilot atual. Aqui pode restaurar o valor do registo guardado. A aplicação Copilot separada gere-se no Debloat; a remoção não impede reinstalações futuras.",
    },
    keyboard_delay_zero: {
      name: "Valor KeyboardDelay antigo (apenas restauro)",
      description:
        "As versões anteriores escreviam KeyboardDelay na chave de definições do rato, e não na do teclado. Esta entrada serve apenas para restaurar essa cópia de segurança; para a repetição do teclado, utilize «Reduzir o atraso de entrada (teclado)».",
    },
    keyboard_speed_fast: {
      name: "Valor KeyboardSpeed antigo (apenas restauro)",
      description:
        "As versões anteriores escreviam KeyboardSpeed na chave de definições do rato, e não na do teclado. Esta entrada serve apenas para restaurar essa cópia de segurança; para a repetição do teclado, utilize «Reduzir o atraso de entrada (teclado)».",
    },
    disable_suggested_apps: {
      name: "Impedir o Windows de instalar aplicações sozinho",
      description:
        "O Windows instala silenciosamente aplicações e jogos 'sugeridos' no seu menu Iniciar sem perguntar, numa instalação nova e de novo após grandes atualizações. Isto desativa-o, para que nada chegue à sua máquina sem ser escolhido por si.",
    },
    disable_mouse_acceleration: {
      name: "Desativar a aceleração do rato",
      description:
        "Desativa 'Melhorar a precisão do ponteiro', que faz o cursor percorrer mais distância quando move o rato mais depressa. Essa resposta variável é exatamente o que não quer ao apontar: o mesmo movimento físico deve cobrir sempre a mesma distância no ecrã.",
    },
    disable_sticky_keys_prompt: {
      name: "Parar a janela das Teclas Fixas",
      description:
        "Premir Shift cinco vezes abre normalmente a janela das Teclas Fixas — o que num jogo significa sair do ecrã inteiro no pior momento possível, normalmente a meio de uma luta. Isto desativa o atalho e o respetivo aviso; as Teclas Fixas continuam disponíveis nas Definições.",
    },
    disable_recall: {
      name: "Desativar o Recall (capturas de ecrã por IA)",
      description:
        "O Recall tira uma captura de ecrã da sua área de trabalho a cada poucos segundos e constrói um histórico pesquisável, indexado por IA, de tudo o que já viu — palavras-passe e mensagens privadas incluídas, já que captura o que estiver no ecrã. Isto define a política de sistema que o impede de analisar ou guardar o que quer que seja.",
    },
    global_timer_resolution: {
      name: "Resolução do temporizador global",
      description:
        "Define o valor de registo GlobalTimerResolutionRequests como 1. Esta operação não solicita nem verifica uma resolução específica do temporizador. O comportamento depende da versão do Windows; não há garantia de menor latência ou mais FPS. Requer reinício.",
    },
    disable_core_parking: {
      name: "Desativar o estacionamento de núcleos",
      description:
        "Impede o Windows de estacionar núcleos inativos com o computador ligado à corrente, para que um núcleo não tenha de ser acordado antes de servir a entrada ou um pico de trabalho repentino. Aplicado apenas ao perfil ligado à corrente: com bateria, estacionar é exatamente para isso que serve. O valor anterior do plano é registado e restaurado tal e qual (requer direitos de administrador).",
    },
    disable_memory_integrity: {
      name: "Desativar Integridade de Memória (VBS)",
      description:
        "Solicita a desativação da Integridade de Memória (HVCI). Se aplicada, remove uma camada de proteção do kernel; outras funções VBS podem continuar ativas. O efeito no desempenho depende do hardware e da carga de trabalho. Políticas do sistema ou um bloqueio UEFI podem impedir a alteração. Reinicie e verifique o estado na Segurança do Windows.",
    },
    disable_typing_personalization: {
      name: "Impedir o Windows de aprender como escreve",
      description:
        "O Windows constrói um dicionário pessoal a partir do que escreve no teclado e à mão — incluindo em gestores de palavras-passe, janelas de chat e caixas de pesquisa — e sincroniza-o com a sua conta Microsoft para melhorar as sugestões. Isto desativa tanto a recolha de texto como a de escrita à mão.",
    },
    classic_context_menu: {
      name: "Restaurar o menu de clique direito completo",
      description:
        "O Windows 11 esconde a maior parte do menu de clique direito atrás de 'Mostrar mais opções', transformando um clique em dois para coisas que faz o dia todo. Isto restaura o menu completo do Windows 10 em todo o Explorador de Ficheiros e na área de trabalho. O Explorador reinicia para aplicar, por isso as janelas abertas vão piscar uma vez.",
    },
    disable_transparency: {
      name: "Desativar efeitos de transparência",
      description:
        "Desativa os efeitos de desfocagem/acrílico na barra de tarefas e nos menus. Uma poupança de GPU pequena mas real, e torna mais fluidas as máquinas mais antigas ou com gráficos integrados.",
    },
    dark_mode: {
      name: "Modo escuro",
      description: "Ativa o tema escuro para as aplicações e o sistema.",
    },
    show_hidden_files: {
      name: "Mostrar ficheiros ocultos",
      description: "Mostra ficheiros e pastas ocultos no Explorador de Ficheiros.",
    },
    priority_separation: {
      name: "Otimizar a prioridade da CPU",
      description:
        "Ajusta o Win32PrioritySeparation (0x26) para que a aplicação em primeiro plano receba fatias de tempo de CPU curtas e variáveis com um aumento de prioridade de 3x — o valor clássico de capacidade de resposta para computadores de secretária e jogos.",
    },
    disable_game_dvr: {
      name: "Desativar Xbox Game Bar / Game DVR",
      description:
        "Desativa a gravação em segundo plano da Xbox Game Bar, que consome CPU/GPU durante os jogos.",
    },
    disable_telemetry_tasks: {
      name: "Reduzir a recolha de dados de diagnóstico",
      description:
        "Define a política de dados de diagnóstico do Windows no nível mais baixo. O Home e o Pro aplicam-na como dados de diagnóstico obrigatórios; só o Enterprise e o Education os desativam por completo.",
    },
    reset_advertising_id: {
      name: "Desativar o ID de publicidade",
      description: "Impede que as aplicações usem o seu ID de publicidade para criar perfis.",
    },
    disable_location_tracking: {
      name: "Desativar o rastreio de localização",
      description:
        "Bloqueia o acesso à localização para todas as aplicações através de política de sistema.",
    },
    disable_bing_search: {
      name: "Desativar a pesquisa do Bing no menu Iniciar",
      description: "Impede que as suas pesquisas no menu Iniciar sejam enviadas para o Bing.",
    },
    power_plan_performance: {
      name: "Alto desempenho (plano de energia)",
      description:
        'Muda para o plano de energia "Alto desempenho" do Windows. Útil em computadores de secretária ou quando ligado à tomada; restaura o plano anterior ao reverter.',
    },
    turbo_gaming: {
      name: "Turbo Gaming",
      description:
        "Predefinição: desativa o Game DVR, muda o plano de energia para Alto desempenho e otimiza a prioridade da CPU (requer privilégios de administrador).",
    },
    privacy_dns: {
      name: "DNS privado (Cloudflare)",
      description:
        "Muda para servidores DNS focados na privacidade (1.1.1.1), impedindo que o seu fornecedor de Internet registe as suas consultas DNS. Não oculta o seu endereço IP (isso precisa de uma VPN, veja abaixo).",
    },
    hardware_gpu_scheduling: {
      name: "Agendamento de GPU acelerado por hardware",
      description:
        "Solicita o agendamento de GPU acelerado por hardware (HAGS). Requer GPU, controlador e versão do Windows compatíveis. O desempenho e a latência podem melhorar, piorar ou manter-se iguais conforme o jogo. Reinicie e verifique a disponibilidade nas definições de gráficos do Windows.",
    },
    reduce_input_lag: {
      name: "Reduzir a latência de entrada (rato)",
      description:
        'Desativa a aceleração do ponteiro ("Melhorar a precisão do ponteiro") para um movimento do rato 1:1, sem atraso adicionado pelo sistema.',
    },
    turbo_boost: {
      name: "CPU Turbo Boost",
      description:
        "Define o modo boost como Agressivo com alimentação elétrica e bateria, e o estado mínimo do processador para 100% com alimentação elétrica no plano de energia atual. O consumo e o calor podem aumentar. Mantêm-se os limites do processador, firmware e temperatura; não há garantia de mais FPS (requer privilégios de administrador).",
    },
    network_throttling_index: {
      name: "Desativar a limitação de rede multimédia",
      description:
        "Remove o limite que o Windows impõe ao tráfego de rede enquanto aplicações multimédia/jogos estão ativos, útil para reduzir micropausas online.",
    },
    system_responsiveness: {
      name: "Definir a reserva de CPU em segundo plano do MMCSS",
      description:
        "Grava SystemResponsiveness=0, que o Windows trata como 20%. Isto não elimina a parcela de CPU para tarefas de menor prioridade nem dá prioridade a todas as aplicações em primeiro plano.",
    },
    games_task_priority: {
      name: "Definir a categoria MMCSS Games",
      description:
        "Define a categoria Games como High para threads registadas no MMCSS; High trata Priority como 2. Os valores GPU Priority e SFIO Priority também gravados não são usados. Isto não dá prioridade a todos os processos de jogo.",
    },
    reduce_keyboard_delay: {
      name: "Reduzir o atraso de entrada (teclado)",
      description:
        "Põe a zero o atraso antes de uma tecla premida começar a repetir-se e maximiza a sua taxa de repetição, para uma resposta mais ágil nos jogos.",
    },
    keep_kernel_in_ram: {
      name: "Manter o kernel e os drivers na RAM",
      description:
        "O Windows pode enviar partes do kernel e do código dos drivers para o disco mesmo com memória de sobra, e recarregá-las é uma pausa que se sente como uma quebra. Isto mantém-nas residentes. Vale a pena em máquinas com RAM de sobra; num PC com pouca memória, deixe desativado.",
    },
    auto_end_frozen_tasks: {
      name: "Não deixar uma aplicação bloqueada impedir o encerramento",
      description:
        'Quando uma aplicação deixa de responder durante o encerramento, o Windows espera e mostra o ecrã "Esta aplicação está a impedir o encerramento" até alguém clicar. Isto fecha automaticamente as aplicações que não respondem, para que um programa bloqueado não deixe a máquina ligada. Aviso: fechar aplicações automaticamente pode causar a perda de trabalho não guardado. Repor esta definição não recupera esse trabalho.',
    },
    instant_folder_loading: {
      name: "Abrir todas as pastas instantaneamente",
      description:
        "O Explorador examina o conteúdo de uma pasta para adivinhar se é Imagens, Música ou Documentos, e uma pasta com milhares de ficheiros multimédia pode bloquear durante segundos enquanto decide. Isto fixa todas as pastas no esquema geral, para que abram de imediato.",
    },
    tcp_congestion_bbr: {
      name: "Manter a latência baixa quando a ligação está ocupada (BBR2)",
      description:
        "O Windows usa CUBIC, que acelera até algum buffer transbordar algures - por isso o seu ping sobe no momento em que outra pessoa em casa começa uma transferência. O BBR2 mede a largura de banda real e o tempo de ida e volta da ligação e ajusta o ritmo do tráfego a isso, por isso o tubo enche sem a fila encher. A Microsoft inclui o BBR2 no Windows 11; isto muda o modelo Internet para ele, e volta exatamente ao que havia antes (requer privilégios de administrador).",
    },
    taskbar_align_left: {
      name: "Alinhar a barra de tarefas à esquerda",
      description:
        "Move os ícones da barra de tarefas de volta para a esquerda (estilo Windows 10) em vez de centrados.",
    },
    hide_taskbar_chat: {
      name: "Ocultar Chat/Teams da barra de tarefas",
      description: "Remove o ícone do Chat (Microsoft Teams) da barra de tarefas.",
    },
    disable_start_suggestions: {
      name: "Desativar sugestões e aplicações recomendadas no menu Iniciar",
      description:
        "Impede que o Windows mostre aplicações recomendadas, anúncios e sugestões no menu Iniciar.",
    },
    disable_activity_history: {
      name: "Desativar o histórico de atividades (Linha Cronológica do Windows)",
      description:
        "Impede que o Windows registe, guarde e envie à Microsoft o seu histórico de utilização de aplicações e documentos, através de política de sistema.",
    },
    hide_taskbar_search: {
      name: "Ocultar a caixa de pesquisa da barra de tarefas",
      description:
        "Remove a caixa/ícone de pesquisa da barra de tarefas para uma barra mais limpa (a pesquisa continua disponível através da tecla Windows).",
    },
    disable_fullscreen_optimizations_global: {
      name: "Desativar as otimizações de ecrã inteiro globalmente",
      description:
        "Força o DXGI a respeitar o verdadeiro ecrã inteiro exclusivo em vez do modo simulado do Windows, reduzindo micropausas e latência de entrada em muitos jogos mais antigos.",
    },
    disable_windows_search_service: {
      name: "Desativar o serviço de indexação (Windows Search)",
      description:
        "Para e desativa o serviço de indexação de ficheiros do Windows, reduzindo a atividade do disco em segundo plano — útil em SSDs pequenos ou durante jogos. A pesquisa de ficheiros no menu Iniciar fica mais lenta até o voltar a ativar (requer privilégios de administrador).",
    },
    disable_dmwappush_service: {
      name: "Iniciar o serviço de inserção apenas quando necessário",
      description:
        "Para o serviço de encaminhamento de inserções WAP e define-o como Manual, para que deixe de iniciar com o Windows mas ainda possa ser iniciado quando solicitado.",
    },
    disable_diagtrack_service: {
      name: "Desativar o serviço de telemetria (experiências ligadas)",
      description:
        "Para e desativa o serviço de experiências de utilizador ligadas e telemetria, que envia dados de utilização e diagnóstico à Microsoft. O Windows Update e os relatórios de erros continuam a funcionar.",
    },
    enable_regback: {
      name: "Ativar cópia de segurança automática do Registo (RegBack)",
      description:
        "Reativa as cópias de segurança periódicas automáticas das hives do Registo do Windows em %SystemRoot%\\System32\\config\\RegBack para recuperação de emergência.",
    },
    explorer_anti_hang: {
      name: "Evitar bloqueios do Explorador em atalhos",
      description:
        "Desativa a resolução de caminhos e a pesquisa na rede ao abrir atalhos, evitando que o Explorador de Ficheiros bloqueie com unidades desligadas ou partilhas de rede.",
    },
    no_internet_open_with: {
      name: "Ignorar pesquisa na Microsoft Store para ficheiros desconhecidos",
      description:
        "Abre imediatamente a janela local «Abrir com» em vez de sugerir uma pesquisa na Microsoft Store ao clicar duas vezes em tipos de ficheiro não reconhecidos.",
    },
    detailed_bsod: {
      name: "Mostrar parâmetros detalhados em ecrãs azuis BSOD",
      description:
        "Apresenta os códigos de paragem hexadecimais exatos, controladores com falha e endereços de memória em ecrãs azuis em vez de os ocultar num código QR genérico.",
    },
    disable_wpbt: {
      name: "Bloquear execução de software UEFI WPBT",
      description:
        "Impede que o firmware UEFI da placa principal instale automaticamente binários OEM indesejados no Windows através da tabela WPBT.",
    },
    disable_ndu: {
      name: "Desativar fuga de memória não paginada do NDU",
      description:
        "Desativa o serviço do controlador Network Diagnostic Usage, prevenindo a acumulação de memória não paginada durante transferências de rede intensas.",
    },
    disable_search_highlights: {
      name: "Desativar destaques e ilustrações de pesquisa",
      description:
        "Remove ilustrações web, doodles diários do Bing e tópicos de tendências da barra de pesquisa do Windows e da barra de tarefas.",
    },
    auto_complete_run: {
      name: "Ativar conclusão automática na caixa Executar",
      description:
        "Ativa a conclusão automática instantânea de comandos e sugestões na caixa de diálogo Executar do Windows (Win + R).",
    },
    disable_aero_shake: {
      name: "Desativar minimização ao abanar (Aero Shake)",
      description:
        "Evita que abanar a barra de título de uma janela minimize acidentalmente todas as outras janelas abertas em segundo plano.",
    },
    disable_remote_assistance: {
      name: "Desativar convites de Assistência Remota",
      description:
        "Desativa ligações e convites de Assistência Remota do Windows para proteger o computador de pedidos de suporte não solicitados.",
    },
    disable_llmnr: {
      name: "Desativar protocolo LLMNR",
      description:
        "Desativa a Resolução de Nomes Multicast Local (LLMNR) para proteger contra ataques de spoofing e interceção de credenciais na rede local.",
    },
    disable_wifi_sense: {
      name: "Desativar partilha de pontos de acesso Wi-Fi Sense",
      description:
        "Impede que o Windows se ligue automaticamente a redes Wi-Fi abertas e partilhe credenciais com os seus contactos.",
    },
    disable_cloud_search: {
      name: "Desativar pesquisa na nuvem no Windows",
      description:
        "Impede a pesquisa do Windows de consultar o histórico na nuvem e registos da conta Microsoft ao procurar ficheiros locais.",
    },
    disable_app_suggestions_start: {
      name: "Desativar sugestões e dicas no menu Iniciar",
      description:
        "Desativa sugestões promocionais de aplicações e sugestões de funcionalidades no menu Iniciar do Windows.",
    },
    disable_handwriting_sharing: {
      name: "Desativar partilha de relatórios de escrita manual",
      description:
        "Impede o Windows de transmitir registos de erros de reconhecimento de escrita manual e amostras de traços para a Microsoft.",
    },
    disable_ceip: {
      name: "Desativar Programa de Melhoria da Experiência do Cliente (CEIP)",
      description:
        "Desativa o cliente de telemetria SQM para o Programa de Melhoria da Experiência do Cliente (CEIP) do Windows.",
    },
    disable_lockscreen_camera: {
      name: "Desativar câmara no ecrã de bloqueio",
      description:
        "Desativa o botão e gesto da câmara no ecrã de bloqueio para impedir a captura de fotos sem desbloquear o dispositivo.",
    },
    disable_cortana_consent: {
      name: "Desativar consentimento de pesquisa da Cortana",
      description:
        "Revoga o consentimento da Cortana para evitar que consultas de pesquisa e dados de voz sejam partilhados com os serviços na nuvem da Microsoft.",
    },
    disable_wer_queuing: {
      name: "Desativar fila de relatórios de erros do Windows",
      description:
        "Impede o Relatório de Erros do Windows de guardar e colocar em fila relatórios de falhas no disco para envio posterior.",
    },
    disable_experimentation: {
      name: "Desativar telemetria de experimentação do Windows",
      description:
        "Desativa testes A/B e funcionalidades de experimentação da Microsoft no Windows, mantendo o comportamento do sistema consistente e previsível.",
    },
    disable_app_inventory_collection: {
      name: "Desativar inventário de compatibilidade de aplicações",
      description:
        "Desativa o recoletor de inventário de compatibilidade que analisa o software instalado e o reporta à Microsoft.",
    },
    disable_problem_steps_recorder: {
      name: "Desativar telemetria do Gravador de Passos",
      description:
        "Desativa a captura de erros e o envio de dados de diagnóstico pelo Gravador de Passos de Problemas (PSR).",
    },
    disable_ait_telemetry: {
      name: "Desativar telemetria de impacto de aplicações (AIT)",
      description:
        "Desativa a recolha de dados de Application Impact Telemetry (AIT) durante o arranque de programas.",
    },
    disable_smartscreen_app_install: {
      name: "Desativar telemetria de instalação do SmartScreen",
      description:
        "Desativa o envio de telemetria de instalação e consultas de verificação de URL do SmartScreen.",
    },
    disable_online_speech_privacy: {
      name: "Desativar recolha de dados de reconhecimento de voz online",
      description:
        "Desativa a recolha de dados de voz na nuvem para ditado por voz e modelos de fala.",
    },
    disable_edge_shopping: {
      name: "Desativar assistente de compras do Edge",
      description:
        "Desativa o assistente de compras e o rastreio de cupões promocionais no Microsoft Edge.",
    },
    disable_edge_metrics: {
      name: "Desativar relatórios de métricas de diagnóstico do Edge",
      description:
        "Desativa o envio de métricas de utilização e relatórios de falha do Microsoft Edge.",
    },
    disable_edge_startup_boost: {
      name: "Desativar Arranque Rápido do Edge",
      description:
        "Desativa o arranque rápido do Microsoft Edge, evitando processos em segundo plano ao iniciar o Windows.",
    },
    disable_edge_background_mode: {
      name: "Desativar modo em segundo plano do Edge",
      description:
        "Impede o Microsoft Edge de continuar a correr em segundo plano quando é fechado, libertando memória.",
    },
    disable_bluetooth_le_discovery: {
      name: "Desativar pesquisa de Bluetooth LE em segundo plano",
      description:
        "Desativa a procura contínua em segundo plano de dispositivos Bluetooth Low Energy para poupar processador e energia.",
    },
    disable_edge_wallet: {
      name: "Desativar sugestões de carteira do Edge",
      description:
        "Impede o Microsoft Edge de consultar automaticamente serviços de pagamento e carteira.",
    },
    disable_cortana_above_lock: {
      name: "Desativar Cortana acima do ecrã de bloqueio",
      description:
        "Impede que assistentes de voz e a pesquisa escutem ou sejam ativados com o ecrã bloqueado.",
    },
    disable_device_history: {
      name: "Desativar histórico de atividade do dispositivo",
      description:
        "Impede o Windows de registar e acompanhar o histórico de aplicações e ficheiros neste dispositivo.",
    },
    disable_search_history: {
      name: "Desativar histórico de pesquisa da barra de tarefas",
      description:
        "Desativa o registo de pesquisas anteriores na barra de tarefas e no menu Iniciar.",
    },
    disable_news_and_interests: {
      name: "Desativar Notícias e Interesses da barra de tarefas",
      description:
        "Oculta o widget de meteorologia e notícias na barra de tarefas do Windows, poupando rede e memória em segundo plano.",
    },
    disable_auto_maintenance_wake: {
      name: "Desativar reativação para manutenção automática",
      description:
        "Impede a manutenção automática do Windows de reativar o computador ou gastar a bateria do portátil durante a noite.",
    },
    disable_diagnostic_data_viewer: {
      name: "Desativar armazenamento local de dados de diagnóstico",
      description:
        "Impede a telemetria de diagnóstico do Windows de reservar e gravar bases de dados de cache locais no disco.",
    },
    disable_activity_feed: {
      name: "Desativar feed de atividades e linha cronológica",
      description:
        "Impede o Windows de gerar gráficos de linha cronológica e rastrear atividades do utilizador entre dispositivos.",
    },
    disable_publish_user_activities: {
      name: "Desativar publicação de atividades do utilizador na nuvem",
      description:
        "Impede o Windows de sincronizar o histórico de atividades com os serviços na nuvem da Microsoft.",
    },
    disable_typing_insights: {
      name: "Desativar telemetria de informações de escrita",
      description:
        "Impede o Windows de analisar os seus padrões de escrita e estatísticas de preenchimento automático.",
    },
    disable_inking_typing_personalization: {
      name: "Desativar personalização de escrita manual e digitação",
      description:
        "Impede o Windows de enviar dados do dicionário local de escrita e digitação para a Microsoft.",
    },
    disable_shared_experiences: {
      name: "Desativar partilha entre dispositivos ligados",
      description:
        "Desativa a sincronização em segundo plano da plataforma Connected Devices Platform (CDP).",
    },
    disable_remote_desktop: {
      name: "Desativar ligações de Ambiente de Trabalho Remoto recebidas",
      description:
        "Bloqueia ligações RDP de ambiente de trabalho remoto para reduzir a superfície de ataque na rede.",
    },
    disable_edge_collections: {
      name: "Desativar Coleções do Microsoft Edge",
      description:
        "Desativa as Coleções do Edge e a sincronização em segundo plano para poupar recursos.",
    },
    disable_edge_quick_search: {
      name: "Desativar barra de pesquisa do Edge no ambiente de trabalho",
      description:
        "Impede o Microsoft Edge de apresentar barras de pesquisa flutuantes no ambiente de trabalho.",
    },
    disable_edge_personalization: {
      name: "Desativar personalização e telemetria do Edge",
      description:
        "Desativa o envio do histórico de navegação e perfis de publicidade no Microsoft Edge.",
    },
    disable_lockscreen_spotlight: {
      name: "Desativar Destaques do Windows no ecrã de bloqueio",
      description:
        "Impede a transferência de imagens promocionais e sugestões no ecrã de bloqueio.",
    },
    disable_push_install_service: {
      name: "Desativar serviço de instalação remota PushToInstall",
      description:
        "Impede a Microsoft Store de instalar aplicações neste PC remotamente a partir da Web.",
    },
    disable_compatibility_assistant: {
      name: "Desativar Assistente de Compatibilidade de Programas",
      description:
        "Desativa os avisos e verificações em segundo plano do Assistente de Compatibilidade de Programas.",
    },
    disable_cortana_cloud_search: {
      name: "Desativar indexador na nuvem do Windows Search",
      description:
        "Impede o Windows Search de consultar índices na nuvem e servidores Bing ao pesquisar ficheiros locais.",
    },
    disable_find_my_device: {
      name: "Desativar localização de Localizar o Meu Dispositivo",
      description:
        "Desativa a transmissão contínua de localização GPS e Wi-Fi para o serviço Localizar o Meu Dispositivo.",
    },
    disable_sensors_data_collection: {
      name: "Desativar recolha de dados de sensores de hardware",
      description:
        "Desativa a monitorização em segundo plano dos sensores (luz ambiente, acelerómetro) e localização.",
    },
    disable_location_scripting: {
      name: "Desativar acesso à localização por scripts",
      description:
        "Impede que scripts em segundo plano e motores de navegação consultem a localização física do dispositivo.",
    },
    disable_advertising_info: {
      name: "Desativar política de informações de publicidade",
      description:
        "Aplica um bloqueio de política de grupo desativando o rastreio do ID de publicidade para todos os utilizadores.",
    },
    disable_sync_settings: {
      name: "Desativar sincronização de definições na nuvem",
      description:
        "Impede o Windows de sincronizar personalização, palavras-passe e preferências de sistema com servidores Microsoft.",
    },
    disable_app_diagnostics_access: {
      name: "Desativar acesso de aplicações a informações de diagnóstico",
      description:
        "Bloqueia a leitura de informações de diagnóstico e telemetria do sistema por aplicações da Store.",
    },
    svchost_split_threshold: {
      name: "Consolidar processos anfitriões de serviços",
      description:
        "Agrupa serviços em segundo plano em processos partilhados para reduzir o número de processos inativos e a sobrecarga de memória.",
    },
    disable_8dot3_names: {
      name: "Desativar nomes curtos NTFS 8.3",
      description:
        "Interrompe a criação de nomes curtos DOS 8.3 em unidades NTFS para acelerar a localização e operações de ficheiros.",
    },
    disable_ntfs_last_access: {
      name: "Desativar carimbos de data do último acesso NTFS",
      description:
        "Elimina gravações desnecessárias no disco ao deixar de registar a data de último acesso ao abrir ou ler ficheiros.",
    },
    disable_autologger_diagtrack: {
      name: "Desativar sessão de autologger DiagTrack",
      description:
        "Interrompe o registo circular contínuo em disco para a sessão ETW de telemetria e diagnóstico do DiagTrack.",
    },
    disable_autologger_sqm: {
      name: "Desativar sessão de autologger SQM",
      description:
        "Interrompe o registo em disco em segundo plano para o serviço de telemetria Software Quality Metrics (SQM).",
    },
    disable_autologger_ait: {
      name: "Desativar sessão de autologger de eventos AIT",
      description:
        "Interrompe o registo de eventos ETW para o serviço Application Inventory and Telemetry (AIT).",
    },
    disable_autologger_diaglog: {
      name: "Desativar sessão de autologger de diagnóstico",
      description:
        "Interrompe o registo circular em disco para as sessões de diagnóstico e rastreio de erros do Windows.",
    },
    disable_autologger_wifisession: {
      name: "Desativar sessão de autologger de diagnóstico Wi-Fi",
      description:
        "Interrompe o registo contínuo de telemetria de diagnóstico para os estados de ligação Wi-Fi.",
    },
    disable_wersvc_service: {
      name: "Iniciar o Relatório de Erros do Windows apenas quando necessário",
      description:
        "Para o serviço de Relatório de Erros do Windows (WerSvc) e define-o como Manual para reduzir a atividade em segundo plano.",
    },
    disable_mapsbroker_service: {
      name: "Desativar o serviço Gestor de Mapas Descarregados",
      description:
        "Para e desativa o serviço Gestor de Mapas Descarregados (MapsBroker), impedindo verificações de rede em segundo plano.",
    },
    disable_lfsvc_service: {
      name: "Iniciar o serviço de geolocalização apenas quando necessário",
      description:
        "Para o serviço de geolocalização do Windows (lfsvc) e define-o como Manual, evitando a consulta contínua da localização.",
    },
    ads_in_settings: {
      name: "Ocultar conteúdo promocional nas Definições",
      description:
        "Define como 0 o valor por utilizador SubscribedContent-338393Enabled. Não altera as outras áreas de sugestões do Windows.",
    },
    quick_access_no_cloud: {
      name: "Ocultar ficheiros da nuvem no Acesso rápido",
      description:
        "Define ShowCloudFilesInQuickAccess como 0. Os itens Recentes e Frequentes usam definições separadas e não são alterados.",
    },
    hide_gallery_explorer: {
      name: "Ocultar Galeria no Explorador de Ficheiros",
      description:
        "Define como 1 o valor por utilizador HideGallery. Oculta a entrada Galeria no painel de navegação; não elimina nem move fotografias.",
    },
    snap_assist_off: {
      name: "Limitar sugestões do Snap Assist",
      description:
        "Desativa a definição de sugestões do Snap Assist. Não altera a definição separada do painel Snap Layouts, pelo que algumas sugestões de encaixe podem continuar a aparecer.",
    },
    alt_tab_no_browser_tabs: {
      name: "Mostrar janelas, não separadores do Edge, no Alt+Tab",
      description:
        "Impede que os separadores do Microsoft Edge apareçam como entradas separadas no Alt+Tab. Os separadores continuam abertos; só muda o seletor de janelas.",
    },
    taskbar_button_combining: {
      name: "Agrupar botões da barra de tarefas",
      description:
        "Define TaskbarGlomLevel como 0 e agrupa as janelas da mesma aplicação num único botão. As janelas individuais poderão ficar menos visíveis.",
    },
    no_toasts_fullscreen_video: {
      name: "Desativar notificações pop-up",
      description:
        "Define NOC_GLOBAL_SETTING_TOASTS_ENABLED como 0. As notificações poderão também ser ocultadas fora da reprodução em ecrã inteiro.",
    },
    no_window_snap_drag: {
      name: "Desativar o encaixe ao arrastar janelas",
      description:
        "Define WindowArrangementActive como 0 para desativar os esquemas de encaixe acionados ao arrastar uma janela. Outros atalhos de gestão de janelas poderão continuar a funcionar.",
    },
    ui_classic_context_menu: {
      name: "Mostrar o menu clássico do botão direito",
      description:
        "Cria uma substituição do Explorador por utilizador para mostrar o menu de contexto clássico em vez do menu compacto do Windows 11. Poderá ser necessário reiniciar o Explorador ou terminar sessão.",
    },
  },
  cleanup: {
    temp_cleanup: {
      name: "Limpar ficheiros temporários",
      description:
        "Move o conteúdo de %TEMP% para a Reciclagem: pode recuperá-lo a qualquer momento, não é uma eliminação permanente.",
    },
    winupdate_cache_cleanup: {
      name: "Limpar a cache do Windows Update",
      description:
        "Move os pacotes do Windows Update já instalados para a Reciclagem (requer privilégios de administrador).",
    },
  },
};
