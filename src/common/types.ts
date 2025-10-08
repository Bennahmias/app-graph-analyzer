export interface GraphNode {
  id: string;              
  name: string;
  sensitive?: boolean;
  meta?: Record<string, any>;
}

export interface GraphEdge {
  from: string;  
  to: string;    
}
export interface Graph {
  graphId: string;       
  nodes: GraphNode[];     
  edges: GraphEdge[];     
}

export interface NodeAnalysisResult {
  reachable: boolean;
  paths?: string[][]; // All paths to sensitive nodes
  shortestPath?: string[];
  sensitiveNodesReached?: string[]; // Which sensitive nodes can be reached
  riskLevel?: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
}

export interface GraphAnalysisResult {
  graphId: string;
  summary: {
    totalNodes: number;
    sensitiveNodes: number;
    nodesWithAccess: number;
    highRiskNodes: number;
    totalPathsFound: number;
  };
  results: Record<string, NodeAnalysisResult>;
  riskMatrix?: {
    directAccess: string[]; // Nodes with 1-hop access
    indirectAccess: string[]; // Nodes with 2+ hop access
    noAccess: string[];
  };
}
