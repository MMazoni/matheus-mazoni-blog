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
        Sou uma pessoa <code>curiosa</code>, que possui muitos gostos.
        Introvertido, mas enfrento multidões para ir em shows de bandas
        que&nbsp;curto. <code>Música</code> é uma das minhas maiores paixões,
        tanto como&nbsp;
        <code>basquete</code>. Sou pai do Apollo de 2 anos e gosto muito
        de&nbsp;estudar sobre comportamento infantil e <code>paternidade</code>.
        Pode-se dizer que sou um <strong>"lifelong learner"</strong>, pois
        amo&nbsp;
        <code>aprender</code> sobre novos assuntos.
      </p>
      <p>
        <strong>
          <em>#cozinhar #pop-punk #leitura #quadrinhos #corrida #taiko</em>
        </strong>
      </p>
      <h2>Profissional</h2>
      <p>
        Trabalho como DevOps atualmente, mas comecei como desenvolvedor PHP em
        2019 no Porto de Santos. Fiz a migração em 2022, em um projeto
        internacional que atuava, criando algumas automações, a esteira de
        entrega contínua, e o monitoramento de logs. Ainda programo bastante e
        curto, também gosto de compartilhar conhecimento.
      </p>
      <p>
        Minha stack atual é:
        <br></br>
        <strong>
          <em>
            #Python #AWS #Docker #Kubernetes #Terraform #Ansible #Prometheus
          </em>
        </strong>
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
