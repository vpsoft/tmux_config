import {
  TmuxTheme,
  cloneTheme,
  createThemeFromPreset,
  defaultPreset,
} from "./theme";

const DRAFT_KEY = "tmux-theme-studio:draft";
const SAVED_THEMES_KEY = "tmux-theme-studio:saved-themes";

export function loadDraftTheme(): TmuxTheme {
  if (typeof window === "undefined") {
    return createThemeFromPreset(defaultPreset.id);
  }

  const stored = window.localStorage.getItem(DRAFT_KEY);
  if (!stored) {
    return createThemeFromPreset(defaultPreset.id);
  }

  try {
    return JSON.parse(stored) as TmuxTheme;
  } catch {
    return createThemeFromPreset(defaultPreset.id);
  }
}

export function saveDraftTheme(theme: TmuxTheme): void {
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(theme));
}

export function loadSavedThemes(): TmuxTheme[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = window.localStorage.getItem(SAVED_THEMES_KEY);
  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored) as TmuxTheme[];
    return parsed.map((theme) => cloneTheme(theme));
  } catch {
    return [];
  }
}

export function saveSavedThemes(themes: TmuxTheme[]): void {
  window.localStorage.setItem(SAVED_THEMES_KEY, JSON.stringify(themes));
}
