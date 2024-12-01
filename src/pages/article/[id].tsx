import {Article} from "@/pages";
import {useRouter} from "next/router";
import {useCallback, useEffect, useState} from "react";
import styled from "styled-components";


const ArticlePage = (props: Article) => {
    const router = useRouter()
    const {id} = router.query

    const [article, setArticle] = useState<Article>();
    const [isOtherSide, setIsOtherSide] = useState<string>();
    const [links, setLinks] = useState<[]>()
    const [didCall, SetDidCall] = useState<boolean>()

    const [data, setData] = useState<string>()

    useEffect(() => {
        if(id){
            fetch(`/api/article/${id}`).then((res) => res.json())
                .then((data) => setArticle(data));
        }
    },[id])

    if(!article)return <>Loading....</>

    const handleOtherSide = async () => {
        const res = await fetch(`/api/otherSide/${id}`)
        const result = await res.json()
        if(result.message === 'FACT'){
            setIsOtherSide("FACT")
            return;
        }
        else if(result.message === 'SUCCESS'){
            setLinks(result.data.link)
        }else{
            const summary = await fetch(`/api/otherSideSummary/${id}`)
            const json = await summary.json()
            setData(json.oppoSummary)
            setLinks(json.links)
            SetDidCall(true)
        }

    }
    return (
        <Container>
            <Title>{article.title}</Title>
            <p>{article.content}</p>
            <a href={article.link}>Link to the article</a>
            <p>SOURCE: {article.source}</p>
            <p>Publish Date: {article.publish_date}</p>

            <Button onClick={handleOtherSide}>Other Side</Button>
            {isOtherSide === 'FACT' ? <p>SORRY THIS DATA IS A FACT</p> : <div></div>}


            {didCall ? ((data || links) ? (<><h2>Opposing POV </h2>
                <h4>{data}</h4>
                <p>{links} </p>
            </>): <div>Loading</div>): <div></div>}




        </Container>
    )
}

export default ArticlePage

const Container = styled.div`
    margin: 0px;
    padding: 20px;
`
const Title = styled.h1`
    padding-bottom: 10px;
    margin: 0px;
    border-bottom: 0.2px solid #383838;
`
const Button = styled.button`
    display: block;
    padding: 10px;
    border-radius: 3px;
    margin: 5px;
    width: 200px;
    border: 0.5px solid black;
    background-color: #ad33ff;
    color: white;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    
`