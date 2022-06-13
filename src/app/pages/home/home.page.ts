import { Component, OnInit } from '@angular/core';
import {NoteModel, NoteService} from "../../services/note.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  public noteList: NoteModel[];
  private startDate: Date;
  private endDate: Date;
  private rating;
  constructor(public ns: NoteService) {
  }

  async ngOnInit() {
   this.noteList = await this.ns.getNotes();
  }

  onSelectRating(){
    this.noteList=this.ns.getNoteByRating(this.rating);
    console.log(this.rating);

  }
  onSelectDate(){
    this.noteList=this.ns.getNotesByDate(this.startDate,this.endDate);
    console.log(this.rating);

  }


  filterResult(){
    this.noteList = this.ns.getNotesByDateAndRating(this.startDate,this.endDate,this.rating);
  }
  async reset(){
    this.noteList = await this.ns.getNotes();
  }



}
