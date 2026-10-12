import { useId, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { Lang, Strings } from "../i18n";
import type { TweakInfo, TweakProfile } from "../types";
import { PROFILE_TOOLS_COPY } from "./profile-tools-copy";
import { LayersIcon } from "./icons";
import "./lifetime-tools.css";
import "./workspace-panels.css";

type Comparison = {
  left_name: string;
  right_name: string;
  common: string[];
  only_left: string[];
  only_right: string[];
  unknown_left_count: number;
  unknown_right_count: number;
};
const LABELS: Record<Lang, readonly string[]> = {
  en: [
    "Profile A",
    "Profile B",
    "Compare profiles",
    "Working…",
    "In both profiles",
    "Only in A",
    "Only in B",
    "No settings in this group.",
    "Save at least two profiles to compare them.",
    "Include this comparison in the report",
    "Preview report",
    "Export Markdown",
    "Report saved.",
    "Hide preview",
    "Unrecognized settings were excluded",
    "The report omits account details, profile names and original registry values. Preview it before sharing.",
    "Reports are written in English.",
    "Choose a saved profile",
    "Preview the report before exporting.",
  ],
  it: [
    "Profilo A",
    "Profilo B",
    "Confronta profili",
    "Operazione in corso…",
    "In entrambi i profili",
    "Solo in A",
    "Solo in B",
    "Nessuna impostazione in questo gruppo.",
    "Salva almeno due profili per confrontarli.",
    "Includi questo confronto nel report",
    "Anteprima report",
    "Esporta Markdown",
    "Report salvato.",
    "Nascondi anteprima",
    "Le impostazioni non riconosciute sono state escluse",
    "Il report omette dati dell'account, nomi dei profili e valori originali del registro. Controllalo prima di condividerlo.",
    "I report sono scritti in inglese.",
    "Scegli un profilo salvato",
    "Controlla l'anteprima prima di esportare.",
  ],
  fr: [
    "Profil A",
    "Profil B",
    "Comparer les profils",
    "En cours…",
    "Dans les deux profils",
    "Uniquement dans A",
    "Uniquement dans B",
    "Aucun réglage dans ce groupe.",
    "Enregistrez au moins deux profils pour les comparer.",
    "Inclure cette comparaison dans le rapport",
    "Aperçu du rapport",
    "Exporter en Markdown",
    "Rapport enregistré.",
    "Masquer l'aperçu",
    "Les réglages non reconnus ont été exclus",
    "Le rapport omet les données du compte, les noms des profils et les valeurs d'origine du registre. Vérifiez-le avant de le partager.",
    "Les rapports sont rédigés en anglais.",
    "Choisir un profil enregistré",
    "Consultez l'aperçu avant d'exporter.",
  ],
  es: [
    "Perfil A",
    "Perfil B",
    "Comparar perfiles",
    "Procesando…",
    "En ambos perfiles",
    "Solo en A",
    "Solo en B",
    "No hay ajustes en este grupo.",
    "Guarda al menos dos perfiles para compararlos.",
    "Incluir esta comparación en el informe",
    "Vista previa del informe",
    "Exportar Markdown",
    "Informe guardado.",
    "Ocultar vista previa",
    "Se excluyeron los ajustes no reconocidos",
    "El informe omite datos de la cuenta, nombres de perfiles y valores originales del registro. Revísalo antes de compartirlo.",
    "Los informes se escriben en inglés.",
    "Elige un perfil guardado",
    "Revisa el informe antes de exportarlo.",
  ],
  de: [
    "Profil A",
    "Profil B",
    "Profile vergleichen",
    "Wird verarbeitet…",
    "In beiden Profilen",
    "Nur in A",
    "Nur in B",
    "Keine Einstellungen in dieser Gruppe.",
    "Speichere mindestens zwei Profile für einen Vergleich.",
    "Diesen Vergleich in den Bericht aufnehmen",
    "Berichtsvorschau",
    "Markdown exportieren",
    "Bericht gespeichert.",
    "Vorschau schließen",
    "Unbekannte Einstellungen wurden ausgeschlossen",
    "Der Bericht enthält keine Kontodaten, Profilnamen oder ursprünglichen Registrierungswerte. Prüfe ihn vor dem Teilen.",
    "Berichte werden auf Englisch erstellt.",
    "Gespeichertes Profil auswählen",
    "Prüfe die Vorschau vor dem Export.",
  ],
  pt: [
    "Perfil A",
    "Perfil B",
    "Comparar perfis",
    "A processar…",
    "Nos dois perfis",
    "Apenas em A",
    "Apenas em B",
    "Sem definições neste grupo.",
    "Guarde pelo menos dois perfis para os comparar.",
    "Incluir esta comparação no relatório",
    "Pré-visualizar relatório",
    "Exportar Markdown",
    "Relatório guardado.",
    "Ocultar pré-visualização",
    "As definições desconhecidas foram excluídas",
    "O relatório omite dados da conta, nomes de perfis e valores originais do registo. Reveja-o antes de partilhar.",
    "Os relatórios são escritos em inglês.",
    "Escolha um perfil guardado",
    "Reveja o relatório antes de exportar.",
  ],
};

export function LifetimeTools({
  s,
  lang,
  profiles,
  tweaks,
}: {
  s: Strings;
  lang: Lang;
  profiles: TweakProfile[];
  tweaks: TweakInfo[];
}) {
  const copy = PROFILE_TOOLS_COPY[lang];
  const l = LABELS[lang];
  const id = useId();
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [comparison, setComparison] = useState<Comparison | null>(null);
  const [include, setInclude] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const pending = useRef(false);
  const selectionVersion = useRef(0);
  const validSelection =
    profiles.some((p) => p.name === left) &&
    profiles.some((p) => p.name === right) &&
    left !== right;
  const currentComparison =
    comparison?.left_name === left && comparison?.right_name === right && validSelection
      ? comparison
      : null;
  const request = include && currentComparison ? { left_name: left, right_name: right } : null;

  function select(side: "left" | "right", value: string) {
    selectionVersion.current++;
    (side === "left" ? setLeft : setRight)(value);
    setComparison(null);
    setInclude(false);
    setReport(null);
    setSaved(false);
    setError(null);
  }
  async function run(action: "compare" | "preview" | "export") {
    if (pending.current || (action === "compare" && !validSelection)) return;
    pending.current = true;
    setBusy(action);
    setError(null);
    setSaved(false);
    const version = selectionVersion.current;
    try {
      if (action === "compare") {
        const result = await invoke<Comparison>("compare_lifetime_profiles", {
          leftName: left,
          rightName: right,
        });
        if (version === selectionVersion.current) {
          setComparison(result);
          setReport(null);
        }
      } else if (action === "preview") {
        const result = await invoke<string>("preview_lifetime_report", { comparison: request });
        if (version === selectionVersion.current) setReport(result);
      } else {
        const result = await invoke<boolean>("save_lifetime_report", { comparison: request });
        if (result) setSaved(true);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      pending.current = false;
      setBusy(null);
    }
  }
  const label = (tweakId: string) =>
    s.tweaks[tweakId]?.name ?? tweaks.find((t) => t.id === tweakId)?.name ?? tweakId;

  return (
    <section className="lifetime-tools" aria-labelledby={`${id}-heading`}>
      <header>
        <h2 id={`${id}-heading`}>{copy.openTools}</h2>
        <p>{copy.notBenchmark}</p>
      </header>
      <article className="lifetime-tool-block">
        <h3>
          <LayersIcon className="h-4 w-4" />
          {copy.profiles}
        </h3>
        <p>{copy.profileDetail}</p>
        {profiles.length < 2 && <p className="lifetime-tool-hint">{l[8]}</p>}
        <div className="lifetime-tool-selectors">
          {(["left", "right"] as const).map((side, index) => (
            <label key={side} htmlFor={`${id}-${side}`}>
              {l[index]}
              <select
                id={`${id}-${side}`}
                value={side === "left" ? left : right}
                disabled={busy !== null || profiles.length < 2}
                onChange={(e) => select(side, e.target.value)}
              >
                <option value="">{l[17]}</option>
                {profiles.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <button
          className="workspace-button workspace-button-secondary"
          disabled={busy !== null || !validSelection}
          aria-busy={busy === "compare"}
          onClick={() => void run("compare")}
        >
          {busy === "compare" ? l[3] : l[2]}
        </button>
        {currentComparison && (
          <div className="lifetime-comparison" aria-live="polite">
            {[
              currentComparison.common,
              currentComparison.only_left,
              currentComparison.only_right,
            ].map((ids, index) => (
              <section key={index}>
                <h4>
                  {l[index + 4]} <strong>{ids.length}</strong>
                </h4>
                {ids.length ? (
                  <ul>
                    {ids.map((tweakId) => (
                      <li key={tweakId}>{label(tweakId)}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{l[7]}</p>
                )}
              </section>
            ))}
            {currentComparison.unknown_left_count + currentComparison.unknown_right_count > 0 && (
              <p className="lifetime-unknown">
                {l[14]}: A {currentComparison.unknown_left_count}, B{" "}
                {currentComparison.unknown_right_count}.
              </p>
            )}
          </div>
        )}
      </article>
      <article className="lifetime-tool-block">
        <h3>{copy.reports}</h3>
        <p>{copy.reportDetail}</p>
        {currentComparison && (
          <label className="lifetime-report-include">
            <input
              type="checkbox"
              checked={include}
              disabled={busy !== null}
              onChange={(e) => {
                selectionVersion.current++;
                setInclude(e.target.checked);
                setReport(null);
                setSaved(false);
              }}
            />
            {l[9]}
          </label>
        )}
        <div className="lifetime-tool-actions">
          <button
            className="workspace-button workspace-button-secondary"
            disabled={busy !== null}
            onClick={() => void run("preview")}
          >
            {busy === "preview" ? l[3] : l[10]}
          </button>
          <button
            className="workspace-button workspace-button-primary"
            disabled={busy !== null || !report}
            onClick={() => void run("export")}
          >
            {busy === "export" ? l[3] : l[11]}
          </button>
        </div>
        <p className="lifetime-tool-hint">
          {l[15]} {l[16]} {!report && l[18]}
        </p>
        {report && (
          <div className="lifetime-report-preview">
            <button onClick={() => setReport(null)}>{l[13]}</button>
            <pre tabIndex={0} aria-label={l[10]}>
              {report}
            </pre>
          </div>
        )}
      </article>
      {error && (
        <p className="workspace-panel-error" role="alert">
          {error}
        </p>
      )}
      {saved && (
        <p className="lifetime-tool-success" role="status">
          {l[12]}
        </p>
      )}
    </section>
  );
}
