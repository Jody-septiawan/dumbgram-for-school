let userData = null;

async function login(e) {
  e.preventDefault();
  let email = document.getElementById("login-email").value;
  let password = document.getElementById("login-password").value;
  let alertLogin = document.getElementById("alert-login");
  let btnClose = document.getElementById("btn-close-login-modal");

  alertLogin.innerHTML = "";

  let data = { email, password };

  const { error } = await kontenbaseClient.auth.login(data);

  if (error) {
    return (alertLogin.innerHTML = `<div class="alert alert-danger py-1" role="alert">
        ${error.message}
        </div>`);
  }

  btnClose.click();
  getUser();
}

async function register(e) {
  e.preventDefault();
  let email = document.getElementById("register-email").value;
  let firstName = document.getElementById("register-name").value;
  let username = document.getElementById("register-username").value;
  let password = document.getElementById("register-password").value;
  let alertLogin = document.getElementById("alert-register");

  let btnClose = document.getElementById("btn-close-register-modal");

  alertLogin.innerHTML = "";

  let data = {
    email,
    password,
    firstName,
    username,
  };

  const { error } = await kontenbaseClient.auth.register(data);

  if (error) {
    return (alertLogin.innerHTML = `<div class="alert alert-danger py-1" role="alert">
          ${error.message}
          </div>`);
  }

  btnClose.click();
  getUser();
}

async function getUser() {
  let leftSection = document.getElementById("left-side");
  let createPost = document.getElementById("create-post");
  let commentInputContainer = document.getElementById(
    "input-comment-container"
  );

  const defaultElement = `<div>
    <div
      style="font-weight: 600; font-size: 32px"
      class="text-white mb-4"
    >
      Share your best photos or videos
    </div>
    <div
      style="font-size: 18px; font-weight: 400; color: #6a6a6a"
      class="mb-4"
    >
      Join now, share your creations with another people and enjoy
      other creations.
    </div>
    <div class="gap-2 d-flex mt-5">
      <button
        type="button"
        style="
          background: linear-gradient(
            90deg,
            #4dd4f7 0%,
            #9090fb 36.46%,
            #ff6b81 71.35%,
            #fbdf63 100%
          );
          border-radius: 5px;
          border: none;
          font-size: 14px;
          font-weight: 500;
        "
        class="text-white py-2 px-5"
        data-bs-toggle="modal"
        data-bs-target="#loginModal"
      >
        Login
      </button>
      <button
        type="button"
        style="
          border-radius: 5px;
          border: none;
          font-size: 14px;
          font-weight: 500;
          background-color: transparent;
        "
        class="text-white py-2 px-5"
        data-bs-toggle="modal"
        data-bs-target="#RegisterModal"
      >
        Register
      </button>
    </div>
  </div>`;

  commentInputContainer.innerHTML = `
  <input id="input-feed-id" hidden />
  <input
    type="text"
    style="width: 100%; border: none; background-color: #4b4b4b"
    class="rounded px-2 py-1 text-white"
    placeholder="Comment"
    id="input-comment"
    onkeyup="handleCreateComment(event)"
  />`;

  if (localStorage.getItem("token")) {
    const { user, error } = await kontenbaseClient.auth.user();

    if (error) {
      leftSection.innerHTML = defaultElement;
      return console.error(error.message);
    }

    userData = user;

    leftSection.innerHTML = `<div class="text-center">
          ${
            user.image
              ? `<img
          src=${user.image[0].url}
          alt=""
          style="width: 130px; height: 130px"
          class="rounded-circle border border-5 border-rainbow"
        />`
              : `<div style="width: 130px; height: 130px; font-size: 40px; font-weight: 700"
              class="rounded-circle border border-5 mx-auto text-white d-flex justify-content-center align-items-center bg-secondary">
              ${user.firstName.split(" ")[0][0]}${
                  user.firstName.split(" ")[1][0]
                }
              </div>`
          }
        <div class="text-center text-white mt-3" style="font-weight: 700">
          ${user.firstName}
        </div>
        <div class="text-center text-white mt-1" style="font-size: 11px">
        ${user.username ? `@${user.username}` : "-"}
        </div>
        <div
          class="mt-5 d-flex gap-2 align-items-center text-secondary border-top border-bottom border-secondary py-2 cursor-pointer"
          style="font-size: 15px"
          onclick="logout()"
        >
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
          <span>Logout</span>
        </div>
      </div>`;

    createPost.innerHTML = `<button
      type="button"
      class="rounded text-white py-1 px-3 bg-rainbow"
      style="border: none; background-color: #2e2e2e"
      data-bs-toggle="modal"
      data-bs-target="#CreatePostModal"
    >
      Create Post
    </button>`;
  } else {
    leftSection.innerHTML = defaultElement;
    createPost.innerHTML = "";
    commentInputContainer.innerHTML = "";
  }
}

getUser();

async function logout() {
  const { user, error } = await kontenbaseClient.auth.logout();

  if (error) {
    return console.error(error.message);
  }

  getUser();
}
