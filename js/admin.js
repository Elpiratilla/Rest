const STORAGE_KEY = 'urban-bistro-products';
const USERS_KEY = 'urban-bistro-users';
const SESSION_KEY = 'urban-bistro-admin-session';
const CATEGORY_IMAGES = {
    'Entradas': '../img/entrada.jpg',
    'Platos Fuertes': '../img/platofuerte.jpg',
    'Postres': '../img/postres.jpg',
    'Bebidas': '../img/bebidas.jpg'
};
const PRODUCT_IMAGES = {
    'Nachos Gratinados': '../img/nachos.jpg',
    'Alitas BBQ': '../img/alitasbbq.jpg',
    'Bruschetta': '../img/brus.jpg',
    'Hamburguesa Urban': '../img/hamburguesa.jpg',
    'Pasta Alfredo': '../img/pasta.jpg',
    'Pollo a la Parrilla': '../img/pollo a la parrilla.jpg',
    'Pizza Margarita': '../img/pizza.jpg',
    'Cheesecake': '../img/cheesecake.jpg',
    'Brownie con helado': '../img/brownnie.jpg',
    'Flan de la casa': '../img/flan.jpg',
    'Limonada natural': '../img/limonada.jpg',
    'Café americano': '../img/cafe americano.jpg',
    'Cerveza artesanal': '../img/cerveza.jpg',
    'Smoothie de frutas': '../img/smoothie.jpg'
};

let products = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');

function ensureDefaultData() {
    if (products.length === 0) {
        const d = (id, name, category, price, stock, description) => ({
            id, name, category, price, stock, description, image: PRODUCT_IMAGES[name] || ''
        });
        products = [
            d(1, 'Nachos Gratinados', 'Entradas', 6.5, 20, 'Totopos con queso fundido, frijoles y pico de gallo.'),
            d(2, 'Alitas BBQ', 'Entradas', 8.0, 20, 'Seis alitas glaseadas en salsa BBQ casera.'),
            d(3, 'Bruschetta', 'Entradas', 5.5, 15, 'Pan tostado con tomate, albahaca y aceite de oliva.'),
            d(4, 'Hamburguesa Urban', 'Platos Fuertes', 11.0, 15, 'Carne de res, queso cheddar, tocino y papas fritas.'),
            d(5, 'Pasta Alfredo', 'Platos Fuertes', 10.5, 12, 'Fettuccine en salsa cremosa con pollo.'),
            d(6, 'Pollo a la Parrilla', 'Platos Fuertes', 12.0, 12, 'Pechuga a la parrilla con ensalada y arroz.'),
            d(7, 'Pizza Margarita', 'Platos Fuertes', 9.5, 10, 'Salsa de tomate, mozzarella y albahaca fresca.'),
            d(8, 'Cheesecake', 'Postres', 5.0, 10, 'Cheesecake cremoso con salsa de frutos rojos.'),
            d(9, 'Brownie con helado', 'Postres', 4.5, 10, 'Brownie tibio de chocolate con helado de vainilla.'),
            d(10, 'Flan de la casa', 'Postres', 3.5, 8, 'Flan de vainilla con caramelo.'),
            d(11, 'Limonada natural', 'Bebidas', 2.5, 30, 'Limonada fresca, con hielo o frappé.'),
            d(12, 'Café americano', 'Bebidas', 2.0, 30, 'Café recién preparado.'),
            d(13, 'Cerveza artesanal', 'Bebidas', 4.0, 24, 'Cerveza local, consulta los sabores disponibles.'),
            d(14, 'Smoothie de frutas', 'Bebidas', 3.5, 15, 'Fruta de temporada licuada con yogur.')
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }

    if (users.length === 0) {
        users = [{ user: 'admin', email: 'admin@urbanbistro.com', password: '1234' }];
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
}

ensureDefaultData();

function saveProducts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    renderProducts();
}

function renderProducts() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');

        const tdName = document.createElement('td');
        const strong = document.createElement('strong');
        strong.textContent = product.name;
        tdName.appendChild(strong);

        const tdCat = document.createElement('td');
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = product.category;
        tdCat.appendChild(tag);

        const tdPrice = document.createElement('td'); tdPrice.textContent = `$${Number(product.price).toFixed(2)}`;
        const tdStock = document.createElement('td'); tdStock.textContent = `${product.stock}`;
        const tdActions = document.createElement('td');

        const editBtn = document.createElement('button'); editBtn.className = 'action-btn edit'; editBtn.type = 'button'; editBtn.textContent = 'Editar';
        editBtn.addEventListener('click', () => editProduct(product.id));

        const delBtn = document.createElement('button'); delBtn.className = 'action-btn delete'; delBtn.type = 'button'; delBtn.textContent = 'Eliminar';
        delBtn.addEventListener('click', () => deleteProduct(product.id));

        tdActions.appendChild(editBtn);
        tdActions.appendChild(delBtn);

        row.append(tdName, tdCat, tdPrice, tdStock, tdActions);
        tbody.appendChild(row);
    });
}

function editProduct(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;

    const set = (el, v) => { const n = document.getElementById(el); if (n) n.value = v; };
    set('productId', product.id);
    set('productName', product.name);
    set('productCategory', product.category);
    set('productPrice', product.price);
    set('productStock', product.stock);
    set('productDescription', product.description);
    set('productImage', product.image || PRODUCT_IMAGES[product.name] || '');
    updateProductImagePreview();
}

function updateProductImagePreview() {
    const preview = document.getElementById('productImagePreview');
    if (!preview) return;

    const imageInput = document.getElementById('productImage');
    const categoryInput = document.getElementById('productCategory');
    const nameInput = document.getElementById('productName');
    const fallbackImage = CATEGORY_IMAGES[categoryInput.value] || CATEGORY_IMAGES['Entradas'];

    preview.onerror = () => {
        preview.onerror = null;
        preview.src = fallbackImage;
    };
    preview.src = imageInput.value.trim() || PRODUCT_IMAGES[nameInput.value.trim()] || fallbackImage;
}

function deleteProduct(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este platillo?')) {
        products = products.filter(item => item.id !== id);
        saveProducts();
    }
}

function resetForm() {
    const form = document.getElementById('productForm');
    if (form) {
        form.reset();
        document.getElementById('productId').value = '';
        updateProductImagePreview();
    }
}

function loginUser(user, password) {
    return users.some(item => item.user === user && item.password === password);
}

function isAdminUser(user) {
    return user && user.toLowerCase() === 'admin';
}

function showAdminDashboard() {
    const card = document.getElementById('admin-login-card');
    const dash = document.getElementById('admin-dashboard');
    if (card) card.style.display = 'none';
    if (dash) dash.style.display = 'block';
}

function showAdminLogin() {
    const card = document.getElementById('admin-login-card');
    const dash = document.getElementById('admin-dashboard');
    if (card) card.style.display = 'block';
    if (dash) dash.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();

    const adminLoginForm = document.getElementById('adminLoginForm');
    const productForm = document.getElementById('productForm');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const logoutAdminBtn = document.getElementById('logoutAdminBtn');
    const adminAuthMessage = document.getElementById('adminAuthMessage');
    const productImageInput = document.getElementById('productImage');
    const productCategoryInput = document.getElementById('productCategory');
    const productNameInput = document.getElementById('productName');

    if (productImageInput) productImageInput.addEventListener('input', updateProductImagePreview);
    if (productCategoryInput) productCategoryInput.addEventListener('change', updateProductImagePreview);
    if (productNameInput) productNameInput.addEventListener('input', updateProductImagePreview);
    updateProductImagePreview();

    // Solo se muestra el panel si la sesión guardada es de un admin
    if (localStorage.getItem(SESSION_KEY) === 'admin') {
        showAdminDashboard();
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const user = document.getElementById('adminLoginUser').value.trim();
            const password = document.getElementById('adminLoginPassword').value.trim();

            if (loginUser(user, password)) {
                if (isAdminUser(user)) {
                    localStorage.setItem(SESSION_KEY, 'admin');
                    showAdminDashboard();
                    if (adminAuthMessage) adminAuthMessage.textContent = 'Bienvenido al panel.';
                } else {
                    localStorage.setItem(SESSION_KEY, 'user');
                    if (adminAuthMessage) adminAuthMessage.textContent = 'Sesión iniciada, pero esta cuenta no tiene acceso al panel.';
                }
            } else if (adminAuthMessage) {
                adminAuthMessage.textContent = 'Usuario o contraseña incorrectos.';
            }
        });
    }

    if (productForm) {
        productForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const inputId = document.getElementById('productId').value;
            const id = inputId ? Number(inputId) : Date.now();

            const product = {
                id,
                name: document.getElementById('productName').value.trim(),
                category: document.getElementById('productCategory').value,
                price: Number(document.getElementById('productPrice').value),
                stock: Number(document.getElementById('productStock').value),
                description: document.getElementById('productDescription').value.trim(),
                image: document.getElementById('productImage').value.trim()
            };

            if (!product.name || !product.description) {
                alert('Completa nombre y descripción del platillo.');
                return;
            }

            const idx = products.findIndex(item => item.id === id);
            if (idx >= 0) products[idx] = product;
            else products.push(product);

            saveProducts();
            resetForm();
        });
    }

    if (cancelEditBtn) cancelEditBtn.addEventListener('click', resetForm);

    if (logoutAdminBtn) {
        logoutAdminBtn.addEventListener('click', () => {
            localStorage.removeItem(SESSION_KEY);
            showAdminLogin();
        });
    }
});
