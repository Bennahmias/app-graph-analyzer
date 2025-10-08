import { Graph } from './types';

export interface PathResult {
  reachable: boolean;
  paths?: string[][]; // Multiple paths instead of single path
  shortestPath?: string[];
  allSensitiveNodesReached?: string[];
}

export function findAllPathsToSensitive(
  graph: Graph, 
  startNode: string, 
  sensitiveNodes: string[], 
  maxLength: number = 6
): PathResult {
  const allPaths: string[][] = [];
  const sensitiveNodesReached = new Set<string>();

  function dfs(current: string, path: string[], visited: Set<string>, depth: number) {
    if (depth > maxLength) return;

    // If we reached a sensitive node, save this path
    if (sensitiveNodes.includes(current)) {
      allPaths.push([...path, current]);
      sensitiveNodesReached.add(current);
      return; // Don't continue from sensitive nodes
    }

    // Get neighbors
    const neighbors = graph.edges
      .filter(edge => edge.from === current)
      .map(edge => edge.to)
      .filter(neighbor => !visited.has(neighbor));

    // Explore each neighbor
    for (const neighbor of neighbors) {
      const newVisited = new Set(visited);
      newVisited.add(current);
      dfs(neighbor, [...path, current], newVisited, depth + 1);
    }
  }

  dfs(startNode, [], new Set(), 0);

  const shortestPath = allPaths.length > 0 
    ? allPaths.reduce((shortest, current) => 
        current.length < shortest.length ? current : shortest
      ) 
    : undefined;

  return {
    reachable: allPaths.length > 0,
    paths: allPaths,
    shortestPath,
    allSensitiveNodesReached: Array.from(sensitiveNodesReached)
  };
}
