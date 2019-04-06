import React from 'reactn';

import { ThemeProvider } from '@livechat/ui-kit';
import theme from '../themeChat';

import {
	Avatar,
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
	TextComposer,
	Row,
	Fill,
	Fit,
	IconButton,
	SendButton,
	EmojiIcon,
	CloseIcon,
	Column,
	Bubble,
} from '@livechat/ui-kit';

const getAvatarForUser = (userId, users) => {
	const foundUser = users[userId]
	if (foundUser && foundUser.avatarUrl) {
		return foundUser.avatarUrl
	}
	return null
}

const parseUrl = (url) => url && 'https://' + url.replace(/^(http(s)?\:\/\/)/, '').replace(/^\/\//, '');

const Chat = ({
	chatState,
	events,
	onMessageSend,
	users,
	ownId,
	currentAgent,
	minimize,
	maximizeChatWidget,
	sendMessage,
	rate,
}) => {
	return (
        <ThemeProvider>
            <div
                style={{
                    height: '100%',
                    
                }}
            >
                <MessageList active>
    <MessageGroup
      avatar="https://livechat.s3.amazonaws.com/default/avatars/male_8.jpg"
      onlyFirstWithMeta
    >
      <Message authorName="Jon Smith" date="21:37">
        <MessageText>
          The fastest way to help your customers - start chatting with visitors
        </MessageText>
        <MessageText>
          The fastest way to help your customers - start chatting with visitors
          who need your help using a free 30-day trial.
        </MessageText>
        <MessageButtons>
          <MessageButton label="View more" primary />
          <MessageButton label="Cancel" />
        </MessageButtons>
      </Message>
      <Message date="21:38" authorName="Jon Smith">
        <MessageText>Hi! I would like to buy those shoes</MessageText>
      </Message>
    </MessageGroup>
    <MessageGroup onlyFirstWithMeta>
      <Message date="21:38" isOwn={true} authorName="Visitor">
        <MessageText>
          I love them
          sooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
          much!
        </MessageText>
      </Message>
      <Message date="21:38" isOwn={true} authorName="Visitor">
        <MessageText>This helps me a lot</MessageText>
      </Message>
    </MessageGroup>
    <MessageGroup
      avatar="https://livechat.s3.amazonaws.com/default/avatars/male_8.jpg"
      onlyFirstWithMeta
    >
      <Message authorName="Jon Smith" date="21:37">
        <MessageText>No problem!</MessageText>
      </Message>
      <Message
        authorName="Jon Smith"
        imageUrl="https://static.staging.livechatinc.com/1520/P10B78E30V/dfd1830ebb68b4eefe6432d7ac2be2be/Cat-BusinessSidekick_Wallpapers.png"
        date="21:39"
      >
        <MessageText>
          The fastest way to help your customers - start chatting with visitors
          who need your help using a free 30-day trial.
        </MessageText>
      </Message>
    </MessageGroup>
  </MessageList>
            </div>
        </ThemeProvider>
    )
}


export default Chat;
