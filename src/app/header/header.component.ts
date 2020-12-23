import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

 // Логическая переменная, авторизирован пользователь или нет
 logOut = true;
 name = "";
 constructor(private router: Router) { }

 ngOnInit() {
 }

 // Хук жизненного цикла по изменению
 // Проверяет наличие в LocalStorage элемента имя, чтобы понять авторизирован пользователь или нет
 ngDoCheck() {
  if (localStorage.getItem("name") !== null) {
    this.name = localStorage.getItem("name");
    this.logOut = false;
  }
}

 // Функция, срабатывающая при выходе из аккаунта, очищает LocalStorage
 onLogOut(){
   this.logOut=true;  
   localStorage.clear();
   this.router.navigate(['/']);
 }

}
