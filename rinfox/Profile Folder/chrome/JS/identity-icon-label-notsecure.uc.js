(function() {
    const identityBoxId = 'identity-box';
    const identityIconBoxId = 'identity-icon-box'; 
    const customLabelId = 'custom-text-label-4';
    const targetClass = 'notSecure';
    const customText = 'Insecure Connection';

    let customLabel = null;

    const injectCustomLabel = (identityIconBox) => {
        customLabel = document.createElement('label');
        customLabel.setAttribute('id', customLabelId);
        customLabel.setAttribute('flex', '1');
        customLabel.setAttribute('crop', 'center');
        customLabel.style.fontWeight = 'bold';
        customLabel.style.display = 'none';

        identityIconBox.appendChild(customLabel);
        console.log(`[ThirdChild] Injected custom label #${customLabelId}`);
    };

    const checkAndSetText = (identityBox) => {
        if (!customLabel) return;

        if (identityBox.classList.contains(targetClass)) {
            customLabel.textContent = customText;
            customLabel.style.display = 'block';

            const nativeLabel = document.getElementById('identity-icon-label');
            if (nativeLabel) {
                nativeLabel.style.display = 'none';
                nativeLabel.style.visibility = 'hidden';
            }

        } else {
            customLabel.textContent = '';
            customLabel.style.display = 'none';

            const nativeLabel = document.getElementById('identity-icon-label');
            if (nativeLabel) {
                nativeLabel.style.display = '';
                nativeLabel.style.visibility = '';
            }
        }
    };

    window.addEventListener('load', () => {
        const identityBox = document.getElementById(identityBoxId);
        const identityIconBox = document.getElementById(identityIconBoxId);
        
        if (!identityBox || !identityIconBox) {
            console.error("[ThirdChild] Required UI elements not found.");
            return;
        }

        injectCustomLabel(identityIconBox);

        const classObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    checkAndSetText(identityBox);
                }
            }
        });
        classObserver.observe(identityBox, { attributes: true, attributeFilter: ['class'] });

        checkAndSetText(identityBox);
    });
})();
