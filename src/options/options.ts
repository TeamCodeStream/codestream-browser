import { ConfigProvider } from "../config";

const codestreamUrlInput = document.getElementById(
  "codestream-url-input"
)! as HTMLInputElement;
const codestreamAutoOpenInput = document.getElementById(
  "codestream-auto-open"
)! as HTMLInputElement;
const messageElement = document.getElementById("message")! as HTMLDivElement;

const init = async () => {
  const configProvider = await ConfigProvider.create();

  // Initialize UI
  const initialConfig = configProvider.getConfig();
  codestreamUrlInput.value = initialConfig.codestreamURL;
  codestreamAutoOpenInput.checked = initialConfig.openAsPopup;

  let timeout: number | undefined = undefined;

  // Save config before close
  const save = () => {
    // Update config (propagated internally)
    configProvider.setConfig({
      codestreamURL: codestreamUrlInput.value || undefined,
      openAsPopup: codestreamAutoOpenInput.checked,
    });
    if (timeout) {
      window.clearTimeout(timeout);
      timeout = undefined;
    }
    messageElement.innerText = "Saved.";
    timeout = window.setTimeout(() => {
      messageElement.innerText = "";
      timeout = undefined;
    }, 3000);
  };
  codestreamUrlInput.addEventListener("keyup", (event: KeyboardEvent) => {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    save();
  });
  codestreamAutoOpenInput.addEventListener("change", save);
};

init().catch((err) => console.error(err));
