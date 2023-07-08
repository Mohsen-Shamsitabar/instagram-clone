import type { Page, Data, Comment } from "types";
import { onPageMount } from "utils";
import classes from "./Post.module.css";

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

const Post: Page<Data> = context => {
  onPageMount(() => {
    const data = context.pageProps;
    const postId = context.params?.postId;
    const history = context.history;
    const logedUserId = context.params?.logedUserId;
    if (!logedUserId) return;
    if (!postId) return;

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

    const post = findPost(postId);
    if (!post) return;
    const logedUser = findUser(logedUserId);
    if (!logedUser) return;
    const postAuthor = findUser(post.author);
    if (!postAuthor) return;

    const sliderFrame = document.getElementById(`${classes.sliderSlidesFrame}`);
    if (!sliderFrame) return;

    const postFragment = document.createDocumentFragment();

    post.images.forEach(image => {
      const sliderSlide = document.createElement("div");
      sliderSlide.className = `${classes.sliderSlide}`;

      const sliderContent = document.createElement("div");
      sliderContent.className = `${classes.sliderSlideContent}`;

      const sliderImage = document.createElement("img");
      sliderImage.className = `${classes.bigPostPic}`;
      sliderImage.src = image;

      sliderContent.appendChild(sliderImage);
      sliderSlide.appendChild(sliderContent);
      postFragment.appendChild(sliderSlide);
    });
    sliderFrame.appendChild(postFragment);

    const sliderBtnContainer = document.getElementById(
      `${classes.sliderBtnContainer}`
    );
    if (!sliderBtnContainer) return;

    if (sliderFrame.childElementCount < 2) {
      sliderBtnContainer.style.display = "none";
    } else {
      const parent = document.getElementById(`${classes.sliderRoot}`);
      if (!parent) return;

      const slides = Array.from(
        sliderFrame.querySelectorAll(`.${classes.sliderSlide}`)
      );
      if (!slides) return;

      const dir = getComputedStyle(parent).direction;

      const getBoundary = () => {
        return {
          min: 0,
          max: Math.abs(500 * slides.length - 500)
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

        sliderFrame.style.transform = `translate3d(${sign * state.dx}px, 0, 0)`;
        sliderFrame.style.transition = state.allowTransition
          ? "transform 240ms ease"
          : "";
      };

      const goToSlide = (slideIdx: number) => {
        const idx = clamp(slideIdx, 0, slides.length);
        const newDx = clamp(idx * 500, state.boundary.min, state.boundary.max);

        if (Math.abs(state.activeSlide - idx) > 1)
          state.allowTransition = false;
        else state.allowTransition = true;

        state.dx = newDx;
        state.activeSlide = idx;

        moveSlider();
      };

      const sliderBackBtn = document.querySelector<HTMLButtonElement>(
        ".sliderBtnContainerBtn--left"
      );
      if (!sliderBackBtn) return;

      sliderBackBtn.addEventListener("click", () => {
        if (state.activeSlide === 0) return;
        goToSlide((state.activeSlide - 1 + slides.length) % slides.length);
      });

      const sliderNextBtn = document.querySelector<HTMLButtonElement>(
        ".sliderBtnContainerBtn--right"
      );
      if (!sliderNextBtn) return;

      sliderNextBtn.addEventListener("click", () => {
        if (state.activeSlide === slides.length - 1) return;

        goToSlide((state.activeSlide + 1) % slides.length);
      });
    }

    const authorProfilePic = document.querySelector<HTMLImageElement>(
      `.${classes.mediumProfilePic}`
    );
    if (!authorProfilePic) return;
    authorProfilePic.src = postAuthor.avatar;

    const authorUserName = document.querySelector(`.${classes.authorName}`);
    if (!authorUserName) return;
    authorUserName.textContent = postAuthor.username;

    const authorInfo = document.querySelector(`.${classes.authorInfo}`);
    if (!authorInfo) return;
    authorInfo.addEventListener("click", () => {
      history.push(`/user/${logedUserId}/profile/${postAuthor.id}`);
    });

    if (logedUserId !== post.author) {
      const unfollowBtn = document.querySelector(`.${classes.followBtn}`);
      if (!unfollowBtn) return;
      unfollowBtn.classList.remove(`${classes.hidden}`);

      if (logedUser.following.includes(post.author)) {
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
            if (userId !== post.author) {
              return true;
            }
            return false;
          });

          postAuthor.followers = postAuthor.followers.filter(userId => {
            if (userId !== logedUserId) {
              return true;
            }
            return false;
          });
        } else {
          unfollowBtn.classList.add("following");
          unfollowBtn.textContent = "Unfollow";
          logedUser.following.push(`${post.author}`);
          postAuthor.followers.push(`${logedUserId}`);
        }
      });
    }

    const commentsNav = document.getElementById(
      `${classes.postCommentsCommentsNav}`
    );
    if (!commentsNav) return;

    //====== Comment Handle ======//

    const makeComment = (comment: Comment) => {
      const author = findUser(comment.author);
      if (!author) return;

      const commentContainer = document.createElement("article");
      commentContainer.className = `${classes.postComment}`;

      const profilePicContainer = document.createElement("div");
      profilePicContainer.className = `${classes.profilePicContainer}`;

      const profilePic = document.createElement("img");
      profilePic.className = `${classes.mediumProfilePic}`;
      profilePic.src = author.avatar;

      profilePicContainer.appendChild(profilePic);
      commentContainer.appendChild(profilePicContainer);

      const contextContainer = document.createElement("div");
      contextContainer.className = `${classes.commentContextContainer}`;

      const authorName = document.createElement("span");
      authorName.className = `${classes.postAuthorName}`;
      authorName.textContent = `${author.username} : `;
      authorName.addEventListener("click", () => {
        history.push(`/user/${logedUserId}/profile/${author.id}`);
      });

      const commentContext = document.createElement("span");
      commentContext.className = `${classes.commentContext}`;
      commentContext.textContent = comment.context;

      contextContainer.appendChild(authorName);
      contextContainer.appendChild(commentContext);
      commentContainer.appendChild(contextContainer);
      return commentContainer;
    };

    const makeCaption = () => {
      const commentContainer = document.createElement("article");
      commentContainer.className = `${classes.postComment}`;

      const profilePicContainer = document.createElement("div");
      profilePicContainer.className = `${classes.profilePicContainer}`;

      const profilePic = document.createElement("img");
      profilePic.className = `${classes.mediumProfilePic}`;
      profilePic.src = postAuthor.avatar;

      profilePicContainer.appendChild(profilePic);
      commentContainer.appendChild(profilePicContainer);

      const contextContainer = document.createElement("div");
      contextContainer.className = `${classes.commentContextContainer}`;

      const authorName = document.createElement("span");
      authorName.className = `${classes.postAuthorName}`;
      authorName.textContent = `${postAuthor.username} : `;
      authorName.addEventListener("click", () => {
        history.push(`/user/${logedUserId}/profile/${postAuthor.id}`);
      });

      const commentContext = document.createElement("span");
      commentContext.className = `${classes.commentContext}`;
      commentContext.textContent = post.caption;

      contextContainer.appendChild(authorName);
      contextContainer.appendChild(commentContext);
      commentContainer.appendChild(contextContainer);
      return commentContainer;
    };

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
      const caption = makeCaption();
      commentsNav.appendChild(caption);
      commentsNav.appendChild(commentsFragment);
    };

    renderCommentsNav();

    //====== Comment Handle ======//

    const numberOfLikes = document.getElementById(`${classes.numberOfLikes}`);
    if (!numberOfLikes) return;
    numberOfLikes.textContent = `${post.likedBy.length} Likes`;

    const likeBtn = document.querySelector<HTMLButtonElement>(
      `.${classes.postActionsBtnLike}`
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

    const addCommentInput = document.querySelector<HTMLInputElement>(
      `#${classes.addCommentInput}`
    );
    if (!addCommentInput) return;

    const addCommentBtn = document.querySelector<HTMLInputElement>(
      `#${classes.postBtn}`
    );
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
  });

  return `
  <article id="${classes.postContainer}">
    <div id="${classes.imgSection}">

      <div id="${classes.imgContainer}">
        <div id="${classes.sliderRoot}">
          <div id="${classes.sliderSlidesWrapper}">
            <div id="${classes.sliderSlidesContainer}">
              <div id="${classes.sliderSlidesFrame}"></div>
              </div>
            </div>
          </div>
        </div>

        <div id="${classes.sliderBtnContainer}">
          <button
            class="${classes.sliderBtnContainerBtn} sliderBtnContainerBtn--left"
          >
            ←
          </button>

          <button
            class="${classes.sliderBtnContainerBtn} sliderBtnContainerBtn--right"
          >
            →
          </button>
        </div>
      </div>
    </div>

    <div id="${classes.contextSection}">
      <div id="${classes.contextHeader}">
        <div class="${classes.authorInfo}">
          <div class="${classes.profilePicContainer}">
            <img class="${classes.mediumProfilePic}" src="https://picsum.photos/id/0/470" alt="" />
          </div>

          <div class="${classes.authorName}">Meow</div>
        </div>

        <button class="${classes.followBtn} ${classes.hidden}">Follow</button>
      </div>

      <nav id="${classes.postCommentsCommentsNav}"></nav>

      <div id="${classes.postActions}">
        <button class="${classes.postActionsBtn} ${classes.postActionsBtnLike}"></button>
        <span id="${classes.numberOfLikes}">69 Likes</span>
      </div>

      <div id="${classes.AddCommentContainer}">
        <input
        id="${classes.addCommentInput}"
        type="text"
        placeholder="Add a comment..."
        />
        <button id="${classes.postBtn}">Post</button>
      </div>
    </div>
  </article>
  `;
};

export default Post;
