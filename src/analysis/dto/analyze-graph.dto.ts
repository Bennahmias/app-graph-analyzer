import { IsOptional, IsNumber, Min, Max } from 'class-validator';

export class AnalyzeGraphDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  maxPathLength?: number = 6;
}