# CodeStream Browser extension

This is the browser extension for CodeStream, supporting Chrome ([Chrome Web Store](https://chrome.google.com/webstore/detail/FIXME/)) and Firefox ([Firefox Add-ons](https://addons.mozilla.org/firefox/addon/codestream/)). It adds a **Open in ...** button to the configured GitHub installations (defaults to domains containing `github.com`) which allows you to jump to a PR in your IDE

## Sandbox Installation (with dev_tools)

```
# Choose your sandbox name, for example:
MY_SB_NAME=cschrome

# install the sandbox
dt-sb-new-sandbox -yCD -t cs_chrome -n $MY_SB_NAME

# load your sandbox
dt-load $MY_SB_NAME

# create a playground file with a default name of 'csc'
dt-sb-create-playground -t $CS_CHROME_TOP/sandbox/playgrounds/default.template
```
From this point forward, when you want to load your playground into a shell,
just type:
```
dt-load-playground csc
```


## Build

```
npm install && npm run build && npm run package
```

## Test

[Build](#build) the extension and

- unzip `codestream.xpi` and load it as [“unpackaged extension” (Chrome)](https://developer.chrome.com/extensions/getstarted) or
- load `codestream.xpi` as [“temporary add-on” (Firefox)](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension).

The extension is active until the next restart of your browser.

During development, as you rebuild, you can reload the extension without restarting your browser from the extensions page.
