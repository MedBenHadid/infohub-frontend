import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Info } from '../models/info.model';
import { ENDPOINTS } from '../configs/api-endpoints';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InfoService {
  private baseURI = environment.apiUrl;
  private apiUrl = this.baseURI + '/infos'; // URL de base pour le backend Laravel

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste de toutes les infos.
   */
  getAllInfos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  /**
   * Récupère les détails d'une info spécifique par son ID.
   * @param id - ID de l'info.
   */
  getInfoById(id: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }
  getCategories(): Observable<any> {
    return this.http
      .get<any>(`${this.baseURI}/getCategories`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Supprime une info spécifique par son ID.
   * @param id - ID de l'info.
   */
  deleteInfo(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  deleteCategory(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseURI}/deleteCategory/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Ajoute une nouvelle info avec un fichier.
   * @param formData - Données du formulaire incluant le fichier.
   */
  addInfo(formData: FormData): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, formData)
      .pipe(catchError(this.handleError));
  }
  addCategory(formData: FormData): Observable<any> {
    return this.http
      .post<any>(this.baseURI + '/insertCategory', formData)
      .pipe(catchError(this.handleError));
  }

  filterInfos(filters: any): Observable<any[]> {
    let formData = new FormData();
    filters.categoriesId.forEach((val: any) => {
      formData.append('categoriesId[]', val);
    });
    formData.append('title', filters.title);
    formData.append('file_name', filters.file_name);
    formData.append('description', filters.description);
    formData.append('keywords', filters.keywords);

    return this.http
      .post<any[]>(`${this.apiUrl}/filter`, formData)
      .pipe(catchError(this.handleError));
  }
  /**
   * Met à jour une info existante par son ID.
   * @param id - ID de l'info.
   * @param formData - Données du formulaire incluant le fichier (si modifié).
   */
  updateInfo(id: number, formData: FormData): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/${id}`, formData)
      .pipe(catchError(this.handleError));
  }

  updateCategory(id: number, formData: FormData): Observable<any> {
    return this.http
      .post<any>(`${this.baseURI}/updateCategory/${id}`, formData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Gestion des erreurs HTTP.
   * @param error - L'erreur retournée par le backend.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur inconnue est survenue.';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur : ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Erreur ${error.status}: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
  insertInfo(infoData: Partial<Info>): Observable<Info> {
    return this.http.post<Info>(
      this.apiUrl + ENDPOINTS.info.insert_info,
      infoData
    );
  }
  toggleInfo(info_id: any, user_id: any): Observable<Info> {
    let formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('info_id', info_id);
    return this.http.post<Info>(this.apiUrl + '/toggle-info', formData);
  }
}
