(function() {
    // bgm.js - Sends interaction signal to parent wrapper to start continuous BGM,
    // or plays BGM directly if opened as a standalone page.
    
    let interactionSent = false;

    // Check if we are running outside of the index.html wrapper
    const isStandalone = window === window.parent;
    let standaloneAudio = null;

    if (isStandalone) {
        // Create audio element for standalone playback
        standaloneAudio = document.createElement('audio');
        // Determine the path to the audio file relative to this script
        const scriptUrl = document.currentScript ? document.currentScript.src : window.location.href;
        standaloneAudio.src = new URL('funk-breakbeat.m4a', scriptUrl).href;
        standaloneAudio.loop = true;
        standaloneAudio.volume = 0.15;
        document.body.appendChild(standaloneAudio);
    }

    const signalInteraction = () => {
        if (isStandalone && standaloneAudio) {
            if (standaloneAudio.paused) {
                standaloneAudio.play().catch(e => console.log('BGM Autoplay blocked:', e));
            }
        } else if (!interactionSent) {
            interactionSent = true;
            window.parent.postMessage({ type: 'interaction' }, '*');
        }
        
        // Optionally keep the listeners if we want to ensure it plays even if first attempt fails
        document.removeEventListener('touchstart', signalInteraction, { passive: true });
        document.removeEventListener('click', signalInteraction, { passive: true });
    };

    document.addEventListener('touchstart', signalInteraction, { passive: true });
    document.addEventListener('click', signalInteraction, { passive: true });
})();
