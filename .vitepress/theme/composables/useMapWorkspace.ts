import type { InjectionKey } from "vue";
import type { VaultNote } from "../../vault/types";

export interface MapViewState {
  year: number | null;
  showRegions: boolean;
  showSettlements: boolean;
  variants: Record<string, string>;
}

export const mapWorkspaceKey: InjectionKey<(note: VaultNote, view: MapViewState) => void> = Symbol("vault-map-workspace");
