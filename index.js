let todoTabState = "all";

// api
const apiUrl = 'https://todoo.5xcamp.us';

// 頁面
const signUpView = document.querySelector(".signUpView");
const loginView= document.querySelector(".loginView");
const todoListView = document.querySelector(".todoListView");

const pages = [signUpView, loginView, todoListView];

// list 
const todoListItems = document.querySelector('.todoList-items ul')

const todoList = document.querySelector(".todoList");
const noItems = document.querySelector('.noItems');

const todoItems = document.querySelector('.finished span');
// 註冊

const signUpEmail = document.querySelector("#signUpEmail");
const signUpName = document.querySelector("#signUpName");
const signUpPassword = document.querySelector("#signUpPassword");
const signUpConfirmPassword= document.querySelector("#signUpConfirmPassword");
const signUpBtn = document.querySelector("#signUpBtn");
const loginLink = document.querySelector('.loginLink');


// 篩選按鈕




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
const signUpLink = document.querySelector(".signUpLink");
const loginName = document.querySelector(".loginName");
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
    // 存驗證權杖進headers
    axios.defaults.headers.common["Authorization"] = res.headers.authorization;
    Swal.fire({
      icon: 'success',
      title: '公喜母也喜',
      text: res.message,
    });
    init();
    pages.forEach((item) => {
    item.style.display = "none";
    });
    loginName.innerHTML = `${res.data.nickname}`;
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

signUpLink.addEventListener('click', e => { 
  e.preventDefault();
  pages.forEach((item) => {
    item.style.display = "none";
  });
  signUpView.style.display = "block";
})


// todoList



const inputSearch = document.querySelector(".inputSearch");
const addBtn = document.querySelector("#addBtn");



function init(){
  axios.get(`${apiUrl}/todos`)
    .then((res) => {
        let todos;
    if (todoTabState == "all") {
      todos = res.data.todos;
    } else if (todoTabState == "undo") {
      todos = res.data.todos.filter((item) => !item.completed_at);
    } else if (todoTabState == "done") {
      todos = res.data.todos.filter((item) => item.completed_at);
    }
      let str = "";
      todos.forEach((item) => { 
        let check = item.completed_at ===null ? "" : "checked"; 
        str += `
          <li class="form-check" data-id = "${item.id}">
              <label class="form-check-label" for="${item.id}" >
                <input class="form-check-input" type="checkbox" id="${item.id}" ${check}>
              <span>${item.content}</span>  
            </label>
            <button type="button" data-btn="delete"  ><img src="./pics/close.svg" alt="close"></button>
          </li>
        `;
      })
      todoListItems.innerHTML = str;
      countNum();
    })
};

function countNum() { 
  const items = document.querySelectorAll('.todoList-items input');
  console.log(items.length);
  if (!items.length) {
    todoList.style.display = "none";
    noItems.style.display = "block";
    return;
  } else {
    todoList.style.display = "block";
    noItems.style.display = "none";
  }
  let num = 0;
  items.forEach(item => { 
    if (item.getAttribute("checked")===null) { 
      num += 1;
    }
  })
  todoItems.innerHTML = ` ${num}`;
  return;
}

// 加入待辦

addBtn.addEventListener('click', e => { 
  if (inputSearch.value == "") {
      Swal.fire({
      icon: 'error',
      title: 'oh...',
      text: '你啥都沒填是沒事待辦?',
      })
    return;
  }
  axios.post(`${apiUrl}/todos`, {
    "todo": {
      "content": inputSearch.value,
    }
  }).then(() => { 
    console.log('新增成功');
    inputSearch.value = "";
    init();
  
  }).catch(() => { 
      Swal.fire({
      icon: 'error',
      title: '錯誤有錯誤',
      text: '是401錯誤，沒被授權喔!',
      })
  })
})

// 編輯與刪除邏輯

todoListItems.addEventListener('click', e => {
  const id = e.target.closest('li').dataset.id;
  if (e.target.dataset.btn == "delete") { 
    axios.delete(`${apiUrl}/todos/${id}`)
      .then(() => {
        init();
        return;
      });
  };
  // 完成
  if (e.target.nodeName == "INPUT") { 
    axios.patch(`${apiUrl}/todos/${id}/toggle`)
      .then((res) => {
      init();
      Swal.fire({
        icon: "success",
        title: "成功！"
      });
    });
  }
  // console.log(e.target);
  // 編輯
  if (e.target.nodeName == "LI") { 
      Swal.fire({
      icon: "info",
      input: "text",
      inputLabel: '請編輯內容',
      inputValue: '',
      showCancelButton: true,
      inputValidator: (value) => {
          if (!value) {
            return '不能是空的喔!'
          }
        }
      }).then((content) => { 
        console.log(content.value);
        axios.put(`${apiUrl}/todos/${id}`, {
          "todo": {
            content: content.value,
          }
        }).then((res) => { 
          init();
          Swal.fire({
            icon: "success",
            title: "編輯成功！"
          });
        })
      })
  }
})


//切換tab
const todoTab = document.querySelector(".todoList-tab");
todoTab.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.nodeName == "A") {
    const elems = document.querySelectorAll(".todoList-tab a");
    elems.forEach((item) => item.removeAttribute("active"));
    e.target.classList.add("active");
    todoTabState = e.target.dataset.state;
    init();
  }
}); 