import { Container } from 'typedi';
import LoggerInstance from './logger';

export default ({ mongoConnection, schemas, controllers, repos, services}: {
                    mongoConnection;
                    schemas: { name: string; schema: any }[],
                    controllers: {name: string; path: string }[],
                    repos: {name: string; path: string }[],
                    services: {name: string; path: string }[] }) => {
  try {
    Container.set('logger', LoggerInstance);

    /**
     * We are injecting the mongoose models into the DI container.
     * This is controversial but it will provide a lot of flexibility 
     * at the time of writing unit tests.
     */
    console.log("cheguei aqui");
    schemas.forEach(m => {
      // Notice the require syntax and the '.default'
      let schema = require(m.schema).default;
      Container.set(m.name, schema);
    });
    console.log("cheguei aqui");
    repos.forEach(m => {
      let repoClass = require(m.path).default;
      let repoInstance = Container.get(repoClass);
      Container.set(m.name, repoInstance);
    });
    console.log("cheguei aqui");
    services.forEach(m => {
      let serviceClass = require(m.path).default;
      let serviceInstance = Container.get(serviceClass)
      Container.set(m.name, serviceInstance);
      });
    console.log("cheguei aqui");
    controllers.forEach(m => {
      // load the @Service() class by its path
      let controllerClass = require(m.path).default;
      // create/get the instance of the @Service() class
      let controllerInstance = Container.get(controllerClass);
      // rename the instance inside the container
      Container.set(m.name, controllerInstance);
    });
    console.log("cheguei aqui");
    return;
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
