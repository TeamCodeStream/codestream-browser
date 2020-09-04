import { ConfigProvider } from "../config";

export interface Injector {
  /**
   * Whether this injector can inject into the current page
   * @param host
   */
  canHandleCurrentPage(): boolean;

  /**
   * Contract: Multiple calls are allowed, the implementation has to properly handle potential config updates between calls.
   */
  inject(): Promise<void>;

  /**
   * TODO Needed? Currently used to avoid the button flickering on updates. Maybe not needed with a better implementation of "inject"
   * Returns true if the injector is already installed and up-to-date with the current config
   */
  checkIsInjected(): boolean;

  /**
   * Update an existing injection with the current config
   */
  update(): Promise<void>;
}

// export interface ButtonArgs {
//   ide: string;
//   autoOpen: boolean;
//   checkoutBranch: boolean;
// }

export interface ButtonInjector {
  /**
   * Whether the injector is meant to be used on the current page
   */
  isApplicableToCurrentPage(): boolean;

  /**
   * Injects the actual button
   * @param currentUrl The currently configured CodeStream URL
   */
  inject(ide: string, autoOpen: boolean, checkoutBranch: boolean): void;
}

export abstract class InjectorBase implements Injector {
  constructor(
    protected readonly configProvider: ConfigProvider,
    protected readonly buttonInjectors: ButtonInjector[]
  ) {}

  abstract canHandleCurrentPage(): boolean;
  abstract checkIsInjected(): boolean;
  abstract inject(): Promise<void>;
  abstract update(): Promise<void>;

  injectButtons(singleInjector: boolean = false) {
    const ide = this.config.ide;
    for (const injector of this.buttonInjectors) {
      if (injector.isApplicableToCurrentPage()) {
        injector.inject(ide, this.config.autoOpen, this.config.checkoutBranch);
        if (singleInjector) {
          break;
        }
      }
    }
  }

  protected get config() {
    return this.configProvider.getConfig();
  }
}

export const checkIsBtnUpToDate = (
  button: HTMLElement | null,
  currentUrl: string
): boolean => {
  return (
    !!button &&
    button instanceof HTMLAnchorElement &&
    button.href === currentUrl
  );
};
