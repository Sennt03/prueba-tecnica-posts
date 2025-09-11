import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentService } from './comment.service';
import { environment } from 'enviroments/enviroment';
import { LsCommentCreate, LsResComment } from '@models/comment.models';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService],
    });

    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('create should POST a comment to the correct URL', () => {
    const postId = 1;
    const comment: LsCommentCreate = { content: 'Nuevo comentario' };
    const mockResponse: LsResComment = { message: 'Comentario creado' };

    service.create(comment, postId).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.url_api}/posts/${postId}/comments`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(comment);
    req.flush(mockResponse);
  });

  it('update should PUT a comment to the correct URL', () => {
    const postId = 1;
    const commentId = 5;
    const comment: LsCommentCreate = { content: 'Comentario editado' };
    const mockResponse: LsResComment = { message: 'Comentario actualizado' };

    service.update(comment, postId, commentId).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.url_api}/posts/${postId}/comments/${commentId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(comment);
    req.flush(mockResponse);
  });

  it('delete should DELETE a comment from the correct URL', () => {
    const postId = 1;
    const commentId = 5;
    const mockResponse: LsResComment = { message: 'Comentario eliminado' };

    service.delete(postId, commentId).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.url_api}/posts/${postId}/comments/${commentId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
