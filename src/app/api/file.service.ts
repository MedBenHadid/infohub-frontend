import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '../configs/api-endpoints';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  BASE_URL = environment.apiUrl;
  http: any;
  apiUrl: any;
  constructor(private httpClient: HttpClient) {}

  uploadFile(name: string, file: File): Observable<File> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);

    return this.httpClient.post<File>(
      this.BASE_URL + ENDPOINTS.file.upload_file,
      formData
    );
  }

   getAllFiles(): Observable<File[]> {
    return this.httpClient.get<File[]>(this.BASE_URL + ENDPOINTS.file.get_files);
  }

  getFileContent(file_path: string): Observable<any> {
    return this.httpClient.post<any>(this.BASE_URL + ENDPOINTS.file.get_file_contents, { file_path });
  }
}