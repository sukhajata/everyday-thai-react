import React from 'react';

const VideoChat = React.forwardRef((props, localRef) => (
    <>
        <video 
            id="localVideo" 
            ref={video => this.video = video}
            width="120"
            autoPlay 
            playsInline
        ></video>
        
        <video 
            id="remoteVideo" 
            ref={video => this.remoteVideo = video}
            autoPlay 
            playsInline
        ></video>
    </>
))

export default VideoChat;