import pg from "pg";
const { Client } = pg;
import axios from "axios";

const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "mysecretpassword",
    database: "postgres",
});

async function connectDatabase() {
    try {
        await client.connect();
        console.log("Connected to the database.");

        await client.query(`CREATE SCHEMA IF NOT EXISTS news`);
        //check for table creation
        // Create table if it doesn't exist
        await client.query(
            `CREATE TABLE IF NOT EXISTS news.news_topics (
          guid INTEGER PRIMARY KEY,
          title VARCHAR(500) NOT NULL,
          timestamp TIMESTAMP NOT NULL,
          topic VARCHAR(250),
          generic_topic VARCHAR(250),
          sentiment VARCHAR(250),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
        );

        const res = await client.query(`SELECT * FROM news.news_topics`);

        let max_timeStamp = "2000-01-01 00:00:00";
        if (res.rows.length > 0) {
            const max_timeStamp_row =
                await client.query(`SELECT COALESCE(MAX(timestamp), '2000-01-01 00:00:00') AS max_timestamp
        FROM news.news_topics`);

            max_timeStamp = max_timeStamp_row.rows[0].max_timestamp;
        }

        const results = await client.query(
            `SELECT guid, created_at, title, content 
        FROM news.news_articles n1
        WHERE n1.created_at > $1
        LIMIT 5`,
            [max_timeStamp]
        );

        for (const row of results.rows) {
            const result = await analyzeArticle(row.content);
            const parsedResult = JSON.parse(result);

            const sentiment = parsedResult.sentiment ?? "";
            const topic = parsedResult.topic ?? "";
            const generic_topic = parsedResult.genericTopic ?? "";

            if (!sentiment || !topic || !generic_topic) break;
            console.log(parsedResult)
            console.log('------------------->')
            await client.query(
                `INSERT INTO news.news_topics (guid, title, timestamp, topic, generic_topic, sentiment)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT DO NOTHING`,
                [row.guid, row.title, row.created_at, topic, generic_topic, sentiment]
            );
        }
    } catch (err) {
        console.error("Failed to connect to the database:", err);
    } finally {
        await client.end();
        console.log("Connection ended");
    }
}

//chatGPT Api
const apiKey = process.argv.slice(2)[0]
const apiUrl = "https://api.openai.com/v1/chat/completions";

let count = 0;
async function analyzeArticle(articleContent) {
    const response = await axios.post(
        apiUrl,
        {
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are a News Article analyzer that analyzes text and assigns the Topic of 1-2 words non generic and specific to the artilce also assign a generic topic of 1-2 words to the article, 
                    You are also a sentiment analyzer, analyze give content and Assign sentiment as "positive" if the content primarily highlights the advantages, merits, or positive aspects of a person, event, or case,
                    Assign "negative" if the content predominantly discusses disadvantages, drawbacks, or negative aspects.
                    Assign "fact" if the content is neutral, objective, or presents only factual information without taking a positive or negative stance.`,
                },
                {
                    role: "user",
                    content: `Analyze the following article:
                    "${articleContent}"
                    
                    Provide the result in JSON string format with Sentiment, Topic, generic Topic fields. Should not include any additional text or formatting. :
                    {"sentiment": "positive, negative or fact","topic": "1-2 words","genericTopic": "1-2words"}`,
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

await connectDatabase();
console.log("openApi called: " + count);
