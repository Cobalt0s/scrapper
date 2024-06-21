import puppeteer from 'puppeteer';
import json5 from "json5";

const GongDocsPrefixURL = "https://gong.app.gong.io/settings/api/documentation#"
const ModelIndexURL = "https://gong.app.gong.io/settings/api/documentation#overview"
await main()

async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // console.log(await loadGetURLs(page));
  console.log(await getObjectMetadata(page, "get-/v2/calls"));
  await browser.close();
}

async function loadGetURLs(page) {
  await page.goto(ModelIndexURL);
  await page.setViewport({width: 1080, height: 1024});

  const links = await page.evaluate(() => {
    return Array.from(
      document.querySelector("rapi-doc").shadowRoot.querySelectorAll(".nav-bar-path"))
      .map(x => x.getAttribute("data-content-id"));
  });

  // const postLinks = links.filter(x => x.startsWith("post"))
  // const putLinks = links.filter(x => x.startsWith("put"))
  // const deleteLinks = links.filter(x => x.startsWith("delete"))

  return links.filter(x => x.startsWith("get"));
}

async function getObjectMetadata(page, currentDoc){
  await page.goto(GongDocsPrefixURL + currentDoc);
  console.log(currentDoc)

  const description = await page.evaluate(() => {
    return document.querySelector("rapi-doc").shadowRoot.querySelector(".m-markdown").innerText;
  });
  console.log(description);

  // click tab EXAMPLE to get response example in JSON
  await page.evaluate(() => {
    document.querySelector("rapi-doc").shadowRoot.querySelector('api-response').shadowRoot.querySelector("button[data-tab='example']").click();
  });
  const response = await page.evaluate(() => {
    return document.querySelector("rapi-doc").shadowRoot.querySelector('api-response').shadowRoot.querySelector("json-tree").shadowRoot.querySelector(".inside-bracket").innerText;
  });
  const data = json5.parse("{"+ response + "}");

  return Object.keys(data);
}