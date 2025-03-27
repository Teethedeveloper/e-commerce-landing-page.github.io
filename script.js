import { useMemo, useEffect, useState, useCallback, useRef } from "https://esm.sh/react";
import { createSlice, createAsyncThunk, configureStore } from "https://esm.sh/@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "https://esm.sh/react-redux";
import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";
import { createRoot } from "https://esm.sh/react-dom/client";

// Async thunk to fetch products
const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) throw new Error("Failed to fetch products.");
    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
});

const fetchCategoryProducts = createAsyncThunk('products/fetchCategoryProducts', async category => {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/category/${category}`);
    if (!response.ok) throw new Error("Failed to fetch category products.");
    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    error: null,
    discount: 0,
    promoCode: null,
    enteredPromoCode: "",
    promoMessage: "" },

  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.error = null;
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      if (state.items.length === 0) {
        state.discount = 0;
        state.promoCode = null;
      }
      state.promoMessage = ""; // Reset promoMessage when items are removed
      state.error = null;
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item && action.payload.quantity > 0) item.quantity = action.payload.quantity; // Ensure valid quantity
      state.error = null;
    },
    applyDiscount: (state, action) => {
      if (!state.promoCode) {
        state.discount = action.payload.discount;
        state.promoCode = action.payload.code;
        state.promoMessage = `Promo Code ${action.payload.code} applied!`; // Set success message
      }
    },
    removePromoCode: state => {
      state.discount = 0;
      state.promoCode = null;
      state.enteredPromoCode = ""; // 
      state.promoMessage = "";
    },
    setEnteredPromoCode: (state, action) => {
      state.enteredPromoCode = action.payload;
    },
    setPromoMessage: (state, action) => {
      state.promoMessage = action.payload;
    } } });



const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [], error: null },
  reducers: {
    addToWishlist: (state, action) => {
      if (state.items.length >= 3) {
        state.error = "Wishlist is full. Remove an item to add a new one.";
      } else {
        state.items.push(action.payload);
        state.error = null;
      }
    },
    removeFromWishlist: (state, action) => {
      if (state.items.length === 0) {
        state.error = "Wishlist is empty";
      } else {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.error = null;
      }
    } } });



const productSlice = createSlice({
  name: "products",
  initialState: { products: [], filtered: [], filter: "all", search: "", currentPage: 1, totalPages: 0, status: 'idle', error: null },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
      state.filtered = action.payload === "all" ?
      state.products :
      state.products.filter(product => product.category === action.payload);
      state.currentPage = 1;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.filtered = state.products.filter((product) =>
      product.title.toLowerCase().includes(action.payload.toLowerCase()));

      state.currentPage = 1; // Reset to first page after search
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    } },

  extraReducers: builder => {
    builder.
    addCase(fetchProducts.pending, state => {
      state.status = 'loading';
    }).
    addCase(fetchProducts.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.products = action.payload;
      state.filtered = action.payload;
      state.totalPages = Math.ceil(action.payload.length / 6);
    }).
    addCase(fetchProducts.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  } });


// Store Setup
const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    products: productSlice.reducer,
    wishlist: wishlistSlice.reducer } });



const Navbar = () => {
  const navRef = useRef(null);

  useEffect(() => {
    if (navRef.current) {
      new bootstrap.ScrollSpy(navRef.current, {
        target: "#navbarNav",
        offset: 50 });

    }
  }, []);

  return /*#__PURE__*/(
    React.createElement("nav", {
      ref: navRef,
      className: "navbar navbar-expand-lg fixed-top px-5",
      style: { backgroundColor: "#d065e6" } }, /*#__PURE__*/

    React.createElement("span", { className: "navbar-brand text-white" }, "DOPAMINE99 ", /*#__PURE__*/
    React.createElement("i", { className: "fa-regular fa-face-laugh-beam" })), /*#__PURE__*/

    React.createElement("button", {
      className: "navbar-toggler",
      type: "button",
      "data-bs-toggle": "collapse",
      "data-bs-target": "#navbarNav",
      "aria-controls": "navbarNav",
      "aria-expanded": "false",
      "aria-label": "Toggle navigation" }, /*#__PURE__*/

    React.createElement("span", { className: "navbar-toggler-icon" })), /*#__PURE__*/

    React.createElement("div", { className: "collapse navbar-collapse", id: "navbarNav" }, /*#__PURE__*/
    React.createElement("ul", { className: "navbar-nav ms-auto" }, /*#__PURE__*/
    React.createElement("li", { className: "nav-item" }, /*#__PURE__*/
    React.createElement("a", { className: "nav-link text-white", href: "#shop" }, "Shop")), /*#__PURE__*/



    React.createElement("li", { className: "nav-item" }, /*#__PURE__*/
    React.createElement("a", { className: "nav-link text-white", href: "#about" }, "About")), /*#__PURE__*/



    React.createElement("li", { className: "nav-item" }, /*#__PURE__*/
    React.createElement("a", { className: "nav-link text-white", href: "#deliveries" }, "Deliveries")), /*#__PURE__*/



    React.createElement("li", { className: "nav-item" }, /*#__PURE__*/
    React.createElement("a", { className: "nav-link text-white", href: "#terms" }, "T&Cs"))))));







};

// Components
const ProductCard = React.memo(({ product, onAddToCart, onAddToWishlist }) => /*#__PURE__*/
React.createElement("div", { className: "col-md-2 mb-4" }, /*#__PURE__*/
React.createElement("div", { className: "card p-3 product-card" }, /*#__PURE__*/
React.createElement("img", {
  src: product.image,
  alt: product.title,
  className: "card-img-top product-image",
  loading: "lazy" }), /*#__PURE__*/

React.createElement("h5", { className: "card-title" }, product.title), /*#__PURE__*/
React.createElement("p", { className: "card-text" }, "$", product.price), /*#__PURE__*/

React.createElement("div", { className: "product-description-container" }, /*#__PURE__*/
React.createElement("p", { className: "card-text product-description" }, product.description)), /*#__PURE__*/

React.createElement("button", { className: "btn btn-primary", onClick: () => onAddToCart(product) }, "Add to Cart"), /*#__PURE__*/
React.createElement("button", { className: "btn btn-outline-danger ms-2", onClick: () => onAddToWishlist(product) }, /*#__PURE__*/
React.createElement("i", { className: "fa fa-heart" }), " Wishlist"))));





const ProductList = () => {
  const dispatch = useDispatch();
  const { filtered: products, filter, search, currentPage, status, error } = useSelector(state => state.products);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [search]);

  useEffect(() => {
    if (filter === "all") {
      dispatch(fetchProducts());
    } else {
      dispatch(fetchCategoryProducts(filter));
    }
  }, [dispatch, filter]);

  useEffect(() => {
    if (debouncedSearch) {
      dispatch(productSlice.actions.setSearch(debouncedSearch));
    }
  }, [debouncedSearch, dispatch]);

  const filteredProducts = useMemo(() => {
    return products.
    filter(product => product.category === filter || filter === 'all').
    slice((currentPage - 1) * 6, currentPage * 6);
  }, [products, currentPage, filter]);

  const onAddToCart = useCallback(product => {
    dispatch(cartSlice.actions.addToCart(product));
  }, [dispatch]);

  const onAddToWishlist = useCallback(product => {
    dispatch(wishlistSlice.actions.addToWishlist(product));
  }, [dispatch]);

  if (status === 'loading') {
    return /*#__PURE__*/(
      React.createElement("div", { id: "shop", className: "container mt-3" }, /*#__PURE__*/
      React.createElement("h2", null, "Shop here!"), /*#__PURE__*/
      React.createElement("div", { className: "d-flex justify-content-center" }, /*#__PURE__*/
      React.createElement("div", { className: "spinner-border text-primary", role: "status" }, /*#__PURE__*/
      React.createElement("span", { className: "sr-only" }, "Loading...")))));




  }

  if (status === 'failed') return /*#__PURE__*/React.createElement("div", null, "Error: ", error);

  return /*#__PURE__*/(
    React.createElement("div", { id: "shop", className: "container mt-3" }, /*#__PURE__*/
    React.createElement("h2", null, "Shop here!"), /*#__PURE__*/


    React.createElement("div", { className: "search-filter-container mb-3" }, /*#__PURE__*/
    React.createElement("input", {
      type: "text",
      className: "form-control search-input",
      placeholder: "Search Products...",
      value: search,
      onChange: e => dispatch(productSlice.actions.setSearch(e.target.value)) })), /*#__PURE__*/




    React.createElement("div", { className: "search-filter-container mb-3" }, /*#__PURE__*/
    React.createElement("select", {
      className: "form-select filter-select",
      value: filter,
      onChange: e => dispatch(productSlice.actions.setFilter(e.target.value)) }, /*#__PURE__*/

    React.createElement("option", { value: "all" }, "All"), /*#__PURE__*/
    React.createElement("option", { value: "jewelery" }, "Jewellery"), /*#__PURE__*/
    React.createElement("option", { value: "electronics" }, "Electronics"), /*#__PURE__*/
    React.createElement("option", { value: "men's clothing" }, "Men's Clothing"), /*#__PURE__*/
    React.createElement("option", { value: "women's clothing" }, "Women's Clothing"))), /*#__PURE__*/




    React.createElement("div", { className: "row" },
    filteredProducts.map((product) => /*#__PURE__*/
    React.createElement(ProductCard, {
      key: product.id,
      product: product,
      onAddToCart: product => dispatch(cartSlice.actions.addToCart(product)),
      onAddToWishlist: onAddToWishlist // Pass the addToWishlist function here
    }))), /*#__PURE__*/




    React.createElement("div", { className: "pagination" },
    currentPage > 1 && /*#__PURE__*/
    React.createElement("button", {
      className: "btn btn-link pagination-btn",
      onClick: () => dispatch(productSlice.actions.setPage(currentPage - 1)) }, /*#__PURE__*/

    React.createElement("i", { className: "fa fa-arrow-circle-left", "aria-hidden": "true" })),



    Array.from({ length: Math.ceil(products.filter(p => p.category === filter || filter === 'all').length / 6) }, (_, i) => /*#__PURE__*/
    React.createElement("button", {
      key: i,
      className: "btn btn-link pagination-btn",
      onClick: () => dispatch(productSlice.actions.setPage(i + 1)) },

    i + 1)),



    currentPage < Math.ceil(products.filter(p => p.category === filter || filter === 'all').length / 6) && /*#__PURE__*/
    React.createElement("button", {
      className: "btn btn-link pagination-btn",
      onClick: () => dispatch(productSlice.actions.setPage(currentPage + 1)) }, /*#__PURE__*/

    React.createElement("i", { className: "fa fa-arrow-circle-right", "aria-hidden": "true" })))));





};

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const discount = useSelector(state => state.cart.discount);
  const promoCode = useSelector(state => state.cart.promoCode);
  const enteredPromoCode = useSelector(state => state.cart.enteredPromoCode);
  const promoMessage = useSelector(state => state.cart.promoMessage);

  const validPromoCodes = {
    "SAVE10": 0.10, // 10% discount
    "SAVE20": 0.20, // 20% discount
    "FREE5": 0.05 // 5% discount
  };

  const applyPromoCode = () => {
    if (validPromoCodes[enteredPromoCode] && !promoCode) {
      dispatch(cartSlice.actions.applyDiscount({
        discount: validPromoCodes[enteredPromoCode],
        code: enteredPromoCode }));

    } else {
      dispatch(cartSlice.actions.setPromoMessage("Invalid promo code or promo code already applied."));
      dispatch(cartSlice.actions.setEnteredPromoCode("")); // Clear input on invalid code
    }
  };

  const removePromoCode = () => {
    dispatch(cartSlice.actions.removePromoCode());
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0) * (1 - discount);
  };

  return /*#__PURE__*/(
    React.createElement("div", { id: "cart", className: "container mt-3" }, /*#__PURE__*/
    React.createElement("h2", null, "Cart ", /*#__PURE__*/React.createElement("i", { className: "fa fa-shopping-cart", "aria-hidden": "true" })),

    cartItems.length === 0 ? /*#__PURE__*/
    React.createElement("p", null, "No items in the cart.") : /*#__PURE__*/

    React.createElement("div", null, /*#__PURE__*/
    React.createElement("div", { className: "cart-items" },
    cartItems.map((item) => /*#__PURE__*/
    React.createElement("div", { key: item.id, className: "cart-item" }, /*#__PURE__*/
    React.createElement("p", null, item.title, " x ", item.quantity), /*#__PURE__*/
    React.createElement("p", null, "$", (item.price * item.quantity).toFixed(2)), /*#__PURE__*/
    React.createElement("button", { className: "btn btn-danger", onClick: () => dispatch(cartSlice.actions.removeFromCart(item.id)) }, "Remove")))), /*#__PURE__*/






    React.createElement("div", { className: "discount-section" }, /*#__PURE__*/
    React.createElement("input", {
      type: "text",
      placeholder: "Enter Promo Code",
      value: enteredPromoCode,
      onChange: e => dispatch(cartSlice.actions.setEnteredPromoCode(e.target.value)) }),

    !promoCode ? /*#__PURE__*/
    React.createElement("button", { className: "btn btn-primary", onClick: applyPromoCode }, "Apply Promo Code") : /*#__PURE__*/



    React.createElement("button", { className: "btn btn-danger", onClick: removePromoCode }, "Remove Promo Code"),

    promoMessage && /*#__PURE__*/
    React.createElement("p", { className: `promo-message ${promoMessage.includes("successfully") ? "success" : "error"}` },
    promoMessage)), /*#__PURE__*/




    React.createElement("h3", null, "Total Price: $", getTotalPrice().toFixed(2)))));




};

const WishlistModal = ({ show, handleClose }) => {
  const wishlistItems = useSelector(state => state.wishlist.items);
  const wishlistError = useSelector(state => state.wishlist.error);
  const dispatch = useDispatch();

  const handleAddToCart = item => {
    // Dispatch the addToCart action to add the item to the cart
    dispatch(cartSlice.actions.addToCart(item));
    // Dispatch the removeFromWishlist action to remove the item from the wishlist
    dispatch(wishlistSlice.actions.removeFromWishlist(item.id));
  };

  const handleRemoveFromWishlist = item => {
    dispatch(wishlistSlice.actions.removeFromWishlist(item.id)); // Correctly dispatching the action
  };

  return /*#__PURE__*/(
    React.createElement("div", { className: `modal fade ${show ? "show d-block" : "d-none"}`, tabIndex: "-1" }, /*#__PURE__*/
    React.createElement("div", { className: "modal-dialog" }, /*#__PURE__*/
    React.createElement("div", { className: "modal-content" }, /*#__PURE__*/
    React.createElement("div", { className: "modal-header" }, /*#__PURE__*/
    React.createElement("h5", { className: "modal-title" }, "Your Wishlist"), /*#__PURE__*/
    React.createElement("button", { type: "button", className: "btn-close", onClick: handleClose })), /*#__PURE__*/

    React.createElement("div", { className: "modal-body" },
    wishlistError && /*#__PURE__*/React.createElement("p", { className: "alert alert-danger" }, wishlistError),
    wishlistItems.length === 0 ? /*#__PURE__*/
    React.createElement("p", null, "Your wishlist is empty.") : /*#__PURE__*/

    React.createElement("ul", { className: "list-group" },
    wishlistItems.map((item) => /*#__PURE__*/
    React.createElement("li", { key: item.id, className: "list-group-item d-flex justify-content-between align-items-center" }, /*#__PURE__*/
    React.createElement("span", null, item.title), /*#__PURE__*/
    React.createElement("div", null, /*#__PURE__*/
    React.createElement("button", {
      className: "btn btn-success btn-sm me-2",
      onClick: () => handleAddToCart(item),
      "aria-label": `Add ${item.title} to cart` }, "Add to Cart"), /*#__PURE__*/


    React.createElement("button", {
      className: "btn btn-danger btn-sm",
      onClick: () => handleRemoveFromWishlist(item),
      "aria-label": `Remove ${item.title} from wishlist` }, "Remove")))))), /*#__PURE__*/









    React.createElement("div", { className: "modal-footer" }, /*#__PURE__*/
    React.createElement("button", { className: "btn btn-secondary", onClick: handleClose }, "Close"))))));







};

const WishlistButton = () => {
  const [showModal, setShowModal] = useState(false);

  return /*#__PURE__*/(
    React.createElement("div", { class: "center-button" }, /*#__PURE__*/
    React.createElement("button", { className: "btn btn-outline-danger", onClick: () => setShowModal(true) }, /*#__PURE__*/
    React.createElement("i", { className: "fa fa-heart" }), " View Wishlist"), /*#__PURE__*/

    React.createElement(WishlistModal, { show: showModal, handleClose: () => setShowModal(false) })));


};

const About = () => /*#__PURE__*/
React.createElement("div", { id: "about", className: "container mt-3" }, /*#__PURE__*/
React.createElement("h2", null, "About"), /*#__PURE__*/
React.createElement("p", null, "At Dopamine99, we believe that fashion is more than just clothes; it's an expression of individuality. Our carefully curated collection of clothing and jewellery is designed to help you feel confident and stylish, whether you're dressing for a special occasion or everyday wear."), /*#__PURE__*/

React.createElement("h3", null, "Our Story"), /*#__PURE__*/
React.createElement("p", null, "Founded with a passion for quality and creativity, Dopamine99 brings together timeless clothing pieces and stunning jewellery designs to elevate your wardrobe. From casual wear to elegant evening attire, we\u2019ve got something for everyone. Our jewellery collection adds that perfect touch of sparkle to any outfit, whether you're looking for delicate pieces or statement accessories."), /*#__PURE__*/

React.createElement("h3", null, "What We Offer"), /*#__PURE__*/
React.createElement("ul", null, /*#__PURE__*/
React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Clothing:"), " Trendy, comfortable, and versatile pieces that cater to all occasions."), /*#__PURE__*/
React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Jewellery:"), " Exquisite designs that elevate your personal style."), /*#__PURE__*/
React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Personalized service:"), " Dedicated to finding the perfect match for your needs.")), /*#__PURE__*/


React.createElement("h3", null, "Our Mission"), /*#__PURE__*/
React.createElement("p", null, "We aim to provide high-quality products at affordable prices, all while supporting ethical practices and sustainable sourcing. Our team is committed to delivering an exceptional shopping experience and helping you find the perfect pieces that align with your style and values."), /*#__PURE__*/

React.createElement("h3", null, "Sustainability"), /*#__PURE__*/
React.createElement("p", null, "We are committed to sustainability and strive to reduce our environmental impact through eco-friendly packaging and sustainable materials. Our goal is to provide beautiful products that you can feel good about purchasing."), /*#__PURE__*/

React.createElement("h3", null, "Why Choose Us?"), /*#__PURE__*/
React.createElement("p", null, "We offer a wide variety of stylish, high-quality clothing and jewelry at affordable prices, paired with excellent customer service. Whether you're shopping for yourself or someone special, we\u2019ve got the perfect piece to make you feel confident and stylish."));




const Deliveries = () => /*#__PURE__*/
React.createElement("div", { id: "deliveries", className: "container mt-3" }, /*#__PURE__*/
React.createElement("h2", null, "Deliveries"), /*#__PURE__*/
React.createElement("p", null, /*#__PURE__*/
React.createElement("ul", null, /*#__PURE__*/
React.createElement("li", null, "We offer shipping within South Africa."), /*#__PURE__*/
React.createElement("li", null, "Estimated delivery times are 5 business days for domestic orders and 7 for international orders."), /*#__PURE__*/
React.createElement("li", null, "Shipping fees are calculated at checkout. Free shipping is available for orders over $100."), /*#__PURE__*/
React.createElement("li", null, "We are not responsible for lost, stolen, or delayed shipments after dispatch."))));





const TermsAndConditions = () => /*#__PURE__*/
React.createElement("div", { id: "terms", className: "container mt-3" }, /*#__PURE__*/
React.createElement("h2", null, "T&Cs"), /*#__PURE__*/
React.createElement("p", null, /*#__PURE__*/
React.createElement("ul", null, /*#__PURE__*/
React.createElement("b", null, "Introduction"), /*#__PURE__*/
React.createElement("li", null, "Dopamine99 operates this website to sell clothing and jewellery."), /*#__PURE__*/
React.createElement("li", null, "By using our website, you accept these terms. If you do not agree, please refrain from using our services.")), /*#__PURE__*/

React.createElement("ul", null, /*#__PURE__*/
React.createElement("b", null, "Orders & Payment"), /*#__PURE__*/
React.createElement("li", null, "We accept the following payment methods for all transactions processed on our platform: Visa, Mastercard, and PayPal."), /*#__PURE__*/
React.createElement("li", null, "Prices are in dollars and include applicable taxes unless stated otherwise."), /*#__PURE__*/
React.createElement("li", null, "Orders are processed within 2 business days."), /*#__PURE__*/
React.createElement("li", null, "We reserve the right to cancel orders due to pricing errors or stock unavailability."), /*#__PURE__*/
React.createElement("li", null, "Once an order is placed, cancellations are only possible before shipping.")), /*#__PURE__*/

React.createElement("ul", null, /*#__PURE__*/
React.createElement("b", null, "Product Descriptions & Pricing"), /*#__PURE__*/
React.createElement("li", null, "We strive to provide accurate product descriptions and images; however, colors may vary due to screen settings."), /*#__PURE__*/
React.createElement("li", null, "Prices are subject to change without notice."), /*#__PURE__*/
React.createElement("li", null, "We reserve the right to correct any pricing or typographical errors.")), /*#__PURE__*/

React.createElement("ul", null, /*#__PURE__*/
React.createElement("b", null, "Privacy Policy & Data Protection"), /*#__PURE__*/
React.createElement("li", null, "Your personal information is collected, stored, and used in compliance with applicable data protection laws (e.g., GDPR, POPIA)."), /*#__PURE__*/
React.createElement("li", null, "We do not sell or share your information with third parties without your consent.")), /*#__PURE__*/

React.createElement("ul", null, /*#__PURE__*/
React.createElement("b", null, "Intellectual Property Rights"), /*#__PURE__*/
React.createElement("li", null, "All designs, images, text, and content on this website are the property of Dopamine99 and are protected by copyright and trademark laws."), /*#__PURE__*/
React.createElement("li", null, "You may not reproduce, distribute, or resell any content without permission.")), /*#__PURE__*/

React.createElement("ul", null, /*#__PURE__*/
React.createElement("b", null, "Liability & Disclaimers"), /*#__PURE__*/
React.createElement("li", null, "We are not responsible for allergic reactions or sensitivities to our products. Please check product materials before purchasing."), /*#__PURE__*/
React.createElement("li", null, "We do not guarantee uninterrupted or error-free website access."), /*#__PURE__*/
React.createElement("li", null, "Our liability is limited to the amount paid for the product in question.")), /*#__PURE__*/

React.createElement("ul", null, /*#__PURE__*/
React.createElement("b", null, "User Conduct & Restrictions"), /*#__PURE__*/
React.createElement("li", null, "Users must not misuse the website (fraudulent activity, hacking, false reviews, etc.)."), /*#__PURE__*/
React.createElement("li", null, "We reserve the right to terminate accounts violating our policies.")), /*#__PURE__*/

React.createElement("ul", null, /*#__PURE__*/
React.createElement("b", null, "Dispute Resolution & Governing Law"), /*#__PURE__*/
React.createElement("li", null, "Disputes shall first be resolved through negotiation."), /*#__PURE__*/
React.createElement("li", null, "If unresolved, disputes will be subject to arbitration in South Africa."), /*#__PURE__*/
React.createElement("li", null, "These terms are governed by the laws of South Africa."))));





const ContactForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = e => {
    e.preventDefault();

    // Simple email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email.");
      return;
    }

    // Replace this with an API call if needed
    alert("Thank you for subscribing!");
    setEmail(""); // Clear the input after submission
  };

  return /*#__PURE__*/(

    React.createElement("div", { className: "contact-section text-center p-4" }, /*#__PURE__*/
    React.createElement("h3", null, "For special deals:"), /*#__PURE__*/
    React.createElement("form", { onSubmit: handleSubmit }, /*#__PURE__*/
    React.createElement("div", { className: "m-3" }, /*#__PURE__*/
    React.createElement("label", { htmlFor: "email", className: "form-label" }, "Email ", /*#__PURE__*/React.createElement("i", { class: "fa fa-envelope", "aria-hidden": "true" }), ":"), /*#__PURE__*/
    React.createElement("input", {
      type: "email",
      className: "form-control contact-input",
      id: "email",
      placeholder: "Enter your email",
      value: email,
      onChange: e => setEmail(e.target.value),
      required: true })), /*#__PURE__*/


    React.createElement("button", { type: "submit", className: "btn btn-primary contact-btn" }, "Submit"))));



};

const Footer = () => {
  const [showFaq, setShowFaq] = useState(false);

  const toggleFaq = () => {
    setShowFaq(prev => !prev);
  };

  useEffect(() => {
    // Initialize toast when the component mounts
    const toastTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="toast"]'));
    const toastList = toastTriggerList.map(function (toastTriggerEl) {
      return new window.bootstrap.Toast(toastTriggerEl);
    });
  }, []);

  return /*#__PURE__*/(
    React.createElement("footer", { className: "text-white text-center p-3 mt-5", style: { backgroundColor: "#d065e6" } }, /*#__PURE__*/
    React.createElement("p", null, "\xA9 2025 Dopamine99. All rights reserved."), /*#__PURE__*/
    React.createElement("p", null, "Contact us on", /*#__PURE__*/

    React.createElement("a", { href: "https://facebook.com", target: "_blank", rel: "noopener noreferrer", className: "text-white mx-2" }, /*#__PURE__*/
    React.createElement("i", { className: "fab fa-facebook fa-2x" })), /*#__PURE__*/

    React.createElement("a", { href: "https://twitter.com", target: "_blank", rel: "noopener noreferrer", className: "text-white mx-2" }, /*#__PURE__*/
    React.createElement("i", { className: "fab fa-twitter fa-2x" })), /*#__PURE__*/

    React.createElement("a", { href: "https://instagram.com", target: "_blank", rel: "noopener noreferrer", className: "text-white mx-2" }, /*#__PURE__*/
    React.createElement("i", { className: "fab fa-instagram fa-2x" }))), /*#__PURE__*/




    React.createElement("button", {
      onClick: toggleFaq,
      "data-bs-toggle": "toast",
      className: "btn btn-light mt-3",
      style: { backgroundColor: "#d468cb", color: "white" } }, "FAQ"),





    showFaq && /*#__PURE__*/
    React.createElement("div", { className: "toast-container position-fixed bottom-0 end-0 p-3" }, /*#__PURE__*/
    React.createElement("div", {
      id: "faqToast",
      className: "toast show",
      role: "alert",
      "aria-live": "assertive",
      "aria-atomic": "true",
      style: { backgroundColor: "#ffffff", color: "#333" } }, /*#__PURE__*/

    React.createElement("div", {
      className: "toast-header",
      style: {
        backgroundColor: "#a968de",
        color: "#fff",
        position: "relative" } }, /*#__PURE__*/


    React.createElement("strong", { className: "me-auto" }, "Frequently Asked Questions"), /*#__PURE__*/
    React.createElement("button", {
      type: "button",
      className: "btn-close",
      "data-bs-dismiss": "toast",
      "aria-label": "Close",
      style: {
        position: "absolute",
        top: "10px",
        right: "10px",
        color: "#fff",
        zIndex: "10" } })), /*#__PURE__*/



    React.createElement("div", { className: "toast-body", style: { backgroundColor: "#fb8dfc", color: "#ffffff" } }, /*#__PURE__*/
    React.createElement("strong", null, "What products do you sell?"), /*#__PURE__*/
    React.createElement("p", null, "We offer a wide range of clothing and jewelry, including shirts, dresses, accessories, and more."), /*#__PURE__*/
    React.createElement("strong", null, "How can I track my order?"), /*#__PURE__*/
    React.createElement("p", null, "You can track your order through the tracking link sent to your email once your order is shipped."), /*#__PURE__*/
    React.createElement("strong", null, "What is your return policy?"), /*#__PURE__*/
    React.createElement("p", null, "We offer a 30-day return policy for most items. Please check our Returns page for more details."), /*#__PURE__*/
    React.createElement("strong", null, "Do you offer international shipping?"), /*#__PURE__*/
    React.createElement("p", null, "Yes, we ship to several countries worldwide. Shipping fees and delivery times vary by location."), /*#__PURE__*/
    React.createElement("strong", null, "How can I contact customer service?"), /*#__PURE__*/
    React.createElement("p", null, "You can contact us via our support email or through our contact form on the website."))))));






};

const App = () => {
  return /*#__PURE__*/(
    React.createElement(Provider, { store: store }, /*#__PURE__*/
    React.createElement(Navbar, null), /*#__PURE__*/
    React.createElement(ProductList, null), /*#__PURE__*/
    React.createElement(Cart, null), /*#__PURE__*/
    React.createElement(WishlistModal, null), /*#__PURE__*/
    React.createElement(WishlistButton, null), /*#__PURE__*/
    React.createElement(About, null), /*#__PURE__*/
    React.createElement(Deliveries, null), /*#__PURE__*/
    React.createElement(TermsAndConditions, null), /*#__PURE__*/
    React.createElement(ContactForm, null), /*#__PURE__*/
    React.createElement(Footer, null)));


};

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render( /*#__PURE__*/React.createElement(App, null));