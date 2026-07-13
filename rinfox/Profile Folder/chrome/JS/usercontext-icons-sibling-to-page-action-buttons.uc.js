(function() {
  try {
    // 1. Locate the container icon and the target sibling
    const contextIcon = document.getElementById("userContext-icons");
    const pageActions = document.getElementById("page-action-buttons");

    if (contextIcon && pageActions) {
      // 2. Insert contextIcon as a sibling immediately after pageActions
      pageActions.parentNode.insertBefore(contextIcon, pageActions.nextSibling);
    }
  } catch (e) {
    console.error("Failed to move #userContext-icons:", e);
  }
})();
