import { Injectable } from '@nestjs/common';
import { GraphsService } from '../graphs/graphs.service';
import { GraphAnalysisResult, NodeAnalysisResult } from '../common/types';
import { findAllPathsToSensitive } from '../common/utils';


@Injectable()
export class AnalysisService {

  constructor(private readonly graphsService: GraphsService) {}

  analyze(
    graphId: string, 
    maxPathLength: number = 6,
    includeAllPaths: boolean = true,
    calculateRiskLevels: boolean = true
  ): GraphAnalysisResult | { error: string } {
    const graph = this.graphsService.findOne(graphId);
    if (!graph) {
      return { error: 'Graph not found' };
    }

    const sensitiveNodes = graph.nodes
      .filter(node => node.sensitive)
      .map(node => node.id);

    const results: Record<string, NodeAnalysisResult> = {};
    let totalPathsFound = 0;
    let nodesWithAccess = 0;
    let highRiskNodes = 0;

    const directAccess: string[] = [];
    const indirectAccess: string[] = [];
    const noAccess: string[] = [];

    // Analyze each node
    for (const node of graph.nodes) {
      const pathResult = findAllPathsToSensitive(
        graph,
        node.id,
        sensitiveNodes,
        maxPathLength
      );

      // Determine risk level
      let riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE' = 'NONE';
      if (pathResult.reachable) {
        const shortestPathLength = pathResult.shortestPath?.length || 0;
        if (shortestPathLength === 1) {
          riskLevel = 'HIGH'; // Direct access to sensitive node
          directAccess.push(node.id);
        } else if (shortestPathLength <= 2) {
          riskLevel = 'MEDIUM'; // 1-2 hops
          indirectAccess.push(node.id);
        } else {
          riskLevel = 'LOW'; // 3+ hops
          indirectAccess.push(node.id);
        }
        nodesWithAccess++;
        if (riskLevel === 'HIGH') highRiskNodes++;
      } else {
        noAccess.push(node.id);
      }

      totalPathsFound += pathResult.paths?.length || 0;

      results[node.id] = {
        reachable: pathResult.reachable,
        paths: pathResult.paths,
        shortestPath: pathResult.shortestPath,
        sensitiveNodesReached: pathResult.allSensitiveNodesReached,
        riskLevel
      };
    }

    return {
      graphId,
      summary: {
        totalNodes: graph.nodes.length,
        sensitiveNodes: sensitiveNodes.length,
        nodesWithAccess,
        highRiskNodes,
        totalPathsFound
      },
      results,
      riskMatrix: {
        directAccess,
        indirectAccess,
        noAccess
      }
    };
  }
}
