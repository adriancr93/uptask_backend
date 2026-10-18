import type {Request, Response} from 'express';
import Project from '../models/Project';

export class ProjectController {

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body);

        //Assign manager
        project.manager = req.user._id
        try {
            await project.save();
            res.send('Project created successfully');
        } catch (error) {
            res.status(500).json({ error: 'Error creating project' });
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    {manager: {$in: [req.user._id]}},
                    {team: {$in: [req.user._id]}}
                ]
            });
            res.json(projects);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching projects' });
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const project = await Project.findById(id).populate('tasks');
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            if (project.manager.toString() !== req.user._id.toString() && !project.team.includes(req.user._id)) {
                return res.status(403).json({ error: 'Access denied' });
            }

            res.json(project);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching project' });
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        try {
            req.project.projectName = req.body.projectName;
            req.project.clientName = req.body.clientName;
            req.project.description = req.body.description;

            await req.project.save();
            res.send('Project updated successfully');
        } catch (error) {
            res.status(500).json({ error: 'Error updating project' });
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        try {
            await req.project.deleteOne();
            res.send('Project deleted successfully');
        } catch (error) {
            res.status(500).json({ error: 'Error deleting project' });
        }
    }

}