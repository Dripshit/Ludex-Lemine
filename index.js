// LUDEX LEMINE B2B Catalog Application Logic
const PRODUCTS = [
    {
        id: "prod-sugar-80",
        name: "Açúcar Empacotado Soba - 80 Unid",
        category: "sugar",
        priceVal: 45.00,
        priceDisplay: "$45.00",
        unit: "Saco Grande",
        image: "images/sugar_sack.jpg?v=2",
        moq: "10 Sacos",
        specs: {
            "Marca": "Soba (Ultra Qualidade)",
            "Embalado por": "LUDEX LEMINE, Lda",
            "Conteúdo": "80 pacotes individuais",
            "Peso Líquido": "80 kg (80 x 1kg)",
            "Origem": "Nacional / Importado",
            "Tipo": "Açúcar Branco Refinado"
        },
        description: "Fardo grosso e resistente contendo 80 pacotes individuais de 1kg de açúcar refinado SOBA. Embalagem plástica de alta resistência, ideal para revenda, comércio regional e padarias. Qualidade testada e garantida.",
        gallery: ["images/sugar_sack.jpg?v=2"]
    },
    {
        id: "prod-oil-100",
        name: "Óleo de Soja Soba - 100 Unid",
        category: "oil",
        priceVal: 75.00,
        priceDisplay: "$75.00",
        unit: "Fardo Reforçado",
        image: "images/oil_sack.jpg?v=2",
        moq: "5 Fardos",
        specs: {
            "Marca": "Soba (Ultra Qualidade)",
            "Embalado por": "LUDEX LEMINE, Lda",
            "Conteúdo": "100 saquetas individuais de óleo",
            "Volume Total": "100 Litros (100 x 1L)",
            "Acidez": "< 0.1%",
            "Certificação": "Qualidade Alimentar Garantida"
        },
        description: "Fardo industrial reforçado com 100 saquetas individuais de 1 Litro de óleo alimentar de soja SOBA. Óleo vegetal de refinação superior, livre de colesterol. Perfeito para distribuição regional, mercearias e cozinhas industriais.",
        gallery: ["images/oil_sack.jpg?v=2"]
    },
    {
        id: "prod-grease-ep2",
        name: "Massa Lubrificante Eiffel EP-2 - Extrema Pressão",
        category: "fuel",
        priceVal: 12.80,
        priceDisplay: "$12.80",
        unit: "Cartucho 400g",
        image: "images/grease_ep2.jpg",
        moq: "50 Cartuchos",
        specs: {
            "Fabricante": "Eiffel Lubricants",
            "Modelo": "EP-2 Extreme Protect Grease",
            "Tipo": "Complexo de Lítio (Lithium Complex)",
            "Consistência NLGI": "Grau 2",
            "Cor": "Amarela / Âmbar",
            "Temperatura Operacional": "-20°C a +140°C"
        },
        description: "Massa lubrificante premium de alta performance formulada com sabão de complexo de lítio e aditivos de Extrema Pressão (EP). Excelente capacidade de carga, proteção contra ferrugem e resistência ao desgaste em condições industriais pesadas.",
        gallery: ["images/grease_ep2.jpg"]
    },
    {
        id: "prod-blue-barrel",
        name: "Óleo Motor Diesel Eiffel 15W-40 - 200L",
        category: "fuel",
        priceVal: 480.00,
        priceDisplay: "$480.00",
        unit: "Tambor 200L",
        image: "images/blue_barrel.jpg",
        moq: "2 Tambores",
        specs: {
            "Fabricante": "Eiffel Lubricants",
            "Viscosidade": "SAE 15W-40 API CI-4/SL",
            "Volume": "200 Litros",
            "Material": "Tambor Plástico Azul Reforçado",
            "Aplicações": "Motores Diesel Pesados, Frotas, Geradores",
            "Proteção": "Anticorrosão, Alta Estabilidade Térmica"
        },
        description: "Óleo lubrificante multigrau mineral de altíssima qualidade fornecido em tambores plásticos azuis industriais de 200L. Formulado para fornecer excelente proteção em motores diesel sob condições extremas de serviço comercial.",
        gallery: ["images/blue_barrel.jpg"]
    },
    {
        id: "prod-lubricants-pallet",
        name: "Gama Completa Eiffel Lubricants - Palete Combinada",
        category: "fuel",
        priceVal: 2450.00,
        priceDisplay: "$2,450.00",
        unit: "Palete Industrial",
        image: "images/canisters_drums.jpg",
        moq: "1 Palete",
        specs: {
            "Composição": "Mista (Canisters + Tambores + Caixas de Massa)",
            "Marca": "Eiffel Lubricants Products",
            "Origem": "Emirados Árabes Unidos (EAU)",
            "Peso Total": "Aprox. 850 kg",
            "Certificações": "ISO 9001, API, OEM Approved",
            "Embalagem": "Palete selada termo-retrátil"
        },
        description: "Lote industrial completo contendo canisters cinzentos/azuis de 20L de óleos hidráulicos, engrenagens e motores, juntamente com tambores verdes/brancos e cartuchos de massa lubrificante. Ideal para postos de abastecimento, oficinas de grande porte e indústrias pesadas.",
        gallery: ["images/canisters_drums.jpg"]
    }
];

// 2. Application State Variables
let currentFilter = "all";
let searchQuery = "";
let inquiryCart = []; // Array of { product: Object, quantity: Number }

// 3. Document Ready Setup
document.addEventListener("DOMContentLoaded", () => {
    // Load inquiry list from localStorage if exists
    loadInquiryCart();
    updateInquiryCartCountBadge();

    // Render catalog
    renderCatalog();

    // Setup Event Listeners
    setupEventListeners();
});

// Helper to remove accents and convert to lowercase for case/accent-insensitive matching
function normalizeStr(str) {
    if (!str) return "";
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// 4. Render Catalog Grid
function renderCatalog() {
    const grid = document.getElementById("catalogGrid");
    const statsText = document.getElementById("catalogStatsText");
    if (!grid) return;

    // Filter Products
    const filtered = PRODUCTS.filter(product => {
        const matchesCategory = currentFilter === "all" || product.category === currentFilter;
        const query = normalizeStr(searchQuery);
        const matchesSearch = normalizeStr(product.name).includes(query) ||
                             normalizeStr(product.description).includes(query) ||
                             normalizeStr(translateCategory(product.category)).includes(query);
        return matchesCategory && matchesSearch;
    });

    // Update stats
    if (statsText) {
        statsText.textContent = `A mostrar ${filtered.length} de ${PRODUCTS.length} produtos`;
    }

    // Generate HTML
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <p style="font-size: 18px; color: #718096; font-family: var(--font-serif);">
                    Nenhum produto encontrado com os filtros atuais.
                </p>
                <button onclick="clearFilters()" class="btn-primary" style="margin-top: 15px; padding: 8px 20px; border-radius: var(--border-radius);">
                    Limpar Filtros
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(product => {
        let accentBtnClass = "btn-primary";
        if (product.category === "sugar") accentBtnClass = "btn-accent-green";
        if (product.category === "oil") accentBtnClass = "btn-accent";

        return `
            <article class="product-card ${product.category} fade-in">
                <div class="product-image-container" onclick="openQuickView('${product.id}')">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-details">
                    <span class="product-category-tag">${translateCategory(product.category)}</span>
                    <h3 class="product-name" onclick="openQuickView('${product.id}')">${product.name}</h3>
                    <div class="product-meta-row">
                        <span><strong>Unidade de Venda:</strong> ${product.unit}</span>
                    </div>
                    <div class="product-pricing">
                        <div class="product-price-label">Preço Grossista</div>
                        <div class="product-price">${product.priceDisplay}<span> / ${product.unit}</span></div>
                    </div>
                    <div class="card-actions">
                        <button class="card-btn ${accentBtnClass}" onclick="addToInquiry('${product.id}')">
                            <span class="icon-cart">🛒</span> Pedir Cotação
                        </button>
                        <button class="card-btn btn-secondary" onclick="openQuickView('${product.id}')">
                            🔍 Detalhes
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

// Clear all filters
function clearFilters() {
    searchQuery = "";
    currentFilter = "all";
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = "";
    updateFilterButtonActiveState();
    renderCatalog();
}

// Translate category IDs
function translateCategory(cat) {
    switch (cat) {
        case "sugar": return "Açúcar";
        case "oil": return "Óleo Alimentar";
        case "fuel": return "Combustíveis & Lubrificantes";
        default: return cat;
    }
}

// 5. Setup Action Listeners
function setupEventListeners() {
    // Search Bar Input
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const searchToggleBtn = document.getElementById("searchToggleBtn");
    const searchOverlay = document.getElementById("searchOverlay");
    const searchCloseBtn = document.getElementById("searchCloseBtn");

    if (searchToggleBtn && searchOverlay) {
        searchToggleBtn.addEventListener("click", () => {
            searchOverlay.classList.add("active");
            if (searchInput) searchInput.focus();
        });
    }

    if (searchCloseBtn && searchOverlay) {
        searchCloseBtn.addEventListener("click", () => {
            searchOverlay.classList.remove("active");
            if (searchInput) searchInput.value = "";
            searchQuery = "";
            renderCatalog();
        });
    }

    if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (searchInput) {
                searchQuery = searchInput.value;
                renderCatalog();
            }
        });
    }
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value;
            renderCatalog();
        });
    }

    // Category Cards Home Grid Click
    const catCards = document.querySelectorAll(".category-card");
    catCards.forEach(card => {
        card.addEventListener("click", () => {
            const filterVal = card.getAttribute("data-category");
            setFilter(filterVal);
            const catalogSection = document.getElementById("catalogSection");
            if (catalogSection) {
                catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Filter Buttons in Catalog Bar
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const filterVal = btn.getAttribute("data-filter");
            setFilter(filterVal);
        });
    });

    // Menu Drawer Toggle
    const menuTrigger = document.getElementById("menuTrigger");
    const navDrawer = document.getElementById("navDrawer");
    const navOverlay = document.getElementById("navOverlay");
    const closeNavBtn = document.getElementById("closeNavBtn");

    if (menuTrigger && navDrawer) {
        menuTrigger.addEventListener("click", () => {
            navDrawer.classList.add("active");
            if (navOverlay) navOverlay.classList.add("active");
        });
    }
    if (navOverlay) {
        navOverlay.addEventListener("click", () => {
            navDrawer.classList.remove("active");
            navOverlay.classList.remove("active");
        });
    }
    if (closeNavBtn) {
        closeNavBtn.addEventListener("click", () => {
            navDrawer.classList.remove("active");
            if (navOverlay) navOverlay.classList.remove("active");
        });
    }

    // Inquiry Drawer Toggle
    const inquiryBadgeBtn = document.getElementById("inquiryBadgeBtn");
    const inquiryDrawer = document.getElementById("inquiryDrawer");
    const inquiryOverlay = document.getElementById("inquiryDrawerOverlay");
    const closeInquiryBtn = document.getElementById("closeInquiryDrawerBtn");

    if (inquiryBadgeBtn && inquiryDrawer) {
        inquiryBadgeBtn.addEventListener("click", () => {
            renderInquiryDrawerItems();
            inquiryDrawer.classList.add("active");
            if (inquiryOverlay) inquiryOverlay.classList.add("active");
        });
    }
    if (inquiryOverlay) {
        inquiryOverlay.addEventListener("click", () => {
            inquiryDrawer.classList.remove("active");
            inquiryOverlay.classList.remove("active");
        });
    }
    if (closeInquiryBtn) {
        closeInquiryBtn.addEventListener("click", () => {
            inquiryDrawer.classList.remove("active");
            if (inquiryOverlay) inquiryOverlay.classList.remove("active");
        });
    }

    // Modal Close
    const modalOverlay = document.getElementById("modalOverlay");
    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove("active");
            }
        });
    }
    const closeModalBtn = document.getElementById("closeModalBtn");
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            if (modalOverlay) modalOverlay.classList.remove("active");
        });
    }
}

// Programmatic category filtering
function setFilter(filterVal) {
    currentFilter = filterVal;
    updateFilterButtonActiveState();
    renderCatalog();
}

// Update UI Active status of filter buttons
function updateFilterButtonActiveState() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        if (btn.getAttribute("data-filter") === currentFilter) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}

// 6. Quick View Modal Operations
function openQuickView(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const modalOverlay = document.getElementById("modalOverlay");
    if (!modalOverlay) return;

    // Populate simple specs
    document.getElementById("modalTitle").textContent = product.name;
    document.getElementById("modalCategory").textContent = translateCategory(product.category);
    document.getElementById("modalDesc").textContent = product.description;
    document.getElementById("modalPriceVal").innerHTML = `${product.priceDisplay} <span id="modalPriceUnit" style="font-size: 13px; color: #4a5568;"> / ${product.unit}</span>`;

    // Set Action button click handler
    const modalSubmitBtn = document.getElementById("modalSubmitBtn");
    if (modalSubmitBtn) {
        modalSubmitBtn.onclick = () => {
            addToInquiry(product.id);
            modalOverlay.classList.remove("active");
        };
    }

    // Render specs table
    const specsTable = document.getElementById("modalSpecsBody");
    if (specsTable) {
        specsTable.innerHTML = Object.entries(product.specs).map(([key, val]) => `
            <tr>
                <th>${key}</th>
                <td>${val}</td>
            </tr>
        `).join('');
    }

    // Render Modal image gallery
    const mainImg = document.getElementById("modalMainImg");
    const thumbContainer = document.getElementById("modalThumbnails");

    if (mainImg) {
        mainImg.innerHTML = `<img src="${product.image}" id="modalMainImgElem" alt="${product.name}">`;
    }

    if (thumbContainer) {
        if (product.gallery && product.gallery.length > 1) {
            thumbContainer.innerHTML = product.gallery.map((imgSrc, idx) => `
                <div class="modal-thumb ${idx === 0 ? 'active' : ''}" onclick="setModalMainImage('${imgSrc}', this)">
                    <img src="${imgSrc}" alt="Miniatura ${idx + 1}">
                </div>
            `).join('');
        } else {
            thumbContainer.innerHTML = '';
        }
    }

    // Open modal
    modalOverlay.classList.add("active");
}

// Change modal main image on thumbnail click
window.setModalMainImage = function(imgSrc, thumbElem) {
    const mainImgElem = document.getElementById("modalMainImgElem");
    if (mainImgElem) {
        mainImgElem.src = imgSrc;
    }

    const thumbs = document.querySelectorAll(".modal-thumb");
    thumbs.forEach(t => t.classList.remove("active"));
    if (thumbElem) {
        thumbElem.classList.add("active");
    }
}

// 7. Inquiry Cart Business Logic
function addToInquiry(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existing = inquiryCart.find(item => item.product.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        inquiryCart.push({ product, quantity: 1 });
    }

    saveInquiryCart();
    updateInquiryCartCountBadge();

    // Visual Micro-animation feedback on badge
    const badge = document.getElementById("inquiryBadgeBtn");
    if (badge) {
        badge.classList.add("badge-pulse");
        setTimeout(() => badge.classList.remove("badge-pulse"), 400);
    }
}

function updateInquiryCartCountBadge() {
    const countBadge = document.getElementById("inquiryCountBadge");
    if (!countBadge) return;

    const totalCount = inquiryCart.reduce((sum, item) => sum + item.quantity, 0);
    countBadge.textContent = totalCount;

    if (totalCount === 0) {
        countBadge.classList.add("hidden");
    } else {
        countBadge.classList.remove("hidden");
    }
}

function renderInquiryDrawerItems() {
    const container = document.getElementById("inquiryListContainer");
    const footer = document.getElementById("drawerWhatsappFooter");
    const totalRow = document.getElementById("drawerTotalRow");
    if (!container) return;

    if (inquiryCart.length === 0) {
        container.innerHTML = `
            <div class="inquiry-empty-state">
                <div style="font-size: 48px; margin-bottom: 12px;">💬</div>
                <p style="font-weight:600; margin-top: 8px; font-size: 15px;">A sua lista está vazia</p>
                <p style="font-size:13px; margin-top: 6px; color: #718096;">Adicione produtos ao catálogo<br>e envie o pedido direto por WhatsApp.</p>
            </div>
        `;
        if (footer) footer.classList.add("hidden");
        return;
    }

    if (footer) footer.classList.remove("hidden");

    // Render items
    container.innerHTML = inquiryCart.map(item => `
        <div class="inquiry-item">
            <img src="${item.product.image}" alt="${item.product.name}">
            <div class="inquiry-item-details">
                <div class="inquiry-item-name">${item.product.name}</div>
                <div class="inquiry-item-price">${item.product.priceDisplay} / ${item.product.unit}</div>
            </div>
            <div class="inquiry-qty-control">
                <button class="inquiry-qty-btn" onclick="updateInquiryQty('${item.product.id}', -1)">-</button>
                <input type="number" class="inquiry-qty-val" value="${item.quantity}" min="1" onkeypress="return event.charCode >= 48 && event.charCode <= 57" oninput="this.value = this.value.replace(/[^0-9]/g, '')" onchange="setInquiryQty('${item.product.id}', this.value)">
                <button class="inquiry-qty-btn" onclick="updateInquiryQty('${item.product.id}', 1)">+</button>
            </div>
            <button class="inquiry-remove-btn" onclick="removeInquiryItem('${item.product.id}')" title="Remover">
                🗑️
            </button>
        </div>
    `).join('');

    // Update the total item count row
    if (totalRow) {
        const totalItems = inquiryCart.reduce((s, i) => s + i.quantity, 0);
        const totalProducts = inquiryCart.length;
        totalRow.innerHTML = `
            <span>${totalProducts} produto${totalProducts !== 1 ? 's' : ''} selecionado${totalProducts !== 1 ? 's' : ''}</span>
            <span>${totalItems} unidade${totalItems !== 1 ? 's' : ''} total</span>
        `;
    }
}

window.setInquiryQty = function(productId, value) {
    const item = inquiryCart.find(i => i.product.id === productId);
    if (!item) return;

    let parsed = parseInt(value);
    if (isNaN(parsed) || parsed < 1) parsed = 1;

    item.quantity = parsed;
    saveInquiryCart();
    updateInquiryCartCountBadge();
    renderInquiryDrawerItems();
};

window.updateInquiryQty = function(productId, delta) {
    const item = inquiryCart.find(item => item.product.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity < 1) item.quantity = 1;

    saveInquiryCart();
    updateInquiryCartCountBadge();
    renderInquiryDrawerItems();
};

window.removeInquiryItem = function(productId) {
    inquiryCart = inquiryCart.filter(item => item.product.id !== productId);
    saveInquiryCart();
    updateInquiryCartCountBadge();
    renderInquiryDrawerItems();
};

function saveInquiryCart() {
    localStorage.setItem("ludex_inquiry_cart", JSON.stringify(inquiryCart));
}

function loadInquiryCart() {
    const saved = localStorage.getItem("ludex_inquiry_cart");
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Re-hydrate with full product objects from PRODUCTS array
            inquiryCart = parsed.map(savedItem => {
                const product = PRODUCTS.find(p => p.id === savedItem.product.id);
                return product ? { product, quantity: savedItem.quantity } : null;
            }).filter(Boolean);
        } catch (e) {
            inquiryCart = [];
        }
    }
}

// Send the order list directly via WhatsApp
window.sendOrderViaWhatsApp = function() {
    if (inquiryCart.length === 0) return;

    let msg = `Bom dia, LUDEX LEMINE.\n\n`;
    msg += `Tenho interesse nos seguintes produtos:\n\n`;

    inquiryCart.forEach(item => {
        msg += `- ${item.product.name}\n`;
        msg += `  Quantidade: ${item.quantity} ${item.product.unit}\n\n`;
    });

    msg += `Poderia enviar-me uma cotacao? Obrigado.`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/244937304805?text=${encoded}`, '_blank');

    // Clear cart and update UI
    inquiryCart = [];
    saveInquiryCart();
    updateInquiryCartCountBadge();
    renderInquiryDrawerItems();
};
