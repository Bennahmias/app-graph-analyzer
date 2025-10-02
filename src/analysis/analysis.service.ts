import { Injectable } from '@nestjs/common';
import { GraphsService } from '../graphs/graphs.service';
import { bfs } from '../common/utils';


@Injectable()
export class AnalysisService {

  constructor(private readonly graphsService: GraphsService) {}

  analyze(graphId: string, maxPathLength = 6) {
    const graph = this.graphsService.findOne(graphId);
    if (!graph) {
      return { error: 'Graph not found' };
    }

    const sensitiveNodes = graph.nodes.filter(n => n.sensitive).map(n => n.id);
    const results: Record<string, any> = {};
    let reachableCount = 0;

    for (const node of graph.nodes) {
      const result = bfs(graph, node.id, sensitiveNodes, maxPathLength);
      results[node.id] = result;
      if (result.reachable) reachableCount++;
    }

    const summary = {
      totalNodes: graph.nodes.length,
      sensitiveNodes: sensitiveNodes.length,
      reachableNodes: reachableCount,
    };

    return { graphId, summary, results };
  }
}
