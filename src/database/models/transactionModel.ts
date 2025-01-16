import mongoose from "mongoose";

const { Schema, model } = mongoose;

const transactionSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true, // Mongoose equivalent of hashKey for indexing
    },
    transactionId: {
      type: String,
      required: true,
      unique: true, // Ensures transactionId is unique, similar to rangeKey
    },
    dateTime: {
      type: Date,
      required: true,
      default: Date.now, // Defaults to the current date and time
    },
    courseId: {
      type: String,
      required: true,
      index: true, // Creates an index for querying course transactions
    },
    paymentProvider: {
      type: String,
      enum: ["stripe"],
      required: true,
    },
    amount: {
      type: Number,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

const Transaction = model("Transaction", transactionSchema);
export default Transaction;
