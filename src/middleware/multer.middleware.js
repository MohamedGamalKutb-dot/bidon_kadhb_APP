import { BadExeception } from "../common/exceptions/error.exceptions.js";
import { processMulterUpload } from "../common/utils/multer/local.multer.js";

export const UploadMiddleware =  ({isRquired= true ,multerMiddleware ,customPath ="general" , validation = [] }) => {
  return  (req, res, next) => {
   
      multerMiddleware  (req, res, async (error) => {
        if (error) {
           next(new Error(error.message, { cause: { status: 400 } }));
           return;
          }
          
          try {
            if (
                 isRquired &&
                (!req.file &&
                 !(Array.isArray(req.files) &&req.files.length) &&
                 !(typeof req.files === "object" && Object.keys(req.files)?.length))) {
              next(BadExeception("file is required"))
              return;
            }  

            await processMulterUpload({customPath , validation ,req })
            next()
            
          } catch (error) {
            next(new Error(error.message, { cause: { status: 400 } }));

          }
        })
     
  };

  }

