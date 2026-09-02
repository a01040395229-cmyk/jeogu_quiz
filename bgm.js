(function() {
    // bgm.js (v4 repurposed) - Sends interaction signal to parent wrapper to start continuous BGM
    let interactionSent = false;

    const signalInteraction = () => {
        if (!interactionSent) {
            interactionSent = true;
            window.parent.postMessage({ type: 'interaction' }, '*');
        }
        document.removeEventListener('touchstart', signalInteraction, { passive: true });
        document.removeEventListener('click', signalInteraction, { passive: true });
    };

    document.addEventListener('touchstart', signalInteraction, { passive: true });
    document.addEventListener('click', signalInteraction, { passive: true });
})();
