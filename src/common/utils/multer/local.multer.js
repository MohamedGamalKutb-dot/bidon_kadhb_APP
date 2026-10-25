import multer from "multer";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import {  mkdir, writeFile } from "node:fs/promises";
import { fileTypeFromBuffer } from "file-type";
import { BadExeception } from "../../exceptions/index.js";
export const fileValidation = {
  image: ["image/jpeg", "image/png", "image/gif"],
  file: ["application/pdf", "application/json"],
};
export const localFileUpload = ({ maxFileSize = 5 } = {}) => {
  const storage = multer.memoryStorage();
  return multer({ storage,limits: { fieldSize: maxFileSize * 1024 * 1024 },});
};


export const processFile = async ({customPath ="general" ,file, validation = [] }) => {
  
    const result = await fileTypeFromBuffer(file.buffer);
     
    console.log({result});    
    if (!result || !validation.includes(result.mime)) {
      throw BadExeception("Invalid File formats")
    } else {
      await mkdir(resolve(`./assets/${customPath}`), { recursive: true });
      const uniqueFilePath=`assets/${customPath}/${randomUUID()}.${result.ext}`;
      console.log({uniqueFilePath});
      await writeFile(resolve(`./${uniqueFilePath}`), file.buffer);
      file.finalPath= uniqueFilePath
      return file 
    }

  };

  export const processFiles = async ({customPath , files=[], validation = [] }) => {
  const assets=[]
  for (const file of files) {
    const uploadFile = await processFile({customPath ,file ,validation})
    assets.push(uploadFile)
  }
  return assets
};
  export const processFields = async ({customPath ,fields={}, validation = [] }) => {
  const assets=[]
  for (const filed of Object.keys(fields)) {
    console.log({filed});
    
    const uploadFile = await processFiles({customPath , files:fields[filed], validation})
    assets.push({filed ,uploadFile})
  }
  return assets
};

export const processMulterUpload = async  ({req ,customPath ="general" , validation = [] }) => {  
    if (req.file) {
      await processFile({customPath ,file:req.file, validation})
    }
    else if (Array.isArray(req.files) ) {
      await processFiles({customPath , files:req.files, validation})
    }
    else if (typeof req.files === "object" && Object.keys(req.files)?.length ) {
      await processFields({customPath ,fields: req.files, validation})
    }
  
      
    }

  


