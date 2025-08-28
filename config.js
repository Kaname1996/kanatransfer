const smtpInput = document.getElementById("smtpInput");
const toInput = document.getElementById("toInput");
const itInput = document.getElementById("itInput");
const saveBtn = document.getElementById("saveBtn");
const exitBtn = document.getElementById("exitBtn");
const iconInput = document.getElementById('iconInput');
const previewIcon = document.getElementById('previewIcon');
const savedIcon = localStorage.getItem("iconBase64");
if (savedIcon) {
  previewIcon.src = savedIcon;
}
// Cargar valores previos
smtpInput.value = localStorage.getItem("smtpInfo")||"";
toInput.value = localStorage.getItem("toEmails")||"";
itInput.value = (JSON.parse(localStorage.getItem("itSupportList")||"[]")).join(",");


iconInput.addEventListener('change', function() {
  const file = this.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = function(e){
      previewIcon.src = e.target.result; // preview en base64
    }
    reader.readAsDataURL(file);
  }
});

saveBtn.addEventListener("click",()=>{
  if (previewIcon.src && previewIcon.src.startsWith("data:image")) {
    localStorage.setItem("iconBase64", previewIcon.src);
  }
  localStorage.setItem("smtpInfo",smtpInput.value.trim());
  localStorage.setItem("toEmails",toInput.value.trim());
  const names = itInput.value.split(",").map(n=>n.trim()).filter(n=>n);
  localStorage.setItem("itSupportList", JSON.stringify(names));
  alert("Configuración guardada!");
  window.close();
});

exitBtn.addEventListener("click",()=>window.close());
