import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from '../shared/services/main.service';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit {

  // Логическая переменная, определяющая наличие или отсутсвие сообщения о неправильном логине или пароле 
  notExistLoginOrPassword=true;
  // Логическая переменная, определяющая наличие или отсутсвие сообщения о незаполненных обязательных полях 
  isEmpty=true;
  form :FormGroup;
  user = {
    id_user: "",
    login: "",
    password: "",
    name: "",
    email: ""
  }

constructor(private api: MainService, private router: Router) { }
ngOnInit() {
  // Инициализация FormGroup, создание FormControl, и назанчение Validators
  this.form = new FormGroup({
    'login': new FormControl('', [Validators.required]),
    'password': new FormControl('', [Validators.required]) 
  });
}

// Функция входа, отправляющая данные, полученные с формы на сервер, и реагирующая на ответ с сервера
async onLogin() {
 localStorage.clear();
  if ((this.form.value.login=="")||(this.form.value.password=="")) {
    this.isEmpty=false;
  } else
  {
    this.isEmpty=true;
    let infoAboutUser;
  infoAboutUser = {
    login: this.form.value.login,
    password: this.form.value.password,
  }
  console.log(infoAboutUser);
  try {
    let ExistOrNot = await this.api.post(JSON.stringify(infoAboutUser), "/login");
    this.form.reset();  
    if (ExistOrNot != "not exist") {
      this.user.id_user = ExistOrNot[0].id_user;
      this.user.login = ExistOrNot[0].login;
      this.user.password = ExistOrNot[0].password;
      this.user.name = ExistOrNot[0].name; 
      this.user.email = ExistOrNot[0].email; 
      console.log(this.user);       
      this.notExistLoginOrPassword = true;
      localStorage.setItem("id_user", this.user.id_user);
      localStorage.setItem('name', this.user.name);
      this.router.navigate(['/cabinet']);
    } else {
      this.notExistLoginOrPassword = false;
      console.log(localStorage.setItem("id_user", this.user.id_user));
      console.log("Неверный логин или пароль");
    } 
  } catch (error) {
    console.log(error);
  }
  }
  
 }

 // Функция, убирает сообщения о неправильном логине или пароле и о незаполненных полях
 onFlag(){
   this.notExistLoginOrPassword=true;  
   this.isEmpty=true;
 }
 
}
