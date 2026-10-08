export interface VaultHeading {
  title: string;
  id: string;
  level: number;
}
export interface VaultNote {
  id: string;
  path: string;
  route: string;
  title: string;
  aliases: string[];
  tags: string[];
  folder: string;
  excerpt: string;
  headings: VaultHeading[];
  historyId?: string;
  historyTheme?: string;
}
export interface VaultLink {
  source: string;
  target: string | null;
  anchor: string;
  reference: string;
  context: string;
  kind: "note" | "attachment";
  reason?: string | null;
  href?: string;
}
export interface VaultIndex {
  notes: VaultNote[];
  links: VaultLink[];
  attachments: { id: string; title: string; route: string }[];
}
export interface GraphSettings {
  query: string;
  orphans: boolean;
  tags: boolean;
  attachments: boolean;
  arrows: boolean;
  nodeSize: number;
  lineWidth: number;
  labelThreshold: number;
  center: number;
  repel: number;
  link: number;
  distance: number;
  groups: { query: string; color: string }[];
}
