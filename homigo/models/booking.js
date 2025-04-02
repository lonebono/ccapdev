import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  propertyId: {
    type: Schema.Types.ObjectId,
    ref: "Property",
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  guestCount: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["credit-card", "Cash"]
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;