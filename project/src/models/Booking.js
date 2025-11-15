const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service ID is required'],
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      default: null,
    },
    selectedDate: {
      type: Date,
      required: [true, 'Please select a date'],
    },
    selectedTime: {
      type: String,
      required: [true, 'Please select a time'],
    },
    userAddress: {
      type: String,
      required: [true, 'Address is required'],
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    travelDistance: {
      type: Number,
      default: 0,
    },
    travelTime: {
      type: Number,
      default: 0,
    },
    travelCost: {
      type: Number,
      default: 0,
    },
    servicePrice: {
      type: Number,
      required: true,
    },
    finalBillAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'on-the-way', 'completed', 'cancelled'],
      default: 'pending',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
