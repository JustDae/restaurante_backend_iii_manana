import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class NotificacionesGateway {
  @WebSocketServer()
  server: Server; 

  enviarNotificacion(data: any) {
    if (this.server) {
      this.server.emit('notificacion_recibida', data);
      console.log('Notificación emitida al socket con éxito');
    } else {
      console.error('Error: El servidor de Socket.io no se ha inicializado');
    }
  }
}