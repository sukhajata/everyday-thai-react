import React from 'reactn';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { ChatFeed, Message } from 'react-chat-ui'

import Loading from './Loading';

import { connectToChatKit, startChat, sendMessage } from '../services/dbAccess';

class ChatRoom extends React.Component {
    
    state = {
        messages: [],
        newMessage: '',
        loading: true,
    }
    
    componentDidMount = async () => {
        if (!this.global.user) {
            this.props.history.push('/');
        } else {
            const id = this.global.user.id;
            this.currentUser = await connectToChatKit(id)
            if (this.currentUser) {
                this.room = await startChat(this.currentUser, 'woeful');
                this.currentUser.subscribeToRoomMultipart({
                    roomId: this.room.id,
                    hooks: {
                        onMessage: message => {
                            console.log(message);
                            const msg = {
                                id: message.id,
                                message: message.parts[0].payload.content,
                                senderId: message.senderId,
                                date: message.createdAt,
                            };
                            const messages =  [
                                ...this.state.messages,
                                msg,
                            ];

                            console.log(messages);
                            this.setState({
                                messages,
                            })
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

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    }

    send = async () => {
        if (this.currentUser && this.room) {
            const result = await sendMessage(this.currentUser, this.room.id, this.state.newMessage);
            console.log(result);

        }
        this.setState({
            newMessage: '',
        })
    }

    render() {
        const { loading, messages, newMessage } = this.state;
        
        if (loading) return <Loading />

        return (
            <React.Fragment>
                  <ChatFeed
                    messages={messages} // Boolean: list of message objects
                   // isTyping={this.state.is_typing} // Boolean: is the recipient typing
                    hasInputField={false} // Boolean: use our input, or use your own
                    showSenderName // show the name of the user who sent the message
                    bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
                    // JSON: Custom bubble styles
                    bubbleStyles={
                        {
                        text: {
                            fontSize: 16,
                            color: '#fff',
                        },
                        chatbubble: {
                            borderRadius: 50,
                            padding: 20,
                            backgroundColor:'#000063',
                        }
                        }
                    }
                />
                <TextField
                    id="new"
                    label="Message"
                    value={newMessage}
                    margin="normal"
                    placeholder="Nice to meet you..."
                    onChange={this.handleChange('newMessage')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.send}
                >Send</Button>
            </React.Fragment>
        )
    }
}

export default ChatRoom;