import { getTicketById, getTypeTickets } from '@/controllers/tickets-controller';
import { authenticateToken } from '@/middlewares';
import { Router } from 'express';


const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTypeTickets)
  .get('/', getTicketById)
  .post('/');

export { ticketsRouter };
