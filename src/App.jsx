/* eslint-disable */
import { useState, useEffect, useRef } from "react";

// ─── CONFIG SUPABASE ──────────────────────────────────────────────────────────
const SUPABASE_URL = "https://bedunhjdbfxguvtzxdha.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlZHVuaGpkYmZ4Z3V2dHp4ZGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NjUxMjgsImV4cCI6MjA5MTQ0MTEyOH0.g9sqSvWCCJElmoTX8hjJppIuOvcAKkhB1GLA8xRq9X0";

// camelCase -> snake_case pour écriture dans Supabase
function toDbIngredient(ing) {
  return {
    id: ing.id,
    nom_recette: ing.nomRecette,
    nom_etiquette: ing.nomEtiquette,
    noms_fournisseur: ing.nomsFournisseur || [],
    bio: ing.bio,
    prix_kg: ing.prixKg || 0,
    fournisseur_id: ing.fournisseurId || "",
    fournisseurs_alternatifs: ing.fournisseursAlternatifs || [],
    stock_actuel: ing.stockActuel || 0,
    unite: ing.unite,
    allergene: ing.allergene || "",
    categorie: ing.categorie || "autre",
  };
}

function toDbFournisseur(f) {
  return {
    id: f.id,
    nom: f.nom,
    contact: f.contact || "",
    jour_commande: f.jourCommande,
    jour_livraison: f.jourLivraison,
  };
}

// Convertit snake_case (Supabase) en camelCase (app)
function mapIngredient(row) {
  if (!row) return row;
  return {
    id: row.id,
    nomRecette: row.nom_recette || row.nomRecette || "",
    nomEtiquette: row.nom_etiquette || row.nomEtiquette || "",
    nomsFournisseur: row.noms_fournisseur || row.nomsFournisseur || [],
    bio: row.bio || false,
    prixKg: row.prix_kg || row.prixKg || 0,
    fournisseurId: row.fournisseur_id || row.fournisseurId || "",
    fournisseursAlternatifs: row.fournisseurs_alternatifs || row.fournisseursAlternatifs || [],
    stockActuel: row.stock_actuel || row.stockActuel || 0,
    unite: row.unite || "kg",
    allergene: row.allergene || "",
    categorie: row.categorie || "autre",
  };
}

function mapFournisseur(row) {
  if (!row) return row;
  return {
    id: row.id,
    nom: row.nom || "",
    contact: row.contact || "",
    jourCommande: row.jour_commande || row.jourCommande || "lundi",
    jourLivraison: row.jour_livraison || row.jourLivraison || "mardi",
  };
}

function mapRecette(row) {
  if (!row) return row;
  return {
    id: row.id,
    nom: row.nom || "",
    categorie: row.categorie || "glace",
    ephemere: row.ephemere || false,
    notes: row.notes || "",
    poudres: row.poudres || [],
    liquides: row.liquides || [],
    ingredients: row.ingredients || [],
    toppings: row.toppings || [],
  };
}

async function sbFetch(table, method = "GET", body = null, filter = "") {
  const url = SUPABASE_URL + "/rest/v1/" + table + filter;
  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": "Bearer " + SUPABASE_KEY,
    "Content-Type": "application/json",
    "Prefer": method === "POST" ? "return=representation" : "return=minimal",
  };
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : null });
  if (method === "GET") {
    const data = await res.json();
    if (!Array.isArray(data)) {
      console.error("Supabase error on " + table + ":", data);
      return [];
    }
    return data;
  }
  return res;
}

// ─── THÈME ────────────────────────────────────────────────────────────────────
const C = {
  cream: "#FFF8F0", darkGreen: "#1A3A2A", green: "#2D6A4F",
  mint: "#52B788", lightMint: "#B7E4C7", gold: "#C9A84C",
  lightGold: "#F0DFA0", text: "#1A3A2A", muted: "#6B8F71",
  white: "#FFFFFF", error: "#C0392B", lightCream: "#FFF3E0",
  s1: "#E8F5E9", s2: "#E3F2FD", s3: "#FFF8E1", s4: "#FCE4EC", s5: "#F3F0FF",
};
const F = { display: "'Playfair Display', Georgia, serif", body: "'DM Sans', sans-serif", mono: "'DM Mono', monospace" };

// ─── IDs POUDRES / LIQUIDES ───────────────────────────────────────────────────
const POUDRES_IDS = ["ing_lin", "ing_guar", "ing_sucre_canne", "ing_poudre_lait"];
const LIQUIDES_IDS = ["ing_lait_entier", "ing_creme_crue", "ing_sirop_agave", "ing_eau"];

// ─── DONNÉES INITIALES ────────────────────────────────────────────────────────
const INIT_FOURNISSEURS = [
  { id: "four_fromentellerie", nom: "SARL La Fromentellerie", contact: "lafromentellerie@gmail.com | 06 87 17 64 07", jourCommande: "vendredi", jourLivraison: "mardi" },
  { id: "four_agrosourcing", nom: "Agro Sourcing", contact: "04 42 58 88 06 | 388 Av. Galerie de la Mer, 13120 Gardanne | 1-2 commandes/an", jourCommande: "lundi", jourLivraison: "lundi" },
  { id: "four_comptoir_praline", nom: "Comptoir du Praliné", contact: "hdeguiraud@comptoirdupraline.fr | 06 98 97 72 62", jourCommande: "lundi", jourLivraison: "lundi" },
  { id: "four_umami", nom: "Umami Paris", contact: "01 43 94 97 91 | www.umamiparis.com", jourCommande: "lundi", jourLivraison: "lundi" },
  { id: "four_biocoop", nom: "Biocoop Restauration", contact: "02 99 92 86 94 | Tinteniac", jourCommande: "lundi", jourLivraison: "lundi" },
  { id: "four_kaoka", nom: "Kaoka", contact: "info@kaoka.fr | 04 90 66 55 55 | Carpentras", jourCommande: "lundi", jourLivraison: "lundi" },
  { id: "four_dipsa", nom: "DIPSA", contact: "compta.clients@dipsa-sa.com | Sartrouville", jourCommande: "lundi", jourLivraison: "lundi" },
];

const INIT_INGREDIENTS = [
  { id: "ing_lin", nomRecette: "Lin", nomEtiquette: "lin", nomsFournisseur: ["Lin"], bio: true, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "poudre" },
  { id: "ing_guar", nomRecette: "Guar", nomEtiquette: "guar", nomsFournisseur: ["Guar"], bio: true, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "poudre" },
  { id: "ing_sucre_canne", nomRecette: "Sucre de canne", nomEtiquette: "sucre de canne non raffiné", nomsFournisseur: ["Sucre canne", "Sucre de canne"], bio: true, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "poudre" },
  { id: "ing_poudre_lait", nomRecette: "Poudre de lait", nomEtiquette: "lait en poudre", nomsFournisseur: ["Poudre de lait"], bio: true, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "Lait", categorie: "poudre" },
  { id: "ing_lait_entier", nomRecette: "Lait entier pasteurisé", nomEtiquette: "lait frais entier", nomsFournisseur: ["Lait entier pasteurisé"], bio: true, prixKg: 1.90, fournisseurId: "four_fromentellerie", fournisseursAlternatifs: [], stockActuel: 0, unite: "L", allergene: "Lait", categorie: "liquide" },
  { id: "ing_creme_crue", nomRecette: "Crème crue", nomEtiquette: "crème fraîche crue", nomsFournisseur: ["Crème crue"], bio: true, prixKg: 12.89, fournisseurId: "four_fromentellerie", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "Lait", categorie: "liquide" },
  { id: "ing_sirop_agave", nomRecette: "Sirop d'agave", nomEtiquette: "sirop d'agave", nomsFournisseur: ["Sirop agave"], bio: true, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "liquide" },
  { id: "ing_eau", nomRecette: "Eau", nomEtiquette: "eau", nomsFournisseur: ["Eau"], bio: false, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "L", allergene: "", categorie: "liquide" },
  { id: "ing_pistaches", nomRecette: "Pistaches décortiquées", nomEtiquette: "pistaches", nomsFournisseur: ["Pistaches d'Espagne décortiquées"], bio: true, prixKg: 32.46, fournisseurId: "four_agrosourcing", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "Fruits à coque", categorie: "topping" },
  { id: "ing_lait_coco", nomRecette: "Lait de coco", nomEtiquette: "lait de coco", nomsFournisseur: ["Lait de coco du Sri Lanka"], bio: true, prixKg: 2.99, fournisseurId: "four_agrosourcing", fournisseursAlternatifs: [], stockActuel: 0, unite: "L", allergene: "", categorie: "liquide" },
  { id: "ing_pate_pistache", nomRecette: "Pâte de pistache", nomEtiquette: "pâte de pistache", nomsFournisseur: ["Pâte de Pistache Iran Kernel 100%"], bio: false, prixKg: 39.12, fournisseurId: "four_comptoir_praline", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "Fruits à coque", categorie: "autre" },
  { id: "ing_pate_sesame_noir", nomRecette: "Pâte de sésame noir", nomEtiquette: "pâte de sésame noir", nomsFournisseur: ["Pure Pâte de Sésame Noir", "Pâte de sésame noir bio"], bio: true, prixKg: 38.53, fournisseurId: "four_umami", fournisseursAlternatifs: [{ fournisseurId: "four_comptoir_praline", prixKg: 17.16, bio: false }], stockActuel: 0, unite: "kg", allergene: "Sésame", categorie: "autre" },
  { id: "ing_the_hojicha", nomRecette: "Poudre de thé Hojicha", nomEtiquette: "poudre de thé Hojicha", nomsFournisseur: ["Poudre de thé Hojicha Bio"], bio: true, prixKg: 126.40, fournisseurId: "four_umami", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "aromate" },
  { id: "ing_farine_riz", nomRecette: "Farine de riz complet", nomEtiquette: "farine de riz complet", nomsFournisseur: ["Farine de riz complet Bio 3kg"], bio: true, prixKg: 4.13, fournisseurId: "four_biocoop", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "poudre" },
  { id: "ing_boisson_soja", nomRecette: "Lait de soja", nomEtiquette: "lait de soja", nomsFournisseur: ["Boisson soja nature Bio 1L"], bio: true, prixKg: 1.60, fournisseurId: "four_biocoop", fournisseursAlternatifs: [], stockActuel: 0, unite: "L", allergene: "Soja", categorie: "liquide" },
  { id: "ing_flocons_sarrasin", nomRecette: "Flocons de sarrasin", nomEtiquette: "flocons de sarrasin", nomsFournisseur: ["Flocons de sarrasin Bio 500g"], bio: true, prixKg: 7.38, fournisseurId: "four_biocoop", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "poudre" },
  { id: "ing_cafe_instantane", nomRecette: "Café instantané", nomEtiquette: "café instantané", nomsFournisseur: ["Café instantané Bio 100g"], bio: true, prixKg: 45.00, fournisseurId: "four_biocoop", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "aromate" },
  { id: "ing_flocons_avoine", nomRecette: "Flocons d'avoine sans gluten", nomEtiquette: "flocons d'avoine sans gluten", nomsFournisseur: ["Flocon d'avoine petit sans gluten Bio"], bio: true, prixKg: 5.24, fournisseurId: "four_biocoop", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "Gluten", categorie: "poudre" },
  { id: "ing_jus_citron_vert", nomRecette: "Jus de citron vert", nomEtiquette: "jus de citron vert", nomsFournisseur: ["Jus de citron vert Bio 25cl"], bio: true, prixKg: 6.72, fournisseurId: "four_biocoop", fournisseursAlternatifs: [], stockActuel: 0, unite: "L", allergene: "", categorie: "liquide" },
  { id: "ing_jus_gingembre", nomRecette: "Jus de gingembre", nomEtiquette: "jus de gingembre", nomsFournisseur: ["Jus de gingembre Bio 25cl"], bio: true, prixKg: 12.32, fournisseurId: "four_biocoop", fournisseursAlternatifs: [], stockActuel: 0, unite: "L", allergene: "", categorie: "liquide" },
  { id: "ing_creme_uht", nomRecette: "Crème liquide UHT", nomEtiquette: "crème liquide", nomsFournisseur: ["Crème Liquide UHT 35%MG bio Tetra 1L"], bio: true, prixKg: 6.90, fournisseurId: "four_biocoop", fournisseursAlternatifs: [], stockActuel: 0, unite: "L", allergene: "Lait", categorie: "liquide" },
  { id: "ing_cacao_poudre", nomRecette: "Poudre de cacao", nomEtiquette: "poudre de cacao", nomsFournisseur: ["Poudre de Cacao Alcalinisée 20/22% MG"], bio: true, prixKg: 14.45, fournisseurId: "four_kaoka", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "poudre" },
  { id: "ing_puree_citron", nomRecette: "Purée de citron jaune", nomEtiquette: "purée de citron jaune", nomsFournisseur: ["PUREE FRAIS CITRON J BIO 1KG"], bio: true, prixKg: 8.28, fournisseurId: "four_dipsa", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "fruit" },
  // Ingrédients ajoutés via recettes
  { id: "ing_mangue_keesar", nomRecette: "Mangue keesar boite", nomEtiquette: "mangue keesar boite", nomsFournisseur: ["Mangue keesar"], bio: true, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "fruit" },
  { id: "ing_framboise_puree", nomRecette: "Framboise purée", nomEtiquette: "framboise purée", nomsFournisseur: ["Framboise purée"], bio: true, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "fruit" },
  { id: "ing_passion_puree", nomRecette: "Passion puree", nomEtiquette: "passion purée", nomsFournisseur: ["Passion puree"], bio: true, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "fruit" },
  { id: "ing_puree_lychee", nomRecette: "Purée lychee", nomEtiquette: "purée lychee", nomsFournisseur: ["Purée lychee"], bio: false, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "fruit" },
  { id: "ing_puree_citron_vert_boiron", nomRecette: "Purée citron vert boiron", nomEtiquette: "purée citron vert", nomsFournisseur: ["Purée citron vert boiron"], bio: false, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "fruit" },
  { id: "ing_groseille_bille", nomRecette: "Groseille bille", nomEtiquette: "groseille bille", nomsFournisseur: ["Groseille bille"], bio: false, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "fruit" },
  { id: "ing_eau_fleur_oranger", nomRecette: "Eau fleur oranger", nomEtiquette: "eau fleur oranger", nomsFournisseur: ["Eau fleur oranger"], bio: false, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "aromate" },
  { id: "ing_feve_tonka", nomRecette: "Fève tonka", nomEtiquette: "fève tonka", nomsFournisseur: ["Fève tonka"], bio: false, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "aromate" },
  { id: "ing_poudre_lait_non_bio", nomRecette: "Poudre de lait non bio", nomEtiquette: "Poudre de lait", nomsFournisseur: ["Poudre lait non bio"], bio: false, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "Lait", categorie: "poudre" },
  { id: "ing_lait_coco_aroy", nomRecette: "Lait de coco Aroy", nomEtiquette: "lait de coco aroy", nomsFournisseur: ["Lait de coco Aroy"], bio: false, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "liquide" },
  { id: "ing_sel_guerande", nomRecette: "Sel Guérande", nomEtiquette: "sel de Guérande", nomsFournisseur: ["Sel Guérande"], bio: true, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "autre" },
  { id: "ing_graine_sesame", nomRecette: "Graine de sesame", nomEtiquette: "graine de sésame", nomsFournisseur: ["Graine de sesame"], bio: false, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "Sésame", categorie: "topping" },
  { id: "ing_pate_praline_amande", nomRecette: "Pâte praliné amande", nomEtiquette: "pâte praliné amande", nomsFournisseur: ["Pâte praliné amande"], bio: true, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "Fruits à coque", categorie: "autre" },
  { id: "ing_fecule_mais", nomRecette: "Fécule de maïs", nomEtiquette: "fécule de maïs", nomsFournisseur: ["Fécule de maïs"], bio: true, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "poudre" },
  { id: "ing_curcuma", nomRecette: "Curcuma poudre", nomEtiquette: "curcuma", nomsFournisseur: ["Curcuma poudre"], bio: true, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "aromate" },
];

const INIT_RECETTES = [
  {
    id: "rec_passion_framboise", nom: "Passion Framboise", categorie: "sorbet", ephemere: false,
    notes: "",
    poudres: [
      { id: "p1", ingredientId: "ing_lin", poids: 70, unite: "g" },
      { id: "p2", ingredientId: "ing_guar", poids: 30, unite: "g" },
      { id: "p3", ingredientId: "ing_sucre_canne", poids: 2500, unite: "g" },
    ],
    liquides: [{ id: "l1", ingredientId: "ing_eau", poids: 5, unite: "L" }],
    ingredients: [
      { id: "i1", ingredientId: "ing_framboise_puree", poids: 6000, unite: "g" },
      { id: "i2", ingredientId: "ing_passion_puree", poids: 4000, unite: "g" },
    ],
    toppings: [],
  },
  {
    id: "rec_mangue_keesar", nom: "Mangue Keesar", categorie: "sorbet", ephemere: false,
    notes: "Base : base de recette pour 3 boîtes de mangue - poids approximatif",
    poudres: [
      { id: "p1", ingredientId: "ing_lin", poids: 50, unite: "g" },
      { id: "p2", ingredientId: "ing_guar", poids: 30, unite: "g" },
      { id: "p3", ingredientId: "ing_sucre_canne", poids: 1200, unite: "g" },
    ],
    liquides: [
      { id: "l1", ingredientId: "ing_sirop_agave", poids: 600, unite: "g" },
      { id: "l2", ingredientId: "ing_eau", poids: 6, unite: "L" },
    ],
    ingredients: [
      { id: "i1", ingredientId: "ing_mangue_keesar", poids: 9, unite: "kg" },
      { id: "i2", ingredientId: "ing_jus_citron_vert", poids: 150, unite: "g" },
    ],
    toppings: [],
  },
  {
    id: "rec_lychee_groseille", nom: "Lychee Groseille", categorie: "sorbet", ephemere: false,
    notes: "Base : RAS\nTOPPING : utiliser un faitout moyen - mélanger le sucre et les groseilles - cuisson th 4, 20 minutes puis th 5, 15 minutes",
    poudres: [
      { id: "p1", ingredientId: "ing_lin", poids: 50, unite: "g" },
      { id: "p2", ingredientId: "ing_guar", poids: 30, unite: "g" },
      { id: "p3", ingredientId: "ing_sucre_canne", poids: 2000, unite: "g" },
    ],
    liquides: [{ id: "l1", ingredientId: "ing_eau", poids: 5, unite: "L" }],
    ingredients: [
      { id: "i1", ingredientId: "ing_puree_lychee", poids: 10, unite: "kg" },
      { id: "i2", ingredientId: "ing_puree_citron_vert_boiron", poids: 500, unite: "g" },
    ],
    toppings: [
      { id: "t1", ingredientId: "ing_groseille_bille", poids: 2, unite: "kg" },
      { id: "t2", ingredientId: "ing_sucre_canne", poids: 500, unite: "g" },
    ],
  },
  {
    id: "rec_fleur_oranger_pistache", nom: "Fleur Oranger Pistache", categorie: "glace", ephemere: false,
    notes: "Base : incorporer l'eau de fleur d'oranger à froid - laisser infuser 24 heures\nTOPPING : +150 g de pistache uniquement pour les pots",
    poudres: [
      { id: "p1", ingredientId: "ing_lin", poids: 40, unite: "g" },
      { id: "p2", ingredientId: "ing_guar", poids: 20, unite: "g" },
      { id: "p3", ingredientId: "ing_sucre_canne", poids: 2200, unite: "g" },
      { id: "p4", ingredientId: "ing_poudre_lait", poids: 1000, unite: "g" },
    ],
    liquides: [
      { id: "l1", ingredientId: "ing_lait_entier", poids: 12.5, unite: "L" },
      { id: "l2", ingredientId: "ing_creme_crue", poids: 2000, unite: "g" },
      { id: "l3", ingredientId: "ing_sirop_agave", poids: 400, unite: "g" },
    ],
    ingredients: [{ id: "i1", ingredientId: "ing_eau_fleur_oranger", poids: 400, unite: "g" }],
    toppings: [
      { id: "t1", ingredientId: "ing_pistaches", poids: 500, unite: "g" },
      { id: "t2", ingredientId: "ing_pistaches", poids: 150, unite: "g" },
    ],
  },
  {
    id: "rec_lemon_curd", nom: "Lemon Curd", categorie: "glace", ephemere: false,
    notes: "Base : faire le sirop de citron avec le sucre maximum 60 degrés - incorporer le sirop de citron à froid\nPrepa topping : mélanger toutes les poudres. Ajouter lait de soja et jus de citron. Mélanger au fouet. Faire chauffer th 4 jusqu'à épaississement.",
    poudres: [
      { id: "p1", ingredientId: "ing_lin", poids: 40, unite: "g" },
      { id: "p2", ingredientId: "ing_guar", poids: 20, unite: "g" },
      { id: "p3", ingredientId: "ing_sucre_canne", poids: 1200, unite: "g" },
      { id: "p4", ingredientId: "ing_poudre_lait", poids: 1000, unite: "g" },
    ],
    liquides: [
      { id: "l1", ingredientId: "ing_lait_entier", poids: 10, unite: "L" },
      { id: "l2", ingredientId: "ing_creme_crue", poids: 2, unite: "g" },
      { id: "l3", ingredientId: "ing_sirop_agave", poids: 400, unite: "g" },
    ],
    ingredients: [
      { id: "i1", ingredientId: "ing_puree_citron", poids: 5, unite: "L" },
      { id: "i2", ingredientId: "ing_sucre_canne", poids: 1300, unite: "g" },
    ],
    toppings: [
      { id: "t1", ingredientId: "ing_puree_citron", poids: 1, unite: "L" },
      { id: "t2", ingredientId: "ing_boisson_soja", poids: 750, unite: "g" },
      { id: "t3", ingredientId: "ing_sucre_canne", poids: 1000, unite: "g" },
      { id: "t4", ingredientId: "ing_fecule_mais", poids: 150, unite: "g" },
      { id: "t5", ingredientId: "ing_curcuma", poids: 5, unite: "g" },
    ],
  },
  {
    id: "rec_praline_sesame_noir", nom: "Praliné Sésame Noir", categorie: "glace", ephemere: false,
    notes: "Préparation base : incorporer la pâte de sésame noir et praliné à froid\nPréparation topping : prendre le grand faitout monter le sirop au plus sucre. Cuisson th 5. 5 minutes - attendre épaississement du sirop - incorporer amandes à sec. Laisser épaissir sirop puis sabler les amandes - une fois sablée attendre 5. À 10 minutes pour refroidissement, puis caraméliser à thermostat 6/7",
    poudres: [
      { id: "p1", ingredientId: "ing_lin", poids: 70, unite: "g" },
      { id: "p2", ingredientId: "ing_guar", poids: 20, unite: "g" },
      { id: "p3", ingredientId: "ing_sucre_canne", poids: 1800, unite: "g" },
      { id: "p4", ingredientId: "ing_poudre_lait", poids: 1200, unite: "g" },
    ],
    liquides: [
      { id: "l1", ingredientId: "ing_lait_entier", poids: 12.5, unite: "L" },
      { id: "l2", ingredientId: "ing_sirop_agave", poids: 400, unite: "g" },
      { id: "l3", ingredientId: "ing_creme_uht", poids: 2, unite: "L" },
    ],
    ingredients: [
      { id: "i1", ingredientId: "ing_pate_praline_amande", poids: 1500, unite: "g" },
      { id: "i2", ingredientId: "ing_pate_sesame_noir", poids: 500, unite: "g" },
    ],
    toppings: [],
  },
  {
    id: "rec_chocolat_feve_tonka", nom: "Chocolat Fève Tonka", categorie: "glace", ephemere: false,
    notes: "Préparation base : incorporer fève de tonka à chaud et poudre de cacao - cuisson th 10 23 min",
    poudres: [
      { id: "p1", ingredientId: "ing_lin", poids: 60, unite: "g" },
      { id: "p2", ingredientId: "ing_guar", poids: 20, unite: "g" },
      { id: "p3", ingredientId: "ing_sucre_canne", poids: 2200, unite: "g" },
      { id: "p4", ingredientId: "ing_poudre_lait_non_bio", poids: 1000, unite: "g" },
    ],
    liquides: [
      { id: "l1", ingredientId: "ing_lait_entier", poids: 12.5, unite: "L" },
      { id: "l2", ingredientId: "ing_creme_crue", poids: 2000, unite: "g" },
      { id: "l3", ingredientId: "ing_sirop_agave", poids: 400, unite: "g" },
    ],
    ingredients: [
      { id: "i1", ingredientId: "ing_cacao_poudre", poids: 600, unite: "g" },
      { id: "i2", ingredientId: "ing_feve_tonka", poids: 40, unite: "g" },
    ],
    toppings: [],
  },
  {
    id: "rec_coco_sesame", nom: "Coco Sésame", categorie: "végétale", ephemere: false,
    notes: "Préparation base : Faire chauffer l'eau th 10 jusqu'à ebullition. Puis ajouter le lait de coco. Remonter la température à 75 degrés.\nPréparation du topping : utiliser la poêle - faire fondre le sel dans 100 ml d'eau - cuisson thermostat 4 8 à 12 minutes - arrêter une fois doré",
    poudres: [
      { id: "p1", ingredientId: "ing_lin", poids: 50, unite: "g" },
      { id: "p2", ingredientId: "ing_guar", poids: 20, unite: "g" },
      { id: "p3", ingredientId: "ing_sucre_canne", poids: 2500, unite: "g" },
    ],
    liquides: [
      { id: "l1", ingredientId: "ing_sirop_agave", poids: 600, unite: "g" },
      { id: "l2", ingredientId: "ing_eau", poids: 4, unite: "L" },
    ],
    ingredients: [
      { id: "i1", ingredientId: "ing_lait_coco_aroy", poids: 10, unite: "g" },
      { id: "i2", ingredientId: "ing_sel_guerande", poids: 15, unite: "g" },
    ],
    toppings: [
      { id: "t1", ingredientId: "ing_graine_sesame", poids: 400, unite: "g" },
      { id: "t2", ingredientId: "ing_sel_guerande", poids: 30, unite: "g" },
      { id: "t3", ingredientId: "ing_eau", poids: 100, unite: "g" },
    ],
  },
  {
    id: "rec_pistache_iran", nom: "Pistache Iran", categorie: "glace", ephemere: false,
    notes: "Incorporation de la pâte à froid",
    poudres: [
      { id: "p1", ingredientId: "ing_lin", poids: 20, unite: "g" },
      { id: "p2", ingredientId: "ing_guar", poids: 50, unite: "g" },
      { id: "p3", ingredientId: "ing_sucre_canne", poids: 2400, unite: "g" },
      { id: "p4", ingredientId: "ing_poudre_lait", poids: 1200, unite: "g" },
    ],
    liquides: [
      { id: "l1", ingredientId: "ing_lait_entier", poids: 12.5, unite: "L" },
      { id: "l2", ingredientId: "ing_sirop_agave", poids: 400, unite: "g" },
      { id: "l3", ingredientId: "ing_creme_uht", poids: 2, unite: "L" },
    ],
    ingredients: [{ id: "i1", ingredientId: "ing_pate_pistache", poids: 2000, unite: "g" }],
    toppings: [],
  },
];

// ─── UTILITAIRES ──────────────────────────────────────────────────────────────
function genId() { return Math.random().toString(36).slice(2, 9); }

function toGrams(val, unite) {
  if (unite === "kg" || unite === "L") return val * 1000;
  if (unite === "cl") return val * 10;
  return val;
}

function calcBioPct(lignes, ings) {
  let total = 0, bio = 0;
  for (const l of lignes) {
    const ing = ings.find(i => i.id === l.ingredientId);
    if (!ing || !l.poids) continue;
    const g = toGrams(l.poids, l.unite);
    total += g; if (ing.bio) bio += g;
  }
  return total === 0 ? 0 : Math.round((bio / total) * 100);
}

function calcBioPctStrict(lignes, ings) {
  let total = 0, bio = 0;
  for (const l of lignes) {
    const ing = ings.find(i => i.id === l.ingredientId);
    if (!ing || !l.poids) continue;
    if (ing.id === "ing_eau" || ing.nomRecette.toLowerCase() === "eau") continue;
    const g = toGrams(l.poids, l.unite);
    total += g; if (ing.bio) bio += g;
  }
  return total === 0 ? 0 : (bio / total) * 100;
}

function getBioAlert(lignes, ings) {
  const pct = calcBioPctStrict(lignes, ings);
  if (pct >= 95 && pct < 100) return { type: "warning", pct: pct.toFixed(1), message: `Attention : ${pct.toFixed(1)}% bio (hors eau) — entre 95% et 99,9% : déclassez certains ingrédients bio pour descendre a 94% ou monter a 100%.` };
  if (pct >= 100) return { type: "success", pct: "100", message: "100% bio (hors eau) — logo AB autorisé." };
  return { type: "info", pct: pct.toFixed(1), message: `${pct.toFixed(1)}% des ingrédients d'origine agricole issus de l'AB (hors eau).` };
}

function calcCout(lignes, ings) {
  let total = 0;
  for (const l of lignes) {
    const ing = ings.find(i => i.id === l.ingredientId);
    if (!ing || !ing.prixKg || !l.poids) continue;
    total += (toGrams(l.poids, l.unite) / 1000) * ing.prixKg;
  }
  return total.toFixed(2);
}

function buildListeEtiquette(lignes, ings) {
  return lignes.filter(l => l.poids > 0 && l.ingredientId)
    .map(l => {
      const ing = ings.find(i => i.id === l.ingredientId);
      return { nom: ing?.nomEtiquette || ing?.nomRecette || "?", bio: ing?.bio || false, poids: toGrams(l.poids, l.unite) };
    }).sort((a, b) => b.poids - a.poids);
}

// ─── CSV EXPORT / IMPORT ──────────────────────────────────────────────────────
function exportCSV(data) {
  // Fournisseurs CSV
  const fCols = ["id", "nom", "contact", "jourCommande", "jourLivraison"];
  const fRows = data.fournisseurs.map(f => fCols.map(c => `"${(f[c] || "").toString().replace(/"/g, '""')}"`).join(","));
  downloadCSV([fCols.join(","), ...fRows].join("\n"), "fournisseurs.csv");

  // Ingrédients CSV
  setTimeout(() => {
    const iCols = ["id", "nomRecette", "nomEtiquette", "nomsFournisseur", "bio", "prixKg", "fournisseurId", "stockActuel", "unite", "allergene", "categorie"];
    const iRows = data.ingredients.map(i => iCols.map(c => {
      const v = c === "nomsFournisseur" ? (i[c] || []).join("|") : (i[c] !== undefined ? i[c] : "");
      return `"${v.toString().replace(/"/g, '""')}"`;
    }).join(","));
    downloadCSV([iCols.join(","), ...iRows].join("\n"), "ingredients.csv");
  }, 300);

  // Recettes CSV
  setTimeout(() => {
    const rCols = ["id", "nom", "categorie", "ephemere", "notes", "poudres", "liquides", "ingredients", "toppings"];
    const rRows = data.recettes.map(r => rCols.map(c => {
      const v = ["poudres", "liquides", "ingredients", "toppings"].includes(c) ? JSON.stringify(r[c] || []) : (r[c] !== undefined ? r[c] : "");
      return `"${v.toString().replace(/"/g, '""')}"`;
    }).join(","));
    downloadCSV([rCols.join(","), ...rRows].join("\n"), "recettes.csv");
  }, 600);
}

function downloadCSV(content, filename) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.replace(/^"|"$/g, "").trim());
  return lines.slice(1).map(line => {
    const vals = [];
    let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { inQ = !inQ; }
      else if (line[i] === ',' && !inQ) { vals.push(cur); cur = ""; }
      else { cur += line[i]; }
    }
    vals.push(cur);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (vals[i] || "").replace(/^"|"$/g, ""); });
    return obj;
  });
}

function importCSV(file, type, setData, setMsg) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const rows = parseCSV(e.target.result);
      setData(d => {
        if (type === "fournisseurs") {
          const imported = rows.map(r => ({ ...r }));
          setMsg(`${imported.length} fournisseurs importés`);
          return { ...d, fournisseurs: imported };
        }
        if (type === "ingredients") {
          const imported = rows.map(r => ({
            ...r, bio: r.bio === "true", prixKg: parseFloat(r.prixKg) || 0,
            stockActuel: parseFloat(r.stockActuel) || 0,
            nomsFournisseur: r.nomsFournisseur ? r.nomsFournisseur.split("|") : [],
            fournisseursAlternatifs: [],
          }));
          setMsg(`${imported.length} ingrédients importés`);
          return { ...d, ingredients: imported };
        }
        if (type === "recettes") {
          const imported = rows.map(r => ({
            ...r, ephemere: r.ephemere === "true",
            poudres: JSON.parse(r.poudres || "[]"),
            liquides: JSON.parse(r.liquides || "[]"),
            ingredients: JSON.parse(r.ingredients || "[]"),
            toppings: JSON.parse(r.toppings || "[]"),
          }));
          setMsg(`${imported.length} recettes importées`);
          return { ...d, recettes: imported };
        }
        return d;
      });
    } catch (err) {
      setMsg("Erreur lors de l'import — vérifiez le format du fichier");
    }
  };
  reader.readAsText(file, "UTF-8");
}

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────
function Badge({ color, children }) {
  return <span style={{ background: color || C.lightMint, color: C.darkGreen, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontFamily: F.body, fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase" }}>{children}</span>;
}
function Card({ children, style, onClick }) {
  return <div onClick={onClick} style={{ background: C.white, borderRadius: 14, padding: "20px 24px", boxShadow: "0 2px 14px rgba(26,58,42,0.07)", border: `1px solid ${C.lightMint}`, ...style }}>{children}</div>;
}
function Label({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: F.body, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{children}</div>;
}
function Input({ label, value, onChange, type = "text", placeholder, style }) {
  return <div style={{ marginBottom: 10, ...style }}>{label && <Label>{label}</Label>}<input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${C.lightMint}`, fontFamily: F.body, fontSize: 14, color: C.text, background: C.cream, outline: "none", boxSizing: "border-box" }} /></div>;
}
function Select({ label, value, onChange, options, placeholder, style }) {
  return <div style={{ marginBottom: 10, ...style }}>{label && <Label>{label}</Label>}<select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${C.lightMint}`, fontFamily: F.body, fontSize: 14, color: value ? C.text : C.muted, background: C.cream, outline: "none", boxSizing: "border-box" }}>{placeholder && <option value="">{placeholder}</option>}{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>;
}
function Toggle({ label, value, onChange }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><div onClick={() => onChange(!value)} style={{ width: 38, height: 20, borderRadius: 10, background: value ? C.green : C.lightMint, cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}><div style={{ width: 14, height: 14, borderRadius: "50%", background: C.white, position: "absolute", top: 3, left: value ? 21 : 3, transition: "left 0.2s" }} /></div><span style={{ fontFamily: F.body, fontSize: 13, color: C.text }}>{label}</span></div>;
}
function Textarea({ label, value, onChange, placeholder, rows = 4 }) {
  return <div style={{ marginBottom: 10 }}>{label && <Label>{label}</Label>}<textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${C.lightMint}`, fontFamily: F.body, fontSize: 13, color: C.text, background: C.cream, outline: "none", boxSizing: "border-box", resize: "vertical", lineHeight: 1.6 }} /></div>;
}
function Btn({ onClick, children, variant = "primary", style, disabled }) {
  const styles = {
    primary: { background: C.green, color: C.white, border: "none" },
    ghost: { background: "transparent", color: C.green, border: `1.5px solid ${C.mint}` },
    secondary: { background: C.lightMint, color: C.darkGreen, border: "none" },
    danger: { background: "#FFE5E5", color: C.error, border: "none" },
    gold: { background: C.gold, color: C.white, border: "none" },
  };
  return <button onClick={onClick} disabled={disabled} style={{ borderRadius: 9, fontFamily: F.body, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", fontSize: 14, padding: "9px 20px", transition: "all 0.15s", opacity: disabled ? 0.5 : 1, ...styles[variant], ...style }}>{children}</button>;
}

// ─── IMPORT CSV PANEL ─────────────────────────────────────────────────────────
function ImportExportPanel({ data, setData }) {
  const [msg, setMsg] = useState("");
  const fRef = useRef(), iRef = useRef(), rRef = useRef();

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(""), 4000); };

  return (
    <Card style={{ marginBottom: 20, background: C.lightCream }}>
      <div style={{ fontFamily: F.display, fontSize: 16, color: C.darkGreen, fontWeight: 700, marginBottom: 14 }}>Import / Export CSV</div>

      {msg && <div style={{ background: "#D4EDDA", border: `1px solid ${C.green}`, borderRadius: 8, padding: "8px 14px", marginBottom: 12, fontFamily: F.body, fontSize: 13, color: C.darkGreen }}>{msg}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* EXPORT */}
        <div style={{ background: C.section2, borderRadius: 10, padding: "12px 14px" }}>
          <Label>Exporter vers Excel (CSV)</Label>
          <p style={{ fontFamily: F.body, fontSize: 12, color: C.muted, marginBottom: 10 }}>Télécharge 3 fichiers CSV ouvrable dans Excel : fournisseurs, ingrédients, recettes.</p>
          <button onClick={() => { exportCSV(data); showMsg("3 fichiers CSV téléchargés !"); }}
            style={{ background: C.green, color: C.white, border: "none", borderRadius: 8, padding: "8px 16px", fontFamily: F.body, fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%" }}>
            Exporter tout (3 CSV)
          </button>
        </div>

        {/* IMPORT */}
        <div style={{ background: C.section3, borderRadius: 10, padding: "12px 14px" }}>
          <Label>Importer depuis CSV</Label>
          <p style={{ fontFamily: F.body, fontSize: 12, color: C.muted, marginBottom: 10 }}>Importez un fichier CSV modifié depuis Excel. Attention : remplace les données existantes.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <input ref={fRef} type="file" accept=".csv" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) importCSV(e.target.files[0], "fournisseurs", setData, showMsg); }} />
            <input ref={iRef} type="file" accept=".csv" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) importCSV(e.target.files[0], "ingredients", setData, showMsg); }} />
            <input ref={rRef} type="file" accept=".csv" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) importCSV(e.target.files[0], "recettes", setData, showMsg); }} />
            <button onClick={() => fRef.current.click()} style={{ background: C.white, border: `1px solid ${C.mint}`, borderRadius: 7, padding: "6px 12px", fontFamily: F.body, fontSize: 12, cursor: "pointer" }}>Importer fournisseurs.csv</button>
            <button onClick={() => iRef.current.click()} style={{ background: C.white, border: `1px solid ${C.mint}`, borderRadius: 7, padding: "6px 12px", fontFamily: F.body, fontSize: 12, cursor: "pointer" }}>Importer ingredients.csv</button>
            <button onClick={() => rRef.current.click()} style={{ background: C.white, border: `1px solid ${C.mint}`, borderRadius: 7, padding: "6px 12px", fontFamily: F.body, fontSize: 12, cursor: "pointer" }}>Importer recettes.csv</button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── LIGNE INGRÉDIENT FIXE ────────────────────────────────────────────────────
const UNITES = ["g", "kg", "mL", "L", "cl", "pièce"].map(u => ({ value: u, label: u }));
const UNITES_LIBRE = ["g", "kg", "L"].map(u => ({ value: u, label: u }));

function LigneIng({ ligne, onChange, onRemove, allIng, fixe, bg }) {
  const ing = allIng.find(i => i.id === ligne.ingredientId);
  const sorted = [...allIng].sort((a, b) => a.nomRecette.localeCompare(b.nomRecette, "fr"));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 58px 26px", gap: 6, alignItems: "center", background: bg, borderRadius: 8, padding: "7px 10px", marginBottom: 4 }}>
      {fixe
        ? <div style={{ fontFamily: F.body, fontSize: 13, fontWeight: 600, color: C.darkGreen }}>{ing?.bio ? "Bio " : ""}{ing?.nomRecette || "?"}</div>
        : <select value={ligne.ingredientId} onChange={e => onChange({ ...ligne, ingredientId: e.target.value })} style={{ padding: "6px 8px", borderRadius: 7, border: `1.5px solid ${C.lightMint}`, fontFamily: F.body, fontSize: 13, color: C.text, background: C.white, outline: "none" }}>
            <option value="">— Choisir —</option>
            {sorted.map(i => <option key={i.id} value={i.id}>{i.bio ? "Bio " : ""}{i.nomRecette}</option>)}
          </select>}
      <input type="number" value={ligne.poids || ""} onChange={e => onChange({ ...ligne, poids: parseFloat(e.target.value) || 0 })} placeholder="0" style={{ padding: "6px 8px", borderRadius: 7, border: `1.5px solid ${C.lightMint}`, fontFamily: F.mono, fontSize: 13, color: C.text, background: C.white, outline: "none", textAlign: "right", width: "100%", boxSizing: "border-box" }} />
      <select value={ligne.unite} onChange={e => onChange({ ...ligne, unite: e.target.value })} style={{ padding: "6px 4px", borderRadius: 7, border: `1.5px solid ${C.lightMint}`, fontFamily: F.body, fontSize: 12, background: C.white, outline: "none" }}>
        {UNITES.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
      </select>
      <button onClick={onRemove} style={{ background: "#FFE5E5", border: "none", borderRadius: 6, cursor: "pointer", color: C.error, fontSize: 12, padding: "4px 6px", fontWeight: 700 }}>x</button>
    </div>
  );
}

// ─── LIGNE INGRÉDIENT LIBRE (avec recherche) ──────────────────────────────────
function LigneIngLibre({ ligne, onChange, onRemove, allIng, onCreateIng, bg, fournisseurs }) {
  const [mode, setMode] = useState("existant");
  const [search, setSearch] = useState("");
  const [showDrop, setShowDrop] = useState(false);
  const [nomNouvel, setNomNouvel] = useState("");
  const [bioNouvel, setBioNouvel] = useState(false);

  const ingActuel = allIng.find(i => i.id === ligne.ingredientId);
  const sorted = [...allIng].sort((a, b) => a.nomRecette.localeCompare(b.nomRecette, "fr"));
  const filtered = sorted.filter(i => i.nomRecette.toLowerCase().includes(search.toLowerCase()));
  const allFours = ingActuel ? [{ id: ingActuel.fournisseurId, prixKg: ingActuel.prixKg, bio: ingActuel.bio }, ...(ingActuel.fournisseursAlternatifs || [])].filter(f => f.id) : [];

  const handleSelect = (ing) => { onChange({ ...ligne, ingredientId: ing.id, fournisseurId: ing.fournisseurId || "" }); setSearch(""); setShowDrop(false); };
  const handleCreate = () => {
    if (!nomNouvel.trim()) return;
    onCreateIng({ nom: nomNouvel.trim(), bio: bioNouvel }, (newId) => { onChange({ ...ligne, ingredientId: newId }); setMode("existant"); setNomNouvel(""); });
  };

  return (
    <div style={{ background: bg, borderRadius: 8, padding: "8px 10px", marginBottom: 6 }}>
      {mode === "existant" ? (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 82px 52px 26px", gap: 6, alignItems: "flex-start" }}>
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", gap: 4 }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <input
                    value={showDrop ? search : (ingActuel ? (ingActuel.bio ? "Bio " : "") + ingActuel.nomRecette : "")}
                    onChange={e => { setSearch(e.target.value); setShowDrop(true); }}
                    onFocus={() => { setSearch(""); setShowDrop(true); }}
                    onBlur={() => setTimeout(() => setShowDrop(false), 150)}
                    placeholder="Rechercher..."
                    style={{ width: "100%", padding: "6px 8px", borderRadius: 7, border: `1.5px solid ${showDrop ? C.mint : C.lightMint}`, fontFamily: F.body, fontSize: 13, color: ingActuel ? C.darkGreen : C.muted, background: C.white, outline: "none", boxSizing: "border-box" }}
                  />
                  {showDrop && (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: C.white, borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", border: `1px solid ${C.lightMint}`, maxHeight: 200, overflowY: "auto", marginTop: 2 }}>
                      {filtered.length === 0 && <div style={{ padding: "8px 12px", fontFamily: F.body, fontSize: 12, color: C.muted, fontStyle: "italic" }}>Aucun résultat</div>}
                      {filtered.map(i => <div key={i.id} onMouseDown={() => handleSelect(i)} style={{ padding: "7px 12px", fontFamily: F.body, fontSize: 13, color: C.darkGreen, cursor: "pointer", background: i.id === ligne.ingredientId ? C.lightMint : "transparent", borderBottom: `1px solid ${C.cream}` }}>{i.bio ? "Bio " : ""}{i.nomRecette}</div>)}
                    </div>
                  )}
                </div>
                <button onClick={() => setMode("nouveau")} style={{ background: C.green, border: "none", borderRadius: 7, color: C.white, fontSize: 16, width: 28, height: 28, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              </div>
            </div>
            <input type="number" value={ligne.poids || ""} onChange={e => onChange({ ...ligne, poids: parseFloat(e.target.value) || 0 })} placeholder="0" style={{ padding: "6px 8px", borderRadius: 7, border: `1.5px solid ${C.lightMint}`, fontFamily: F.mono, fontSize: 13, color: C.text, background: C.white, outline: "none", textAlign: "right", width: "100%", boxSizing: "border-box" }} />
            <select value={ligne.unite} onChange={e => onChange({ ...ligne, unite: e.target.value })} style={{ padding: "6px 4px", borderRadius: 7, border: `1.5px solid ${C.lightMint}`, fontFamily: F.body, fontSize: 12, background: C.white, outline: "none" }}>
              {UNITES_LIBRE.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
            <button onClick={onRemove} style={{ background: "#FFE5E5", border: "none", borderRadius: 6, cursor: "pointer", color: C.error, fontSize: 12, padding: "4px 6px", fontWeight: 700 }}>x</button>
          </div>
          {allFours.length > 1 && (
            <div style={{ marginTop: 5, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: C.muted, fontFamily: F.body, whiteSpace: "nowrap" }}>Fournisseur :</span>
              <select value={ligne.fournisseurId || ingActuel.fournisseurId} onChange={e => onChange({ ...ligne, fournisseurId: e.target.value })} style={{ flex: 1, padding: "4px 8px", borderRadius: 7, border: `1.5px solid ${C.lightMint}`, fontFamily: F.body, fontSize: 12, color: C.text, background: C.white, outline: "none" }}>
                {allFours.map(f => { const four = fournisseurs ? fournisseurs.find(x => x.id === f.id) : null; return <option key={f.id} value={f.id}>{four ? four.nom : f.id} — {f.prixKg} €/kg {f.bio ? "Bio" : ""}</option>; })}
              </select>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.green, fontFamily: F.body, textTransform: "uppercase" }}>Nouvel ingrédient</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input value={nomNouvel} onChange={e => setNomNouvel(e.target.value)} placeholder="Nom (ex: Kumquat semi-confit)" style={{ flex: 1, padding: "6px 10px", borderRadius: 7, border: `1.5px solid ${C.mint}`, fontFamily: F.body, fontSize: 13, color: C.text, background: C.white, outline: "none" }} />
            <div onClick={() => setBioNouvel(!bioNouvel)} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", whiteSpace: "nowrap" }}>
              <div style={{ width: 32, height: 18, borderRadius: 9, background: bioNouvel ? C.green : C.lightMint, position: "relative", transition: "background 0.2s", flexShrink: 0 }}><div style={{ width: 12, height: 12, borderRadius: "50%", background: C.white, position: "absolute", top: 3, left: bioNouvel ? 17 : 3, transition: "left 0.2s" }} /></div>
              <span style={{ fontSize: 12, fontFamily: F.body, color: C.muted }}>Bio</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={handleCreate} disabled={!nomNouvel.trim()} style={{ background: C.green, border: "none", borderRadius: 7, color: C.white, fontFamily: F.body, fontSize: 12, fontWeight: 700, padding: "6px 14px", cursor: nomNouvel.trim() ? "pointer" : "not-allowed", opacity: nomNouvel.trim() ? 1 : 0.5 }}>Créer et ajouter</button>
            <button onClick={() => { setMode("existant"); setNomNouvel(""); }} style={{ background: "none", border: `1.5px solid ${C.lightMint}`, borderRadius: 7, color: C.muted, fontFamily: F.body, fontSize: 12, padding: "6px 12px", cursor: "pointer" }}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, bg, children, onAdd }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 12, color: C.darkGreen, textTransform: "uppercase", letterSpacing: 0.6 }}>{title}</div>
        {onAdd && <button onClick={onAdd} style={{ background: "transparent", border: `1.5px solid ${C.mint}`, borderRadius: 7, padding: "4px 10px", fontFamily: F.body, fontSize: 12, fontWeight: 600, color: C.green, cursor: "pointer" }}>+ Ajouter</button>}
      </div>
      <div style={{ background: bg, borderRadius: 10, padding: "8px 8px 4px" }}>{children}</div>
    </div>
  );
}

// ─── FORMULAIRE RECETTE ───────────────────────────────────────────────────────
function makeLigne(ingredientId = "", unite = "g") { return { id: genId(), ingredientId, poids: 0, unite }; }

function buildDefaults(ings) {
  return {
    poudres: POUDRES_IDS.filter(id => ings.find(i => i.id === id)).map(id => makeLigne(id, "g")),
    liquides: LIQUIDES_IDS.filter(id => ings.find(i => i.id === id)).map(id => makeLigne(id, ings.find(i => i.id === id)?.unite === "L" ? "L" : "g")),
    ingredients: [], toppings: [],
  };
}

function RecetteForm({ onSave, onCancel, initial, allIng, setData, fournisseurs }) {
  const def = buildDefaults(allIng);
  const [nom, setNom] = useState(initial?.nom || "");
  const [categorie, setCat] = useState(initial?.categorie || "glace");
  const [ephemere, setEph] = useState(initial?.ephemere || false);
  const [notes, setNotes] = useState(initial?.notes || "");
  const [poudres, setPoudres] = useState(initial?.poudres || def.poudres);
  const [liquides, setLiquides] = useState(initial?.liquides || def.liquides);
  const [ingredients, setIngs] = useState(initial?.ingredients || []);
  const [toppings, setTops] = useState(initial?.toppings || []);

  const allLignes = [...poudres, ...liquides, ...ingredients, ...toppings];
  const bioPct = calcBioPct(allLignes, allIng);
  const cout = calcCout(allLignes, allIng);
  const totalG = allLignes.reduce((s, l) => s + toGrams(l.poids || 0, l.unite), 0);
  const bioAlert = getBioAlert(allLignes, allIng);
  const bioPctStrict = calcBioPctStrict(allLignes, allIng);

  const upd = (setter, id, val) => setter(p => p.map(l => l.id === id ? val : l));
  const rm = (setter, id) => setter(p => p.filter(l => l.id !== id));
  const handleCreateIng = (setter) => ({ nom, bio }, callback) => {
    const newIng = { id: genId(), nomRecette: nom, nomEtiquette: nom.toLowerCase(), nomsFournisseur: [], bio, prixKg: 0, fournisseurId: "", fournisseursAlternatifs: [], stockActuel: 0, unite: "kg", allergene: "", categorie: "autre" };
    sbFetch("ingredients", "POST", toDbIngredient(newIng));
    setData(d => ({ ...d, ingredients: [...d.ingredients, newIng] }));
    callback(newIng.id);
  };
  const cats = ["glace", "sorbet", "végétale", "autre"].map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }));

  return (
    <Card style={{ marginBottom: 20, background: C.lightCream }}>
      <h3 style={{ fontFamily: F.display, color: C.darkGreen, marginTop: 0, marginBottom: 14 }}>{initial ? "Modifier la recette" : "Nouvelle recette"}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10, marginBottom: 6 }}>
        <Input label="Nom du parfum *" value={nom} onChange={setNom} placeholder="ex: Café Kumquat" style={{ marginBottom: 0 }} />
        <Select label="Catégorie" value={categorie} onChange={setCat} options={cats} style={{ marginBottom: 0 }} />
      </div>
      <div style={{ marginBottom: 8 }} />
      <Toggle label="Création éphémère (édition limitée)" value={ephemere} onChange={setEph} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 58px 26px", gap: 6, padding: "2px 10px", marginBottom: 2 }}>
        <span style={{ fontSize: 10, color: C.muted, fontFamily: F.body, textTransform: "uppercase" }}>Ingrédient</span>
        <span style={{ fontSize: 10, color: C.muted, fontFamily: F.body, textAlign: "right", textTransform: "uppercase" }}>Quantité</span>
        <span style={{ fontSize: 10, color: C.muted, fontFamily: F.body, textTransform: "uppercase" }}>Unité</span>
        <span />
      </div>

      <Section title="Poudres" bg={C.s1} onAdd={() => setPoudres(p => [...p, makeLigne("", "g")])}>
        {poudres.map(l => <LigneIng key={l.id} ligne={l} bg={C.s1} fixe={POUDRES_IDS.includes(l.ingredientId)} allIng={allIng} onChange={v => upd(setPoudres, l.id, v)} onRemove={() => rm(setPoudres, l.id)} />)}
      </Section>
      <Section title="Liquides" bg={C.s2} onAdd={() => setLiquides(p => [...p, makeLigne("", "L")])}>
        {liquides.map(l => <LigneIng key={l.id} ligne={l} bg={C.s2} fixe={LIQUIDES_IDS.includes(l.ingredientId)} allIng={allIng} onChange={v => upd(setLiquides, l.id, v)} onRemove={() => rm(setLiquides, l.id)} />)}
      </Section>
      <Section title="Ingredients specifiques" bg={C.s3} onAdd={() => setIngs(p => [...p, makeLigne("", "g")])}>
        {ingredients.length === 0 && <div style={{ fontFamily: F.body, fontSize: 12, color: C.muted, padding: "4px 4px 6px", fontStyle: "italic" }}>Ajoutez les ingrédients propres a ce parfum...</div>}
        {ingredients.map(l => <LigneIngLibre key={l.id} ligne={l} bg={C.s3} allIng={allIng} fournisseurs={fournisseurs} onChange={v => upd(setIngs, l.id, v)} onRemove={() => rm(setIngs, l.id)} onCreateIng={handleCreateIng(setIngs)} />)}
      </Section>
      <Section title="Toppings" bg={C.s4} onAdd={() => setTops(p => [...p, makeLigne("", "g")])}>
        {toppings.length === 0 && <div style={{ fontFamily: F.body, fontSize: 12, color: C.muted, padding: "4px 4px 6px", fontStyle: "italic" }}>Ajoutez les toppings eventuels...</div>}
        {toppings.map(l => <LigneIngLibre key={l.id} ligne={l} bg={C.s4} allIng={allIng} fournisseurs={fournisseurs} onChange={v => upd(setTops, l.id, v)} onRemove={() => rm(setTops, l.id)} onCreateIng={handleCreateIng(setTops)} />)}
      </Section>
      <Section title="Notes de fabrication" bg={C.s5}>
        <Textarea value={notes} onChange={setNotes} placeholder="Températures, process, temps d'infusion, conseils topping..." />
      </Section>

      {bioAlert && (
        <div style={{ borderRadius: 10, padding: "10px 14px", marginBottom: 10, fontFamily: F.body, fontSize: 13, background: bioAlert.type === "warning" ? "#FFF3CD" : bioAlert.type === "success" ? "#D4EDDA" : C.lightCream, border: `1.5px solid ${bioAlert.type === "warning" ? C.gold : bioAlert.type === "success" ? C.green : C.lightMint}`, color: bioAlert.type === "warning" ? "#856404" : C.darkGreen }}>
          {bioAlert.message}
        </div>
      )}

      <div style={{ background: C.darkGreen, borderRadius: 10, padding: "11px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontFamily: F.body, fontSize: 13, color: C.lightMint }}>Total : <strong style={{ color: C.white }}>{totalG.toFixed(0)} g</strong></span>
        <span style={{ fontFamily: F.body, fontSize: 13, color: C.lightMint }}>
          Bio (hors eau) : <strong style={{ color: bioPctStrict >= 95 && bioPctStrict < 100 ? "#FFD54F" : bioPctStrict >= 100 ? "#A5D6A7" : C.lightGold }}>{bioPctStrict.toFixed(1)}%</strong>
          {" "}&middot;{" "}Cout : <strong style={{ color: C.white }}>{cout} €</strong>
        </span>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => { if (nom) onSave({ id: initial?.id || genId(), nom, categorie, ephemere, notes, poudres, liquides, ingredients, toppings }); }} disabled={!nom}
          style={{ background: C.green, border: "none", borderRadius: 9, color: C.white, fontFamily: F.body, fontWeight: 600, cursor: !nom ? "not-allowed" : "pointer", fontSize: 14, padding: "9px 20px", opacity: !nom ? 0.5 : 1 }}>
          {initial ? "Enregistrer" : "Créer la recette"}
        </button>
        <button onClick={onCancel} style={{ background: "transparent", border: `1.5px solid ${C.mint}`, borderRadius: 9, color: C.green, fontFamily: F.body, fontWeight: 600, cursor: "pointer", fontSize: 14, padding: "9px 20px" }}>Annuler</button>
      </div>
    </Card>
  );
}

// ─── DÉTAIL RECETTE ───────────────────────────────────────────────────────────
function RecetteDetail({ recette, data, onEdit, onClose }) {
  const allLignes = [...recette.poudres, ...recette.liquides, ...recette.ingredients, ...recette.toppings];
  const bioPct = calcBioPct(allLignes, data.ingredients);
  const cout = calcCout(allLignes, data.ingredients);
  const liste = buildListeEtiquette(allLignes, data.ingredients);
  const allergenes = [...new Set(allLignes.map(l => data.ingredients.find(i => i.id === l.ingredientId)?.allergene).filter(Boolean))];
  const listeText = liste.map((l, i) => (l.bio ? l.nom + "*" : l.nom) + (i < liste.length - 1 ? ", " : "")).join("");
  const bioPctStrict = calcBioPctStrict(allLignes, data.ingredients);
  const bioAlert = getBioAlert(allLignes, data.ingredients);
  const mentionBio = bioPctStrict >= 100
    ? "(* ingrédients d'origine agricole issus de l'AB - certifié par FR-BIO-09)"
    : `(* ${bioPctStrict.toFixed(0)}% des ingrédients d'origine agricole sont issus de l'AB - certifié par FR-BIO-09)`;

  const sections = [
    { label: "Poudres", lignes: recette.poudres, bg: C.s1 },
    { label: "Liquides", lignes: recette.liquides, bg: C.s2 },
    { label: "Ingrédients spécifiques", lignes: recette.ingredients, bg: C.s3 },
    { label: "Toppings", lignes: recette.toppings, bg: C.s4 },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,58,42,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: C.white, borderRadius: 18, padding: 26, maxWidth: 560, width: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <h2 style={{ fontFamily: F.display, color: C.darkGreen, margin: 0, fontSize: 22 }}>{recette.nom}</h2>
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              <Badge color={C.lightMint}>{recette.categorie}</Badge>
              {recette.ephemere && <Badge color={C.lightGold}>Éphémère</Badge>}
              <Badge color={bioPct === 100 ? "#D4EDDA" : "#FFF3CD"}>{bioPct === 100 ? "100% Bio" : `${bioPct}% Bio`}</Badge>
              <Badge color="#EEE">Cout : {cout} €</Badge>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.muted, padding: 0 }}>x</button>
        </div>

        {sections.map(s => {
          const actives = s.lignes.filter(l => l.poids > 0 && l.ingredientId);
          if (!actives.length) return null;
          return (
            <div key={s.label} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: F.body, textTransform: "uppercase", marginBottom: 5 }}>{s.label}</div>
              <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${C.lightMint}` }}>
                {actives.map((l, i) => {
                  const ing = data.ingredients.find(x => x.id === l.ingredientId);
                  return (
                    <div key={l.id} style={{ display: "flex", padding: "7px 12px", borderBottom: i < actives.length - 1 ? `1px solid ${C.lightMint}` : "none", background: i % 2 === 0 ? C.white : C.cream, alignItems: "center", gap: 6 }}>
                      {ing?.bio && <span style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>Bio</span>}
                      <span style={{ flex: 1, fontFamily: F.body, fontSize: 13, color: C.darkGreen }}>{ing?.nomRecette || "?"}</span>
                      <span style={{ fontFamily: F.mono, fontSize: 13, color: C.green, fontWeight: 600 }}>{l.poids} {l.unite}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {recette.notes && (
          <div style={{ background: C.s5, borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, fontFamily: F.body, textTransform: "uppercase", marginBottom: 5 }}>Notes de fabrication</div>
            <div style={{ fontFamily: F.body, fontSize: 13, color: C.text, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{recette.notes}</div>
          </div>
        )}

        {bioAlert && bioAlert.type === "warning" && (
          <div style={{ borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontFamily: F.body, fontSize: 12, background: "#FFF3CD", border: `1.5px solid ${C.gold}`, color: "#856404" }}>{bioAlert.message}</div>
        )}

        <div style={{ background: C.cream, borderRadius: 10, padding: 12, border: `1.5px dashed ${C.mint}`, marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, fontFamily: F.body, textTransform: "uppercase", marginBottom: 5 }}>Apercu etiquette</div>
          <div style={{ fontFamily: F.body, fontSize: 11, fontWeight: 700, color: C.darkGreen }}>{recette.nom}</div>
          <div style={{ fontFamily: F.body, fontSize: 10, color: C.text, lineHeight: 1.5, marginTop: 3, fontStyle: "italic" }}>{listeText}</div>
          <div style={{ fontFamily: F.body, fontSize: 9, color: C.muted, marginTop: 3, fontWeight: 700 }}>{mentionBio}</div>
          {allergenes.length > 0 && <div style={{ fontFamily: F.body, fontSize: 9, color: C.error, marginTop: 2 }}>Contient : {allergenes.join(", ")}</div>}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onEdit} style={{ background: C.lightMint, border: "none", borderRadius: 8, padding: "9px 18px", fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.darkGreen, cursor: "pointer" }}>Modifier</button>
          <button onClick={onClose} style={{ background: "transparent", border: `1.5px solid ${C.mint}`, borderRadius: 8, padding: "9px 18px", fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.green, cursor: "pointer" }}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

// ─── ONGLET RECETTES ──────────────────────────────────────────────────────────
function RecettesTab({ data, setData }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");

  const save = async (r) => {
    if (editing) {
      await sbFetch(`recettes?id=eq.${r.id}`, "PATCH", { nom: r.nom, categorie: r.categorie, ephemere: r.ephemere, notes: r.notes, poudres: r.poudres, liquides: r.liquides, ingredients: r.ingredients, toppings: r.toppings });
      setData(d => ({ ...d, recettes: d.recettes.map(x => x.id === r.id ? r : x) }));
      setEditing(null);
    } else {
      await sbFetch("recettes", "POST", r);
      setData(d => ({ ...d, recettes: [...d.recettes, r] }));
      setShowForm(false);
    }
  };

  const del = async (id) => {
    if (window.confirm("Supprimer cette recette ?")) {
      await sbFetch(`recettes?id=eq.${id}`, "DELETE");
      setData(d => ({ ...d, recettes: d.recettes.filter(r => r.id !== id) }));
    }
  };

  const cats = [...new Set(data.recettes.map(r => r.categorie))];
  const filtered = data.recettes.filter(r => r.nom.toLowerCase().includes(search.toLowerCase()) && (!filterCat || r.categorie === filterCat));

  return (
    <div>
      {detail && <RecetteDetail recette={detail} data={data} onEdit={() => { setEditing(detail); setDetail(null); }} onClose={() => setDetail(null)} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2 style={{ fontFamily: F.display, color: C.darkGreen, margin: 0 }}>Recettes <span style={{ fontSize: 13, fontWeight: 400, color: C.muted }}>({data.recettes.length})</span></h2>
        <button onClick={() => { setShowForm(true); setEditing(null); }} style={{ background: C.green, color: C.white, border: "none", borderRadius: 9, padding: "9px 20px", fontFamily: F.body, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>+ Nouvelle recette</button>
      </div>
      {showForm && !editing && <RecetteForm onSave={save} onCancel={() => setShowForm(false)} allIng={data.ingredients} setData={setData} fournisseurs={data.fournisseurs} />}
      {editing && <RecetteForm initial={editing} onSave={save} onCancel={() => setEditing(null)} allIng={data.ingredients} setData={setData} fournisseurs={data.fournisseurs} />}
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <Input placeholder="Rechercher..." value={search} onChange={setSearch} style={{ flex: 1, marginBottom: 0 }} />
        <Select value={filterCat} onChange={setFilterCat} options={cats.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))} placeholder="Toutes catégories" style={{ flex: 1, marginBottom: 0 }} />
      </div>
      {filtered.length === 0 && !showForm && <Card style={{ textAlign: "center", color: C.muted, fontFamily: F.body, padding: 32 }}>{data.recettes.length === 0 ? "Aucune recette encore." : "Aucun résultat."}</Card>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12 }}>
        {filtered.map(r => {
          const allL = [...r.poudres, ...r.liquides, ...r.ingredients, ...r.toppings];
          const bp = calcBioPct(allL, data.ingredients);
          const cout = calcCout(allL, data.ingredients);
          return (
            <Card key={r.id} style={{ cursor: "pointer", position: "relative" }} onClick={() => setDetail(r)}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <Badge color={C.lightMint}>{r.categorie}</Badge>
                {r.ephemere && <Badge color={C.lightGold}>Éphémère</Badge>}
              </div>
              <div style={{ fontFamily: F.display, fontSize: 16, fontWeight: 700, color: C.darkGreen, marginBottom: 8 }}>{r.nom}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: bp === 100 ? C.green : C.gold, fontFamily: F.body, fontWeight: 700 }}>{bp === 100 ? "100% Bio" : `${bp}% Bio`}</span>
                <span style={{ fontSize: 12, color: C.muted, fontFamily: F.body }}>{cout} €</span>
              </div>
              <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setEditing(r)} style={{ background: C.lightMint, border: "none", borderRadius: 7, padding: "4px 8px", fontFamily: F.body, fontSize: 11, fontWeight: 600, color: C.darkGreen, cursor: "pointer" }}>Modifier</button>
                <button onClick={() => del(r.id)} style={{ background: "#FFE5E5", border: "none", borderRadius: 7, padding: "4px 8px", fontFamily: F.body, fontSize: 11, fontWeight: 600, color: C.error, cursor: "pointer" }}>Supprimer</button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── ONGLET INGRÉDIENTS ───────────────────────────────────────────────────────
function IngredientForm({ onSave, onCancel, initial, fournisseurs }) {
  const [nomRecette, setNomR] = useState(initial?.nomRecette || "");
  const [nomEtiquette, setNomE] = useState(initial?.nomEtiquette || "");
  const [nomsFournisseur, setNomF] = useState((initial?.nomsFournisseur || []).join(", "));
  const [bio, setBio] = useState(initial?.bio ?? false);
  const [prixKg, setPrix] = useState(initial?.prixKg || "");
  const [fournisseurId, setFour] = useState(initial?.fournisseurId || "");
  const [fournisseursAlternatifs, setFourAlts] = useState(initial?.fournisseursAlternatifs || []);
  const [stockActuel, setStock] = useState(initial?.stockActuel || "");
  const [unite, setUnite] = useState(initial?.unite || "kg");
  const [allergene, setAll] = useState(initial?.allergene || "");
  const [categorie, setCat] = useState(initial?.categorie || "autre");

  const allerg = ["", "Lait", "Gluten", "Fruits à coque", "Soja", "Oeufs", "Arachides", "Sésame", "Céleri", "Moutarde", "Poisson", "Crustacés", "Mollusques", "Lupin", "Sulfites"].map(a => ({ value: a, label: a || "Aucun" }));
  const cats = ["poudre", "liquide", "fruit", "aromate", "topping", "autre"].map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }));
  const unites = ["kg", "g", "L", "pièce"].map(u => ({ value: u, label: u }));
  const addFourAlt = () => setFourAlts(p => [...p, { fournisseurId: "", prixKg: 0, bio: false }]);
  const updFourAlt = (i, val) => setFourAlts(p => p.map((x, j) => j === i ? val : x));
  const rmFourAlt = (i) => setFourAlts(p => p.filter((_, j) => j !== i));

  return (
    <Card style={{ marginBottom: 18, background: C.lightCream }}>
      <h3 style={{ fontFamily: F.display, color: C.darkGreen, marginTop: 0, marginBottom: 14 }}>{initial ? "Modifier l'ingrédient" : "Nouvel ingrédient"}</h3>
      <div style={{ background: "#E8F5E9", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
        <Label>Noms (3 champs distincts)</Label>
        <Input label="Nom dans les recettes" value={nomRecette} onChange={setNomR} placeholder="ex: Sucre de canne" />
        <Input label="Nom sur l'étiquette (légal)" value={nomEtiquette} onChange={setNomE} placeholder="ex: sucre de canne non raffiné" />
        <Input label="Alias fournisseurs (séparés par des virgules)" value={nomsFournisseur} onChange={setNomF} placeholder="ex: Sucre canne, Sucre canne Brésil" style={{ marginBottom: 0 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Select label="Catégorie" value={categorie} onChange={setCat} options={cats} />
        <Select label="Unité" value={unite} onChange={setUnite} options={unites} />
        <Input label="Prix / kg (€)" value={prixKg} onChange={setPrix} type="number" placeholder="1.80" style={{ marginBottom: 0 }} />
        <Input label="Stock actuel" value={stockActuel} onChange={setStock} type="number" placeholder="0" style={{ marginBottom: 0 }} />
      </div>
      <div style={{ marginBottom: 10 }} />
      <Select label="Fournisseur principal" value={fournisseurId} onChange={setFour} options={fournisseurs.map(f => ({ value: f.id, label: f.nom }))} placeholder="— Choisir —" />
      <Select label="Allergène" value={allergene} onChange={setAll} options={allerg} />
      <Toggle label="Issu de l'Agriculture Biologique (AB)" value={bio} onChange={setBio} />

      <div style={{ background: C.s2, borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <Label>Fournisseurs alternatifs</Label>
          <button onClick={addFourAlt} style={{ background: C.green, border: "none", borderRadius: 7, color: C.white, fontSize: 12, fontWeight: 700, padding: "4px 10px", cursor: "pointer", fontFamily: F.body }}>+ Ajouter</button>
        </div>
        {fournisseursAlternatifs.length === 0
          ? <div style={{ fontFamily: F.body, fontSize: 12, color: C.muted, fontStyle: "italic" }}>Aucun fournisseur alternatif.</div>
          : fournisseursAlternatifs.map((fa, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 90px auto auto", gap: 6, alignItems: "center", marginBottom: 6 }}>
              <select value={fa.fournisseurId} onChange={e => updFourAlt(i, { ...fa, fournisseurId: e.target.value })} style={{ padding: "6px 8px", borderRadius: 7, border: `1.5px solid ${C.lightMint}`, fontFamily: F.body, fontSize: 12, background: C.white, outline: "none" }}>
                <option value="">— Fournisseur —</option>
                {fournisseurs.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
              </select>
              <input type="number" value={fa.prixKg || ""} onChange={e => updFourAlt(i, { ...fa, prixKg: parseFloat(e.target.value) || 0 })} placeholder="€/kg" style={{ padding: "6px 8px", borderRadius: 7, border: `1.5px solid ${C.lightMint}`, fontFamily: F.mono, fontSize: 12, background: C.white, outline: "none", width: "100%", boxSizing: "border-box" }} />
              <div onClick={() => updFourAlt(i, { ...fa, bio: !fa.bio })} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", userSelect: "none" }}>
                <div style={{ width: 30, height: 17, borderRadius: 9, background: fa.bio ? C.green : C.lightMint, position: "relative", flexShrink: 0 }}><div style={{ width: 11, height: 11, borderRadius: "50%", background: C.white, position: "absolute", top: 3, left: fa.bio ? 16 : 3, transition: "left 0.2s" }} /></div>
                <span style={{ fontSize: 11, color: C.muted, fontFamily: F.body, whiteSpace: "nowrap" }}>Bio</span>
              </div>
              <button onClick={() => rmFourAlt(i)} style={{ background: "#FFE5E5", border: "none", borderRadius: 6, color: C.error, fontSize: 12, padding: "5px 8px", cursor: "pointer", fontWeight: 700 }}>x</button>
            </div>
          ))
        }
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <button onClick={() => { if (nomRecette) onSave({ id: initial?.id || genId(), nomRecette, nomEtiquette: nomEtiquette || nomRecette.toLowerCase(), nomsFournisseur: nomsFournisseur.split(",").map(s => s.trim()).filter(Boolean), bio, prixKg: parseFloat(prixKg) || 0, fournisseurId, fournisseursAlternatifs, stockActuel: parseFloat(stockActuel) || 0, unite, allergene, categorie }); }} disabled={!nomRecette}
          style={{ background: C.green, border: "none", borderRadius: 9, color: C.white, fontFamily: F.body, fontWeight: 600, cursor: !nomRecette ? "not-allowed" : "pointer", fontSize: 14, padding: "9px 20px", opacity: !nomRecette ? 0.5 : 1 }}>
          {initial ? "Enregistrer" : "Ajouter"}
        </button>
        <button onClick={onCancel} style={{ background: "transparent", border: `1.5px solid ${C.mint}`, borderRadius: 9, color: C.green, fontFamily: F.body, fontWeight: 600, cursor: "pointer", fontSize: 14, padding: "9px 20px" }}>Annuler</button>
      </div>
    </Card>
  );
}

function IngredientsTab({ data, setData }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const save = async (ing) => {
    if (editing) {
      await sbFetch("ingredients?id=eq." + ing.id, "PATCH", toDbIngredient(ing));
      setData(d => ({ ...d, ingredients: d.ingredients.map(x => x.id === ing.id ? ing : x) }));
      setEditing(null);
    } else {
      await sbFetch("ingredients", "POST", toDbIngredient(ing));
      setData(d => ({ ...d, ingredients: [...d.ingredients, ing] }));
      setShowForm(false);
    }
  };

  const del = async (id, nom) => {
    if (window.confirm(`Supprimer ${nom} ?`)) {
      await sbFetch(`ingredients?id=eq.${id}`, "DELETE");
      setData(d => ({ ...d, ingredients: d.ingredients.filter(i => i.id !== id) }));
    }
  };

  const filtered = data.ingredients.filter(i => i.nomRecette.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2 style={{ fontFamily: F.display, color: C.darkGreen, margin: 0 }}>Ingrédients</h2>
        <button onClick={() => { setShowForm(true); setEditing(null); }} style={{ background: C.green, color: C.white, border: "none", borderRadius: 9, padding: "9px 20px", fontFamily: F.body, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>+ Ajouter</button>
      </div>
      {showForm && !editing && <IngredientForm onSave={save} onCancel={() => setShowForm(false)} fournisseurs={data.fournisseurs} />}
      {editing && <IngredientForm initial={editing} onSave={save} onCancel={() => setEditing(null)} fournisseurs={data.fournisseurs} />}
      <Input placeholder="Rechercher..." value={search} onChange={setSearch} style={{ marginBottom: 14 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(ing => {
          const f = data.fournisseurs.find(f => f.id === ing.fournisseurId);
          return (
            <Card key={ing.id} style={{ padding: "12px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                    <span style={{ fontFamily: F.body, fontWeight: 700, fontSize: 14, color: C.darkGreen }}>{ing.nomRecette}</span>
                    {ing.bio && <Badge color={C.lightMint}>Bio</Badge>}
                    {ing.allergene && <Badge color="#FFE0D0">{ing.allergene}</Badge>}
                    <Badge color="#EEE">{ing.categorie}</Badge>
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, fontFamily: F.body }}>
                    Etiquette : <em>{ing.nomEtiquette}</em>
                    {ing.nomsFournisseur?.length > 0 && <span style={{ marginLeft: 10 }}>Facture : {ing.nomsFournisseur.join(" / ")}</span>}
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                    {ing.prixKg > 0 && <span style={{ fontSize: 11, color: C.muted, fontFamily: F.body }}>{ing.prixKg.toFixed(2)} €/kg</span>}
                    {f && <span style={{ fontSize: 11, color: C.muted, fontFamily: F.body }}>{f.nom}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={(e) => { e.stopPropagation(); setEditing(ing); }} style={{ background: C.lightMint, border: "none", borderRadius: 8, padding: "6px 12px", fontFamily: F.body, fontSize: 12, fontWeight: 600, color: C.darkGreen, cursor: "pointer" }}>Modifier</button>
                  <button onClick={(e) => { e.stopPropagation(); del(ing.id, ing.nomRecette); }} style={{ background: "#FFE5E5", border: "none", borderRadius: 8, padding: "6px 12px", fontFamily: F.body, fontSize: 12, fontWeight: 600, color: C.error, cursor: "pointer" }}>Supprimer</button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── ONGLET FOURNISSEURS ──────────────────────────────────────────────────────
function FournisseurForm({ onSave, onCancel, initial }) {
  const [nom, setNom] = useState(initial?.nom || "");
  const [jourCommande, setJC] = useState(initial?.jourCommande || "lundi");
  const [jourLivraison, setJL] = useState(initial?.jourLivraison || "mardi");
  const [contact, setContact] = useState(initial?.contact || "");
  const jours = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"].map(j => ({ value: j, label: j.charAt(0).toUpperCase() + j.slice(1) }));
  return (
    <Card style={{ marginBottom: 18, background: C.lightCream }}>
      <h3 style={{ fontFamily: F.display, color: C.darkGreen, marginTop: 0, marginBottom: 14 }}>{initial ? "Modifier" : "Nouveau fournisseur"}</h3>
      <Input label="Nom" value={nom} onChange={setNom} placeholder="ex: Laiterie du Val" />
      <Input label="Contact / Email / Tél" value={contact} onChange={setContact} placeholder="contact@fournisseur.fr" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Select label="Jour commande" value={jourCommande} onChange={setJC} options={jours} />
        <Select label="Jour livraison" value={jourLivraison} onChange={setJL} options={jours} />
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => { if (nom) onSave({ id: initial?.id || genId(), nom, jourCommande, jourLivraison, contact }); }} disabled={!nom}
          style={{ background: C.green, border: "none", borderRadius: 9, color: C.white, fontFamily: F.body, fontWeight: 600, cursor: !nom ? "not-allowed" : "pointer", fontSize: 14, padding: "9px 20px", opacity: !nom ? 0.5 : 1 }}>
          {initial ? "Enregistrer" : "Ajouter"}
        </button>
        <button onClick={onCancel} style={{ background: "transparent", border: `1.5px solid ${C.mint}`, borderRadius: 9, color: C.green, fontFamily: F.body, fontWeight: 600, cursor: "pointer", fontSize: 14, padding: "9px 20px" }}>Annuler</button>
      </div>
    </Card>
  );
}

function FournisseursTab({ data, setData }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const save = async (f) => {
    if (editing) {
      await sbFetch("fournisseurs?id=eq." + f.id, "PATCH", toDbFournisseur(f));
      setData(d => ({ ...d, fournisseurs: d.fournisseurs.map(x => x.id === f.id ? f : x) }));
      setEditing(null);
    } else {
      await sbFetch("fournisseurs", "POST", toDbFournisseur(f));
      setData(d => ({ ...d, fournisseurs: [...d.fournisseurs, f] }));
      setShowForm(false);
    }
  };

  const del = async (id, nom) => {
    if (window.confirm(`Supprimer ${nom} ?`)) {
      await sbFetch(`fournisseurs?id=eq.${id}`, "DELETE");
      setData(d => ({ ...d, fournisseurs: d.fournisseurs.filter(f => f.id !== id) }));
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2 style={{ fontFamily: F.display, color: C.darkGreen, margin: 0 }}>Fournisseurs</h2>
        <button onClick={() => { setShowForm(true); setEditing(null); }} style={{ background: C.green, color: C.white, border: "none", borderRadius: 9, padding: "9px 20px", fontFamily: F.body, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>+ Ajouter</button>
      </div>
      {showForm && !editing && <FournisseurForm onSave={save} onCancel={() => setShowForm(false)} />}
      {editing && <FournisseurForm initial={editing} onSave={save} onCancel={() => setEditing(null)} />}
      {data.fournisseurs.length === 0 && !showForm && <Card style={{ textAlign: "center", color: C.muted, fontFamily: F.body }}>Aucun fournisseur.</Card>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.fournisseurs.map(f => (
          <Card key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: F.display, fontSize: 16, color: C.darkGreen, fontWeight: 700 }}>{f.nom}</div>
              {f.contact && <div style={{ fontSize: 12, color: C.muted, fontFamily: F.body, marginTop: 2 }}>{f.contact}</div>}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <Badge color={C.lightGold}>Commande : {f.jourCommande}</Badge>
                <Badge color={C.lightMint}>Livraison : {f.jourLivraison}</Badge>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button onClick={() => setEditing(f)} style={{ background: C.lightMint, border: "none", borderRadius: 7, padding: "6px 12px", fontFamily: F.body, fontSize: 12, fontWeight: 600, color: C.darkGreen, cursor: "pointer" }}>Modifier</button>
              <button onClick={() => del(f.id, f.nom)} style={{ background: "#FFE5E5", border: "none", borderRadius: 7, padding: "6px 12px", fontFamily: F.body, fontSize: 12, fontWeight: 600, color: C.error, cursor: "pointer" }}>Supprimer</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── TABLEAU DE BORD ──────────────────────────────────────────────────────────
function DashboardTab({ data, setData }) {
  const lignesAll = data.recettes.map(r => [...r.poudres, ...r.liquides, ...r.ingredients, ...r.toppings]);
  const bio100 = data.recettes.filter((r, i) => calcBioPct(lignesAll[i], data.ingredients) === 100).length;
  const stats = [
    { label: "Recettes", value: data.recettes.length, color: C.green },
    { label: "Ingrédients", value: data.ingredients.length, color: C.mint },
    { label: "100% Bio", value: bio100, color: "#2E7D32" },
    { label: "Éphémères", value: data.recettes.filter(r => r.ephemere).length, color: C.gold },
    { label: "Fournisseurs", value: data.fournisseurs.length, color: C.muted },
  ];
  return (
    <div>
      <h2 style={{ fontFamily: F.display, color: C.darkGreen, marginBottom: 4 }}>Tableau de bord</h2>
      <p style={{ fontFamily: F.body, color: C.muted, marginBottom: 22, fontSize: 13 }}>La Tropicale Glacier — Recettes et Ingrédients</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10, marginBottom: 24 }}>
        {stats.map(s => (
          <Card key={s.label} style={{ textAlign: "center", padding: "16px 10px" }}>
            <div style={{ fontFamily: F.display, fontSize: 28, fontWeight: 700, color: s.color, lineHeight: 1.1 }}>{s.value}</div>
            <div style={{ fontFamily: F.body, fontSize: 11, color: C.muted, marginTop: 3 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <ImportExportPanel data={data} setData={setData} />

      {data.recettes.length > 0 && (
        <>
          <h3 style={{ fontFamily: F.display, color: C.darkGreen, marginBottom: 10 }}>Dernières recettes</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.recettes.slice(-5).reverse().map(r => {
              const l = [...r.poudres, ...r.liquides, ...r.ingredients, ...r.toppings];
              const bp = calcBioPct(l, data.ingredients);
              return (
                <Card key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 16px" }}>
                  <span style={{ fontFamily: F.body, fontWeight: 700, color: C.darkGreen }}>{r.nom}</span>
                  <Badge color={bp === 100 ? "#D4EDDA" : "#FFF3CD"}>{bp === 100 ? "100%" : `${bp}%`}</Badge>
                </Card>
              );
            })}
          </div>
        </>
      )}
      {data.recettes.length === 0 && (
        <Card style={{ background: C.lightCream, textAlign: "center", padding: 28 }}>
          <div style={{ fontFamily: F.display, fontSize: 17, color: C.darkGreen, marginBottom: 6 }}>Bienvenue !</div>
          <div style={{ fontFamily: F.body, fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
            Vos fournisseurs et ingrédients de base sont prêts.<br />
            Créez votre première <strong>Recette</strong> pour commencer !
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
const TABS = [
  { id: "dashboard", label: "Accueil" },
  { id: "recettes", label: "Recettes" },
  { id: "ingredients", label: "Ingrédients" },
  { id: "fournisseurs", label: "Fournisseurs" },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [data, setData] = useState({ fournisseurs: [], ingredients: [], recettes: [] });
  const [loading, setLoading] = useState(true);
  const [syncMsg, setSyncMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [fournisseurs, ingredients, recettes] = await Promise.all([
          sbFetch("fournisseurs", "GET", null, "?order=nom&select=*"),
          sbFetch("ingredients", "GET", null, "?order=nom_recette&select=*"),
          sbFetch("recettes", "GET", null, "?order=nom&select=*"),
        ]);

        setSyncMsg("Supabase: " + (fournisseurs?.length || 0) + " fournisseurs, " + (ingredients?.length || 0) + " ingredients, " + (recettes?.length || 0) + " recettes");
        setTimeout(() => setSyncMsg(""), 6000);

        if (!fournisseurs?.length && !ingredients?.length && !recettes?.length) {
          setSyncMsg("Initialisation de la base de données...");
          await Promise.all(INIT_FOURNISSEURS.map(f => sbFetch("fournisseurs", "POST", f)));
          await Promise.all(INIT_INGREDIENTS.map(i => sbFetch("ingredients", "POST", i)));
          await Promise.all(INIT_RECETTES.map(r => sbFetch("recettes", "POST", r)));
          setData({ fournisseurs: INIT_FOURNISSEURS, ingredients: INIT_INGREDIENTS, recettes: INIT_RECETTES });
          setSyncMsg("Base initialisée !");
          setTimeout(() => setSyncMsg(""), 4000);
        } else {
          setData({
            fournisseurs: (fournisseurs || []).map(mapFournisseur),
            ingredients: (ingredients || []).map(mapIngredient),
            recettes: (recettes || []).map(mapRecette),
          });
          setSyncMsg("Supabase: " + (fournisseurs?.length || 0) + " fournisseurs, " + (ingredients?.length || 0) + " ingredients, " + (recettes?.length || 0) + " recettes");
          setTimeout(() => setSyncMsg(""), 5000);
        }
      } catch (err) {
        console.error("Erreur Supabase:", err);
        setSyncMsg("Erreur de connexion — réessayez dans quelques secondes");
        setTimeout(() => setSyncMsg(""), 5000);
        setData({ fournisseurs: INIT_FOURNISSEURS, ingredients: INIT_INGREDIENTS, recettes: INIT_RECETTES });
      }
      setLoading(false);
    })();
  }, []);

  // Fonction de rechargement depuis Supabase
  const reloadFromSupabase = async () => {
    setSyncMsg("Synchronisation en cours...");
    try {
      const [fournisseurs, ingredients, recettes] = await Promise.all([
        sbFetch("fournisseurs", "GET", null, "?order=nom&select=*"),
        sbFetch("ingredients", "GET", null, "?order=nom_recette&select=*"),
        sbFetch("recettes", "GET", null, "?order=nom&select=*"),
      ]);
      if (Array.isArray(recettes)) {
        setData({
          fournisseurs: (fournisseurs || []).map(mapFournisseur),
          ingredients: (ingredients || []).map(mapIngredient),
          recettes: (recettes || []).map(mapRecette),
        });
        setSyncMsg("Sync OK : " + recettes.length + " recettes, " + ingredients.length + " ingredients");
      } else {
        setSyncMsg("Erreur : réponse invalide de Supabase");
      }
    } catch (err) {
      setSyncMsg("Erreur de synchronisation");
    }
    setTimeout(() => setSyncMsg(""), 5000);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: F.body }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;600;700&family=DM+Mono&display=swap');
        * { box-sizing: border-box; }
        input:focus, select:focus, textarea:focus { border-color: #52B788 !important; box-shadow: 0 0 0 3px rgba(82,183,136,0.15); outline: none; }
        button:hover:not(:disabled) { filter: brightness(0.93); }
      `}</style>

      {syncMsg && (
        <div style={{ position: "fixed", top: 16, right: 16, zIndex: 200, background: C.darkGreen, color: C.white, borderRadius: 10, padding: "12px 18px", fontFamily: F.body, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", maxWidth: 320 }}>
          {syncMsg}
        </div>
      )}

      <div style={{ background: C.darkGreen, padding: "14px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <div>
          <div style={{ fontFamily: F.display, color: C.white, fontSize: 19, fontWeight: 700 }}>La Tropicale Glacier</div>
          <div style={{ fontFamily: F.body, color: C.lightMint, fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }}>Recettes · Ingrédients · Étiquettes</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <Badge color={C.lightMint}>{data.recettes.length} recettes</Badge>
          <Badge color={C.lightGold}>{data.ingredients.length} ingrédients</Badge>
          <button onClick={reloadFromSupabase} title="Synchroniser"
            style={{ background: C.mint, border: "none", borderRadius: 8, color: C.white, fontFamily: F.body, fontSize: 12, fontWeight: 600, padding: "5px 12px", cursor: "pointer" }}>
            Sync
          </button>
        </div>
      </div>

      <div style={{ background: C.white, borderBottom: `1px solid ${C.lightMint}`, padding: "0 24px", display: "flex", gap: 2 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F.body, fontSize: 13, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? C.green : C.muted, padding: "13px 14px", borderBottom: tab === t.id ? `2.5px solid ${C.green}` : "2.5px solid transparent", transition: "all 0.15s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, fontFamily: F.body, color: C.muted, fontSize: 16 }}>
          Connexion à la base de données...
        </div>
      ) : (
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 16px" }}>
          {tab === "dashboard" && <DashboardTab data={data} setData={setData} />}
          {tab === "recettes" && <RecettesTab data={data} setData={setData} />}
          {tab === "ingredients" && <IngredientsTab data={data} setData={setData} />}
          {tab === "fournisseurs" && <FournisseursTab data={data} setData={setData} />}
        </div>
      )}
    </div>
  );
}
