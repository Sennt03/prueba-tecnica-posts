import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Posts } from './posts';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PostService } from '@services/post.service';
import { AuthService } from '@services/auth.service';
import toastr from '@shared/utils/toastr';

describe('Posts (unit tests)', () => {
  let fixture: ComponentFixture<Posts>;
  let component: Posts;

  let mockPostService: any;
  let mockAuthService: any;

  beforeEach(() => {
    mockPostService = {
      getAll: jasmine.createSpy('getAll').and.returnValue(of({ data: [] })),
      delete: jasmine.createSpy('delete').and.returnValue(of({})),
    };
    mockAuthService = {
      getUser: jasmine.createSpy('getUser').and.returnValue({ username: 'testuser' }),
    };

    TestBed.configureTestingModule({
      imports: [Posts, HttpClientTestingModule],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: AuthService, useValue: mockAuthService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(Posts);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit se ejecuta aquí
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Posts);
    component = fixture.componentInstance;
  });

  it('deletePost should set idPost and open dialog', () => {
    const dialog = { open: jasmine.createSpy('open') };
    component.deletePost(5, dialog as any);

    expect(component.idPost).toBe(5);
    expect(dialog.open).toHaveBeenCalled();
  });

  it('onAcceptDelete should call postService.delete and remove post from list', () => {
    spyOn(toastr, 'success');

    const fakePosts = [
      { id: 1, title: 'Post 1', content: 'Contenido 1', authorUsername: 'david@david.com' },
      { id: 2, title: 'Post 2', content: 'Contenido 2', authorUsername: 'david2@david.com' },
    ];
    component.posts.set(fakePosts as any);
    component.idPost = 1;

    mockPostService.delete.and.returnValue(of({}));
    component.onAcceptDelete();

    expect(mockPostService.delete).toHaveBeenCalledWith(1);
    expect(component.posts().length).toBe(1);
    expect(component.posts()[0].id).toBe(2);
    expect(toastr.success).toHaveBeenCalled();
    expect(component.loading()).toBeFalse();
  });

  it('loadPosts should handle empty response', () => {
    const fakePosts = { data: [] };
    mockPostService.getAll.and.returnValue(of(fakePosts));

    component.loadPosts();
    fixture.detectChanges();

    expect(component.posts().length).toBe(0);
    expect(component.loading()).toBeFalse();
  });

  it('onAcceptDelete should handle error gracefully', () => {
    component.idPost = 1;
    mockPostService.delete.and.returnValue(throwError(() => ({ message: 'Error' })));

    component.onAcceptDelete();

    expect(component.loading()).toBeFalse();
  });
});
