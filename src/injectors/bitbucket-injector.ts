import { InjectorBase, ButtonInjector, checkIsBtnUpToDate } from "./injector";
import { ConfigProvider } from "../config";
import { renderCodeStreamUrl, makeOpenInPopup } from "../utils";
import select = require("select-dom");

namespace CodeStreamify {
  export const NAV_BTN_ID = "codestream-btn-nav";
  export const NAV_BTN_CLASS = "codestream-nav-btn";
  export const NAV_BTN_CLASS_SELECTOR = "." + NAV_BTN_CLASS;

  export const CSS_REF_BTN_CONTAINER = "codestream-btn-container";
  export const CSS_REF_NO_CONTAINER = "no-container";
}

export class BitbucketInjector extends InjectorBase {
  constructor(configProvider: ConfigProvider) {
    super(configProvider, [
      new BranchInjector(),
      new PullRequestInjector(),
      new IssuesInjector(),
      new NewPullRequestInjector(),
      new CommitInjector(),
      new RepositoryInjector(),
    ]);
  }

  canHandleCurrentPage(): boolean {
    const metaTags = document.getElementsByTagName("meta");
    for (let i = 0; i < metaTags.length; i++) {
      const metaTag = metaTags[i];
      if (
        metaTag.name === "application-name" &&
        metaTag.content.toLowerCase().includes("bitbucket")
      ) {
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
    this.injectButtons(false);
  }

  async update(): Promise<void> {
    this.injectButtons(false);
  }
}

abstract class ButtonInjectorBase implements ButtonInjector {
  constructor(
    protected readonly parent: string,
    protected btnClasses: string,
    protected readonly up?: number
  ) {}

  abstract isApplicableToCurrentPage(): boolean;

  inject(ide: string, autoOpen: boolean) {
    let actionbar = select(this.parent);
    if (actionbar && this.up) {
      for (let i = 0; i < this.up; i++) {
        if (actionbar.parentElement) {
          actionbar = actionbar.parentElement;
        } else {
          return;
        }
      }
    }
    if (!actionbar) {
      return;
    }

    const oldBtn = document.getElementById(CodeStreamify.NAV_BTN_ID);
    if (oldBtn) {
      return;
    }

    const btn = this.renderButton(ide, autoOpen);

    const btnGroup = actionbar.children;
    if (btnGroup && btnGroup.length > 0) {
      actionbar.insertBefore(btn, btnGroup[0]);
    }
  }

  protected renderButton(
    url: string,
    autoOpen: boolean,
    float: boolean = true
  ): HTMLElement {
    let classes = CodeStreamify.NAV_BTN_CLASS;
    if (float) {
      classes = `${classes} ${this.btnClasses} aui-button`;
    }

    const container = document.createElement("div");
    container.id = CodeStreamify.CSS_REF_BTN_CONTAINER;
    container.className = classes;

    const a = document.createElement("a");
    a.id = CodeStreamify.NAV_BTN_ID;
    a.title = "CodeStream";
    a.text = "Open In";
    a.href = url;
    a.target = "_blank";
    if (autoOpen) {
      makeOpenInPopup(a);
    }
    a.className = "btn btn-sm btn-primary";

    container.appendChild(a);
    return container;
  }
}

class BranchInjector extends ButtonInjectorBase {
  constructor() {
    super(".branch-toolbar .aui-buttons", "");
  }

  isApplicableToCurrentPage(): boolean {
    return window.location.pathname.includes("/branch/");
  }
}

class PullRequestInjector extends ButtonInjectorBase {
  constructor() {
    super("#pullrequest-actions .aui-buttons:last-child", "");
  }

  isApplicableToCurrentPage(): boolean {
    return (
      select(this.parent) &&
      window.location.pathname.includes("/pull-requests/")
    );
  }
}

class NewPullRequestInjector extends ButtonInjectorBase {
  constructor() {
    super(
      '[data-qa="pr-header-actions-drop-down-menu-styles"]',
      "bitbucket-button",
      2
    );
  }

  isApplicableToCurrentPage(): boolean {
    return (
      select(this.parent) &&
      window.location.pathname.includes("/pull-requests/")
    );
  }
}

class IssuesInjector extends ButtonInjectorBase {
  constructor() {
    super("#issue-header .aui-buttons:last-child", "");
  }

  isApplicableToCurrentPage(): boolean {
    return select(this.parent) && window.location.pathname.includes("/issues/");
  }
}

class CommitInjector extends ButtonInjectorBase {
  constructor() {
    super(".commit-actions", "");
  }

  isApplicableToCurrentPage(): boolean {
    return window.location.pathname.includes("/commits/");
  }
}

class RepositoryInjector extends ButtonInjectorBase {
  constructor() {
    super('[data-qa="page-header-wrapper"] button', "bitbucket-button", 2);
  }

  isApplicableToCurrentPage(): boolean {
    return window.location.pathname.includes("/src/");
  }
}
