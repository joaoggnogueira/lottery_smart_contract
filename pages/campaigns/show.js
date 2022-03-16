import React, { useEffect, useState } from "react"
import Layout from "components/Layout"
import Campaign from "../../contract/build/Campaign.json"
import { Message, Input, Form, Button, Icon, Dimmer, Loader } from "semantic-ui-react"
import { useRouter } from "next/router"
import { Row, Column, Padding, StatCard } from "../../styles/index.js"
import { Link } from "../../routes"

import web3 from "../../web3"

const Show = function () {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [summary, setSummary] = useState({})

  const [contribution, setContribution] = useState(0)
  const [loadingContribute, setLoadingContribute] = useState(false)
  const [contributeErrorMessage, setContributeErrorMessage] = useState(false)

  const [userAddress, setUserAddress] = useState("")
  const [campaign, setCampaign] = useState(false)

  const [approvers, setApprovers] = useState([])

  const router = useRouter()

  async function refresh() {
    try {
      setLoading(true)
      const accounts = await web3.eth.getAccounts()

      setUserAddress(accounts[0])

      const campaign = new web3.eth.Contract(JSON.parse(Campaign.interface), router.query.address)
      setCampaign(campaign)
      const summary = await campaign.methods.getSummary().call()
      setSummary({
        minimunContribution: summary[0],
        balance: summary[1],
        requests: summary[2],
        totalApprovers: summary[3],
        manager: summary[4],
      })

      const _approvers = await campaign.methods.getApprovers().call()
      setApprovers(_approvers)

      setContribution(parseInt(summary[0]))
    } catch (e) {
      setErrorMessage(e.message.toString())
    }
    setLoading(false)
  }

  useEffect(() => {
    if (router.isReady) {
      console.log(router.isReady)
      if (!router.query.address) {
        router.push("/")
      }
      refresh()
    }
  }, [router.isReady])

  async function onContribute(evt) {
    setContributeErrorMessage("")
    try {
      evt.preventDefault()
      setLoadingContribute(true)
      const accounts = await web3.eth.getAccounts()
      await campaign.methods.contribute().send({ from: accounts[0], value: parseInt(contribution) })

      refresh()
    } catch (e) {
      setContributeErrorMessage(e.message.toString())
    }
    setLoadingContribute(false)
  }

  function renderContributeButtons() {
    return (
      <Form onSubmit={onContribute} error>
        <Form.Field>
          <label>Contribution ammount</label>
          <Input
            value={contribution}
            label="Wei"
            labelPosition="right"
            type="number"
            style={{ width: 200 }}
            onChange={(evt) => setContribution(evt.target.value)}
          />
        </Form.Field>
        {contributeErrorMessage ? (
          <Message error header="Opss" content={contributeErrorMessage} />
        ) : null}
        <Button primary loading={loadingContribute}>
          Submit
        </Button>
      </Form>
    )
  }

  const address = router.query.address
  const userIsOwner = summary.manager == userAddress
  return (
    <Layout>
      <Dimmer active={loading} inverted>
        <Loader>Loading</Loader>
      </Dimmer>
      <Padding pb={3}>
        <Row justifyContent="space-between" alignItems="center">
          <Link route={`/`}>
            <a>
              <Button icon="chevron left" content="GO TO CAMPAIGNS" primary />
            </a>
          </Link>

          <Button icon="refresh" content="REFRESH" primary onClick={refresh} />
        </Row>
      </Padding>
      <Row>
        <Column>
          <h3>
            <Icon name="object group" />
            Campaign Address
            <br /> {address}
          </h3>
          {errorMessage ? <Message error header="Opss" content={errorMessage} /> : null}
          <Padding pt="2" pb="4">
            <p>
              <Icon name="user circle" />
              Manager Address
              <br /> {summary.manager}
            </p>
          </Padding>
        </Column>
      </Row>
      <Padding pt="2" pb="4">
        <div>
          <Row flexWrap="wrap" alignItems="stretch">
            <StatCard
              total={summary.minimunContribution}
              unit="wei"
              description="Minimum Contribution"
            />
            <StatCard total={summary.balance} unit="wei" description="Balance" />

            <StatCard
              total={summary.requests}
              description="Requests"
              linkTitle="click to see all requests"
            />

            <StatCard total={summary.totalApprovers} description="Approvers" />
          </Row>
        </div>
      </Padding>
      <Padding pt="2" pb="4">
        {userIsOwner ? (
          <Message success header="You're the owner of the project" />
        ) : (
          renderContributeButtons()
        )}
      </Padding>
      <Padding pt="2" pb="4">
        <Link route={`/campaigns/${address}/requests`}>
          <a>
            <Button icon="list ul" content="SEE THE REQUESTS" primary />
          </a>
        </Link>
      </Padding>
    </Layout>
  )
}

export default Show
