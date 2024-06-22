
const GongDocsPrefixURL = "https://gong.app.gong.io/settings/api/documentation#"
const ModelIndexURL = "https://gong.app.gong.io/settings/api/documentation#overview"

export async function loadGetURLs(page) {
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

  return links;
}
