(() => {
  Services.prefs.setBoolPref("xpinstall.signatures.required", false);
  console.log("Add-on signing disabled.");
})();