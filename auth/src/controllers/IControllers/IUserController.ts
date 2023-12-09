import { Request, Response, NextFunction } from 'express';

export default interface IUserController  {
login(req: Request, res: Response, next: NextFunction);
signup(req: Request, res: Response, next: NextFunction);
}