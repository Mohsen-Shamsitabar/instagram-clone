import configureRoutes from "configureRoutes";
import { createBrowserHistory } from "history";
import type { Data } from "types";
import "normalize.css";
import {
  // ExampleDynamicPage,
  HomePage,
  InternalErrorPage,
  NotFoundPage,
  LoginPage,
  PostPage,
  ProfilePage,
  CreatePostPage
} from "pages";
import "./style.css";
import mock from "data/mock.data.json";

const appRootElement = <HTMLDivElement | null>document.getElementById("app");

if (!appRootElement)
  throw new Error("Application requires a root element with `#app` id.");

const initializeState = () => {
  // return mock as Data;
  const initialState = localStorage.getItem("data");

  return (initialState ? JSON.parse(initialState) : mock) as Data;
};

const data = initializeState();
const history = createBrowserHistory();

configureRoutes(appRootElement, history, {
  errorPage: InternalErrorPage,
  notFoundPage: NotFoundPage,
  routes: [
    { path: "/", page: LoginPage, props: data },
    // { path: "/user/:id", page: ExampleDynamicPage },
    { path: "/user/:logedUserId/home", page: HomePage, props: data },
    {
      path: "/user/:logedUserId/profile/:userId",
      page: ProfilePage,
      props: data
    },
    { path: "/user/:logedUserId/post/:postId", page: PostPage, props: data },
    { path: "/user/:logedUserId/createPost", page: CreatePostPage, props: data }
  ]
});
