// 请将 apiBaseUrl 替换为后端在 PythonAnywhere 部署后的 URL
const apiBaseUrl = "https://foodxdemo.pythonanywhere.com/";

async function loadMenu() {
    let response = await fetch(`${apiBaseUrl}/menu`);
    let menu = await response.json();
    document.getElementById("menu").innerHTML = menu.map(item => `
        <div class="item bg-white p-4 rounded-lg shadow-md">
            <img src="${item.img}" alt="${item.name}" class="w-full h-32 object-cover rounded-lg">
            <p class="mt-2">${item.name}</p>
            <button onclick="addToOrder(${item.id})" class="mt-2 bg-green-500 text-white py-1 px-3 rounded-lg w-full">点菜</button>
        </div>
    `).join('');
}

let orderList = [];
function addToOrder(id) {
    orderList.push(id);
    renderOrderList();
}

function renderOrderList() {
    document.getElementById("order-list").innerHTML = orderList.map((id, index) => `
        <li class="flex justify-between p-2 border-b">菜品ID：${id} 
            <button onclick="removeFromOrder(${index})" class="text-red-500">删除</button>
        </li>
    `).join('');
}

function removeFromOrder(index) {
    orderList.splice(index, 1);
    renderOrderList();
}

async function checkout() {
    let email = prompt("请输入您的邮箱：", "your-email@qq.com");
    let response = await fetch(`${apiBaseUrl}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, order: orderList })
    });
    if (response.ok) {
        alert("订单已提交，邮件已发送！");
        orderList = [];
        renderOrderList();
    } else {
        alert("订单提交失败，请重试！");
    }
}

async function addNewItem() {
    let name = document.getElementById("new-name").value;
    let img = document.getElementById("new-img").value;
    if (!name || !img) {
        alert("请输入菜品名称和图片URL！");
        return;
    }
    let response = await fetch(`${apiBaseUrl}/menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, img: img })
    });
    if (response.ok) {
        alert("菜品添加成功！");
        loadMenu();
    } else {
        alert("添加失败！");
    }
}

loadMenu();
