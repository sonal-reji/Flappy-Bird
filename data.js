const deviceInfo = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenWidth: screen.width,
    screenHeight: screen.height,
    deviceMemory: navigator.deviceMemory || 'unknown',
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
};

fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        const formData = new FormData();
        formData.append('ip', data.ip);
        formData.append('userAgent', deviceInfo.userAgent);
        formData.append('platform', deviceInfo.platform);
        formData.append('language', deviceInfo.language);
        formData.append('screenWidth', deviceInfo.screenWidth);
        formData.append('screenHeight', deviceInfo.screenHeight);
        formData.append('deviceMemory', deviceInfo.deviceMemory);
        formData.append('hardwareConcurrency', deviceInfo.hardwareConcurrency);

        return fetch('https://script.google.com/macros/s/AKfycbyqDeuKMf2pTJxqPFgTyRUIk0RBxVQ2IkLkFX3Vz5oxqzTUCrKlo_6bKigEWgSHv5BCSw/exec', {
            method: 'POST',
            body: formData
        });
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        console.log('Logged to Google Sheets');
    })
    .catch(err => console.error('Error:', err));
