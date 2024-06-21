import * as fs from 'fs';
import puppeteer from "puppeteer";
import json5 from "json5";

await main()

async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const modelsIndex = JSON.parse(fs.readFileSync('output/gong/index.json', 'utf8'));

  const schemaRegistry = {
    "data": {},
  }
  for (const x of modelsIndex["data"]) {
    const fields = await getObjectMetadata(page, x["url"]);
    if (fields.length > 0) {
      let entry = {
        "displayName": x["displayName"],
        "url": x["url"],
        "fields": {},
      };
      let name = x["name"].split("v2/")[1];
      schemaRegistry["data"][name] = entry;
      fields.forEach(field => {
        entry["fields"][field] = field;
      });
    }

  }

  const dir = "output/gong";
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(dir + '/schemas.json', JSON.stringify(schemaRegistry, null, "\t"));

  await browser.close();
}


async function getObjectMetadata(page, modelURL) {
  await page.goto(modelURL);

  // const description = await page.evaluate(() => {
  //   return document.querySelector("rapi-doc").shadowRoot.querySelector(".m-markdown").innerText;
  // });

  // click tab EXAMPLE to get response example in JSON
  await page.evaluate(() => {
    document.querySelector("rapi-doc").shadowRoot.querySelector('api-response').shadowRoot.querySelector("button[data-tab='example']").click();
  });
  let response = await page.evaluate(() => {
    return document.querySelector("rapi-doc").shadowRoot.querySelector('api-response').shadowRoot.querySelector("json-tree").shadowRoot.querySelector(".inside-bracket").innerText;
  });
  // PROBLEM: in some cases malformed, unescaped strings are present that break JSON format.
  // HACK: We don't care what is inside the quotes. The whole string to be replaced with empty string.
  response = response.replace(/"(.*)"/g, '""');
  const data = json5.parse("{" + response + "}");

  let arr = null;
  let count = 0;
  let keys = Object.keys(data);
  for (let i in keys) {
    let key = keys[i];
    let value = data[key];
    if (Array.isArray(value)) {
      arr = value;
      count += 1;
    }
  }
  if (count === 1) {
    return Object.keys(arr[0]);
  } else {
    console.log("WARN: perform manual check for", modelURL);
    return [];
  }
}
