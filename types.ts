export interface AITool {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  icon: string;
  logoUrl?: string;
}

export interface ToolFolder {
  id: string;
  name: string;
  tools: AITool[];
}

export enum LayoutSection {
  HERO = 'HERO',
  FOLDER = 'FOLDER'
}