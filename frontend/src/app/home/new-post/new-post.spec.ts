import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NewPost } from './new-post';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import toastr from '@shared/utils/toastr';
import { PostService } from '@services/post.service';
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('NewPost (unit tests)', () => {
  let fixture: ComponentFixture<NewPost>;
  let component: NewPost;

  let mockPostService: any;
  let mockActivatedRoute: any;

  beforeEach(waitForAsync(() => {
    mockPostService = {
      create: jasmine.createSpy('create'),
      update: jasmine.createSpy('update'),
      getById: jasmine.createSpy('getById'),
    };

    // Mock ActivatedRoute para emitir paramMap
    mockActivatedRoute = {
      paramMap: of(new Map()),
    };

    spyOn(toastr, 'success').and.callThrough();
    spyOn(toastr, 'error').and.callThrough();
    spyOn(toastr, 'setOption').and.callThrough();
    spyOn(toastr, 'setDefaultsOptions').and.callThrough();

    TestBed.configureTestingModule({
      imports: [NewPost, ReactiveFormsModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        FormBuilder,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and form', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeDefined();
    expect(component.form.get('title')).toBeDefined();
    expect(component.form.get('content')).toBeDefined();
  });

  it('form should be invalid initially', () => {
    expect(component.form.valid).toBeFalse();
    expect(component.form.get('title')?.hasError('required')).toBeTrue();
    expect(component.form.get('content')?.hasError('required')).toBeTrue();
  });

  it('sendPost should markAllAsTouched if form invalid', () => {
    const spyMarkAll = spyOn(component.form, 'markAllAsTouched').and.callThrough();
    component.form.get('title')?.setValue('');
    component.form.get('content')?.setValue('');
    component.sendPost();
    expect(spyMarkAll).toHaveBeenCalled();
    expect(mockPostService.create).not.toHaveBeenCalled();
    expect(mockPostService.update).not.toHaveBeenCalled();
  });

  it('successful post creation calls service, toastr, and navigates', () => {
    const payload = { title: 'Test Title', content: 'This is more than 20 chars' };
    component.form.setValue(payload);

    mockPostService.create.and.returnValue(of({ id: 1, ...payload }));
    const router = TestBed.inject(RouterTestingModule as any);
    spyOn(component['router'], 'navigate');

    component.sendPost();

    expect(mockPostService.create).toHaveBeenCalledWith(payload);
    expect(toastr.success).toHaveBeenCalled();
    expect(component.maskLoad()).toBeFalse();
  });

  it('sendPost in edit mode calls update service', () => {
    component.edit.set(true);
    component.postId = '123';
    const payload = {
      title: 'Edit Title',
      content: 'Valid content aksjd fkñas dklfja sdkjf adskj aksjd',
    };
    component.form.setValue(payload);

    mockPostService.update.and.returnValue(of(payload));
    spyOn(component['router'], 'navigate');

    component.sendPost();

    expect(mockPostService.update).toHaveBeenCalledWith(payload, '123');
    expect(toastr.success).toHaveBeenCalled();
    expect(component.maskLoad()).toBeFalse();
  });

  it('loadPostForEditing should patch form on success', () => {
    const post = {
      data: { title: 'Loaded', content: 'kajs dklfj sadkjf laksjd fklajsd fkljas kfjasd ' },
    };
    mockPostService.getById.and.returnValue(of(post));
    component['loadPostForEditing']('1');
    expect(component.maskLoad()).toBeFalse();
    expect(component.form.value.title).toBe('Loaded');
  });

  it('myErrorHandler sets maskLoad false and calls toastr.error', () => {
    const error = { error: { message: 'Failed' } };
    component.myErrorHandler(error, 'Error text');
    expect(component.maskLoad()).toBeFalse();
    expect(toastr.error).toHaveBeenCalledWith('Failed', 'Error text');
  });
});
