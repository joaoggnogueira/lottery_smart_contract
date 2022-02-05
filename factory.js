import web3 from "./web3"
import CampaignFactory from "./contract/CampaignFactory.json"

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xB6B94cC1Ca7B3a198c35cc85563A18291013549E"
)

export default instance
