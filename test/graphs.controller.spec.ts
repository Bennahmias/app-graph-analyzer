import { Test, TestingModule } from '@nestjs/testing';
import { GraphsController } from '../src/graphs/graphs.controller';
import { GraphsService } from '../src/graphs/graphs.service';
import { CreateGraphDto } from '../src/graphs/dto/create-graph.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { bfs } from '../src/common/utils';
import { Graph } from '../src/common/types';

describe('GraphsController', () => {
  let controller: GraphsController;
  let service: GraphsService;

  const mockCreateGraphDto: CreateGraphDto = {
    graphId: 'test-graph',
    nodes: [
      { id: 'node1', name: 'Node 1', sensitive: false },
      { id: 'node2', name: 'Node 2', sensitive: true },
    ],
    edges: [
      { from: 'node1', to: 'node2' },
    ],
  };

  const mockGraphsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraphsController],
      providers: [
        {
          provide: GraphsService,
          useValue: mockGraphsService,
        },
      ],
    }).compile();

    controller = module.get<GraphsController>(GraphsController);
    service = module.get<GraphsService>(GraphsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new graph', () => {
      const expectedResult = { message: 'Graph created', graphId: 'test-graph' };
      mockGraphsService.create.mockReturnValue(expectedResult);

      const result = controller.create(mockCreateGraphDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(mockCreateGraphDto);
    });

    it('should throw exception when graph already exists', () => {
      const httpException = new HttpException(
        'Graph with ID test-graph already exists',
        HttpStatus.BAD_REQUEST,
      );
      mockGraphsService.create.mockImplementation(() => {
        throw httpException;
      });

      expect(() => controller.create(mockCreateGraphDto)).toThrow(httpException);
      expect(service.create).toHaveBeenCalledWith(mockCreateGraphDto);
    });
  });

  describe('findAll', () => {
    it('should return all graphs', () => {
      const expectedGraphs = [mockCreateGraphDto];
      mockGraphsService.findAll.mockReturnValue(expectedGraphs);

      const result = controller.findAll();

      expect(result).toEqual(expectedGraphs);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no graphs exist', () => {
      mockGraphsService.findAll.mockReturnValue([]);

      const result = controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a specific graph', () => {
      mockGraphsService.findOne.mockReturnValue(mockCreateGraphDto);

      const result = controller.findOne('test-graph');

      expect(result).toEqual(mockCreateGraphDto);
      expect(service.findOne).toHaveBeenCalledWith('test-graph');
    });

    it('should return undefined when graph not found', () => {
      mockGraphsService.findOne.mockReturnValue(undefined);

      const result = controller.findOne('non-existent-graph');

      expect(result).toBeUndefined();
      expect(service.findOne).toHaveBeenCalledWith('non-existent-graph');
    });
  });

  describe('Utils', () => {
    describe('bfs', () => {
      const mockGraph: Graph = {
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

      it('should find direct path to sensitive node', () => {
        const result = bfs(mockGraph, 'node1', ['node2'], 6);

        expect(result.reachable).toBe(true);
        expect(result.path).toEqual(['node1', 'node2']);
      });

      it('should find path to sensitive node through multiple hops', () => {
        const result = bfs(mockGraph, 'node1', ['node4'], 6);

        expect(result.reachable).toBe(true);
        expect(result.path).toEqual(['node1', 'node2', 'node3', 'node4']);
      });

      it('should return false when no path exists', () => {
        const disconnectedGraph: Graph = {
          ...mockGraph,
          edges: [{ from: 'node1', to: 'node2' }], // node3 and node4 disconnected
        };

        const result = bfs(disconnectedGraph, 'node1', ['node4'], 6);

        expect(result.reachable).toBe(false);
        expect(result.path).toBeUndefined();
      });

      it('should respect maxLength parameter', () => {
        const result = bfs(mockGraph, 'node1', ['node4'], 2);

        expect(result.reachable).toBe(false);
        expect(result.path).toBeUndefined();
      });

      it('should return true if start node is sensitive', () => {
        const result = bfs(mockGraph, 'node2', ['node2'], 6);

        expect(result.reachable).toBe(true);
        expect(result.path).toEqual(['node2']);
      });

      it('should handle empty sensitive nodes array', () => {
        const result = bfs(mockGraph, 'node1', [], 6);

        expect(result.reachable).toBe(false);
        expect(result.path).toBeUndefined();
      });
    });
  });
});