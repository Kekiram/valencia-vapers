// 1. FUNCIONES DEL AVISO DE EDAD (FUERA PARA QUE LOS BOTONES LAS VEAN)
function confirmarEdad() {
    const aviso = document.getElementById('aviso-edad');
    if(aviso) {
        aviso.style.display = 'none';
        localStorage.setItem('mayorEdad', 'true');
    }
}

function salirTienda() {
    window.location.href = "https://www.google.com";
}

// 2. TODO EL RESTO DE LA LÓGICA
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si ya aceptó la edad antes
    if(localStorage.getItem('mayorEdad') === 'true') {
        const aviso = document.getElementById('aviso-edad');
        if(aviso) aviso.style.display = 'none';
    }

    const contenedor = document.getElementById('contenedor-productos');
    const listaCesta = document.getElementById('lista-cesta');
    const totalPrecio = document.getElementById('total-precio');
    const inputBuscador = document.getElementById('buscador');
    let cesta = [];

    function mostrarProductos(productosAMostrar) {
        if (!contenedor) return;
        contenedor.innerHTML = '';
        
        // Comprobamos si inventario existe (viene de productos.js)
        if (typeof inventario !== 'undefined') {
            productosAMostrar.forEach(producto => {
                const tarjeta = document.createElement('div');
                tarjeta.classList.add('tarjeta-vaper');
                tarjeta.innerHTML = `
                    <img src="${producto.img}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p>Precio: ${producto.precio}€</p>
                    <button class="btn-agregar" data-nombre="${producto.nombre}" data-precio="${producto.precio}">
                        Añadir a la cesta
                    </button>
                `;
                contenedor.appendChild(tarjeta);
            });
        }
    }

    // El buscador
    if(inputBuscador) {
        inputBuscador.addEventListener('input', (e) => {
            const texto = e.target.value.toLowerCase();
            const filtrados = inventario.filter(p => p.nombre.toLowerCase().includes(texto));
            mostrarProductos(filtrados);
        });
    }

    // Añadir al carrito
    if(contenedor) {
        contenedor.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-agregar')) {
                const nombre = e.target.getAttribute('data-nombre');
                const precio = parseInt(e.target.getAttribute('data-precio'));
                cesta.push({nombre, precio});
                actualizarCesta();
            }
        });
    }

    function actualizarCesta() {
        if(!listaCesta) return;
        listaCesta.innerHTML = '';
        let total = 0;
        cesta.forEach(item => {
            total += item.precio;
            listaCesta.innerHTML += `<li>${item.nombre} - ${item.precio}€</li>`;
        });
        totalPrecio.innerText = total;
    }

    // Enviar WhatsApp
    const btnWhatsApp = document.getElementById('enviar-whatsapp-cesta');
    if(btnWhatsApp) {
        btnWhatsApp.addEventListener('click', () => {
            if(cesta.length === 0) return alert("Cesta vacía");
            let mensaje = "Hola Valencia Vapers! Mi pedido es:%0A" + 
                cesta.map(i => `- ${i.nombre} (${i.precio}€)`).join('%0A') + 
                `%0ATotal: ${totalPrecio.innerText}€`;
            window.open(`https://wa.me/34607280031?text=${mensaje}`, '_blank');
        });
    }

    // Carga inicial
    if (typeof inventario !== 'undefined') {
        mostrarProductos(inventario);
    }
});