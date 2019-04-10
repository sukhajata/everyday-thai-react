const GOOGLE_TRANSLATE_API_KEY ="AIzaSyBJqySoURbtkysGF0yEaXu4SDuOJAdRbOo";
const API_BASE = "https://sukhajata.com/api/";

export default {
    CAT_SUB: API_BASE + "catsub-en-th.php",
    SUBCATEGORY: API_BASE + "subcategory-en-th.php",
    PHRASES: API_BASE + "phrases-en-th.php",
    LESSONS: API_BASE + "lessons-en-th.php",
    LESSON: API_BASE + "lesson-en-th.php",
    SLIDE_AND_MEDIA: API_BASE + "slide-and-media-en-th.php",
    SONGS: API_BASE + "songs-en-th.php",
    SONG: API_BASE + "song-en-th.php",
    PARTNERS: API_BASE + "english-users.php",
    ADD_USER: API_BASE + "add-thai-user.php",
    GET_USER: API_BASE + "thai-users.php",
    ADD_ROOM: API_BASE + "add-room.php",
    GET_ROOM: API_BASE + "get-room.php",
    GET_ROOMS: API_BASE + "get-rooms.php",
    GET_QUESTIONS: API_BASE + "get-questions.php",
    ADD_CHATKIT_USER: "https://peaceful-beyond-64504.herokuapp.com/create-user",
    TOKEN_PROVIDER_URL: "https://peaceful-beyond-64504.herokuapp.com/auth",
    DETECT_LANGUAGE: `https://translation.googleapis.com/language/translate/v2/detect?key=${GOOGLE_TRANSLATE_API_KEY}`,
    TRANSLATE: `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
}
