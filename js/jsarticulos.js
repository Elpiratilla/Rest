// Usa la variable global "products" y "saveProducts" definidas en admin.js
let carritoItems = [];

const categoryImages = {
    'Entradas': '../img/entrada.jpg',
    'Platos Fuertes': '../img/platofuerte.jpg',
    'Postres': '../img/postres.jpg',
    'Bebidas': '../img/bebidas.jpg'
};

function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function totalCarrito() {
    return carritoItems.reduce((sum, item) => sum + item.precio, 0);
}

function abrirCategoria(nombreCategoria) {
    document.getElementById('zona-categorias').style.display = 'none';
    document.getElementById('zona-productos').style.display = 'block';
    document.getElementById('titulo-categoria').textContent = nombreCategoria;

    const contenedor = document.getElementById('contenedor-articulos');
    contenedor.innerHTML = '';

    const lista = products.filter(p => p.category === nombreCategoria);

    if (lista.length === 0) {
        contenedor.innerHTML = '<p style="grid-column: 1/-1; color: gray; text-align:center;">No hay platillos disponibles en esta categoría.</p>';
        return;
    }

    lista.forEach(p => {
        const item = document.createElement('div');
        item.className = 'articulo-item';
        item.style.cursor = 'default';

        const imgWrap = document.createElement('div');
        imgWrap.className = 'articulo-imagen';
        const imgEl = document.createElement('img');
        const fallbackImage = categoryImages[p.category] || categoryImages['Entradas'];
        imgEl.src = p.image || PRODUCT_IMAGES[p.name] || fallbackImage;
        imgEl.alt = p.name;
        imgEl.onerror = () => {
            if (imgEl.dataset.usingFallback !== 'true') {
                imgEl.dataset.usingFallback = 'true';
                imgEl.src = fallbackImage;
                return;
            }

            const placeholder = document.createElement('div');
            placeholder.className = 'img-placeholder';
            placeholder.textContent = 'Imagen no disponible';
            imgWrap.replaceChildren(placeholder);
        };
        imgWrap.appendChild(imgEl);

        const h3 = document.createElement('h3'); h3.textContent = p.name;
        const pDesc = document.createElement('p'); pDesc.textContent = p.description;

        const agotado = p.stock <= 0;
        const pStock = document.createElement('p');
        pStock.className = 'stock-tag' + (agotado ? ' agotado' : '');
        pStock.textContent = agotado ? 'Agotado' : `Disponibles: ${p.stock}`;

        const pPrecio = document.createElement('p'); pPrecio.className = 'precio'; pPrecio.textContent = `$${Number(p.price).toFixed(2)}`;

        const btn = document.createElement('button');
        btn.className = 'btn-carrito';
        btn.type = 'button';
        btn.textContent = agotado ? 'No disponible' : 'Agregar al pedido';
        btn.disabled = agotado;
        btn.addEventListener('click', () => agregarAlCarrito(p));

        item.append(imgWrap, h3, pDesc, pStock, pPrecio, btn);
        contenedor.appendChild(item);
    });
}

function volverACategorias() {
    document.getElementById('zona-categorias').style.display = 'block';
    document.getElementById('zona-productos').style.display = 'none';
}

function actualizarVistaCarrito() {
    const lista = document.getElementById('lista-carrito');
    if (!lista) return;
    lista.innerHTML = '';

    if (carritoItems.length === 0) {
        lista.innerHTML = '<li>Tu pedido está vacío</li>';
        document.getElementById('total-precio').textContent = '0.00';
        return;
    }

    carritoItems.forEach(item => {
        const li = document.createElement('li');
        const nombre = document.createElement('span'); nombre.textContent = item.nombre;
        const precio = document.createElement('strong'); precio.textContent = `$${item.precio.toFixed(2)}`;
        li.append(nombre, precio);
        lista.appendChild(li);
    });

    document.getElementById('total-precio').textContent = totalCarrito().toFixed(2);
}

function agregarAlCarrito(producto) {
    const enCarrito = carritoItems.filter(i => i.id === producto.id).length;
    if (enCarrito >= producto.stock) {
        alert('Ya agregaste todas las porciones disponibles de este platillo.');
        return;
    }
    carritoItems.push({ id: producto.id, nombre: producto.name, precio: Number(producto.price) });
    actualizarVistaCarrito();
}

function vaciarCarrito() {
    carritoItems = [];
    actualizarVistaCarrito();
}

function mostrarCheckout() {
    const checkout = document.getElementById('checkout-section');
    if (carritoItems.length === 0) {
        alert('Agrega platillos antes de pagar.');
        if (checkout) checkout.style.display = 'none';
        return;
    }
    if (checkout) checkout.style.display = 'block';
}

function finalizarCompra() {
    const nombreCliente = document.getElementById('cliente-nombre').value.trim();
    const metodoPago = document.getElementById('metodo-pago').value;

    if (!nombreCliente) {
        alert('Ingresa tu nombre para emitir la factura.');
        return;
    }
    if (carritoItems.length === 0) {
        alert('Tu pedido está vacío.');
        return;
    }

    const total = totalCarrito();
    const fecha = new Date().toLocaleDateString('es-SV');
    const resumen = carritoItems.map(i => `<p>${escapeHTML(i.nombre)} - $${i.precio.toFixed(2)}</p>`).join('');

    document.getElementById('invoice-content').innerHTML = `
        <p><strong>Cliente:</strong> ${escapeHTML(nombreCliente)}</p>
        <p><strong>Método de pago:</strong> ${escapeHTML(metodoPago)}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>
        <hr style="border: 1px dashed #ccc;">
        ${resumen}
    `;

    // Descontar porciones vendidas
    carritoItems.forEach(i => {
        const p = products.find(x => x.id === i.id);
        if (p && p.stock > 0) p.stock -= 1;
    });
    saveProducts();

    document.getElementById('invoice-preview').style.display = 'block';
    vaciarCarrito();
    document.getElementById('cliente-nombre').value = '';

    // Refrescar la categoría abierta para mostrar la disponibilidad actualizada
    const zona = document.getElementById('zona-productos');
    if (zona && zona.style.display !== 'none') {
        abrirCategoria(document.getElementById('titulo-categoria').textContent);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('button.articulo-item').forEach(btn => {
        btn.addEventListener('click', () => {
            abrirCategoria(btn.getAttribute('data-category'));
            const titulo = document.getElementById('titulo-categoria');
            if (titulo) titulo.focus();
        });
    });

    const on = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
    on('btn-volver-categorias', volverACategorias);
    on('btn-vaciar', vaciarCarrito);
    on('btn-comprar', mostrarCheckout);
    on('btn-finalizar', finalizarCompra);
});
