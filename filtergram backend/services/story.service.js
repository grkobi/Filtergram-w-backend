const dbService = require('./db.service')
const ObjectId = require('mongodb').ObjectId
const fs = require('fs')
var stories = require('../data/story.json')

const COLLECTION_NAME = 'story'

async function query(filterBy = {}) {
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        // console.log('collection', collection)
        const stories = await collection.find().toArray()
        return stories
    } catch (err) {
        console.error('cannot load stories from db', err)
        throw err
    }
}

// function query(filterBy = {}) {
//     let storiesToDisplay = stories
//     // if (filterBy.txt) {
//     //     const regExp = new RegExp(filterBy.txt, 'i')
//     //     storiesToDisplay = storiesToDisplay.filter(story => regExp.test(story.txt))
//     // }

//     return Promise.resolve(storiesToDisplay)
// }

async function getById(storyId) {
    try {
        // const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection(COLLECTION_NAME)
        const story = await collection.findOne({ _id: ObjectId(storyId) })

        return story
    } catch (err) {
        logger.error('cannot find story', err)
        throw err
    }
}

// function get(storyId) {
//     const story = stories.find(story => story._id === storyId)
//     if (!story) return Promise.reject('story not found!')
//     return Promise.resolve(story)
// }

async function remove(storyId) {
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        await collection.deleteOne({ _id: new ObjectId(storyId)}) || collection.deleteOne({ _id: storyId })
        return storyId
    } catch (err) {
        console.error(err, `cannot remove story id: ${storyId}`)
        throw err
    }
}

// ({ _id: storyId })
// function remove(storyId) {
//     console.log('storyId', storyId)
//     const idx = stories.findIndex(story => story._id === storyId)
//     if (idx === -1) return Promise.reject('No Such story')
//     const story = stories[idx]
//     // if (story.by._id !== loggedinUser._id) return Promise.reject('Not your story')
//     stories.splice(idx, 1)
//     return _saveStoriesToFile()

// }


async function add(story) {
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        await collection.insertOne(story)
        return story
    } catch (err) {
        logger.error('cannot insert story', err)
        throw err
    }
}

async function update(story) {
    try {
        const updatedStory = {...story}
        delete updatedStory._id
        const collection = await dbService.getCollection(COLLECTION_NAME)
        await collection.updateOne({ _id: new ObjectId(story._id) }, { $set: updatedStory })
        return story
    } catch (err) {
        logger.error(`cannot update story ${story._id}`, err)
        throw err
    }
}


// function save(story) {
//     if (story._id) {
//         const storyToUpdate = stories.find(currStory => currStory._id === story._id)
//         // if (storyToUpdate.owner._id !== loggedinUser._id) return Promise.reject('Not your car')
//         Object.assign(storyToUpdate, story)
//     } else {
//         story._id = _makeId()
//         // story.owner = loggedinUser
//         // stories.shift(story)
//         stories = [story, ...stories]
//     }

//     return _saveStoriesToFile().then(() => story)
//     // return Promise.resolve(car)
// }

// function _makeId(length = 5) {
//     let text = '';
//     const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     for (let i = 0; i < length; i++) {
//         text += possible.charAt(Math.floor(Math.random() * possible.length));
//     }
//     return text;
// }

// function _saveStoriesToFile() {
//     return new Promise((resolve, reject) => {

//         const storiesStr = JSON.stringify(stories, null, 2)
//         fs.writeFile('data/story.json', storiesStr, (err) => {
//             if (err) {
//                 return console.log(err);
//             }
//             console.log('The file was saved!');
//             resolve()
//         });
//     })
// }

module.exports = {
    query,
    getById,
    remove,
    add,
    update
}