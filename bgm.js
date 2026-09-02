(function() {
    // Check if we are running outside of the index.html wrapper
    const isStandalone = window === window.parent;
    // Check if we are on the first screen (scene1.html)
    const isFirstScreen = window.location.pathname.includes('scene1.html');

    // 첫 화면이 아니면서 단독 실행도 아니면 아무것도 하지 않음 (다른 화면 터치 시 BGM 영향 없도록)
    if (!isStandalone && !isFirstScreen) {
        return;
    }

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

    let interactionSent = false;

    const signalInteraction = () => {
        if (isStandalone && standaloneAudio) {
            if (standaloneAudio.paused) {
                standaloneAudio.play().catch(e => console.log('BGM Autoplay blocked:', e));
            }
        } else {
            // webOS 등 엄격한 정책에서는 postMessage 비동기 처리 시 play()가 막힐 수 있으므로 직접 접근 시도
            try {
                const bgmPlayer = window.parent.document.getElementById('bgm-player');
                if (bgmPlayer && bgmPlayer.paused) {
                    bgmPlayer.play().catch(e => console.log('BGM direct play blocked:', e));
                }
            } catch (e) {
                // Cross-origin 등으로 접근 불가능할 경우 기존 postMessage 방식(비동기) 폴백
                if (!interactionSent) {
                    window.parent.postMessage({ type: 'interaction' }, '*');
                }
            }
            interactionSent = true;
        }
        
        // 첫 화면에서만 클릭 시 재생하도록 했으므로, 한 번 실행 후 리스너 제거
        document.removeEventListener('touchstart', signalInteraction, { passive: true });
        document.removeEventListener('click', signalInteraction, { passive: true });
    };

    document.addEventListener('touchstart', signalInteraction, { passive: true });
    document.addEventListener('click', signalInteraction, { passive: true });
})();
