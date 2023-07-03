import { io } from 'socket.io-client';
import ENVIRONMENT_CONFIG from './env';

// @ts-ignore
const socketIO = io(ENVIRONMENT_CONFIG.wss, {});
socketIO.on('connect', () => {
  console.log('Connected to server');
});

socketIO.on('disconnect', () => {
  console.log('Disconnected from server');
});

export default socketIO;
