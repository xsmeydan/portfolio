export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  gitHubUrl: string | null;
  liveUrl: string | null;
  imageUrl: string;
}

export interface Experience {
  id: number;
  imageUrl?: string;
  position: string;
  company: string;
  description: string;
}

export interface ToolkitItem {
  name: string;
  icon: string;
}
