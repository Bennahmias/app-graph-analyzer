export interface Node {
  id: string;
  data?: any;
}

export interface Edge {
  from: string;
  to: string;
  weight?: number;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

export interface GraphAnalysisResult {
  nodeCount: number;
  edgeCount: number;
  shortestPath?: string[];
  connectedComponents?: string[][];
  diameter?: number;
}