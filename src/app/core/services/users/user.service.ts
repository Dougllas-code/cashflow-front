import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateUserRequest } from '../../../shared/models/requests/createUserRequest';
import { CreateUserResponse } from '../../../shared/models/responses/createUserResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/User`;

  constructor(private readonly http: HttpClient) { }

  createUser(user: CreateUserRequest): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(this.apiUrl, user);
  }

}