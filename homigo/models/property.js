import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    lister: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pricepernight: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true, // Ensure an image URL is provided
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);

propertySchema.virtual('userData', {  
    localField: 'user',  
    foreignField: '_id',
    justOne: true
});

const Property =
  mongoose.models.Property ||
  mongoose.model("Property", propertySchema);

export default Property;
