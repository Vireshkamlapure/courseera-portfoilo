async function checkAudioFileExists(audioFileUrl, retries = 10, initialRetryInterval = 3000, backoffFactor = 2) {
    let retryInterval = initialRetryInterval;

    for (let attempt = 0; attempt < retries; attempt++) {
        let response = await fetch(audioFileUrl, { method: 'GET' });
        if (response.ok) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, retryInterval));
        retryInterval *= backoffFactor;
    }
    return false;
}

function addAudioWidget(doc, audioFileUrl) {
    const invalidText = "We've encountered an issue with the audio file. We suggest restarting the page to see if it resolves the problem. If you continue to see this warning, please reach out to our support for further assistance.";
    const generatingAudioText = "Audio playback will be available in a few minutes. Please wait.";
    
    const audioSpinner = `<i id="audioSpinner" class="fa fa-lg fa-spinner fa-spin" aria-hidden="true" data-toggle="popover" data-trigger="hover" data-placement="top" title="Text-to-Speech" data-content="${generatingAudioText}"></i>`;
    const audioWarning = `<i id="audioWarning" class="fa fa-lg fa-exclamation-circle" aria-hidden="true" data-toggle="popover" data-trigger="hover" data-placement="top" title="Warning" data-content="${invalidText}"></i>`;
    
    // adding audio section at the top of the preview container
    doc.previewContainer.before(`
            <div id="audio-container">
                <div class="collapse show" id="audio-widget-container">
                    <div id="audio-widget" class="disabled">
                        <audio crossorigin playsinline>
                            <source src="${audioFileUrl}?${Date.now()}" type="audio/mp3">
                        </audio>
                    </div>
                </div>
            </div>
    `)

    // Add toolbar button for audio section toggle
    let tools = doc.preview.find('.toolbar div.tools');
    if (doc.settings.tool_type == "instructional-lab") {
        tools.children().first().after(
            `<button id="audioToggleButton" class="tool-icon" type="button" title="Toggle Audio Section" data-toggle="collapse" aria-expanded="true" aria-controls="#audio-widget-container" data-target="#audio-widget-container">
                <i class="fa fa-volume-up pr-2"></i>
            </button>`
        )
    }

    // audio widget setup
    window.addEventListener("load", (event) => {
        const audioElement = document.querySelector('audio');
        const audioWidget = document.getElementById('audio-widget');
        const audioSpinnerElement = document.createElement('div'); 
        audioSpinnerElement.innerHTML = audioSpinner;
        const audioWarningElement = document.createElement('div');
        audioWarningElement.innerHTML = audioWarning;

        const player = new Plyr('audio', {});
        window.player = player;
        player.toggleControls(false);

        window.player.on("ready", () => {
            audioWidget.insertBefore(audioSpinnerElement, audioWidget.firstChild);
            $('#audioSpinner').popover({
                container: "#audio-container"
            });
        })

        // Check if audio is valid asynchronously
        checkAudioFileExists(audioFileUrl).then(isValid => {
            if (audioWidget.contains(audioSpinnerElement)) {
                $('#audioSpinner').popover('dispose');
                audioWidget.removeChild(audioSpinnerElement);
            }
            if (isValid) {
                audioWidget.classList.remove('disabled');
                player.toggleControls(true);
                audioElement.load();
            } else {
                audioWidget.insertBefore(audioWarningElement, audioWidget.firstChild);
                $('#audioWarning').popover({
                    container: "#audio-container"
                });
            }
        });
    });
}