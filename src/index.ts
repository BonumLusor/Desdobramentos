// modules
import { Elysia } from "elysia";
import { html } from '@elysiajs/html'

// util
import getCombinations from './utils/combination.ts'
import guarantee from "./utils/guarantee.ts";
import filter from "./utils/filter.ts";

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
  
  let guaranteed = guarantee(body.selectedNumbers, body.guarantee)

  let combinations: number[][] = getCombinations(guaranteed.array, body.numbersPerTicket)
  

  combinations.forEach((array) => {
    let resultArray = filter(array, body, guaranteed.rejectedNumbers)
    if (resultArray != null) result.push(resultArray)
  })

  return new Response(JSON.stringify(result))
  
})

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);