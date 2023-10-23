import { Router } from 'express';
import auth from './routes/userRoute';
import user from './routes/userRoute';
import role from './routes/roleRoute';
import piso from './routes/pisoRoute'
import edificio from './routes/edificioRoute'
import elevador from './routes/elevadorRoute'

export default () => {
	const app = Router();

	auth(app);
	user(app);
	role(app);
	piso(app);
	edificio(app);
	elevador(app);
	return app
}