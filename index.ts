import { Elysia } from "elysia";
import { html } from '@elysiajs/html'
import fs from 'fs'

const template = fs.readFileSync('./index.html', 'utf-8')


const app = new Elysia()
    .use(html())
    .get('/', () => {
        return `${template}`
    })
    .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);