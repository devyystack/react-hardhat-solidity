// const baseAuthUrl = `http://3.133.29.104:8000`;
const baseAuthUrl = `https://celebart.io`;
// const baseAuthUrl = `http://18.220.188.83:8000`;
export const URLS = {
  submitProfileApi: `${baseAuthUrl}/app/createUser`,
  getProfileData: `${baseAuthUrl}/app/getUser`,
  getTopUser: `${baseAuthUrl}/app/getTopUser`,
  createnftmint: `${baseAuthUrl}/app/mintNft`,
  getOwnedCollection: `${baseAuthUrl}/app/getCollection`,
  getAllNFTs: `${baseAuthUrl}/app/getAllSaleNft`,
  getOnSaleNftCollection: `${baseAuthUrl}/app/getOnSaleNft`,
  getOnAuctionNFTCollection: `${baseAuthUrl}/app/getAuctionNft`,
  pathNftStatus: `${baseAuthUrl}/app/updateNftStatus/`,
  getCategoryList: `${baseAuthUrl}/app/getCategory`,
  getSubCategoryList: `${baseAuthUrl}/app/getSubCategory`,
  getNftSaleCategory: `${baseAuthUrl}/app/getNftSaleCategory`,
  updateNftMint: `${baseAuthUrl}/app/updateNftMint`,
  resellNftList:`${baseAuthUrl}/app/getNft`,
};
export default URLS;
