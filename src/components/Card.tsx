import styled from "styled-components";
import {Article} from "@/pages";
import {router} from "next/client";

interface CardProps{
    article: Article
}
const Card= (props: CardProps) => {

    const handleClick = () => {
        router.push(`/article/${props.article.guid}`)
    }

    return (
        <Container onClick={handleClick}>
            <Title>{props.article.title}</Title>
            <br/>

            <Content>{props.article.content}</Content>
        </Container>
    )
}

export default Card

const Container = styled.div`
    border: 2px solid #383838;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    margin: 10px;
    box-shadow: 5px 5px 2px #ededed;
    width: 150px;
    height: 200px;
    padding: 12px;
    background-color: #ededed;
    color: #1a1a1a;
    font-family: 'strong_font', sans-serif;
    cursor: pointer;
`

const Title = styled.h4`
    padding-bottom: 10px;
    margin: 0px;
    border-bottom: 0.2px solid #383838;
`

const Content = styled.p`
    white-space: nowrap;
    margin: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.8rem;
`