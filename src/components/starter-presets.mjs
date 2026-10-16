// Only reversible, user-level controls. No security, network or power overrides.
export const STARTER_PRESETS = [
  {
    id: "gaming",
    icon: "disable_game_dvr",
    tweaks: [
      { id: "disable_game_dvr", selected: true },
      { id: "reduce_input_lag", selected: true },
      { id: "disable_sticky_keys_prompt", selected: false },
    ],
  },
  {
    id: "streaming",
    icon: "disable_game_dvr",
    tweaks: [
      { id: "disable_game_dvr", selected: true },
      { id: "disable_sticky_keys_prompt", selected: true },
      { id: "disable_feedback_requests", selected: true },
      { id: "disable_start_suggestions", selected: false },
    ],
  },
  {
    id: "work",
    icon: "show_file_extensions",
    tweaks: [
      { id: "show_file_extensions", selected: true },
      { id: "disable_startup_delay", selected: true },
      { id: "menu_show_delay", selected: true },
      { id: "show_hidden_files", selected: false },
    ],
  },
  {
    id: "study",
    icon: "instant_folder_loading",
    tweaks: [
      { id: "disable_start_suggestions", selected: true },
      { id: "disable_feedback_requests", selected: true },
      { id: "hide_taskbar_widgets", selected: true },
      { id: "disable_tailored_experiences", selected: false },
    ],
  },
  {
    // Effects and reopening apps only: battery savings are not claimed or
    // measured, and power settings stay out of every preset.
    id: "laptop",
    icon: "disable_transparency",
    tweaks: [
      { id: "disable_transparency", selected: true },
      { id: "disable_window_animations", selected: true },
      { id: "disable_restart_apps", selected: true },
      { id: "disable_drag_full_windows", selected: false },
    ],
  },
  {
    // Pop-ups, not fan noise: the copy says so.
    id: "quiet",
    icon: "disable_feedback_requests",
    tweaks: [
      { id: "disable_feedback_requests", selected: true },
      { id: "disable_suggested_apps", selected: true },
      { id: "disable_start_suggestions", selected: true },
      { id: "disable_sticky_keys_prompt", selected: true },
      { id: "disable_tailored_experiences", selected: false },
    ],
  },
  {
    // Barebone stripped-down lean profile: strips background app execution,
    // animations, transparency, Bing search, suggestions, and Game DVR.
    // Changes preferences; no OS-equivalence or latency gain is promised.
    id: "barebone",
    icon: "disable_background_apps",
    tweaks: [
      { id: "disable_background_apps", selected: true },
      { id: "disable_transparency", selected: true },
      { id: "disable_window_animations", selected: true },
      { id: "disable_start_suggestions", selected: true },
      { id: "disable_suggested_apps", selected: true },
      { id: "disable_tailored_experiences", selected: true },
      { id: "disable_feedback_requests", selected: true },
      { id: "disable_bing_search", selected: true },
      { id: "disable_game_dvr", selected: true },
      { id: "disable_startup_delay", selected: true },
      { id: "menu_show_delay", selected: true },
      { id: "hide_taskbar_widgets", selected: true },
      { id: "auto_end_frozen_tasks", selected: false },
    ],
  },
  {
    // A browser-first set. What a browser-only user gains most from removing is
    // Windows' own background work and the web lookups and feeds that run beside
    // the browser: background apps, Start/Explorer web search, suggestion and
    // widget feeds, lock-screen promotions, and data-collection surfaces they
    // never use. The compositor and shell effects are reduced so more of the
    // machine is left for the browser, and search stays local.
    //
    // Every control is per-user, reversible and non-elevated; nothing here
    // changes security, networking or power, and no RAM or speed gain is
    // claimed. Layout and appearance choices are listed but never preselected.
    id: "browser_only",
    icon: "disable_background_apps",
    tweaks: [
      // Background work competing with the browser for RAM and CPU.
      { id: "disable_background_apps", selected: true },
      { id: "disable_restart_apps", selected: true },
      { id: "disable_startup_delay", selected: true },
      // Compositor and shell effects.
      { id: "disable_window_animations", selected: true },
      { id: "disable_transparency", selected: true },
      // Shell responsiveness.
      { id: "menu_show_delay", selected: true },
      { id: "mouse_hover_delay", selected: true },
      { id: "instant_folder_loading", selected: true },
      // Search stays local: no web roundtrips, no suggestion feeds.
      { id: "disable_bing_search", selected: true },
      { id: "disable_cloud_search", selected: true },
      { id: "disable_search_highlights", selected: true },
      { id: "disable_search_history", selected: true },
      { id: "disable_start_suggestions", selected: true },
      { id: "disable_suggested_apps", selected: true },
      { id: "disable_app_suggestions_start", selected: true },
      // Prompts and promotions that interrupt a browsing session.
      { id: "disable_feedback_requests", selected: true },
      { id: "disable_tailored_experiences", selected: true },
      { id: "disable_lockscreen_spotlight", selected: true },
      { id: "disable_sticky_keys_prompt", selected: true },
      { id: "disable_aero_shake", selected: true },
      // Collection surfaces this user does not feed.
      { id: "disable_typing_insights", selected: true },
      { id: "disable_online_speech_privacy", selected: true },
      { id: "disable_device_history", selected: true },
      // File extensions stay visible in the downloads folder.
      { id: "show_file_extensions", selected: true },
      // Taskbar and appearance: shown for review, never preselected.
      { id: "hide_taskbar_widgets", selected: true },
      { id: "hide_taskbar_search", selected: false },
      { id: "hide_taskbar_chat", selected: false },
      { id: "taskbar_align_left", selected: false },
      { id: "disable_drag_full_windows", selected: false },
      { id: "dark_mode", selected: false },
    ],
  },
  {
    // Workstation productivity for Browser + Microsoft Office users:
    // fast folder loading, visible extensions, snappy menus, zero prompts.
    id: "office",
    icon: "instant_folder_loading",
    tweaks: [
      { id: "show_file_extensions", selected: true },
      { id: "instant_folder_loading", selected: true },
      { id: "disable_startup_delay", selected: true },
      { id: "menu_show_delay", selected: true },
      { id: "disable_start_suggestions", selected: true },
      { id: "disable_feedback_requests", selected: true },
      { id: "auto_end_frozen_tasks", selected: false },
    ],
  },
];

export function presetSelection(preset, tweaks, selected) {
  const catalog = new Map(tweaks.map((t) => [t.id, t]));
  const chosen = new Set(selected);
  const available = preset.tweaks.flatMap((item) => {
    const tweak = catalog.get(item.id);
    return tweak ? [tweak] : [];
  });
  // A control this PC's Windows does not support is shown, never applied.
  const pending = available.filter((t) => chosen.has(t.id) && !t.applied && !t.unavailable);
  return {
    available,
    missing: preset.tweaks.filter((t) => !catalog.has(t.id)).map((t) => t.id),
    pending,
    unsupported: available.filter((t) => t.unavailable).map((t) => t.id),
  };
}
