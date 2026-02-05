function confirmarEdad() {
    const aviso = document.getElementById('aviso-edad');
    if (aviso) {
        aviso.style.display = 'none';
        // Guardamos la confirmación para que no vuelva a salir en esta sesión
        localStorage.setItem('mayorEdad', 'true');
    }
}

function salirTienda() {
    // Si es menor, lo mandamos fuera
    window.location.href = "https://www.google.com";
}

// Al cargar la web, comprobamos si ya es mayor de edad
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('mayorEdad') === 'true') {
        const aviso = document.getElementById('aviso-edad');
        if (aviso) aviso.style.display = 'none';
    }
});

function toggleCarrito() {
    const carritoDiv = document.getElementById('carrito-flotante');
    if (carritoDiv) {
        // Usamos una clase para el CSS o cambiamos el display directamente
        if (carritoDiv.style.display === "none" || carritoDiv.style.display === "") {
            carritoDiv.style.display = "block";
        } else {
            carritoDiv.style.display = "none";
        }
    }
}

let carrito = [];

// 2. LÓGICA PRINCIPAL
document.addEventListener('DOMContentLoaded', () => {
    
    if(localStorage.getItem('mayorEdad') === 'true') {
        const aviso = document.getElementById('aviso-edad');
        if(aviso) aviso.style.display = 'none';
    }

    const contenedor = document.getElementById('contenedor-productos');
    const listaCesta = document.getElementById('lista-cesta');
    const totalPrecio = document.getElementById('total-precio');
    const inputBuscador = document.getElementById('buscador');

    function mostrarProductos(productosAMostrar) {
        if (!contenedor) return;
        contenedor.innerHTML = '';
        
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
            tarjeta.innerHTML = `
    <img src="${producto.img}" alt="${producto.nombre}">
    <span class="etiqueta-categoria">${producto.categoria}</span> <h3>${producto.nombre}</h3>
    <p>Precio: ${producto.precio}€</p>
    <button class="btn-agregar" data-nombre="${producto.nombre}" data-precio="${producto.precio}">
        Añadir a la cesta
    </button>
`;
            contenedor.appendChild(tarjeta);
        });
    }

  // Buscador automático (Busca por nombre y por categoría)
if(inputBuscador) {
    inputBuscador.addEventListener('input', (e) => {
        const texto = e.target.value.toLowerCase();
        
        const filtrados = inventario.filter(p => 
            p.nombre.toLowerCase().includes(texto) || 
            p.categoria.toLowerCase().includes(texto) // <-- Ahora también busca aquí
        );
        
        mostrarProductos(filtrados);
    });
}

    if(contenedor) {
        contenedor.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-agregar')) {
                const nombre = e.target.getAttribute('data-nombre');
                const precio = parseFloat(e.target.getAttribute('data-precio'));
                carrito.push({nombre, precio});
                actualizarInterfaz();
                
                const carritoDiv = document.getElementById('carrito-flotante');
                if (carritoDiv) carritoDiv.style.display = 'block';
            }
        });
    }

    window.actualizarInterfaz = function() {
        if(!listaCesta) return;
        listaCesta.innerHTML = '';
        let total = 0;

        carrito.forEach((item, index) => {
            total += item.precio;
            const li = document.createElement('li');
            li.style.display = "flex";
            li.style.justifyContent = "space-between";
            li.style.padding = "8px 0";
            li.style.color = "white";
            li.innerHTML = `
                <span>${item.nombre} - ${item.precio}€</span>
                <button onclick="eliminarDelCarrito(${index})" style="background:none; border:none; color:#ff007f; cursor:pointer; font-weight:bold; font-size:1.2rem;">X</button>
            `;
            listaCesta.appendChild(li);
        });

        totalPrecio.innerText = total.toFixed(2);
        
        // --- AQUÍ ESTÁ EL ARREGLO CLAVE ---
        // Buscamos TODOS los elementos que tengan el ID contador-carrito 
        // (por si tienes el del menú y el de dentro de la cesta)
        const contadores = document.querySelectorAll('#contador-carrito');
        contadores.forEach(cont => {
            cont.innerText = carrito.length;
        });
    }

    window.eliminarDelCarrito = function(index) {
        carrito.splice(index, 1);
        actualizarInterfaz();
    }

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

    if (typeof inventario !== 'undefined') {
        mostrarProductos(inventario);
    }
});