// 1. FUNCIONES GLOBALES (Fuera para que el HTML las vea siempre)
function confirmarEdad() {
    const aviso = document.getElementById('aviso-edad');
    if (aviso) {
        aviso.style.display = 'none';
        localStorage.setItem('mayorEdad', 'true');
    }
}

function salirTienda() {
    window.location.href = "https://www.google.com";
}

function toggleCarrito() {
    const carritoDiv = document.getElementById('carrito-flotante');
    if (carritoDiv) {
        if (carritoDiv.style.display === "none" || carritoDiv.style.display === "") {
            carritoDiv.style.display = "block";
        } else {
            carritoDiv.style.display = "none";
        }
    }
}

// Variable global del carrito
let carrito = [];

// 2. LÓGICA PRINCIPAL AL CARGAR EL DOM
document.addEventListener('DOMContentLoaded', () => {
    
    // Verificar edad
    if (localStorage.getItem('mayorEdad') === 'true') {
        const aviso = document.getElementById('aviso-edad');
        if (aviso) aviso.style.display = 'none';
    }

    // Seleccionamos todos los contenedores
    const contNovedades = document.getElementById('contenedor-novedades');
    const contTop = document.getElementById('contenedor-top');
    const contTodos = document.getElementById('contenedor-productos');
    
    const listaCesta = document.getElementById('lista-cesta');
    const totalPrecio = document.getElementById('total-precio');
    const inputBuscador = document.getElementById('buscador');

    // Función genérica para pintar productos en cualquier contenedor
    function mostrarEnContenedor(productosAMostrar, contenedor) {
        if (!contenedor) return;
        contenedor.innerHTML = '';
        
        productosAMostrar.forEach(producto => {
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('tarjeta-vaper');
            
            // Añadimos clase especial si tiene etiqueta (novedad o top)
            if(producto.etiqueta) {
                tarjeta.classList.add('especial-' + producto.etiqueta);
            }

            tarjeta.innerHTML = `
                <img src="${producto.img}" alt="${producto.nombre}">
                <span class="etiqueta-categoria">${producto.categoria || 'Vaper'}</span>
                <h3>${producto.nombre}</h3>
                <p>Precio: ${producto.precio}€</p>
                <button class="btn-agregar" data-nombre="${producto.nombre}" data-precio="${producto.precio}">
                    Añadir a la cesta
                </button>
            `;
            contenedor.appendChild(tarjeta);
        });
    }

    // Función para organizar toda la tienda
    function inicializarTienda(inventarioCompleto) {
        if (!inventarioCompleto) return;

        // Filtramos Novedades (solo los que tengan etiqueta 'novedad')
        const novedades = inventarioCompleto.filter(p => p.etiqueta === 'novedad');
        mostrarEnContenedor(novedades, contNovedades);

        // Filtramos Top (solo los que tengan etiqueta 'top')
        const tops = inventarioCompleto.filter(p => p.etiqueta === 'top');
        mostrarEnContenedor(tops, contTop);

        // Mostramos el resto en la lista general
        mostrarEnContenedor(inventarioCompleto, contTodos);
    }

    // Buscador automático (Busca en todo el inventario)
    if(inputBuscador) {
        inputBuscador.addEventListener('input', (e) => {
            const texto = e.target.value.toLowerCase();
            const filtrados = inventario.filter(p => 
                p.nombre.toLowerCase().includes(texto) || 
                (p.categoria && p.categoria.toLowerCase().includes(texto))
            );
            // Al buscar, ocultamos secciones especiales para no confundir
            if(texto !== "") {
                if(contNovedades) contNovedades.parentElement.style.display = 'none';
                if(contTop) contTop.parentElement.style.display = 'none';
            } else {
                if(contNovedades) contNovedades.parentElement.style.display = 'block';
                if(contTop) contTop.parentElement.style.display = 'block';
            }
            mostrarEnContenedor(filtrados, contTodos);
        });
    }

    // Escuchar clics en botones de "Añadir" (Delegación de eventos)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-agregar')) {
            const nombre = e.target.getAttribute('data-nombre');
            const precio = parseFloat(e.target.getAttribute('data-precio'));
            
            carrito.push({nombre, precio});
            actualizarInterfaz();
            
            // Abrir carrito automáticamente
            const carritoDiv = document.getElementById('carrito-flotante');
            if (carritoDiv) carritoDiv.style.display = 'block';
        }
    });

    // Actualiza la cesta
    window.actualizarInterfaz = function() {
        if(!listaCesta) return;
        listaCesta.innerHTML = '';
        let total = 0;

        carrito.forEach((item, index) => {
            total += item.precio;
            const li = document.createElement('li');
            li.style.display = "flex";
            li.style.justifyContent = "space-between";
            li.style.padding = "10px 0";
            li.style.color = "white";
            li.innerHTML = `
                <span>${item.nombre} - ${item.precio}€</span>
                <button onclick="eliminarDelCarrito(${index})" style="background:none; border:none; color:#ff007f; cursor:pointer; font-weight:bold; font-size:1.2rem;">X</button>
            `;
            listaCesta.appendChild(li);
        });

        if(totalPrecio) totalPrecio.innerText = total.toFixed(2);
        
        // Actualizar todos los contadores de la página
        const contadores = document.querySelectorAll('#contador-carrito');
        contadores.forEach(c => c.innerText = carrito.length);
    }

    window.eliminarDelCarrito = function(index) {
        carrito.splice(index, 1);
        actualizarInterfaz();
    }

    // Enviar WhatsApp
    const btnWhatsApp = document.getElementById('enviar-whatsapp-cesta');
    if(btnWhatsApp) {
        btnWhatsApp.onclick = function() {
            if(carrito.length === 0) return alert("Cesta vacía");
            let mensaje = "Hola Valencia Vapers! Mi pedido es:\n" + 
                carrito.map(i => `- ${i.nombre} (${i.precio}€)`).join('\n') + 
                `\nTotal: ${totalPrecio.innerText}€`;
            window.open(`https://wa.me/34607280031?text=${encodeURIComponent(mensaje)}`, '_blank');
        };
    }

    // Carga inicial (Usando el inventario de productos.js)
    if (typeof inventario !== 'undefined') {
        inicializarTienda(inventario);
    }
});