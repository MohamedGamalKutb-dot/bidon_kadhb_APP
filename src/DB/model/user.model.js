import mongoose from "mongoose";
import { GenderEnum } from "../../common/enum/index.js";
import { ProviderEnum, RoleEnum } from "../../common/enum/user.enum.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 25,
      required: true
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 25,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: function() {  
        return this.provider==ProviderEnum.SYSTEM
      }
    },
    phone: {
      type: String,
      required: function() {  
        return this.provider==ProviderEnum.SYSTEM
      },
      minLength: 11
    },
    DOB: Date,
    confirmEmailAt: Date,
    image: String,
    caverImage: [String],
    gender: {
      type: Number,
      enum: Object.values(GenderEnum),
      default: GenderEnum.MALE
    },
    role:{
      type: Number,
      enum: Object.values(RoleEnum),
      default: RoleEnum.USER
    },
    provider:{
      type: Number,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.SYSTEM
    },
    changeCredentialsTime: Date
  },
  {
    timestamps: true,
    strict: true,
    autoIndex: true,
    strictQuery: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    optimisticConcurrency: true,
  },
);
userSchema.virtual("username").set(function(value){
    const [firstName, lastName] = value?.split(" ") || [];
    this.set({ firstName, lastName });
  }).get(function(){
    return `${this.firstName} ${this.lastName}`;
  });


export const UserModel =mongoose.models.User || mongoose.model("User", userSchema);
