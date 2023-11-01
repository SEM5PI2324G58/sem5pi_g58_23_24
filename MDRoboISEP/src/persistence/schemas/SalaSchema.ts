import mongoose from 'mongoose';
import { ISalaPersistence } from '../../dataschema/ISalaPersistence';

const SalaSchema = new mongoose.Schema(
    {
        domainID: {
            type: Number,
            unique: true
        },
        categoria: {
            type: String,
            required: [true, 'Introduz a categoria'],
            index: true,
        },
        descricao: {
            type: String,
            required: [true, 'Introduz a descricao'],
            index: true,
        },
        listaPontos: {
            type: [[Number]],
            required: [true, 'Introduz os pontos'],
            index: true,
        },
        
    },
    {
        timestamps: true,
        collection: 'sala',
    },
);

export default mongoose.model<ISalaPersistence & mongoose.Document>('Sala', SalaSchema);