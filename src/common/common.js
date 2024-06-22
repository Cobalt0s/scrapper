import puppeteer from "puppeteer";
import fs from "fs";

export async function browserScript(callback) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await callback(page);

  await browser.close();
}

export async function writeFile(dir, name, data) {
  fs.mkdirSync(dir, {recursive: true})
  fs.writeFileSync(dir + '/' + name, JSON.stringify(data, null, "\t"));
}
