import { Pool } from 'pg';
import {NextApiRequest, NextApiResponse} from "next";

const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "mysecretpassword",
    database: "postgres",
});

export default async function handler(req:NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const result  = await pool.query(`SELECT topic, generic_topic, sentiment FROM news.news_topics WHERE guid= $1;`, [id])

        if(result.rows.length == 0){
            return res.status(200).json({ message: 'NOT FOUND' });
        }

        if(result.rows[0].sentiment === 'fact'){
            return res.status(200).json({ message: 'FACT' });
        }

        const topic = result.rows[0].topic
        const generic_topic = result.rows[0].generic_topic
        let negate_sentiment = result.rows[0].sentiment === 'positive'?'negative':'positive'

        const sentiment = await pool.query(`SELECT guid, links FROM news.news_topics nt WHERE (nt.topic ILIKE= $1 AND nt.sentiment = $2) OR (nt.generic_topic ILIKE= $3 AND nt.sentiment = $2)`, [topic, negate_sentiment, generic_topic])

        if(sentiment.rows.length === 0){
            return res.status(202).json({ message: 'NOT FOUND' });
        }

        res.status(200).json({data: sentiment.rows, message: 'SUCCESS'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
