const express = require('express')
const bodyparser = require('body-parser')
const app = express()

app.use(bodyparser.json())

const port = 8000

let arrayUsers = []
let counter = 1

//Read All data
app.get('/users', (req, res) => {
    res.json(arrayUsers)
})
//Read only field
app.get('/users/spec', (req, res) => {
    const filterUsers = arrayUsers.map(user => {
        return {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            fullname: user.firstname + ' ' + user.lastname
        }
    })
    res.json(filterUsers)
})
//Read by id
app.get('/users/:id', (req, res) => {
    let id = req.params.id
    let selectedIndex = arrayUsers.findIndex(user => user.id == id)
    res.json(arrayUsers[selectedIndex])
})
//Create
app.post('/users', (req, res) => {
    let user = req.body
    user.id = counter
    counter += 1

    arrayUsers.push(user)
    res.json({
        message: 'Add ok',
        user: user
    })
})
//Update
app.put('/users/:id', (req, res) => {
    let id = req.params.id
    let updateUser = req.body

    let selectedIndex = arrayUsers.findIndex(user => user.id == id)

    arrayUsers[selectedIndex].firstname = updateUser.firstname || arrayUsers[selectedIndex].firstname
    arrayUsers[selectedIndex].lastname = updateUser.lastname || arrayUsers[selectedIndex].lastname
    arrayUsers[selectedIndex].age = updateUser.age || arrayUsers[selectedIndex].age
    arrayUsers[selectedIndex].gender = updateUser.gender || arrayUsers[selectedIndex].gender

    res.json({
        message: 'Update user complete!',
        data: {
            user: updateUser,
            indexUpdate: selectedIndex
        }
    })
})
//Update only field
app.patch('/users/:id', (req, res) => {
    let id = req.params.id
    let updateUser = req.body

    let selectedIndex = arrayUsers.findIndex(user => user.id == id)

    if (updateUser.firstname) {
        arrayUsers[selectedIndex].firstname = updateUser.firstname
    }
    if (updateUser.lastname) {
        arrayUsers[selectedIndex].lastname = updateUser.lastname
    }

    res.json({
        message: 'Update user only field complete!',
        data: {
            user: updateUser,
            indexUpdate: selectedIndex
        }
    })
})
//Delete
app.delete('/users/:id', (req, res) => {
    let id = req.params.id

    let selectedIndex = arrayUsers.findIndex(user => user.id == id)

    arrayUsers.splice(selectedIndex, 1)

    res.json({
        message: 'Delete complete!',
        indexDelete: selectedIndex
    })
})

app.listen(port, (req, res) => {
    console.log('http server run at' + port)
})