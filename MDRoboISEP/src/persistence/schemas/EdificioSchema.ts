import { IEdificioPersistence } from '../../dataschema/IEdificioPersistence';
import {Piso} from '../../domain/piso/Piso';
import mongoose from 'mongoose';

const EdificioSchema = new mongoose.Schema(
  {
    codigo: { type: String, unique: true },
    nome: { type: String},
    descricao: { type: String},
    dimensaoX: { type: Number,
      index: true,
      required: [true, 'Introduz a dimensaoX do edificio'],},
    dimensaoY: { type: Number,
      index: true,
      required: [true, 'Introduz a dimensaoY do edificio'],
      },
    piso: { type: [Number], index : true},
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IEdificioPersistence & mongoose.Document>('Edificio', EdificioSchema);
