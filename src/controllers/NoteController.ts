import type { Request, Response} from 'express';
import Note, { INote} from '../models/Note';
import { Types } from 'mongoose';

type NoteParams = {
    noteId: Types.ObjectId
}

export class NoteController {
    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        console.log(req.body);
        const { content } = req.body;

        const note = new Note()
        note.content = content;
        note.createdBy = req.user._id; // Assuming you have the authenticated user's ID in req.user._id
        note.task = req.task._id; // Assuming the task ID is in the route parameters

        req.task.notes.push(note._id);

        try {
            await Promise.allSettled([req.task.save(), note.save()])
            res.send('Note created successfully')
        } catch (error) {
            res.status(500).json({ error: 'Failed to create note' })
        }
    }

    static getTaskNotes = async (req: Request, res: Response) => {
        try {
            const notes = await Note.findById({ task: req.task._id });
            res.json(notes);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch notes' });
        }
    }

    static deleteNote = async (req: Request<NoteParams>, res: Response) => {
        const { noteId } = req.params;
        const note = await Note.findById(noteId)
        if (!note) {
            const error = new Error('Note not found');
            return res.status(404).json({ error: error.message });
        }

        if(note.createdBy.toString() !== req.user._id.toString()) {
            const error = new Error('Unauthorized to do the action');
            return res.status(401).json({ error: error.message });
        }

        req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString());

        try {
            await Promise.allSettled([req.task.save(), note.deleteOne()]);
            res.send('Note deleted successfully');
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete note' });
        }

    }
}