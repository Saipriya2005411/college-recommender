const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  collegeName: { type: String, required: true },
  shortName: { type: String },
  state: { type: String, required: true },
  city: { type: String },
  type: { type: String, enum: ['Government', 'Private', 'Deemed', 'Autonomous'], default: 'Private' },
  tier: { type: String, enum: ['Tier 1', 'Tier 2', 'Tier 3'], default: 'Tier 2' },
  ranking: { type: Number },
  nirfRanking: { type: Number },
  accreditation: { type: String, default: 'NAAC A' },
  description: { type: String },
  imageURL: { type: String, default: '' },
  website: { type: String },
  established: { type: Number },

  courses: [{
    name: String,
    code: String,
    seats: Number,
    duration: String,
    fees: { tuition: Number, hostel: Number, other: Number },
    cutoff: {
      general: Number,
      obc: Number,
      sc: Number,
      st: Number,
      ews: Number
    },
    examAccepted: [String]
  }],

  placements: {
    percentage: { type: Number, default: 0 },
    avgPackage: { type: Number, default: 0 },
    highestPackage: { type: Number, default: 0 },
    topRecruiters: [String]
  },

  facilities: {
    hostel: { type: Boolean, default: false },
    labs: { type: Boolean, default: false },
    library: { type: Boolean, default: false },
    sports: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    cafeteria: { type: Boolean, default: false }
  },

  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    date: { type: Date, default: Date.now }
  }],

  avgRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },

  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

collegeSchema.index({ state: 1, tier: 1 });
collegeSchema.index({ collegeName: 'text', city: 'text', state: 'text' });

module.exports = mongoose.model('College', collegeSchema);
