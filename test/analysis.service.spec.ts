import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisService } from '../src/analysis/analysis.service';
import { GraphsService } from '../src/graphs/graphs.service';
import { Graph } from '../src/common/types';

describe('AnalysisService', () => {
  let service: AnalysisService;
  let graphsService: GraphsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalysisService, GraphsService],
    }).compile();

    service = module.get<AnalysisService>(AnalysisService);
    graphsService = module.get<GraphsService>(GraphsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('analyze', () => {
    it('should analyze a basic graph', () => {
      // Create a test graph
      const testGraph: Graph = {
        nodes: [
          { id: 'A' },
          { id: 'B' },
          { id: 'C' }
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' }
        ]
      };

      // Mock the graphs service
      jest.spyOn(graphsService, 'findOne').mockReturnValue(testGraph);

      const result = service.analyze({
        graphId: 'test-graph-1',
        includeShortestPath: true,
        startNodeId: 'A',
        endNodeId: 'C',
        includeConnectedComponents: true,
        includeDiameter: true
      });

      expect(result.nodeCount).toBe(3);
      expect(result.edgeCount).toBe(2);
      expect(result.shortestPath).toEqual(['A', 'B', 'C']);
      expect(result.connectedComponents).toHaveLength(1);
      expect(result.diameter).toBe(2);
    });

    it('should throw error for non-existent graph', () => {
      jest.spyOn(graphsService, 'findOne').mockReturnValue(undefined);

      expect(() => {
        service.analyze({
          graphId: 'non-existent',
          includeShortestPath: false,
          includeConnectedComponents: false,
          includeDiameter: false
        });
      }).toThrow('Graph not found');
    });
  });

  describe('getShortestPath', () => {
    it('should return shortest path between two nodes', () => {
      const testGraph: Graph = {
        nodes: [
          { id: 'A' },
          { id: 'B' },
          { id: 'C' },
          { id: 'D' }
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
          { from: 'A', to: 'D' },
          { from: 'D', to: 'C' }
        ]
      };

      jest.spyOn(graphsService, 'findOne').mockReturnValue(testGraph);

      const path = service.getShortestPath('test-graph', 'A', 'C');
      expect(path).toEqual(['A', 'B', 'C']);
    });

    it('should return empty array for disconnected nodes', () => {
      const testGraph: Graph = {
        nodes: [
          { id: 'A' },
          { id: 'B' }
        ],
        edges: []
      };

      jest.spyOn(graphsService, 'findOne').mockReturnValue(testGraph);

      const path = service.getShortestPath('test-graph', 'A', 'B');
      expect(path).toEqual([]);
    });
  });

  describe('getConnectedComponents', () => {
    it('should find connected components correctly', () => {
      const testGraph: Graph = {
        nodes: [
          { id: 'A' },
          { id: 'B' },
          { id: 'C' },
          { id: 'D' }
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'C', to: 'D' }
        ]
      };

      jest.spyOn(graphsService, 'findOne').mockReturnValue(testGraph);

      const components = service.getConnectedComponents('test-graph');
      expect(components).toHaveLength(2);
      expect(components.some(component => component.includes('A') && component.includes('B'))).toBe(true);
      expect(components.some(component => component.includes('C') && component.includes('D'))).toBe(true);
    });
  });

  describe('getDiameter', () => {
    it('should calculate diameter correctly', () => {
      const testGraph: Graph = {
        nodes: [
          { id: 'A' },
          { id: 'B' },
          { id: 'C' }
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' }
        ]
      };

      jest.spyOn(graphsService, 'findOne').mockReturnValue(testGraph);

      const diameter = service.getDiameter('test-graph');
      expect(diameter).toBe(2);
    });
  });
});