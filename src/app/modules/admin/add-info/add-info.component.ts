import { Info } from './../../../models/info.model';
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
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-add-info',
  templateUrl: './add-info.component.html',
  styleUrls: ['./add-info.component.scss'],
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
    DropdownModule,
  ],
  providers: [MessageService],
})
export class AddInfoComponent implements OnInit {
  infoForm: FormGroup;
  selectedFile: any;
  uploadedFiles: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private infoService: InfoService,
    public router: Router,
    private messageService: MessageService
  ) {
    this.infoForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      keywords: ['', Validators.required],
      category: ['', Validators.required],
      file: [null, Validators.required],
    });
  }
  infoId = '';
  info: any;
  categories: any;
  base_url = 'https://management-tool-backend.terrakodo.com';
  // base_url= environment.baseUrl;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.infoId = this.route.snapshot.paramMap.get('id') || '';
    this.infoService.getCategories().subscribe((val) => {
      this.categories = val;
    });
    if (this.infoId) {
      this.infoService.getInfoById(+this.infoId).subscribe((data) => {
        this.infoForm.patchValue(data);
        this.info = data;
        this.infoForm.patchValue({ keywords: data.keywords.split(',') });
      });
    }
  }
  canSubmit = false;
  onUpload(event: any) {
    if (event?.files) {
      for (let file of event?.files) {
        this.uploadedFiles.push(file);
      }

      this.canSubmit = true;
      this.messageService.add({
        severity: 'info',
        summary: 'File Uploaded',
        detail: '',
      });
      return;
    }

    this.messageService.add({
      severity: 'danger',
      summary: 'Please select file',
      detail: '',
    });
  }
  async onFileChange(event: any) {
    this.uploadedFiles = event.files;

    if (this.uploadedFiles) {
      // const file = event.target.files[0];
      this.selectedFile = this.uploadedFiles;
      // this.selectedFile = file.name;

      // this.handleFileChange();
    }
  }

  onSubmit() {
    // this.infoForm.controls['keywords'].updateValueAndValidity();

    // if (this.infoForm.invalid || !this.selectedFile) return;
    const formData = new FormData();
    // return;
    formData.append('category_id', this.infoForm.get('category')?.value?.id);
    formData.append('title', this.infoForm.get('title')?.value);
    formData.append('description', this.infoForm.get('description')?.value);
    formData.append(
      'keywords',
      this.infoForm.get('keywords')?.value?.join(',')
    );
    formData.append(
      'file',
      this.uploadedFiles[0],
      new Date().getUTCMilliseconds().toString()
    );
    formData.append('file_name', this.uploadedFiles[0].name.split('.')[0]);
    if (this.infoId) {
      var subscription$ = this.infoService.updateInfo(+this.infoId, formData);
    } else {
      var subscription$ = this.infoService.addInfo(formData);
    }

    subscription$.subscribe({
      next: () => {
        this.router.navigate(['/home']);

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
