import React, { useEffect, useState } from "react"
import Layout from "components/Layout"
import RequestCard from "components/RequestCard"
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
  const [requests, setRequests] = useState([])
  const [requestCount, setRequestCount] = useState(0)
  const [summary, setSummary] = useState({})

  const finalizeRequest = async function (index) {}

  const approveRequest = async function (index) {}

  async function refresh() {
    try {
      setLoading(true)
      const accounts = await web3.eth.getAccounts()
      setUserAddress(accounts[0])

      const campaign = new web3.eth.Contract(JSON.parse(Campaign.interface), router.query.address)
      setCampaign(campaign)

      const summary = await campaign.methods.getSummary().call()
      console.log("summary", summary)
      setSummary({
        minimunContribution: summary[0],
        balance: summary[1],
        requests: summary[2],
        totalApprovers: summary[3],
        manager: summary[4],
      })

      const _manager = await campaign.methods.manager().call()
      setManager(_manager)

      const requestCount = await campaign.methods.getRequestCount().call()
      setRequestCount(requestCount)

      const _requests = await Promise.all(
        Array(parseInt(requestCount))
          .fill()
          .map((_, index) => campaign.methods.requests(index).call())
      )
      setRequests(_requests)
    } catch (e) {
      setErrorMessage(e.message.toString())
    }
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [userAddress])

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
      <h3>{requestCount} Requests Found!</h3>
      <Column alignItems="stretch">
        {requests.map((request, index) => (
          <RequestCard
            key={index}
            isOwner={userIsOwner}
            index={index}
            finalizeRequest={finalizeRequest}
            approveRequest={approveRequest}
            avaliableBalance={summary.balance}
            avaliableTotalApprovers={summary.totalApprovers}
            {...request}
          />
        ))}
      </Column>
    </Layout>
  )
}

export default Request
