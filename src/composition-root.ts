import "reflect-metadata"
import {UsersRepository} from "./repositories/usersRepository";
import {UsersService} from "./domain/usersService";
import {CommentsRepository} from "./repositories/commentsRepository";
import {CommentsService} from "./domain/commentsService";
import {PostRepository} from "./repositories/postRepository";
import {PostService} from "./domain/postService";
import {BlogRepository} from "./repositories/blogRepository";
import {BlogService} from "./domain/blogService";
import {SecurityRepository} from "./repositories/securityRepository";
import {SecurityService} from "./domain/securityService";
import {AuthRepository} from "./repositories/authRepository";
import {AuthService} from "./domain/authService";
import {JwtService} from "./application/jwtService";
import {Container} from "inversify";
import {AuthController} from "./controllers/authController";
import {BlogsController} from "./controllers/blogsController";
import {CommentsController} from "./controllers/commentsController";
import {PostsController} from "./controllers/postsController";
import {UsersController} from "./controllers/usersController";
import {SecurityController} from "./controllers/securityController";
import {Mappers} from "./models/mappers/mappers";
import {PostsQueryRepository} from "./queryRepositories/postsQuery";
import {BlogsQueryRepository} from "./queryRepositories/blogsQuery";
import {QueryFormat} from "./application/queryAdaptive";
import {CommentsQueryRepository} from "./queryRepositories/commentsQuery";
export const container = new Container()
//REPOS
//const usersRepository = new UsersRepository()
container.bind(UsersRepository).to(UsersRepository)
//const postsRepository = new PostRepository()
container.bind(PostRepository).to(PostRepository)
//const commentsRepository = new CommentsRepository()
container.bind(CommentsRepository).to(CommentsRepository)
//const blogsRepository = new BlogRepository()
container.bind(BlogRepository).to(BlogRepository)
//const securityRepository = new SecurityRepository()
container.bind(SecurityRepository).to(SecurityRepository)
//const authRepository = new AuthRepository()
container.bind(AuthRepository).to(AuthRepository)

//queryRep
container.bind(QueryFormat).to(QueryFormat)
container.bind(CommentsQueryRepository).to(CommentsQueryRepository)
container.bind(PostsQueryRepository).to(PostsQueryRepository)
container.bind(BlogsQueryRepository).to(BlogsQueryRepository)



//domain
//const usersService = new UsersService(usersRepository)
container.bind(UsersService).to(UsersService)
//const postsService = new PostService(postsRepository, blogsRepository)
container.bind(PostService).to(PostService)
//const commentsService = new CommentsService(usersService, postsService, commentsRepository)
container.bind(CommentsService).to(CommentsService)
//const blogsService = new BlogService(postsService, blogsRepository)
container.bind(BlogService).to(BlogService)
//const securityService = new SecurityService(securityRepository)
container.bind(SecurityService).to(SecurityService)
//const authService = new AuthService(securityRepository, usersRepository, authRepository)
container.bind(AuthService).to(AuthService)
//const jwtService = new JwtService(securityRepository)
container.bind(JwtService).to(JwtService)

//controllers
//export const usersController = new UsersController(usersService)
container.bind(UsersController).to(UsersController)
//export const postsController = new PostsController(postsService, commentsService)
container.bind(PostsController).to(PostsController)
//export const commentsController = new CommentsController(commentsService)
container.bind(CommentsController).to(CommentsController)
//export const blogsController = new BlogsController(blogsService)
container.bind(BlogsController).to(BlogsController)
//export const securityController = new SecurityController(securityService)
container.bind(SecurityController).to(SecurityController)
//export const authController = new AuthController(authService, usersService, jwtService)
container.bind(AuthController).to(AuthController)


//mapper
container.bind(Mappers).to(Mappers)
