import { Test, TestingModule } from '@nestjs/testing';
import { GraphsController } from '../src/graphs/graphs.controller';
import { GraphsService } from '../src/graphs/graphs.service';

describe('GraphsController', () => {
  let controller: GraphsController;
  let service: GraphsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraphsController],
      providers: [GraphsService],
    }).compile();

    controller = module.get<GraphsController>(GraphsController);
    service = module.get<GraphsService>(GraphsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new graph', () => {
      const createGraphDto = {
        nodes: [{ id: 'A' }, { id: 'B' }],
        edges: [{ from: 'A', to: 'B' }]
      };

      const expectedResult = {
        id: 'generated-id',
        graph: createGraphDto
      };

      jest.spyOn(service, 'create').mockReturnValue(expectedResult);

      const result = controller.create(createGraphDto);
      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createGraphDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of graphs', () => {
      const expectedResult = [
        {
          id: 'graph-1',
          graph: {
            nodes: [{ id: 'A' }],
            edges: []
          }
        }
      ];

      jest.spyOn(service, 'findAll').mockReturnValue(expectedResult);

      const result = controller.findAll();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a specific graph', () => {
      const graphId = 'test-graph-1';
      const expectedGraph = {
        nodes: [{ id: 'A' }, { id: 'B' }],
        edges: [{ from: 'A', to: 'B' }]
      };

      jest.spyOn(service, 'findOne').mockReturnValue(expectedGraph);

      const result = controller.findOne(graphId);
      expect(result).toEqual({ id: graphId, graph: expectedGraph });
      expect(service.findOne).toHaveBeenCalledWith(graphId);
    });

    it('should throw exception for non-existent graph', () => {
      const graphId = 'non-existent';
      jest.spyOn(service, 'findOne').mockReturnValue(undefined);

      expect(() => controller.findOne(graphId)).toThrow();
    });
  });

  describe('update', () => {
    it('should update a graph', () => {
      const graphId = 'test-graph-1';
      const updateGraphDto = {
        nodes: [{ id: 'A' }, { id: 'B' }, { id: 'C' }],
        edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }]
      };

      jest.spyOn(service, 'update').mockReturnValue(updateGraphDto);

      const result = controller.update(graphId, updateGraphDto);
      expect(result).toEqual({ id: graphId, graph: updateGraphDto });
      expect(service.update).toHaveBeenCalledWith(graphId, updateGraphDto);
    });

    it('should throw exception for non-existent graph', () => {
      const graphId = 'non-existent';
      const updateGraphDto = {
        nodes: [{ id: 'A' }],
        edges: []
      };

      jest.spyOn(service, 'update').mockReturnValue(undefined);

      expect(() => controller.update(graphId, updateGraphDto)).toThrow();
    });
  });

  describe('remove', () => {
    it('should delete a graph', () => {
      const graphId = 'test-graph-1';
      jest.spyOn(service, 'remove').mockReturnValue(true);

      const result = controller.remove(graphId);
      expect(result).toEqual({ message: 'Graph deleted successfully' });
      expect(service.remove).toHaveBeenCalledWith(graphId);
    });

    it('should throw exception for non-existent graph', () => {
      const graphId = 'non-existent';
      jest.spyOn(service, 'remove').mockReturnValue(false);

      expect(() => controller.remove(graphId)).toThrow();
    });
  });
});