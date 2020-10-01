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
 retrieve info from the db
-----------------------------------------------------------------------------------------
*/


// router.get('/', (req, res) => {
//     const { projectId } = req.params;
//     console.log(projectId)
//     Projects.getProjectActions(projectId)
//         .then(actions => {
//             if (actions) {
//                 res.status(200).json(actions)
//             } else {
//                 res.status(404).json({ message: 'Project id dont exist' })
//             }
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({ message: 'Project does not have any actions' })
//         })
// })

/*
-----------------------------------------------------------------------------------------
 add a record to the db
-----------------------------------------------------------------------------------------
*/

router.post('/', validatePost, (req, res) => {
    Actions.insert(req.body)
        .then(actions => {
            res.status(201).json(actions)
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
 delete records
-----------------------------------------------------------------------------------------
*/
router.delete('/:id', validateId, (req, res) => {
    Actions.remove(req.params.id)
        .then(deleted => {
            res.status(200).json({ message: 'project removed', deleted })
        })
        .catch(err => res.status(500).json({ error: "The post could not be removed", err }))
})



/*
-----------------------------------------------------------------------------------------
 modify a record in the db
-----------------------------------------------------------------------------------------
*/
router.put('/:id', validateId, validatePost, (req, res) => {
    Actions.update(req.params.id)
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
    Actions.get(id)
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
    if (req.body.description) {
        next()
    } else {
        res.status(400).json({ errorMessage: "Please provide name and description for the post." })
    }
}

module.exports = router