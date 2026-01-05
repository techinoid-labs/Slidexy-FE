export const getClickListenerScript = (isMultiPage: boolean) => `
<script>
  (function() {
    const IS_MULTI_PAGE = ${isMultiPage};
    let selectionEnabled = false;
    let lastHighlighted = null;

    console.log('✅ Neuro-Editor Script Loaded (Multi-page: ' + IS_MULTI_PAGE + ')');

    // Helper to get a valid element (handles text nodes, primitive tags)
    function getSafeElement(t) {
        if (!t) return null;
        return t.nodeType === 3 ? t.parentNode : t;
    }

    function addSelectionStyles() {
        if (!document.getElementById('neuro-editor-styles')) {
            const style = document.createElement('style');
            style.id = 'neuro-editor-styles';
            style.innerHTML = \`
                .neuro-selecting * {
                    cursor: crosshair !important;
                }
                .neuro-selected-outline {
                    outline: 4px solid #F59E0B !important; /* Amber-500 */
                    outline-offset: -2px !important;
                    box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.3) !important;
                    z-index: 999999 !important;
                }
            \`;
            document.head.appendChild(style);
        }
    }
    
    // Initialize styles immediately
    addSelectionStyles();

    // Listen for messages from Parent
    window.addEventListener('message', (event) => {
      try {
        if (event.data.type === 'TOGGLE_SELECTION') {
            selectionEnabled = event.data.enabled;
            console.log('🔮 Selection Mode:', selectionEnabled);
            
            if (selectionEnabled) {
                document.body.classList.add('neuro-selecting');
            } else {
                document.body.classList.remove('neuro-selecting');
                if (lastHighlighted) {
                    lastHighlighted.classList.remove('neuro-selected-outline');
                    lastHighlighted = null;
                }
            }
        }
      } catch (e) { console.error(e); }
    });

    // Send handshake to parent so it knows we're ready
    window.parent.postMessage({ type: 'NEURO_EDITOR_READY' }, '*');

    // -------------------------------------------------------------
    // 🛡️ CLICK INTERCEPTOR (Capture Phase - Priority 1)
    // -------------------------------------------------------------
    window.addEventListener('click', (e) => {
        const rawTarget = e.target;
        const target = getSafeElement(rawTarget);
        if (!target) return;

        // ===============================================
        // MODE 1: SELECTION ENABLED -> BLOCK & SELECT
        // ===============================================
        if (selectionEnabled) {
            // CRITICAL: Stop EVERYTHING. No exceptions.
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            console.log('🎯 Selecting:', target.tagName, target.id);

            // 1. Visual Highlight
            if (lastHighlighted) lastHighlighted.classList.remove('neuro-selected-outline');
            target.classList.add('neuro-selected-outline');
            lastHighlighted = target;

            // 2. Resolve ID
            let bestId = target.id;
            if (!bestId) {
                const parentWithId = target.closest('[id]');
                if (parentWithId) bestId = parentWithId.id;
            }

            // 3. Capture Computed Styles for Context-Aware Editing
            const computedStyles = window.getComputedStyle(target);
            const styleContext = {
                color: computedStyles.color,
                backgroundColor: computedStyles.backgroundColor,
                fontSize: computedStyles.fontSize,
                fontFamily: computedStyles.fontFamily,
                fontWeight: computedStyles.fontWeight,
                lineHeight: computedStyles.lineHeight,
                padding: computedStyles.padding,
                margin: computedStyles.margin,
                borderRadius: computedStyles.borderRadius,
                boxShadow: computedStyles.boxShadow,
                textAlign: computedStyles.textAlign,
                display: computedStyles.display,
                width: computedStyles.width,
                height: computedStyles.height
            };

            console.log('🎨 Captured styles:', styleContext);

            // 4. Send Message with Styles
            window.parent.postMessage({
                type: 'NEURO_ELEMENT_CLICKED',
                id: bestId,
                tagName: target.tagName,
                className: target.className,
                computedStyles: styleContext
            }, '*');

            return false;
        }

        // ===============================================
        // MODE 2: SELECTION DISABLED -> NAVIGATION HANDLING
        // ===============================================
        const link = target.tagName === 'A' ? target : target.closest('a');
        if (link) {
            const href = link.getAttribute('href');
            
            // MULTI-PAGE MODE: Check if clicking on local page
            if (IS_MULTI_PAGE && href && href.endsWith('.html') && !href.startsWith('http')) {
                console.log('📄 Multi-page navigation to:', href);
                e.preventDefault();
                e.stopPropagation();
                window.parent.postMessage({
                    type: 'NEURO_PAGE_CHANGE',
                    page: href
                }, '*');
                return false;
            }
            
            // Allow Hash Links (both single and multi-page)
            if (href && href.startsWith('#')) {
                const id = href.substring(1);
                const el = document.getElementById(id);
                if (el) {
                    e.preventDefault();
                    e.stopPropagation();
                    el.scrollIntoView({ behavior: 'smooth' });
                    return;
                }
            }

            // Block External Links (both single and multi-page)
            console.log('🛑 Navigation Blocked:', href);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

    }, true); // Capture Phase = True (Runs before any other click listener)


    // -------------------------------------------------------------
    // 🎯 HOVER HANDLER
    // -------------------------------------------------------------
    document.addEventListener('mouseover', (e) => {
        if (!selectionEnabled) return;
        
        const target = getSafeElement(e.target);
        if (!target || target === document.body || target === document.documentElement) return;

        target.style.outline = "2px dashed rgba(245, 158, 11, 0.5)";
        
        target.addEventListener('mouseout', () => {
             target.style.outline = "";
        }, { once: true });
    });

  })();
</script>
`;

// Backward compatibility: export default script for single-page mode
export const CLICK_LISTENER_SCRIPT = getClickListenerScript(false);
