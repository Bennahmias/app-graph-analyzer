import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisService } from '../src/analysis/analysis.service';
import { GraphsService } from '../src/graphs/graphs.service';
import { CreateGraphDto } from '../src/graphs/dto/create-graph.dto';

describe('AnalysisService', () => {
  let service: AnalysisService;
  let graphsService: GraphsService;

  const mockGraph: CreateGraphDto = {
    graphId: 'test-graph',
    nodes: [
      { id: 'node1', name: 'Node 1', sensitive: false },
      { id: 'node2', name: 'Node 2', sensitive: true },
      { id: 'node3', name: 'Node 3', sensitive: false },
      { id: 'node4', name: 'Node 4', sensitive: true },
    ],
    edges: [
      { from: 'node1', to: 'node2' },
      { from: 'node2', to: 'node3' },
      { from: 'node3', to: 'node4' },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalysisService,
        {
          provide: GraphsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AnalysisService>(AnalysisService);
    graphsService = module.get<GraphsService>(GraphsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('analyze', () => {
    it('should return error when graph not found', () => {
      jest.spyOn(graphsService, 'findOne').mockReturnValue(undefined);

      const result = service.analyze('non-existent-graph');

      expect(result).toEqual({ error: 'Graph not found' });
      expect(graphsService.findOne).toHaveBeenCalledWith('non-existent-graph');
    });

    it('should analyze graph and return results', () => {
      jest.spyOn(graphsService, 'findOne').mockReturnValue(mockGraph);

      const result = service.analyze('test-graph', 6);

      expect(result.graphId).toBe('test-graph');
      expect(result.summary).toEqual({
        totalNodes: 4,
        sensitiveNodes: 2,
        reachableNodes: expect.any(Number),
      });
      expect(result.results).toHaveProperty('node1');
      expect(result.results).toHaveProperty('node2');
      expect(result.results).toHaveProperty('node3');
      expect(result.results).toHaveProperty('node4');
    });

    it('should respect maxPathLength parameter', () => {
      jest.spyOn(graphsService, 'findOne').mockReturnValue(mockGraph);

      const result = service.analyze('test-graph', 1);

      expect(result.graphId).toBe('test-graph');
      expect(result.summary.totalNodes).toBe(4);
    });

    it('should identify reachable sensitive nodes', () => {
      jest.spyOn(graphsService, 'findOne').mockReturnValue(mockGraph);

      const result = service.analyze('test-graph');

      // node1 can reach node2 (sensitive) in 1 step
      expect(result.results['node1'].reachable).toBe(true);
      expect(result.results['node1'].path).toEqual(['node1', 'node2']);

      // node2 is already sensitive
      expect(result.results['node2'].reachable).toBe(true);
      expect(result.results['node2'].path).toEqual(['node2']);
    });

    it('should handle disconnected graphs', () => {
      const disconnectedGraph: CreateGraphDto = {
        graphId: 'disconnected-graph',
        nodes: [
          { id: 'node1', name: 'Node 1', sensitive: false },
          { id: 'node2', name: 'Node 2', sensitive: true },
        ],
        edges: [], // No edges
      };

      jest.spyOn(graphsService, 'findOne').mockReturnValue(disconnectedGraph);

      const result = service.analyze('disconnected-graph');

      // node1 cannot reach node2 (no path)
      expect(result.results['node1'].reachable).toBe(false);
      expect(result.results['node1'].path).toBeUndefined();

      // node2 is sensitive itself
      expect(result.results['node2'].reachable).toBe(true);
      expect(result.results['node2'].path).toEqual(['node2']);
    });
  });
});