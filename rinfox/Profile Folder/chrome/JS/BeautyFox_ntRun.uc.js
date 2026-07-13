// ==UserScript==
// @name        BeautyFox - File Runner
// @author      AngelBruni
// @loadorder   1
// ==/UserScript==

function runFile(filePath, commandLineArgs = "") {
    const executable = Services.dirsvc.get("SysD", Ci.nsIFile);
    executable.append(filePath);

    const process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
    process.init(executable);

    const args = commandLineArgs.match(/(?:[^\s"]+|"[^"]*")+/g)?.map(arg =>
        arg.startsWith('"') && arg.endsWith('"') ? arg.slice(1, -1) : arg
    ) ?? [];
    process.run(false, args, args.length);
}