
const exitBtn = document.getElementById("exitBtn");
const sendBtn = document.getElementById("sendBtn");
const configBtn = document.getElementById("configBtn");
const errorDiv = document.getElementById("errorDiv");
const itSelect = document.getElementById("itSupport");
const attachments = [];
// Cargar lista de IT support desde localStorage
function loadITList(){
  let saved = JSON.parse(localStorage.getItem("itSupportList")||'["Juan Perez","Maria Lopez"]');
  itSelect.innerHTML="";
  saved.forEach(name=>{
    let opt = document.createElement("option");
    opt.value=name;
    opt.textContent=name;
    itSelect.appendChild(opt);
  });
}
loadITList();
const savedIcon = localStorage.getItem("iconBase64");

  if (savedIcon) {
    const base64Data = savedIcon.split(",")[1]; // quitar encabezado
    attachments.push({
      filename: "icono.png",
      content: base64Data,
      encoding: "base64",
      cid: "iconoApp"
    });
  }
if (savedIcon) {
  const base64Data = savedIcon.split(",")[1]; // quitamos encabezado
  attachments.push({
    filename: "icono.png",
    content: base64Data,   // 🔹 mandamos como base64 string
    encoding: "base64",    // 🔹 le decimos que está en base64
    cid: "iconoApp"
  });
}

exitBtn.addEventListener("click",()=>window.close());
sendBtn.addEventListener("click", async () => {
  const it = itSelect.value.trim();
  const comentarios = comments.value.trim();

  if (!it) {
    alert("Debes seleccionar un IT Support");
    return;
  }

  const smtpInfo = localStorage.getItem("smtpInfo") || ""; 
  const toEmails = localStorage.getItem("toEmails") || "";

  if (!smtpInfo || !toEmails) { 
    alert("Configura SMTP y correos de destino antes de enviar."); 
    return; 
  }

  // 🔹 Crear array de attachments SOLO aquí
  const attachments = [];
  const savedIcon = localStorage.getItem("iconBase64");
  if (savedIcon) {
    const base64Data = savedIcon.split(",")[1]; // quitar encabezado
    attachments.push({
      filename: "icono.png",
      content: base64Data,
      encoding: "base64",
      cid: "iconoApp"   // el id para <img>
    });
  }

  // Obtener info del PC
  const pc = await electronAPI.getPCInfo();

  const htmlBody = `
    <h2>KanaTransfer Tools 2025</h2>
    <p><b>IT Support:</b> ${it}</p>
    <p><b>Hostname:</b> ${pc.hostname}</p>
    <p><b>Marca:</b> ${pc.marca}</p>
    <p><b>Modelo:</b> ${pc.modelo}</p>
    <p><b>Serie:</b> ${pc.serie}</p>
    <p><b>Usuario:</b> ${pc.usuario}</p>
    <p><b>Dominio:</b> ${pc.dominio}</p>
    <p><b>Comentarios:</b> ${comentarios}</p>
    ${attachments.length ? `  <div style="display:inline-block;background:#fff;padding:15px 20px;
              border-radius:16px;box-shadow:0 4px 10px rgba(0,0,0,0.2);
              text-align:center;">
    <img src="cid:iconoApp" style="max-width:120px;max-height:120px;
              object-fit:contain;display:block;margin:0 auto;"/>
  </div>` : ""}
    <hr>
    <p style="text-align:center;color:gray;font-size:12px;">KanaTransfer Tools 2025</p>
  `;

  try {
    const result = await electronAPI.sendEmail({
      smtp: smtpInfo,
      to: toEmails,
      msg: htmlBody,
      attachments
    });

    if (result.success) {
      alert("Correo enviado correctamente ✅");
      window.close();
    } else {
      alert("Error al enviar correo: " + result.error);
    }

  } catch (err) {
    console.error(err);
    alert("Error inesperado al enviar correo: " + err.message);
  }
});



document.getElementById("configBtn").addEventListener("click", () => {
    window.electronAPI.openConfig();
});

// refrescar la lista cuando la ventana de config se cierra
window.addEventListener("focus", loadITList);

window.addEventListener("DOMContentLoaded", () => {
  const itSupportList = JSON.parse(localStorage.getItem("itSupportList") || "[]");
  itSelect.innerHTML = itSupportList.map(name => `<option value="${name}">${name}</option>`).join("");
});
// Abrir ventana de configuración desde main.js
configBtn.addEventListener("click", ()=> window.electronAPI.openConfig());