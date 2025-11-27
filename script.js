// Production-ready JavaScript with proper error handling and API integration
const DEFAULT_FIREBASE_CONFIG = {
    apiKey: "PASTE_YOUR_FIREBASE_API_KEY",
    authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
    projectId: "PASTE_YOUR_PROJECT_ID",
    storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
    messagingSenderId: "PASTE_YOUR_SENDER_ID",
    appId: "PASTE_YOUR_APP_ID"
};

class QuickBitesApp {
    constructor() {
        this.currentUser = null;
        this.cart = [];
        this.currentCollege = null;
        this.currentCafeteria = null;
        this.isLoading = false;
        this.orderToken = null;
        this.firebaseApp = null;
        this.auth = null;
        
        this.initializeApp();
    }

    async initializeApp() {
        try {
            await this.loadInitialData();
            this.setupEventListeners();
            this.initializeFirebase();
            this.watchAuthState();
            this.showToast('Welcome to QuickBite!', 'success');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showToast('Failed to load application', 'error');
        }
    }

    async loadInitialData() {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.colleges = [
            {
                id: "abes",
                name: "ABES Engineering College",
                location: "Ghaziabad",
                icon: "fas fa-graduation-cap",
                cafeterias: ["Main Cafeteria", "Food Court", "Craving Cafe"],
                image: "https://www.elcamino.edu/campus-life/dining/images/hero-dining.jpg",
                description: "Premier engineering college with multiple dining options"
            },
            {
                id: "abesit",
                name: "ABES Institute Of Technology",
                location: "Ghaziabad",
                icon: "fas fa-robot",
                cafeterias: ["Main Cafeteria"],
                image: "https://www.coahomacc.edu/_resources/images/CafeRemodel22.jpg",
                description: "Information technology focused campus with modern facilities"
            },
            {
                id: "ims ghaziabad",
                name: "IMS GHAZIABAD",
                location: "Ghaziabad",
                icon: "fas fa-briefcase",
                cafeterias: ["Main Cafeteria","Central Cafeteria", "North Block Cafe"],
                image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Management and technology institute"
            },
            {
                id: "kiet",
                name: "KIET Group of Institutions",
                location: "Ghaziabad",
                icon: "fas fa-project-diagram",
                cafeterias: ["Main Cafeteria", "Engineering Block Cafe", "MBA Cafeteria"],
                image: "https://www.elcamino.edu/campus-life/dining/images/hero-dining.jpg",
                description: "Multi-disciplinary educational group"
            },
            {
                id: "ims",
                name: "IMS Engineering College",
                location: "Ghaziabad",
                icon: "fas fa-drafting-compass",
                cafeterias: ["Main Cafeteria", "Library Cafe"],
                image: "https://www.coahomacc.edu/_resources/images/CafeRemodel22.jpg",
                description: "Engineering and management studies"
            },
            {
                id: "akg",
                name: "Ajay Kumar Garg Engineering College",
                location: "Ghaziabad",
                icon: "fas fa-code",
                cafeterias: ["Main Cafeteria", "Tech Hub Cafe"],
                image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Technical education excellence"
            }
        ];

        this.menuItems = {
            "Main Cafeteria": [
                // Breakfast Items
                { id: 1, name: "Samosa", description: "Crispy pastry with spiced potato filling", price: 15, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", category: "Breakfast", veg: true },
                { id: 2, name: "Poha", description: "Flattened rice with onions, peanuts and spices", price: 30, image: "https://madhurasrecipe.com/wp-content/uploads/2020/10/Steamed-Poha-Hindi-Recipe.jpg", category: "Breakfast", veg: true },
                { id: 3, name: "Chai", description: "Hot spiced milk tea", price: 10, image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", category: "Breakfast", veg: true },
                { id: 4, name: "Sandwich", description: "Grilled vegetable sandwich with chutney", price: 40, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", category: "Breakfast", veg: true },
                { id: 5, name: "Masala Dosa", description: "Crispy dosa with potato filling", price: 60, image: "https://c.ndtvimg.com/2023-08/1neu2ido_dosa_625x300_03_August_23.jpg", category: "Breakfast", veg: true },
                
                // Lunch Items
                { id: 6, name: "Veg Thali", description: "Complete meal with rice, dal, vegetables, roti", price: 120, image: "https://img.freepik.com/free-photo/delicious-food-table_23-2150857814.jpg?semt=ais_hybrid&w=740&q=80", category: "Lunch", veg: true },
                { id: 7, name: "Chole Bhature", description: "Spicy chickpeas with fried bread", price: 80, image: "https://i.ytimg.com/vi/wAv-mFU7eus/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD4QzhyIzsn3bEMvu2NXaXRKS7qgg", category: "Lunch", veg: true },
                { id: 8, name: "Rajma Chawal", description: "Kidney beans curry with steamed rice", price: 90, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0l5hPzOwAdv0nuijnuzBcih4nQvLstqXJvg&s", category: "Lunch", veg: true },
                { id: 9, name: "Paneer Tikka", description: "with rich tomato gravy", price: 150, image: "https://i0.wp.com/cookingfromheart.com/wp-content/uploads/2017/03/Paneer-Tikka-Masala-4.jpg?fit=1024%2C683&ssl=1", category: "Lunch", veg: true },
                
                // Snacks Items
                { id: 10, name: "French Fries", description: "Crispy golden potato fries", price: 40, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", category: "Snacks", veg: true },
                { id: 11, name: "Vada Pav", description: "Spicy potato fritter in bread bun", price: 25, image: "https://blog.swiggy.com/wp-content/uploads/2024/11/Image-1_mumbai-vada-pav-1024x538.png", category: "Snacks", veg: true },
                { id: 12, name: "Pav Bhaji", description: "Spiced vegetable curry with buttered buns", price: 70, image: "https://bluenilekitchen.com/wp-content/uploads/2024/08/Pav-Bhaji.jpg", category: "Snacks", veg: true },
                { id: 13, name: "Paneer Roll", description: "Cottage cheese wrap with mint chutney", price: 60, image: "https://thumbs.dreamstime.com/b/selective-focus-indian-food-paneer-roll-kathi-ai-generated-content-design-background-instagram-facebook-wall-painting-324276989.jpg", category: "Snacks", veg: true },
                
                // Beverages
                { id: 14, name: "Cold Coffee", description: "Iced coffee with cream and ice cream", price: 50, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", category: "Beverages", veg: true },
                { id: 15, name: "Lassi", description: "Sweet yogurt drink", price: 35, image: "https://www.spicypunch.com/wp-content/uploads/2019/06/lassi-recipe.jpg", category: "Beverages", veg: true },
                { id: 16, name: "Fresh Lime Soda", description: "Refreshing lime drink with soda", price: 30, image: "https://soufflebombay.com/wp-content/uploads/2023/01/Homemade-Lime-Soda-1.jpg", category: "Beverages", veg: true }
            ],
            "Food Court": [
                { id: 5, name: "Veg Burger", description: "Fresh vegetable burger with cheese", price: 50, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", category: "Snacks", veg: true },
                { id: 6, name: "French Fries", description: "Crispy golden fries", price: 40, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", category: "Snacks", veg: true },
                { id: 7, name: "Pasta", description: "Creamy white sauce pasta", price: 70, image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", category: "Lunch", veg: true }
            ],
            "Craving Cafe": [
                { id: 8, name: "Samosa", description: "Crispy pastry with potato filling", price: 15, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", category: "Snacks", veg: true },
                { id: 9, name: "Tea", description: "Hot milk tea", price: 10, image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", category: "Beverages", veg: true },
                { id: 10, name: "Cold Coffee", description: "Iced coffee with cream", price: 40, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", category: "Beverages", veg: true }
            ],
            "Tech Cafe": [
                { id: 11, name: "Sandwich", description: "Grilled vegetable sandwich", price: 45, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", category: "Snacks", veg: true },
                { id: 12, name: "Pizza Slice", description: "Cheese and vegetable pizza", price: 65, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", category: "Snacks", veg: true },
                { id: 13, name: "Fruit Smoothie", description: "Fresh fruits blended with yogurt", price: 80, image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", category: "Beverages", veg: true }
            ],
            "Central Cafeteria": [
                { id: 20, name: "Executive Lunch Platter", description: "Chef-curated platter with seasonal veggies and dal", price: 150, image: "https://static.tossdown.com/images/7d9af060-461e-4d04-b072-6752e0581e38.webp", category: "Lunch", veg: true },
                { id: 21, name: "Tandoori Paneer Wrap", description: "Whole wheat wrap stuffed with grilled paneer", price: 90, image: "https://d3cm4d6rq8ed33.cloudfront.net/media/navpravartakfiles/19/afb464a2-7bb9-4496-9182-5caa31f2ba6f.png", category: "Snacks", veg: true }
            ],
            "North Block Cafe": [
                { id: 22, name:"Samosa", description: "Crispy pastry with potato filling", price: 15, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", category: "Snacks", veg: true }, 
                { id: 23, name: "Fruits Bowl", description: "Granola, yogurt, seeds and seasonal fruits", price: 85, image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=500&q=80", category: "Breakfast", veg: true }
            ],
            "Engineering Block Cafe": [
                { id: 24, name: "Circuit Special Maggi", description: "Masala Maggi with veggies for quick refuel", price: 45, image: "https://media.istockphoto.com/id/1443175406/photo/masala-maggi-noodles-instant-maggi-noodles-served-in-a-bowl-closeup-with-selective-focus-and.jpg?s=612x612&w=0&k=20&c=JorOCIQxXhQ4IdG6qAbWjkGgWVnYr9x_toxstVIZ2aQ=", category: "Snacks", veg: true },
                { id: 25, name: "Combo Sandwich", description: "Triple-layer grilled sandwich with cheese & corn", price: 65, image: "https://media-cdn.tripadvisor.com/media/photo-s/10/62/64/3d/classic-sandwich-combo.jpg", category: "Snacks", veg: true }
            ],
            "MBA Cafeteria": [
                { id: 26, name: "Boardroom Bowl", description: "Quinoa, roasted veggies, feta & herb dressing", price: 130, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80", category: "Lunch", veg: true },
                { id: 27, name: "Espresso Shot Duo", description: "Twin espresso shots with biscotti", price: 60, image: "https://cdn.shopify.com/s/files/1/0551/0981/2291/files/black-coffee-glass-slices-bread-with-seeds.jpg?v=1756456371", category: "Beverages", veg: true }
            ],
            "Library Cafe": [
                { id: 28, name: "Silent Study Sandwich", description: "Wholegrain bread with cucumber & mint mayo", price: 55, image: "https://media-cdn.tripadvisor.com/media/photo-s/10/62/64/3d/classic-sandwich-combo.jpg", category: "Snacks", veg: true },
                { id: 29, name: "Calm Chamomile Tea", description: "Herbal infusion to accompany long reading hours", price: 40, image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=500&q=80", category: "Beverages", veg: true }
            ],
            "Tech Hub Cafe": [
                { id: 30, name: "Hackathon Burrito", description: "Spicy bean and rice burrito to keep coders fueled", price: 110, image: "https://d18zdz9g6n5za7.cloudfront.net/blog/1020/1020-761-spicy-shrimp-burritos-with-beans-and-rice-976f.jpg", category: "Lunch", veg: true },
                { id: 31, name: "Binary Brownie", description: "Double chocolate brownie with walnuts", price: 50, image: "https://www.foodnetwork.com/content/dam/images/food/fullset/2024/11/04/double_chocolate_fig_and_walnut_brownies_s4x3.jpg", category: "Dessert", veg: true }
            ]
        };
    }

    setupEventListeners() {
        // Auth events
        document.getElementById('loginBtn').addEventListener('click', () => this.showAuthModal('login'));
        document.getElementById('signupBtn').addEventListener('click', () => this.showAuthModal('signup'));

        const closeAuthBtn = this.ensureAuthCloseButton();
        if (closeAuthBtn) {
            closeAuthBtn.addEventListener('click', () => this.hideAuthModal());
        }
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());

        // Navigation events
        document.getElementById('startOrderBtn').addEventListener('click', () => this.scrollToSection('colleges'));
        document.getElementById('backToCafeterias').addEventListener('click', () => this.handleBackToCafeterias());
        document.getElementById('newOrderBtn').addEventListener('click', () => this.handleNewOrder());

        // Cart events
        document.getElementById('cartIcon').addEventListener('click', () => this.toggleCart());
        document.getElementById('closeCart').addEventListener('click', () => this.toggleCart());
        document.getElementById('checkoutBtn').addEventListener('click', () => this.handleCheckout());

        // Auth forms
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signupForm').addEventListener('submit', (e) => this.handleSignup(e));

        // Auth tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchAuthTab(tabName);
            });
        });

        // College links in footer
        document.querySelectorAll('a[data-college]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const collegeId = e.target.dataset.college;
                this.handleCollegeSelect(collegeId);
                this.scrollToSection('colleges');
            });
        });

        this.renderColleges();
    }

    renderColleges() {
        const grid = document.getElementById('collegeGrid');
        grid.innerHTML = this.colleges.map(college => `
            <div class="college-card" data-id="${college.id}">
                <div class="college-icon">
                    <i class="${college.icon}"></i>
                </div>
                <h3>${college.name}</h3>
                <p>${college.description}</p>
                <div class="college-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${college.location}, Ghaziabad</span>
                </div>
            </div>
        `).join('');

        grid.querySelectorAll('.college-card').forEach(card => {
            card.addEventListener('click', () => {
                const collegeId = card.dataset.id;
                this.handleCollegeSelect(collegeId);
            });
        });
    }

    handleCollegeSelect(collegeId) {
        this.currentCollege = this.colleges.find(c => c.id === collegeId);
        document.getElementById('collegeCafeteriasTitle').textContent = `${this.currentCollege.name} - Cafeterias`;
        this.renderCafeterias();
        this.showSection('cafeteriasSection');
        this.scrollToSection('cafeteriasSection');
    }

    renderCafeterias() {
        const grid = document.getElementById('cafeteriasGrid');
        grid.innerHTML = this.currentCollege.cafeterias.map(cafeteria => `
            <div class="cafeteria-card" data-name="${cafeteria}">
                ${!this.currentUser ? `
                    <div class="login-overlay active">
                        <i class="fas fa-lock"></i>
                        <p>Login to access menu</p>
                        <button class="btn btn-primary" onclick="app.showAuthModal('login')">
                            Login Now
                        </button>
                    </div>
                ` : ''}
                <div class="cafeteria-img" style="background-image: url('${this.currentCollege.image}')">
                    <div class="cafeteria-status">Open</div>
                </div>
                <div class="cafeteria-info">
                    <h3>${cafeteria}</h3>
                    <p>Preorder from ${cafeteria} at ${this.currentCollege.name}</p>
                    <div class="cafeteria-meta">
                        <div class="rating">
                            <i class="fas fa-star"></i>
                            <span>4.2</span>
                        </div>
                        <div class="time">Preorder available</div>
                    </div>
                </div>
            </div>
        `).join('');

        grid.querySelectorAll('.cafeteria-card').forEach(card => {
            card.addEventListener('click', () => {
                if (!this.currentUser) {
                    this.showAuthModal('login');
                    return;
                }
                const cafeteriaName = card.dataset.name;
                this.handleCafeteriaSelect(cafeteriaName);
            });
        });
    }

    handleCafeteriaSelect(cafeteriaName) {
        this.currentCafeteria = cafeteriaName;
        document.getElementById('cafeteriaName').textContent = `${this.currentCollege.name} - ${cafeteriaName}`;
        this.renderMenu();
        this.showSection('menuSection');
        this.scrollToSection('menuSection');
    }

    renderMenu() {
        const grid = document.getElementById('menuGrid');
        const menu = this.menuItems[this.currentCafeteria] || [];
        
        if (menu.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-2xl);">
                    <i class="fas fa-utensils" style="font-size: 3rem; color: var(--gray-300); margin-bottom: var(--space-md);"></i>
                    <h3>Menu Coming Soon</h3>
                    <p>This cafeteria menu is being updated. Please check back later.</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = menu.map(item => `
            <div class="menu-item">
                <div class="menu-img" style="background-image: url('${item.image}')">
                    ${item.veg ? '<div class="veg-indicator"></div>' : ''}
                </div>
                <div class="menu-info">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="menu-meta">
                        <div class="price">₹${item.price}</div>
                        <button class="add-to-cart" data-id="${item.id}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        grid.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleAddToCart(button.dataset.id);
            });
        });
    }

    handleAddToCart(itemId) {
        const item = Object.values(this.menuItems)
            .flat()
            .find(i => i.id == itemId);

        if (!item) return;

        const existingItem = this.cart.find(i => i.id == itemId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...item,
                quantity: 1,
                cafeteria: this.currentCafeteria
            });
        }

        this.updateCart();
        this.showToast(`${item.name} Added to cart!`, 'success');
    }

    updateCart() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = totalItems;

        const itemsContainer = document.getElementById('cartItems');
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (this.cart.length === 0) {
            itemsContainer.innerHTML = `
                <div style="text-align: center; padding: var(--space-2xl); color: var(--gray-600);">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: var(--space-md);"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
        } else {
            itemsContainer.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>₹${item.price} x ${item.quantity}</p>
                    </div>
                    <div class="item-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="app.updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="app.updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        document.getElementById('cartTotal').textContent = total;
        document.getElementById('checkoutBtn').disabled = this.cart.length === 0 || !this.currentUser;
        
        // Show/hide pickup time selector
        const pickupTimeSection = document.getElementById('pickupTimeSection');
        const pickupTimeInput = document.getElementById('pickupTime');
        
        if (this.cart.length > 0 && this.currentUser) {
            pickupTimeSection.style.display = 'block';
            // Set minimum time to 30 minutes from now
            const now = new Date();
            now.setMinutes(now.getMinutes() + 30);
            const minTime = now.toTimeString().slice(0, 5); // HH:MM format
            pickupTimeInput.min = minTime;
            
            // Set default to 1 hour from now if not already set
            if (!pickupTimeInput.value) {
                const defaultTime = new Date();
                defaultTime.setHours(defaultTime.getHours() + 1);
                pickupTimeInput.value = defaultTime.toTimeString().slice(0, 5);
            }
        } else {
            pickupTimeSection.style.display = 'none';
        }
    }

    updateQuantity(itemId, change) {
        const item = this.cart.find(i => i.id == itemId);
        if (!item) return;

        item.quantity += change;
        if (item.quantity <= 0) {
            this.cart = this.cart.filter(i => i.id != itemId);
            this.showToast('Item removed from cart', 'success');
        }

        this.updateCart();
    }

    // Auth methods
    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!this.validateEmail(email)) {
            this.showError('loginEmailError', 'Please enter a valid email');
            return;
        }

        if (password.length < 6) {
            this.showError('loginPasswordError', 'Password must be at least 6 characters');
            return;
        }

        if (!this.auth) {
            this.showToast('Authentication is not configured.', 'error');
            return;
        }

        this.setLoading(true);
        
        try {
            await this.auth.signInWithEmailAndPassword(email, password);
            this.hideAuthModal();
            this.showToast('Login successful!', 'success');
        } catch (error) {
            this.showToast(this.getFirebaseErrorMessage(error, 'login'), 'error');
        } finally {
            this.setLoading(false);
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const phone = document.getElementById('signupPhone').value;
        const password = document.getElementById('signupPassword').value;

        // Validation
        if (!name.trim()) {
            this.showError('signupNameError', 'Name is required');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showError('signupEmailError', 'Please enter a valid email');
            return;
        }

        if (!this.validatePhone(phone)) {
            this.showError('signupPhoneError', 'Please enter a valid phone number');
            return;
        }

        if (password.length < 6) {
            this.showError('signupPasswordError', 'Password must be at least 6 characters');
            return;
        }

        if (!this.auth) {
            this.showToast('Authentication is not configured.', 'error');
            return;
        }

        this.setLoading(true);

        try {
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            if (userCredential.user) {
                await userCredential.user.updateProfile({ displayName: name });
                this.saveUserMeta(userCredential.user.uid, { phone });
            }
            this.hideAuthModal();
            this.showToast('Account created successfully!', 'success');
        } catch (error) {
            this.showToast(this.getFirebaseErrorMessage(error, 'signup'), 'error');
        } finally {
            this.setLoading(false);
        }
    }

    handleLogout() {
        if (!this.auth) {
            this.showToast('Authentication is not configured.', 'error');
            return;
        }

        this.auth.signOut()
            .then(() => {
                this.showToast('Logged out successfully', 'success');
            })
            .catch(error => {
                console.error('Logout failed', error);
                this.showToast('Failed to logout. Please try again.', 'error');
            });
    }

    // Firebase helpers
    initializeFirebase() {
        if (!window.firebase) {
            console.warn('Firebase SDK not loaded. Ensure firebase-app-compat.js and firebase-auth-compat.js are included.');
            return;
        }

        const config = window.firebaseConfig || DEFAULT_FIREBASE_CONFIG;
        if (!config || !config.apiKey || /PASTE/i.test(config.apiKey)) {
            console.warn('Firebase configuration missing or still using placeholder values. Update firebase-config.js with real credentials.');
            this.showToast('Authentication not configured. Update firebase-config.js with your Firebase keys.', 'error');
            return;
        }

        try {
            if (!firebase.apps.length) {
                this.firebaseApp = firebase.initializeApp(config);
            } else {
                this.firebaseApp = firebase.app();
            }
            this.auth = firebase.auth();
        } catch (error) {
            console.error('Failed to initialize Firebase:', error);
            this.showToast('Unable to initialize authentication services.', 'error');
        }
    }

    watchAuthState() {
        if (!this.auth) return;

        this.auth.onAuthStateChanged((user) => {
            if (user) {
                const meta = this.getStoredUserMeta(user.uid);
                const name = user.displayName || user.email.split('@')[0];
                this.currentUser = {
                    name,
                    email: user.email,
                    avatar: name[0].toUpperCase(),
                    phone: meta?.phone || ''
                };
            } else {
                this.currentUser = null;
                this.cart = [];
            }
            this.updateUI();
        }, (error) => {
            console.error('Auth state observer error:', error);
        });
    }

    getStoredUserMeta(uid) {
        if (!uid) return null;
        try {
            const data = localStorage.getItem(`quickBiteUserMeta_${uid}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.warn('Failed to read user meta from storage', error);
            return null;
        }
    }

    saveUserMeta(uid, meta) {
        if (!uid || !meta) return;
        try {
            localStorage.setItem(`quickBiteUserMeta_${uid}`, JSON.stringify(meta));
        } catch (error) {
            console.warn('Failed to save user meta to storage', error);
        }
    }

    getFirebaseErrorMessage(error, flow) {
        if (!error || !error.code) {
            return flow === 'login' ? 'Login failed. Please try again.' : 'Signup failed. Please try again.';
        }

        switch (error.code) {
            case 'auth/user-not-found':
                return 'No account found with this email.';
            case 'auth/wrong-password':
                return 'Incorrect password. Please try again.';
            case 'auth/email-already-in-use':
                return 'This email is already registered.';
            case 'auth/weak-password':
                return 'Password is too weak. Please use at least 6 characters.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            default:
                return error.message || (flow === 'login' ? 'Login failed. Please try again.' : 'Signup failed. Please try again.');
        }
    }

    // UI methods
    updateUI() {
        const userInfo = document.getElementById('userInfo');
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const logoutBtn = document.getElementById('logoutBtn');

        if (this.currentUser) {
            userInfo.style.display = 'flex';
            loginBtn.style.display = 'none';
            signupBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
            document.getElementById('userName').textContent = this.currentUser.name;
            document.getElementById('userAvatar').textContent = this.currentUser.avatar;

            // Remove login overlays
            document.querySelectorAll('.login-overlay').forEach(overlay => {
                overlay.classList.remove('active');
            });
        } else {
            userInfo.style.display = 'none';
            loginBtn.style.display = 'block';
            signupBtn.style.display = 'block';
            logoutBtn.style.display = 'none';

            // Add login overlays
            document.querySelectorAll('.cafeteria-card').forEach(card => {
                const overlay = card.querySelector('.login-overlay');
                if (overlay) overlay.classList.add('active');
            });
        }

        this.updateCart();
    }

    showAuthModal(tab) {
        document.getElementById('authModal').classList.add('active');
        this.switchAuthTab(tab);
    }

    ensureAuthCloseButton() {
        const modal = document.getElementById('authModal');
        if (!modal) return null;

        let closeBtn = document.getElementById('closeAuth');
        if (!closeBtn) {
            const container = modal.querySelector('.auth-container') || modal;
            closeBtn = document.createElement('button');
            closeBtn.id = 'closeAuth';
            closeBtn.className = 'close-auth';
            closeBtn.setAttribute('aria-label', 'Close authentication modal');
            closeBtn.innerHTML = '<span aria-hidden="true">&times;</span>';
            container.prepend(closeBtn);
        } else if (!closeBtn.innerHTML.includes('&times;')) {
            closeBtn.innerHTML = '<span aria-hidden="true">&times;</span>';
        }

        return closeBtn;
    }

    hideAuthModal() {
        document.getElementById('authModal').classList.remove('active');
        this.clearFormErrors();
    }

    switchAuthTab(tab) {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}Form`).classList.add('active');
    }

    showSection(sectionId) {
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }

    toggleCart() {
        document.getElementById('cartSection').classList.toggle('active');
    }

    async handleCheckout() {
        if (!this.currentUser) {
            this.showAuthModal('login');
            return;
        }

        if (this.cart.length === 0) {
            this.showToast('Your cart is empty', 'error');
            return;
        }

        // Get selected pickup time
        const pickupTimeInput = document.getElementById('pickupTime');
        const selectedTime = pickupTimeInput.value;
        
        if (!selectedTime) {
            this.showToast('Please select a pickup time', 'error');
            return;
        }

        // Generate order token
        this.orderToken = 'QB-' + Math.floor(100000 + Math.random() * 900000);
        
        // Calculate order details
        const orderTotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderItems = this.cart.map(item => `${item.name} x${item.quantity}`).join(', ');
        
        // Format pickup time for display
        const [hours, minutes] = selectedTime.split(':');
        const pickupTimeDisplay = `${parseInt(hours) % 12 || 12}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
        
        // Update order status page
        document.getElementById('tokenNumber').textContent = this.orderToken;
        document.getElementById('qrToken').textContent = this.orderToken;
        document.getElementById('orderCollege').textContent = this.currentCollege.name;
        document.getElementById('orderCafeteria').textContent = this.currentCafeteria;
        document.getElementById('pickupLocation').textContent = 'Counter A';
        document.getElementById('orderTotal').textContent = orderTotal;
        document.getElementById('readyTime').textContent = pickupTimeDisplay;

        // Show order status
        this.showSection('orderStatusSection');
        this.toggleCart();
        
        // Send confirmation email/SMS
        try {
            await this.sendOrderConfirmation({
                orderToken: this.orderToken,
                pickupTime: pickupTimeDisplay,
                orderItems: orderItems,
                orderTotal: orderTotal,
                college: this.currentCollege.name,
                cafeteria: this.currentCafeteria,
                pickupLocation: 'Counter A'
            });
        } catch (error) {
            console.error('Failed to send confirmation:', error);
            // Don't block the order if confirmation fails
        }
        
        this.showToast('Order placed successfully! Confirmation sent to your email/phone.', 'success');
        
        // Clear cart
        this.cart = [];
        this.updateCart();
    }

    async sendOrderConfirmation(orderDetails) {
        if (!this.currentUser) return;

        const { orderToken, pickupTime, orderItems, orderTotal, college, cafeteria, pickupLocation } = orderDetails;
        
        // Prepare confirmation message
        const confirmationMessage = `
Order Confirmed!

Order Number: ${orderToken}
College: ${college}
Cafeteria: ${cafeteria}
Pickup Location: ${pickupLocation}
Pickup Time: ${pickupTime}

Items: ${orderItems}
Total: ₹${orderTotal}

Thank you for ordering with QuickBite!
        `.trim();

        // Send email confirmation
        if (this.currentUser.email) {
            await this.sendEmailConfirmation(this.currentUser.email, orderToken, confirmationMessage, orderDetails);
        }

        // Send SMS confirmation if phone number is available
        if (this.currentUser.phone) {
            await this.sendSMSConfirmation(this.currentUser.phone, confirmationMessage);
        }
    }

    async sendEmailConfirmation(email, orderToken, message, orderDetails) {
        try {
            // Check if EmailJS is available and configured
            if (typeof emailjs === 'undefined') {
                console.warn('EmailJS SDK not loaded. Check that the script is included in index.html');
                return;
            }

            if (!window.EMAILJS_PUBLIC_KEY || window.EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY_HERE') {
                console.warn('EmailJS not configured. Update emailjs-config.js with your credentials.');
                return;
            }

            if (!window.EMAILJS_SERVICE_ID || !window.EMAILJS_TEMPLATE_ID) {
                console.warn('EmailJS Service ID or Template ID missing. Check emailjs-config.js');
                return;
            }

            // Initialize EmailJS (only needs to be done once)
            if (!this.emailjsInitialized) {
                emailjs.init(window.EMAILJS_PUBLIC_KEY);
                this.emailjsInitialized = true;
            }
            
            const templateParams = {
                to_email: email,
                to_name: this.currentUser.name,
                order_token: orderToken,
                order_number: orderToken,
                pickup_time: orderDetails.pickupTime,
                order_items: orderDetails.orderItems,
                order_total: `₹${orderDetails.orderTotal}`,
                college: orderDetails.college,
                cafeteria: orderDetails.cafeteria,
                pickup_location: orderDetails.pickupLocation,
                message: message
            };

            const response = await emailjs.send(
                window.EMAILJS_SERVICE_ID,
                window.EMAILJS_TEMPLATE_ID,
                templateParams
            );
            
            console.log('Email confirmation sent successfully to:', email);
            console.log('EmailJS Response:', response);
        } catch (error) {
            console.error('Failed to send email confirmation:', error);
            console.error('Error details:', error.text || error.message);
            // Don't throw - order is still successful
        }
    }

    async sendSMSConfirmation(phone, message) {
        try {
            // SMS requires a backend service for security (never expose API keys in frontend)
            // Option 1: Use Firebase Cloud Functions (recommended)
            if (this.firebaseApp && firebase.functions) {
                try {
                    const sendSMS = firebase.functions().httpsCallable('sendOrderSMS');
                    await sendSMS({ 
                        phone: phone.replace(/\D/g, ''), // Clean phone number
                        message: message 
                    });
                    console.log('SMS confirmation sent successfully to:', phone);
                    return;
                } catch (error) {
                    console.warn('Firebase Functions not available or not configured:', error);
                }
            }
            
            // Option 2: Call your custom backend API
            const smsEndpoint = window.SMS_API_ENDPOINT || 'http://localhost:3000/api/send-sms';
            
            try {
                const response = await fetch(smsEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phone: phone.replace(/\D/g, ''),
                        message: message
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                
                if (result.success) {
                    console.log('SMS confirmation sent successfully to:', phone);
                    console.log('Message ID:', result.messageId);
                    return;
                } else {
                    throw new Error(result.error || 'Failed to send SMS');
                }
            } catch (error) {
                console.warn('SMS API endpoint not available or error occurred:', error);
                console.log('Make sure the backend server is running at:', smsEndpoint);
                console.log('See backend/README.md for setup instructions');
            }
        } catch (error) {
            console.error('Failed to send SMS confirmation:', error);
            // Don't throw - order is still successful
        }
    }

    handleBackToCafeterias() {
        this.showSection('cafeteriasSection');
    }

    handleNewOrder() {
        this.showSection('colleges');
        this.scrollToSection('colleges');
    }

    scrollToSection(sectionId) {
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    }

    // Utility methods
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validatePhone(phone) {
        const re = /^[6-9]\d{9}$/;
        return re.test(phone.replace(/\D/g, ''));
    }

    showError(elementId, message) {
        const element = document.getElementById(elementId);
        element.textContent = message;
        element.classList.add('show');
    }

    clearFormErrors() {
        document.querySelectorAll('.error-message').forEach(error => {
            error.classList.remove('show');
        });
    }

    setLoading(loading) {
        this.isLoading = loading;
        document.body.classList.toggle('loading', loading);
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
            ${message}
        `;
        
        document.getElementById('toastContainer').appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

}

let app = null;

document.addEventListener('DOMContentLoaded', () => {
    window.app = new QuickBitesApp();
    app = window.app;

    // Close modal when clicking outside
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                app.hideAuthModal();
            }
        });
    }

    // Close cart when clicking outside (for mobile)
    document.addEventListener('click', (e) => {
        const cart = document.getElementById('cartSection');
        const cartIcon = document.getElementById('cartIcon');
        
        if (cart && cart.classList.contains('active') && 
            !cart.contains(e.target) && 
            cartIcon && !cartIcon.contains(e.target)) {
            app.toggleCart();
        }
    });

    // Handle filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // Filter logic would go here in a real implementation
        });
    });

    // Handle category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // Category filter logic would go here
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Add loading state for better UX
    document.body.classList.add('loaded');
});