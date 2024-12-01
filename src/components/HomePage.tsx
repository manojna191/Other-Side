import styled from "styled-components";
import Card from './Card'
import {Article} from "@/pages";

interface HomePageProps{
    articles: Article[]
}
const HomePage = (props: HomePageProps) => {
    const articles = props.articles
    return (
        <Container>
            <Brand>
                <Title>OTHER SIDE</Title>
                <Content>The One only place where both sides of the world looks clear. <br/>
                    A place to make world and views better</Content>
            </Brand>
            <Articles>
                {articles.map((article) => (
                    <Card article={article}/>
                ))}
            </Articles>
        </Container>
    )
}

export default HomePage

const Container = styled.div`
    padding: 50px;
    justify-items: center;
    margin: 10px;
    border-radius: 10px;
    align-items: center;
    display: flex;
    background-color: #ad33ff;
    color: #ededed;
`
const Title = styled.h1`
    font-family: 'strong_font', sans-serif;
    font-size: 80px;
    margin: 0px;
`
const Brand = styled.div`
    padding: 2px;
    width: 70%;
    text-align: left;
    display: flex;
    flex-direction: column;
`
const Content = styled.h3`
    text-align: left;
    
`
const Articles = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 60%;
    
`
