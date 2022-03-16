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
  const [approvers, setApprovers] = useState([])

  const finalizeRequest = async function (index) {
    setLoading(true)

    try {
      const accounts = await web3.eth.getAccounts()
      const campaign = new web3.eth.Contract(JSON.parse(Campaign.interface), router.query.address)

      await campaign.methods.finalizeRequest(index).send({ from: accounts[0] })

      refresh()
    } catch (e) {
      setErrorMessage(e.message.toString())
    }
    setLoading(false)
  }

  const approveRequest = async function (index) {
    setLoading(true)

    try {
      const accounts = await web3.eth.getAccounts()
      const campaign = new web3.eth.Contract(JSON.parse(Campaign.interface), router.query.address)

      await campaign.methods.approve(index).send({ from: accounts[0] })

      refresh()
    } catch (e) {
      setErrorMessage(e.message.toString())
    }
    setLoading(false)
  }

  async function refresh() {
    try {
      setLoading(true)
      const accounts = await web3.eth.getAccounts()
      setUserAddress(accounts[0])

      const campaign = new web3.eth.Contract(JSON.parse(Campaign.interface), router.query.address)
      setCampaign(campaign)

      const _approvers = await campaign.methods.getApprovers().call()
      setApprovers(_approvers)

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
          .map((_, index) => campaign.methods.getRequestStatus(index, accounts[0]).call())
      )

      console.log(_requests)

      setRequests(
        _requests.map((_request) => ({
          value: parseInt(_request[0]),
          description: _request[1],
          recipient: _request[2],
          completed: _request[3],
          approved: _request[4],
          totalVotes: parseInt(_request[5]),
        }))
      )
    } catch (e) {
      setErrorMessage(e.message.toString())
    }
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [userAddress])

  const userIsOwner = manager == userAddress
  const userSignedin = approvers.find((a) => a == userAddress)
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
      <h3>Campaign Address: {address}</h3>
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
            userSignedin={userSignedin}
            {...request}
          />
        ))}
      </Column>
    </Layout>
  )
}

export default Request
