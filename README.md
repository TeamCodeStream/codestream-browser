# CodeStream Browser extension

This is the browser extension for CodeStream, supporting Chrome ([Chrome Web Store](https://chrome.google.com/webstore/detail/FIXME/)) and Firefox ([Firefox Add-ons](https://addons.mozilla.org/firefox/addon/codestream/)). It adds a **Open in ...** button to the configured GitHub installations (defaults to domains containing `github.com`) which allows you to jump to a PR in your IDE

## Build

```
yarn install && yarn build && yarn package
```

## Test

[Build](#build) the extension and

- unzip `codestream.xpi` and load it as [“unpackaged extension” (Chrome)](https://developer.chrome.com/extensions/getstarted) or
- load `codestream.xpi` as [“temporary add-on” (Firefox)](https://blog.mozilla.org/addons/2015/12/23/loading-temporary-add-ons/).

The extension is active until the next restart of your browser.

During development, as you rebuild, you can reload the extension without restarting your browser from the extensions page.
