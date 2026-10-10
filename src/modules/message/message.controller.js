import { Router } from "express";
import { successResponse } from '../../common/utils/response.utils.js'
import { aggregate, allUpdateNote, create, deleteall, deleteNotes, gitByIdNotes, noteByUserByEmail, replaceNote, retrievetLimit, updateNote } from "./message.service.js";

const router = Router();

router.post("/notes", async (req, res,next) => {
  const data = await create(req.body );
  return successResponse({ res, status: 201, data });
});
router.patch("/notes/all",async(req,res,next)=>{
    const data= await allUpdateNote(req.query,req.body);
    return successResponse({ res, status: 201, data });
})


router.patch("/notes/:notesId", async (req, res,next) => {
    const data = await updateNote(req.params,req.body);
    return successResponse({ res, status: 201, data });
});

router.put("/notes/replace/:noteId",async(req,res,next)=>{
    const data= await replaceNote(req.params,req.body);
    return successResponse({ res, status: 201, data });
})



router.delete("/notes", async (req, res,next) => {
    const data = await deleteall(req.query);
    return successResponse({ res, status: 201, data });
});
router.delete("/notes/:notesId", async (req, res,next) => {
    const data = await deleteNotes(req.params);
    return successResponse({ res, status: 201, data });
});

router.get("/notes/paginate-sort", async (req, res,next) => {
    const data = await retrievetLimit(req.query);
    return successResponse({ res, status: 201, data });
});
router.get("/notes/note-with-user", async (req, res,next) => {
    const data = await noteByUserByEmail(req.query);
    return successResponse({ res, status: 201, data });
});

router.get("/notes/aggregate", async (req, res,next) => {
    const data = await aggregate(req.query);
    return successResponse({ res, status: 201, data });
});

router.get("/notes/:noteId", async (req, res,next) => {
    const data = await gitByIdNotes(req.params);
    return successResponse({ res, status: 201, data });
});



router.get("/user", async (req, res,next) => {
    const {id}=req.query;
  const data = await getUser(id);
  return successResponse({ res, status: 201, data });
});


export default router;