import { Connection, connect, Channel, ConsumeMessage } from 'amqplib';
import signale from 'signale';

const connection = async () => {
    const conn: Connection = await connect(process.env.AMQP_URL!.toString()); 
    try {
        const queue = "initial";
        const channel: Channel = await conn.createChannel();
        await channel.assertQueue(queue, { durable: true });
        await channel.consume(queue, (msg) => onMessage(msg), { noAck: true });
        
        signale.success('Se ha consumido correctamente');
        

      } catch (error) {
        signale.fatal(new Error('Error al consumir la cola en RabbitMQ:'));
        return null;
      }
}

const onMessage = async (msg: ConsumeMessage | null): Promise<void> => {
    if (msg) {
        const contenido = msg.content.toString();
        signale.success("Se ha consumido el usuario: ", contenido);
        try {          
          await fetch('http://localhost:8001/user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: contenido
          });
      } catch (error: any) {
          signale.error(new Error("Error en el fetch"));
      }
    }
}

export default connection;