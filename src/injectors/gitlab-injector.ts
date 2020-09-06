import * as domloaded from "dom-loaded";
import * as select from "select-dom";
import { ConfigProvider } from "../config";
import { ButtonInjector, InjectorBase, checkIsBtnUpToDate } from "./injector";
import { renderCodeStreamUrl, makeOpenInPopup } from "../utils";

namespace CodeStreamify {
	export const BTN_ID = "codestream-btn-nav";
	export const BTN_CLASS = "codestream-nav-btn";
}

export class GitlabInjector extends InjectorBase {
	constructor(protected readonly configProvider: ConfigProvider) {
		super(configProvider, [new RepositoryInjector()]);
	}

	canHandleCurrentPage(): boolean {
		const metaTags = document.getElementsByTagName("meta");
		for (let i = 0; i < metaTags.length; i++) {
			const metaTag = metaTags[i];
			if (metaTag.content.toLowerCase().includes("gitlab")) {
				return true;
			}
		}
		return false;
	}

	checkIsInjected(): boolean {
		const button = document.getElementById(`${CodeStreamify.BTN_ID}`);
		const currentUrl = renderCodeStreamUrl(this.config.codeHostURL);
		return checkIsBtnUpToDate(button, currentUrl);
	}

	async inject(): Promise<void> {
		await domloaded; // TODO(geropl) This is dead slow, improve.

		this.injectButtons(false);
	}

	async update(): Promise<void> {
		this.injectButtons(false);
	}
}

class RepositoryInjector implements ButtonInjector {
	static readonly PARENT_SELECTOR = ".tree-controls";

	isApplicableToCurrentPage(): boolean {
		const result =
			!!select.exists(RepositoryInjector.PARENT_SELECTOR) &&
			!!select.exists(".project-clone-holder");
		return result;
	}

	inject(ide: string, autoOpen: boolean, checkoutBranch: boolean) {
		const parent = select(RepositoryInjector.PARENT_SELECTOR);
		if (!parent || !parent.firstElementChild) {
			return;
		}

		const oldBtn = document.getElementById(CodeStreamify.BTN_ID);
		if (oldBtn && !checkIsBtnUpToDate(oldBtn, ide)) {
			return;
		}

		const btn = this.renderButton(ide, autoOpen, checkoutBranch);
		parent.firstElementChild.appendChild(btn);
	}

	protected renderButton(url: string, autoOpen: boolean, checkoutBranch: boolean): HTMLElement {
		const container = document.createElement("div");
		container.className = "project-clone-holder d-none d-md-inline-block";

		const container2ndLevel = document.createElement("div");
		container2ndLevel.className = "git-clone-holder js-git-clone-holder";

		const a = document.createElement("a");
		a.id = CodeStreamify.BTN_ID;
		a.title = "CodeStream";
		a.text = "CodeStream";
		a.href = url;
		a.target = "_blank";
		a.className = "btn btn-primary";

		if (autoOpen) {
			makeOpenInPopup(a);
		}

		container2ndLevel.appendChild(a);
		container.appendChild(container2ndLevel);
		return container;
	}
}
