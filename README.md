# CodeStream Browser extension

This is the browser extension for CodeStream, supporting Chrome ([Chrome Web Store](https://chrome.google.com/webstore/detail/FIXME/)) and Firefox ([Firefox Add-ons](https://addons.mozilla.org/firefox/addon/codestream/)). It adds a **Open in ...** button on PR pages, offers to auto-link PRs into your editor, and adds a **Start Work** button on Issue pages.

## Build

```
npm install --no-save && npm run build && npm run package
```

## Test

[Build](#build) the extension and

-   unzip `codestream.xpi` and load it as [“unpackaged extension” (Chrome)](https://developer.chrome.com/extensions/getstarted) or
-   load `codestream.xpi` as [“temporary add-on” (Firefox)](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension).

The extension is active until the next restart of your browser.

During development, as you rebuild, you can reload the extension without restarting your browser from the extensions page.
