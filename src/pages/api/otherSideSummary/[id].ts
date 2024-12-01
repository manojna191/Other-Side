import axios from "axios";
import {NextApiRequest, NextApiResponse} from "next";
const apiKey = process.env.ACCESS_KEY;
const apiUrl = "https://api.openai.com/v1/chat/completions";
import { Pool } from 'pg';

const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "mysecretpassword",
    database: "postgres",
});

let count = 0;
async function analyzeArticle(articleContent: string) {
    const response = await axios.post(
        apiUrl,
        {
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `Analyze the sentiment and Topic of the news Article and summarize by scanning internet a detailed response with the opposite sentiment. Ensure that the response maintains logical coherence and aligns with the context of the original content but presents a contrasting perspective.
                        1. If the content is optimistic and supportive, analyze critical and skeptical view got from internet
                        2. If the content is critical or negative, provide a positive and supportive viewpoint,.
                        Include the links referred for this`

                },
                {
                    role: "user",
                    content: `Analyze the following article:
                    "${articleContent}"

                    Provide the result in JSON string format.Do not include any additional text, comments, or formatting in the response. Example format: {"oppoSummary": "your data", "links": "an array of links"}.`
                },
            ],
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
        }
    );

    const res = response.data.choices[0].message.content;
    count = count + 1;
    return res;
}

console.log("openApi called: " + count);

export default async function handler(req:NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const result = await pool.query(`SELECT title, content FROM news.news_articles WHERE guid=$1`,[id])

        if(result.rows.length == 0){
            return res.status(200).json({ message: 'NOT FOUND' });
        }

        const result2 = await analyzeArticle(result.rows[0].content)
        const jsonData = JSON.parse(result2);

        res.status(200).json(jsonData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}