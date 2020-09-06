import { ConfigProvider } from "../config";
import { IDEs } from "../utils";

const codestreamUrlInput = document.getElementById("codestream-url-input")! as HTMLInputElement;
const codestreamAutoOpenInput = document.getElementById(
	"codestream-auto-open"
)! as HTMLInputElement;
const codestreamCheckoutBranchInput = document.getElementById(
	"codestream-checkout-branch"
)! as HTMLInputElement;
const codestreamIDESelect = document.getElementById("codestream-ide-select")! as HTMLDivElement;
const messageElement = document.getElementById("message")! as HTMLDivElement;

const init = async () => {
	const configProvider = await ConfigProvider.create();

	// Initialize UI
	const initialConfig = configProvider.getConfig();
	codestreamUrlInput.value = initialConfig.codestreamURL;
	codestreamAutoOpenInput.checked = initialConfig.autoOpen;
	codestreamCheckoutBranchInput.checked = initialConfig.checkoutBranch;

	const selectedIde = initialConfig.ide;

	IDEs.forEach((ide) => {
		const ideOption = document.createElement("option");
		ideOption.innerHTML = ide.moniker;
		if (ide.moniker === selectedIde) ideOption.selected = true;
		codestreamIDESelect.appendChild(ideOption);
	});

	let timeout: number | undefined = undefined;

	// Save config before close
	const save = () => {
		// Update config (propagated internally)
		configProvider.setConfig({
			codestreamURL: codestreamUrlInput.value || undefined,
			autoOpen: codestreamAutoOpenInput.checked,
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
