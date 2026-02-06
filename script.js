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
        if(producto.etiqueta) tarjeta.classList.add('especial-' + producto.etiqueta);

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
    
    // ELEMENTOS DEL BUSCADOR E INTELIGENCIA
    const inputBuscador = document.getElementById('buscador');
    const cajaSugerencias = document.getElementById('sugerencias-busqueda');
    const overlay = document.getElementById('overlay-busqueda');

    function inicializarTienda() {
        if (typeof inventario === 'undefined') return;
        mostrarEnContenedor(inventario.filter(p => p.etiqueta === 'novedad'), contNovedades);
        mostrarEnContenedor(inventario.filter(p => p.etiqueta === 'top'), contTop);
        mostrarEnContenedor(inventario, contTodos);
    }

    // LÓGICA DEL BUSCADOR E INTERFAZ
    if(inputBuscador) {
        inputBuscador.addEventListener('input', (e) => {
            const texto = e.target.value.toLowerCase();
            
            // 1. Filtrado en la página principal
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

            // 2. Lógica de Sugerencias Visuales (Flotantes)
            if (texto.length < 2) {
                cajaSugerencias.style.display = 'none';
                return;
            }

            const coincidencias = inventario.filter(p => p.nombre.toLowerCase().includes(texto)).slice(0, 5);

            if (coincidencias.length > 0) {
                cajaSugerencias.innerHTML = '';
                coincidencias.forEach(p => {
                    const div = document.createElement('div');
                    div.className = 'item-sugerido';
                    div.innerHTML = `
                        <img src="${p.img}" alt="${p.nombre}">
                        <div class="info-sugerida">
                            <h4>${p.nombre}</h4>
                            <span>${p.precio.toFixed(2)}€</span>
                        </div>
                    `;
                    div.onclick = () => {
                        inputBuscador.value = p.nombre;
                        cajaSugerencias.style.display = 'none';
                        overlay.style.display = 'none';
                        // Disparamos el filtro principal con el nombre elegido
                        mostrarEnContenedor(inventario.filter(prod => prod.nombre === p.nombre), contTodos);
                    };
                    cajaSugerencias.appendChild(div);
                });
                cajaSugerencias.style.display = 'block';
            } else {
                cajaSugerencias.style.display = 'none';
            }
        });

        // Eventos de Sombra (Overlay)
        inputBuscador.addEventListener('focus', () => {
            if(overlay) overlay.style.display = 'block';
        });

        document.addEventListener('click', (e) => {
            if (!inputBuscador.contains(e.target) && (!cajaSugerencias || !cajaSugerencias.contains(e.target))) {
                if(overlay) overlay.style.display = 'none';
                if(cajaSugerencias) cajaSugerencias.style.display = 'none';
            }
        });
    }

    // CARRITO
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
            li.style = "display:flex; justify-content:space-between; padding:10px 0; color:white;";
            li.innerHTML = `<span>${item.nombre} - ${item.precio.toFixed(2)}€</span>
                            <button onclick="eliminarDelCarrito(${index})" style="background:none; border:none; color:#ff007f; cursor:pointer; font-weight:bold; font-size:1.2rem;">X</button>`;
            listaCesta.appendChild(li);
        });
        if(totalPrecio) totalPrecio.innerText = total.toFixed(2);
        document.querySelectorAll('#contador-carrito').forEach(c => c.innerText = carrito.length);
    }

    window.eliminarDelCarrito = function(index) {
        carrito.splice(index, 1);
        actualizarInterfaz();
    }

    // WHATSAPP
    const btnWhatsApp = document.getElementById('enviar-whatsapp-cesta'); 
    if(btnWhatsApp) { 
        btnWhatsApp.onclick = function() { 
            if(carrito.length === 0) return alert("Cesta vacia");
            const tienda = document.getElementById('tienda-select') ? document.getElementById('tienda-select').value : "Tienda";
            let msg = "Hola Valencia Vapers%0A%0AMI PEDIDO%3A%0A";
            carrito.forEach(i => { msg += "%2D " + i.nombre + " (" + i.precio.toFixed(2) + " EUR)%0A"; });
            msg += "%0ATotal%3A " + totalPrecio.innerText + " EUR%0A";
            msg += "Recogida en%3A " + tienda;
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

function mostrarTodos() { location.reload(); }