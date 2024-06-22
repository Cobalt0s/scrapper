import {loadGetURLs} from "./utils/utils.js";
import {browserScript, writeFile} from "../common/common.js";


async function main() {
  await browserScript(async function (page) {
    const links = await loadGetURLs(page);

    const payload = {
      "data": filterModificationOpp(links)
    };

    await writeFile("output/gong", "index-modifications.json", payload)

  })
}

function filterModificationOpp(links) {
  return links
    .filter(x => !x["name"].startsWith("get"))
}

function filterCreateOppAndSingularObjectNames(links) {
  return links
    .filter(x => !x["name"].startsWith("get"))
    .filter(x => !x["displayName"].startsWith("Retrieve"))
    .filter(x => !x["displayName"].startsWith("List"))
    .filter(x => !x["displayName"].startsWith("Update"))
    .filter(x => !x["displayName"].startsWith("Delete"))
    .filter(x => !x["name"].startsWith("delete"))
    .filter(x => (x["name"].split("v2/")[1].match(/\//g) || []).length === 0) // no slashes after `v2/`
}

function filterDeleteOpp(links) {
  return links
    .filter(x => x["displayName"].startsWith("Delete") || x["name"].startsWith("delete"))
}

await main()
