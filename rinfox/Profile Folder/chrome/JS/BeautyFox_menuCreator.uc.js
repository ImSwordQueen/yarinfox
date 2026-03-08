// ==UserScript==
// @name        BeautyFox - Menu Creator
// @author      AngelBruni
// @loadorder   1
// ==/UserScript==

// ATTENTION: Most of this code is TERRIBLE, no worries, Geckium will bring a better one.

// Global command registry to avoid using new Function() which is blocked by CSP
const _commandRegistry = {};

function registerCommand(name, func) {
	_commandRegistry[name] = func;
}

function executeCommand(commandStr, event) {
	try {
		// Check if it's a registered command
		if (_commandRegistry[commandStr]) {
			_commandRegistry[commandStr](event);
			return;
		}

		// Parse the command string to extract function name and arguments
		// Supports patterns like: funcName() or funcName(arg1, arg2, ...)
		const match = commandStr.match(/^(\w+)\((.*)\);?$/);
		if (match) {
			const funcName = match[1];
			const argsStr = match[2];

			// Check if function exists in global scope
			if (typeof window[funcName] === 'function') {
				// Parse arguments (handles: 'string', 123, obj.prop, etc.)
				const args = parseArguments(argsStr);

				// Call the function with the parsed arguments
				window[funcName].apply(null, args);
				return;
			}

			// Check if function exists as a property of gBrowser or other common objects
			if (funcName.includes('.')) {
				const parts = funcName.split('.');
				let obj = window;
				for (let i = 0; i < parts.length - 1; i++) {
					if (obj[parts[i]]) {
						obj = obj[parts[i]];
					} else {
						throw new Error(`Object not found: ${parts[i]}`);
					}
				}
				const methodName = parts[parts.length - 1];
				if (typeof obj[methodName] === 'function') {
					const args = parseArguments(argsStr);
					obj[methodName].apply(obj, args);
					return;
				}
			}

			console.error('Function not found:', funcName);
		} else {
			// Handle goDoCommand('cmd_name') pattern
			const goDoMatch = commandStr.match(/^goDoCommand\(['"](.+?)['"]\);?$/);
			if (goDoMatch) {
				goDoCommand(goDoMatch[1]);
				return;
			}

			console.error('Unable to parse command:', commandStr);
		}
	} catch (e) {
		console.error('Error executing command:', e, commandStr);
	}
}

// Parse arguments from a string like "arg1, 'arg2', obj.prop"
function parseArguments(argsStr) {
	if (!argsStr || argsStr.trim() === '') {
		return [];
	}

	const args = [];
	let current = '';
	let inString = false;
	let stringChar = '';
	let depth = 0;

	for (let i = 0; i < argsStr.length; i++) {
		const char = argsStr[i];
		const nextChar = argsStr[i + 1] || '';

		if ((char === '"' || char === "'") && (i === 0 || argsStr[i - 1] !== '\\')) {
			if (!inString) {
				inString = true;
				stringChar = char;
			} else if (char === stringChar) {
				inString = false;
			}
			current += char;
		} else if (char === '(' && !inString) {
			depth++;
			current += char;
		} else if (char === ')' && !inString) {
			depth--;
			current += char;
		} else if (char === ',' && !inString && depth === 0) {
			args.push(evalArgument(current.trim()));
			current = '';
		} else {
			current += char;
		}
	}

	if (current.trim()) {
		args.push(evalArgument(current.trim()));
	}

	return args;
}

// Evaluate a single argument without using eval
function evalArgument(arg) {
	if (!arg) return undefined;

	// Handle string literals
	if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
		return arg.slice(1, -1);
	}

	// Handle numbers
	if (!isNaN(arg)) {
		return Number(arg);
	}

	// Handle boolean values
	if (arg === 'true') return true;
	if (arg === 'false') return false;
	if (arg === 'null') return null;
	if (arg === 'undefined') return undefined;

	// Handle object properties like gBrowser.selectedBrowser
	if (arg.includes('.')) {
		const parts = arg.split('.');
		let obj = window;
		for (const part of parts) {
			if (obj && obj[part] !== undefined) {
				obj = obj[part];
			} else {
				console.error('Property not found:', part);
				return undefined;
			}
		}
		return obj;
	}

	// Handle simple identifiers
	if (window[arg] !== undefined) {
		return window[arg];
	}

	// Handle object notation like {private: true}
	if (arg.startsWith('{') && arg.endsWith('}')) {
		// Simple object parser for common patterns
		try {
			// Parse simple key-value pairs
			const content = arg.slice(1, -1);
			const result = {};
			const pairs = content.split(',');
			for (const pair of pairs) {
				const [key, value] = pair.split(':').map(s => s.trim());
				if (value === 'true') result[key] = true;
				else if (value === 'false') result[key] = false;
				else if (value.startsWith('"') || value.startsWith("'")) result[key] = value.slice(1, -1);
				else if (!isNaN(value)) result[key] = Number(value);
				else result[key] = value;
			}
			return result;
		} catch (e) {
			console.error('Error parsing object:', arg);
			return {};
		}
	}

	// Return as-is (might be a variable name)
	return arg;
}

function createMenu(menuData) {
	try {
		var externalBtn = document.createXULElement('toolbarbutton');
		externalBtn.id = menuData.id + 'Button';
		if (!menuData.locale == "") { externalBtn.setAttribute('locale', menuData.locale); }
		externalBtn.style.listStyleImage = menuData.image;
		setAttributes(externalBtn, {
			'label': menuData.name,
			'onclick':'event.preventDefault();event.stopPropagation();',
			'type':'menu',
			'removable':true
		})
		if (menuData.classes) {
			if (Array.isArray(menuData.classes)) { externalBtn.classList.add(...menuData.classes); }
			else { externalBtn.classList.add(menuData.classes); }
		}
		externalBtn.addEventListener('click', (event) => {
			if (event.target === externalBtn) {
				if (event.shiftKey) {
					menuData._externalAppPopup.querySelectorAll('[special="true"]').forEach((item) => {
						item.style.display = 'flex';
					});
				} else {
					menuData._externalAppPopup.querySelectorAll('[special="true"]').forEach((item) => {
						item.style.display = 'none';
					});
				}
			}
		});

		document.getElementById('nav-bar-customization-target').appendChild(externalBtn);

		var externalPopup = document.createXULElement('menupopup');
		setAttributes(externalPopup, {
			'id':       menuData.id + 'PopUp',
			'position': 'bottomright topright'
		})
		externalBtn.appendChild(externalPopup);
		for (var i = 0; i < menuData.items.length; i++) { createMenuItem(externalPopup, menuData.items[i]); }

		menuData._externalAppPopup = externalPopup;
		menuData._isready = false;
		menuData.handleRelativePath = (items) => {
			items.forEach((item, i) => {
				if (item.path) {
					item.path = item.path.replace(/\//g, '\\').toLocaleLowerCase();
					const ffdir = Cc['@mozilla.org/file/directory_service;1']
						.getService(Ci.nsIProperties)
						.get('ProfD', Ci.nsIFile).path;
					if (/^(\\)/.test(item.path)) { item.path = ffdir + item.path; }
				}
			})
		};
		menuData.init = function () {
			menuData.handleRelativePath(menuData.getAllApps());
			menuData.onpopupshowing();
		};
		menuData.onpopupshowing = () => {
			if (menuData._isready) return;
			if (menuData._externalAppPopup === null) return;
			// FIXME: Clear existing items before adding them again because this code is being a bitch and adding the entries in the menu twice???
			while (menuData._externalAppPopup.hasChildNodes()) { menuData._externalAppPopup.removeChild(menuData._externalAppPopup.firstChild); }
			menuData.items.forEach((item) => createMenuItem(menuData._externalAppPopup, item));
			menuData._isready = true;
		};
		menuData.getAllApps = function () {
			var apps = [];
			for (var i = 0; i < menuData.items.length; i++) {
				if (menuData.items[i].type === 'app') { apps.push(menuData.items[i]); }
				else if (menuData.items[i].type === 'subdir') { apps = apps.concat(menuData.items[i].items.filter(item => item.type === 'app')); }
			}
			return apps;
		};
		return menuData;
	} catch (e) { console.error(e); }
}

function createMenuItem(parent, item) {
	if (item.type === 'subdir') {
		var subDirItem = parent.appendChild(document.createXULElement('menu'));
		if (!item.locale == "") { subDirItem.setAttribute('locale', item.locale); }
		setAttributes(subDirItem, {
			'class':	'menu-iconic',
			'id':		item.id,
			'label':	item.name,
			'image':	item.image
		})
		if (item.special) { subDirItem.setAttribute('special', item.special); subDirItem.style.display = 'none'; }

		var subDirPopup = document.createXULElement('menupopup');
		for (var j = 0; j < item.items.length; j++) { createMenuItem(subDirPopup, item.items[j]); }
		subDirItem.appendChild(subDirPopup);
	} else if (item.type === 'app') {
		var appsItems = document.createXULElement('menuitem');
		setAttributes(appsItems, {
			'class':		'menuitem-iconic',
			'id':			item.id,
			'label':		item.name,
			'image':		item.image
		})
		if (item.special) {
			appsItems.setAttribute('special', item.special);
			appsItems.style.display = 'none';
		}
		if (!item.locale == "") { appsItems.setAttribute('locale', item.locale); }
		if (item.accelText) { appsItems.setAttribute('acceltext', item.accelText); }

		// Store command for CSP-safe execution
		appsItems._command = item.command;

		// Use addEventListener instead of oncommand for Firefox 140 compatibility
		appsItems.addEventListener('command', (event) => {
			try {
				executeCommand(appsItems._command, event);
			} catch (e) {
				console.error('Error executing command:', e, appsItems._command);
			}
		});

		parent.appendChild(appsItems);
	} else if (item.type === 'separator') {
		var separator = document.createXULElement('menuseparator');
		parent.appendChild(separator);

		if (item.special) {
			separator.setAttribute('special', item.special);
			separator.style.display = 'none';
		}
	}
}