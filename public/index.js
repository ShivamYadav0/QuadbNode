let timer = document.querySelector("#timer");
let timerEl = 59;
let themelocal = window.localStorage.getItem("theme");

if (themelocal == "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
} else if (themelocal == "light") {
  document.documentElement.setAttribute("data-theme", "light");
}
setInterval(() => {
  timer.textContent = timerEl;
  timerEl--;
  if (timerEl == -1) {
    window.location.reload();
    timerEl = 59;
  }
}, 1000);
let theme = document.querySelector(".theme");
let themeEl = 1;
theme.onclick = function () {
  //console.log(this.children)
  if (themeEl == 0) {
    this.style.backgroundColor = "gray";
    this.children[0].style.backgroundColor = "#5dc7c2";
    this.children[0].style.transform = "translateX(0%)";
    window.localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    this.style.backgroundColor = "white";
    this.children[0].style.backgroundColor = "orange";
    window.localStorage.setItem("theme", "light");
    document.documentElement.setAttribute("data-theme", "light");
    this.children[0].style.transform = "translateX(-125%)";
  }
  themeEl = !themeEl;
};
async function getData() {
  let data = [];
  data = await fetch("/api/top-10-tickers-from-db")
    .then((res) => res.json())
    .then((res) => (data = res));

  //console.log(data);
  let mx = 0,
    rdata;
  for (let i = 0; i < data.length; i++) {
    let dataEl = document.createElement("tr");
    let dif = data[i].sell - data[i].buy >= 0;
    let icd = !dif ? "▼" : " ▲";
    if (dif) {
      if ((data[i].sell - data[i].buy) / data[i].buy > mx) {
        mx = (data[i].sell - data[i].buy) / data[i].buy;
        rdata = data[i];
      }
    }
    dataEl.innerHTML = `
    <td>${i + 1}</td>
    <td>${icd} ${data[i].base_unit}</td>
    <td>${data[i].name}</td>
    <td>${data[i].last}</td>
    <td>${data[i].sell}/${data[i].buy}
    <td>${data[i].volume}</td>
    `;
    let tableEl = document.getElementById("table");
    tableEl.appendChild(dataEl);
    for (let j = 0; j < dataEl.children.length; j++) {
      if (themeEl) {
        dataEl.children[j].classList.add("addpluscolor");
      } else {
        dataEl.children[j].classList.add("addminuscolor");
      }
      // console.log(dataEl.children[j]);
    }
  }
  let top = document.createElement("div");
  top.classList.add("text-color-plus");
  top.innerHTML = `
 <p>${rdata.base_unit}<br/><span class="top-font">Base Unit</span></p>
 <p>${rdata.name}<br/><span class="top-font">Name</span></p>
  `;
  let top1 = document.createElement("div");
  top1.classList.add("share-price");
  top1.innerHTML = `
 <p>${Number.parseFloat(mx * 100).toFixed(
   4
 )}%<br/><span class="top-font">Profit%</span></p>
  `;
  let top2 = document.createElement("div");
  top2.classList.add("text-color-plus");
  top2.innerHTML = `
 <p>${rdata.last}<br/><span class="top-font">Last</span></p>
  
  <p>${rdata.volume}<br/><span class="top-font">Volume</span></p>
  `;
  let row3 = document.querySelector(".row-3");
  row3.appendChild(top);
  row3.appendChild(top1);
  row3.appendChild(top2);
  document.querySelectorAll(".load").forEach((element) => {
    element.style.visibility = "visible";
  });

  document.querySelector(".loader").style.display = "none";
  // ▼ ▲
}
getData();
