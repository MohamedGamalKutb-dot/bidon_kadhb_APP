import { UserModel } from "./../../DB/model/user.model.js";
import { NotfoundExeception } from "../../common/exceptions/error.exceptions.js";
import * as messageRepository from "../../common/repository/message.repository.js";
import * as userRepository from "../../common/repository/base.repository.js";

export const createMessage = async (
  { content, receiverId } = {},
  files = [],
  user = undefined,
) => {
  const chekReceiverExist = await userRepository.findById({
    model: UserModel,
    id: receiverId,
  });
  if (!chekReceiverExist) {
    throw NotfoundExeception("Invalid receiver Id");
  }
  const message = await messageRepository.createOne({
    date: {
      receiverId,
      content,
      attachments: files.map((ele) => ele.path),
      ...(user ? { senderId: user._id } : {}),
    },
  });
  return message;
};

export const getAllMesssages = async ({ type ,page ,limit} = {}, user) => {

  let filter = {};
  if (type == "0") {
    filter = { receiverId: user._id };
  } else if (type == "1") {
    filter = { senderId: user._id };
  } else {
    filter = {
      $or: [{ senderId: user._id }, { receiverId: user._id }],
    };
  }   

    const data =await messageRepository.paginate({
      filter,
      options:{
        sort:{ createdAt: -1 }
      }, //  دا عشان يرجع الاحدث للاقدم
      page,
      limit
    })

  return data;
};

export const getMessage = async ({messageId},user) => {
  
    const data =await messageRepository.findOne({
      filter:{receiverId:user._id, _id: messageId}
    })
    
    if (!data) {
      throw NotfoundExeception("Invalid  Message Id");
    }
  return data;
};
export const deleteMessage = async ({messageId},user) => {
  
    const data =await messageRepository.deleteOne({
  
      filter:{receiverId:user._id, _id: messageId}
    })
    
    if (!data.deletedCount) {
      throw NotfoundExeception("Invalid  MessageId");
    }
  return data;
};
