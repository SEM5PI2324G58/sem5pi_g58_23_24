import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { User } from 'src/app/domain/user/user';
import { map } from 'rxjs';
import { UserModel } from 'src/dataModel/userModel';
import { MessageService } from './message.service';
@Injectable({ providedIn: 'root' })
export class AuthService {

    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;
    private loginUrl = "http://localhost:4500/api/user/login";
    private signUpUrl = "http://localhost:4500/api/user/signup";
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient, private messageService: MessageService) {
        this.userSubject = new BehaviorSubject<User | null>(
            JSON.parse(localStorage.getItem('user')!)
        );
        this.user = this.userSubject.asObservable();
    }

    /**
     * Cria um utilizador
     * @param user data view model
     * @returns 
     */
    signUp(name: string, email: string, telefone: string, nif: string, password: string, role: string) {

        let user: UserModel = {
            name: name,
            email: email,
            telefone: telefone,
            nif: nif,
            password: password,
            estado: "aceito",
            role: role
        } as UserModel;

        console.log(user);

        return this.http.post<string>(this.signUpUrl, user, this.httpOptions)
            .pipe(catchError(this.handleError<string>("signup")))
            .subscribe(data => {
                this.log(data);
            });
    }

    /**
     * Retorna o valor do utilizador atual e o armazena na local storage
     * @param email string 
     * @param password string
     * @returns 
     */
    login(email: string, password: string) {

        let params = new HttpParams().set('email', email);
        params = params.append('password', password);

        return this.http.get<any>(this.loginUrl, { params: params, headers: this.httpOptions.headers } )
            .pipe(
                map(user => localStorage.setItem('user', JSON.stringify(user))),
                catchError(this.handleError<User>("login"))
            );
    }

    /**
     * Remove o utilizador da local storage
     * @returns 
     */
    logout() { localStorage.removeItem('user'); }

    /**
     * Obtém o token do utilizador
     * @returns 
     */
    getToken(): string | null {
        return localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).token : null;
    }

    /**
     * Uma função para lidar com erros em requisições HTTP. Em caso de erro, desloga o utilizador e regista o erro na consola.
     * @param operation 
     * @param result 
     * @returns 
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            this.logout();
            this.log(`${operation} failed: ${error.error}`);
            return of(result as T);
        };
    }

    /**
     *  Uma função para registar mensagens de erro na consola.
     * @param message 
     */
    private log(message: string) {
        this.messageService.add(`${message}`);
    }

}