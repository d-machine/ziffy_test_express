const pool = require('./db')
const fs = require('fs')

function getBlogs(request, response) {
    pool.query('SELECT * FROM blog ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getBlogById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM blog WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).send(error)
        }

        const record = results.rows[0]

        let fullBody = record.top_2_lines

        if (fs.existsSync(record.filepath)) {
            fullBody = fs.readFileSync(record.filepath, 'utf-8')
        }

        response.status(200).json({title: record.title, id: record.id, content: fullBody})
    })
}

const createBlog = (request, response) => {
    const {title, content} = request.body
    if (title === null || title === undefined || title.length === 0) {
        response.status(400).send('Title can not be empty')
    }
    if (content === null || content === undefined || content.length === 0) {
        response.status(400).send('Content can not be empty')
    }

    pool.query('SELECT * FROM blog WHERE title = $1', [title], (error, results) => {
        if (error) {
            response.status(500).send(error)
            return
        }

        if (results.rows && results.rows.length > 0) {
            response.status(400).send('Record with title already exists')
            return
        }

        let top_2_lines = content

        if (content.length > 200) {
            top_2_lines = `${content.slice(0, 197)}...`
        }

        let filepath = `${process.env.BLOG_DIR}/${title.split(' ').join('_')}.txt`

        fs.writeFile(filepath, content, (writeErr) => {
            if (writeErr) {
                response.status(500).send(writeErr)
                return
            }
            pool.query(
                'INSERT INTO blog (title, filepath, top_2_lines, created_at) VALUES ($1, $2, $3, $4)',
                [title, filepath, top_2_lines, created_at],
                (createErr, results) => {
                    if (createErr) {
                        response.status(500).send(createErr)
                    }
                    response.status(201).send(`Blog added with ID: ${results.insertId}`)
                })
        })
    })
}

/**const updateBlog = (request, response) => {
 const id = parseInt(request.params.id)
 const { name, email } = request.body

 pool.query(
 'UPDATE blogs SET name = $1, email = $2 WHERE id = $3',
 [name, email, id],
 (error, results) => {
 if (error) {
 throw error
 }
 response.status(200).send(`Blog modified with ID: ${id}`)
 }
 )
 }

 const deleteBlog = (request, response) => {
 const id = parseInt(request.params.id)

 pool.query('DELETE FROM blogs WHERE id = $1', [id], (error, results) => {
 if (error) {
 throw error
 }
 response.status(200).send(`Blog deleted with ID: ${id}`)
 })
 }*/

module.exports = {
    getBlogs,
    getBlogById,
    createBlog
}
