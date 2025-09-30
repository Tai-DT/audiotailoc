export interface MCPServerConfig {
  name: string;
  version: string;
  capabilities: string[];
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface ProjectInfo {
  name: string;
  description: string;
  technologies: string[];
  lastUpdated: string;
}

export interface ServiceInfo {
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  url?: string;
  healthCheck?: string;
}