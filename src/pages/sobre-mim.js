import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const AboutMe = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <h1>Sobre mim</h1>
      <p>
        Sou uma pessoa <code>curiosa</code>, que possui muitos gostos,
        introvertido mas enfrento as multidões para ir em shows de bandas que
        gosto. <pre>Música</pre> é uma das minhas paixões, como basquete e cultura
        japonesa. Sou pai do Apollo de 2 anos e gosto muito de estudar sobre
        criança e paternidade. Pode-se dizer que sou um Longlife Learner, pois
        amo estudar e aprender coisas novas.
      </p>
    </Layout>
  )
}
export const Head = () => <Seo title="Sobre mim" />

export default AboutMe

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
