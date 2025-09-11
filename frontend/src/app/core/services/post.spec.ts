import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostService } from './post.service';
import { environment } from 'enviroments/enviroment';
import { LsPost, LsResPost, LsAllPosts, LsGetPost } from '@models/post.models';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService],
    });

    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('create should POST a new post', () => {
    const post: LsPost = { title: 'Nuevo Post', content: 'Contenido' };
    const mockResponse: LsResPost = { message: 'Post creado' };

    service.create(post).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.url_api}/posts`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(post);
    req.flush(mockResponse);
  });

  it('update should PUT an existing post', () => {
    const postId = 1;
    const post: LsPost = { title: 'Editado', content: 'Contenido editado' };
    const mockResponse: LsResPost = { message: 'Post actualizado' };

    service.update(post, postId).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.url_api}/posts/${postId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(post);
    req.flush(mockResponse);
  });

  it('delete should DELETE a post by ID', () => {
    const postId = 1;
    const mockResponse: LsResPost = { message: 'Post eliminado' };

    service.delete(postId).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.url_api}/posts/${postId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('getById should GET a post by ID', () => {
    const postId = 1;
    const mockResponse: LsGetPost = {
      data: {
        id: postId,
        title: 'Post 1',
        content: 'Contenido',
        authorUsername: 'david@david.com',
        comments: [],
      },
      message: 'OK',
    };

    service.getById(postId).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.url_api}/posts/${postId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getAll should GET all posts', () => {
    const mockResponse: LsAllPosts = {
      data: [
        { id: 1, title: 'Post 1', content: 'Contenido', authorUsername: 'david@david.com' },
        { id: 2, title: 'Post 2', content: 'Contenido 2', authorUsername: 'david@david.com' },
      ],
      message: 'OK',
    };

    service.getAll().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.url_api}/posts`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
