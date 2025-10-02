import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GraphsService } from './graphs.service';
import { CreateGraphDto } from './dto/create-graph.dto';

@Controller('graphs')
export class GraphsController {
  constructor(private readonly graphsService: GraphsService) {}

  // POST /graphs
  @Post()
  create(@Body() dto: CreateGraphDto) {
    return this.graphsService.create(dto);
  }

  // GET /graphs
  @Get()
  findAll() {
    return this.graphsService.findAll();
  }

  // GET /graphs/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.graphsService.findOne(id);
  }
}
