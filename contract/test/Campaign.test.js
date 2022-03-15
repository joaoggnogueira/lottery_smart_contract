//Unit Test Libraries
const assert = require("assert")

//Ganache Interface
const ganache = require("ganache-cli")

//Web3 Constructor
const Web3 = require("web3")

const web3 = new Web3(ganache.provider())

require("../compile")

const compiledCampaign = require("../build/Campaign.json")
const compiledFactory = require("../build/CampaignFactory.json")

let accounts
let factory
let campaign

beforeEach("get a list of all accounts", async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts()

  //Use one of those accounts to deploy the contract
  const contract_campaign = new web3.eth.Contract(JSON.parse(compiledCampaign["interface"]))
  campaign = await contract_campaign
    .deploy({ data: compiledCampaign["bytecode"], arguments: [10000, accounts[0]] })
    .send({ from: accounts[0], gas: "1000000" })

  const contract_factory = new web3.eth.Contract(JSON.parse(compiledFactory["interface"]))
  factory = await contract_factory
    .deploy({ data: compiledFactory["bytecode"], arguments: [] })
    .send({ from: accounts[0], gas: "1000000" })
})

describe("Factory", () => {
  it("deploys a contract", () => {
    assert.ok(factory.options.address)
  })
  it("starts empty", async () => {
    let campaigns = await factory.methods.getDeployedCampaigns().call()

    assert(Array.isArray(campaigns))
    assert.equal(campaigns.length, 0)
  })
  it("create a Campaign", async () => {
    await factory.methods.createCampaign(100).send({
      from: accounts[0],
      gas: 1000000,
    })
    campaigns = await factory.methods.getDeployedCampaigns().call()

    assert.equal(campaigns.length, 1)
    assert.ok(campaigns[0])
    console.log(campaigns[0])

    const campaign = new web3.eth.Contract(JSON.parse(compiledCampaign["interface"]), campaigns[0])

    assert.ok(campaign)
    assert.ok(campaign.options.address)
  })
})

describe("Campaign", () => {
  let required_wei

  it("deploys a contract", () => {
    assert.ok(campaign.options.address)
  })

  it("has the default contract", async () => {
    const manager = await campaign.methods.manager().call()
    assert.ok(manager)
  })

  it("singup as approver", async () => {
    let approvers = await campaign.methods.getApprovers().call()
    assert(Array.isArray(approvers))
    assert.equal(approvers.length, 0)

    await campaign.methods.contribute().send({
      from: accounts[1],
      value: 10000,
    })

    approvers = await campaign.methods.getApprovers().call()
    assert.ok(Array.isArray(approvers))
    assert.equal(approvers[0], accounts[1])
    assert.equal(approvers.length, 1)

    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: 10,
      })
      assert.ok(false)
    } catch (e) {
      assert.ok(e)
    }
  })

  it("double approve an request", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: 10000,
    })

    await campaign.methods.contribute().send({
      from: accounts[1],
      value: 10000,
    })

    let approvers = await campaign.methods.getApprovers().call()
    assert.equal(approvers[0], accounts[1])
    assert.equal(approvers.length, 1)

    const summary = await campaign.methods.getSummary().call()
    assert.ok(summary[1] === "20000")
  })

  it("create an request", async () => {
    await campaign.methods.createRequest("Loren Ipsun dolor a sit amet", 15000, accounts[0]).send({
      from: accounts[0],
      gas: 3000000,
    })

    const request = await campaign.methods.requests(0).call()

    assert.ok(request)
    assert.equal(request.value, 15000)
    assert.equal(request.recipient, accounts[0])
    assert.equal(request.description, "Loren Ipsun dolor a sit amet")
    assert.equal(request.totalVotes, 0)
  })

  it("approve an request", async () => {
    await campaign.methods.createRequest("Loren Ipsun dolor a sit amet", 15000, accounts[0]).send({
      from: accounts[0],
      gas: 3000000,
    })

    await campaign.methods.contribute().send({
      from: accounts[1],
      value: 10000,
    })

    await campaign.methods.contribute().send({
      from: accounts[2],
      value: 10000,
    })

    await campaign.methods.approve(0).send({
      from: accounts[1],
      gas: 3000000,
    })

    let request = await campaign.methods.requests(0).call()

    assert.ok(request)
    assert.equal(request.totalVotes, 1)

    await campaign.methods.approve(0).send({
      from: accounts[2],
      gas: 3000000,
    })

    request = await campaign.methods.requests(0).call()

    assert.ok(request)
    assert.equal(request.totalVotes, 2)

    try {
      //try to approve twice
      await campaign.methods.approve(0).send({
        from: accounts[1],
        gas: 3000000,
      })
      assert(false)
    } catch (e) {
      assert.ok(e)
    }
    try {
      //try to approve a false request
      await campaign.methods.approve(1).send({
        from: accounts[1],
        gas: 3000000,
      })
      assert(false)
    } catch (e) {
      assert.ok(e)
    }
    try {
      //try to approve without contribute
      await campaign.methods.approve(0).send({
        from: accounts[3],
        gas: 3000000,
      })
      assert(false)
    } catch (e) {
      assert.ok(e)
    }
  })

  it("finalize an request", async () => {
    await campaign.methods.createRequest("Loren Ipsun dolor a sit amet", 15000, accounts[0]).send({
      from: accounts[0],
      gas: 3000000,
    })

    try {
      //try to approve without enought votes
      await campaign.methods.finalizeRequest(0).send({
        from: accounts[0],
        gas: 3000000,
      })
      assert(false)
    } catch (e) {
      assert.ok(e)
    }

    await campaign.methods.contribute().send({
      from: accounts[1],
      value: 10000,
    })

    await campaign.methods.contribute().send({
      from: accounts[2],
      value: 10000,
    })

    await campaign.methods.approve(0).send({
      from: accounts[1],
      gas: 3000000,
    })

    await campaign.methods.approve(0).send({
      from: accounts[2],
      gas: 3000000,
    })

    try {
      //try to approve without be the owner
      await campaign.methods.finalizeRequest(0).send({
        from: accounts[1],
        gas: 3000000,
      })
      assert(false)
    } catch (e) {
      assert.ok(e)
    }

    let request = await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: 3000000,
    })

    request = await campaign.methods.requests(0).call()

    assert.ok(request)
    assert.equal(request.completed, true)

    try {
      //try to approve twice
      await campaign.methods.finalizeRequest(0).send({
        from: accounts[0],
        gas: 3000000,
      })
      assert(false)
    } catch (e) {
      assert.ok(e)
    }
  })

  it("finalize an request with insuficient balance", async () => {
    await campaign.methods.createRequest("Loren Ipsun dolor a sit amet", 30000, accounts[0]).send({
      from: accounts[0],
      gas: 3000000,
    })

    await campaign.methods.contribute().send({ //+10000
      from: accounts[1],
      value: 10000,
    })

    await campaign.methods.contribute().send({ //+10000
      from: accounts[2],
      value: 10000,
    })

    await campaign.methods.approve(0).send({
      from: accounts[1],
      gas: 3000000,
    })

    await campaign.methods.approve(0).send({
      from: accounts[2],
      gas: 3000000,
    })

    try {
      let request = await campaign.methods.finalizeRequest(0).send({
        from: accounts[0],
        gas: 3000000,
      })
      assert(false)
    } catch (e) {
      assert.ok(e)
    }
  })

  it("get summary and get request counts", async () => {
    const requestCounts0 = await campaign.methods.getRequestCount().call()
    assert.equal(requestCounts0, 0)

    await campaign.methods.createRequest("Loren Ipsun dolor a sit amet", 15000, accounts[0]).send({
      from: accounts[0],
      gas: 3000000,
    })

    const requestCounts1 = await campaign.methods.getRequestCount().call()
    assert.equal(requestCounts1, 1)

    await campaign.methods.contribute().send({
      from: accounts[1],
      value: 10000,
    })

    await campaign.methods.contribute().send({
      from: accounts[2],
      value: 10000,
    })

    await campaign.methods.approve(0).send({
      from: accounts[1],
      gas: 3000000,
    })

    await campaign.methods.approve(0).send({
      from: accounts[2],
      gas: 3000000,
    })

    const summary = await campaign.methods.getSummary().call()
    assert.ok(summary)
    assert.ok(summary[0] === "10000")
    assert.ok(summary[1] === "20000")
    assert.ok(summary[2] === "1")
    assert.ok(summary[3] === "2")
    assert.ok(summary[4] === accounts[0])
  })
})
