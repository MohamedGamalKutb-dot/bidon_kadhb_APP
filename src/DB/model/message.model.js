import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          if (value !== value.toUpperCase()) {
            return true;
          }
          return false;
        },
        message: function (prop) {
          return `Title must not be entirely uppercase ${prop.value}  `;
        },
      },
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  {
    timestamps: true,
    strict: false,
    autoIndex: true,
    strictQuery: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    optimisticConcurrency: true,
  },
);

export const messageModel = mongoose.models.Message || mongoose.model("Message", messageSchema);
