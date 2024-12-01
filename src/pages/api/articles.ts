// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "mysecretpassword",
    database: "postgres",
});


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if(req.method !== 'GET'){
        return res.status(405).json({error: 'Method not allowed'})
    }
    try{
        const limit  = req.query.limit || 4
        const result  = await pool.query(`SELECT * FROM news.news_articles LIMIT $1`,[limit])
        return res.status(200).json(result.rows)
    }catch (e){
        console.log(e)
        res.status(500).json({error: "Internal Server Error"})
    }
}
