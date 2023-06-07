import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, pipe } from 'rxjs';
import { FbCreateResponse, Post } from './interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private http: HttpClient) {}
  create(post: Post): Observable<Post> {
    return this.http.post<any>(`${environment.fbDbUrl}/posts.json`, post)
    .pipe(map((response:FbCreateResponse)=>{
        return{
            ...post,
            id:response.name,
            date:new Date(post.date)
        }
    }))
  }
  getAll(): Observable<any> {
    return this.http.get(`${environment.fbDbUrl}/posts.json`).pipe(
      map((response: { [key: string]: any }) => {
        return Object.keys(response).map((key) => ({
          id: key,
          date: new Date(response[key].date),
          ...response[key],
        }));
      })
    )
   }

   getById(id: string): Observable<Post> {
    return this.http
      .get<Post>(`${environment.fbDbUrl}/posts/${id}.json`)
      .pipe(
        map((post: Post) => {
          return {
            ...post,
            id: id,
            date: new Date(post.date),
          };
        })
      );
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDbUrl}/posts/${id}.json`);
  }
  
  update(post:Post):Observable<Post>{
    return this.http.patch<Post>(`${environment.fbDbUrl}/post/${post.id}.json`, post)
  }
}

