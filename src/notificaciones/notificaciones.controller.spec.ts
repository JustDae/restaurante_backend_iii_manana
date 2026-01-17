// src/notificaciones/notificaciones.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { NotificacionesController } from './notificaciones.controller';
import { NotificacionesService } from './notificaciones.service';

describe('NotificacionesController', () => {
  let controller: NotificacionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificacionesController],
      providers: [
        {
          provide: NotificacionesService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<NotificacionesController>(NotificacionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});