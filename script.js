import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Tu configuración de Firebase (Proyecto 6670d)
const firebaseConfig = {
    apiKey: "AIzaSyCkAcHwBpErUHMpO_9Afd8C-ogHpkZM6Ms",
    authDomain: "timeline-6670d.firebaseapp.com",
    projectId: "timeline-6670d",
    storageBucket: "timeline-6670d.firebasestorage.app",
    messagingSenderId: "853781068627",
    appId: "1:853781068627:web:b380b185def08309bbbfa6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let clickCount = 0;
let isAdmin = false;
let fotoOptimizada = ""; 

// Función para cargar la línea de tiempo
function loadTimeline() {
    const q = query(collection(db, "posts"), orderBy("timestamp", "asc"));
    onSnapshot(q, (snapshot) => {
        const container = document.getElementById('timeline-container');
        
        // 1. Limpiamos y ponemos la BIENVENIDA FIJA
        container.innerHTML = `
            <article class="post" style="border: 1px dashed #ff79c6; opacity: 0.8;">
                <div class="meta">SANTIAGO - INICIO</div>
                <div class="msg">Hola Rafa. Está es nuestra recopilación del finde. Cada foto dice como me sentí en ese momento incluyendo horas y fechas. ❤️</div>
            </article>`;

        // 2. Cargamos los recuerdos de Firebase
        snapshot.forEach((postDoc) => {
            const data = postDoc.data();
            const fecha = data.timestamp ? data.timestamp.toDate() : new Date();
            const hora12 = fecha.toLocaleTimeString('es-ES', { hour: 'numeric', minute: 'numeric', hour12: true });
            const fechaStr = fecha.toLocaleDateString('es-ES');

            const postHTML = `
                <article class="post">
                    <div class="meta">${fechaStr} - ${hora12}</div>
                    <div class="msg">${data.mensaje}</div>
                    ${data.imgUrl ? `<img src="${data.imgUrl}" style="width:100%; border-radius:10px; margin-top:10px;">` : ''}
                    ${isAdmin ? `<button class="delete-btn" style="margin-top:10px; background:#ff5555; color:white; border:none; padding:5px 10px; border-radius:10px; cursor:pointer;" onclick="borrarPost('${postDoc.id}')">Eliminar</button>` : ''}
                </article>`;
            container.insertAdjacentHTML('beforeend', postHTML);
        });

        // Autoscroll al último mensaje
        window.scrollTo(0, document.body.scrollHeight);
    });
}

// Procesar foto antes de subir
window.previsualizarFoto = function(input) {
    const preview = document.getElementById('preview-container');
    const label = document.getElementById('label-archivo');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxDim = 500; 
                let w = img.width, h = img.height;
                if (w > h) { if (w > maxDim) { h *= maxDim / w; w = maxDim; } }
                else { if (h > maxDim) { w *= maxDim / h; h = maxDim; } }
                canvas.width = w; canvas.height = h;
                ctx.drawImage(img, 0, 0, w, h);
                fotoOptimizada = canvas.toDataURL('image/jpeg', 0.5); 
                preview.innerHTML = `<img src="${fotoOptimizada}" style="width:100px; height:100px; object-fit:cover; border-radius:10px; border:2px solid #ff79c6;">`;
                label.innerText = "✅ Foto lista";
            };
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Publicar recuerdo
window.publicarPost = async function() {
    const msgInput = document.getElementById('admin-msg');
    const btn = document.getElementById('btn-publicar');

    if(!msgInput.value && !fotoOptimizada) return alert("Escribe un mensaje o elige una foto");
    
    btn.disabled = true;
    btn.innerText = "Subiendo...";

    try {
        await addDoc(collection(db, "posts"), {
            mensaje: msgInput.value,
            imgUrl: fotoOptimizada,
            timestamp: serverTimestamp()
        });
    } catch (e) {
        console.error(e);
        alert("Error al subir. Revisa tu conexión.");
    } finally {
        // Reset de interfaz pase lo que pase
        btn.disabled = false;
        btn.innerText = "PUBLICAR";
        msgInput.value = "";
        fotoOptimizada = "";
        document.getElementById('admin-file').value = "";
        document.getElementById('preview-container').innerHTML = "";
        document.getElementById('label-archivo').innerText = "📷 Seleccionar Foto";
        window.closeAdmin();
    }
}

// Funciones de Admin
window.borrarPost = async (id) => { 
    if(confirm("¿Seguro que quieres borrar este recuerdo?")) {
        await deleteDoc(doc(db, "posts", id)); 
    }
};

window.handleAdminAccess = () => { 
    clickCount++;
    if(clickCount === 5) { 
        if(prompt("Clave de acceso:") === "santiago") { 
            isAdmin = true; 
            document.getElementById('admin-panel').style.display = 'flex'; 
            loadTimeline(); 
        } 
        clickCount = 0; 
    } 
};

window.closeAdmin = () => { 
    document.getElementById('admin-panel').style.display = 'none'; 
};

// Iniciar app
window.onload = loadTimeline;
                    <div class="msg">${data.mensaje}</div>
                    ${data.imgUrl ? `<img src="${data.imgUrl}">` : ''}
                    ${isAdmin ? `<button class="delete-btn" style="margin-top:10px;" onclick="borrarPost('${postDoc.id}')">Eliminar</button>` : ''}
                </article>`;
            container.insertAdjacentHTML('beforeend', postHTML);
        });
        window.scrollTo(0, document.body.scrollHeight);
    });
}

window.previsualizarFoto = function(input) {
    const preview = document.getElementById('preview-container');
    const label = document.getElementById('label-archivo');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxDim = 500; 
                let w = img.width, h = img.height;
                if (w > h) { if (w > maxDim) { h *= maxDim / w; w = maxDim; } }
                else { if (h > maxDim) { w *= maxDim / h; h = maxDim; } }
                canvas.width = w; canvas.height = h;
                ctx.drawImage(img, 0, 0, w, h);
                fotoOptimizada = canvas.toDataURL('image/jpeg', 0.5); 
                preview.innerHTML = `<img src="${fotoOptimizada}" style="width:100px; border-radius:10px;">`;
                label.innerText = "✅ Foto lista";
            };
        };
        reader.readAsDataURL(input.files[0]);
    }
}

window.publicarPost = async function() {
    const msgInput = document.getElementById('admin-msg');
    const btn = document.getElementById('btn-publicar');
    if(!msgInput.value && !fotoOptimizada) return alert("Escribe un mensaje");
    
    btn.disabled = true;
    btn.innerText = "Subiendo...";

    try {
        await addDoc(collection(db, "posts"), {
            mensaje: msgInput.value,
            imgUrl: fotoOptimizada,
            timestamp: serverTimestamp()
        });
    } catch (e) {
        alert("Error de conexión");
    } finally {
        btn.disabled = false;
        btn.innerText = "PUBLICAR";
        msgInput.value = "";
        fotoOptimizada = "";
        document.getElementById('admin-file').value = "";
        document.getElementById('preview-container').innerHTML = "";
        document.getElementById('label-archivo').innerText = "📷 Seleccionar Foto";
        window.closeAdmin();
    }
}

window.borrarPost = async (id) => { if(confirm("¿Borrar?")) await deleteDoc(doc(db, "posts", id)); };
window.handleAdminAccess = () => { if(++clickCount === 5) { if(prompt("Clave:") === "santiago") { isAdmin = true; document.getElementById('admin-panel').style.display = 'flex'; loadTimeline(); } clickCount = 0; } };
window.closeAdmin = () => { document.getElementById('admin-panel').style.display = 'none'; };
window.onload = loadTimeline;
