import { Pipe, PipeTransform } from "@angular/core";
import { Post } from "src/app/shared/interfaces";


@Pipe({
    name:'searchPosts'
})

export class SearchPipe implements PipeTransform{
    transform(posts:Post [], search = ''):Post[]{
        if(!search.trim()){
            return posts
        }
        return posts.filter(posts => {
            return posts.title.toLowerCase().includes(search.toLowerCase())
        })
    }
    }

