$('document').ready(() => {
  function doesUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
  if (doesUserMedia()) {
    console.log('good to go');
  } else {
    alert('not supported by your browser- try using Chrome!');
  }

  //set up camera and audio
  const constraints = {
    video: true,
  };

  const photoVideo = document.getElementById('photoVideo');
  const screenshotVideo = document.getElementById('screenshotVideo');

  navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    photoVideo.srcObject = stream;
  });

  navigator.mediaDevices.getDisplayMedia().then(stream => {
    screenshotVideo.srcObject = stream;
  });

  const canvas = document.createElement('canvas');
  let spokenWord;

  const photoWords = ['photo', 'take a photo'];
  const screenshotWords = ['screenshot', 'take a screenshot'];

  const takePhoto = async () => {
    const img = await new Image();
    let videoType;
    if (photoWords.includes(spokenWord)) videoType = photoVideo;
    if (screenshotWords.includes(spokenWord)) videoType = screenshotVideo;
    canvas.width = videoType.videoWidth;
    canvas.height = videoType.videoHeight;
    canvas.getContext('2d').drawImage(videoType, 0, 0);

    img.src = canvas.toDataURL();
    $('#gallery').prepend(img);
  };

  //set up recognition

  var recognition = new webkitSpeechRecognition();

  recognition.lang = 'en-US';
  recognition.continuous = true;

  recognition.onspeechstart = () => {
    console.log('speech detected');
  };

  recognition.start();
  recognition.onresult = event => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        spokenWord = event.results[i][0].transcript.trim();
        if (
          photoWords.includes(spokenWord) ||
          screenshotWords.includes(spokenWord)
        ) {
          takePhoto();
        }
      }
    }
  };

  recognition.onend = () => {
    recognition.start();
  };
});
