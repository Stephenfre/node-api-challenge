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

router.get('/:id', (req, res) => {
    res.status(200).json(req.project)
})

/*
-----------------------------------------------------------------------------------------
 add a record to the db
-----------------------------------------------------------------------------------------
*/

router.post('/', (req, res) => {
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
 delete records
-----------------------------------------------------------------------------------------
*/
router.delete(':id', (req, res) => {
    Projects.remove(req.params.id)
        .then(projects => {
            if (projects > 0) {
                res.status(200).json({ message: 'the project is gone' })
            } else {
                res.status(404).json({ message: 'the project can be found' })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'err remoivng the project' })
        })
})



/*
-----------------------------------------------------------------------------------------
 modify a record in the db
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

module.exports = router