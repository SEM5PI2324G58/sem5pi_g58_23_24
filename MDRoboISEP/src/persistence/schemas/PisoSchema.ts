import { IPisoPersistence } from '../../dataschema/IPisoPersistence';
import mongoose from 'mongoose';

const PisoSchema = new mongoose.Schema(
  {
    domainId: { 
      type: Number,
      unique: true
    },

    numeroPiso: {
      type: Number,
      required: [true, 'Introduz o numero do piso'],
      index: true,
    },

    descricaoPiso: {
      type: String,
      index: true,
    },

    pontos: {
      type: [[Number]],
      required: [true, 'Introduz os pontos'],
      index: true,
    },

  },
  { timestamps: true },
);

export default mongoose.model<IPisoPersistence & mongoose.Document>('Piso', PisoSchema);
