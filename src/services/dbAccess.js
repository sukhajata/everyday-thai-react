import low from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';
//import data from './db';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import { getGlobal, setGlobal } from 'reactn';
import english from './en.translations';
import thai from './th.translations';
import api_en from './en.api';
import api_th from './th.api';
import settings from '../config/settings';

const API = settings.firstLanguage === 'en' ? api_en : api_th;
const adapter = new LocalStorage('db');
const db = low(adapter);
const dbName = settings.dbName;

//const tts = "https://translate.google.com/translate_tts?client=tw-ob&ie=UTF-8&";

//helpers
export function getLanguage() {
    const language = settings.firstLanguage === 'th' ? thai : english;
    return language;
}

async function fetchJSON(url) {
    try {
        const response  = await fetch(url);
        if (response.ok) {
          const json = await response.json();
          return json;
        } else {
          throw Error(response.statusText);
        }
    } catch(error) {
        console.log(error);
        return [];
    }
}

async function post(url, data) {
    try {
        const searchParams = Object.keys(data).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
          }).join('&');

        
         const response = await fetch(url, {
             method: 'POST',
             mode: 'cors',
             headers: {
                 'Accept': 'application/json',
                 //'Content-Type': 'application/json',
                 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                 //"Content-Type": "application/x-www-form-urlencoded",
             },
             //body: JSON.stringify(data), 
             body: searchParams
         });
         if (!response.ok) {
             throw Error(response.statusText);
         }
         const json = response.json();
         return json;
     } catch (error) {
        alert(error);
        return null;
     }
}

//** api **/
export async function getLessons() {
    const lessonData = await fetchJSON(API.LESSONS);
    return lessonData;
}

export async function getLesson(id) {
    const lesson = await fetchJSON(API.LESSON + "?id=" + id.toString());
    return lesson;
}

export async function getSlideAndMedia(slideId) {
    const slide = await fetchJSON(API.SLIDE_AND_MEDIA + "?slideId=" + slideId.toString())
    return slide;
}

export async function getSongs() {
    const songData = await fetchJSON(API.SONGS);
    return songData;
}

export async function getSong(id) {
    const data = await fetchJSON(API.SONG + "?lessonId=" + id);
    return data;
}

export async function getPartners() {
    const users = await fetchJSON(API.PARTNERS + "?firstLanguage=" + settings.firstLanguage);
    return users;
}

export async function signUp(data) {
    const result = await post(API.ADD_USER, data);
    if (result) {
        const response = await fetchJSON(API.ADD_CHATKIT_USER + "?name=" + data.name + "&id=" + result.id);
        if (!response.name) {
            console.log(response);
            alert("error");
        }
    } else {
        console.log(result);
        alert("error");
    }
    return result;
}

//chat
export async function connectToChatKit(userId) {
    try {
        const tokenProvider = new TokenProvider({
            url: API.TOKEN_PROVIDER_URL,
            queryParams: {
                userId
            },
        });

        const chatManager = new ChatManager({
            instanceLocator: 'v1:us1:7248ed21-a745-49e4-bcb4-d14ca24fd506',
            userId,
            tokenProvider,
        });

        const currentUser = await chatManager.connect();
        return currentUser;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function startChat(currentUser, partnerId) {
    try {
        const english = settings.firstLanguage === 'en';
        const englishUserId = english ? currentUser.id : partnerId;
        const thaiUserId = english ? partnerId : currentUser.id;
        
        const result = await fetchJSON(API.GET_ROOM + "?englishUserId=" + englishUserId + "&thaiUserId=" + thaiUserId);
        if (result.roomId && result.roomId > 0) {
            console.log("existing room");
            return result.roomId;
        }

        const room = await currentUser.createRoom({
            name: Date.now().toString(),
            private: true,
            addUserIds: [partnerId],
        });

        if (!room.id) {
            throw new Error(room);
        }
        const data = {
            englishUserId: currentUser.id,
            thaiUserId: partnerId,
            roomId: room.id
        }
        await post(API.ADD_ROOM, data);
        return room.id;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function getRooms(id) {
    const q = settings.firstLanguage === 'th' ? '?thaiUserId=' + id : '?englishUserId=' + id;
    const rooms = await fetchJSON(API.GET_ROOMS + q);
    return rooms;
}

export async function getMessages(currentUser, roomId) {
    try {
        const messages = await currentUser.fetchMultipartMessages({ roomId });
        return messages;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function sendMessage(currentUser, roomId, text) {
    try {
        const result = await currentUser.sendSimpleMessage({
            roomId,
            text,
        });
        /*const partner = await connectToChatKit('woeful');
        await partner.sendSimpleMessage({ 
            roomId, 
            text: "ช่วยบอกรายได้ของคุณให้ฉันฟังได้ไหม"
        });*/
        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function detectLanguage(text) {
    try {
        const result = await post(
            API.DETECT_LANGUAGE, { 
                q: [text], 
            }
        );
        console.log(result);
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function translate(text, code) {
    try {
        const result = await post(
            API.TRANSLATE, { 
                q: [text],
                target: code
            }
        );
        if (result.data) {
            return result.data.translations[0].translatedText;
        } 
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export function textToSpeechEnglish(text) {
   if (window.speechSynthesis) {
        const synth = window.speechSynthesis;
        //const voices = synth.getVoices();
        const utterance = new SpeechSynthesisUtterance(text);
        //utterance.voice = voices.find(voice => voice.lang === 'en-US');
        synth.speak(utterance);
    } else {
        window.responsiveVoice.speak(text, "US Female", {rate: 0.7});
    }
}

export function textToSpeechThai(text) {
    try {
        /*var audio = new Audio();
        audio.src = tts + "tl=th&q=" + text;
        audio.play();*/
        /*if (window.speechSynthesis) {
            const synth = window.speechSynthesis;
            const voices = synth.getVoices();
            const utterance = new SpeechSynthesisUtterance("क्षमा करें, मुझे नहीं पता कि समस्या क्या थी।");
            utterance.voice = voices.find(voice => voice.lang === 'hi-IN');
            synth.speak(utterance);
        }*/
        window.responsiveVoice.speak(text, "Thai Female", {rate: 0.8});

    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function getQuestions() {
    const result = await fetchJSON(API.GET_QUESTIONS);
    return result;
}

//** local data **/
export async function dbSetup() {
    //load voices
    if (window.speechSynthesis) {
        const synth = window.speechSynthesis;
        synth.getVoices();
    }
    if (db.get(dbName).isEmpty().value()) {
        let defaults = {};
        defaults[dbName] = [];
        db.defaults(defaults).write();
        await loadData();
    } 
}

async function loadData() {
    const data = await fetchJSON(API.PHRASES);
    const newArray = db.get(dbName).concat(data).value();
    db.set(dbName, newArray).write();
}

export async function getUser(email) {
    if (getGlobal().user) {
        const user = getGlobal().user;
        return user;
    }
    
    if (localStorage.getItem('everydayUser') !== undefined && localStorage.getItem('everydayUser') !== null) {
        const user = JSON.parse(localStorage.getItem('everydayUser'));
        if (user.facebookId)
        setGlobal({
            user: user,
        })
        return user;
    }

    if (email) {
        const user = await fetchJSON(API.GET_USER + "?email=" + email);
        setUser(user[0]);
        return user;
    }
    
    return null;
}

export function setUser(user) {
    setGlobal({
        user,
    })
    localStorage.setItem('everydayUser', JSON.stringify(user));
}

export async function getCategories() {
    let categories;
    if (localStorage.getItem('categories') !== null) {
        categories = JSON.parse(localStorage.getItem('categories'));
    } else {
        categories = await fetchJSON(API.CAT_SUB);
        localStorage.setItem('categories', JSON.stringify(categories));
    }
    return categories;
}

export function getSubCategory(sid) {
    
    return db.get(dbName)
            .filter({ subCategoryId: sid })
            .value();
    /*const results = fetchJSON(API.SUBCATEGORY + "?id=" + sid);
    console.log(results);
    return results;*/
}


export function searchDb(txt) {
    const reg = new RegExp('(\\b)' + txt.toLowerCase() + '(\\b)', 'g');
    return db.get(dbName)
            .filter(function(item) { 
                return item.firstLanguage.toLowerCase().match(reg); 
            })
            .value();
}


export function toggleFavourite(pid) {
    const phrase = db.get(dbName).find({ pid: pid }).value();
    const isFavourite = !phrase.isFavourite;
    db.get(dbName)
        .find({ pid: pid })
        .assign({ isFavourite: isFavourite })
        .write();
    return isFavourite;
}

export function getFavourites(ids) {
    return db.get(dbName)
            .filter({ isFavourite: true })
            .value();
}