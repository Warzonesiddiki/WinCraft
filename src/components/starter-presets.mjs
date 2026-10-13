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
    // animations, transparency, Bing search, suggestions, and Game DVR for
    // Atlas OS-level minimal footprint and zero UI latency.
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
      { id: "auto_end_frozen_tasks", selected: true },
    ],
  },
  {
    // Tuned for users who only use a web browser: strips background apps,
    // Start search suggestions, and taskbar widgets to free maximum RAM.
    id: "browser_only",
    icon: "disable_background_apps",
    tweaks: [
      { id: "disable_background_apps", selected: true },
      { id: "disable_start_suggestions", selected: true },
      { id: "disable_suggested_apps", selected: true },
      { id: "disable_feedback_requests", selected: true },
      { id: "disable_bing_search", selected: true },
      { id: "hide_taskbar_widgets", selected: true },
      { id: "disable_restart_apps", selected: true },
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
      { id: "auto_end_frozen_tasks", selected: true },
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
