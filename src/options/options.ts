import { ConfigProvider } from "../config";
import { IDEs } from "../utils";

const codeHostInput = document.getElementById("codestream-code-host-url")! as HTMLInputElement;
const autoOpenInput = document.getElementById("codestream-auto-open")! as HTMLInputElement;
const checkoutBranchInput = document.getElementById(
	"codestream-checkout-branch"
)! as HTMLInputElement;
const IDESelect = document.getElementById("codestream-ide-select")! as HTMLOptionElement;
const messageElement = document.getElementById("message")! as HTMLDivElement;

const init = async () => {
	const configProvider = await ConfigProvider.create();

	// Initialize UI
	const initialConfig = configProvider.getConfig();
	codeHostInput.value = initialConfig.codeHostURL;
	autoOpenInput.checked = initialConfig.autoOpen;
	checkoutBranchInput.checked = initialConfig.checkoutBranch;

	let timeout: number | undefined = undefined;

	// Save config before close
	const save = () => {
		// Update config (propagated internally)
		configProvider.setConfig({
			codeHostURL: codeHostInput.value || undefined,
			autoOpen: autoOpenInput.checked,
			checkoutBranch: checkoutBranchInput.checked,
			ide: IDESelect.value,
		});
		if (timeout) {
			window.clearTimeout(timeout);
			timeout = undefined;
		}
		messageElement.innerText = "Saved.";
		timeout = window.setTimeout(() => {
			messageElement.innerHTML = "&nbsp;";
			timeout = undefined;
		}, 3000);
	};

	const selectedIde = initialConfig.ide;
	IDEs.forEach((ide) => {
		const option = document.createElement("option");
		option.value = ide.moniker;
		option.innerText = ide.ideName;
		if (ide.moniker === selectedIde) option.selected = true;
		IDESelect.appendChild(option);
	});
	IDESelect.addEventListener("change", save);

	codeHostInput.addEventListener("keyup", (event: KeyboardEvent) => {
		if (event.isComposing || event.keyCode === 229) {
			return;
		}
		save();
	});
	autoOpenInput.addEventListener("change", save);
	checkoutBranchInput.addEventListener("change", save);
};

init().catch((err) => console.error(err));
