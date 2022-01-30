require("babel-register")({
  presets: ["es2015", "react"],
});
const axios = require("axios");

const apiRequest = "https://api.arnori.io/stats/allCollections";

const router = require("./sitemap-routes").default;
const Sitemap = require("react-router-sitemap").default;

async function generateSitemap() {
  try {
    const posts = await axios.get(apiRequest).then((response) => {
      const allCollections = response.data;

      let nameMap = [];

      for (var i = 0; i < allCollections.length; i++) {
        nameMap.push({ name: allCollections[i].symbol });
      }

      const paramsCollection = {
        "/collection/:name": nameMap,
      };
      const paramsNfts = {
        "/nfts/:name": nameMap,
      };

      return new Sitemap(router)
        .applyParams(paramsNfts)
        .applyParams(paramsCollection)
        .build("https://solens.io")
        .save("./public/sitemap.xml");
    });
  } catch (e) {
    console.log(e);
  }
}

generateSitemap();
