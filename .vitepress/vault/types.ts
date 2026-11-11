export interface VaultHeading {
  title: string;
  id: string;
  level: number;
}
export interface GeoSource {
  title: string;
  url: string;
}
export interface GeoVariant {
  id: string;
  name: string;
  from?: number;
  to?: number;
  snapshotYear?: number;
  coordinates?: [number, number];
  geometry?: string;
  labelCoordinates?: [number, number];
  accuracy: string;
  source: GeoSource;
}
export interface GeoPlace {
  id: string;
  kind: "point" | "region" | "polity";
  modernName: string;
  variants: GeoVariant[];
}
export interface GeoReference {
  target: string | null;
  place?: string;
  name?: string;
  reference: string;
  variant?: string;
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
  historyPeriod?: string;
  historyTrack?: string;
  geo?: {
    scope?: string;
    period?: string;
    time?: { from: number; to: number };
    place?: GeoPlace;
    places?: ({ target: string; place?: never; variant?: string; name?: string } | { place: string; target?: never; variant?: string; name?: string })[];
    excludePlaces?: string[];
    locationNote?: string;
    bindingStatus?: "bound" | "uncertain";
  };
  geoReferences?: GeoReference[];
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
