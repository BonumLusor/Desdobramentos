// modules
import { Elysia } from "elysia";
import { html } from '@elysiajs/html'

// util
import getCombinations from './utils/combination.ts'
import fill from "./utils/fill.ts";

// types
import { postData } from './types/types.ts'


const app = new Elysia().use(html())


app.get('/', () => {
    return new Response(Bun.file('./src/html/index.html'))
});
app.get('/style.css', () => {
    return new Response(Bun.file('./src/html/style.css'))
});

app.post('/getResult', async (context ) => {
    const body:postData = await context.body as postData;

    let result:number[][] = [];

    let combinations: number[][] = getCombinations(body.selectedNumbers, body.guarantee)

    if(body.guarantee < body.numbersPerTicket)
        combinations.forEach((array) => {
            let filledArray: number[] | null = fill(array, body);
            if (filledArray != null) result.push(filledArray);
        }) 
    else
        result = combinations;

    return new Response(JSON.stringify(result))
  
})

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);