import React, { useState, useEffect } from "react";

/*
  PRIMARY CONTAINER for RecipeVault
  - Manages layout: sidebar (categories), main area (recipe list, controls)
  - Scaffolds authentication, category, and recipes management features
  - Applies light theme and color scheme
*/

const COLORS = {
  primary: "#4CAF50",
  secondary: "#FFC107",
  accent: "#FF5722",
  text: "#212121",
  textLight: "#ffffff",
  lightBg: "#f8f8fd",
  border: "#e0e0e0",
};

/* Basic inline styles for structure and theme */
const styles = {
  root: {
    minHeight: "100vh",
    display: "flex",
    background: COLORS.lightBg,
    color: COLORS.text,
    fontFamily: "'Inter','Roboto','Segoe UI',Arial,sans-serif",
  },
  sidebar: {
    width: 240,
    minWidth: 180,
    background: "#fff",
    borderRight: `1px solid ${COLORS.border}`,
    padding: "24px 0 24px 0",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 18,
    position: "relative",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: COLORS.lightBg,
    padding: "0",
  },
  topbar: {
    background: "#fff",
    borderBottom: `1px solid ${COLORS.border}`,
    minHeight: 60,
    display: "flex",
    alignItems: "center",
    padding: "0 32px",
    justifyContent: "space-between",
    zIndex: 2,
    boxSizing: "border-box",
  },
  logo: {
    fontWeight: 700,
    fontSize: 24,
    color: COLORS.primary,
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  authSection: {
    display: "flex",
    alignItems: "center",
    gap: 18,
  },
  content: {
    flex: 1,
    padding: "38px 38px 0 38px",
    minHeight: "0",
    overflowY: "auto",
    background: COLORS.lightBg,
  },
  categoryBtn: (isActive) => ({
    display: "block",
    width: "100%",
    background: isActive ? COLORS.primary : "#fff",
    color: isActive ? "#fff" : COLORS.text,
    border: "none",
    textAlign: "left",
    padding: "12px 32px",
    borderRadius: "20px 0 0 20px",
    fontWeight: isActive ? "600" : "400",
    fontSize: "1rem",
    cursor: "pointer",
    outline: "none",
    margin: "2px 0",
    transition: "background 0.15s",
  }),
  sidebarHeader: {
    paddingLeft: 32,
    fontSize: 17,
    marginBottom: 8,
    fontWeight: 600,
    color: COLORS.primary,
    letterSpacing: 0.1,
  },
  addCategoryBtn: {
    margin: "8px 0 0 32px",
    color: COLORS.accent,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    border: "none",
    background: "none",
    padding: 0,
    textAlign: "left",
  },
  recipeHeader: {
    fontSize: "2rem",
    fontWeight: 700,
    color: COLORS.primary,
    marginBottom: 20,
    letterSpacing: 0.2,
  },
  recipeCard: {
    background: "#fff",
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: "20px 22px",
    marginBottom: 24,
    boxShadow: "0 1px 6px 0 #eee",
    position: "relative",
  },
  cardHeader: {
    fontWeight: 600,
    fontSize: "1.3rem",
    marginBottom: 8,
    color: COLORS.primary,
  },
  recipeBtns: {
    position: "absolute",
    top: 14,
    right: 15,
    display: "flex",
    gap: 8,
  },
  primaryBtn: {
    background: COLORS.primary,
    color: "#fff",
    border: "none",
    borderRadius: 5,
    padding: "7px 16px",
    fontWeight: 500,
    cursor: "pointer",
    fontSize: 14,
    marginRight: 3,
  },
  accentBtn: {
    background: COLORS.accent,
    color: "#fff",
    border: "none",
    borderRadius: 5,
    padding: "7px 14px",
    fontWeight: 500,
    cursor: "pointer",
    fontSize: 14,
  },
  secondaryBtn: {
    background: COLORS.secondary,
    color: "#fff",
    border: "none",
    borderRadius: 5,
    padding: "7px 12px",
    fontWeight: 500,
    cursor: "pointer",
    fontSize: 14,
  },
  muted: {
    color: "#9e9eae",
    fontSize: 13,
  },
  recipeList: {
    marginTop: 15,
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  searchBox: {
    marginBottom: 18,
    display: "flex",
    gap: "14px",
    alignItems: "center",
  },
  searchInput: {
    fontSize: 16,
    padding: "8px 14px",
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    width: 260,
  },
};

// Dummy starter data for MVP
const DUMMY_CATEGORIES = [
  { id: 0, name: "All" },
  { id: 1, name: "Breakfast" },
  { id: 2, name: "Lunch" },
  { id: 3, name: "Dinner" },
  { id: 4, name: "Desserts" },
];
const DUMMY_RECIPES = [
  {
    id: 100,
    title: "Classic Pancakes",
    category: 1,
    description: "Fluffy pancakes made with love.",
    author: "admin",
  },
  {
    id: 101,
    title: "Caramel Custard",
    category: 4,
    description: "Old-fashioned, sweet caramel dessert.",
    author: "chefjen",
  },
];

/**
  PUBLIC_INTERFACE
  RecipeVaultContainer
  The main container for RecipeVault, provides layout, authentication, recipes, and categories UI.
**/
function RecipeVaultContainer() {
  // --- Authentication State ---
  // 'user' object: null if not logged in, otherwise { name: string, isAdmin: bool }
  const [user, setUser] = useState(null);

  // --- Category State ---
  const [categories, setCategories] = useState(DUMMY_CATEGORIES); // could be loaded from API
  const [selectedCategory, setSelectedCategory] = useState(0);

  // --- Recipe State ---
  const [recipes, setRecipes] = useState(DUMMY_RECIPES); // usually loaded via API
  const [search, setSearch] = useState("");

  // --- Modal State (create/edit forms) ---
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Filtered recipes by category && search query
  const filteredRecipes = recipes.filter((r) => {
    const catMatch =
      selectedCategory === 0 ? true : r.category === selectedCategory;
    const searchMatch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  // Simulated API calls for adding/editing/deleting
  const handleLogin = (username, password) => {
    // Demo: admin login
    if (username === "admin" && password === "admin") {
      setUser({ name: "admin", isAdmin: true });
      setShowAuthModal(false);
      return;
    }
    // Demo: user login
    if (username === "user" && password === "user") {
      setUser({ name: "user", isAdmin: false });
      setShowAuthModal(false);
      return;
    }
    alert("Invalid login!");
  };

  const handleRegister = (username, password) => {
    setUser({ name: username, isAdmin: false });
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddRecipe = (data) => {
    const newId = Math.max(...recipes.map((r) => r.id)) + 1;
    setRecipes([
      ...recipes,
      {
        ...data,
        id: newId,
        author: user ? user.name : "unknown",
      },
    ]);
    setShowRecipeModal(false);
  };

  const handleEditRecipe = (id, updatedData) => {
    setRecipes(
      recipes.map((r) => (r.id === id ? { ...r, ...updatedData } : r))
    );
    setShowRecipeModal(false);
    setRecipeToEdit(null);
  };

  const handleDeleteRecipe = (id) => {
    if (!window.confirm("Delete this recipe? This cannot be undone.")) return;
    setRecipes(recipes.filter((r) => r.id !== id));
  };

  const handleAddCategory = (name) => {
    const newId = Math.max(...categories.map((c) => c.id)) + 1;
    setCategories([...categories, { id: newId, name }]);
    setShowCategoryModal(false);
  };

  // --- Render Functions: Modals (Inline for simplicity) ---
  function AuthModal() {
    const [uname, setUname] = useState("");
    const [pw, setPw] = useState("");
    return (
      <div style={{
        position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", display: "flex",
        justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.16)", zIndex: 2000,
      }}>
        <div style={{
          minWidth: 340, minHeight: 220, background: "#fff", borderRadius: 12, padding: "32px 38px",
          boxShadow: "0 4px 24px 0 #aaa", display: "flex", flexDirection: "column", alignItems: "stretch",
        }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 20, color: COLORS.primary }}>
            {authMode === "login" ? "Sign in to RecipeVault" : "Register New Account"}
          </div>
          <input
            autoFocus
            type="text"
            placeholder="Username"
            style={{
              margin: "8px 0", padding: "10px", fontSize: 15, borderRadius: 6,
              border: `1px solid ${COLORS.border}`, outline: "none",
            }}
            value={uname}
            onChange={(ev) => setUname(ev.target.value)}
            onKeyDown={(e) => e.key === "Enter" && document.getElementById("authPwInput").focus()}
          />
          <input
            type="password"
            id="authPwInput"
            placeholder="Password"
            style={{
              margin: "8px 0 19px 0", padding: "10px", fontSize: 15, borderRadius: 6,
              border: `1px solid ${COLORS.border}`, outline: "none",
            }}
            value={pw}
            onChange={(ev) => setPw(ev.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                authMode === "login"
                  ? handleLogin(uname, pw)
                  : handleRegister(uname, pw);
              }
            }}
          />
          <button
            style={styles.primaryBtn}
            onClick={() => authMode === "login" ? handleLogin(uname, pw) : handleRegister(uname, pw)}
          >
            {authMode === "login" ? "Login" : "Register"}
          </button>
          <div style={{ marginTop: 10, fontSize: 13 }}>
            {authMode === "login"
              ? <>No account? <button style={{ color: COLORS.primary, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontSize: 13 }} onClick={() => setAuthMode("register")}>Register</button></>
              : <>Already registered? <button style={{ color: COLORS.primary, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontSize: 13 }} onClick={() => setAuthMode("login")}>Sign In</button></>
            }
          </div>
          <button style={{ ...styles.addCategoryBtn, marginTop: 16, color: COLORS.accent }} onClick={() => setShowAuthModal(false)}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  function RecipeModal() {
    const editing = !!recipeToEdit;
    const [title, setTitle] = useState(editing ? recipeToEdit.title : "");
    const [description, setDescription] = useState(editing ? recipeToEdit.description : "");
    const [category, setCategory] = useState(editing ? recipeToEdit.category : categories[1]?.id || 1);

    function onSubmit(e) {
      e.preventDefault();
      if (!title || !description) {
        alert("Please fill in all fields!");
        return;
      }
      const recipeData = { title, description, category: Number(category) };
      if (editing) {
        handleEditRecipe(recipeToEdit.id, recipeData);
      } else {
        handleAddRecipe(recipeData);
      }
    }

    return (
      <div style={{
        position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", display: "flex",
        justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.16)", zIndex: 2000,
      }}>
        <form onSubmit={onSubmit} style={{
          minWidth: 380, background: "#fff", borderRadius: 12, padding: "38px 48px",
          boxShadow: "0 4px 24px 0 #aaa", display: "flex", flexDirection: "column",
        }}>
          <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 18, color: COLORS.primary }}>
            {editing ? "Edit Recipe" : "Add New Recipe"}
          </div>
          <input
            type="text"
            autoFocus
            placeholder="Recipe Title"
            style={{
              margin: "8px 0", padding: "10px", fontSize: 16, borderRadius: 6,
              border: `1px solid ${COLORS.border}`, outline: "none",
            }}
            value={title}
            onChange={ev => setTitle(ev.target.value)}
          />
          <textarea
            placeholder="Recipe Description"
            style={{
              margin: "8px 0", padding: "10px", fontSize: 15, borderRadius: 6,
              border: `1px solid ${COLORS.border}`, outline: "none", minHeight: 84,
              resize: "vertical"
            }}
            value={description}
            onChange={ev => setDescription(ev.target.value)}
          />
          <select value={category} onChange={e => setCategory(e.target.value)} style={{
            margin: "8px 0 18px 0", padding: "10px", fontSize: 15, borderRadius: 6,
            border: `1px solid ${COLORS.border}`, outline: "none",
          }}>
            {categories.filter(c => c.id !== 0).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button type="submit" style={styles.primaryBtn}>
            {editing ? "Save Changes" : "Add Recipe"}
          </button>
          <button
            type="button"
            style={{ ...styles.addCategoryBtn, marginTop: 12, color: COLORS.accent }}
            onClick={() => {
              setShowRecipeModal(false);
              setRecipeToEdit(null);
            }}
          >Cancel</button>
        </form>
      </div>
    );
  }

  function CategoryModal() {
    const [catName, setCatName] = useState("");
    function onAdd(e) {
      e.preventDefault();
      if (catName.trim() && !(categories.some(c => c.name.toLowerCase() === catName.toLowerCase()))) {
        handleAddCategory(catName.trim());
      }
    }
    return (
      <div style={{
        position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", display: "flex",
        justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.13)", zIndex: 2000,
      }}>
        <form onSubmit={onAdd} style={{
          minWidth: 320, background: "#fff", borderRadius: 12, padding: "30px 35px",
          boxShadow: "0 4px 24px 0 #aaa", display: "flex", flexDirection: "column",
        }}>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 12, color: COLORS.primary }}>
            Add Category
          </div>
          <input
            autoFocus
            type="text"
            maxLength={18}
            style={{
              margin: "8px 0 20px 0", padding: "10px", fontSize: 15, borderRadius: 6,
              border: `1px solid ${COLORS.border}`, outline: "none",
            }}
            value={catName}
            onChange={e => setCatName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") onAdd(e); }}
            placeholder="Category Name"
          />
          <button type="submit" style={styles.primaryBtn}>Add</button>
          <button
            type="button"
            style={{ ...styles.addCategoryBtn, marginTop: 12, color: COLORS.accent }}
            onClick={() => setShowCategoryModal(false)}
          >Cancel</button>
        </form>
      </div>
    );
  }

  // --- UI Render ---
  return (
    <div style={styles.root}>
      {/* Sidebar (categories) */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>Categories</div>
        {categories.map((cat) => (
          <button
            key={cat.id}
            style={styles.categoryBtn(selectedCategory === cat.id)}
            onClick={() => setSelectedCategory(cat.id)}
            aria-current={selectedCategory === cat.id}
          >
            {cat.name}
          </button>
        ))}
        {user?.isAdmin && (
          <button style={styles.addCategoryBtn} onClick={() => setShowCategoryModal(true)}>
            + Add Category
          </button>
        )}
      </aside>
      {/* Main Area (topbar + recipe content) */}
      <div style={styles.main}>
        {/* Top bar: logo, auth controls */}
        <header style={styles.topbar}>
          <div style={styles.logo}>
            <span style={{ color: COLORS.accent, fontWeight: 900, fontSize: 20 }}>⏳</span>
            RecipeVault
          </div>
          <div style={styles.authSection}>
            {user ? (
              <>
                <span style={{ fontWeight: 500, marginRight: 10, color: COLORS.text }}>
                  {user.isAdmin ? <span style={{ color: COLORS.primary, fontWeight: 700 }}>Admin</span> : null}
                  {user.name}
                </span>
                <button style={styles.accentBtn} onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <button style={styles.primaryBtn} onClick={() => {
                setShowAuthModal(true);
                setAuthMode("login");
              }}>Login / Register</button>
            )}
          </div>
        </header>
        {/* Main content with recipes & controls */}
        <div style={styles.content}>
          <div style={styles.recipeHeader}>
            {selectedCategory === 0 ? "All Recipes" : categories.find(c => c.id === selectedCategory)?.name + " Recipes"}
          </div>
          {/* Recipe Search and Add */}
          <div style={styles.searchBox}>
            <input
              style={styles.searchInput}
              type="search"
              value={search}
              placeholder="Search recipes..."
              onChange={e => setSearch(e.target.value)}
            />
            {user?.isAdmin && (
              <button
                style={styles.primaryBtn}
                onClick={() => {
                  setRecipeToEdit(null);
                  setShowRecipeModal(true);
                }}
              >
                + Add Recipe
              </button>
            )}
            <span style={{ flex: 1 }} />
            <span style={styles.muted}>
              {filteredRecipes.length} {filteredRecipes.length === 1 ? "result" : "results"}
            </span>
          </div>
          {/* List of Recipes */}
          <div style={styles.recipeList}>
            {!filteredRecipes.length && (
              <div style={{ padding: 26, color: COLORS.muted, textAlign: "center" }}>
                No recipes found in this category.
              </div>
            )}
            {filteredRecipes.map((rec) => (
              <div key={rec.id} style={styles.recipeCard}>
                <div style={styles.cardHeader}>{rec.title}</div>
                <div style={{ fontSize: 15, marginBottom: 10 }}>{rec.description}</div>
                <div style={{ color: "#7f8c8d", fontSize: 13, marginTop: 6 }}>
                  by <strong style={{color:COLORS.accent}}>{rec.author}</strong>
                  {" · "}
                  {categories.find(c => c.id === rec.category)?.name}
                </div>
                {(user?.isAdmin) && (
                  <div style={styles.recipeBtns}>
                    <button
                      style={styles.secondaryBtn}
                      onClick={() => {
                        setRecipeToEdit(rec);
                        setShowRecipeModal(true);
                      }}
                    >Edit</button>
                    <button
                      style={styles.accentBtn}
                      onClick={() => handleDeleteRecipe(rec.id)}
                    >Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAuthModal && <AuthModal />}
      {showRecipeModal && <RecipeModal />}
      {showCategoryModal && <CategoryModal />}
    </div>
  );
}

export default RecipeVaultContainer;
