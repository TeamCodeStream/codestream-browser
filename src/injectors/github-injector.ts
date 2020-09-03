import * as select from "select-dom";
import * as ghInjection from "github-injection";
import { ConfigProvider } from "../config";
import { ButtonInjector, InjectorBase, checkIsBtnUpToDate } from "./injector";
import { renderCodeStreamUrl, openEditor, IDEs } from "../utils";

namespace CodeStreamify {
  export const NAV_BTN_ID = "codestream-btn-nav";
  export const NAV_BTN_CLASS = "codestream-nav-btn";
  export const NAV_BTN_CLASS_SELECTOR = "." + NAV_BTN_CLASS;

  export const CSS_REF_BTN_CONTAINER = "codestream-btn-container";
  export const CSS_REF_NO_CONTAINER = "no-container";
}

/**
 * This implementation currently assumes that there is only ever one button per page
 */
export class GitHubInjector extends InjectorBase {
  protected configProvider: ConfigProvider;
  constructor(configProvider: ConfigProvider) {
    super(configProvider, [
      new PullInjector(),
      new IssueInjector(),
      new FileInjector(),
      new NavigationInjector(),
      new EmptyRepositoryInjector(),
    ]);
    this.configProvider = configProvider;
  }

  canHandleCurrentPage(): boolean {
    // TODO Does this work for GitHub Enterprise, too?
    const metaTags = document.getElementsByTagName("meta");
    for (let i = 0; i < metaTags.length; i++) {
      const metaTag = metaTags[i];
      if (metaTag.name === "hostname" && metaTag.content.includes("github")) {
        return true;
      }
    }
    return false;
  }

  checkIsInjected(): boolean {
    const button = document.getElementById(`${CodeStreamify.NAV_BTN_ID}`);
    const currentUrl = renderCodeStreamUrl(this.config.codestreamURL);
    return checkIsBtnUpToDate(button, currentUrl);
  }

  async inject(): Promise<void> {
    // ghInjection triggers an event whenever only parts of the GitHub page have been reloaded
    ghInjection(() => {
      if (!this.checkIsInjected()) {
        this.injectButtons();
      }
    });
  }

  async update(): Promise<void> {
    this.injectButtons();
  }
}

abstract class ButtonInjectorBase implements ButtonInjector {
  constructor(
    protected readonly parentSelector: string,
    protected readonly btnClasses: string,
    protected readonly float: boolean = true,
    protected readonly asFirstChild: boolean = false
  ) {}

  abstract isApplicableToCurrentPage(): boolean;

  inject(ide: string, autoOpen: boolean) {
    const actionbar = select(this.parentSelector);
    if (!actionbar) {
      return;
    }

    const oldBtn = document.getElementById(CodeStreamify.NAV_BTN_ID);
    if (oldBtn) {
      return;
    }

    const btn = this.renderButton(ide, autoOpen);

    const btnGroup = actionbar.getElementsByClassName("BtnGroup");
    if (
      btnGroup &&
      btnGroup.length > 0 &&
      btnGroup[0].classList.contains("float-right")
    ) {
      actionbar.insertBefore(btn, btnGroup[0]);
    } else if (this.asFirstChild && actionbar) {
      actionbar.insertBefore(btn, actionbar.firstChild);
    } else {
      actionbar.appendChild(btn);
    }
  }

  protected toggleDropdown() {
    const dd = document.getElementById("codestream-ide-dropdown");
    const modal = document.getElementById("codestream-modal");
    if (dd && modal) {
      if (dd.classList.contains("hidden")) {
        modal.classList.add("active");
        dd.classList.remove("hidden");
      } else {
        modal.classList.remove("active");
        dd.classList.add("hidden");
      }
    }
  }

  protected reRenderButton(ide: string, autoOpen: boolean) {
    const oldBtn = document.getElementById(CodeStreamify.CSS_REF_BTN_CONTAINER);
    if (oldBtn) oldBtn.replaceWith(this.renderButton(ide, autoOpen));
  }

  protected renderButton(ide: string, autoOpen: boolean): HTMLElement {
    let classes = this.btnClasses + ` ${CodeStreamify.NAV_BTN_CLASS}`;
    if (this.float) {
      classes = classes + ` float-right`;
    }

    const container = document.createElement("div");
    container.id = CodeStreamify.CSS_REF_BTN_CONTAINER;
    container.className = classes;

    const m = document.createElement("div");
    m.id = "codestream-modal";
    m.onclick = (ev) => {
      this.toggleDropdown();
    };

    const selectedIde = IDEs.find((_) => _.moniker === ide) || IDEs[0];

    if (autoOpen) {
      // openEditor(selectedIde.moniker, { url: window.location.href });
    }

    const a = document.createElement("a");
    a.id = CodeStreamify.NAV_BTN_ID;
    a.title = "CodeStream";
    a.innerHTML = `<img width='14' height='14' style='vertical-align: -2px' src='https://images.codestream.com/ides/128/${selectedIde.moniker}.png'> Open in ${selectedIde.ideName}`;
    // a.href = url;
    a.onclick = (ev) => {
      openEditor(selectedIde.moniker, { url: window.location.href });
    };
    a.target = "_blank";
    // if (autoOpen) {
    // makeOpenInPopup(a);
    // }
    a.className = "btn btn-sm";

    const a2 = document.createElement("a");
    a2.id = CodeStreamify.NAV_BTN_ID + "-2";
    a2.title = "Open Options";
    a2.innerHTML = "<span class='dropdown-caret'></span>";
    a2.onclick = (ev) => {
      this.toggleDropdown();
    };
    // a.href = url;
    // a.target = "_blank";
    // if (autoOpen) {
    // makeOpenInPopup(a2);
    // }
    a2.className = "btn btn-sm";

    this.adjustButton(a);

    container.appendChild(m);
    container.appendChild(a);
    container.appendChild(a2);

    const dropdown = document.createElement("div");
    dropdown.id = "codestream-ide-dropdown";
    dropdown.className =
      "mt-1 position-absolute Box box-shadow-medium text-gray-dark right-0 dropdown hidden";

    const ddBody = document.createElement("div");
    ddBody.className = "select-menu-list";
    dropdown.appendChild(ddBody);

    const checkRow = document.createElement("div");
    checkRow.className = "select-menu-item";
    checkRow.title =
      "Automatically open PRs in your IDE when you visit the PR web page.";
    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = autoOpen;
    checkRow.onclick = async (ev) => {
      const configProvider = await ConfigProvider.create();
      configProvider.setConfig({
        autoOpen: !autoOpen,
      });
      this.reRenderButton(ide, !autoOpen);
    };
    checkRow.appendChild(check);
    const checkLabel = document.createElement("span");
    checkLabel.textContent = "Auto-open";
    checkRow.appendChild(checkLabel);

    ddBody.appendChild(checkRow);
    ddBody.appendChild(document.createElement("HR"));

    IDEs.forEach((ide) => {
      const ideRow = document.createElement("div");
      ideRow.innerHTML = `<img width='20' height='20' style='vertical-align: -4px; margin-right: 2px;' src='https://images.codestream.com/ides/128/${ide.moniker}.png'> ${ide.ideName}`;
      ideRow.className = "select-menu-item";
      if (ide.moniker.indexOf("jb-") === 0) {
        // ideRow.title = "Requires the JetBrains Toolbox App";
      }
      ideRow.onclick = async (ev) => {
        const configProvider = await ConfigProvider.create();
        configProvider.setConfig({
          ide: ide.moniker,
        });
        openEditor(ide.moniker, { url: window.location.href });
        this.toggleDropdown();
        this.reRenderButton(ide.moniker, autoOpen);
      };
      ddBody.appendChild(ideRow);
      if (ide.sepAfter) {
        ddBody.appendChild(document.createElement("HR"));
      }
    });

    container.appendChild(dropdown);
    return container;
  }
  protected adjustButton(a: HTMLAnchorElement) {
    // do nothing
  }
}

class PullInjector extends ButtonInjectorBase {
  constructor() {
    super(".gh-header-actions", "");
  }

  isApplicableToCurrentPage(): boolean {
    return window.location.pathname.includes("/pull/");
  }
}

class IssueInjector extends ButtonInjectorBase {
  constructor() {
    super(".gh-header-actions", "");
  }

  isApplicableToCurrentPage(): boolean {
    return window.location.pathname.includes("/issues/");
  }
}

class FileInjector extends ButtonInjectorBase {
  constructor() {
    super(".repository-content > div", "codestream-file-btn");
  }

  protected adjustButton(a: HTMLAnchorElement): void {
    a.className = "btn btn-primary";
  }

  isApplicableToCurrentPage(): boolean {
    return window.location.pathname.includes("/blob/");
  }
}

class NavigationInjector extends ButtonInjectorBase {
  constructor() {
    super(".file-navigation", "empty-icon position-relative");
  }

  protected adjustButton(a: HTMLAnchorElement): void {
    a.className = "btn btn-primary";
  }

  isApplicableToCurrentPage(): boolean {
    return !!select.exists(".file-navigation");
  }
}

class EmptyRepositoryInjector extends ButtonInjectorBase {
  constructor() {
    super(
      ".repository-content",
      CodeStreamify.CSS_REF_NO_CONTAINER,
      false,
      true
    );
  }

  protected adjustButton(a: HTMLAnchorElement): void {
    a.className = "btn btn-primary";
  }

  isApplicableToCurrentPage(): boolean {
    return !!select.exists("git-clone-help-controller");
  }
}
