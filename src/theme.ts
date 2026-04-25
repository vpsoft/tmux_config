export type ColorValue = `#${string}`;
export type Appearance = "dark" | "light";

export type SegmentTheme = {
  bg: ColorValue;
  fg: ColorValue;
  bold?: boolean;
};

export type StatusTheme = {
  bar: SegmentTheme;
  session: SegmentTheme;
  window: SegmentTheme;
  windowActive: SegmentTheme;
  battery: SegmentTheme;
  date: SegmentTheme;
  time: SegmentTheme;
};

export type PaneTheme = {
  background: ColorValue;
  text: ColorValue;
  border: SegmentTheme;
  activeBorder: SegmentTheme;
};

export type MessageTheme = {
  command: SegmentTheme;
  message: SegmentTheme;
};

export type TmuxTheme = {
  id: string;
  name: string;
  appearance: Appearance;
  fontVariant: "powerline";
  status: StatusTheme;
  pane: PaneTheme;
  message: MessageTheme;
};

export type ThemePreset = {
  id: string;
  name: string;
  appearance: Appearance;
  description: string;
  theme: TmuxTheme;
};

export type ImportReport = {
  applied: string[];
  unsupported: string[];
  errors: string[];
};

function createTheme(
  id: string,
  name: string,
  appearance: Appearance,
  values: Omit<TmuxTheme, "id" | "name" | "appearance" | "fontVariant">,
): TmuxTheme {
  return {
    id,
    name,
    appearance,
    fontVariant: "powerline",
    ...values,
  };
}

export const themePresets: ThemePreset[] = [
  {
    id: "nord-powerline",
    name: "Nord Powerline",
    appearance: "dark",
    description: "Frost blues with a calm dark bar and classic powerline contrast.",
    theme: createTheme("nord-powerline", "Nord Powerline", "dark", {
      status: {
        bar: { bg: "#2e3440", fg: "#d8dee9" },
        session: { bg: "#5e81ac", fg: "#2e3440", bold: true },
        window: { bg: "#3b4252", fg: "#d8dee9" },
        windowActive: { bg: "#88c0d0", fg: "#2e3440", bold: true },
        battery: { bg: "#a3be8c", fg: "#2e3440", bold: true },
        date: { bg: "#5e81ac", fg: "#e5e9f0" },
        time: { bg: "#88c0d0", fg: "#2e3440", bold: true },
      },
      pane: {
        background: "#11161e",
        text: "#d8dee9",
        border: { bg: "#11161e", fg: "#5e81ac" },
        activeBorder: { bg: "#11161e", fg: "#88c0d0" },
      },
      message: {
        command: { bg: "#5e81ac", fg: "#eceff4", bold: true },
        message: { bg: "#a3be8c", fg: "#2e3440", bold: true },
      },
    }),
  },
  {
    id: "catppuccin-mocha",
    name: "Catppuccin Mocha",
    appearance: "dark",
    description: "Soft mauves and warm accents on a plush dark base.",
    theme: createTheme("catppuccin-mocha", "Catppuccin Mocha", "dark", {
      status: {
        bar: { bg: "#1e1e2e", fg: "#cdd6f4" },
        session: { bg: "#89b4fa", fg: "#1e1e2e", bold: true },
        window: { bg: "#45475a", fg: "#cdd6f4" },
        windowActive: { bg: "#f5c2e7", fg: "#1e1e2e", bold: true },
        battery: { bg: "#a6e3a1", fg: "#1e1e2e", bold: true },
        date: { bg: "#89b4fa", fg: "#eff1f5" },
        time: { bg: "#f9e2af", fg: "#1e1e2e", bold: true },
      },
      pane: {
        background: "#11111b",
        text: "#cdd6f4",
        border: { bg: "#11111b", fg: "#585b70" },
        activeBorder: { bg: "#11111b", fg: "#89b4fa" },
      },
      message: {
        command: { bg: "#89b4fa", fg: "#11111b", bold: true },
        message: { bg: "#a6e3a1", fg: "#11111b", bold: true },
      },
    }),
  },
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    appearance: "dark",
    description: "Neon blues and violets with crisp active-state separation.",
    theme: createTheme("tokyo-night", "Tokyo Night", "dark", {
      status: {
        bar: { bg: "#1a1b26", fg: "#c0caf5" },
        session: { bg: "#7aa2f7", fg: "#1a1b26", bold: true },
        window: { bg: "#24283b", fg: "#c0caf5" },
        windowActive: { bg: "#bb9af7", fg: "#1a1b26", bold: true },
        battery: { bg: "#9ece6a", fg: "#1a1b26", bold: true },
        date: { bg: "#7dcfff", fg: "#1a1b26" },
        time: { bg: "#e0af68", fg: "#1a1b26", bold: true },
      },
      pane: {
        background: "#10131d",
        text: "#c0caf5",
        border: { bg: "#10131d", fg: "#414868" },
        activeBorder: { bg: "#10131d", fg: "#7aa2f7" },
      },
      message: {
        command: { bg: "#7aa2f7", fg: "#1a1b26", bold: true },
        message: { bg: "#9ece6a", fg: "#1a1b26", bold: true },
      },
    }),
  },
  {
    id: "kanagawa-paper",
    name: "Kanagawa Paper",
    appearance: "light",
    description: "Warm parchment background with ink-like borders and gold accents.",
    theme: createTheme("kanagawa-paper", "Kanagawa Paper", "light", {
      status: {
        bar: { bg: "#f2ecbc", fg: "#1f1f28" },
        session: { bg: "#c4746e", fg: "#fefae0", bold: true },
        window: { bg: "#e6dcc7", fg: "#2a2a37" },
        windowActive: { bg: "#8ea4a2", fg: "#16161d", bold: true },
        battery: { bg: "#8a9a5b", fg: "#fefae0", bold: true },
        date: { bg: "#938056", fg: "#fefae0" },
        time: { bg: "#7fb4ca", fg: "#16161d", bold: true },
      },
      pane: {
        background: "#fffdf4",
        text: "#1f1f28",
        border: { bg: "#fffdf4", fg: "#938056" },
        activeBorder: { bg: "#fffdf4", fg: "#8ea4a2" },
      },
      message: {
        command: { bg: "#c4746e", fg: "#fffdf4", bold: true },
        message: { bg: "#8a9a5b", fg: "#fffdf4", bold: true },
      },
    }),
  },
  {
    id: "solarized-light",
    name: "Solarized Light",
    appearance: "light",
    description: "Classic solarized paper tones with cool blue focus states.",
    theme: createTheme("solarized-light", "Solarized Light", "light", {
      status: {
        bar: { bg: "#fdf6e3", fg: "#586e75" },
        session: { bg: "#268bd2", fg: "#fdf6e3", bold: true },
        window: { bg: "#eee8d5", fg: "#586e75" },
        windowActive: { bg: "#2aa198", fg: "#fdf6e3", bold: true },
        battery: { bg: "#859900", fg: "#fdf6e3", bold: true },
        date: { bg: "#6c71c4", fg: "#fdf6e3" },
        time: { bg: "#cb4b16", fg: "#fdf6e3", bold: true },
      },
      pane: {
        background: "#fffdf6",
        text: "#586e75",
        border: { bg: "#fffdf6", fg: "#93a1a1" },
        activeBorder: { bg: "#fffdf6", fg: "#268bd2" },
      },
      message: {
        command: { bg: "#268bd2", fg: "#fdf6e3", bold: true },
        message: { bg: "#859900", fg: "#fdf6e3", bold: true },
      },
    }),
  },
  {
    id: "rose-pine-dawn",
    name: "Rosé Pine Dawn",
    appearance: "light",
    description: "Dusty blushes and muted pines on a soft cream workspace.",
    theme: createTheme("rose-pine-dawn", "Rosé Pine Dawn", "light", {
      status: {
        bar: { bg: "#faf4ed", fg: "#575279" },
        session: { bg: "#56949f", fg: "#fffaf3", bold: true },
        window: { bg: "#f2e9e1", fg: "#575279" },
        windowActive: { bg: "#d7827e", fg: "#fffaf3", bold: true },
        battery: { bg: "#6e8f6d", fg: "#fffaf3", bold: true },
        date: { bg: "#907aa9", fg: "#fffaf3" },
        time: { bg: "#ea9d34", fg: "#fffaf3", bold: true },
      },
      pane: {
        background: "#fffaf3",
        text: "#575279",
        border: { bg: "#fffaf3", fg: "#cecacd" },
        activeBorder: { bg: "#fffaf3", fg: "#56949f" },
      },
      message: {
        command: { bg: "#56949f", fg: "#fffaf3", bold: true },
        message: { bg: "#d7827e", fg: "#fffaf3", bold: true },
      },
    }),
  },
];

export const defaultPreset = themePresets[0];

export function cloneTheme(theme: TmuxTheme): TmuxTheme {
  return JSON.parse(JSON.stringify(theme)) as TmuxTheme;
}

export function createThemeFromPreset(presetId: string): TmuxTheme {
  const preset = themePresets.find((item) => item.id === presetId) ?? defaultPreset;
  return cloneTheme(preset.theme);
}

export function generateThemeId(): string {
  return `theme-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function makeNamedCopy(theme: TmuxTheme, name: string): TmuxTheme {
  return {
    ...cloneTheme(theme),
    id: generateThemeId(),
    name,
  };
}

export function exportTmuxSnippet(theme: TmuxTheme): string {
  const { status, pane, message } = theme;

  return [
    `set -g status-style "bg=${status.bar.bg},fg=${status.bar.fg}"`,
    "set -g status-left-length 40",
    "set -g status-right-length 80",
    `set -g status-left "#[fg=${status.session.fg},bg=${status.session.bg},${status.session.bold ? "bold" : "nobold"}] #S #[fg=${status.session.bg},bg=${status.bar.bg}]\\ue0b0"`,
    `setw -g window-status-format "#[fg=${status.bar.bg},bg=${status.window.bg}]\\ue0b0#[fg=${status.window.fg},bg=${status.window.bg},${status.window.bold ? "bold" : "nobold"}] #I #W #[fg=${status.window.bg},bg=${status.bar.bg}]\\ue0b0"`,
    `setw -g window-status-current-format "#[fg=${status.bar.bg},bg=${status.windowActive.bg}]\\ue0b0#[fg=${status.windowActive.fg},bg=${status.windowActive.bg},${status.windowActive.bold ? "bold" : "nobold"}] #I #W #[fg=${status.windowActive.bg},bg=${status.bar.bg}]\\ue0b0"`,
    `set -g status-right "#[fg=${status.battery.bg},bg=${status.bar.bg}]\\ue0b2#[fg=${status.battery.fg},bg=${status.battery.bg},${status.battery.bold ? "bold" : "nobold"}] #(pmset -g batt | grep -o '[0-9]*%%' | head -1) #[fg=${status.date.bg},bg=${status.battery.bg}]\\ue0b2#[fg=${status.date.fg},bg=${status.date.bg},${status.date.bold ? "bold" : "nobold"}] %b %d #[fg=${status.time.bg},bg=${status.date.bg}]\\ue0b2#[fg=${status.time.fg},bg=${status.time.bg},${status.time.bold ? "bold" : "nobold"}] %H:%M "`,
    `set -g pane-border-style "fg=${pane.border.fg},bg=${pane.border.bg}"`,
    `set -g pane-active-border-style "fg=${pane.activeBorder.fg},bg=${pane.activeBorder.bg}"`,
    `set -g message-command-style "fg=${message.command.fg},bg=${message.command.bg}"`,
    `set -g message-style "fg=${message.message.fg},bg=${message.message.bg}"`,
  ].join("\n");
}

function isColorValue(value: string): value is ColorValue {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

function parseStylePair(raw: string): { fg?: ColorValue; bg?: ColorValue } | null {
  const fgMatch = raw.match(/fg=(#[0-9a-fA-F]{6})/);
  const bgMatch = raw.match(/bg=(#[0-9a-fA-F]{6})/);
  const fg = fgMatch?.[1];
  const bg = bgMatch?.[1];

  if (!fg && !bg) {
    return null;
  }

  if ((fg && !isColorValue(fg)) || (bg && !isColorValue(bg))) {
    return null;
  }

  return {
    fg: fg && isColorValue(fg) ? fg : undefined,
    bg: bg && isColorValue(bg) ? bg : undefined,
  };
}

function parseSegmentFromFormat(format: string): { fg: ColorValue; bg: ColorValue; bold: boolean } | null {
  const match = format.match(/#\[fg=(#[0-9a-fA-F]{6}),bg=(#[0-9a-fA-F]{6})(?:,(bold|nobold))?\]/);
  if (!match) {
    return null;
  }

  const [, fg, bg, boldFlag] = match;
  if (!isColorValue(fg) || !isColorValue(bg)) {
    return null;
  }

  return { fg, bg, bold: boldFlag !== "nobold" };
}

export function importTmuxSnippet(
  input: string,
  baseTheme: TmuxTheme,
): { theme: TmuxTheme; report: ImportReport } {
  const theme = cloneTheme(baseTheme);
  const report: ImportReport = { applied: [], unsupported: [], errors: [] };
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (line.startsWith("set -g status-style")) {
      const pair = parseStylePair(line);
      if (!pair?.bg || !pair.fg) {
        report.errors.push(`Could not parse status-style: ${line}`);
        continue;
      }

      theme.status.bar.bg = pair.bg;
      theme.status.bar.fg = pair.fg;
      report.applied.push("Applied status bar style");
      continue;
    }

    if (line.startsWith("set -g pane-border-style")) {
      const pair = parseStylePair(line);
      if (!pair?.bg || !pair.fg) {
        report.errors.push(`Could not parse pane-border-style: ${line}`);
        continue;
      }

      theme.pane.border.bg = pair.bg;
      theme.pane.border.fg = pair.fg;
      report.applied.push("Applied pane border style");
      continue;
    }

    if (line.startsWith("set -g pane-active-border-style")) {
      const pair = parseStylePair(line);
      if (!pair?.bg || !pair.fg) {
        report.errors.push(`Could not parse pane-active-border-style: ${line}`);
        continue;
      }

      theme.pane.activeBorder.bg = pair.bg;
      theme.pane.activeBorder.fg = pair.fg;
      report.applied.push("Applied active pane border style");
      continue;
    }

    if (line.startsWith("set -g message-command-style")) {
      const pair = parseStylePair(line);
      if (!pair?.bg || !pair.fg) {
        report.errors.push(`Could not parse message-command-style: ${line}`);
        continue;
      }

      theme.message.command.bg = pair.bg;
      theme.message.command.fg = pair.fg;
      report.applied.push("Applied command message style");
      continue;
    }

    if (line.startsWith("set -g message-style")) {
      const pair = parseStylePair(line);
      if (!pair?.bg || !pair.fg) {
        report.errors.push(`Could not parse message-style: ${line}`);
        continue;
      }

      theme.message.message.bg = pair.bg;
      theme.message.message.fg = pair.fg;
      report.applied.push("Applied message style");
      continue;
    }

    if (line.startsWith("set -g status-left ")) {
      const segment = parseSegmentFromFormat(line);
      if (!segment) {
        report.errors.push(`Could not parse status-left: ${line}`);
        continue;
      }

      theme.status.session.fg = segment.fg;
      theme.status.session.bg = segment.bg;
      theme.status.session.bold = segment.bold;
      report.applied.push("Applied session segment");
      continue;
    }

    if (line.startsWith("setw -g window-status-format")) {
      const segment = parseSegmentFromFormat(line.replace("\\ue0b0", ""));
      if (!segment) {
        report.errors.push(`Could not parse window-status-format: ${line}`);
        continue;
      }

      theme.status.window.fg = segment.fg;
      theme.status.window.bg = segment.bg;
      theme.status.window.bold = segment.bold;
      report.applied.push("Applied inactive window segment");
      continue;
    }

    if (line.startsWith("setw -g window-status-current-format")) {
      const segment = parseSegmentFromFormat(line.replace("\\ue0b0", ""));
      if (!segment) {
        report.errors.push(`Could not parse window-status-current-format: ${line}`);
        continue;
      }

      theme.status.windowActive.fg = segment.fg;
      theme.status.windowActive.bg = segment.bg;
      theme.status.windowActive.bold = segment.bold;
      report.applied.push("Applied active window segment");
      continue;
    }

    report.unsupported.push(line);
  }

  return { theme, report };
}
