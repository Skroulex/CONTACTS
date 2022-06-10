const API = "http://localhost:8000/contacts";
let inpAddName = document.getElementById("inp-add-name");
let inpAddSurname = document.getElementById('inp-add-surname');
let inpAddTel = document.getElementById('inp-add-tel')
let btnAdd = document.getElementById("btn-add");
// console.log(inpAddName, btnAdd);
btnAdd.addEventListener("click", async function () {
    let newTodo = {
        name: inpAddName.value,
        surname: inpAddSurname.value,
        phone: inpAddTel.value,
    };
    console.log(newTodo);
    if (inpAddName.value.trim() === "") {
        alert("Enter name");
        return;
    }
    if (inpAddSurname.value.trim() === "") {
        alert("Enter surname");
        return;
    }
    if (inpAddTel.value.trim() === "") {
        alert("Enter phone number");
        return;
    }
    await fetch(API, {
        method: "POST",
        body: JSON.stringify(newTodo),
        headers: {
            "Content-type": "application/json; charset=utf-8",
        },
    });
    getTodos();
    inpAddName.value = "";
});
let pagination = document.getElementById("pagination");
let page = 1;

let list = document.getElementById("list");

let inpSearch = document.getElementById("inp-search");
inpSearch.addEventListener("input", function () {
    getTodos();
});

async function getTodos() {
    let response = await fetch(
        `${API}?q=${inpSearch.value}&_page=${inpSearch.value}${page}&_limit=3`
)
.then(res => res.json())
        .catch(err => console.log(err));

    let allTodos = await fetch(API)
        .then(res => res.json())
        .catch(err => console.log("Error"));
    let lastPage = Math.ceil(allTodos.length / 2);

    // console.log(lastPage);
    list.innerHTML = "";
    // console.log(response);
    response.forEach(item => {
        let newElem = document.createElement("div");

        newElem.id = item.id;
        newElem.innerHTML = `<span>${item.name}</span> <span>${item.surname}</span> <span>${item.phone}</span><button class='btn-delete'>Delete</button>
    <button class="btn-edit">Edit</button>`;
        list.append(newElem);
    });
    pagination.innerHTML = `<button ${
        page === 1 ? "disabled" : ""
    } id='btn-prev'>prev</button> <span>${page}</span><button ${
        page === lastPage ? "disabled" : ""
    } id='btn-next'>next</button>`;
}
getTodos();
document.addEventListener("click", async function (e) {
    if (e.target.className === "btn-delete") {
        let id = e.target.parentNode.id;
        await fetch(`${API}/${id}`, {
            method: "DELETE",
        });
        getTodos();
    }
    if (e.target.className === "btn-edit") {
        modalEdit.style.display = "flex";
        let id = e.target.parentNode.id;
        let response = await fetch(`${API}/${id}`)
            .then(res => res.json())
            .catch(err => console.log(err));
        inpEditName.value = response.name;
        inpEditSurname.value = response.surname;
        inpEditTel.value = response.phone;
        inpEditId.value = response.id;
    }

    if (e.target.id === "btn-next") {
        page++;
        getTodos();
    }

    if (e.target.id === "btn-prev") {
        page--;
        getTodos();
    }
});

// ! UPDATE
let modalEdit = document.getElementById("modal-edit");
let modalEditClose = document.getElementById("modal-edit-close");
let inpEditName = document.getElementById("inp-edit-name");
let inpEditSurname = document.getElementById('inp-edit-surname');
let inpEditTel = document.getElementById('inp-edit-tel');
let inpEditId = document.getElementById("inp-edit-id");
let btnSaveEdit = document.getElementById("btn-save-edit");

modalEditClose.addEventListener("click", function () {
    modalEdit.style.display = "none";
});
btnSaveEdit.addEventListener("click", async function () {
    let editedTodo = {
        name: inpEditName.value,
        surname: inpEditSurname.value,
        phone : inpEditTel.value,
    };
    let id = inpEditId.value;
    await fetch(`${API}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(editedTodo),
        headers: {
            "Content-type": "application/json; charset=utf-8",
        },
    });
    modalEdit.style.display = "none";
    getTodos();
});
