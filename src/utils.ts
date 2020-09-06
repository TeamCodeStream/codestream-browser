export function renderCodeStreamUrl(codestreamURL: string): string {
	const baseURL = `${window.location.protocol}//${window.location.host}`;
	return `${codestreamURL}/#${baseURL}` + window.location.pathname;
}

export function makeOpenInPopup(a: HTMLAnchorElement): void {
	a.onclick = () => {
		var w = window.open(a.href, a.target, "menubar=no,toolbar=no,location=no,dependent");
		return !w;
	};
}

interface IDEData {
	moniker: string;
	protocol: string;
	ideName: string;
	downloadUrl: string;
	sepAfter?: boolean;
}

export const IDEs: IDEData[] = [
	{
		ideName: "VS Code",
		protocol: "vscode://codestream.codestream/",
		moniker: "vsc",
		downloadUrl: "https://marketplace.visualstudio.com/items?itemName=CodeStream.codestream",
	},
	{
		ideName: "VS Code Insiders",
		protocol: "vscode-insiders://codestream.codestream/",
		moniker: "vsc-insiders",
		downloadUrl: "https://marketplace.visualstudio.com/items?itemName=CodeStream.codestream",
	},
	{
		ideName: "Visual Studio",
		protocol: "codestream-vs://codestream/",
		moniker: "vs",
		downloadUrl: "https://marketplace.visualstudio.com/items?itemName=CodeStream.codestream-vs",
		sepAfter: true,
	},
	{
		ideName: "Android Studio",
		protocol: "jetbrains://studio/codestream/",
		moniker: "jb-studio",
		downloadUrl: "https://plugins.jetbrains.com/plugin/12206-codestream",
	},
	{
		ideName: "IntelliJ IDEA",
		protocol: "jetbrains://idea/codestream/",
		moniker: "jb-idea",
		downloadUrl: "https://plugins.jetbrains.com/plugin/12206-codestream",
	},
	{
		ideName: "PyCharm",
		protocol: "jetbrains://pycharm/codestream/",
		moniker: "jb-pycharm",
		downloadUrl: "https://plugins.jetbrains.com/plugin/12206-codestream",
	},
	{
		ideName: "WebStorm",
		protocol: "jetbrains://web-storm/codestream/",
		moniker: "jb-web-storm",
		downloadUrl: "https://plugins.jetbrains.com/plugin/12206-codestream",
	},
	{
		ideName: "PhpStorm",
		protocol: "jetbrains://php-storm/codestream/",
		moniker: "jb-phpstorm",
		downloadUrl: "https://plugins.jetbrains.com/plugin/12206-codestream",
	},
	{
		ideName: "RubyMine",
		protocol: "jetbrains://rubymine/codestream/",
		moniker: "jb-rubymine",
		downloadUrl: "https://plugins.jetbrains.com/plugin/12206-codestream",
	},
	{
		ideName: "Rider",
		protocol: "jetbrains://rd/codestream/",
		moniker: "jb-rider",
		downloadUrl: "https://plugins.jetbrains.com/plugin/12206-codestream",
	},
	{
		ideName: "CLion",
		protocol: "jetbrains://clion/codestream/",
		moniker: "jb-clion",
		downloadUrl: "https://plugins.jetbrains.com/plugin/12206-codestream",
	},
	{
		ideName: "GoLand",
		protocol: "jetbrains://goland/codestream/",
		moniker: "jb-goland",
		downloadUrl: "https://plugins.jetbrains.com/plugin/12206-codestream",
	},
	{
		ideName: "DataGrip",
		protocol: "jetbrains://datagrip/codestream/",
		moniker: "jb-datagrip",
		downloadUrl: "https://plugins.jetbrains.com/plugin/12206-codestream",
	},
	{
		ideName: "AppCode",
		protocol: "jetbrains://appcode/codestream/",
		moniker: "jb-appcode",
		downloadUrl: "https://plugins.jetbrains.com/plugin/12206-codestream",
		sepAfter: true,
	},
	{
		ideName: "Atom",
		protocol: "atom://codestream/",
		moniker: "atom",
		downloadUrl: "https://atom.io/packages/codestream",
	},
];

export function openEditor(moniker: string, options: any) {
	const ide = IDEs.find((_) => _.moniker === moniker);
	if (!ide) {
		console.warn("missing ide");
		return;
	}

	const controller = options.controller || "pullRequest";

	var protocolStart = ide.protocol;
	var protocol = "";
	var route: any;
	if (controller === "pullRequest") {
		route = {
			controller: "pullRequest",
			action: "open",
			query: [{ key: "url", value: encodeURIComponent(options.url) }],
		};
		if (options.checkoutBranch) {
			route.query.push({
				key: "checkoutBranch",
				value: true,
			});
		}
	} else if (controller === "startWork") {
		route = {
			controller: "startWork",
			action: "open",
			query: [{ key: "url", value: encodeURIComponent(options.url) }],
		};
	} else {
		console.error(`unknown controller=${controller}`);
		return;
	}
	route.query.push({ key: "providerId", value: options.providerId });

	if (moniker.indexOf("jb-") === 0) {
		// jetbrains requires to pass the controller/action/ids as queryString params
		if (route && route.query) {
			route.query.push({ key: "controller", value: route.controller });
			if (route.action) {
				route.query.push({ key: "action", value: route.action });
			}
			if (route.id) {
				route.query.push({ key: "id", value: route.id });
			}
			if (options.file) {
				// var fileName = '';
				route.query.push({
					key: "file",
					value: encodeURIComponent(options.file),
				});
			}
		}
	}
	if (route) {
		protocol = `${protocolStart}${route.controller}`;
		if (route.id) {
			protocol += `/${route.id}`;
		}
		if (route.action) {
			protocol += `/${route.action}`;
		}
		if (route.query && route.query.length) {
			protocol += "?1=1&";
			var len = route.query.length;
			for (var i = 0; i < len; i++) {
				var query = route.query[i];
				protocol += `${query.key}=${query.value}`;
				if (i + 1 < len) {
					protocol += `&`;
				}
			}
		}
	} else {
		console.warn("no route");
		return;
	}
	console.log(protocol);
	console.log("ROUTE IS: ", route);

	// var startTime = new Date();
	// var ideSelection;
	// if (window.CODESTREAM._state) {
	//   if (window.CODESTREAM._state.MRU === true) {
	//     ideSelection = "MRU";
	//   } else if (window.CODESTREAM._state.lastOriginDetail === true) {
	//     ideSelection = "lastOriginDetail";
	//   } else {
	//     ideSelection = "User Selected";
	//   }
	// }
	// if (!ideSelection) {
	//   ideSelection = "User Selected";
	// }

	openUriWithTimeoutHack(
		protocol,
		function () {
			//fail
			if (moniker.indexOf("jb-") === 0) {
				const result = window.confirm(
					"Requires the JetBrains Toolbox App. Click OK to go to\nhttps://www.jetbrains.com/toolbox/app/"
				);
				if (result) window.location.href = "https://www.jetbrains.com/toolbox/app/";
				// console.warn(result);
			}
			console.log(`CodeStream: failed ${protocol}`);
		},
		function () {
			//success
			console.log(`CodeStream: success ${protocol}`);
		}
	);
}

function openUriWithTimeoutHack(uri: string, failCb: Function, successCb: Function) {
	var timeout = setTimeout(function () {
		failCb();
		handler.remove();
	}, 1000);

	//handle page running in an iframe (blur must be registered with top level window)
	var target = window;
	while (target != target.parent) {
		// @ts-ignore
		target = target.parent;
	}

	var handler = _registerEvent(target, "blur", onBlur);

	function onBlur() {
		clearTimeout(timeout);
		handler.remove();
		successCb();
	}

	window.location.href = uri;
}

function _registerEvent(target: any, eventType: string, cb: Function) {
	if (target.addEventListener) {
		target.addEventListener(eventType, cb);
		return {
			remove: function () {
				target.removeEventListener(eventType, cb);
			},
		};
	} else {
		target.attachEvent(eventType, cb);
		return {
			remove: function () {
				target.detachEvent(eventType, cb);
			},
		};
	}
}
