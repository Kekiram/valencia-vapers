// 1. FUNCIONES GLOBALES
function confirmarEdad() {
    localStorage.setItem('vapers_edad_confirmada', 'true');
    const aviso = document.getElementById('aviso-edad');
    if (aviso) aviso.style.display = 'none';
}

function salirTienda() {
    window.location.href = "https://www.google.com";
}

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('vapers_edad_confirmada') === 'true') {
        const aviso = document.getElementById('aviso-edad');
        if (aviso) aviso.style.display = 'none';
    }
});

function toggleCarrito() {
    const carritoDiv = document.getElementById('carrito-flotante');
    if (carritoDiv) {
        carritoDiv.style.display = (carritoDiv.style.display === "none" || carritoDiv.style.display === "") ? "block" : "none";
    }
}

let carrito = [];

window.mostrarEnContenedor = function(productosAMostrar, contenedor) {
    if (!contenedor) return;
    contenedor.innerHTML = '';
    productosAMostrar.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-vaper');
        
        tarjeta.innerHTML = `
            <span class="etiqueta-categoria">${producto.categoria || 'Vaper'}</span>
            <img src="${producto.img}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.precio.toFixed(2)}€</p>
            <button class="btn-agregar" data-nombre="${producto.nombre}" data-precio="${producto.precio}">
                Añadir al carrito
            </button>
        `;
        contenedor.appendChild(tarjeta);
    });
}

// 2. LÓGICA PRINCIPAL
document.addEventListener('DOMContentLoaded', () => {
    const contNovedades = document.getElementById('contenedor-novedades');
    const contTop = document.getElementById('contenedor-top');
    const contTodos = document.getElementById('contenedor-productos');
    const listaCesta = document.getElementById('lista-cesta');
    const totalPrecio = document.getElementById('total-precio');
    
    const inputBuscador = document.getElementById('buscador');
    const cajaSugerencias = document.getElementById('sugerencias-busqueda');
    const overlay = document.getElementById('overlay-oscuro'); // Asegúrate de que el ID coincida con tu HTML

    function inicializarTienda() {
        if (typeof inventario === 'undefined') return;
        if(contNovedades) mostrarEnContenedor(inventario.filter(p => p.etiqueta === 'novedad'), contNovedades);
        if(contTop) mostrarEnContenedor(inventario.filter(p => p.etiqueta === 'top'), contTop);
        if(contTodos) mostrarEnContenedor(inventario, contTodos);
    }

    if(inputBuscador) {
        inputBuscador.addEventListener('input', (e) => {
            const texto = e.target.value.toLowerCase().trim();
            
            // FILTRADO EN PÁGINA PRINCIPAL
            const filtrados = inventario.filter(p => 
                p.nombre.toLowerCase().includes(texto) || 
                (p.categoria && p.categoria.toLowerCase().includes(texto))
            );
            
            if(texto !== "") {
                if(document.getElementById('seccion-novedades')) document.getElementById('seccion-novedades').style.display = 'none';
                if(document.getElementById('seccion-top')) document.getElementById('seccion-top').style.display = 'none';
            } else {
                if(document.getElementById('seccion-novedades')) document.getElementById('seccion-novedades').style.display = 'block';
                if(document.getElementById('seccion-top')) document.getElementById('seccion-top').style.display = 'block';
            }
            mostrarEnContenedor(filtrados, contTodos);

            // LÓGICA DE SUGERENCIAS FLOTANTES (Diseño de lista)
            if (texto.length < 2) {
                cajaSugerencias.style.display = 'none';
                return;
            }

            const coincidencias = inventario.filter(p => p.nombre.toLowerCase().includes(texto)).slice(0, 6);

            if (coincidencias.length > 0) {
                cajaSugerencias.innerHTML = '';
                coincidencias.forEach(p => {
                    const div = document.createElement('div');
                    div.className = 'sugerencia-item'; // Clase unificada con el CSS
                    div.innerHTML = `
                        <img src="${p.img}" alt="${p.nombre}">
                        <div class="sugerencia-info">
                            <span class="sugerencia-nombre">${p.nombre}</span>
                            <span class="sugerencia-precio">${p.precio.toFixed(2)}€</span>
                        </div>
                    `;
                    div.onclick = () => {
                        inputBuscador.value = p.nombre;
                        cajaSugerencias.style.display = 'none';
                        if(overlay) overlay.style.display = 'none';
                        
                        // Mostramos solo el producto elegido y hacemos scroll
                        mostrarEnContenedor(inventario.filter(prod => prod.nombre === p.nombre), contTodos);
                        contTodos.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    };
                    cajaSugerencias.appendChild(div);
                });
                cajaSugerencias.style.display = 'block';
            } else {
                cajaSugerencias.style.display = 'none';
            }
        });

        inputBuscador.addEventListener('focus', () => {
            if(inputBuscador.value.length >= 2) cajaSugerencias.style.display = 'block';
            if(overlay) overlay.style.display = 'block';
        });

        // Cerrar buscador al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!inputBuscador.contains(e.target) && !cajaSugerencias.contains(e.target)) {
                if(overlay) overlay.style.display = 'none';
                cajaSugerencias.style.display = 'none';
            }
        });
    }

    // GESTIÓN DEL CARRITO
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-agregar')) {
            const nombre = e.target.getAttribute('data-nombre');
            const precio = parseFloat(e.target.getAttribute('data-precio'));
            carrito.push({nombre, precio});
            actualizarInterfaz();
            
            const carritoDiv = document.getElementById('carrito-flotante');
            if (carritoDiv) carritoDiv.style.display = 'block';
        }
    });

    window.actualizarInterfaz = function() {
        if(!listaCesta) return;
        listaCesta.innerHTML = '';
        let total = 0;
        carrito.forEach((item, index) => {
            total += item.precio;
            const li = document.createElement('li');
            li.style = "display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #333; color:white;";
            li.innerHTML = `
                <span style="font-size:0.85rem;">${item.nombre}</span>
                <div>
                    <span style="font-weight:bold; margin-right:10px;">${item.precio.toFixed(2)}€</span>
                    <button onclick="eliminarDelCarrito(${index})" style="background:none; border:none; color:#ff007f; cursor:pointer; font-weight:bold; font-size:1.1rem;">✕</button>
                </div>`;
            listaCesta.appendChild(li);
        });
        if(totalPrecio) totalPrecio.innerText = total.toFixed(2);
        document.querySelectorAll('#contador-carrito').forEach(c => c.innerText = carrito.length);
    }

    window.eliminarDelCarrito = function(index) {
        carrito.splice(index, 1);
        actualizarInterfaz();
    }

    // WHATSAPP FINAL
    const btnWhatsApp = document.getElementById('enviar-whatsapp-cesta'); 
    if(btnWhatsApp) { 
        btnWhatsApp.onclick = function() { 
            if(carrito.length === 0) return alert("Tu cesta está vacía");
            const tienda = document.getElementById('tienda-select') ? document.getElementById('tienda-select').value : "No especificada";
            let msg = "*NUEVO PEDIDO - VALENCIA VAPERS*%0A%0A";
            carrito.forEach(i => { msg += "• " + i.nombre + " (" + i.precio.toFixed(2) + "€)%0A"; });
            msg += "%0A*Total:* " + totalPrecio.innerText + "€%0A";
            msg += "*Tienda de recogida:* " + tienda;
            window.open("https://wa.me/34607280031?text=" + msg, "_blank");
        };
    }

    inicializarTienda();
});

function filtrarPorCategoria(cat) {
    if (typeof inventario === 'undefined') return;
    const filtrados = inventario.filter(p => p.categoria.toLowerCase() === cat.toLowerCase());
    ['seccion-novedades', 'seccion-top'].forEach(id => {
        if(document.getElementById(id)) document.getElementById(id).style.display = 'none';
    });
    const contenedor = document.getElementById('contenedor-productos');
    mostrarEnContenedor(filtrados, contenedor);
    contenedor.scrollIntoView({ behavior: 'smooth' });
}

function mostrarTodos() { 
    location.reload(); 
}