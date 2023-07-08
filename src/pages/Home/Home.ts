import type { Page, Comment, Data } from "types";
import { onPageMount } from "utils";
import classes from "./Home.module.css";

const clamp = (n: number, min: number, max: number) => {
  return Math.max(Math.min(n, max), min);
};

const emptyLikeBtn = () => {
  return `<svg
  class="_svg"
  fill="#262626"
  height="24"
  role="img"
  viewBox="0 0 24 24"
  width="24"
  >
    <path
      d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"
    ></path>
  </svg>`;
};

const redLikeBtn = () => {
  return `<svg
  class="_svg"
  fill="#ed4956"
  height="24"
  role="img"
  viewBox="0 0 48 48"
  width="24"
  >
    <path
      d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"
    ></path>
  </svg>`;
};

const Home: Page<Data> = context => {
  onPageMount(() => {
    const data = context.pageProps;
    const logedUserId = context.params?.logedUserId;
    if (!logedUserId) return;

    const findUser = (userId: string) => {
      const User = data.users.find(user => {
        if (user.id === userId) return true;
        return false;
      });
      return User;
    };

    const findPost = (postId: string) => {
      const post = data.posts.find(post => {
        if (post.id === postId) return true;
        return false;
      });
      return post;
    };

    const logedUser = findUser(logedUserId);
    if (!logedUser) return;

    const history = context.history;

    //back to homePage Top and refresh page.
    const instaBrand = document.querySelector<HTMLLinkElement>(
      `.${classes.instaBrand}`
    );
    if (!instaBrand) return;
    instaBrand.addEventListener("click", () => {
      history.push(`/user/${logedUserId}/home`);
    });

    //search data and show users
    const userSearch = document.querySelector<HTMLInputElement>(
      `#${classes.headerSearchInput}`
    );
    if (!userSearch) return;

    //back to homePage Top.
    const homeBtn = document.querySelector<HTMLButtonElement>(
      `.${classes.homeBtn}`
    );
    if (!homeBtn) return;
    homeBtn.addEventListener("click", () => {
      history.push(`/user/${logedUserId}/home`);
    });

    //add post as logged user.
    const addPostBtn = document.querySelector<HTMLButtonElement>(
      `.${classes.addPostBtn}`
    );
    if (!addPostBtn) return;
    addPostBtn.addEventListener("click", () => {
      history.push(`/user/${logedUserId}/createPost`);
    });

    const exploreBtn = document.querySelector<HTMLButtonElement>(
      `.${classes.exploreBtn}`
    );
    if (!exploreBtn) return;

    const profileBtn = document.querySelector<HTMLButtonElement>(
      `.${classes.profileBtn}`
    );
    if (!profileBtn) return;

    profileBtn.addEventListener("click", () => {
      history.push(`/user/${logedUserId}/profile/${logedUserId}`);
    });

    const profileBtnImage = profileBtn.querySelector<HTMLImageElement>(
      `.${classes.smallProfilePic}`
    );
    if (!profileBtnImage) return;
    profileBtnImage.src = logedUser.avatar;
    profileBtnImage.alt = logedUser.username[0].toUpperCase();

    const makeComment = (comment: Comment) => {
      const author = findUser(comment.author);
      if (!author) return;

      const commentContainer = document.createElement("article");
      commentContainer.className = "post-comment";

      const profilePicContainer = document.createElement("div");
      profilePicContainer.className = "profile-pic-container";

      const profilePic = document.createElement("img");
      profilePic.className = "medium-profile-pic";
      profilePic.src = author.avatar;

      profilePicContainer.appendChild(profilePic);
      commentContainer.appendChild(profilePicContainer);

      const contextContainer = document.createElement("div");
      contextContainer.className = "comment-context-container";

      const authorName = document.createElement("span");
      authorName.className = "comment-context-container__username";
      authorName.textContent = `${author.username} : `;
      authorName.addEventListener("click", () => {
        history.push(`/user/${logedUserId}/profile/${author.id}`);
      });

      const commentContext = document.createElement("span");
      commentContext.className = "comment-context";
      commentContext.textContent = comment.context;

      contextContainer.appendChild(authorName);
      contextContainer.appendChild(commentContext);
      commentContainer.appendChild(contextContainer);
      return commentContainer;
    };

    const makePost = (postId: string) => {
      const post = findPost(postId);
      if (!post) return;

      const author = findUser(post.author);
      if (!author) return;

      const templateEl = document.querySelector<HTMLTemplateElement>(
        "#homepagePostTemplate"
      );
      if (!templateEl) return;
      const template = <HTMLTemplateElement>templateEl.content.cloneNode(true);

      const postContainer = template.querySelector(".post-container");
      if (!postContainer) return;

      const authorProfilePic = template.querySelector<HTMLImageElement>(
        ".medium-profile-pic"
      );
      if (!authorProfilePic) return;
      authorProfilePic.src = author.avatar;

      const authorInfoContainer = template.querySelector(".post-header__user");
      if (!authorInfoContainer) return;
      authorInfoContainer.addEventListener("click", () => {
        history.push(`/user/${logedUserId}/profile/${author.id}`);
      });

      const authorUserName = template.querySelector(
        ".post-header__user__username"
      );
      if (!authorUserName) return;
      authorUserName.textContent = author.username;

      const optionDropDown = template.querySelector(
        ".post-header__options__drop-down"
      );
      if (!optionDropDown) return;

      const optionBtn = template.querySelector<HTMLButtonElement>(
        ".post-header__options__btn"
      );
      if (!optionBtn) return;

      optionBtn.addEventListener("click", () => {
        if (optionDropDown.classList.contains("hidden")) {
          optionDropDown.classList.remove("hidden");
        } else {
          optionDropDown.classList.add("hidden");
        }
        return;
      });

      const unfollowBtn = template.querySelector<HTMLButtonElement>(
        ".options-follow-btn"
      );
      if (!unfollowBtn) return;

      if (logedUser.following?.includes(post.author)) {
        unfollowBtn.classList.add("following");
        unfollowBtn.textContent = "Unfollow";
      } else {
        unfollowBtn.textContent = "Follow";
      }

      unfollowBtn.addEventListener("click", () => {
        if (unfollowBtn.classList.contains("following")) {
          unfollowBtn.classList.remove("following");
          unfollowBtn.textContent = "Follow";

          logedUser.following = logedUser.following.filter(userId => {
            if (userId !== author.id) {
              return true;
            }
            return false;
          });

          author.followers = author.followers.filter(userId => {
            if (userId !== logedUserId) {
              return true;
            }
            return false;
          });
        } else {
          unfollowBtn.classList.add("following");
          unfollowBtn.textContent = "Unfollow";
          logedUser.following.push(`${author.id}`);
          author.followers.push(`${logedUserId}`);
        }
      });

      const goToPostBtn = template.querySelector<HTMLButtonElement>(
        ".options-go-to-post-btn"
      );
      if (!goToPostBtn) return;

      goToPostBtn.addEventListener("click", () => {
        history.push(`/user/${logedUserId}/post/${post.id}`);
      });

      const sliderCounter = template.querySelector(
        ".post-actions__slide-counter"
      );
      if (!sliderCounter) return;

      const sliderFrame = template.querySelector<HTMLDivElement>(
        ".slider__slides-frame"
      );
      if (!sliderFrame) return;

      const postFragment = document.createDocumentFragment();
      const counterFragment = document.createDocumentFragment();

      post.images.forEach(image => {
        const sliderSlide = document.createElement("div");
        sliderSlide.className = "slider__slide";

        const sliderContent = document.createElement("div");
        sliderContent.className = "slider__slide__content";

        const sliderImage = document.createElement("img");
        sliderImage.className = "medium-post-pic";
        sliderImage.src = image;

        sliderContent.appendChild(sliderImage);
        sliderSlide.appendChild(sliderContent);
        postFragment.appendChild(sliderSlide);

        const circle = document.createElement("div");
        circle.className = "post-actions__slide-counter__circle";
        counterFragment.appendChild(circle);
      });
      sliderFrame.appendChild(postFragment);

      if (counterFragment.children.length > 1)
        sliderCounter.appendChild(counterFragment);

      const sliderBtnContainer = template.querySelector(
        ".slider__btn-container"
      );
      if (!sliderBtnContainer) return;

      if (sliderFrame.childElementCount < 2) {
        sliderBtnContainer.classList.add("hidden");
      } else {
        const parent = template.querySelector(".slider__root");
        if (!parent) return;

        const slides = Array.from(
          sliderFrame.querySelectorAll(".slider__slide")
        );
        if (!slides) return;

        let Circle = sliderCounter.children.item(0);
        if (!Circle) return;
        Circle.classList.add("post-actions__slide-counter__circle--active");

        const dir = getComputedStyle(parent).direction;

        const getBoundary = () => {
          return {
            min: 0,
            max: Math.abs(470 * slides.length - 470)
          };
        };

        const state = {
          dx: 0,
          activeSlide: 0,
          boundary: getBoundary(),
          allowTransition: true
        };

        const moveSlider = () => {
          const sign = dir === "rtl" ? 1 : -1;

          sliderFrame.style.transform = `translate3d(${
            sign * state.dx
          }px, 0, 0)`;
          sliderFrame.style.transition = state.allowTransition
            ? "transform 240ms ease"
            : "";
        };

        const goToSlide = (slideIdx: number) => {
          const idx = clamp(slideIdx, 0, slides.length);
          const newDx = clamp(
            idx * 470,
            state.boundary.min,
            state.boundary.max
          );

          Circle = sliderCounter.children.item(state.activeSlide);
          if (!Circle) return;
          Circle.className = "post-actions__slide-counter__circle";

          Circle = sliderCounter.children.item(idx);
          if (!Circle) return;
          Circle.classList.add("post-actions__slide-counter__circle--active");

          if (Math.abs(state.activeSlide - idx) > 1)
            state.allowTransition = false;
          else state.allowTransition = true;

          state.dx = newDx;
          state.activeSlide = idx;

          moveSlider();
        };

        const sliderBackBtn = template.querySelector<HTMLButtonElement>(
          ".slider__btn-container_btn--left"
        );
        if (!sliderBackBtn) return;

        sliderBackBtn.addEventListener("click", () => {
          if (state.activeSlide === 0) return;
          goToSlide((state.activeSlide - 1 + slides.length) % slides.length);
        });

        const sliderNextBtn = template.querySelector<HTMLButtonElement>(
          ".slider__btn-container_btn--right"
        );
        if (!sliderNextBtn) return;

        sliderNextBtn.addEventListener("click", () => {
          if (state.activeSlide === slides.length - 1) return;
          goToSlide((state.activeSlide + 1) % slides.length);
        });
      }

      const numberOfLikes = template.querySelector(
        ".post-comments__info__likes"
      );
      if (!numberOfLikes) return;
      numberOfLikes.textContent = `${post.likedBy.length} Likes`;

      const likeBtn = template.querySelector<HTMLButtonElement>(
        ".post-actions__btn--like"
      );
      if (!likeBtn) return;

      if (post.likedBy.includes(logedUserId)) {
        likeBtn.innerHTML = redLikeBtn();
        likeBtn.classList.add("active");
      } else {
        likeBtn.innerHTML = emptyLikeBtn();
      }

      likeBtn.addEventListener("click", () => {
        if (likeBtn.classList.contains("active")) {
          likeBtn.classList.remove("active");
          likeBtn.innerHTML = emptyLikeBtn();
          post.likedBy = post.likedBy.filter(id => {
            if (id !== logedUserId) return true;
            return false;
          });

          numberOfLikes.textContent = `${post.likedBy.length} Likes`;
        } else {
          likeBtn.classList.add("active");
          likeBtn.innerHTML = redLikeBtn();
          post.likedBy.push(logedUserId);

          numberOfLikes.textContent = `${post.likedBy.length} Likes`;
        }
      });

      const authorName = template.querySelector(
        ".post-comments__info__caption__username"
      );
      if (!authorName) return;
      authorName.textContent = `${author.username} :`;

      const postCaption = template.querySelector(
        ".post-comments__info__caption"
      );
      if (!postCaption) return;
      postCaption.textContent = post.caption;

      const commentsNav = template.querySelector(
        ".post-comments__comments-nav"
      );
      if (!commentsNav) return;

      //====== Comment Handle ======//

      const makeCommentFrag = () => {
        const postComments = [] as Comment[];
        post.comments.forEach(commentId => {
          const comment = data.comments.find(comment => {
            if (comment.id === commentId) return true;
            return false;
          });
          if (!comment) return;
          postComments.push(comment);
        });

        const commentsFragment = document.createDocumentFragment();

        postComments.forEach(comment => {
          const commentContainer = makeComment(comment);
          if (!commentContainer) return;
          commentsFragment.appendChild(commentContainer);
        });

        return commentsFragment;
      };

      const renderCommentsNav = () => {
        commentsNav.innerHTML = "";
        const commentsFragment = makeCommentFrag();
        commentsNav.appendChild(commentsFragment);
      };

      renderCommentsNav();

      //====== Comment Handle ======//

      const commentDropDown = template.querySelector(".comments-dropdown");
      if (!commentDropDown) return;

      const commentBtn = template.querySelector<HTMLButtonElement>(
        ".post-actions__btn--comment"
      );
      if (!commentBtn) return;
      commentBtn.addEventListener("click", () => {
        if (commentDropDown.classList.contains("hidden")) {
          commentDropDown.classList.remove("hidden");
        } else commentDropDown.classList.add("hidden");
      });

      const addCommentInput =
        template.querySelector<HTMLInputElement>(".add-comment-input");
      if (!addCommentInput) return;

      const addCommentBtn =
        template.querySelector<HTMLButtonElement>(".post-btn");
      if (!addCommentBtn) return;

      addCommentBtn.addEventListener("click", () => {
        const comment = addCommentInput.value.trim();
        addCommentInput.value = "";
        if (comment === "") return;

        let id = Number(data.uniqueId);

        const newComment: Comment = {
          id: `comment${id}`,
          author: `${logedUserId}`,
          post: `${post.id}`,
          context: comment
        };

        id++;
        data.uniqueId = `${id}`;
        data.comments.push(newComment);
        post.comments.push(newComment.id);
        renderCommentsNav();
      });

      return postContainer;
    };

    const renderPosts = () => {
      const postNav = document.querySelector(`#${classes.postNav}`);
      if (!postNav) return;

      const postsFragment = document.createDocumentFragment();

      data.posts.forEach(post => {
        if (post.author !== logedUserId) {
          const createdPost = makePost(post.id);
          if (createdPost === undefined) return;

          postsFragment.appendChild(createdPost);
        }
      });

      postNav.appendChild(postsFragment);
    };

    renderPosts();
  });

  return `
  <header id="${classes.headerContainer}">
    <nav id="${classes.headerNav}">
      <div class="${classes.headerItem}">
        <a class="${classes.svgA} ${classes.instaBrand}">
          <svg class="${classes.svg}" fill="#262626" height="29" role="img" viewBox="32 4 113 32" width="103"><path clip-rule="evenodd" d="M37.82 4.11c-2.32.97-4.86 3.7-5.66 7.13-1.02 4.34 3.21 6.17 3.56 5.57.4-.7-.76-.94-1-3.2-.3-2.9 1.05-6.16 2.75-7.58.32-.27.3.1.3.78l-.06 14.46c0 3.1-.13 4.07-.36 5.04-.23.98-.6 1.64-.33 1.9.32.28 1.68-.4 2.46-1.5a8.13 8.13 0 0 0 1.33-4.58c.07-2.06.06-5.33.07-7.19 0-1.7.03-6.71-.03-9.72-.02-.74-2.07-1.51-3.03-1.1Zm82.13 14.48a9.42 9.42 0 0 1-.88 3.75c-.85 1.72-2.63 2.25-3.39-.22-.4-1.34-.43-3.59-.13-5.47.3-1.9 1.14-3.35 2.53-3.22 1.38.13 2.02 1.9 1.87 5.16ZM96.8 28.57c-.02 2.67-.44 5.01-1.34 5.7-1.29.96-3 .23-2.65-1.72.31-1.72 1.8-3.48 4-5.64l-.01 1.66Zm-.35-10a10.56 10.56 0 0 1-.88 3.77c-.85 1.72-2.64 2.25-3.39-.22-.5-1.69-.38-3.87-.13-5.25.33-1.78 1.12-3.44 2.53-3.44 1.38 0 2.06 1.5 1.87 5.14Zm-13.41-.02a9.54 9.54 0 0 1-.87 3.8c-.88 1.7-2.63 2.24-3.4-.23-.55-1.77-.36-4.2-.13-5.5.34-1.95 1.2-3.32 2.53-3.2 1.38.14 2.04 1.9 1.87 5.13Zm61.45 1.81c-.33 0-.49.35-.61.93-.44 2.02-.9 2.48-1.5 2.48-.66 0-1.26-1-1.42-3-.12-1.58-.1-4.48.06-7.37.03-.59-.14-1.17-1.73-1.75-.68-.25-1.68-.62-2.17.58a29.65 29.65 0 0 0-2.08 7.14c0 .06-.08.07-.1-.06-.07-.87-.26-2.46-.28-5.79 0-.65-.14-1.2-.86-1.65-.47-.3-1.88-.81-2.4-.2-.43.5-.94 1.87-1.47 3.48l-.74 2.2.01-4.88c0-.5-.34-.67-.45-.7a9.54 9.54 0 0 0-1.8-.37c-.48 0-.6.27-.6.67 0 .05-.08 4.65-.08 7.87v.46c-.27 1.48-1.14 3.49-2.09 3.49s-1.4-.84-1.4-4.68c0-2.24.07-3.21.1-4.83.02-.94.06-1.65.06-1.81-.01-.5-.87-.75-1.27-.85-.4-.09-.76-.13-1.03-.11-.4.02-.67.27-.67.62v.55a3.71 3.71 0 0 0-1.83-1.49c-1.44-.43-2.94-.05-4.07 1.53a9.31 9.31 0 0 0-1.66 4.73c-.16 1.5-.1 3.01.17 4.3-.33 1.44-.96 2.04-1.64 2.04-.99 0-1.7-1.62-1.62-4.4.06-1.84.42-3.13.82-4.99.17-.8.04-1.2-.31-1.6-.32-.37-1-.56-1.99-.33-.7.16-1.7.34-2.6.47 0 0 .05-.21.1-.6.23-2.03-1.98-1.87-2.69-1.22-.42.39-.7.84-.82 1.67-.17 1.3.9 1.91.9 1.91a22.22 22.22 0 0 1-3.4 7.23v-.7c-.01-3.36.03-6 .05-6.95.02-.94.06-1.63.06-1.8 0-.36-.22-.5-.66-.67-.4-.16-.86-.26-1.34-.3-.6-.05-.97.27-.96.65v.52a3.7 3.7 0 0 0-1.84-1.49c-1.44-.43-2.94-.05-4.07 1.53a10.1 10.1 0 0 0-1.66 4.72c-.15 1.57-.13 2.9.09 4.04-.23 1.13-.89 2.3-1.63 2.3-.95 0-1.5-.83-1.5-4.67 0-2.24.07-3.21.1-4.83.02-.94.06-1.65.06-1.81 0-.5-.87-.75-1.27-.85-.42-.1-.79-.13-1.06-.1-.37.02-.63.35-.63.6v.56a3.7 3.7 0 0 0-1.84-1.49c-1.44-.43-2.93-.04-4.07 1.53-.75 1.03-1.35 2.17-1.66 4.7a15.8 15.8 0 0 0-.12 2.04c-.3 1.81-1.61 3.9-2.68 3.9-.63 0-1.23-1.21-1.23-3.8 0-3.45.22-8.36.25-8.83l1.62-.03c.68 0 1.29.01 2.19-.04.45-.02.88-1.64.42-1.84-.21-.09-1.7-.17-2.3-.18-.5-.01-1.88-.11-1.88-.11s.13-3.26.16-3.6c.02-.3-.35-.44-.57-.53a7.77 7.77 0 0 0-1.53-.44c-.76-.15-1.1 0-1.17.64-.1.97-.15 3.82-.15 3.82-.56 0-2.47-.11-3.02-.11-.52 0-1.08 2.22-.36 2.25l3.2.09-.03 6.53v.47c-.53 2.73-2.37 4.2-2.37 4.2.4-1.8-.42-3.15-1.87-4.3-.54-.42-1.6-1.22-2.79-2.1 0 0 .69-.68 1.3-2.04.43-.96.45-2.06-.61-2.3-1.75-.41-3.2.87-3.63 2.25a2.61 2.61 0 0 0 .5 2.66l.15.19c-.4.76-.94 1.78-1.4 2.58-1.27 2.2-2.24 3.95-2.97 3.95-.58 0-.57-1.77-.57-3.43 0-1.43.1-3.58.19-5.8.03-.74-.34-1.16-.96-1.54a4.33 4.33 0 0 0-1.64-.69c-.7 0-2.7.1-4.6 5.57-.23.69-.7 1.94-.7 1.94l.04-6.57c0-.16-.08-.3-.27-.4a4.68 4.68 0 0 0-1.93-.54c-.36 0-.54.17-.54.5l-.07 10.3c0 .78.02 1.69.1 2.09.08.4.2.72.36.91.15.2.33.34.62.4.28.06 1.78.25 1.86-.32.1-.69.1-1.43.89-4.2 1.22-4.31 2.82-6.42 3.58-7.16.13-.14.28-.14.27.07l-.22 5.32c-.2 5.37.78 6.36 2.17 6.36 1.07 0 2.58-1.06 4.2-3.74l2.7-4.5 1.58 1.46c1.28 1.2 1.7 2.36 1.42 3.45-.21.83-1.02 1.7-2.44.86-.42-.25-.6-.44-1.01-.71-.23-.15-.57-.2-.78-.04-.53.4-.84.92-1.01 1.55-.17.61.45.94 1.09 1.22.55.25 1.74.47 2.5.5 2.94.1 5.3-1.42 6.94-5.34.3 3.38 1.55 5.3 3.72 5.3 1.45 0 2.91-1.88 3.55-3.72.18.75.45 1.4.8 1.96 1.68 2.65 4.93 2.07 6.56-.18.5-.69.58-.94.58-.94a3.07 3.07 0 0 0 2.94 2.87c1.1 0 2.23-.52 3.03-2.31.09.2.2.38.3.56 1.68 2.65 4.93 2.07 6.56-.18l.2-.28.05 1.4-1.5 1.37c-2.52 2.3-4.44 4.05-4.58 6.09-.18 2.6 1.93 3.56 3.53 3.69a4.5 4.5 0 0 0 4.04-2.11c.78-1.15 1.3-3.63 1.26-6.08l-.06-3.56a28.55 28.55 0 0 0 5.42-9.44s.93.01 1.92-.05c.32-.02.41.04.35.27-.07.28-1.25 4.84-.17 7.88.74 2.08 2.4 2.75 3.4 2.75 1.15 0 2.26-.87 2.85-2.17l.23.42c1.68 2.65 4.92 2.07 6.56-.18.37-.5.58-.94.58-.94.36 2.2 2.07 2.88 3.05 2.88 1.02 0 2-.42 2.78-2.28.03.82.08 1.49.16 1.7.05.13.34.3.56.37.93.34 1.88.18 2.24.11.24-.05.43-.25.46-.75.07-1.33.03-3.56.43-5.21.67-2.79 1.3-3.87 1.6-4.4.17-.3.36-.35.37-.03.01.64.04 2.52.3 5.05.2 1.86.46 2.96.65 3.3.57 1 1.27 1.05 1.83 1.05.36 0 1.12-.1 1.05-.73-.03-.31.02-2.22.7-4.96.43-1.79 1.15-3.4 1.41-4 .1-.21.15-.04.15 0-.06 1.22-.18 5.25.32 7.46.68 2.98 2.65 3.32 3.34 3.32 1.47 0 2.67-1.12 3.07-4.05.1-.7-.05-1.25-.48-1.25Z" fill="currentColor" fill-rule="evenodd"></path></svg>
        </a>
      </div>

      <div class="${classes.headerItem}">
        <input id="${classes.headerSearchInput}" type="text" placeholder="Search User" />
      </div>

      <div class="${classes.headerItem}">
        <nav id="${classes.headerButtonsNav}">
          <div class="${classes.headerNavButton}">
            <button class="${classes.svgButton} ${classes.homeBtn}">
              <svg class="${classes.svg}" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M22 23h-6.001a1 1 0 01-1-1v-5.455a2.997 2.997 0 10-5.993 0V22a1 1 0 01-1 1H2a1 1 0 01-1-1V11.543a1.002 1.002 0 01.31-.724l10-9.543a1.001 1.001 0 011.38 0l10 9.543a1.002 1.002 0 01.31.724V22a1 1 0 01-1 1z"></path></svg>
            </button>
          </div>

          <div class="${classes.headerNavButton}">
            <button class="${classes.svgButton}">
              <svg class="${classes.svg}" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></polygon></svg>
            </button>
          </div>

          <div class="${classes.headerNavButton}">
            <button class="${classes.svgButton} ${classes.addPostBtn}">
              <svg class="${classes.svg}" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line></svg>
            </button>
          </div>

          <div class="${classes.headerNavButton}">
            <button class="${classes.svgButton} ${classes.exploreBtn}">
              <svg class="${classes.svg}" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><polygon fill="none" points="13.941 13.953 7.581 16.424 10.06 10.056 16.42 7.585 13.941 13.953" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon><polygon fill-rule="evenodd" points="10.06 10.056 13.949 13.945 7.581 16.424 10.06 10.056"></polygon><circle cx="12.001" cy="12.005" fill="none" r="10.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle></svg>
            </button>
          </div>

          <div class="${classes.headerNavButton}">
            <button class="${classes.svgButton}">
              <svg class="${classes.svg}" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path></svg>
            </button>
          </div>

          <div class="${classes.headerNavButton}">
            <button class="${classes.svgButton} ${classes.profileBtn}">
              <div class="${classes.profilePicContainer}">
                <img class="${classes.smallProfilePic}" src="" alt="">
              </div>
            </button>
          </div>
        </nav>
      </div>
    </nav>
  </header>

  <main id="${classes.mainContainer}">
    <section id="${classes.postSection}">
      <nav id="${classes.postNav}"></nav>
    </section>
  </main>

  <footer id="${classes.footerContainer}">
    <div class="${classes.footerRow}">
      <div class="${classes.footerRowItem}">Meta</div>
      <div class="${classes.footerRowItem}">About</div>
      <div class="${classes.footerRowItem}">Blog</div>
      <div class="${classes.footerRowItem}">Jobs</div>
      <div class="${classes.footerRowItem}">Help</div>
      <div class="${classes.footerRowItem}">API</div>
      <div class="${classes.footerRowItem}">Terms</div>
      <div class="${classes.footerRowItem}">Top Accounts</div>
      <div class="${classes.footerRowItem}">Hashtags</div>
      <div class="${classes.footerRowItem}">Locations</div>
      <div class="${classes.footerRowItem}">Instagram Lite</div>
      <div class="${classes.footerRowItem}">Contact Uploading & Non-Users</div>
    </div>

    <div class="${classes.footerRow}">
      <div class="${classes.footerRowItem}">English</div>
      <div class="${classes.footerRowItem}">© 2022 Instagram from Meta</div>
    </div>
  </footer>`;
};

export default Home;
