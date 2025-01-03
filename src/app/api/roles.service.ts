import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ENDPOINTS } from '../configs/api-endpoints';
import { Role } from '../models/role.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class RoleService {
  BASE_URL = environment.base_backend_url;
  constructor(private httpClient: HttpClient) {}
  insertRole(role: Role): Observable<Role> {
    const url = this.BASE_URL + ENDPOINTS.role.insert_role;
    let formData = new FormData();
    formData.append('name', role.name);
    

    return this.httpClient.post<Role>(url, formData);
  }


   
}
