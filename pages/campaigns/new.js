import React, { useState } from "react"
import Layout from "components/Layout"
import { Form, Button, Input, Message } from "semantic-ui-react"
import factory from "factory"
import web3 from "../../web3"

import { Router } from "../../routes"

const NewCampaign = function () {
  const [minimunContribution, setMinimunContribution] = useState(100)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const onSubmit = async function (evt) {
    setErrorMessage("")
    try {
      evt.preventDefault()
      setLoading(true)
      const accounts = await web3.eth.getAccounts()

      await factory.methods.createCampaign(minimunContribution).send({ from: accounts[0] })

      Router.pushRoute("/")
    } catch (e) {
      setErrorMessage(e.message.toString())
    }
    setLoading(false)
  }

  return (
    <Layout>
      <h1>New campaign</h1>
      <Form onSubmit={onSubmit} error>
        <Form.Field>
          <label>Minimun Contribution</label>
          <Input
            value={minimunContribution}
            label="Wei"
            labelPosition="right"
            type="number"
            style={{ width: 200 }}
            onChange={(evt) => setMinimunContribution(evt.target.value)}
          />
        </Form.Field>
        {errorMessage ? <Message error header="Opss" content={errorMessage} /> : null}
        <Button primary loading={loading}>
          Submit
        </Button>
      </Form>
    </Layout>
  )
}

export default NewCampaign
