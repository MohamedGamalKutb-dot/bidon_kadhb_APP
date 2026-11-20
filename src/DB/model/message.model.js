import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
     content: {
      type: String,
      required: function(){return this.attachments.length > 0 ? false: true},
      minLength: 2,
      maxLength: 50000,
    },
    attachments:[String] ,
    senderId:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    receiverId:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true
    },
   
  },
  {
    timestamps: true,
    strict: true,
    autoIndex: true,
    strictQuery: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);




export const MessageModel =mongoose.models.message || mongoose.model("message", messageSchema);
