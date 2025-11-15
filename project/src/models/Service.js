const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide service title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide service description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide service price'],
      min: 0,
    },
    durationMins: {
      type: Number,
      required: [true, 'Please provide service duration'],
      min: 15,
    },
    category: {
      type: String,
      required: [true, 'Please provide service category'],
      enum: [
        'Pain Management',
        'Sports Injury',
        'Post Surgery',
        'Elderly Care',
        'General Therapy',
        'Other',
      ],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);
