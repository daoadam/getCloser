// Topic chip colours — shared by the homepage grid, post pages and the
// generated Open Graph cards so a tag always wears the same colour everywhere.
export const TAG_STYLE: Record<string, { bg: string; fg: string }> = {
  money: { bg: "#e9f5ee", fg: "#1f6b46" },
  "real talk": { bg: "#efe9f3", fg: "#6d4a7c" },
  games: { bg: "#eef1fb", fg: "#4a5aa8" },
  streaming: { bg: "#fbeee6", fg: "#b0642e" },
  fun: { bg: "#fdf0f3", fg: "#b25c72" },
  guides: { bg: "#e6f1f2", fg: "#2f7a80" },
};

export const TAG_FALLBACK = { bg: "#f1ebe2", fg: "#6b6068" };
