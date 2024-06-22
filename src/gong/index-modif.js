import {loadGetURLs} from "./utils/utils.js";
import {browserScript, writeFile} from "../common/common.js";


async function main() {
  await browserScript(async function (page) {
    const links = await loadGetURLs(page);

    const payload = {
      "data": links.filter(x => !x["name"].startsWith("get")),
    };

    await writeFile( "output/gong","index-modifications.json", payload)

  })
}

await main()
