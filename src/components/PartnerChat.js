import React from 'reactn';

import Divider from '@material-ui/core/Divider';

import Send from '@material-ui/icons/Send';
import VolumeUp from '@material-ui/icons/VolumeUp';
import VideoCall from '@material-ui/icons/VideoCall';
import LocalPhone from '@material-ui/icons/LocalPhone';
import { withStyles } from '@material-ui/core/styles';
import styles from '../styles';
import Loading from './Loading';
import Error from './Error';
import { getUser } from '../services/dbAccess';
import { withFirebase } from '../firebase';

import { ThemeProvider, purpleTheme } from '@livechat/ui-kit';
import { startAction } from '../services/rtc';

import settings from '../config/settings';

import { 
    translate, 
    textToSpeechThai,
    textToSpeechEnglish,  
    connectToChatKit, 
    startChat, 
    sendMessage, 
    getQuestions, 
} from '../services/dbAccess';

import {
    Avatar,
    Bubble,
	TitleBar,
	TextInput,
	MessageList,
	Message,
	MessageText,
	MessageGroup,
	MessageButtons,
	MessageButton,
	MessageTitle,
    MessageMedia,
    QuickReplies,
	TextComposer,
	Row,
	Fill,
    Fit,
    FixedWrapper,
	IconButton,
	SendButton,
	EmojiIcon,
	CloseIcon,
	Column,
} from '@livechat/ui-kit';

const english = settings.firstLanguage === 'en';
/*const mediaStreamConstraints = {
    video: { width: 320, height: 180},
    audio: true,
  };
const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
*/
class ChatRoom extends React.Component {
    
    state = {
        messages: [],
        loading: true,
        text: '',
        translated: '',
        partnerName: '',
        error: '',
        inCall: false,
    }
    
    componentDidMount = async () => {
        this.props.firebase.registerAuthenticationStateChangedListener(this.onAuthenticationStateChanged);
    }

    onAuthenticationStateChanged = async user => {
        if (user != null) {
            this.currentUser = await connectToChatKit(user.uid);
        
            if (!this.currentUser) {
                this.setState({
                    error: "Could not connect."
                })
            } else  {
                this.partnerId = this.props.match.params.id;
                this.roomId = await startChat(this.currentUser, this.partnerId, this.props.firebase);
                
                this.currentUser.subscribeToRoomMultipart({
                    roomId: this.roomId,
                    hooks: {
                        onMessage: this.messageAdded
                    },
                    messageLimit: 20
                });
                
                this.peer = new window.Peer({
                    key: 'lwjd5qra8257b9'
                });
                this.peer.on('open', this.onPeerOpen);
                this.peer.on('connection', this.onPeerConnection);
                this.peer.on('call', this.onPeerCall);
            }
            
    
            this.setState({
                loading: false,
            })
        }
    }

    onPeerOpen = async id => {
        await this.props.firebase.setPeerId(this.roomId, id);
        console.log("My peer id is: ", id);
    }

    onPeerConnection = conn => {
        this.peerConnection = conn;
        console.log("Peer connected");
    }

    onPeerCall = async call => {
        const stream = await startAction();
        call.answer(stream);
        call.on('stream', remoteStream => {
            this.remoteStream.srcObject = remoteStream.localStream;
        })
    }

    sendMessage = async () => {
        const { text } = this.state;
        
        this.setState({
            text: '',
            translated: '',
        })
        
        if (text.length > 1 && this.currentUser && this.roomId) {
            await sendMessage(this.currentUser, this.roomId, text);
        }
    }

    messageAdded = message => {
        const content = message.parts[0].payload.content;
        if (content) {
            const msg = {
                id: message.id,
                text: content,
                senderId: message.senderId,
                date: message.createdAt,
            };
            const messages =  [
                ...this.state.messages,
                msg,
            ];
            
            this.setState({
                messages,
            });
            if (message.senderId === this.currentUser.id) {
                if (english) {
                    this.translateText(message.id, content, "th");
                } else {
                    this.translateText(message.id, content, 'en');
                }
            } else {
                if (english) {
                    this.translateText(message.id, content, "en");
                } else {
                    this.translateText(message.id, content, 'th');
                }
            }
        }
    }

    onTextChanged = async ({ target }) => {
        this.setState({ text: target.value });
        let translated = '';
        if (english) {
            translated = await translate(target.value, "th");
        } else {
            translated = await translate(target.value, "en");
        }
        if (translated) {
            //check if message has been sent already
            if (this.state.text.length > 1) {
                this.setState({ 
                    translated 
                })
            }
           
        } 
    }

    onKeyUp = async ({ keyCode }) => {
        if (keyCode === 13) {
            this.sendMessage();
        } 
    }

    translateText = async (messageId, text, code) => {
        const translated = await translate(text, code);
        const messages = this.state.messages.map(message => {
            if (message.id === messageId) {
                message.translation = translated;
            }
            return message;
        });
        this.setState({
            messages,
        })
    }


    handleClickPlay = message => {
        if (english) {
            if (message.senderId === this.currentUser.id) {
                textToSpeechThai(message.translation);
            } else {
                textToSpeechThai(message.text);
            }
        } else {
            if (message.senderId === this.currentUser.id) {
                textToSpeechEnglish(message.translation);
            } else {
                textToSpeechEnglish(message.text);
            }
        }
    }

    showQuestions = async () => {
        const questions = await getQuestions();
        console.log(questions);
    }

    getLocalDateTime = utc => {
        var local = new Date(utc);
        //var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        var output = local.toLocaleString()
        return output;
    }

    startVideoCall = async () => {
        const partnerPeerId = await this.props.firebase.getPartnerPeerId(this.roomId);
        this.setState({ inCall: true });
        try {
            const stream = await startAction();
            this.video.srcObject = stream;
            const call = this.peer.call(partnerPeerId, stream);
            call.on('call', this.receiveRemoteStream);
            
        } catch (error) {
            console.log(error);
            alert("User not found");
            //this.setState({ inCall: false });
        }
    }
    
    receiveRemoteStream = remoteStream => {
        console.log(remoteStream);
        this.remoteVideo.srcObject = remoteStream.localStream;
    }

    handleClickHangup = () => {
        this.remoteVideo.srcObject = null;
        this.video.srcObject = null;
        this.setState({
            inCall: false,
        })
    }

    render() {
        const { loading, error, messages, text, translated, inCall } = this.state;
        const { classes } = this.props;

        if (loading) return <Loading />

        if (error) return <Error message={error} />

        return (
            <ThemeProvider theme={purpleTheme}>
                <div style={{position: 'absolute', top: 15, right: 10, zIndex: 20000, color: '#fff'}}>
                {inCall &&
                    <LocalPhone onClick={this.handleClickHangup} style={{ color: '#f0f0f0' }}/>
                }
                {!inCall &&
                    <VideoCall onClick={this.startVideoCall}/>
                }
                </div>
                <div className={inCall ? classes.videoCall : classes.hidden}>
                    <video 
                        id="remoteVideo" 
                        ref={video => this.remoteVideo = video}
                        autoPlay 
                        playsInline
                    ></video>
                     <video 
                        id="localVideo" 
                        ref={video => this.video = video}
                        style={{width: 120, position: 'relative', top: -120}}
                        autoPlay 
                        playsInline
                    ></video>
                </div>
                <div className={inCall ? classes.messageContainerWithVideo : classes.messageContainer}>
                    <MessageList active containScrollInSubtree style={{ background:'#e8e8ee' }}>
                        <MessageGroup  >
                        {messages.map(message =>
                            <Message key={message.id} date={this.getLocalDateTime(message.date)} isOwn={message.senderId == this.currentUser.id} >
                                <Bubble isOwn={message.senderId === this.currentUser.id}>
                                    <MessageText className={classes.message}>
                                        {message.text}
                                    </MessageText>
                                    {message.translation &&
                                    <MessageText className={classes.message}>
                                        {message.translation}
                                    </MessageText>
                                    }
                                    <MessageButtons>
                                        <VolumeUp 
                                            style={{ padding: 8 }}
                                            onClick={() => this.handleClickPlay(message)}
                                        />
                                    </MessageButtons>
                                    
                                    
                                </Bubble>
                            </Message>
                        )}
                        </MessageGroup>
                    </MessageList>
                    </div>
                    <div id="footer" className={classes.messageFooter}> 
                        <TextComposer onSend={this.send}>
                            <Row align="center">
                                <textarea 
                                    className={classes.messageInputUpper}
                                    placeholder={english ? 'EN' : 'ไทย'}
                                    value={text}
                                    onChange={this.onTextChanged}
                                    onKeyUp={this.onKeyUp}
                                />
                                <Send
                                    color="primary"
                                    onClick={this.sendMessage}
                                />
                            </Row>
                            <Divider />
                            <Row align="center">
                                <Fill>
                                    <textarea 
                                        className={classes.messageInputLower}
                                        readOnly
                                        value={translated}
                                    />
                                    <VolumeUp
                                        color="primary"
                                        onClick={
                                            english ?
                                            () => textToSpeechThai(translated) :
                                            () => textToSpeechEnglish(translated)
                                        }
                                    />
                                </Fill>
                            </Row>
                        </TextComposer>
                </div>

            </ThemeProvider>
        )
    }
}

const fired = withFirebase(ChatRoom);
export default withStyles(styles)(fired);