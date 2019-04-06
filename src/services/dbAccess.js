import low from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';
import data from './db';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import keys from '../keys';

const adapter = new LocalStorage('db');

const db = low(adapter);
const dbName = 'phrases';

const api_base = "https://sukhajata.com/api/";
const api_lessons = api_base + "lessons-th-en-graphql.php";
const api_lesson = api_base + "lesson2-th-en.php";
const api_slide_and_media = api_base + "slide-and-media-th-en.php";
const api_songs = api_base + "songs-th-en.php";
const api_partners = api_base + "thai-users.php";
const api_add_user = api_base + "add-english-user.php";
const api_get_questions = api_base + "get-questions.php";
const api_add_chatkit_user = "https://peaceful-beyond-64504.herokuapp.com/create-user";
const token_provider_url = "https://peaceful-beyond-64504.herokuapp.com/auth";
const api_detect_language = `https://translation.googleapis.com/language/translate/v2/detect?key=${keys.GOOGLE_TRANSLATE_API_KEY}`;
const api_translate = `https://translation.googleapis.com/language/translate/v2?key=${keys.GOOGLE_TRANSLATE_API_KEY}`;
const tts = "https://translate.google.com/translate_tts?client=tw-ob&ie=UTF-8&";
//client=tw-ob
//helpers
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
    const lessonData = await fetchJSON(api_lessons);
    return lessonData;
}

export async function getLesson(id) {
    const lesson = await fetchJSON(api_lesson + "?id=" + id.toString());
    return lesson;
}

export async function getSlideAndMedia(slideId) {
    const slide = await fetchJSON(api_slide_and_media + "?slideId=" + slideId.toString())
    return slide;
}

export async function getSongs() {
    const songData = await fetchJSON(api_songs);
    return songData;
}

export async function getPartners() {
    const users = await fetchJSON(api_partners);
    return users;
}

export async function signUp(data) {
    const result = await post(api_add_user, data);
    if (result) {
        const response = await fetchJSON(api_add_chatkit_user + "?name=" + data.name + "&id=" + result.id);
        if (!response.name) {
            console.log(response);
            alert("error");
        }
    }
    return result;
}

//chat
export async function connectToChatKit(userId) {
    try {
        const tokenProvider = new TokenProvider({
            url: token_provider_url,
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
        const room = await currentUser.createRoom({
            name: Date.now().toString(),
            private: true,
            addUserIds: [partnerId],
        });
        return room;
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
        const partner = await connectToChatKit('woeful');
        await partner.sendSimpleMessage({ 
            roomId, 
            text: "ช่วยบอกรายได้ของคุณให้ฉันฟังได้ไหม"
        });
        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function detectLanguage(text) {
    try {
        const result = await post(
            api_detect_language, { 
                q: [text], 
            }
        );
        console.log(result);
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function translate(text) {
    try {
        const result = await post(
            api_translate, { 
                q: [text],
                target: "en" 
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

export async function translateToThai(text) {
    try {
        const result = await post(
            api_translate, { 
                q: [text],
                target: "th" 
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

export async function translateToEnglish(text) {
    try {
        const result = await post(
            api_translate, { 
                q: [text],
                target: "en" 
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
        window.responsiveVoice.speak(text, "Thai Female", {rate: 0.7});

    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function getQuestions() {
    const result = await fetchJSON(api_get_questions);
    return result;
}

//** local data **/
export function dbSetup() {
    //load voices
    if (window.speechSynthesis) {
        const synth = window.speechSynthesis;
        synth.getVoices();
    }
    if (db.get(dbName).isEmpty().value()) {
        db.defaults({phrases: []})
            .write();
        loadData();
    } 
}

function loadData() {
    const newArray = db.get(dbName).concat(data).value();
    db.set(dbName, newArray).write();
}

export async function getCategories() {
    let categories;
    if (localStorage.getItem('categories') !== null) {
        categories = JSON.parse(localStorage.getItem('categories'));
    } else {
        const url = 'https://sukhajata.com/el/catsub.php?lanId=3';
        categories = await fetchJSON(url);
        localStorage.setItem('categories', JSON.stringify(categories));
    }
    return categories;
}

export function getSubCategory(sid) {
    //console.log("reading from local storage");
    return db.get(dbName)
            .filter({ subCategoryId: sid })
            .value();
}


export function searchDb(txt) {
    const reg = new RegExp('(\\b)' + txt.toLowerCase() + '(\\b)', 'g');
    return db.get('phrases')
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