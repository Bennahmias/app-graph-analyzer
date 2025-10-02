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
