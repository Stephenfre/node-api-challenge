const express = require('express')
const Projects = require('../data/helpers/projectModel.js')
const Actions = require('../data/helpers/actionModel.js')

const router = express.Router()

router.use('/:id', validateId)


/*
CRUD
C - CREATE - post
R - READ - get
U - UPDATE - put
D - DELETE - delete

*/

/*
-----------------------------------------------------------------------------------------
 retrieve Projects from the db
-----------------------------------------------------------------------------------------
*/

router.get('/', (req, res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects);
        })
        .catch(err => {
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving the projects'
            });
        });
})

router.get('/projects/:id', validateId, (req, res) => {
    res.status(200).json(req.project)
})

/*
-----------------------------------------------------------------------------------------
 Get Project actions
-----------------------------------------------------------------------------------------
*/

router.get('/:project_id/actions', (req, res) => {
    const projectId = req.params.project_id;
    console.log(projectId)
    Projects.getProjectActions(projectId)
        .then(actions => {
            if (actions) {
                res.status(200).json(actions)
            } else {
                res.status(404).json({ message: 'Project id dont exist' })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Project does not have any actions' })
        })
})

/*
-----------------------------------------------------------------------------------------
 add a project to the db
-----------------------------------------------------------------------------------------
*/

router.post('/', validatePost, (req, res) => {
    // console.log(req.body)
    Projects.insert(req.body)
        .then(projects => {
            res.status(201).json(projects)
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error adding a project'
            });
        });
})



/*
-----------------------------------------------------------------------------------------
 delete project
-----------------------------------------------------------------------------------------
*/
router.delete('/:id', validateId, (req, res) => {
    Projects.remove(req.params.id)
        .then(deleted => {
            res.status(200).json({ message: 'project removed', deleted })
        })
        .catch(err => res.status(500).json({ error: "The post could not be removed", err }))
})



/*
-----------------------------------------------------------------------------------------
 modify a project in the db
-----------------------------------------------------------------------------------------
*/
router.put('/:id', validateId, validatePost, (req, res) => {
    Projects.update(req.params.id)
        .then(updating => {
            res.status(200).json({ success: true, updating })
        })
        .catch(err => res.status(500).json({ error: "The post information could not be modified.", err }))
})



/*
-----------------------------------------------------------------------------------------
 Custom Middleware
-----------------------------------------------------------------------------------------
*/

function validateId(req, res, next) {
    const { id } = req.params.id;
    Projects.get(id)
        .then(project => {
            if (project) {
                req.project = project;
                next()
            } else {
                next(new Error('doesnt exist'))
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'err', err })
        })
}

function validatePost(req, res, next) {
    if (req.body.name && req.body.description) {
        next()
    } else {
        res.status(400).json({ errorMessage: "Please provide name and description for the post." })
    }
}

module.exports = router