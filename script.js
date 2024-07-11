let darkModeBtn = document.querySelector(".darkModeBtn");
let lightModeBtn = document.querySelector(".lightModeBtn");
// let navUsername = document.getElementById("nav-uername");
// let form = document.getElementById("form");
// let nav = document.getElementById("nav");
// let postsCount = document.getElementById("posts-count");
// let commentsCount = document.getElementById("comments-count");
// let navLinks = document.querySelectorAll(".nav-link");
// let cards = document.querySelectorAll(".card");
const body = document.body;
let popup = document.getElementById("popup-menu");
let authSystem = document.getElementById("auth-system");

// dark-mode========================
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("darkModeBtn");
  document.getElementById("lightModeBtn");
  document.body;

  // Check if dark mode is enabled in localStorage
  if (localStorage.getItem("nightMode") === "enabled") {
    body.classList.add("night-mode");
    darkModeBtn.style.display = "none";
    lightModeBtn.style.display = "block";
  }

  darkModeBtn.addEventListener("click", function () {
    body.classList.add("night-mode");
    localStorage.setItem("nightMode", "enabled");
    darkModeBtn.style.display = "none";
    lightModeBtn.style.display = "block";
  });

  if (localStorage.getItem("nightMode") === "disabled") {
    body.classList.remove("night-mode");
    darkModeBtn.style.display = "block";
    lightModeBtn.style.display = "none";
  }

  lightModeBtn.addEventListener("click", function () {
    body.classList.remove("night-mode");
    localStorage.setItem("nightMode", "disabled");
    darkModeBtn.style.display = "block";
    lightModeBtn.style.display = "none";
  });
});
// dark-mode======================///////
// infinite scroll======================================
const baseUrl = "https://tarmeezacademy.com/api/v1";
let currentPage = 1;
let lastPage = 1;

window.addEventListener("scroll", function () {
  const endOfPage =
    this.window.innerHeight + this.window.pageYOffset >=
    document.body.scrollHeight;
  if (endOfPage && currentPage < lastPage) {
    currentPage = currentPage + 1;
    getPosts(false, currentPage);
  }
});
// infinite scroll=====================================///
// get-posts====================
function getPosts(reload = true, page = 1) {
  toggleLoader(true);
  axios
    .get(`https://tarmeezacademy.com/api/v1/posts?limit=2&page=${page}`)
    .then((response) => {
      toggleLoader(false);
      const posts = response.data.data;
      lastPage = response.data.meta.last_page;
      if (reload) {
        document.getElementById("posts").innerHTML = " ";
      }

      for (post of posts) {
        let user = getCurrentUser();
        let isMyPost = user != null && post.author.id == user.id;
        let editBtnContent = ``;

        if (isMyPost) {
          editBtnContent = `
          <button
              id="edit-btn"
              type="button"
              class="btn btn-danger"
              style="float:right;margin-left:5px"
              onclick="deleteBtnCliked('${encodeURIComponent(
                JSON.stringify(post)
              )}')"
            >
              delete
          </button>
          
          <button
              id="edit-btn"
              type="button"
              class="btn btn-secondary"
              style="float:right"
              onclick="editBtnCliked('${encodeURIComponent(
                JSON.stringify(post)
              )}')"
                >
                  edit
          </button>
      
              
      
      `;
        }
        let content = `
                  <div class="card shadow">
                    <div class="card-header">
                     <span onclick="userClicked(${post.author.id})" style="cursor:pointer;">
                          <img
                          class="rounded-circle border border-3 profile-imgae"
                          src="${post.author.profile_image}"
                          alt=""
                          style="width: 40px; height: 40px"
                          />
                          <b id="username">${post.author.username}</b>
                     </span>
                      ${editBtnContent}
                      
                    </div>
                    <div class="card-body" style="cursor: pointer;"onclick="postClicked(${post.id})">
                      <h5 class="card-title">
                      <h5>${post.title}</h5>
                      <p class="card-text">
                        ${post.body}
                      </p>
                        <img
                          class="w-100 post-img"
                          src="${post.image}"
                          alt=""
                        />
                      </h5>
                      <h6 class="text-secondary ">${post.created_at}</h6>
                      <hr />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-pen"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"
                        />
                      </svg>
                      <span class="comments"> (${post.comments_count}) comments 
                      
                      </span>
                    </div>
                  </div>
                  `;
        document.getElementById("posts").innerHTML += content;
      }
    });
}
getPosts();
// get-posts===================//////

// click on the name=====================
function userClicked(userId) {
  window.location = `profile.html?userid=${userId}`;
}
// click on the name=====================///////////
// edit-btn==================
function editBtnCliked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  console.log(post);

  document.getElementById("btn-submit").innerHTML = "Edit";
  document.getElementById("post-id-input").value = post.id;
  document.getElementById("post-title-input").value = post.title;
  document.getElementById("post-body-input").value = post.body;
  document.getElementById("staticBackdropLabel").innerHTML = "Edit Post";
  let postModal = new bootstrap.Modal(
    document.getElementById("staticBackdrop"),
    {}
  );
  postModal.toggle();
}
// edit-btn==================//////////
// delete-btn==================
function deleteBtnCliked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  console.log(post);
  document.getElementById("delete-id-input").value = post.id;
  let postModal = new bootstrap.Modal(
    document.getElementById("delete-post"),
    {}
  );
  postModal.toggle();
}

function confirmDelete() {
  const token = localStorage.getItem("token");
  const postId = document.getElementById("delete-id-input").value;
  const url = `https://tarmeezacademy.com/api/v1/posts/${postId}`;
  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };
  axios
    .delete(url, {
      headers: headers,
    })
    .then((response) => {
      console.log(response);
      getPosts();
      getProfilePosts();
    });
}
// delete-btn==================//////////
// post-btn==================

function addBtnClicked() {
  document.getElementById("btn-submit").innerHTML = "Create";
  document.getElementById("post-id-input").value = "";
  document.getElementById("post-title-input").value = "";
  document.getElementById("post-body-input").value = "";
  document.getElementById("staticBackdropLabel").innerHTML =
    "Create A New Post";
  let postModal = new bootstrap.Modal(
    document.getElementById("staticBackdrop"),
    {}
  );
  postModal.toggle();
}
// post-btn==================///////////////
// login======================================
function loginBtnClicked() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const params = {
    username: username,
    password: password,
  };

  const url = "https://tarmeezacademy.com/api/v1/login";
  axios
    .post(url, params)
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      showPopup("Logged in", "You details has been successfully.");
      setupUI();
    })
    .catch((error) => {
      document.getElementById("error-massege").innerHTML =
        error.response.data.message;
    });
}
// login======================================/////

// register=====================================
function registerBtnClicked() {
  const username = document.getElementById("register-username").value;
  const name = document.getElementById("register-name").value;
  const password = document.getElementById("register-password").value;
  const image = document.getElementById("register-profile-image").files[0];

  const formData = new FormData();
  formData.append("username", username);
  formData.append("name", name);
  formData.append("password", password);
  formData.append("image", image);

  const headers = {
    "content-type": "multipart/form-data",
  };
  const url = "https://tarmeezacademy.com/api/v1/register";
  axios
    .post(url, formData, {
      headers: headers,
    })
    .then((response) => {
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      showPopup("Thank you", "New user registered successfully. Thanks!");
      setupUI();
    })
    .catch((error) => {
      document.getElementById("error-massege").innerHTML =
        error.response.data.message;
    });
}
// register=====================================////

// creat-post
function postBtnClicked() {
  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == "";

  const title = document.getElementById("post-title-input").value;
  const body = document.getElementById("post-body-input").value;
  const image = document.getElementById("post-image-input").files[0];
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("body", body);
  formData.append("title", title);
  formData.append("image", image);

  let url = "";
  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };

  if (isCreate) {
    url = "https://tarmeezacademy.com/api/v1/posts";
  } else {
    formData.append("_method", "put");
    url = `https://tarmeezacademy.com/api/v1/posts/${postId}`;
  }
  axios
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response);
      getPosts();
      getProfilePosts();
    })
    .catch((error) => {
      document.getElementById("error-massege").innerHTML =
        error.response.data.message;
    });
}
// creat-post====================================//

// setupUi
function setupUI() {
  const token = localStorage.getItem("token");
  const loginDiv = document.getElementById("login-div");
  const logoutDiv = document.getElementById("logout-div");
  const postBtn = document.getElementById("post-btn");
  const inputDiv = document.getElementById("add-comment-div");

  if (token == null) {
    if (postBtn != null) {
      postBtn.style.setProperty("display", "none", "important");
    }
    logoutDiv.style.setProperty("display", "none", "important");
    loginDiv.style.setProperty("display", "flex", "important");
    inputDiv.style.setProperty("display", "none", "important");
  } else {
    if (postBtn != null) {
      postBtn.style.setProperty("display", "block", "important");
    }
    loginDiv.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "flex", "important");
    // inputDiv.style.setProperty("display", "block", "important");

    const user = getCurrentUser();
    document.getElementById("nav-username").innerHTML = user.username;
    document.getElementById("nav-profile-image").src = user.profile_image;
  }
}
setupUI();
// setupUi====================//////////////

// getuser
function getCurrentUser() {
  let user = null;
  let storageUser = localStorage.getItem("user");

  if (storageUser !== null) {
    user = JSON.parse(storageUser);
    return user;
  }
}
// getuser=================================///////

// logout========================
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUI();
}
// logout========================//////////

// popup-menu======================
function showPopup(title, massege) {
  document.getElementById("popup-massege").innerHTML = massege;
  document.getElementById("title-popup").innerHTML = title;
  popup.classList.add("open-popup");
  authSystem.classList.add("blur");
}
function closePopup() {
  popup.classList.remove("open-popup");
}
// popup-menu======================//////////

// postdetails==============================
function postClicked(postId) {
  window.location = `post.html?postId=${postId}`;
}
// postdetails==============================//////////////

// post.html========================
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("postId");
console.log(id);
// post.html========================/////
// getpost===================
function getPost() {
  axios
    .get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
    .then((response) => {
      console.log(response.data.data);
      const post = response.data.data;
      const comments = post.comments;
      const author = post.author;

      document.getElementById("username-span").innerHTML = author.name;

      let commentsContent = ``;
      for (comment of comments) {
        commentsContent += `
        <div class="px-4 py-2">
          <div>
              <img src="${comment.author.profile_image}" alt="" style="width: 40px; height:40px;" class="rounded-5">
              <b>@${comment.author.username}</b>
          </div>
          <p>${comment.body}</p>
          <hr>
          </div>`;
      }
      const postContent = `
      <div class="card shadow py-3">
        <div class="card-header">
          <img
            class="rounded-circle border border-3 profile-imgae"
            src="${author.profile_image}"
            alt=""
            style="width: 40px; height: 40px"
          />
          <b >@${author.username}</b>
        </div>
        <div class="card-body">
          <h5 class="card-title">
          <p >
            ${post.body}
          </p>
            <img
              class="w-100 post-img"
              src="${post.image} "
              alt=""
            />
          </h5>
          <h6 class="text-secondary created">${post.created_at}</h6>
          <hr />
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-pen"
              viewBox="0 0 16 16"
            >
              <path
                d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"
              />
            </svg>
            <span class="comments"> (${post.comments_count}) comments </span>
          </div>
      </div>
      <div id="comments">
       ${commentsContent}
      </div>
      <div class="input-group " id="add-comment-div">
          <input type="text" id="comment-input" class="form-control" placeholder="add your comment here.." aria-label="Recipient's username" aria-describedby="basic-addon2">
          <span class="btn btn-outline-primary" id="basic-addon2" onclick="createCommentClicked()">Send</span>
      </div>
    </div>`;

      document.getElementById("post").innerHTML = postContent;
    });
}
getPost();
// getpost===================/////

// comment function=====================
function createCommentClicked() {
  let commentBody = document.getElementById("comment-input").value;
  let params = {
    body: commentBody,
  };
  let token = localStorage.getItem("token");
  let url = `https://tarmeezacademy.com/api/v1/posts/${id}/comments`;

  axios
    .post(url, params, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      getPost();
    });
}
// comment function=====================///////

// eye-icon========================================
function eyeIcon() {
  const password = document.querySelector(".password");

  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);

  this.textContent = type === "password" ? "" : "";
}
// eye-icon========================================//////////
function getCurrentUserId() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("userid");
  return id;
}
// user-posts=====================
function getUser() {
  const id = getCurrentUserId();
  axios
    .get(`https://tarmeezacademy.com/api/v1/users/${id}`)
    .then((response) => {
      console.log(response.data.data);
      const user = response.data.data;
      document.getElementById("main-info-email").innerHTML = user.email;
      document.getElementById("main-info-name").innerHTML = user.name;
      document.getElementById("main-info-username").innerHTML = user.username;
      document.getElementById("main-info-profile").src = user.profile_image;
      document.getElementById("name-posts").innerHTML = `${user.username}'s`;
      // posts & comments count
      document.getElementById("posts-count").innerHTML = user.posts_count;
      document.getElementById("comments-count").innerHTML = user.comments_count;
      // username-title
      document.getElementById("username-title").innerHTML = user.username;
    });
}
getUser();
// user-posts=====================//////////////////
// gerprofileposts=====================
function getProfilePosts() {
  const id = getCurrentUserId();
  axios
    .get(`https://tarmeezacademy.com/api/v1/users/${id}/posts`)
    .then((response) => {
      const posts = response.data.data;
      document.getElementById("user-posts").innerHTML = "";
      for (post of posts) {
        // show or hide (edit) button
        let user = getCurrentUser();
        let isMyPost = user != null && post.author.id == user.id;
        let editBtnContent = ``;

        if (isMyPost) {
          editBtnContent = `
          <button
              id="edit-btn"
              type="button"
              class="btn btn-danger"
              style="float:right;margin-left:5px"
              onclick="deleteBtnCliked('${encodeURIComponent(
                JSON.stringify(post)
              )}')"
            >
              delete
          </button>

          <button
              id="edit-btn"
              type="button"
              class="btn btn-secondary"
              style="float:right"
              onclick="editBtnCliked('${encodeURIComponent(
                JSON.stringify(post)
              )}')"
                >
                  edit
          </button>
      `;
        }
        let content = `
                  <div class="card shadow"  >
                    <div class="card-header">
                      <img
                        class="rounded-circle border border-3 profile-imgae"
                        src="${post.author.profile_image}"
                        alt=""
                        style="width: 40px; height: 40px"
                      />
                      <b id="username">${post.author.username}</b>
                      ${editBtnContent}

                    </div>
                    <div class="card-body" style="cursor: pointer;"onclick="postClicked(${post.id})">
                      <h5 class="card-title">
                      <h5>${post.title}</h5>
                      <p class="card-text">
                        ${post.body}
                      </p>
                        <img
                          class="w-100 post-img"
                          src="${post.image}"
                          alt=""
                        />
                      </h5>
                      <h6 class="text-secondary ">${post.created_at}</h6>
                      <hr />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-pen"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"
                        />
                      </svg>
                      <span class="comments"> (${post.comments_count}) comments

                      </span>
                    </div>
                  </div>
                  `;
        document.getElementById("user-posts").innerHTML += content;
      }
    });
}
getProfilePosts();
// gerprofileposts=====================////////////
// profileClicked==================
function profileClicked() {
  const user = getCurrentUser();
  const userId = user.id;
  window.location = `profile.html?userid=${userId}`;
}
// profileClicked==================////////////////
// loader======================
function toggleLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}
// loader======================///////////////
