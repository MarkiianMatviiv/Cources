import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { PostsService } from 'src/app/shared/posts.service';
import { Post } from 'src/app/shared/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss'],
})
export class EditPageComponent implements OnInit,OnDestroy {
  form!: FormGroup;
  post!: Post;
  submitted = false;

  uSub!: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postsService: PostsService
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          return this.postsService.getById(params['id']);
        })
      )
      .subscribe((post: Post) => {
        this.post = post
        this.form = new FormGroup({
          title: new FormControl(post.title, Validators.required),
          text: new FormControl(post.text, Validators.required),
        });
      });
  }

  ngOnDestroy(): void {
    if(this.uSub){
      this.uSub.unsubscribe()
    }
  }

  submit(){
    if(this.form.invalid){
        return
    }
    this.submitted = true

   this.uSub = this.postsService.update({
      ...this.post,
      title:this.form.value.title,
      text:this.form.value.text,
     }).subscribe(()=> {
      this.submitted =false
      this.router.navigate(['/admin/dashboard']);
     })
  }

  get textControl(): FormControl {
    return this.form.get('text') as FormControl;
  }
}
