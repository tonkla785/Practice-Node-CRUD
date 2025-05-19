const express = require('express')
const bodyparser = require('body-parser')
const mysql = require('mysql2/promise')
const cors = require('cors')
const app = express()

app.use(bodyparser.json())
app.use(cors())

const port = 8000

let arrayUsers = []
let counter = 1

let conn = null

const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'usertest'
    })
}

const validateData = (userData) => {
  let errors = []

  if (!userData.firstname) {
    errors.push('กรุณาใส่ชื่อจริง')
  }
  
  if (!userData.lastname) {
    errors.push('กรุณาใส่นามสกุล')
  }

  if (!userData.age) {
    errors.push('กรุณาใส่อายุ')
  }

  if (!userData.gender) {
    errors.push('กรุณาใส่เพศ')
  }

  if (!userData.interests) {
    errors.push('กรุณาใส่ความสนใจ')
  }

  if (!userData.description) {
    errors.push('กรุณาใส่รายละเอียดของคุณ')
  }

  return errors
}

app.get('/testdb', async (req, res) => {
    try {
        const results = await conn.query('SELECT * FROM users')
        res.json(results[0])

    } catch (error) {
        console.log('Error fetching users:', error.message)
        res.status(500).json({ error: 'Error fetching users!' })
    }
})

//Read All data
app.get('/users', async (req, res) => {
    try {
        const results = await conn.query('SELECT * FROM users')
        res.json(results[0])

    } catch (error) {
        console.error('Error fetching users:', error.message)
        res.status(500).json({ error: 'Error fetching users!' })
    }
})
//Read only field
// app.get('/users/spec', (req, res) => {
//     const filterUsers = arrayUsers.map(user => {
//         return {
//             id: user.id,
//             firstname: user.firstname,
//             lastname: user.lastname,
//             fullname: user.firstname + ' ' + user.lastname
//         }
//     })
//     res.json(filterUsers)
// })
//Read by id
app.get('/users/:id', async (req, res) => {
    try {
        let id = req.params.id
        const results = await conn.query('SELECT * FROM users WHERE id = ?', id)
        if (results[0].length == 0) {
            throw { statusCode: 404, message: 'Cannot Found!' }
        }
        res.json(results[0][0])
    } catch (error) {
        console.error('Error fetching users by id:', error.message);
        let statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: 'Something Wrong!',
            errorMessage: error.message
        });
    }
})
//Create
app.post('/users', async (req, res) => {
    try {
        let user = req.body

        const errors = validateData(user)
        if(errors.length > 0){
            throw{
                message:'กรอกข้อมูลไม่ครบ',
                errors: errors
            }
        }

        const results = await conn.query('INSERT INTO users SET ?', user)
        res.json({
            message: 'Insert OK',
            data: results[0]
        })
    } catch (error) {
        const errorMessage = error.message || 'Insert Failed!'
        const errors = error.errors || []
        console.error('Insert error:', error.message);
        res.status(500).json({ 
            message: errorMessage,
            errors: errors 
        });
    }
})
//Update
app.put('/users/:id', async (req, res) => {
    try {
        let id = req.params.id
        let updateUser = req.body
        const results = await conn.query(
            'UPDATE users SET ? WHERE id = ?',
            [updateUser, id])
        res.json({
            message: 'Update OK',
            data: results[0]
        })
    } catch (error) {
        console.error('Update error:', error.message);
        res.status(500).json({ message: 'Update Failed!' });
    }
})
//Update only field
// app.patch('/users/:id', (req, res) => {
//     let id = req.params.id
//     let updateUser = req.body

//     let selectedIndex = arrayUsers.findIndex(user => user.id == id)

//     if (updateUser.firstname) {
//         arrayUsers[selectedIndex].firstname = updateUser.firstname
//     }
//     if (updateUser.lastname) {
//         arrayUsers[selectedIndex].lastname = updateUser.lastname
//     }

//     res.json({
//         message: 'Update user only field complete!',
//         data: {
//             user: updateUser,
//             indexUpdate: selectedIndex
//         }
//     })
// })
//Delete
app.delete('/users/:id', async (req, res) => {
    try {
        let id = req.params.id
        const results = await conn.query(
            'DELETE FROM users WHERE id = ?', id)
        res.json({
            message: 'Delete OK',
            data: results[0]
        })
    } catch (error) {
        console.error('Delete error:', error.message);
        res.status(500).json({ message: 'Delete Failed!' });
    }
})

app.listen(port, async (req, res) => {
    await initMySQL()
    console.log('http server run at' + port)
})