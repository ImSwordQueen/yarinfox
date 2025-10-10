window.addEventListener('load', function() {
  const urlbarInputBox = document.querySelector('.urlbar-input-box');

  if (urlbarInputBox) {
    urlbarInputBox.addEventListener('mousedown', function(event) {
      const boxRect = urlbarInputBox.getBoundingClientRect();
      const clickX = event.clientX;

      const buttonArea = boxRect.right - 18;

      if (clickX >= buttonArea) {
        const urlbarInput = document.getElementById('urlbar-input');
        
        if (urlbarInput) {
          urlbarInput.focus(); 

          const newEvent = new MouseEvent('mousedown', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
            'clientX': clickX,
            'clientY': event.clientY,
            'button': 0
          });
          
          urlbarInput.dispatchEvent(newEvent);
        }
      }
    });
  }
});