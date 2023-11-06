import { IMapaPersistence } from '../../dataschema/IMapaPersistence';
import mongoose from 'mongoose';

const MapaSchema = new mongoose.Schema(
  {
    idMapa: { 
      type: Number,
      unique: true,
    },

    mapa: {
      type: [String],
      index: true,
    },

    idPassagem: {
      type: [Number],
      index: true,
    },

    abcissa: {
      type: [Number],
      index: true,
    },

    ordenada: {
        type: [Number],
        index: true,
    },
    
    orientacaoPassagem: {
        type: [String],
        index: true,
    },

    xCoord: {
        type: [Number],
        index: true,
    },

    yCoord: {
        type: [Number],
        index: true,
    },
    orientacaoElevador: {
        type: String,
        index: true,
    },
    nome: {
        type: [String],
        index: true,
    },
    abcissaA: {
        type: [Number],
        index: true,
    },
    ordenadaA: {
        type: [Number],
        index: true,
    },
    abcissaB: {
        type: [Number],
        index: true,
    },
    ordenadaB: {
        type: [Number],
        index: true,
    },
    abcissaPorta: {
        type: [Number],
        index: true,
    },
    ordenadaPorta: {
        type: [Number],
        index: true,
    },
    orientacaoPorta: {
        type: [String],
        index: true,
    },

  },
  { timestamps: true },
);

export default mongoose.model<IMapaPersistence & mongoose.Document>('Mapa', MapaSchema);