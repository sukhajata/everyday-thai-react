import low from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';
import data from './db';


const adapter = new LocalStorage('db');

const db = low(adapter);
const dbName = 'phrases';

export function dbSetup() {
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

//** api **/
export async function getLessons() {
    const lessonData = await fetchJSON("https://sukhajata.com/api/lessons-th-en-graphql.php");
    return lessonData;
}

export async function getLesson(id) {
    const lesson = await fetchJSON("https://sukhajata.com/api/lesson2-th-en.php?id=" + id.toString());
    return lesson;
}

export async function getSlideAndMedia(slideId) {
    const slide = await fetchJSON("https://sukhajata.com/api/slide-and-media-th-en.php?slideId=" + slideId.toString())
    return slide;
}

//** local data **/
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

export async function getSongs() {
    const songData = await fetchJSON("https://sukhajata.com/api/songs-th-en.php");
    return songData;
    //const categories = await getCategories();
    //return categories[8].subCategories;
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