import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handledinputErrors } from '../middleware/validation'
import { TaskController } from '../controllers/TaskController'
import { projectExists } from '../middleware/project'
import { hasAuthorization, taskBelongsToProject, taskExists } from '../middleware/task'
import { authenticate } from '../middleware/auth'
import { TeamMemberController } from '../controllers/TeamController'
import { NoteController } from '../controllers/NoteController'

const router = Router()

router.use(authenticate) // Apply authentication middleware to all routes in this router

router.post('/', 
    body('projectName').notEmpty().withMessage('Project name is required'),
    body('clientName').notEmpty().withMessage('Client name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    handledinputErrors,
    ProjectController.createProject
)

router.get('/', ProjectController.getAllProjects)

router.get('/:id', 
    param('id').isMongoId().withMessage('Invalid project ID'),
    handledinputErrors,
    ProjectController.getProjectById
)

/** Routes for tasks */
router.param('projectId', projectExists)

router.put('/:projectId', 
    param('projectId').isMongoId().withMessage('Invalid project ID'),
    body('projectName').notEmpty().withMessage('Project name is required'),
    body('clientName').notEmpty().withMessage('Client name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    handledinputErrors,
    hasAuthorization,
    ProjectController.updateProject
)

router.delete('/:projectId', 
    param('projectId').isMongoId().withMessage('Invalid project ID'),
    handledinputErrors,
    hasAuthorization,
    ProjectController.deleteProject
)

router.post('/:projectId/tasks', 
    hasAuthorization,
    body('name').notEmpty().withMessage('Task name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    handledinputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks', 
    TaskController.getProjectTasks
)

router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    handledinputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    body('name').notEmpty().withMessage('Task name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    handledinputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    handledinputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status', 
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    body('status').notEmpty().withMessage('Status is required'),
    handledinputErrors,
    TaskController.updateStatus
)

/** Routes for team management */
router.post('/:projectId/team/find', 
    body('email').isEmail().toLowerCase().withMessage('Invalid email address'),
    handledinputErrors,
    TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team', 
    TeamMemberController.getProjectTeam
)

router.post('/:projectId/team', 
    body('id').isMongoId().withMessage('Invalid user ID'),
    handledinputErrors,
    TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:userId', 
    param('userId').isMongoId().withMessage('Invalid user ID'),
    handledinputErrors,
    TeamMemberController.removeMemberById
)

/** Routes for notes */
router.post('/:projectId/tasks/:taskId/notes', 
    body('content').notEmpty().withMessage('Content is required'),
    handledinputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes', 
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId', 
    param('noteId').isMongoId().withMessage('Invalid note ID'),
    handledinputErrors,
    NoteController.deleteNote
)

export default router