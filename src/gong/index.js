import puppeteer from 'puppeteer';
import * as fs from 'fs';

const GongDocsPrefixURL = "https://gong.app.gong.io/settings/api/documentation#"
const ModelIndexURL = "https://gong.app.gong.io/settings/api/documentation#overview"
await main()

async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const links = await loadGetURLs(page);

  const payload = {
    "data": links,
  };
  const dir = "output/gong";
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(dir + '/index.json', JSON.stringify(payload, null, "\t"));

  await browser.close();
}

async function loadGetURLs(page) {
  await page.goto(ModelIndexURL);
  await page.setViewport({width: 1080, height: 1024});

  const links = await page.evaluate(() => {
    return Array.from(
      document.querySelector("rapi-doc").shadowRoot.querySelectorAll(".nav-bar-path"))
      .map(x => {
        let name = x.getAttribute("data-content-id");
        return {
          "name": name,
          "displayName": x.innerText
        }
      });
  });
  links.forEach(x => {
    x["url"] = GongDocsPrefixURL + x["name"];
  });

  return links.filter(x => x["name"].startsWith("get"));
}
