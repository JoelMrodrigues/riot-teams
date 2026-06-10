/** Statut de plateforme — LOL-STATUS-V4 (sous-ensemble utile). */
export interface RiotStatusContent {
  locale: string;
  content: string;
}

export interface RiotStatusEntry {
  id: number;
  maintenance_status?: string | null;
  incident_severity?: string | null;
  titles: RiotStatusContent[];
  updates: { id: number; translations: RiotStatusContent[]; created_at: string }[];
  created_at: string;
}

export interface RiotPlatformStatus {
  id: string;
  name: string;
  maintenances: RiotStatusEntry[];
  incidents: RiotStatusEntry[];
}
