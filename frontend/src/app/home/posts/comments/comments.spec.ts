import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Comments } from './comments';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, InputSignal, signal } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PostService } from '@services/post.service';
import { CommentService } from '@services/comment.service';
import { AuthService } from '@services/auth.service';
import toastr from '@shared/utils/toastr';

describe('Comments (unit tests)', () => {
  let fixture: ComponentFixture<Comments>;
  let component: Comments;

  let mockPostService: any;
  let mockCommentService: any;
  let mockAuthService: any;

  beforeEach(() => {
    mockPostService = {
      getById: jasmine
        .createSpy('getById')
        .and.returnValue(
          of({
            data: { comments: [{ id: 1, content: 'Hola', authorUsername: 'david@david.com' }] },
          })
        ),
    };
    mockCommentService = {
      create: jasmine.createSpy('create').and.returnValue(of({})),
      delete: jasmine.createSpy('delete').and.returnValue(of({})),
      update: jasmine.createSpy('update').and.returnValue(of({})),
    };
    mockAuthService = {
      getUser: jasmine.createSpy('getUser').and.returnValue({ username: 'david@david.com' }),
    };

    TestBed.configureTestingModule({
      imports: [Comments, HttpClientTestingModule],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: CommentService, useValue: mockCommentService },
        { provide: AuthService, useValue: mockAuthService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(Comments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    spyOn(toastr, 'success');
    spyOn(toastr, 'error');
  });

  it('should create component with initial values', () => {
    expect(component).toBeTruthy();
    expect(component.loading()).toBeFalse();
    expect(component.post()).toBeNull();
    expect(component.id()).toBe(0);
  });

  it('toggleComments should fetch post and update post signal', () => {
    const btn = document.createElement('button');
    const container = document.createElement('div');

    component.id = signal(123) as unknown as InputSignal<number>;
    component.toggleComments(container, btn);

    expect(mockPostService.getById).toHaveBeenCalledWith(123);
    expect(component.post()!.data.comments.length).toBe(1);
  });

  it('onComment should create comment and call toastr.success', () => {
    const btn = document.createElement('button');
    const container = document.createElement('div');
    component.id = signal(1) as unknown as InputSignal<number>;

    component.onComment('Nuevo comentario', container, btn);

    expect(mockCommentService.create).toHaveBeenCalledWith({ content: 'Nuevo comentario' }, 1);
    expect(toastr.success).toHaveBeenCalled();
  });

  it('onComment should handle error and call toastr.error', () => {
    mockCommentService.create.and.returnValue(throwError(() => ({ message: 'Error' })));
    const btn = document.createElement('button');
    const container = document.createElement('div');
    component.id = signal(1) as unknown as InputSignal<number>;

    component.onComment('Fail', container, btn);

    expect(toastr.error).toHaveBeenCalled();
  });

  it('deleteComment should set idComment and open dialog', () => {
    const dialog = { open: jasmine.createSpy('open') };
    component.deleteComment(5, dialog as any);
    expect(component.idComment).toBe(5);
    expect(dialog.open).toHaveBeenCalled();
  });

  it('onAcceptDelete should remove comment and call toastr.success', () => {
    const postMock = {
      data: { comments: [{ id: 1, content: 'c', authorUsername: 'david@david.com' }] },
    };
    component.post.set(postMock as any);
    component.id = signal(1) as unknown as InputSignal<number>;
    component.idComment = 1;

    component.onAcceptDelete();

    expect(mockCommentService.delete).toHaveBeenCalledWith(1, 1);
    expect(component.post()!.data.comments.length).toBe(0);
    expect(toastr.success).toHaveBeenCalled();
  });

  it('onAcceptDelete should handle error and call toastr.error', () => {
    mockCommentService.delete.and.returnValue(throwError(() => ({ message: 'Error' })));
    component.id = signal(1) as unknown as InputSignal<number>;
    component.idComment = 1;

    component.onAcceptDelete();
    expect(toastr.error).toHaveBeenCalled();
  });

  it('editComment should set edit mode and open dialog', () => {
    const dialog = { open: jasmine.createSpy('open') };
    component.editComment(1, 'contenido', dialog as any);
    expect(component.edit).toBeTrue();
    expect(component.idComment).toBe(1);
    expect(dialog.open).toHaveBeenCalledWith('contenido');
  });

  it('onEditComment should update comment and call toastr.success', () => {
    const postMock = {
      data: { comments: [{ id: 1, content: 'c', authorUsername: 'david@david.com' }] },
    };
    component.post.set(postMock as any);
    component.id = signal(1) as unknown as InputSignal<number>;
    component.idComment = 1;

    component.onEditComment(
      'editado',
      document.createElement('div'),
      document.createElement('button')
    );

    expect(mockCommentService.update).toHaveBeenCalledWith({ content: 'editado' }, 1, 1);
    expect(component.post()!.data.comments[0].content).toBe('editado');
    expect(toastr.success).toHaveBeenCalled();
  });

  it('onEditComment should handle error and call toastr.error', () => {
    mockCommentService.update.and.returnValue(throwError(() => ({ message: 'Error' })));
    component.id = signal(1) as unknown as InputSignal<number>;
    component.idComment = 1;

    component.onEditComment(
      'fail',
      document.createElement('div'),
      document.createElement('button')
    );
    expect(toastr.error).toHaveBeenCalled();
  });
});
