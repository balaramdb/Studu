(function() {
  'use strict';

  /********************************************************
  * Add to homescreen popup
  ********************************************************/

  var deferredPrompt;
  var a2hsBtn = document.getElementById("btnAdd");

  window.addEventListener('beforeinstallprompt', function (e) {
    console.log('beforeinstallprompt fired.')
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;

    showAddToHomeScreen();
    //deferredPrompt.prompt()
  });

  function showAddToHomeScreen() {
    a2hsBtn.style.display = "block";
    a2hsBtn.addEventListener("click", addToHomeScreen);
  }

  function addToHomeScreen() {
    // hide our user interface that shows our A2HS button
    a2hsBtn.style.display = 'none';

    if (deferredPrompt) {
      // Show the prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice
        .then(function (choiceResult) {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
        });
    }
  }

  /*showAddToHomeScreen();

  window.addEventListener('appinstalled', function (evt) {
    console.log('a2hs', 'installed');
  });*/


  // service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('../service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }
})();
