import React, { useEffect, useState } from "react"
import Layout from "components/Layout"
import Campaign from "../../contract/build/Campaign.json"
import { Message, Button } from "semantic-ui-react"
import { useRouter } from "next/router"
import { Row, Column, Padding, StatCard } from "../../styles/index.js"
import { Link } from "../../routes"

import web3 from "../../web3"

const Show = function () {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [summary, setSummary] = useState({})
  const [address, setAddress] = useState("")
  const [userAddress, setUserAddress] = useState("")

  const router = useRouter()

  useEffect(async () => {
    try {
      setLoading(true)
      console.log(router.query)
      setAddress(router.query.address)
      const accounts = await web3.eth.getAccounts()

      setUserAddress(accounts[0])

      const campaign = new web3.eth.Contract(JSON.parse(Campaign.interface), router.query.address)
      const summary = await campaign.methods.getSummary().call()
      console.log("summary", summary)
      setSummary({
        minimunContribution: summary[0],
        balance: summary[1],
        requests: summary[2],
        totalApprovers: summary[3],
        manager: summary[4],
      })
    } catch (e) {
      setErrorMessage(e.message.toString())
    }
    setLoading(false)
  }, [address])

  function renderManagerButtons() {
    return (
      <Link route={`/campaigns/${address}/newRequest`}>
        <a>
          <Button icon="add circle" content="NEW REQUEST" primary />
        </a>
      </Link>
    )
  }

  function renderContributeButtons() {
    return (
      <Link route={`/campaigns/${address}/contribute`}>
        <a>
          <Button icon="add circle" content="CONTRIBUTE" primary />
        </a>
      </Link>
    )
  }

  const userIsOwner = summary.manager == userAddress

  return (
    <Layout>
      <h3>Campaign {address}</h3>
      {errorMessage ? <Message error header="Opss" content={errorMessage} /> : null}
      <Padding pt="2" pb="4">
        <p>
          Manager: {summary.manager} {userIsOwner ? "(You're the owner)" : ""}
        </p>
      </Padding>
      <h4>Statistics</h4>
      <Padding pt="2" pb="4">
        <div>
          <Row flexWrap="wrap">
            <StatCard
              total={summary.minimunContribution}
              unit="wei"
              description="Minimum Contribution"
            />
            <StatCard total={summary.balance} unit="wei" description="Balance" />
            <StatCard total={summary.requests} description="Requests" />
            <StatCard total={summary.totalApprovers} description="Total Approvers" />
            {!userIsOwner ? renderContributeButtons() : null}
          </Row>
        </div>
      </Padding>

      <Row flex="1" alignItems="center" justifyContent="space-between">
        <h4>Requests</h4>
        {userIsOwner ? renderManagerButtons() : null}
      </Row>
      <Padding pt="2" pb="4"></Padding>
    </Layout>
  )
}

export default Show
