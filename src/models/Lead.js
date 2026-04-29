import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
  name:             { type: String, required: true },
  email:            { type: String, required: true },
  phone:            { type: String },
  propertyInterest: { type: String },
  budget:           { type: Number, required: true },
  source:           { type: String, enum: ['Facebook Ad', 'Walk-in', 'Website Inquiry'] },
  status:           { type: String, enum: ['New', 'Contacted', 'In Progress', 'Closed'], default: 'New' },
  score:            { type: String, enum: ['High', 'Medium', 'Low'], default: 'Low' },
  notes:            { type: String },
  assignedTo:       { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: false },
  followUpDate:     { type: Date },
  lastActivityAt: { type: Date, default: Date.now },

}, { timestamps: true });

// Fires on .save() and .create()
LeadSchema.pre('save', async function() {
  if (this.budget >= 20000000)       this.score = 'High';
  else if (this.budget >= 10000000)  this.score = 'Medium';
  else                               this.score = 'Low';
});
// Fires on .findByIdAndUpdate()
LeadSchema.pre('findOneAndUpdate', async function() {
  const budget = this.getUpdate()?.budget ?? this.getUpdate()?.$set?.budget;
  if (budget !== undefined) {
    this.setUpdate({
      ...this.getUpdate(),
      score: budget >= 20000000 ? 'High' : budget >= 10000000 ? 'Medium' : 'Low',
    });
  }
});

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);