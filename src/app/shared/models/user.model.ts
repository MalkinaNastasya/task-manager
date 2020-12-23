// Модель класса Пользователь
export class User {
  public id_user: number;
  public login: string;
  public password: string;
  public name: string;
  public email: string;
  constructor(id_user: number, login: string, password: string, name: string, email: string,) {
    this.id_user = id_user;
    this.login = login;
    this.password = password;
    this.name = name;
    this.email = email;
  }
}


