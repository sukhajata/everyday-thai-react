function hasGetUserMedia() {
    return !!(navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia);
  }
  
  export async function getAudioStream() {
    if (hasGetUserMedia()) {
        // Good to go!
        const constraints = {
            audio: true
          };
          
        const stream = await navigator.mediaDevices.getUserMedia(constraints); 
        return stream;
          //  then((stream) => {video.srcObject = stream});

    } else {
        return null;
    }
}