import React, { useState, useEffect } from "react"
import { Button, Card, Container, Grid } from "semantic-ui-react"
import factory from "../factory"
import "semantic-ui-css/semantic.min.css"
import Layout from "../components/Layout"

const rowStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}

const flex1 = {
  flex: 1,
}

const columnStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
}

class App extends React.Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call()
    console.log("campaigns", campaigns)
    return { campaigns }
  }

  renderCampaings() {
    const items = this.props.campaigns.map((campaign) => ({
      header: campaign,
      description: <a>View campaign</a>,
      fluid: true,
    }))
    return (
      <div style={{ marginTop: 64, ...columnStyle }}>
        <div style={{ ...rowStyle, ...flex1 }}>
          <h2 style={{ margin: 0 }}>Campaigns</h2>
          <Button icon="add circle" content="NEW CAMPAIGN" primary />
        </div>
        <h3 style={{ marginTop: 64 }}>{this.props.campaigns.length} campaigns avaliable!</h3>
        <Card.Group items={items} />
      </div>
    )
  }

  render() {
    return (
      <Layout>
        <Container>{this.renderCampaings()}</Container>
      </Layout>
    )
  }
}

export default App
