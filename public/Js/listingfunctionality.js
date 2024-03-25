let submitbtn = document.querySelector("#categorysubmitbtn");
let divbtn = document.querySelectorAll(".filter-data");

divbtn.forEach((item) => {
    item.addEventListener("click", () => {
        submitbtn.click();
    });
});

let taxSwitch = document.getElementById("flexSwitchCheckReverse");
taxSwitch.addEventListener("click", () => {
    console.log(taxSwitch.checked);
    let taxInfo = document.getElementsByClassName("taxInfo");
    for (const item of taxInfo) {
        item.style.display = taxSwitch.checked ? "inline" : "none";
    }
})