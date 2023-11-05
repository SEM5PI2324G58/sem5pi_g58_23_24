import { Router } from 'express';
import auth from './routes/userRoute';
import user from './routes/userRoute';
import role from './routes/roleRoute';
import piso from './routes/pisoRoute'
import edificio from './routes/edificioRoute'
import elevador from './routes/elevadorRoute'
import tipoDispositivo from './routes/tipoDispositivoRoute'
import passagem from './routes/passagemRoute'
import dispositivo from './routes/dispositivoRoute'
import sala from './routes/salaRoute'
import ponto from './routes/pontoRoute'


export default () => {
	const app = Router();

	auth(app);
	user(app);
	role(app);
	piso(app);
	edificio(app);
	elevador(app);
	tipoDispositivo(app);
	passagem(app);
	dispositivo(app);
	sala(app);
	ponto(app);

	return app
}