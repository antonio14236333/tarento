'use server'
import db from './db'

export async function createPost () {
    const post = await db.post.create({
        data: {
            title: 'Hello, World!',
            content: 'This is my first post!'
        }
    })
}