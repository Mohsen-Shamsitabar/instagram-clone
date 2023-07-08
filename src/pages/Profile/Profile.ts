import type { Page, Post, Data } from "types";
import { onPageMount } from "utils";
import classes from "./Profile.module.css";

const Profile: Page<Data> = context => {
  onPageMount(() => {
    const data = context.pageProps;
    const logedUserId = context.params?.logedUserId;
    if (!logedUserId) return;

    const viewingProfileUserId = context.params?.userId;
    if (!viewingProfileUserId) return;

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

    const viewingProfileUser = findUser(viewingProfileUserId);
    if (!viewingProfileUser) return;

    const history = context.history;

    //==========Header==========//

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

    //==========Main==========//

    const infoProfilePic = document.querySelector<HTMLImageElement>(
      `.${classes.bigProfilePic}`
    );
    if (!infoProfilePic) return;
    infoProfilePic.src = viewingProfileUser.avatar;
    infoProfilePic.alt = viewingProfileUser.username[0].toUpperCase();

    const infoUserName = document.querySelector(
      `#${classes.userNameContainerName}`
    );
    if (!infoUserName) return;
    infoUserName.textContent = viewingProfileUser.username;

    const infoPostsCount = document.querySelector(`#${classes.postParam}`);
    if (!infoPostsCount) return;
    infoPostsCount.textContent = `${viewingProfileUser.posts.length} Posts`;

    const infoFollowerCount = document.querySelector(
      `#${classes.followerParam}`
    );
    if (!infoFollowerCount) return;
    infoFollowerCount.textContent = `${viewingProfileUser.followers.length} Followers`;

    const infoFollowingCount = document.querySelector(
      `#${classes.followingParam}`
    );
    if (!infoFollowingCount) return;
    infoFollowingCount.textContent = `${viewingProfileUser.following.length} Following`;

    const infoUserId = document.querySelector(`#${classes.bioContainerUserId}`);
    if (!infoUserId) return;
    infoUserId.textContent = `User ID = ${viewingProfileUserId}`;

    const infoUserBio = document.querySelector(`#${classes.bioContainerBio}`);
    if (!infoUserBio) return;
    infoUserBio.textContent = `${viewingProfileUser.bio}`;

    const infoUserWebsite = document.querySelector<HTMLLinkElement>(
      `#${classes.bioContainerWebsite}`
    );
    if (!infoUserWebsite) return;
    infoUserWebsite.textContent = `${viewingProfileUser.website}`;
    infoUserWebsite.href = `${viewingProfileUser.website}`;

    if (viewingProfileUserId === logedUserId) {
      const editSection = document.querySelector(`.${classes.editSection}`);
      if (!editSection) return;

      const newUserNameInput = document.querySelector<HTMLInputElement>(
        `#${classes.editNameInput}`
      );
      if (!newUserNameInput) return;

      const newWebsiteInput = document.querySelector<HTMLInputElement>(
        `#${classes.editWebsiteInput}`
      );
      if (!newWebsiteInput) return;

      const newBioInput = document.querySelector<HTMLInputElement>(
        `#${classes.editBioInput}`
      );
      if (!newBioInput) return;

      const newAvatarInput = document.querySelector<HTMLInputElement>(
        `#${classes.editAvatarInput}`
      );
      if (!newAvatarInput) return;

      const handleEditProfile = () => {
        if (editSection.classList.contains(`${classes.hidden}`)) {
          editSection.classList.remove(`${classes.hidden}`);
          newAvatarInput.value = logedUser.avatar;
          newBioInput.value = logedUser.bio;
          newUserNameInput.value = logedUser.username;
          newWebsiteInput.value = logedUser.website;
        } else {
          editSection.classList.add(`${classes.hidden}`);
          newAvatarInput.value = "";
          newBioInput.value = "";
          newUserNameInput.value = "";
          newWebsiteInput.value = "";
        }
      };

      const editProfileBtn = document.querySelector<HTMLButtonElement>(
        `#${classes.editProfileBtn}`
      );
      if (!editProfileBtn) return;
      editProfileBtn.className = "";
      editProfileBtn.addEventListener("click", () => {
        handleEditProfile();
      });

      const settingsBtn = document.querySelector<HTMLButtonElement>(
        `#${classes.settingsBtn}`
      );
      if (!settingsBtn) return;
      settingsBtn.className = "";
      settingsBtn.addEventListener("click", () => {
        handleEditProfile();
      });

      const alart = document.querySelector<HTMLDivElement>(`#${classes.alart}`);
      if (!alart) return;

      const editConfirmBtn = document.querySelector<HTMLButtonElement>(
        `.${classes.editSectionBtnConfirm}`
      );
      if (!editConfirmBtn) return;
      editConfirmBtn.addEventListener("click", () => {
        const newUserName = newUserNameInput.value.trim();
        if (newUserName === "") return;
        if (newUserName.includes(" ")) {
          alart.style.color = "red";
          alart.style.textShadow = "0px 0px 5px rgb(255, 124, 124)";
          alart.className = "";
          alart.textContent = 'You cant use "Space" in your username';
          setTimeout(() => {
            alart.className = "hidden";
          }, 2500);
          return;
        }

        const terminate = data.users.findIndex(user => {
          if (user.username.toLowerCase() === newUserName.toLowerCase()) {
            if (newUserName === logedUser.username) return false;
            alart.style.color = "red";
            alart.style.textShadow = "0px 0px 5px rgb(255, 124, 124)";
            alart.className = "";
            alart.textContent = "Username is Invalid/Taken";
            setTimeout(() => {
              alart.className = "hidden";
            }, 2500);
            return true;
          }
          return false;
        });
        if (terminate !== -1) return;

        logedUser.username = newUserName;
        infoUserName.textContent = newUserName;

        const newWebsite = newWebsiteInput.value.trim();
        logedUser.website = newWebsite;
        infoUserWebsite.textContent = newWebsite;
        infoUserWebsite.href = `${viewingProfileUser.website}`;

        const newBio = newBioInput.value.trim();
        logedUser.bio = newBio;
        infoUserBio.textContent = newBio;

        const newAvatar = newAvatarInput.value.trim();
        logedUser.avatar = newAvatar;
        infoProfilePic.src = newAvatar;
        profileBtnImage.src = newAvatar;

        editSection.classList.add(`${classes.hidden}`);
      });

      const editDeleteProfileBtn = document.querySelector<HTMLButtonElement>(
        `.${classes.editSectionBtnDeleteProfile}`
      );
      if (!editDeleteProfileBtn) return;

      editDeleteProfileBtn.addEventListener("click", () => {
        // Deleting Posts / Comments (we can user find idx)
        let postsLength = data.posts.length;
        let commentslength = data.comments.length;
        for (let postIdx = 0; postIdx < postsLength; postIdx++) {
          const post = data.posts[postIdx];
          if (viewingProfileUserId === logedUserId) {
            for (
              let commentIdx = 0;
              commentIdx < commentslength;
              commentIdx++
            ) {
              const comment = data.comments[commentIdx];
              if (comment.post === post.id) {
                data.comments.splice(commentIdx, 1);
                commentslength--;
                commentIdx--;
              }
            }

            data.posts.splice(postIdx, 1);
            postsLength--;
            postIdx--;
          }
        }
        // Deleting followers / followings

        data.users.forEach(user => {
          if (user.id !== logedUserId) {
            if (user.followers.includes(`${logedUserId}`)) {
              const foundIdx = user.followers.findIndex(id => {
                if (id === logedUserId) true;
                false;
              });
              user.followers.splice(foundIdx, 1);
            }

            if (user.following.includes(`${logedUserId}`)) {
              const foundIdx = user.following.findIndex(id => {
                if (id === logedUserId) true;
                false;
              });
              user.following.splice(foundIdx, 1);
            }
          }
        });

        // Deleting user / comments by the user

        for (let commentIdx = 0; commentIdx < commentslength; commentIdx++) {
          const comment = data.comments[commentIdx];
          if (comment.author === logedUserId) {
            data.comments.splice(commentIdx, 1);
            commentslength--;
            commentIdx--;
          }
        }

        for (let userIdx = 0; userIdx < data.users.length; userIdx++) {
          const user = data.users[userIdx];
          if (user.id === logedUserId) {
            data.users.splice(userIdx, 1);
            break;
          }
        }

        history.push("/");
      });

      const editCloseBtn = document.querySelector<HTMLButtonElement>(
        `.${classes.editSectionBtnClose}`
      );
      if (!editCloseBtn) return;
      editCloseBtn.addEventListener("click", () => {
        handleEditProfile();
      });

      const editLogoutBtn = document.querySelector<HTMLButtonElement>(
        `.${classes.editSectionBtnLogout}`
      );
      if (!editLogoutBtn) return;
      editLogoutBtn.addEventListener("click", () => {
        history.push("/");
      });
    } else {
      const followBtn = document.querySelector(`.${classes.followBtn}`);
      if (!followBtn) return;
      followBtn.classList.remove(`${classes.hidden}`);

      if (logedUser.following.includes(viewingProfileUserId)) {
        followBtn.classList.add("following");
        followBtn.textContent = "Unfollow";
      } else {
        followBtn.textContent = "Follow";
      }

      followBtn.addEventListener("click", () => {
        if (followBtn.classList.contains("following")) {
          followBtn.classList.remove("following");
          followBtn.textContent = "Follow";

          logedUser.following = logedUser.following.filter(userId => {
            if (userId !== viewingProfileUserId) {
              return true;
            }
            return false;
          });

          viewingProfileUser.followers = viewingProfileUser.followers.filter(
            userId => {
              if (userId !== logedUserId) {
                return true;
              }
              return false;
            }
          );

          infoFollowerCount.textContent = `${viewingProfileUser.followers.length} Followers`;
        } else {
          followBtn.classList.add("following");
          followBtn.textContent = "Unfollow";
          logedUser.following.push(`${viewingProfileUserId}`);
          viewingProfileUser.followers.push(`${logedUserId}`);
          infoFollowerCount.textContent = `${viewingProfileUser.followers.length} Followers`;
        }
      });
    }

    //==========Posts==========//

    const postSection = document.querySelector(`#${classes.postSection}`);
    if (!postSection) return;

    const initializePosts = () => {
      const UserPosts = [] as Post[];

      viewingProfileUser.posts.forEach(postId => {
        const foundPost = findPost(postId);
        if (foundPost) UserPosts.push(foundPost);
      });
      return UserPosts;
    };

    const UserPosts = initializePosts();

    const makePost = (post: Post) => {
      const postContainer = document.createElement("article");
      postContainer.className = `${classes.postContainer} ${classes.smallPostPic}`;

      const image = document.createElement("img");
      image.className = `${classes.smallPostPic}`;
      image.src = post.images[0];
      image.alt = `image by ${logedUser.username}`;
      postContainer.appendChild(image);

      postContainer.addEventListener("click", () => {
        history.push(`/user/${logedUserId}/post/${post.id}`);
      });

      return postContainer;
    };

    const makePostRow = () => {
      const row = document.createElement("div");
      row.className = `${classes.postContainerRow}`;
      return row;
    };

    const renderPosts = () => {
      let currentRow = postSection.lastElementChild;

      if (!currentRow) return;

      UserPosts.forEach(post => {
        currentRow?.appendChild(makePost(post));

        if (currentRow?.childElementCount === 3) {
          postSection.appendChild(makePostRow());
          currentRow = postSection.lastElementChild;
        }
      });
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
              <svg class="${classes.svg}" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M9.005 16.545a2.997 2.997 0 012.997-2.997h0A2.997 2.997 0 0115 16.545V22h7V11.543L12 2 2 11.543V22h7.005z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path></svg>
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
    <section id="${classes.mainSection}">
      <div id="${classes.userInfoContainer}">
        <div id="${classes.userInfoAvatarContainer}">
          <div class="${classes.profilePicContainer}">
            <img class="${classes.bigProfilePic}" src="" alt="">
          </div>
        </div>

        <div id="${classes.userInfoContextContainer}">
          <div id="${classes.userNameContainer}">
            <div id="${classes.userNameContainerName}"></div>
            <button class="${classes.followBtn} ${classes.hidden}">Follow</button>
            <button id="${classes.editProfileBtn}" class="${classes.hidden}">Edit profile</button>
            <button id="${classes.settingsBtn}" class="${classes.hidden}">
              <svg class="${classes.svg} ${classes.svgButton}" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" fill="none" r="8.635" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle><path d="M14.232 3.656a1.269 1.269 0 01-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 01-.796.66m-.001 16.688a1.269 1.269 0 01.796.66l.505.996h1.862l.505-.996a1.269 1.269 0 01.796-.66M3.656 9.768a1.269 1.269 0 01-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 01.66.796m16.688-.001a1.269 1.269 0 01.66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 01-.66-.796M7.678 4.522a1.269 1.269 0 01-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 01-.096 1.03m11.8 11.799a1.269 1.269 0 011.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 01.096-1.03m-14.956.001a1.269 1.269 0 01.096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 011.03.096m11.799-11.8a1.269 1.269 0 01-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 01-1.03-.096" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path></svg>
            </button>
          </div>

          <div id="${classes.paramsContainer}">
            <div class="${classes.param}" id="${classes.postParam}"></div>
            <div class="${classes.param}" id="${classes.followerParam}"></div>
            <div class="${classes.param}" id="${classes.followingParam}"></div>
          </div>

          <div id="${classes.bioContainer}">
            <p class="${classes.bioContainerText}" id="${classes.bioContainerUserId}"></p>
            <p class="${classes.bioContainerText}" id="${classes.bioContainerBio}"></p>
            <a href="" class="${classes.bioContainerText}" id="${classes.bioContainerWebsite}"></a>
          </div>
        </div>
      </div>

      <section class="${classes.editSection} ${classes.hidden}">
        <p>Edit / Settings :</p>
        
        <form>
          <label for="${classes.editNameInput}">New Username :</label>
          <input id="${classes.editNameInput}" type="text" placeholder="New Username" />        
        </form>

        <form>
          <label for="${classes.editWebsiteInput}">New Website :</label>
          <input id="${classes.editWebsiteInput}" type="text" placeholder="New Website" />        
        </form>

        <form>
          <label for="${classes.editBioInput}">New Bio :</label>
          <input id="${classes.editBioInput}" type="text" placeholder="New Bio" />        
        </form>

        <form>
          <label for="${classes.editAvatarInput}">New Avatar :</label>
          <input id="${classes.editAvatarInput}" type="text" placeholder="New Avatar URL" />        
        </form>

        <p id="${classes.alart}" class="${classes.hidden}"></p>

        <div id="${classes.editSectionBtnContainer}">
          <button class="${classes.editSectionBtnConfirm} ${classes.editSectionBtn}">Confirm</button>
          <button class="${classes.editSectionBtnDeleteProfile} ${classes.editSectionBtn}">Delete Profile</button>
          <button class="${classes.editSectionBtnLogout} ${classes.editSectionBtn}">Logout</button>
          <button class="${classes.editSectionBtnClose} ${classes.editSectionBtn}">Close</button>
        </div>
      </section>

      <hr class="${classes.divider} ${classes.dividerHoriz}">
  
      <section id="${classes.postSection}">
        <div class="${classes.postContainerRow}"></div>
      </section>
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
  </footer>
  `;
};

export default Profile;
