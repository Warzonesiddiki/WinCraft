import type { Lang } from "../i18n";
const en = {
  heading: "Start with your day",
  intro: "Choose a setup, adjust the selection, then apply it in one click.",
  gaming: "Gaming",
  study: "Audio & Focus (Study)",
  work: "Developer & Work",
  laptop: "Laptop",
  quiet: "No interruptions",
  streaming: "Streaming",
  barebone: "Barebone",
  browser_only: "Browser Only",
  office: "Browser + MS Office",
  laptopBody: "Fewer visual effects and no apps reopening on their own after sign-in.",
  quietBody: "No feedback surveys, suggested apps or Sticky Keys pop-ups.",
  streamingBody: "Game DVR recording off and fewer Windows pop-ups that could appear on stream.",
  bareboneBody:
    "Changes background-app, suggestion and appearance preferences; performance depends on your workload.",
  browser_onlyBody:
    "Fewer Windows suggestions and optional background-app changes for browser-focused use.",
  officeBody:
    "Workstation productivity: fast folder loading, visible file extensions, immediate menus, and zero telemetry prompts.",
  laptopNote:
    "Animations and transparency are turned off, so Windows looks plainer; the changes show after you sign out and back in. Whether this saves battery depends on the laptop and is not measured here; power settings are not changed.",
  quietNote:
    "This is about pop-ups, not fan noise: fan and power settings are not changed. Notifications from your own apps keep working.",
  streamingNote:
    "Game Bar background recording stops, so record with your streaming app. Windows feedback surveys and the Sticky Keys pop-up no longer appear over your game.",
  bareboneNote:
    "Turns off supported background-app preferences, animations, transparency, Bing search, suggestions and Game DVR. Background notifications or synchronization may be affected. Settings can be restored; this is not a replacement Windows installation.",
  browser_onlyNote:
    "Changes supported background-app, Start suggestion, Bing search and widget preferences. Notifications or synchronization may be affected; no RAM or speed gain is guaranteed.",
  officeNote:
    "Optimizes desktop and file navigation responsiveness while silencing feedback surveys and recommendations, leaving your office documents, email, and spreadsheets running smoothly.",
  gamingBody: "Consistent Windows pointer movement and control over Game DVR recording.",
  studyBody: "Fewer Windows suggestions, survey prompts and taskbar distractions.",
  workBody: "Visible file extensions, faster menu opening and no startup app delay.",
  gamingNote:
    "Game DVR capture is turned off. Mouse acceleration changes also affect the desktop; games using raw input may ignore them. The optional Sticky Keys setting disables its keyboard shortcut.",
  studyNote:
    "Widgets disappear from the taskbar. This does not mute messages or block websites. Some changes may need a sign-out to appear.",
  workNote:
    "Menus open without their usual delay. Startup apps may launch together after sign-in. File extensions become visible; hidden files are optional. The menu change shows after you sign out and back in.",
  apply: "Apply selected",
  applying: "Applying…",
  active: "Already applied",
  optional: "Optional",
  notice:
    "Adds your selected tweaks. Other settings stay as they are. Restore individual changes from their category or Change history. This is not an exclusive mode switch.",
  empty: "Select a change to apply.",
  ready: "All selected tweaks are already applied.",
  missing: "Some options are unavailable in this build.",
  free: "Included in Free",
  notHere: "Not available on this PC",
};
type Copy = typeof en;
export const STARTER_COPY: Record<Lang, Copy> = {
  en,
  it: {
    ...en,
    heading: "Parti da ciò che fai",
    intro: "Scegli un profilo, modifica la selezione e applicalo con un clic.",
    gaming: "Gaming",
    study: "Audio e Focus (Studio)",
    work: "Sviluppatore e Lavoro",
    laptop: "Portatile",
    quiet: "Senza interruzioni",
    streaming: "Streaming",
    barebone: "Barebone",
    browser_only: "Solo browser",
    office: "Browser + MS Office",
    laptopBody: "Meno effetti visivi e nessuna app che si riapre da sola dopo l’accesso.",
    quietBody: "Niente sondaggi di feedback, app suggerite o finestre dei Tasti permanenti.",
    streamingBody:
      "Registrazione Game DVR disattivata e meno finestre di Windows che possono comparire in diretta.",
    bareboneBody:
      "Modifica le preferenze per app in background, suggerimenti e aspetto; le prestazioni dipendono dal carico di lavoro.",
    browser_onlyBody:
      "Meno suggerimenti di Windows e modifiche facoltative alle app in background per chi usa soprattutto il browser.",
    officeBody:
      "Produttività da ufficio: cartelle immediate, estensioni visibili, menu reattivi e zero avvisi di telemetria.",
    laptopNote:
      "Animazioni e trasparenza vengono disattivate, quindi Windows appare più sobrio; le modifiche si vedono dopo essere usciti e rientrati nell’account. Se questo faccia risparmiare batteria dipende dal portatile e qui non viene misurato; le impostazioni di alimentazione non cambiano.",
    quietNote:
      "Riguarda le finestre a comparsa, non il rumore delle ventole: ventole e alimentazione non cambiano. Le notifiche delle tue app continuano a funzionare.",
    streamingNote:
      "La registrazione in background della Game Bar si ferma: per registrare usa la tua app di streaming. I sondaggi di Windows e la finestra dei Tasti permanenti non compaiono più sopra il gioco.",
    bareboneNote:
      "Disattiva le preferenze supportate per app in background, animazioni, trasparenza, ricerca Bing, suggerimenti e Game DVR. Notifiche o sincronizzazione possono risentirne. Le impostazioni si possono ripristinare; non è una nuova installazione di Windows.",
    browser_onlyNote:
      "Modifica le preferenze supportate per app in background, suggerimenti di Start, ricerca Bing e widget. Notifiche o sincronizzazione possono risentirne; non sono garantiti vantaggi di RAM o velocità.",
    officeNote:
      "Velocizza l'esplorazione dei file e i menu di sistema eliminando sondaggi e suggerimenti per lavorare al meglio su documenti, email e fogli di calcolo.",
    gamingBody: "Movimento del puntatore coerente e controllo della registrazione Game DVR.",
    studyBody:
      "Meno suggerimenti di Windows, sondaggi e distrazioni nella barra delle applicazioni.",
    workBody: "Estensioni visibili, menu immediati e nessuna attesa per le app all’avvio.",
    gamingNote:
      "Disattiva la registrazione Game DVR. L’accelerazione del mouse cambia anche sul desktop; i giochi con input diretto possono ignorarla. L’opzione Tasti permanenti disattiva la sua scorciatoia.",
    studyNote:
      "I widget scompaiono dalla barra. Non silenzia i messaggi e non blocca i siti. Alcune modifiche possono richiedere di uscire e rientrare nell’account Windows.",
    workNote:
      "I menu si aprono senza attesa. Le app possono avviarsi insieme dopo l’accesso. Le estensioni diventano visibili; i file nascosti sono facoltativi. La modifica ai menu si vede dopo essere usciti e rientrati nell’account.",
    apply: "Applica selezionati",
    applying: "Applicazione…",
    active: "Già applicato",
    optional: "Facoltativo",
    notice:
      "Aggiunge i tweak selezionati e conserva le altre impostazioni. Ripristina le singole modifiche dalla categoria o dalla cronologia. Non sostituisce integralmente il profilo precedente.",
    empty: "Seleziona una modifica da applicare.",
    ready: "Tutti i tweak selezionati sono già applicati.",
    missing: "Alcune opzioni non sono disponibili in questa versione.",
    free: "Incluso in Free",
    notHere: "Non disponibile su questo PC",
  },
  fr: {
    ...en,
    heading: "Un profil pour votre journée",
    intro: "Choisissez un profil, ajustez les options et appliquez-les en un clic.",
    gaming: "Jeu",
    study: "Audio et Focus (Études)",
    work: "Développeur et Travail",
    laptop: "Portable",
    quiet: "Sans interruptions",
    streaming: "Streaming",
    barebone: "Barebone",
    browser_only: "Navigateur uniquement",
    office: "Navigateur + MS Office",
    laptopBody:
      "Moins d’effets visuels et aucune application qui se rouvre seule après la connexion.",
    quietBody: "Plus de sondages, d’applications suggérées ni de fenêtre des touches rémanentes.",
    streamingBody:
      "Enregistrement Game DVR désactivé et moins de fenêtres Windows susceptibles d’apparaître en direct.",
    bareboneBody:
      "Modifie les préférences des applications en arrière-plan, suggestions et apparence ; les performances dépendent de votre activité.",
    browser_onlyBody:
      "Moins de suggestions Windows et des changements facultatifs des applications en arrière-plan pour un usage centré sur le navigateur.",
    officeBody:
      "Productivité bureautique : dossiers rapides, extensions visibles, menus immédiats et zéro notification de télémétrie.",
    laptopNote:
      "Les animations et la transparence sont désactivées : Windows paraît plus sobre ; les changements apparaissent après une déconnexion puis une reconnexion. Une éventuelle économie de batterie dépend du portable et n’est pas mesurée ici ; les réglages d’alimentation ne changent pas.",
    quietNote:
      "Il s’agit des fenêtres surgissantes, pas du bruit des ventilateurs : ventilateurs et alimentation ne changent pas. Les notifications de vos applications continuent de fonctionner.",
    streamingNote:
      "L’enregistrement en arrière-plan de la Game Bar s’arrête : enregistrez avec votre logiciel de streaming. Les sondages Windows et la fenêtre des touches rémanentes n’apparaissent plus par-dessus le jeu.",
    bareboneNote:
      "Désactive les préférences prises en charge pour les applications en arrière-plan, animations, transparence, recherche Bing, suggestions et Game DVR. Les notifications ou la synchronisation peuvent être affectées. Les réglages sont restaurables ; cela ne remplace pas Windows.",
    browser_onlyNote:
      "Modifie les préférences prises en charge des applications en arrière-plan, suggestions de Démarrer, recherche Bing et widgets. Les notifications ou la synchronisation peuvent être affectées ; aucun gain de mémoire ou de vitesse n’est garanti.",
    officeNote:
      "Accélère la navigation dans les fichiers et les menus tout en supprimant les sondages pour un travail fluide sur vos documents, e-mails et feuilles de calcul.",
    gamingBody: "Un pointeur Windows constant et le contrôle de l’enregistrement Game DVR.",
    studyBody: "Moins de suggestions Windows, de sondages et de distractions.",
    workBody: "Extensions visibles, menus immédiats et applications sans délai au démarrage.",
    gamingNote:
      "Désactive Game DVR. La souris change aussi sur le bureau ; les jeux avec entrée brute peuvent ignorer ce réglage. L’option Touches rémanentes désactive son raccourci.",
    studyNote:
      "Masque les widgets de la barre. Ne coupe pas les messages et ne bloque pas les sites. Certaines modifications peuvent nécessiter une déconnexion.",
    workNote:
      "Les menus s’ouvrent sans délai. Les applications peuvent démarrer ensemble. Les extensions sont visibles ; les fichiers cachés sont facultatifs. Le changement des menus apparaît après une déconnexion puis une reconnexion.",
    apply: "Appliquer la sélection",
    applying: "Application…",
    active: "Déjà appliqué",
    optional: "Facultatif",
    notice:
      "Ajoute les réglages sélectionnés et conserve les autres. Restaurez-les depuis leur catégorie ou l’historique. Ce n’est pas un changement de mode exclusif.",
    empty: "Sélectionnez un réglage.",
    ready: "Tous les réglages sélectionnés sont appliqués.",
    missing: "Certaines options sont indisponibles dans cette version.",
    free: "Inclus dans Free",
    notHere: "Non disponible sur ce PC",
  },
  es: {
    ...en,
    heading: "Un perfil para tu día",
    intro: "Elige un perfil, ajusta las opciones y aplícalas con un clic.",
    gaming: "Gaming",
    study: "Audio y Concentración (Estudio)",
    work: "Desarrollador y Trabajo",
    laptop: "Portátil",
    quiet: "Sin interrupciones",
    streaming: "Streaming",
    barebone: "Barebone",
    browser_only: "Solo navegador",
    office: "Navegador + MS Office",
    laptopBody:
      "Menos efectos visuales y ninguna aplicación que se vuelva a abrir sola al iniciar sesión.",
    quietBody:
      "Sin encuestas de opinión, aplicaciones sugeridas ni la ventana de Teclas especiales.",
    streamingBody:
      "Grabación de Game DVR desactivada y menos ventanas de Windows que puedan aparecer en directo.",
    bareboneBody:
      "Cambia las preferencias de aplicaciones en segundo plano, sugerencias y apariencia; el rendimiento depende de tu actividad.",
    browser_onlyBody:
      "Menos sugerencias de Windows y cambios opcionales en aplicaciones en segundo plano para quienes usan principalmente el navegador.",
    officeBody:
      "Productividad de oficina: carpetas rápidas, extensiones visibles, menús inmediatos y cero avisos de telemetría.",
    laptopNote:
      "Se desactivan las animaciones y la transparencia, así que Windows se ve más sobrio; los cambios se ven después de cerrar sesión y volver a entrar. Si esto ahorra batería depende del portátil y aquí no se mide; la configuración de energía no cambia.",
    quietNote:
      "Se trata de ventanas emergentes, no del ruido de los ventiladores: los ventiladores y la energía no cambian. Las notificaciones de tus aplicaciones siguen funcionando.",
    streamingNote:
      "La grabación en segundo plano de la Game Bar se detiene: graba con tu aplicación de streaming. Las encuestas de Windows y la ventana de Teclas especiales ya no aparecen sobre el juego.",
    bareboneNote:
      "Desactiva las preferencias compatibles de aplicaciones en segundo plano, animaciones, transparencia, búsqueda de Bing, sugerencias y Game DVR. Puede afectar a las notificaciones o la sincronización. Los ajustes se pueden restaurar; no sustituye la instalación de Windows.",
    browser_onlyNote:
      "Cambia las preferencias compatibles de aplicaciones en segundo plano, sugerencias de Inicio, búsqueda de Bing y widgets. Puede afectar a las notificaciones o la sincronización; no se garantiza un ahorro de RAM ni mayor velocidad.",
    officeNote:
      "Acelera la navegación de archivos y menús eliminando encuestas para trabajar con fluidez en documentos, correos y hojas de cálculo.",
    gamingBody: "Movimiento constante del puntero y control de la grabación Game DVR.",
    studyBody: "Menos sugerencias de Windows, encuestas y distracciones.",
    workBody: "Extensiones visibles, menús inmediatos y aplicaciones sin demora al iniciar.",
    gamingNote:
      "Desactiva Game DVR. El ratón también cambia en el escritorio; los juegos con entrada directa pueden ignorarlo. La opción Teclas especiales desactiva su atajo.",
    studyNote:
      "Oculta los widgets de la barra. No silencia mensajes ni bloquea sitios. Algunos cambios pueden requerir cerrar sesión.",
    workNote:
      "Los menús se abren sin demora. Las aplicaciones pueden iniciarse juntas. Las extensiones quedan visibles; los archivos ocultos son opcionales. El cambio en los menús se ve después de cerrar sesión y volver a entrar.",
    apply: "Aplicar selección",
    applying: "Aplicando…",
    active: "Ya aplicado",
    optional: "Opcional",
    notice:
      "Añade los ajustes seleccionados y conserva los demás. Restáuralos desde su categoría o el historial. No sustituye todo el modo anterior.",
    empty: "Selecciona un cambio.",
    ready: "Todos los ajustes seleccionados están aplicados.",
    missing: "Algunas opciones no están disponibles en esta versión.",
    free: "Incluido en Free",
    notHere: "No disponible en este PC",
  },
  de: {
    ...en,
    heading: "Ein Profil für deinen Alltag",
    intro: "Profil wählen, Auswahl anpassen und mit einem Klick anwenden.",
    gaming: "Gaming",
    study: "Audio & Fokus (Lernen)",
    work: "Entwickler & Arbeit",
    laptop: "Laptop",
    quiet: "Ohne Unterbrechungen",
    streaming: "Streaming",
    barebone: "Barebone",
    browser_only: "Nur Browser",
    office: "Browser + MS Office",
    laptopBody:
      "Weniger visuelle Effekte und keine Apps, die sich nach der Anmeldung von selbst wieder öffnen.",
    quietBody: "Keine Feedback-Umfragen, vorgeschlagenen Apps oder Hinweise der Einrastfunktion.",
    streamingBody:
      "Game-DVR-Aufnahme aus und weniger Windows-Pop-ups, die im Stream erscheinen könnten.",
    bareboneBody:
      "Ändert Einstellungen für Hintergrund-Apps, Vorschläge und Darstellung; die Leistung hängt von der Nutzung ab.",
    browser_onlyBody:
      "Weniger Windows-Vorschläge und optionale Änderungen an Hintergrund-Apps für die überwiegende Browsernutzung.",
    officeBody:
      "Büro-Produktivität: Schnelles Laden von Ordnern, sichtbare Dateiendungen, direkte Menüs und keine Telemetrie-Hinweise.",
    laptopNote:
      "Animationen und Transparenz werden abgeschaltet, Windows wirkt dadurch schlichter; die Änderungen werden nach Ab- und erneuter Anmeldung sichtbar. Ob das Akku spart, hängt vom Laptop ab und wird hier nicht gemessen; Energieeinstellungen bleiben unverändert.",
    quietNote:
      "Es geht um Pop-ups, nicht um Lüftergeräusche: Lüfter- und Energieeinstellungen bleiben unverändert. Benachrichtigungen deiner Apps funktionieren weiter.",
    streamingNote:
      "Die Hintergrundaufnahme der Game Bar stoppt, nimm also mit deiner Streaming-App auf. Windows-Umfragen und der Hinweis der Einrastfunktion erscheinen nicht mehr über dem Spiel.",
    bareboneNote:
      "Deaktiviert unterstützte Einstellungen für Hintergrund-Apps, Animationen, Transparenz, Bing-Suche, Vorschläge und Game DVR. Benachrichtigungen oder Synchronisierung können beeinträchtigt werden. Einstellungen lassen sich wiederherstellen; Windows wird nicht ersetzt.",
    browser_onlyNote:
      "Ändert unterstützte Einstellungen für Hintergrund-Apps, Start-Vorschläge, Bing-Suche und Widgets. Benachrichtigungen oder Synchronisierung können beeinträchtigt werden; RAM- oder Geschwindigkeitsvorteile sind nicht garantiert.",
    officeNote:
      "Beschleunigt Dateinavigation und Menüs bei stummgeschalteten Umfragen für reibungsloses Arbeiten an Dokumenten, E-Mails und Tabellen.",
    gamingBody: "Gleichmäßige Windows-Zeigerbewegung und Kontrolle über Game-DVR-Aufnahmen.",
    studyBody: "Weniger Windows-Vorschläge, Umfragen und Ablenkungen.",
    workBody: "Sichtbare Dateiendungen, direkte Menüs und Autostart ohne Verzögerung.",
    gamingNote:
      "Deaktiviert Game DVR. Die Maus ändert sich auch auf dem Desktop; Spiele mit Raw Input können dies ignorieren. Die optionale Einrastfunktion-Einstellung deaktiviert deren Tastenkürzel.",
    studyNote:
      "Blendet Widgets in der Taskleiste aus. Schaltet Nachrichten nicht stumm und blockiert keine Websites. Einige Änderungen erfordern eine erneute Anmeldung.",
    workNote:
      "Menüs öffnen ohne Verzögerung. Autostart-Apps können gleichzeitig starten. Dateiendungen werden sichtbar; versteckte Dateien sind optional. Die Menüänderung wird nach Ab- und erneuter Anmeldung sichtbar.",
    apply: "Auswahl anwenden",
    applying: "Wird angewendet…",
    active: "Bereits angewendet",
    optional: "Optional",
    notice:
      "Aktiviert die gewählten Einstellungen und behält andere bei. Einzelne Änderungen lassen sich in der Kategorie oder im Verlauf zurücksetzen. Kein exklusiver Moduswechsel.",
    empty: "Wähle eine Änderung.",
    ready: "Alle gewählten Einstellungen sind bereits aktiv.",
    missing: "Einige Optionen fehlen in dieser Version.",
    free: "In Free enthalten",
    notHere: "Auf diesem PC nicht verfügbar",
  },
  pt: {
    ...en,
    heading: "Um perfil para o seu dia",
    intro: "Escolha um perfil, ajuste as opções e aplique com um clique.",
    gaming: "Gaming",
    study: "Áudio e Foco (Estudo)",
    work: "Programador e Trabalho",
    laptop: "Portátil",
    quiet: "Sem interrupções",
    streaming: "Streaming",
    barebone: "Barebone",
    browser_only: "Apenas navegador",
    office: "Navegador + MS Office",
    gamingBody: "Movimento consistente do ponteiro e controlo da gravação Game DVR.",
    studyBody: "Menos sugestões do Windows, questionários e distrações.",
    workBody: "Extensões visíveis, menus imediatos e aplicações sem atraso no arranque.",
    laptopBody:
      "Menos efeitos visuais e nenhuma aplicação a reabrir sozinha depois de iniciar sessão.",
    quietBody: "Sem questionários de opinião, aplicações sugeridas nem a janela das Teclas Fixas.",
    streamingBody:
      "Gravação Game DVR desativada e menos janelas do Windows que possam aparecer na transmissão.",
    bareboneBody:
      "Altera as preferências de aplicações em segundo plano, sugestões e aspeto; o desempenho depende da utilização.",
    browser_onlyBody:
      "Menos sugestões do Windows e alterações opcionais de aplicações em segundo plano para utilização centrada no navegador.",
    officeBody:
      "Produtividade de escritório: pastas rápidas, extensões visíveis, menus imediatos e zero notificações de telemetria.",
    gamingNote:
      "Desativa o Game DVR. O rato também muda no ambiente de trabalho; jogos com entrada direta podem ignorar o ajuste. A opção das Teclas Fixas desativa o respetivo atalho.",
    studyNote:
      "Oculta os widgets da barra. Não silencia mensagens nem bloqueia sites. Algumas alterações podem exigir terminar a sessão.",
    workNote:
      "Os menus abrem sem atraso. As aplicações podem iniciar em conjunto. As extensões ficam visíveis; ficheiros ocultos são opcionais. A alteração dos menus nota-se depois de terminar a sessão e voltar a entrar.",
    laptopNote:
      "As animações e a transparência são desativadas, por isso o Windows fica com um aspeto mais simples; as alterações notam-se depois de terminar a sessão e voltar a entrar. Se isto poupa bateria depende do portátil e não é medido aqui; as definições de energia não mudam.",
    quietNote:
      "Trata-se de janelas que surgem no ecrã, não do ruído das ventoinhas: as definições de ventoinhas e de energia não mudam. As notificações das suas aplicações continuam a funcionar.",
    streamingNote:
      "A gravação em segundo plano da Game Bar para, por isso grave com a sua aplicação de streaming. Os questionários do Windows e a janela das Teclas Fixas deixam de aparecer por cima do jogo.",
    bareboneNote:
      "Desativa as preferências suportadas de aplicações em segundo plano, animações, transparência, pesquisa Bing, sugestões e Game DVR. Pode afetar notificações ou sincronização. As definições podem ser repostas; não substitui a instalação do Windows.",
    browser_onlyNote:
      "Altera as preferências suportadas de aplicações em segundo plano, sugestões do Iniciar, pesquisa Bing e widgets. Pode afetar notificações ou sincronização; não se garante poupança de RAM nem maior velocidade.",
    officeNote:
      "Acelera a navegação de ficheiros e menus eliminando inquéritos para um trabalho fluido em documentos, correio e folhas de cálculo.",
    apply: "Aplicar seleção",
    applying: "A aplicar…",
    active: "Já aplicado",
    optional: "Opcional",
    notice:
      "Adiciona os ajustes selecionados e mantém os restantes. Restaure alterações na categoria ou no histórico. Não substitui integralmente o modo anterior.",
    empty: "Selecione uma alteração.",
    ready: "Todos os ajustes selecionados já estão aplicados.",
    missing: "Algumas opções não estão disponíveis nesta versão.",
    free: "Incluído em Free",
    notHere: "Não disponível neste PC",
  },
};
