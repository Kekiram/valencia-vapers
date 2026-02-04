document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedor-productos');
    const listaCesta = document.getElementById('lista-cesta');
    const totalPrecio = document.getElementById('total-precio');
    const inputBuscador = document.getElementById('buscador');
    let cesta = [];

    // 1. FUNCIÓN PARA MOSTRAR PRODUCTOS (Ahora recibe una lista)
    function mostrarProductos(productosAMostrar) {
        contenedor.innerHTML = ''; // Limpiamos antes de dibujar
        
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

    // 2. LÓGICA DEL BUSCADOR
    inputBuscador.addEventListener('input', (e) => {
        const textoCercado = e.target.value.toLowerCase();
        const productosFiltrados = inventario.filter(p => 
            p.nombre.toLowerCase().includes(textoCercado)
        );
        mostrarProductos(productosFiltrados);
    });

    // 3. AÑADIR AL CARRITO
    contenedor.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-agregar')) {
            const nombre = e.target.getAttribute('data-nombre');
            const precio = parseInt(e.target.getAttribute('data-precio'));
            cesta.push({nombre, precio});
            actualizarCesta();
        }
    });

    function actualizarCesta() {
        listaCesta.innerHTML = '';
        let total = 0;
        cesta.forEach(item => {
            total += item.precio;
            listaCesta.innerHTML += `<li>${item.nombre} - ${item.precio}€</li>`;
        });
        totalPrecio.innerText = total;
    }

    // 4. ENVÍO A WHATSAPP
    document.getElementById('enviar-whatsapp-cesta').addEventListener('click', () => {
        if(cesta.length === 0) return alert("Cesta vacía");
        let mensaje = "Hola Valencia Vapers! Mi pedido es:%0A" + 
            cesta.map(i => `- ${i.nombre} (${i.precio}€)`).join('%0A') + 
            `%0ATotal: ${totalPrecio.innerText}€`;
        window.open(`https://wa.me/34607280031?text=${mensaje}`, '_blank');
    });

    // Carga inicial con todos los productos
    mostrarProductos(inventario);
});