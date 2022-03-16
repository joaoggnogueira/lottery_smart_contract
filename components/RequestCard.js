import React from "react"
import { Card, Icon, Button, Message } from "semantic-ui-react"
import { Margin, Row } from "../styles"

const Header = ({
  index,
  description,
  recipient,
  value,
  isOwner,
  approved,
  completed,
  totalVotes,
  finalizeRequest,
  approveRequest,
  avaliableBalance,
  userSignedin,
  avaliableTotalApprovers,
}) => {
  const finalize = () => {
    finalizeRequest(index)
  }
  const approve = () => {
    approveRequest(index)
  }
  const renderOwnerActions = () => {
    const hasEnoughVotes = totalVotes > avaliableTotalApprovers / 2
    const hasEnoughBalance = avaliableBalance >= value
    let error = ""

    if (!hasEnoughBalance && !hasEnoughVotes) {
      error = "You already dont have enough votes, even balance to finalize it!"
    } else if (!hasEnoughBalance) {
      error = "You already dont have enough balance to finalize it!"
    } else if (!hasEnoughVotes) {
      error = "You already dont have enough votes to finalize it!"
    }

    return (
      <Row alignItems="stretch">
        <Button
          disabled={completed || error}
          icon="check circle"
          onClick={finalize}
          content="FINALIZE REQUEST"
          color="green"
        />
        {!error ? (
          <Message success style={{ marginTop: 0 }}>
            <Icon name="check circle" />
            You already have enough votes and balance to finalize
          </Message>
        ) : (
          <Message warning style={{ marginTop: 0 }}>
            <Icon name="warning sign" />
            {error}
          </Message>
        )}
      </Row>
    )
  }
  const renderContributorActions = () => {
    return (
      <Row>
        {approved ? (
          <Button
            disabled={true}
            icon="check circle"
            onClick={approve}
            content="YOU ALREADY APPROVED IT"
            color="green"
          />
        ) : userSignedin ? (
          <Button
            disabled={completed}
            icon="check circle"
            onClick={approve}
            content="APPROVE REQUEST"
            color="green"
          />
        ) : (
          <Button
            disabled={true}
            icon="warning sign"
            color="orange"
            content="YOU MUST CONTRIBUTE TO VOTE"
          />
        )}
      </Row>
    )
  }
  return (
    <Margin mt={2}>
      <Card style={{ width: "100%" }}>
        <Card.Content header={description} />
        <Card.Content>
          <Row alignItems="center">
            Required
            <Margin ml={2} mr={0}>
              <Icon name="money" />
            </Margin>
            {value} of {avaliableBalance}&nbsp; wei &nbsp;&nbsp; to the wallet
            <Margin ml={2} mr={0}>
              <Icon name="user circle" />
            </Margin>
            {recipient}
          </Row>
        </Card.Content>
        <Card.Content>
          {completed ? (
            <Message
              success
              header="Finalized"
              icon="circle check"
              content="This request has been finalized"
            />
          ) : (
            <Message
              primary
              header="Already pending!"
              icon="bullhorn"
              content={
                totalVotes + " of " + avaliableTotalApprovers + " contributors already approves it"
              }
            />
          )}
        </Card.Content>
        <Card.Content extra>
          {isOwner ? renderOwnerActions() : renderContributorActions()}
        </Card.Content>
      </Card>
    </Margin>
  )
}

export default Header
