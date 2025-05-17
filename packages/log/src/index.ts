type LogLevel = "debug" | "info" | "warn" | "error";

const COLORS = {
  reset: "\x1b[0m",
  gray: "\x1b[90m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: COLORS.magenta,
  info: COLORS.cyan,
  warn: COLORS.yellow,
  error: COLORS.red,
};

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(
      255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))
    );
  return [f(0), f(8), f(4)];
}

function generateAnsiColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  const [r, g, b] = hslToRgb(hue, 70, 60);
  return `\x1b[38;2;${r};${g};${b}m`;
}

interface LoggerOptions {
  prefix: string;
}

export class Logger {
  private prefix: string;
  private prefixColor: string;

  constructor(options: LoggerOptions) {
    this.prefix = options.prefix;
    this.prefixColor = generateAnsiColor(this.prefix);
  }

  private formatMessage(level: LogLevel, args: any[]) {
    const levelColor = LEVEL_COLORS[level];
    const prefix = `${this.prefixColor}[${this.prefix}]${COLORS.reset}`;
    const levelTag = `${levelColor}[${level}]${COLORS.reset}`;
    const time = `${COLORS.gray}${new Date().toISOString()}${COLORS.reset}`;
    return [prefix, levelTag, time, ...args];
  }

  debug = (...args: any[]) => {
    console.debug(...this.formatMessage("debug", args));
  };

  info = (...args: any[]) => {
    console.info(...this.formatMessage("info", args));
  };

  warn = (...args: any[]) => {
    console.warn(...this.formatMessage("warn", args));
  };

  error = (...args: any[]) => {
    console.error(...this.formatMessage("error", args));
  };
}
