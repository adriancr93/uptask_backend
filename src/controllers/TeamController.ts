import type { Request, Response} from 'express'
import User from '../models/Auth'
import Project from '../models/Project'

export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body

        //Find user
        const user = await User.findOne({ email }).select('id email name')
        if (!user) {
            const error = new Error('User not found')
            return res.status(404).json({ error: error.message })
        }
        res.json(user)
    }

    static getProjectTeam = async (req: Request, res: Response) => {
        const project = await (await Project.findById(req.project._id)).populate({ path: 'team', select: 'id name email' })
        res.json(project.team)
    }

    static addMemberById = async (req: Request, res: Response) => {
        const { id } = req.body

        // Find user
        const user = await User.findById(id).select('id')
        if (!user) {
            const error = new Error('User not found')
            return res.status(404).json({ error: error.message })
        }

        if(req.project.team.some(team => team.toString() === user._id.toString())){
            const error = new Error('User is already a member of the project')
            return res.status(409).json({ error: error.message })
        }

        req.project.team.push(user._id)
        await req.project.save()

        res.send("Member added successfully")
    }

    static removeMemberById = async (req: Request, res: Response) => {
        const { id } = req.body

        if(!req.project.team.some(team => team.toString() === id)){
            const error = new Error('User is not a member of the project')
            return res.status(409).json({ error: error.message })
        }

        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== id)
        await req.project.save()
        
        res.send("Member removed successfully")
    }
}