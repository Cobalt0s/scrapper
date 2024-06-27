import {loadGetURLs} from "./utils/utils.js";
import {browserScript, writeFile} from "../common/common.js";


async function main() {
  await browserScript(async function (page) {
    const links = await loadGetURLs(page);

    let summary = {};
    for (let i = links.length - 1; i >= 0; i--) {
      let parts = links[i]["name"].split("-/v2/");
      let operation = parts[0];
      let resource = parts[1];
      if (resource in summary) {
        summary[resource]["operations"].push(operation);
      } else {
        summary[resource] = {
          "resource": resource,
          "operations": [operation],
          "url": links[i]["url"],
        };
      }
    }
    let operations = [];
    Object.keys(summary).forEach(key => {
      operations.push(summary[key]);
    })

    operations.sort(function(a, b){
      return b["operations"].length - a["operations"].length;
    });
    await writeFile("output/gong", "operations.json", {
      "data": operations
    })
  })
}

await main()
