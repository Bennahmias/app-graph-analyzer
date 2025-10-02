import { IsArray, IsString } from 'class-validator';

export class CreateGraphDto {
  @IsString()
  graphId: string;

  @IsArray()
  nodes: { id: string; name: string; sensitive?: boolean }[];

  @IsArray()
  edges: { from: string; to: string }[];
}
