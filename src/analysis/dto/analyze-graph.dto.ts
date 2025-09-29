export class AnalyzeGraphDto {
  graphId: string;
  startNodeId?: string;
  endNodeId?: string;
  includeShortestPath?: boolean;
  includeConnectedComponents?: boolean;
  includeDiameter?: boolean;
}