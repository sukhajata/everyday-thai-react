import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import VideoCall from '@material-ui/icons/VideoCall';
import LocalPhone from '@material-ui/icons/LocalPhone';

import adapter from 'webrtc-adapter';
import { startAction, callAction, hangupAction } from '../services/rtc';

class AudioChat extends React.Component {

    state={
        peerId: '',
        inCall: false,
    }

    componentDidMount = async() => {
        this.peer = new window.Peer({key: 'lwjd5qra8257b9'});
        this.peer.on('open', this.onPeerOpen);
        this.peer.on('connection', this.onPeerConnection);
        this.peer.on('call', this.onPeerCall);

        const stream = await startAction();
        if (stream) {
            console.log("Stream retrieved");
            this.localStream = stream;
            this.video.srcObject = stream;
        } else {
            console.log("Could not retrieve stream");
        }
    }

    onPeerOpen = id => {
        this.peerId = id;
        console.log("My peer id is: ", this.peerId);
    }

    onPeerConnection = conn => {
        this.peerConnection = conn;
        console.log("Peer connected");
    }

    onPeerCall = call => {
        call.answer(this.localStream);
        call.on('stream', remoteStream => this.remoteVideo.srcObject = remoteStream);

    }

    handleClickCall = async () => {
        //callAction(this.localStream);
        const remoteStream = await this.peer.call(this.state.peerId, this.localStream);
        this.remoteVideo.srcObject = remoteStream.localStream;
        this.setState({
            inCall: true,
        })
    }

    onPeerIdChanged = ({ target }) => {
        this.setState({
            peerId: target.value,
        })
    }

    handleClickHangup = () => {
        //hangupAction();
        this.setState({
            inCall: false,
        })
    }

    render() {
        const { inCall } = this.setState;

        return (
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

                <div>
                    <TextField
                        onChange={this.onPeerIdChanged}
                        variant="outlined"
                    />
                </div>
                <div>
                    {!inCall &&
                    <Button 
                        id="callButton" 
                        onClick={this.handleClickCall}
                    >Call</Button>
                    }
                    {inCall &&
                    <LocalPhone 
                        id="hangupButton" 
                        color="error"
                        onClick={this.handleClickHangup}
                    />
                    }
                </div>
            </>
        )
    }
}

export default AudioChat;