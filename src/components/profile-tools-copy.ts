import type { Lang } from "../i18n";

type ProfileToolsCopy = {
  profiles: string;
  profileDetail: string;
  reports: string;
  reportDetail: string;
  openTools: string;
  notBenchmark: string;
};

export const PROFILE_TOOLS_COPY: Record<Lang, ProfileToolsCopy> = {
  en: {
    profiles: "Compare saved profiles",
    reports: "Portable tuning reports",
    profileDetail:
      "Put two saved profiles side by side. See shared settings and the differences before choosing one.",
    reportDetail:
      "Preview and export a Markdown report of your recorded settings, with an optional profile comparison. You choose what to share.",
    openTools: "Saved profiles & reports",
    notBenchmark: "These tools document settings. They do not measure or claim performance gains.",
  },
  it: {
    profiles: "Confronto dei profili salvati",
    reports: "Report delle impostazioni esportabili",
    profileDetail:
      "Affianca due profili salvati. Controlla impostazioni comuni e differenze prima di sceglierne uno.",
    reportDetail:
      "Visualizza ed esporta un report Markdown delle impostazioni registrate, con un confronto facoltativo tra profili. Scegli tu cosa condividere.",
    openTools: "Profili salvati e report",
    notBenchmark:
      "Questi strumenti documentano le impostazioni. Non misurano né promettono aumenti di prestazioni.",
  },
  fr: {
    profiles: "Comparaison de profils enregistrés",
    reports: "Rapports de réglages exportables",
    profileDetail:
      "Comparez deux profils enregistrés. Consultez les réglages communs et les différences avant de choisir.",
    reportDetail:
      "Consultez et exportez un rapport Markdown de vos réglages enregistrés, avec une comparaison facultative. Vous choisissez ce que vous partagez.",
    openTools: "Profils enregistrés et rapports",
    notBenchmark:
      "Ces outils documentent les réglages. Ils ne mesurent ni ne promettent de gains de performances.",
  },
  es: {
    profiles: "Comparación de perfiles guardados",
    reports: "Informes de ajustes exportables",
    profileDetail:
      "Compara dos perfiles guardados. Revisa los ajustes comunes y las diferencias antes de elegir.",
    reportDetail:
      "Revisa y exporta un informe Markdown de tus ajustes registrados, con una comparación opcional. Tú eliges qué compartir.",
    openTools: "Perfiles guardados e informes",
    notBenchmark:
      "Estas herramientas documentan ajustes. No miden ni prometen mejoras de rendimiento.",
  },
  de: {
    profiles: "Gespeicherte Profile vergleichen",
    reports: "Exportierbare Einstellungsberichte",
    profileDetail:
      "Vergleiche zwei gespeicherte Profile. Prüfe gemeinsame Einstellungen und Unterschiede vor deiner Auswahl.",
    reportDetail:
      "Prüfe und exportiere einen Markdown-Bericht deiner erfassten Einstellungen mit optionalem Profilvergleich. Du entscheidest, was du teilst.",
    openTools: "Gespeicherte Profile & Berichte",
    notBenchmark:
      "Diese Werkzeuge dokumentieren Einstellungen. Sie messen oder versprechen keine Leistungsgewinne.",
  },
  pt: {
    profiles: "Comparação de perfis guardados",
    reports: "Relatórios de definições exportáveis",
    profileDetail:
      "Compare dois perfis guardados. Consulte as definições comuns e as diferenças antes de escolher.",
    reportDetail:
      "Pré-visualize e exporte um relatório Markdown das definições registadas, com uma comparação opcional. Decide o que partilha.",
    openTools: "Perfis guardados e relatórios",
    notBenchmark:
      "Estas ferramentas documentam definições. Não medem nem prometem ganhos de desempenho.",
  },
};
