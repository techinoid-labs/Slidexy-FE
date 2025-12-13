
/**
 * CLICK-TO-EDIT INJECTOR
 * 
 * Purpose:
 * 1. Intercept clicks on elements within the iframe.
 * 2. Visual feedback (outline) on the clicked element.
 * 3. Send the element's ID to the parent window via postMessage.
 */

export const CLICK_LISTENER_SCRIPT = `
  <script>
  (function () {
    console.log("⚡ Neuro-Engine Click-to-Edit Loaded (v2)");

    let lastHighlighted = null;
    let selectionEnabled = false; // Default to OFF

    // Notify Parent that we are ready to receive initial state
    window.parent.postMessage({ type: 'NEURO_EDITOR_READY' }, '*');

    // Listen for toggle messages from Parent
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'TOGGLE_SELECTION') {
        selectionEnabled = event.data.enabled;
        console.log("⚡ Selection Mode:", selectionEnabled ? "ON" : "OFF");

        // Clear highlight if disabled
        if (!selectionEnabled && lastHighlighted) {
          lastHighlighted.style.outline = "";
          lastHighlighted = null;
        }
      }
    });

    document.addEventListener('click', (e) => {
      // Only intercept if mode is active
      if (!selectionEnabled) return;

      e.preventDefault();
      e.stopPropagation();

      const target = e.target;

      // visual feedback
      if (lastHighlighted) {
        lastHighlighted.style.outline = "";
      }
      target.style.outline = "3px solid #6C2BD9"; // Neuro Purple
      lastHighlighted = target;

      // Find the best ID (element ID or closest parent ID)
      let bestId = target.id;
      if (!bestId) {
        const parentWithId = target.closest('[id]');
        if (parentWithId) bestId = parentWithId.id;
      }

      console.log("🎯 Element Clicked:", bestId || "No ID found", target.tagName);

      // Send to Parent
      window.parent.postMessage({
        type: 'NEURO_ELEMENT_CLICKED',
        id: bestId,
        tagName: target.tagName,
        className: target.className
      }, '*');

    }, true);
  })();
</script>
  `;
