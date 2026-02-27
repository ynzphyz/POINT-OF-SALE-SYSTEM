import { Table, FloorElement } from "./types";

const STORAGE_KEY = "restaurant-floor-plan";

export interface FloorPlanData {
  tables: Table[];
  elements: FloorElement[];
  floors: string[];
}

export function saveFloorPlan(data: FloorPlanData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save floor plan:", error);
  }
}

export function loadFloorPlan(): FloorPlanData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    
    // Convert date strings back to Date objects
    if (parsed.tables) {
      parsed.tables = parsed.tables.map((table: any) => ({
        ...table,
        seatedAt: table.seatedAt ? new Date(table.seatedAt) : undefined,
      }));
    }
    
    return parsed;
  } catch (error) {
    console.error("Failed to load floor plan:", error);
    return null;
  }
}

export function clearFloorPlan(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear floor plan:", error);
  }
}
