import { Info } from '../../../models/info.model';
import { FileUpload, FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { InfoService } from '../../../api/info.service';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute, Router } from '@angular/router';
import { ChipsModule } from 'primeng/chips';
import convertUrlToImageData from '../../../utils/file_converter';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  standalone: true,
  imports: [
    PanelModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    CommonModule,
    FileUploadModule,
    ToastModule,
    ChipsModule,
    NgxDocViewerModule,
    TableModule,
  ],
  providers: [MessageService],
})
export class CategoriesComponent implements OnInit {
  categoryForm: FormGroup;
  selectedFile: any;
  uploadedFiles: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private infoService: InfoService,
    public router: Router,
    private messageService: MessageService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
    });
  }
  infoId = '';
  categoryToEdit: any;
  base_url = 'https://management-tool-backend.terrakodo.com';
  categories: any;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadCategory();
  }
  loadCategory() {
    this.infoService.getCategories().subscribe((val) => {
      this.categories = val;
    });
  }
  canSubmit = false;
  editCategory(category: any) {
    this.categoryToEdit = category;
    this.categoryForm.patchValue({ name: this.categoryToEdit.name });
    // let formData = new FormData();
    // formData.append('name', this.categoryForm.get('name')?.value);
    // this.infoService.updateCategory(category.id, formData).subscribe((val) => {
    //   console.log(val);
    //   this.loadCategory();

    //   this.messageService.add({
    //     severity: 'success',
    //     summary: 'Category Updated successfully',
    //   });
    // });
  }
  deleteCategory(id: any) {
    this.infoService.deleteCategory(id).subscribe(() => {
      this.loadCategory();
      this.messageService.add({
        severity: 'success',
        summary: 'Category deleted successfully',
      });
    });
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.categoryForm.get('name')?.value);
    if (this.categoryToEdit?.id) {
      var subscription$ = this.infoService.updateCategory(
        +this.categoryToEdit.id,
        formData
      );
    } else {
      var subscription$ = this.infoService.addCategory(formData);
    }

    subscription$.subscribe({
      next: () => {
        this.loadCategory();
        this.categoryForm.patchValue({ name: '' });

        return this.messageService.add({
          severity: 'success',
          summary: 'Info added successfully',
        });
      },
      error: (error) =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        }),
    });
  }
}
