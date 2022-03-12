import React, { useState, useEffect } from "react"
import { Button, Card, Container, Grid } from "semantic-ui-react"
import factory from "../factory"
import Layout from "../components/Layout"
import { Link } from "../routes"

import { Row, Column } from "../styles/index.js"

class App extends React.Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call()
    console.log("campaigns", campaigns)
    return { campaigns }
  }

  renderEmptyList() {
    return (
      <img src="https://assets.materialup.com/uploads/8814432b-2132-439c-bc9e-398f8a84dbea/attachment.jpg" />
    )
  }

  renderCampaings() {
    const items = this.props.campaigns.map((campaign) => ({
      header: campaign,
      description: (
        <Link route={`/campaigns/${campaign}`}>
          <a>View campaign</a>
        </Link>
      ),
      fluid: true,
    }))
    return (
      <Column>
        <Row flex="1" justifyContent="space-between" alignItems="center">
          <h2 style={{ margin: 0 }}>Campaigns</h2>
          <Link route="/campaigns/new">
            <a>
              <Button icon="add circle" content="NEW CAMPAIGN" primary />
            </a>
          </Link>
        </Row>
        <h3 style={{ marginTop: 64 }}>{this.props.campaigns.length} campaigns avaliable!</h3>
        {items.length > 0 ? <Card.Group items={items} /> : this.renderEmptyList()}
      </Column>
    )
  }

  render() {
    return <Layout>{this.renderCampaings()}</Layout>
  }
}

export default App
