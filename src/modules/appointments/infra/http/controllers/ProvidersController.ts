import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersService from '@modules/appointments/services/ListProvidesService';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const except_user_id = request.user.id;

    console.log('teste id ->',except_user_id);

    const listProviders = container.resolve(ListProvidersService);

    const providers = await listProviders.execute({ user_id: except_user_id });

    return response.status(200).json(providers);
  }
}