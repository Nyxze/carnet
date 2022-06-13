import {Component, OnInit} from '@angular/core';
import {NoteModel, NoteService} from '../../services/note.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ViewWillEnter} from '@ionic/angular';
import {formatDate} from "@angular/common";
import {Camera, CameraResultType, CameraSource, ImageOptions} from '@capacitor/camera';


@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {

  public noteForm: FormGroup;
  public note: NoteModel;
  private id: string;


  constructor(private noteService: NoteService,
              private router: Router,
              private currentRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.currentRoute.paramMap.subscribe(
      (data) => {
        this.id = data.get('id');
        const note = this.noteService.getNote(this.id);
        console.log(note);

        this.noteForm = new FormGroup<any>({
          title: new FormControl(note.title, {
            validators: [
              Validators.required
            ]
          }),
          text: new FormControl(note.text, {
            validators: [
              Validators.required
            ]
          }),
          photo: new FormControl(note.photo, {
            validators: []
          }),
          date: new FormControl(note.date, {
            validators: [
              Validators.required
            ]
          }),
          rating: new FormControl(note.rating, {
            validators: [
              Validators.required
            ]
          }),
        });

        console.log(this.noteForm);
      }
    );

  }

  onValidForm() {
    if (this.noteForm.status === 'VALID') {
      if (this.id) {
        this.noteService.updateNote(this.noteForm.value, this.id);
      } else {
        this.noteService.addNewNote(this.noteForm.value);
      }
      this.router.navigateByUrl('/home');
    }
  }

  onDeleteNote() {

    this.noteService.deleteNote(this.id);
    this.router.navigateByUrl('/home');
  }


  async takePhoto() {

    console.log(this.noteForm.value);

    if (!this.noteForm.value.photo) {
      this.noteForm.value.photo = [];
    }

    const options: ImageOptions = {
      quality: 75,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    };
    this.noteForm.value.photo.push((await Camera.getPhoto(options)).base64String);
    console.log(this.noteForm.value);
  }

  getImgSrc(img) {
    return 'data:image/jpeg;base64,' + img;
  }


}
