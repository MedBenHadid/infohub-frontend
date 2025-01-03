import { Component, Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../store/actions/auth.actions';
import { CardModule } from 'primeng/card';
import { InfoService } from '../../../api/info.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { selectUser } from '../../../store/selectors/auth.selectors';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 25, trail: string = '...'): string {
    if (!value) {
      return '';
    }
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CardModule,
    TableModule,
    ButtonModule,
    DatePipe,
    TagModule,
    ToastModule,
    ConfirmPopupModule,
    MultiSelectModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    TruncatePipe,
    ConfirmPopupModule,
  ],
  providers: [ConfirmationService, MessageService],
})
export class HomeComponent {
  infos: any;
  categories: any;
  filterForm: FormGroup;
  user: any;

  constructor(
    private store: Store,
    private infoService: InfoService,
    public router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      title: [''],
      file_name: [''],
      description: [''],
      keywords: [''],
      categoriesId: [],
    });
  }

  logOut() {
    this.store.dispatch(AuthActions.logOut());
  }
  ngOnInit() {
    this.loadCategories(); // Charge les catégories disponibles

    this.loadInfos();
    this.store.select(selectUser).subscribe((val) => {
      this.user = val.user;
    });
  }
  loadCategories() {
    this.infoService.getCategories().subscribe((val) => {
      this.categories = val;
    });
  }
  saveInfo(id: any) {
    console.log(id);
    this.infoService.toggleInfo(id, this.user?.id).subscribe((val: any) => {
      this.loadInfos();
      this.store.dispatch(AuthActions.getUser());

      this.messageService.add({
        severity: 'success',
        summary: val.message,
        detail: '',
      });
    });
  }

  resetFilters(): void {
    this.filterForm.reset({
      title: '',
      file_name: '',
      description: '',
      keywords: '',
      categoriesId: [],
    });
    this.loadInfos();
  }
  loading = false;
  filterInfos() {
    console.log(this.filterForm.value);
    this.infoService.filterInfos(this.filterForm.value).subscribe({
      next: (data) => {
        this.infos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du filtrage des documents :', err);
        this.loading = false;
      },
    });
  }
  showInfo(id: any) {
    this.router.navigate(['/info/' + id]);
  }
  loadInfos() {
    this.infoService.getAllInfos().subscribe((data: any) => {
      this.infos = data;
    });
  }

  editInfo(id: number) {
    this.router.navigate(['/info/update/' + id]);
  }

  deleteInfo(event: any, id: number) {
    console.log(id);
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Êtes-vous sûr(e) de vouloir supprimer cette information ?',
      icon: '',
      accept: () => {
        this.infoService.deleteInfo(id).subscribe(() => {
          this.loadInfos();
          this.messageService.add({
            severity: 'info',
            summary: 'Deleted successfully',
            detail: '',
          });
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    });
  }
}
