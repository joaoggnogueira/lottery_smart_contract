import React, { useEffect, useState } from "react"
import Layout from "components/Layout"
import { useRouter } from "next/router"
import Campaign from "../../../contract/build/Campaign.json"
import { Form, Button, Input, Message } from "semantic-ui-react"

import { Row, Column, Margin } from "../../../styles/index.js"
import { Link, Router } from "../../../routes"

import web3 from "../../../web3"

const NewRequest = function () {
  const [description, setDescription] = useState("")
  const [value, setValue] = useState(100)
  const [recipient, setRecipient] = useState("")

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()
  const address = router.query.address

  const onSubmit = async function (evt) {
    setErrorMessage("")
    try {
      evt.preventDefault()
      setLoading(true)
      const accounts = await web3.eth.getAccounts()

      const campaign = new web3.eth.Contract(JSON.parse(Campaign.interface), router.query.address)

      await campaign.methods.createRequest(description, value, recipient).send({
        from: accounts[0],
      })

      Router.pushRoute(`/campaigns/${address}/requests`)

    } catch (e) {
      setErrorMessage(e.message.toString())
    }
    setLoading(false)
  }

  const inseryMyAddressAsRecipient = async function (evt) {
    evt.preventDefault()

    const accounts = await web3.eth.getAccounts()
    setRecipient(accounts[0])
  }

  return (
    <Layout>
      <Link route={`/campaigns/${address}/requests`}>
        <a>
          <Button icon="chevron left" content="GO TO CAMPAIGN" primary />
        </a>
      </Link>
      <h1>New request to the Campaign </h1>
      <p>
        <b>CAMPAIGN ADDRESS:</b> {address}
      </p>
      <Form onSubmit={onSubmit} error>
        <Form.Field>
          <label>Description</label>
          <Input
            placeholder="e. g. Buy new cables"
            value={description}
            onChange={(evt) => setDescription(evt.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Value</label>
          <Input
            label="Wei"
            labelPosition="right"
            value={value}
            style={{ width: 200 }}
            onChange={(evt) => setValue(evt.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Row>
            <Input
              value={recipient}
              placeholder="e.g. 0x10230dead0d340123100dedea"
              style={{ width: 400 }}
              onChange={(evt) => setRecipient(evt.target.value)}
            />
            <Margin ml={1}>
              <Button
                primary
                basic
                type="button"
                content="Insert my address as Recipient"
                icon="arrow left"
                onClick={inseryMyAddressAsRecipient}
              />
            </Margin>
          </Row>
        </Form.Field>
        {errorMessage ? <Message error header="Opss" content={errorMessage} /> : null}
        <Button primary loading={loading}>
          Submit
        </Button>
      </Form>
    </Layout>
  )
}

export default NewRequest
