import React from 'reactn';

import Divider from '@material-ui/core/Divider';

import ControlPoint from '@material-ui/icons/ControlPoint';
import Send from '@material-ui/icons/Send';
import VolumeUp from '@material-ui/icons/VolumeUp';

import Loading from './Loading';

import { ThemeProvider, darkTheme, purpleTheme, elegantTheme } from '@livechat/ui-kit';

import { 
    translate, 
    translateToThai, 
    translateToEnglish,
    textToSpeechThai,  
    connectToChatKit, 
    startChat, 
    sendMessage, 
    getQuestions 
} from '../services/dbAccess';

import {
    Avatar,
    Bubble,
	TitleBar,
	TextInput,
	MessageList,
	Message,
	MessageText,
	AgentBar,
	Title,
	Subtitle,
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


class ChatRoom extends React.Component {
    
    state = {
        messages: [],
        loading: true,
        text: '',
        translated: '',
    }
    
    componentDidMount = async () => {
        if (!this.global.user) {
            this.props.history.push('/');
        } else {
            const id = this.global.user.id;
            this.currentUser = await connectToChatKit(id);
            if (this.currentUser) {
                this.room = await startChat(this.currentUser, 'woeful');
                this.currentUser.subscribeToRoomMultipart({
                    roomId: this.room.id,
                    hooks: {
                        onMessage: message => {
                            const content = message.parts[0].payload.content;
                            console.log(message.createdAt);
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
                            if (message.senderId == this.currentUser.id) {
                                this.translateTextToThai(message.id, content);
                            } else {
                                this.translateTextToEnglish(message.id, content);
                            }
                            
                      }
                    },
                    messageLimit: 10
                  })
            }
        }

        this.setState({
            loading: false,
        })
    }


    /*send = async (text) => {
        if (this.currentUser && this.room) {
            await sendMessage(this.currentUser, this.room.id, text);
        }
    }*/

    sendMessage = async () => {
        const { text } = this.state;
        
        this.setState({
            text: '',
            translated: '',
        })
        
        if (this.currentUser && this.room) {
            await sendMessage(this.currentUser, this.room.id, text);
        }
    }

    onTextChanged = async ({ target }) => {
        this.setState({ text: target.value });
        const translated = await translateToThai(target.value);
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
        if (keyCode == 13) {
            this.sendMessage();
        } 
    }

    handleClickTranslate = async (messageId, text) => {
        const result = await translate(text);
        if (result) {
            const messages = this.state.messages.map(message => {
                if (message.id === messageId) {
                    message.translation = result;
                }
                return message;
            });
            this.setState({
                messages,
            })
        }
    }

    translateTextToThai = async (messageId, text) => {
        const translated = await translateToThai(text);
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

    translateTextToEnglish = async (messageId, text) => {
        const translated = await translateToEnglish(text);
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
        if (message.senderId == this.currentUser.id) {
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
        const { loading, messages, text, translated } = this.state;
        
        if (loading) return <Loading />

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