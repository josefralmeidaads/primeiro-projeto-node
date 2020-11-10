import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentRepository from '../repositories/AppointmentsRepository';
import CreateApointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

appointmentsRouter.get('/', (request, response) => {
    const appointmentsRepository = getCustomRepository(AppointmentRepository);
    const appointments = appointmentsRepository.find();
    return response.json(appointments);
});

appointmentsRouter.post('/', async(request, response) => {
    try{
      const { provider, date } = request.body;

      const parsedDate = parseISO(date);

      const createApointmentService = new CreateApointmentService();

      const appointment = await createApointmentService.execute({ provider, date: parsedDate});
    
      return response.status(200).json(appointment);
    }catch(err){
      return response.status(400).json({ error: err.message });
    }
})

export default appointmentsRouter;