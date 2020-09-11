# Managing codestream-browser through sandbox tools

## Installation

```
# Choose your sandbox name, for example:
MY_SB_NAME=csbrowser

# install the sandbox
dt-sb-new-sandbox -yCD -t cs_browse -n $MY_SB_NAME

# load your sandbox
dt-load $MY_SB_NAME

# create a playground file with a default name of 'csc'
dt-sb-create-playground -t $CS_BROWSER_TOP/sandbox/playgrounds/default.template
```

From this point forward, when you want to load your playground into a shell,
just type:

```
dt-load-playground csc
```

