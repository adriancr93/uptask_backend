import type { Request, Response, NextFunction } from 'express'
import Task, {  ITask } from '../models/Task';

declare global {
    namespace Express {
        interface Request {
            task: ITask;
        }
    }
}

export async function taskExists( req: Request, res: Response, next: NextFunction) {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        req.task = task; // Attach the task to the request object for further use
        next()
    } catch (error) {
        res.status(500).json({error: 'Internal server error'})
    }
}

export function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {
    if(req.task.project.toString() !== req.project._id.toString()) {
        return res.status(400).json({error: 'Actions denied'})
    }
    next()
}