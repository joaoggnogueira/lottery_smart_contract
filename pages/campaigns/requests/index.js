import React, { useEffect, useState } from "react"
import Layout from "components/Layout"
import { useRouter } from "next/router"
import { Button, Message, Dimmer, Loader } from "semantic-ui-react"
import { Link } from "../../../routes"
import { Row, Column } from "../../../styles/index.js"
import Campaign from "../../../contract/build/Campaign.json"

import web3 from "../../../web3"

const Request = function () {
  const router = useRouter()
  const address = router.query.address
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [manager, setManager] = useState("")
  const [campaign, setCampaign] = useState(false)
  const [userAddress, setUserAddress] = useState("")

  async function refresh() {
    try {
      setLoading(true)
      const accounts = await web3.eth.getAccounts()
      setUserAddress(accounts[0])

      const campaign = new web3.eth.Contract(JSON.parse(Campaign.interface), router.query.address)
      setCampaign(campaign)
      const _manager = await campaign.methods.manager().call()
      console.log("manager", _manager)
      setManager(_manager)
    } catch (e) {
      setErrorMessage(e.message.toString())
    }
    setLoading(false)
  }

  useEffect(() => {
    if (router.isReady) {
      if (!router.query.address) {
        router.push("/")
      }
      console.log("Requesting router", router)
      refresh()
    }
  }, [router.isReady])

  const userIsOwner = manager == userAddress

  return (
    <Layout>
      <Dimmer active={loading} inverted>
        <Loader>Loading</Loader>
      </Dimmer>
      <Row alignItems="center" justifyContent="space-between">
        <Link route={`/campaigns/${address}`}>
          <a>
            <Button icon="chevron left" content="GO TO CAMPAIGN" primary />
          </a>
        </Link>
        <Button icon="refresh" content="REFRESH" primary onClick={refresh} />
      </Row>
      {errorMessage ? <Message error header="Opss" content={errorMessage} /> : null}
      <h3>Campign Address: {address}</h3>
      {userIsOwner && (
        <Link route={`/campaigns/${address}/requests/new`}>
          <a>
            <Button icon="plus circle" content="CREATE REQUEST" primary />
          </a>
        </Link>
      )}
    </Layout>
  )
}

export default Request