import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port : optional change to 4000 by JRT
   */
  port: parseInt(process.env.PORT, 10) || 4000, 

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI || "mongodb+srv://Admin:1234@sem5pi-g58-2324.iswl0yf.mongodb.net/?retryWrites=true&w=majority",

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || "my sakdfho2390asjod$%jl)!sdjas0i secret",

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  controllers: {
    edificio: {
      name: "EdificioController",
      path: "../controllers/EdificioController"
    },
    role: {
      name: "RoleController",
      path: "../controllers/roleController"
    },
    piso: {
      name: "PisoController",
      path: "../controllers/PisoController"
    },
    elevador: {
      name: "ElevadorController",
      path: "../controllers/ElevadorController"
    },
    tipoDispositivo: {
      name: "TipoDispositivoController",
      path: "../controllers/TipoDispositivoController"
    },
    passagem: {
      name: "PassagemController",
      path: "../controllers/CriarPassagemController"
    },
    dispositivo: {
      name: "DispositivoController",
      path: "../controllers/DispositivoController"
    },
  },

  repos: {
    role: {
      name: "RoleRepo",
      path: "../repos/roleRepo"
    },
    user: {
      name: "UserRepo",
      path: "../repos/userRepo"
    },
    edificio: {
      name: "EdificioRepo",
      path: "../repos/EdificioRepo"
    },
    piso: {
      name: "PisoRepo",
      path: "../repos/PisoRepo"
    },
    ponto: {
      name: "PontoRepo",
      path: "../repos/PontoRepo"
    },
    elevador: {
      name: "ElevadorRepo",
      path: "../repos/ElevadorRepo"
    },
    tipoDispositivo: {
      name: "TipoDispositivoRepo",
      path: "../repos/TipoDispositivoRepo"
    },
    passagem: {
      name: "PassagemRepo",
      path: "../repos/PassagemRepo"
    },
    dispositivo: {
      name: "DispositivoRepo",
      path: "../repos/DispositivoRepo"
    },
  },

  services: {
    edificio: {
      name: "EdificioService",
      path: "../services/EdificioService"
    },
    role: {
      name: "RoleService",
      path: "../services/roleService"
    },
    piso: {
      name: "PisoService",
      path: "../services/PisoService"
    },
    elevador: {
      name: "ElevadorService",
      path: "../services/ElevadorService"
    },
    tipoDispositivo: {
      name: "TipoDispositivoService",
      path: "../services/TipoDispositivoService"
    },
    passagem: {
      name: "PassagemService",
      path: "../services/CriarPassagemService"
    },
    dispositivo: {
      name: "DispositivoService",
      path: "../services/DispositivoService"
    },
  },
};
