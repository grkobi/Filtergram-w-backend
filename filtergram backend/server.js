const express = require('express')
const app = express()
const storyService = require('./services/story.service')
const userService = require('./services/user.service')
const cookieParser = require('cookie-parser')
const path = require('path')
const cors = require('cors')
// const mongoose = require('mongoose')


// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/mydb')
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('Failed to connect to MongoDB:', err));


// // Create a schema for the Story model
// const storySchema = new mongoose.Schema({
//     // _id: String,
//     txt: String,
//     createdAt: String,
//     img: {
//         url: String,
//         style: {
//             filter: String
//         }
//     },
//     userStories: String,
//     likedBy: String,
// });

// const usersSchema = new mongoose.Schema({
//     username: String,
//     password: String,
//     fullName: String,
//     score:String,
//     // _id: String
// });

// const Story = mongoose.model('Story', storySchema);

// App Configuration
const corsOptions = {
    origin: [
        'http://127.0.0.1:8080',
        'http://localhost:8080',
        'http://127.0.0.1:3000',
        'http://localhost:3000',
        'http://localhost:3001'
    ],
    credentials: true
}
app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(cookieParser()) // for res.cookies
app.use(express.json()) // for req.body



// **************** Stories API ****************:
// List
app.get('/api/story', (req, res) => {
    // const { txt, maxPrice } = req.body
    // const filterBy = { txt }
    storyService.query()
        .then(stories => {
            res.send(stories)
        })
        .catch(err => {
            console.log('Cannot load stories')
            console.error(err)
            res.status(400).send('Cannot load stories')
        })
})

// Add
app.post('/api/story', (req, res) => {
    // const loggedinUser = userService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot add car')
    const story = req.body

    // const car = {
    //     vendor,
    //     speed: +speed,
    //     price: +price
    // }
    storyService.save(story)
        .then((savedStory) => {
            res.send(savedStory)
        })
        .catch(err => {
            console.log('Cannot add story111')
            res.status(400).send('Cannot add story111')
        })

})

// Edit
app.put('/api/story', (req, res) => {
    // const loggedinUser = userService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot update car')

    const story = req.body
    storyService.save(story)
        .then((savedStory) => {
            res.send(savedStory)
        })
        .catch(err => {
            console.log('Cannot add story111')
            res.status(400).send('Cannot add story111')
        })
})

// Read - getById
app.get('/api/story/:storyId', (req, res) => {
    const { storyId } = req.params
    storyService.get(storyId)
        .then(story => res.send(story))
        .catch(err => res.status(403).send(err))
})

// Remove
app.delete('/api/story/:storyId', (req, res) => {
    // const loggedinUser = userService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot delete story')
    console.log('req params11', req.params)
    const { storyId } = req.params
    storyService.remove(storyId)
        .then(msg => {
            res.send({ msg, storyId })
        })
        .catch(err => {
            console.log('err:', err)
            res.status(400).send('Cannot remove story, ' + err)
        })
})


// **************** Users API ****************:
app.get('/api/auth/:userId', (req, res) => {
    const { userId } = req.params
    userService.getById(userId).then(user => {
        res.send(user)
    })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            const token = userService.getLoginToken(user)
            res.cookie('loginToken', token)
            res.send(user)
        })
        .catch(err => {
            res.status(401).send('Not you!')
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            const token = userService.getLoginToken(user)
            res.cookie('loginToken', token)
            res.send(user)
        })
        .catch(err => {
            console.log(err)
            res.status(401).send('Nope!')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})


app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})


// Listen will always be the last line in our server!
app.listen(3030, () => console.log('Server listening on port 3030!'))