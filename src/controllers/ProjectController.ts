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
            console.log(error);
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    {manager: {$in: req.user._id}}
                ]
            });
            res.json(projects);
        } catch (error) {
            console.log(error);
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const project = await Project.findById(id).populate('tasks');
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            if (project.manager.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Access denied' });
            }

            res.json(project);
        } catch (error) {
            console.log(error);
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const project = await Project.findById(id)

            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            if (project.manager.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Just the manager can update the project' });
            }

            project.projectName = req.body.projectName;
            project.clientName = req.body.clientName;
            project.description = req.body.description;

            await project.save();
            res.send('Project updated successfully');
        } catch (error) {
            console.log(error);
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const project = await Project.findById(id);

            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            if (project.manager.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Just the manager can delete the project' });
            }

            await project.deleteOne();
            res.send('Project deleted successfully');
        } catch (error) {
            console.log(error);
        }
    }

}