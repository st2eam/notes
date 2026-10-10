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
  originalPath?: string;
  primaryCategory: string | null;
  categories: { path: string; reason: string }[];
  classificationStatus: "confirmed" | "provisional" | "unclassified";
  categoryOverview?: string;
  categoryContext?: string;
  historyId?: string;
  historyDate?: string;
  historyOrder?: number;
  historyGroup?: string;
  historyTheme?: string;
}
export interface VaultLink {
  source: string;
  target: string | null;
  anchor: string;
  reference: string;
  context: string;
  kind: "note" | "attachment";
  relationType?: "citation" | "similar" | "subordinate" | "causal";
  label?: string;
  status?: "confirmed" | "inferred";
  explanation?: string;
  evidence?: string;
  directed?: boolean;
  structured?: boolean;
  reason?: string | null;
  href?: string;
}
export interface VaultIndex {
  categories: {
    id: string;
    title: string;
    parent: string | null;
    noteId: string;
  }[];
  notes: VaultNote[];
  links: VaultLink[];
  attachments: { id: string; title: string; route: string }[];
}
export interface GraphSettings {
  query: string;
  category: string;
  relationTypes: string[];
  relationStatus: "all" | "confirmed" | "inferred";
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
