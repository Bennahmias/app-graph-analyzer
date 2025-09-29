import { Node, Edge } from '../../common/types';

export class CreateGraphDto {
  nodes: Node[];
  edges: Edge[];
}