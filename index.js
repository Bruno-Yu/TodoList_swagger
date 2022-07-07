

// api
const apiUrl = 'https://todoo.5xcamp.us';

// 頁面
const signUpView = document.querySelector(".signUpView");
const loginView= document.querySelector(".loginView");
const todoListView = document.querySelector(".todoListView");

const pages = [signUpView, loginView, todoListView];

// 註冊

const signUpEmail = document.querySelector("#signUpEmail");
const signUpName = document.querySelector("#signUpName");
const signUpPassword = document.querySelector("#signUpPassword");
const signUpConfirmPassword= document.querySelector("#signUpConfirmPassword");
const signUpBtn = document.querySelector("#signUpBtn");
const loginLink = document.querySelector('.loginLink');

// console.log(signUpEmail, signUpName, signUpPassword, signUpConfirmPassword)
// 註冊
signUpBtn.addEventListener('click', (e) => { 
    e.preventDefault();
  if (signUpEmail.value == "" || signUpPassword.value == "" || signUpName.value == "" || signUpConfirmPassword.value == "") { 
    Swal.fire({
      icon: 'error',
      title: '喔~親愛的...',
      text: '你是不是少填了甚麼!',
    })
    return;
  }
  if (signUpPassword.value != signUpConfirmPassword.value) {
      Swal.fire({
      icon: 'error',
      title: '喔~親愛的...',
      text: '密碼不一樣捏!',
      })
    return;
  }
  axios.post(`${apiUrl}/users`, {
    "user": {
    "email": signUpEmail.value,
    "nickname":  signUpName.value,
    "password": signUpPassword.value
    }
  }).then((res) => { 
      Swal.fire({
      icon: 'success',
      title: res.message,
      text: '恭喜大人恭賀夫人',
      })
    pages.forEach((item) => {
    item.style.display = "none";
    });
  loginView.style.display = "block";
      return;
    })
    .catch((err) => { 
      Swal.fire({
      icon: 'error',
      title: '錯誤大錯誤',
      text: '女士們先生們這明顯有問題',
      })
      return;
    })
})

// 轉登入頁面
loginLink.addEventListener('click', (e) => { 
  e.preventDefault();
  pages.forEach((item) => {
    item.style.display = "none";
  });
  loginView.style.display = "block";

})


// 登入
const loginEmail = document.querySelector("#email");
const loginPassword = document.querySelector("#Password");
const loginBtn = document.querySelector(".loginBtn");
// console.log(loginEmail, loginPassword, loginBtn);

loginBtn.addEventListener('click', e => { 
  e.preventDefault();
  if (loginEmail.value == "" || loginPassword.value == "") { 
    Swal.fire({
      icon: 'error',
      title: '喔~親愛的...',
      text: '你是不是少填了甚麼!',
    })
  }
  axios.post(`${apiUrl}/users/sign_in`, {
      "user": {
    "email": loginEmail.value,
    "password": loginPassword.value,
    }
  }).then((res) => {
    Swal.fire({
      icon: 'success',
      title: '公喜母也喜',
      text: res.message,
    });
    pages.forEach((item) => {
    item.style.display = "none";
  });
  todoListView.style.display = "block";

  }).catch((err) => { 
      Swal.fire({
      icon: 'error',
      title: '錯誤大錯誤',
      text: err.error,
      })
    return;
  })
})
