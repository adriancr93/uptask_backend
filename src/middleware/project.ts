import type { Request, Response, NextFunction } from 'express'
import Project, { IProject } from '../models/Project';

declare global {
    namespace Express {
        interface Request {
            project: IProject;
        }
    }
}

export async function projectExists( req: Request, res: Response, next: NextFunction) {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        req.project = project; // Attach the project to the request object for further use
        next()
    } catch (error) {
        res.status(500).json({error: 'Internal server error'})
    }
}