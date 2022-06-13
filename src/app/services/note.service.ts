import {Injectable} from '@angular/core';
import {Storage} from '@capacitor/storage';
import {formatDate} from "@angular/common";


export interface NoteInterface {
  title: string;
  text: string;
  id?: number;
  date: Date;
  photo?: string[];
  rating: number;

}

export class NoteModel implements NoteInterface {
  title: string;
  id: number;
  text: string;
  date: Date;
  photo?: string[];
  rating: number;

  constructor(data: NoteInterface = null) {
    if (data) {
      this.title = data.title;
      this.date = data.date;
      this.id = data.id;
      this.text = data.text;
      this.photo = data.photo;
      this.rating = data.rating;
    }

    if (!this.id) {
      this.id = new Date().getTime();
    }
  }


}

const STORAGE_KEY = 'Notes';

@Injectable({
  providedIn: 'root'
})

export class NoteService {

  public noteList: NoteModel[];


  constructor() {

  }


  addNewNote(note) {
    this.noteList.push(
      new NoteModel(note)
    );

    Storage.set({
      key: STORAGE_KEY,
      value: JSON.stringify(this.noteList)
    });
  }

  updateNote(note: NoteModel, id) {

    const index = this.noteList.findIndex((item) => item.id == id);

    console.log(index);
    if (index >= 0) {
      this.noteList[index] = new NoteModel(note);
      console.log(this.noteList[index]);
    }

    Storage.set({
      key: STORAGE_KEY,
      value: JSON.stringify(this.noteList)

    });
  }

  getNote(id): NoteModel {

    const note = this.noteList.filter((item) => item.id == id);

    if (note.length === 0) {
      return new NoteModel();
    } else {
      return note[0];
    }
  }

  deleteNote(id) {
    console.log(id);
    const index = this.noteList.findIndex((item) => item.id == id);
    console.log(index);
    this.noteList.splice(index, 1);
    Storage.set({
      key: STORAGE_KEY,
      value: JSON.stringify(this.noteList)

    });
  }


  getNoteByRating(rating) {
    const noteList = this.noteList.filter((item: NoteModel) => {
      return item.rating == rating;
    });
    console.log(noteList);
    return noteList;

  }
  getNotesByDate(startDate,endDate){
    if(!endDate){
      endDate = formatDate(new Date(Date.now()),'yyyy-MM-dd','en');
      console.log(startDate);
      console.log(endDate);
    }
    const noteList = this.noteList.filter((item: NoteModel) => {
      return item.date <= endDate && item.date>= startDate;
    });

    return noteList;
  }
  getNotesByDateAndRating(startDate,endDate,rating) {

    let noteList = [];
    if (!endDate) {
      endDate = formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en');
      console.log(startDate);
      console.log(endDate);
    }
    if (!rating) {
      noteList = this.noteList.filter((item: NoteModel) => {
        return item.date <= endDate && item.date >= startDate;
      });
    } else if (rating && !startDate) {
      noteList = this.noteList.filter((item: NoteModel) => {
        return item.date <= endDate && item.rating >= rating;
      });
      console.log(noteList);
    } else {
      noteList = this.noteList.filter((item: NoteModel) => {
        return item.date <= endDate && item.date >= startDate && item.rating >= rating;
      });
    }
    return noteList;
  }

  public async getNotes() {
    this.noteList = JSON.parse(
      (await Storage.get({ key: STORAGE_KEY })).value
    );

    return this.noteList;
  }
}
