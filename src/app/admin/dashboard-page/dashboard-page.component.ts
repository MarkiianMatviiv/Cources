import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/shared/interfaces';
import { PostsService } from 'src/app/shared/posts.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  posts: Post[] = []
  postSub: Subscription | undefined;
  dSub:Subscription | undefined
  searchStr = ''

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.postSub = this.postsService.getAll().subscribe((posts) => {
      this.posts = posts;
    });
  }
  remove(id:string){
   this.dSub = this.postsService.remove(id).subscribe(()=>{
      this.posts = this.posts.filter(post => post.id !==id)
    })
  }
  ngOnDestroy() {
    if (this.postSub) {
      this.postSub.unsubscribe();
    }
    if (this.dSub) {
      this.dSub.unsubscribe();
    }
  }
}
