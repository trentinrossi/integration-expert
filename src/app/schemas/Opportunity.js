import mongoose from 'mongoose';

const OpportunitySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
    },
    add_time: {
      type: Date,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Opportunity', OpportunitySchema);
