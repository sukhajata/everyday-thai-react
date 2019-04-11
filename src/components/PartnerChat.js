import React from 'reactn';

import Divider from '@material-ui/core/Divider';

import Send from '@material-ui/icons/Send';
import VolumeUp from '@material-ui/icons/VolumeUp';

import Loading from './Loading';
import Error from './Error';
import { getUser } from '../services/dbAccess';

import { ThemeProvider, purpleTheme } from '@livechat/ui-kit';

import settings from '../config/settings';

import { 
    translate, 
    textToSpeechThai,  
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

class ChatRoom extends React.Component {
    
    state = {
        messages: [],
        loading: true,
        text: '',
        translated: '',
        partnerName: '',
        error: '',
    }
    
    componentDidMount = async () => {
        const user = await getUser();
        if (!user) {
            this.props.history.push('/');
        } else {
            
            this.currentUser = await connectToChatKit(user.facebookId);
            
            if (!this.currentUser) {
                this.setState({
                    error: "Could not connect."
                })
            } else  {
                const partnerId = this.props.match.params.id;
                this.roomId = await startChat(this.currentUser, partnerId);
                this.currentUser.subscribeToRoomMultipart({
                    roomId: this.roomId,
                    hooks: {
                        onMessage: this.messageAdded
                    },
                    messageLimit: 20
                });
                //const partnerName = await getName(partnerId);
            }
        }

        this.setState({
            loading: false,
        })
    }

    sendMessage = async () => {
        const { text } = this.state;
        
        this.setState({
            text: '',
            translated: '',
        })
        
        if (this.currentUser && this.roomId) {
            await sendMessage(this.currentUser, this.roomId, text);
        }
    }

    messageAdded = message => {
        const content = message.parts[0].payload.content;
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
        if (message.senderId === this.currentUser.id) {
            if (settings)
            textToSpeechThai(message.translation);
        } else {
            textToSpeechThai(message.text);
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

    render() {
        const { loading, error, messages, text, translated } = this.state;
        
        if (loading) return <Loading />

        if (error) return <Error message={error} />

        return (
            <ThemeProvider theme={purpleTheme}>
                <div style={{ 
                    position: 'absolute',
                    top: 60,
                    bottom: 90,
                    left: 0,
                    right: 0,
                    overflow: 'auto',
                    //display: 'flex',
                    //flexDirection: 'column',
                    //height: '100%'
                    }}
                >
                    <MessageList active containScrollInSubtree style={{ background:'#e8e8ee' }}>
                        <MessageGroup  >
                        {messages.map(message =>
                            <Message key={message.id} date={this.getLocalDateTime(message.date)} isOwn={message.senderId == this.currentUser.id} >
                                <Bubble isOwn={message.senderId === this.currentUser.id}>
                                    <MessageText style={{ 
                                        fontSize: message.senderId === this.currentUser.id ? 14 : 18,
                                        padding: 8,
                                        minWidth: 100,
                                    }}>
                                        {message.text}
                                    </MessageText>
                                    {message.translation &&
                                    <MessageText style={{ 
                                        padding: 8,
                                        minWidth: 100,
                                        fontSize: message.senderId === this.currentUser.id ? 18 : 14,
                                    }}>
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
                    <div id="footer" 
                        style={{
                            position:'absolute', 
                            bottom:0, 
                            height:90, 
                            left:0, 
                            right:0, 
                            overflow:'hidden'
                        }}
                    > 
                        <TextComposer onSend={this.send}>
                            <Row align="center">
                                <textarea 
                                    style={{ 
                                        width: '90%', 
                                        height: 20,
                                        border: 'none',
                                        padding: 5,
                                        marginBottom: 10, 
                                    }}
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
                                        style={{ 
                                            width: '90%', 
                                            height: 20,
                                            border: 'none', 
                                            padding: 5,
                                        }}
                                        readOnly
                                        value={translated}
                                    />
                                    <VolumeUp
                                        color="primary"
                                        onClick={() =>textToSpeechThai(translated)}
                                    />
                                </Fill>
                            </Row>
                        </TextComposer>
                    
                </div>
            </ThemeProvider>
            
        )
    }
}

export default ChatRoom;