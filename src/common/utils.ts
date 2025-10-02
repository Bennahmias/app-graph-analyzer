import { Graph } from './types';

export interface BFSResult {
  reachable: boolean;   
  path?: string[];      
}

/**
 * @param graph 
 * @param startId 
 * @param sensitiveNodes 
 * @param maxLen 
 */
export function bfs(
  graph: Graph,
  startId: string,
  sensitiveNodes: string[],
  maxLen = 6
): BFSResult {
  const queue: string[][] = [[startId]];
  const visited = new Set([startId]);

  while (queue.length > 0) {
    const path = queue.shift()!;
    const node = path[path.length - 1];

    
    if (sensitiveNodes.includes(node)) {
      return { reachable: true, path };
    }

    if (path.length > maxLen) continue;

    for (const edge of graph.edges) {
      if (edge.from === node && !visited.has(edge.to)) {
        visited.add(edge.to);
        queue.push([...path, edge.to]);
      }
    }
  }

  return { reachable: false };
}
