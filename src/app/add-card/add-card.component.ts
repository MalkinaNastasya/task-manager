import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MainService } from '../shared/services/main.service';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent implements OnInit {

  form: FormGroup;

  // Логическая переменная, определяющая наличие или отсутсвие сообщения о незаполненных обязательных полях 
  isEmpty=true;
  // Логическая переменная, определяющая наличие или отсутсвие сообщения об успешном добавлении
  succes=false;
  api: any;

  id_user = localStorage.getItem("id_user");
  time = new Date();
  status = "Не выполнено";

  constructor(private mainService: MainService) { }

  ngOnInit() {
    // Инициализация FormGroup, создание FormControl, и назанчение Validators
    this.form = new FormGroup({
      'title': new FormControl('', [Validators.required]),
      'body': new FormControl('', [Validators.required]),
      })
      console.log(this.id_user)
  }

  // Функция добавления карточки
  async onAdd(){   
    if ((this.form.value.title=="")||(this.form.value.body=="")) {
      this.isEmpty=false;
    } else {
      this.isEmpty=true;
      let task = {
        id_user: this.id_user,
        title: this.form.value.title,
        body: this.form.value.body,
        time: this.time,
        status: this.status,
      }
      console.log(task);
      try {;
        let result = await this.mainService.post(JSON.stringify(task), "/add");
      } catch (err) {
        console.log(err);
      }
      this.form.reset();
      this.succes=true;
    }   
  }
// Функция, скрывающая сообщения о незаполненности полей и успешном добавлении карточки
  onSucces(){
    this.succes=false;
    this.isEmpty=true;
  }

}
