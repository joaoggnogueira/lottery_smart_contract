import web3 from "./web3"
import CampaignFactory from "./contract/build/CampaignFactory.json"

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xEd915C8fC4F8486c34b5b92dc47A1C2A6a1e4de9"
)

export default instance
