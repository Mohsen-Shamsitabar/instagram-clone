import type { Page, Data } from "types";
import { onPageMount } from "utils";
import classes from "./CreatePost.module.css";

const CreatePost: Page<Data> = context => {
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

    const logedUser = findUser(logedUserId);
    if (!logedUser) return;

    const history = context.history;

    let imageCount = 1;

    //============Main============//

    const userInfoText = document.querySelector(`#${classes.userInfoText}`);
    if (!userInfoText) return;
    userInfoText.textContent = `Loged as ${logedUser.username} with id: ${logedUserId}.`;

    const imageCountText = document.querySelector(`#${classes.imgCount}`);
    if (!imageCountText) return;

    const increaseBtn = document.querySelector<HTMLButtonElement>(
      `.${classes.imgCountIncreaseBtn}`
    );
    if (!increaseBtn) return;

    const decreaseBtn = document.querySelector<HTMLButtonElement>(
      `.${classes.imgCountDecreaseBtn}`
    );
    if (!decreaseBtn) return;

    const captionInput = document.querySelector<HTMLInputElement>(
      `#${classes.captionInput}`
    );
    if (!captionInput) return;

    const confirmBtn = document.querySelector<HTMLButtonElement>(
      `.${classes.finishBtnCreate}`
    );
    if (!confirmBtn) return;

    //============Navigator============//

    const imageNav = document.querySelector(`#${classes.postImagesNav}`);
    if (!imageNav) return;

    //======Functions======//

    increaseBtn.addEventListener("click", () => {
      imageCount++;
      imageCountText.textContent = `Image count : ${imageCount}`;
      renderImageNav();
    });

    decreaseBtn.addEventListener("click", () => {
      if (imageCount === 1) return;
      imageCount--;
      imageCountText.textContent = `Image count : ${imageCount}`;
      renderImageNav();
    });

    const createImageArticle = () => {
      const imageArticle = document.createElement("article");
      imageArticle.className = `${classes.imageArticle}`;

      const imageUrlContainer = document.createElement("div");
      imageUrlContainer.className = `${classes.imageUrlContainer}`;

      const text = document.createElement("span");
      text.textContent = "URL :";
      imageUrlContainer.appendChild(text);

      const urlInput = document.createElement("input");
      urlInput.name = "imageUrl";
      urlInput.className = `${classes.imageUrlInput}`;
      urlInput.type = "text";
      urlInput.placeholder = "Image URL";
      imageUrlContainer.appendChild(urlInput);

      const imageContainer = document.createElement("div");
      imageContainer.className = `${classes.imageContainer}`;

      const imagePreview = document.createElement("img");
      imagePreview.className = `${classes.imagePreview}`;
      imageContainer.appendChild(imagePreview);

      imageArticle.appendChild(imageUrlContainer);
      imageArticle.appendChild(imageContainer);

      //======Functions======//

      urlInput.addEventListener("input", () => {
        imagePreview.src = urlInput.value;
      });

      return imageArticle;
    };

    const renderImageNav = () => {
      imageNav.innerHTML = "";
      const fragment = document.createDocumentFragment();

      for (let i = 0; i < imageCount; i++) {
        fragment.appendChild(createImageArticle());
      }

      imageNav.appendChild(fragment);
    };

    confirmBtn.addEventListener("click", () => {
      // articles[0].firstElementChild?.children.namedItem("imageUrl")
      const articles = Array.from(imageNav.children);
      const images = [] as string[];
      const caption = captionInput.value;

      articles.forEach(article => {
        const input = article.firstElementChild?.children.namedItem(
          "imageUrl"
        ) as HTMLInputElement;

        if (input.value.trim() !== "") images.push(input.value.trim());
      });

      let id = Number(data.uniqueId);

      const newPost = {
        id: `post${id}`,
        caption: caption,
        author: logedUserId,
        likedBy: [],
        comments: [],
        images: images
      };
      logedUser.posts.push(`post${id}`);

      id++;
      data.uniqueId = `${id}`;

      data.posts.push(newPost);

      history.push(`/user/${logedUserId}/profile/${logedUserId}`);
    });

    renderImageNav();
  });
  return `
  <main id="${classes.createPostContainer}">
    <div id="${classes.userInfoContainer}">
      <p>Creating a Post (width&heigth = 500px) :</p>
      <p id="${classes.userInfoText}">Loged as Mohsen_Shamsitabar with id:user1.</p>
    </div>

    <div id="${classes.imgCountContainer}">
      <span id="${classes.imgCount}">Image count : 1</span>
      
      <div id="${classes.imgCountBtnContainer}">
        <button class="${classes.imgCountBtn} ${classes.imgCountIncreaseBtn}">+</button>
        <button class="${classes.imgCountBtn} ${classes.imgCountDecreaseBtn}">-</button>
      </div>
    </div>

    <div id="${classes.postCaptionContainer}">
      <span>Post Caption :</span>

      <input id="${classes.captionInput}" type="text" placeholder="Post Caption" />
    </div>

    <nav id="${classes.postImagesNav}"></nav>

    <div id="${classes.finishBtnContainer}">
      <button class="${classes.finishBtn} ${classes.finishBtnCreate}">Create</button>
    </div>
  </main>
  `;
};

export default CreatePost;
