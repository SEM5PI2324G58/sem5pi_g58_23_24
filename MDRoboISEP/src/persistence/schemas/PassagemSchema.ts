import { IPassagemPersistence } from '../../dataschema/IPassagemPersistence';
import mongoose from 'mongoose';

const PassagemSchema = new mongoose.Schema(
    // Schema to be used to persist the data of a Passagem
);

export default mongoose.model<IPassagemPersistence & mongoose.Document>('Passagem', PassagemSchema);