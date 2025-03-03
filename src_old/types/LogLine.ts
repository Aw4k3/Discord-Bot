export type LogLine = {
  type: "info" | "warning" | "error" | "debug";
  message: string;
  timestamp: number;
}