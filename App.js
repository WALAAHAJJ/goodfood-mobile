import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  StatusBar,
  Platform,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

/* ---------- Thème ---------- */
const THEME = {
  colors: {
    background: "#F9F6EA",
    primary: "#F8DF9C",
    secondary: "#96C5C4",
    lavender: "#CCC3DA",
    pink: "#EBB4BA",
    text: "#493F4B",
    white: "#FFFFFF",
    stroke: "rgba(73,63,75,0.18)",
    mutedText: "rgba(73,63,75,0.65)",
    shadow: "rgba(73,63,75,0.10)",
  },
  radius: { input: 18, card: 22, button: 18 },
  spacing: { xs: 8, sm: 12, md: 16, lg: 20, xl: 24 },
};

/* ---------- Assets ---------- */
const LOGO_TEXT = require("./assets/logo-text.jpeg");
const LOGO_BADGE = require("./assets/logo-badge.jpg");

/* ---------- Catégories ---------- */
const CATEGORIES = [
  { id: "offers", label: "Offres", icon: "pricetag-outline" },
  { id: "groceries", label: "Courses", icon: "basket-outline" },
  { id: "pizza", label: "Pizza", icon: "pizza-outline" },
  { id: "sushi", label: "Sushi", icon: "fish-outline" },
  { id: "healthy", label: "Healthy", icon: "leaf-outline" },
  { id: "halal", label: "Halal", icon: "sparkles-outline" },
];

/* ---------- Données Restaurants (avec tags de catégories) ---------- */
const RESTAURANTS = [
  {
    id: "r1",
    name: "Pizza Nonna",
    categories: ["pizza", "offers"],
    tags: "italien • pizza",
    eta: "20–30 min",
    fee: "1,99 € livraison",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=60",
  },
  {
    id: "r2",
    name: "Burger Lab",
    categories: ["groceries"],
    tags: "burgers • fast-food",
    eta: "18–28 min",
    fee: "Livraison offerte",
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=60",
  },
  {
    id: "r3",
    name: "Food Time",
    categories: ["healthy", "sushi", "offers"],
    tags: "asian • healthy",
    eta: "15–25 min",
    fee: "Livraison offerte",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?auto=format&fit=crop&w=900&q=60",
  },
  {
    id: "r4",
    name: "Al Medina",
    categories: ["halal"],
    tags: "grillades • halal",
    eta: "25–35 min",
    fee: "2,50 € livraison",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=60",
  },
  {
    id: "r5",
    name: "Sushi Bar+",
    categories: ["sushi"],
    tags: "sushi • japonais",
    eta: "22–30 min",
    fee: "Livraison offerte",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=60",
  },
];

/* ---------- Menus (maquette) ---------- */
const MENU = {
  r1: [
    { id: "r1-m1", title: "Margherita", desc: "Sauce tomate, mozzarella, basilic.", price: 11.9 },
    { id: "r1-m2", title: "Quattro Formaggi", desc: "4 fromages, crème légère.", price: 13.5 },
  ],
  r2: [
    { id: "r2-m1", title: "Classic Burger", desc: "Bœuf, cheddar, sauce maison.", price: 12.5 },
    { id: "r2-m2", title: "Frites", desc: "Frites maison, sel fin.", price: 3.9 },
  ],
  r3: [
    { id: "r3-m1", title: "Green Bowl", desc: "Riz, avocat, légumes croquants.", price: 12.9 },
  ],
  r4: [
    { id: "r4-m1", title: "Assiette Kefta", desc: "Viande hachée grillée, salade, riz.", price: 13.9 },
  ],
  r5: [
    { id: "r5-m1", title: "Sushi Mix 12", desc: "Assortiment 12 pièces.", price: 14.9 },
  ],
};

/* ---------- Components ---------- */
function BrandHeader({ onLogoPress, onLogin, onSignup }) {
  return (
    <View style={styles.brandHeader}>
      {/* Logo plus petit et cliquable */}
      <TouchableOpacity onPress={onLogoPress} activeOpacity={0.85} style={styles.logoHitbox}>
        <Image source={LOGO_TEXT} style={styles.brandLogo} resizeMode="contain" />
      </TouchableOpacity>

      {/* Boutons icônes uniquement */}
      <View style={styles.authRow}>
        <TouchableOpacity onPress={onLogin} activeOpacity={0.85} style={styles.iconBtn}>
          <Ionicons name="log-in-outline" size={20} color={THEME.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onSignup} activeOpacity={0.85} style={styles.iconBtn}>
          <Ionicons name="person-add-outline" size={20} color={THEME.colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PrimaryButton({ title, onPress, icon, disabled }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[styles.btnPrimary, disabled ? { opacity: 0.5 } : null]}
    >
      <Text style={styles.btnPrimaryText}>{title}</Text>
      {icon ? <Ionicons name={icon} size={18} color={THEME.colors.text} style={{ marginLeft: 10 }} /> : null}
    </TouchableOpacity>
  );
}

function SecondaryButton({ title, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.btnSecondary}>
      <Text style={styles.btnSecondaryText}>{title}</Text>
    </TouchableOpacity>
  );
}

/* ------ Auto-complétion adresses (Nominatim) ------ */
function AddressSearch({ value, onChange, onSelected }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const controllerRef = useRef(null);

  useEffect(() => {
    const q = value.trim();
    if (q.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    // Annule la requête précédente
    if (controllerRef.current) controllerRef.current.abort();
    const ctrl = new AbortController();
    controllerRef.current = ctrl;

    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(
      q
    )}`;

    fetch(url, {
      method: "GET",
      headers: { "User-Agent": "GoodFood-Dev/1.0 (+mailto:you@example.com)" },
      signal: ctrl.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        setSuggestions(
          Array.isArray(data)
            ? data.map((d) => ({
                id: d.place_id?.toString() ?? Math.random().toString(),
                label: d.display_name,
                lat: Number(d.lat),
                lon: Number(d.lon),
              }))
            : []
        );
        setOpen(true);
      })
      .catch(() => {
        // ignore erreurs réseau pour la maquette
      });
  }, [value]);

  return (
    <View style={{ position: "relative" }}>
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={THEME.colors.mutedText} />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Adresse, restaurant, plat…"
          placeholderTextColor={THEME.colors.mutedText}
          style={styles.searchInput}
        />
        <TouchableOpacity activeOpacity={0.85} style={styles.searchRightBtn}>
          <Ionicons name="location-outline" size={18} color={THEME.colors.text} />
        </TouchableOpacity>
      </View>

      {open && suggestions.length > 0 && (
        <View style={styles.autocompletePanel}>
          {suggestions.map((sug) => (
            <TouchableOpacity
              key={sug.id}
              onPress={() => {
                onSelected(sug);
                setOpen(false);
              }}
              style={styles.autocompleteItem}
              activeOpacity={0.85}
            >
              <Ionicons name="pin-outline" size={16} color={THEME.colors.text} />
              <Text style={styles.autocompleteText} numberOfLines={1}>
                {sug.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

function CategoryChip({ item, selected, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? THEME.colors.secondary : THEME.colors.white,
          borderColor: selected ? "transparent" : THEME.colors.stroke,
        },
      ]}
    >
      <Ionicons name={item.icon} size={22} color={THEME.colors.text} style={{ marginRight: 10 }} />
      <Text style={styles.chipText}>{item.label}</Text>
    </TouchableOpacity>
  );
}

function RatingPill({ rating }) {
  return (
    <View style={styles.ratingPill}>
      <Ionicons name="star" size={14} color={THEME.colors.text} />
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
}

function RestaurantCard({ item, onPressVoir, onPressQuickAdd }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <RatingPill rating={item.rating} />
        </View>
        <Text style={styles.cardMeta}>
          {item.tags} | {item.eta}
        </Text>
        <Text style={styles.cardFee}>{item.fee}</Text>
        <View style={styles.cardActionsRow}>
          <SecondaryButton title="Voir" onPress={onPressVoir} />
          <TouchableOpacity onPress={onPressQuickAdd} activeOpacity={0.85} style={styles.addCircle}>
            <Ionicons name="add" size={18} color={THEME.colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function MenuItemRow({ item, onAdd }) {
  const priceStr = item.price.toFixed(2).replace(".", ",");
  return (
    <View style={styles.menuRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        <Text style={styles.menuDesc}>{item.desc}</Text>
        <Text style={styles.menuPrice}>{priceStr} €</Text>
      </View>
      <TouchableOpacity onPress={onAdd} activeOpacity={0.85} style={styles.menuAddBtn}>
        <Ionicons name="add" size={18} color={THEME.colors.text} />
      </TouchableOpacity>
    </View>
  );
}

function BottomNav({ active, onChange }) {
  const items = [
    { key: "home", label: "Accueil", icon: "home-outline" },
    { key: "list", label: "Liste", icon: "search-outline" },
    { key: "cart", label: "Panier", icon: "bag-handle-outline" },
  ];
  return (
    <View style={styles.bottomNav}>
      {items.map((it) => {
        const isActive = active === it.key;
        return (
          <TouchableOpacity
            key={it.key}
            style={styles.navItem}
            onPress={() => onChange(it.key)}
            activeOpacity={0.85}
          >
            <Ionicons name={it.icon} size={22} color={THEME.colors.text} style={{ opacity: isActive ? 1 : 0.45 }} />
            <Text style={[styles.navLabel, { opacity: isActive ? 1 : 0.45 }]}>{it.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/* ---------- Écrans ---------- */
function SplashScreen({ onStart }) {
  return (
    <View style={[styles.full, { justifyContent: "center", paddingHorizontal: THEME.spacing.xl }]}>
      <View style={styles.splashCard}>
        <Image source={LOGO_BADGE} style={styles.splashBadge} resizeMode="contain" />
        <Text style={styles.splashTitle}>Une livraison douce, rapide et claire.</Text>
        <Text style={styles.splashText}>
          Explore les restaurants autour de toi, compose ton panier et passe commande en quelques secondes.
        </Text>
        <View style={{ marginTop: 14 }}>
          <PrimaryButton title="Commencer" onPress={onStart} icon="arrow-forward-outline" />
        </View>
      </View>
    </View>
  );
}

function HomeScreen({ goRestaurants, goLogin, goSignup, goHomeFromLogo }) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("offers");
  const [selectedAddress, setSelectedAddress] = useState(null);

  const hour = new Date().getHours();
  const greeting = hour < 18 ? "Bonjour" : "Bonsoir";

  const filtered = useMemo(() => {
    const base =
      activeCat === "offers"
        ? RESTAURANTS.filter((r) => r.fee.toLowerCase().includes("offerte"))
        : RESTAURANTS.filter((r) => r.categories.includes(activeCat));

    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((r) => r.name.toLowerCase().includes(q) || r.tags.toLowerCase().includes(q));
  }, [activeCat, query]);

  return (
    <FlatList
      style={styles.screen}
      data={filtered}
      keyExtractor={(i) => i.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
      ListHeaderComponent={
        <View>
          <BrandHeader
            onLogoPress={goHomeFromLogo}
            onLogin={goLogin}
            onSignup={goSignup}
          />

          <Text style={styles.h1}>{greeting}</Text>
          <Text style={styles.subtitle}>Où souhaites-tu être livré(e) aujourd’hui ?</Text>

          <AddressSearch
            value={query}
            onChange={setQuery}
            onSelected={(s) => {
              setSelectedAddress(s);
              setQuery(s.label);
            }}
          />

          <Text style={styles.h2}>Catégories</Text>
          <View style={styles.categoriesWrap}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
              {CATEGORIES.map((item) => (
                <CategoryChip
                  key={item.id}
                  item={item}
                  selected={activeCat === item.id}
                  onPress={() => setActiveCat(item.id)}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.promo}>
            <View style={{ flex: 1 }}>
              <Text style={styles.promoTitle}>Good Food, version pastel.</Text>
              <Text style={styles.promoText}>
                Découvre des restaurants près de toi et commande en toute simplicité.
              </Text>
              <View style={{ marginTop: 12 }}>
                <PrimaryButton title="Voir les restaurants" onPress={goRestaurants} />
              </View>
              {selectedAddress && (
                <Text style={{ marginTop: 8, color: THEME.colors.mutedText, fontFamily: "Poppins_400Regular" }}>
                  Adresse sélectionnée: {selectedAddress.label}
                </Text>
              )}
            </View>
            <View style={styles.promoIconWrap}>
              <View style={styles.promoIconCircle}>
                <Ionicons name="bicycle-outline" size={22} color={THEME.colors.text} />
              </View>
            </View>
          </View>

          <Text style={styles.h2}>À proximité</Text>
        </View>
      }
      renderItem={({ item }) => (
        <RestaurantCard item={item} onPressVoir={goRestaurants} onPressQuickAdd={() => {}} />
      )}
    />
  );
}

function RestaurantsScreen({ openDetails, quickAdd, onBack }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RESTAURANTS;
    return RESTAURANTS.filter((r) => r.name.toLowerCase().includes(q) || r.tags.toLowerCase().includes(q));
  }, [query]);

  return (
    <View style={styles.screen}>
      <View style={styles.topRowWithBack}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.85} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={20} color={THEME.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.85} style={styles.logoHitbox}>
          <Image source={LOGO_TEXT} style={[styles.brandLogo, { width: 80, height: 64 }]} resizeMode="contain" />
        </TouchableOpacity>
        <View style={{ width: 44 }} />
      </View>

      <Text style={styles.h1}>Restaurants</Text>
      <Text style={styles.subtitle}>Choisis un restaurant et consulte son menu.</Text>

      <AddressSearch
        value={query}
        onChange={setQuery}
        onSelected={(s) => setQuery(s.label)}
      />

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 6 }}
        renderItem={({ item }) => (
          <RestaurantCard item={item} onPressVoir={() => openDetails(item)} onPressQuickAdd={() => quickAdd(item)} />
        )}
      />
    </View>
  );
}

function RestaurantDetailsScreen({ restaurant, onBack, addItem, goCart, cartCount }) {
  const menu = MENU[restaurant.id] || [];
  return (
    <View style={styles.detailsWrap}>
      <View style={styles.detailsHeader}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.85} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={22} color={THEME.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.85} style={styles.logoHitbox}>
          <Image source={LOGO_TEXT} style={[styles.brandLogo, { width: 80, height: 64 }]} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity onPress={goCart} activeOpacity={0.85} style={styles.iconBtn}>
          <Ionicons name="bag-handle-outline" size={18} color={THEME.colors.text} />
        </TouchableOpacity>
      </View>

      <Image source={{ uri: restaurant.image }} style={styles.detailsHero} />

      <View style={styles.detailsInfoCard}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={styles.detailsTitle}>{restaurant.name}</Text>
          <RatingPill rating={restaurant.rating} />
        </View>
        <Text style={styles.detailsMeta}>
          {restaurant.tags} | {restaurant.eta}
        </Text>
        <Text style={styles.detailsFee}>{restaurant.fee}</Text>
      </View>

      <View style={{ paddingHorizontal: THEME.spacing.lg, paddingTop: 8 }}>
        <Text style={styles.h2}>Menu</Text>
      </View>

      <FlatList
        data={menu}
        keyExtractor={(i) => i.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: THEME.spacing.lg, paddingBottom: 140 }}
        renderItem={({ item }) => (
          <MenuItemRow
            item={item}
            onAdd={() =>
              addItem({
                id: item.id,
                title: item.title,
                price: item.price,
                restaurantId: restaurant.id,
                restaurantName: restaurant.name,
                image: restaurant.image,
              })
            }
          />
        )}
      />

      <View style={styles.detailsBottomBar}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={styles.detailsCartCount}>{cartCount === 0 ? "Aucun article" : `${cartCount} article(s)`}</Text>
          <TouchableOpacity onPress={goCart} activeOpacity={0.85} style={styles.detailsCartLink}>
            <Text style={styles.detailsCartLinkText}>Aller au panier</Text>
            <Ionicons name="arrow-forward" size={16} color={THEME.colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function CartScreen({ cartItems, addOne, removeOne, clearCart }) {
  const grouped = useMemo(() => {
    const map = new Map();
    for (const it of cartItems) {
      const key = it.id;
      if (!map.has(key)) map.set(key, { ...it, qty: 0 });
      map.get(key).qty += 1;
    }
    return Array.from(map.values());
  }, [cartItems]);

  const total = useMemo(() => cartItems.reduce((sum, it) => sum + it.price, 0), [cartItems]);
  const totalStr = total.toFixed(2).replace(".", ",");

  return (
    <View style={styles.screen}>
      <View style={styles.simpleTopRow}>
        <Image source={LOGO_TEXT} style={[styles.brandLogo, { width: 80, height: 64 }]} resizeMode="contain" />
        <TouchableOpacity activeOpacity={0.85} style={styles.iconBtn} onPress={() => {}}>
          <Ionicons name="help-circle-outline" size={18} color={THEME.colors.text} />
        </TouchableOpacity>
      </View>

      <Text style={styles.h1}>Panier</Text>
      <Text style={styles.subtitle}>Vérifie tes articles avant de finaliser la commande.</Text>

      {grouped.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Image source={LOGO_BADGE} style={styles.emptyBadge} resizeMode="contain" />
          <Text style={styles.emptyTitle}>Panier vide</Text>
          <Text style={styles.emptyText}>Ajoute un plat depuis un restaurant pour commencer.</Text>
        </View>
      ) : (
        <FlatList
          data={grouped}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingBottom: 160, paddingTop: 12 }}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.cartImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cartTitle}>{item.title}</Text>
                <Text style={styles.cartMeta}>{item.restaurantName}</Text>
                <Text style={styles.cartMeta}>
                  {item.price.toFixed(2).replace(".", ",")} € • x{item.qty}
                </Text>
              </View>
              <View style={styles.qtyBox}>
                <TouchableOpacity onPress={() => removeOne(item.id)} style={styles.qtyBtn}>
                  <Ionicons name="remove" size={16} color={THEME.colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => addOne(item)} style={styles.qtyBtn}>
                  <Ionicons name="add" size={16} color={THEME.colors.text} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <View style={styles.checkoutBar}>
        <View style={styles.checkoutRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{grouped.length === 0 ? "0,00 €" : `${totalStr} €`}</Text>
        </View>
        <PrimaryButton title="Payer" onPress={() => {}} icon="lock-closed-outline" disabled={grouped.length === 0} />
        <View style={{ marginTop: 10 }}>
          <Text style={styles.checkoutNote}>Paiement simulé (maquette).</Text>
          {grouped.length > 0 ? (
            <TouchableOpacity onPress={clearCart} style={{ marginTop: 8 }}>
              <Text style={styles.clearCart}>Vider le panier</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}

/* --- Pages de connexion/inscription (simples maquettes) --- */
function SignInScreen({ onBack }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  return (
    <View style={styles.screen}>
      <View style={styles.topRowWithBack}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.85} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={20} color={THEME.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.85} style={styles.logoHitbox}>
          <Image source={LOGO_TEXT} style={[styles.brandLogo, { width: 80, height: 64 }]} resizeMode="contain" />
        </TouchableOpacity>
        <View style={{ width: 44 }} />
      </View>
      <Text style={styles.h1}>Connexion</Text>
      <View style={{ marginTop: THEME.spacing.lg }}>
        <View style={styles.searchWrap}>
          <Ionicons name="mail-outline" size={18} color={THEME.colors.mutedText} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            style={styles.searchInput}
          />
        </View>
        <View style={[styles.searchWrap, { marginTop: THEME.spacing.md }]}>
          <Ionicons name="lock-closed-outline" size={18} color={THEME.colors.mutedText} />
          <TextInput
            value={pwd}
            onChangeText={setPwd}
            placeholder="Mot de passe"
            secureTextEntry
            style={styles.searchInput}
          />
        </View>
        <View style={{ marginTop: THEME.spacing.lg }}>
          <PrimaryButton title="Se connecter" onPress={() => {}} icon="log-in-outline" />
        </View>
      </View>
    </View>
  );
}

function SignUpScreen({ onBack }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  return (
    <View style={styles.screen}>
      <View style={styles.topRowWithBack}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.85} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={20} color={THEME.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.85} style={styles.logoHitbox}>
          <Image source={LOGO_TEXT} style={[styles.brandLogo, { width: 80, height: 64 }]} resizeMode="contain" />
        </TouchableOpacity>
        <View style={{ width: 44 }} />
      </View>
      <Text style={styles.h1}>Inscription</Text>
      <View style={{ marginTop: THEME.spacing.lg }}>
        <View style={styles.searchWrap}>
          <Ionicons name="mail-outline" size={18} color={THEME.colors.mutedText} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            style={styles.searchInput}
          />
        </View>
        <View style={[styles.searchWrap, { marginTop: THEME.spacing.md }]}>
          <Ionicons name="lock-closed-outline" size={18} color={THEME.colors.mutedText} />
          <TextInput
            value={pwd}
            onChangeText={setPwd}
            placeholder="Mot de passe"
            secureTextEntry
            style={styles.searchInput}
          />
        </View>
        <View style={{ marginTop: THEME.spacing.lg }}>
          <PrimaryButton title="Créer le compte" onPress={() => {}} icon="person-add-outline" />
        </View>
      </View>
    </View>
  );
}

/* ---------- App ---------- */
export default function App() {
  // Navigation minimale
  const [screen, setScreen] = useState("splash"); // splash | home | list | details | cart | signin | signup
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: THEME.colors.text }}>Chargement…</Text>
      </SafeAreaView>
    );
  }

  const openDetails = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setScreen("details");
  };

  const addItemToCart = (menuItem) => setCart((prev) => [...prev, menuItem]);

  const quickAdd = (restaurant) => {
    const first = (MENU[restaurant.id] || [])[0];
    if (!first) return;
    addItemToCart({
      id: first.id,
      title: first.title,
      price: first.price,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      image: restaurant.image,
    });
    setScreen("cart");
  };

  const addOne = (groupedItem) => addItemToCart(groupedItem);
  const removeOne = (menuItemId) => {
    setCart((prev) => {
      const idx = prev.findIndex((x) => x.id === menuItemId);
      if (idx === -1) return prev;
      const copy = prev.slice();
      copy.splice(idx, 1);
      return copy;
    });
  };

  const goTab = (tab) => {
    setScreen(tab);
    if (tab !== "details") setSelectedRestaurant(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      {screen === "splash" ? (
        <SplashScreen onStart={() => setScreen("home")} />
      ) : screen === "home" ? (
        <HomeScreen
          goRestaurants={() => goTab("list")}
          goLogin={() => setScreen("signin")}
          goSignup={() => setScreen("signup")}
          goHomeFromLogo={() => setScreen("home")}
        />
      ) : screen === "list" ? (
        <RestaurantsScreen
          openDetails={openDetails}
          quickAdd={quickAdd}
          onBack={() => setScreen("home")}
        />
      ) : screen === "cart" ? (
        <CartScreen cartItems={cart} addOne={addOne} removeOne={removeOne} clearCart={() => setCart([])} />
      ) : screen === "signin" ? (
        <SignInScreen onBack={() => setScreen("home")} />
      ) : screen === "signup" ? (
        <SignUpScreen onBack={() => setScreen("home")} />
      ) : (
        <RestaurantDetailsScreen
          restaurant={selectedRestaurant}
          onBack={() => goTab("list")}
          addItem={addItemToCart}
          goCart={() => goTab("cart")}
          cartCount={cart.length}
        />
      )}

      {["home", "list", "cart"].includes(screen) ? <BottomNav active={screen} onChange={goTab} /> : null}
    </SafeAreaView>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },
  full: { flex: 1, backgroundColor: THEME.colors.background },

  brandHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: THEME.spacing.md,
  },
  logoHitbox: { paddingVertical: 6, paddingRight: 8 },
  brandLogo: { width: 80, height: 64 }, // plus petit et bien à gauche

  authRow: { flexDirection: "row", alignItems: "center", gap: 10 },

  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: THEME.colors.stroke,
    alignItems: "center",
    justifyContent: "center",
  },

  topRowWithBack: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: THEME.spacing.md,
  },

  simpleTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: THEME.spacing.md,
  },

  screen: { flex: 1, paddingHorizontal: THEME.spacing.lg, paddingTop: THEME.spacing.lg },

  h1: { fontFamily: "Poppins_700Bold", fontSize: 28, color: THEME.colors.text },
  h2: { marginTop: THEME.spacing.lg, fontFamily: "Poppins_600SemiBold", fontSize: 18, color: THEME.colors.text },
  subtitle: { marginTop: 4, fontFamily: "Poppins_400Regular", fontSize: 14, color: THEME.colors.mutedText },

  searchWrap: {
    marginTop: THEME.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: THEME.colors.stroke,
    borderRadius: THEME.radius.input,
    paddingLeft: 14,
    paddingRight: 8,
    height: 52,
  },
  searchInput: { flex: 1, marginLeft: 10, fontFamily: "Poppins_400Regular", color: THEME.colors.text, fontSize: 14 },
  searchRightBtn: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: THEME.colors.background,
    borderWidth: 1,
    borderColor: THEME.colors.stroke,
    alignItems: "center",
    justifyContent: "center",
  },

  autocompletePanel: {
    position: "absolute",
    top: 56,
    left: 0,
    right: 0,
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: THEME.colors.stroke,
    borderRadius: 14,
    paddingVertical: 6,
    zIndex: 20,
  },
  autocompleteItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  autocompleteText: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    color: THEME.colors.text,
    fontSize: 13,
  },

  categoriesWrap: {
    height: 76,
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 8,
  },
  categoriesRow: { paddingRight: 10, paddingLeft: 2, alignItems: "center" },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 58,
    paddingHorizontal: 18,
    borderRadius: 999,
    marginRight: 12,
    borderWidth: 1,
    shadowColor: THEME.colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  chipText: { fontFamily: "Poppins_600SemiBold", color: THEME.colors.text, fontSize: 16 },

  promo: {
    marginTop: THEME.spacing.lg,
    borderRadius: THEME.radius.card,
    padding: THEME.spacing.lg,
    backgroundColor: THEME.colors.lavender,
    borderWidth: 1,
    borderColor: "rgba(73,63,75,0.10)",
    flexDirection: "row",
    gap: 12,
  },
  promoTitle: { fontFamily: "Poppins_700Bold", color: THEME.colors.text, fontSize: 18 },
  promoText: { marginTop: 6, fontFamily: "Poppins_400Regular", color: THEME.colors.mutedText, fontSize: 14 },
  promoIconWrap: { width: 72, alignItems: "flex-end", justifyContent: "center" },
  promoIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: THEME.colors.primary, alignItems: "center", justifyContent: "center" },

  btnPrimary: {
    backgroundColor: THEME.colors.primary,
    height: 48,
    borderRadius: THEME.radius.button,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  btnPrimaryText: { fontFamily: "Poppins_600SemiBold", color: THEME.colors.text, fontSize: 16 },
  btnSecondary: {
    height: 40,
    borderRadius: THEME.radius.button,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: THEME.colors.stroke,
  },
  btnSecondaryText: { fontFamily: "Poppins_500Medium", color: THEME.colors.text, fontSize: 14 },

  card: {
    marginTop: THEME.spacing.md,
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.card,
    borderWidth: 1,
    borderColor: THEME.colors.stroke,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: THEME.colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 18,
    marginLeft: THEME.spacing.md,
    marginTop: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  cardBody: { flex: 1, paddingHorizontal: THEME.spacing.md, paddingVertical: THEME.spacing.sm },
  cardTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  cardTitle: { flex: 1, fontFamily: "Poppins_600SemiBold", fontSize: 16, color: THEME.colors.text },
  cardMeta: { marginTop: 6, fontFamily: "Poppins_400Regular", color: THEME.colors.mutedText, fontSize: 13 },
  cardFee: { marginTop: 6, fontFamily: "Poppins_500Medium", color: THEME.colors.text, fontSize: 13 },
  cardActionsRow: { marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    height: 30,
    borderRadius: 999,
    backgroundColor: THEME.colors.background,
    borderWidth: 1,
    borderColor: THEME.colors.stroke,
  },
  ratingText: { fontFamily: "Poppins_500Medium", color: THEME.colors.text, fontSize: 14 },

  addCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: THEME.colors.secondary, alignItems: "center", justifyContent: "center" },

  detailsWrap: { flex: 1, backgroundColor: THEME.colors.background },
  detailsHeader: {
    paddingTop: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailsHero: { marginTop: 12, width: "100%", height: 220 },
  detailsInfoCard: {
    marginTop: -28,
    marginHorizontal: THEME.spacing.lg,
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.card,
    borderWidth: 1,
    borderColor: THEME.colors.stroke,
    padding: THEME.spacing.lg,
  },
  detailsTitle: { fontFamily: "Poppins_700Bold", fontSize: 18, color: THEME.colors.text },
  detailsMeta: { marginTop: 6, fontFamily: "Poppins_400Regular", color: THEME.colors.mutedText, fontSize: 13 },
  detailsFee: { marginTop: 6, fontFamily: "Poppins_500Medium", color: THEME.colors.text, fontSize: 13 },

  menuRow: {
    marginTop: 12,
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.card,
    borderWidth: 1,
    borderColor: THEME.colors.stroke,
    padding: THEME.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuTitle: { fontFamily: "Poppins_600SemiBold", color: THEME.colors.text, fontSize: 15 },
  menuDesc: { marginTop: 4, fontFamily: "Poppins_400Regular", color: THEME.colors.mutedText, fontSize: 12 },
  menuPrice: { marginTop: 6, fontFamily: "Poppins_600SemiBold", color: THEME.colors.text, fontSize: 13 },
  menuAddBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: THEME.colors.primary, alignItems: "center", justifyContent: "center" },

  detailsBottomBar: {
    position: "absolute",
    left: 0, right: 0, bottom: 0,
    backgroundColor: THEME.colors.white,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.stroke,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
  },
  detailsCartCount: { fontFamily: "Poppins_500Medium", color: THEME.colors.mutedText, fontSize: 13 },
  detailsCartLink: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: THEME.colors.lavender, borderRadius: 999, paddingHorizontal: 14, height: 36 },
  detailsCartLinkText: { fontFamily: "Poppins_600SemiBold", color: THEME.colors.text, fontSize: 13 },

  emptyWrap: { marginTop: 40, alignItems: "center", justifyContent: "center" },
  emptyBadge: { width: 110, height: 110, opacity: 0.95 },
  emptyTitle: { marginTop: 16, fontFamily: "Poppins_700Bold", fontSize: 20, color: THEME.colors.text },
  emptyText: { marginTop: 8, fontFamily: "Poppins_400Regular", fontSize: 14, color: THEME.colors.mutedText, textAlign: "center", paddingHorizontal: 24 },

  cartItem: {
    backgroundColor: THEME.colors.white, borderRadius: THEME.radius.card, borderWidth: 1, borderColor: THEME.colors.stroke,
    padding: 12, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12,
  },
  cartImage: { width: 56, height: 56, borderRadius: 16 },
  cartTitle: { fontFamily: "Poppins_600SemiBold", color: THEME.colors.text, fontSize: 14 },
  cartMeta: { marginTop: 2, fontFamily: "Poppins_400Regular", color: THEME.colors.mutedText, fontSize: 12 },
  qtyBox: { flexDirection: "row", gap: 8 },
  qtyBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: THEME.colors.stroke, alignItems: "center", justifyContent: "center" },

  checkoutBar: {
    position: "absolute", left: 0, right: 0, bottom: 78,
    backgroundColor: THEME.colors.white, borderTopWidth: 1, borderTopColor: THEME.colors.stroke,
    paddingHorizontal: THEME.spacing.lg, paddingVertical: THEME.spacing.md,
  },
  checkoutRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  totalLabel: { fontFamily: "Poppins_600SemiBold", fontSize: 16, color: THEME.colors.text },
  totalValue: { fontFamily: "Poppins_700Bold", fontSize: 18, color: THEME.colors.text },
  checkoutNote: { fontFamily: "Poppins_400Regular", fontSize: 12, color: THEME.colors.mutedText },

  splashCard: {
    backgroundColor: THEME.colors.white,
    borderWidth: 1, borderColor: THEME.colors.stroke, borderRadius: THEME.radius.card,
    padding: THEME.spacing.xl, shadowColor: THEME.colors.shadow,
    shadowOpacity: 1, shadowRadius: 14, shadowOffset: { width: 0, height: 10 }, elevation: 2,
  },
  splashBadge: { width: 120, height: 120, alignSelf: "center" },
  splashTitle: { marginTop: 14, fontFamily: "Poppins_700Bold", fontSize: 18, color: THEME.colors.text, textAlign: "center" },
  splashText: { marginTop: 8, fontFamily: "Poppins_400Regular", fontSize: 13, color: THEME.colors.mutedText, textAlign: "center" },

  bottomNav: {
    height: 78, backgroundColor: THEME.colors.white, borderTopWidth: 1, borderTopColor: THEME.colors.stroke,
    flexDirection: "row", paddingBottom: 10, paddingTop: 10,
  },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 4 },
  navLabel: { fontFamily: "Poppins_500Medium", color: THEME.colors.text, fontSize: 12 },
});
