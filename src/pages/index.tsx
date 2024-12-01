import styled from "styled-components";
import HomePage from "@/components/HomePage";
import Card from "@/components/Card";
import {GetServerSideProps, GetStaticProps} from "next";

export interface Article {
    guid: Number,
    link: string,
    timestamp: string,
    content: string,
    title: string,
    source: string,
    publish_date: string
}
interface HomeProps {
    articles: Article[]
}
export default function Home(props: HomeProps) {
    const six_articles = props.articles.slice(0,6)
  return (
      <Container>
          <HomePage articles={six_articles}/>
          {/*<Topic>*/}
          {/*    <Title3>TOPICS TO EXPLORE</Title3>*/}
          {/*    /!*<Cards>*!/*/}
          {/*    /!*    <Card/>*!/*/}
          {/*    /!*    <Card/>*!/*/}
          {/*    /!*    <Card/>*!/*/}
          {/*    /!*</Cards>*!/*/}
          {/*    /!*create a much smaller cards for these *!/*/}
          {/*</Topic>*/}
          {/*<Articles/>*/}
          <Content>
              <Title3>MORE ARTICLES</Title3>
              <Articles>
                  {props.articles.map((article) => (
                      <Card article={article}/>
                  ))}
              </Articles>
          </Content>
      </Container>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
    const response = await fetch('http:localhost:3000/api/articles?limit=100')
    const data = await response.json()
    console.log(data)
    return{
        props:{
            articles: data
        }
    }
}

const Container = styled.div`
    width: 100vw;
    height: 100vh;
`
const Topic = styled.div`
    padding: 30px;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
`
const Content = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
`
const Articles = styled.div`
    display: flex;
    flex-wrap: wrap;
`

const Title3 = styled.h3`

`

const Cards = styled.div`
    justify-content: space-evenly;
    display: flex;
    flex-wrap: wrap;
`