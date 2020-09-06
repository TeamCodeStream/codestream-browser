import { browser } from "webextension-polyfill-ts";
// import { ConfigProvider } from "./config";

async function codestreamifyCurrentTab() {
	try {
		// add a dummy div element to indicate that codestreamify.bundle.js was injected by a user click on the codestream icon
		browser.tabs.executeScript({
			code:
				'document.body.innerHTML += \'<div style="display: none;" id="codestream-extension-icon-clicked"></div>\'',
		});
		browser.tabs.executeScript({
			file: "/dist/bundles/codestreamify.bundle.js",
		});
	} catch {
		try {
			// const configProvider = await ConfigProvider.create();
			// const config = configProvider.getConfig();
			window.open("https://codestream.com");
			//   window.open(config.codeHostURL);
		} catch {
			window.open("https://codestream.com");
		}
	}
}

browser.browserAction.onClicked.addListener(codestreamifyCurrentTab);
