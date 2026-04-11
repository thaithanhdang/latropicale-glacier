/* eslint-disable */
import { useState, useEffect } from "react";

const C = {
 cream: "#FFF8F0", darkGreen: "#1A3A2A", green: "#2D6A4F",
 mint: "#52B788", lightMint: "#B7E4C7", gold: "#C9A84C",
 lightGold: "#F0DFA0", text: "#1A3A2A", muted: "#6B8F71",
 white: "#FFFFFF", error: "#C0392B", lightCream: "#FFF3E0",
 section1: "#E8F5E9", section2: "#E3F2FD", section3: "#FFF8E1",
 section4: "#FCE4EC", section5: "#F3F0FF",
};
const F = {
 display: "'Playfair Display', Georgia, serif",
 body: "'DM Sans', sans-serif",
 mono: "'DM Mono', monospace",
};

const POUDRES_IDS = ["ing_lin", "ing_guar", "ing_sucre_canne", "ing_poudre_lait"];
const LIQUIDES_IDS = ["ing_lait_entier", "ing_creme_crue", "ing_sirop_agave", "ing_eau"];

const initialData = {
 fournisseurs: [
 {
 id: "four_fromentellerie",
 nom: "SARL La Fromentellerie",
 contact: "lafromentellerie@gmail.com | 06 87 17 64 07",
 jourCommande: "vendredi", jourLivraison: "mardi",
 },
 {
 id: "four_agrosourcing",
 nom: "Agro Sourcing",
 contact: "04 42 58 88 06 | 388 Av. Galerie de la Mer, 13120 Gardanne | 1-2 commandes/an",
 jourCommande: "lundi", jourLivraison: "lundi",
 },
 {
 id: "four_comptoir_praline",
 nom: "Comptoir du Praliné",
 contact: "hdeguiraud@comptoirdupraline.fr | 06 98 97 72 62 | www.comptoirdupraline.fr",
 jourCommande: "lundi", jourLivraison: "lundi",
 },
 {
 id: "four_umami",
 nom: "Umami Paris",
 contact: "01 43 94 97 91 | www.umamiparis.com | 2 av. Jean Moulin, 94120 Fontenay-sous-Bois",
 jourCommande: "lundi", jourLivraison: "lundi",
 },
 {
 id: "four_biocoop",
 nom: "Biocoop Restauration",
 contact: "02 99 92 86 94 | ZA de la Morandais, 35190 Tinteniac",
 jourCommande: "lundi", jourLivraison: "lundi",
 },
 {
 id: "four_kaoka",
 nom: "Kaoka",
 contact: "info@kaoka.fr | 04 90 66 55 55 | 340 rue Eugène Guérin, 84200 Carpentras | commandes variables",
 jourCommande: "lundi", jourLivraison: "lundi",
 },
 {
 id: "four_dipsa",
 nom: "DIPSA",
 contact: "compta.clients@dipsa-sa.com | 01 39 13 74 28 | 78507 Sartrouville | commandes variables",
 jourCommande: "lundi", jourLivraison: "lundi",
 },
 ],
 ingredients: [
 { id: "ing_lin", nomRecette: "Lin", nomEtiquette: "lin", nomsFournisseur: ["Lin", "Farine de lin"], bio: true, prixKg: 0, fournisseurId: "", stockActuel: 0, unite: "kg", allergene: "", categorie: "poudre" },
 { id: "ing_guar", nomRecette: "Guar", nomEtiquette: "guar", nomsFournisseur: ["Guar", "Gomme de guar"], bio: true, prixKg: 0, fournisseurId: "", stockActuel: 0, unite: "kg", allergene: "", categorie: "poudre" },
 { id: "ing_sucre_canne", nomRecette: "Sucre de canne", nomEtiquette: "sucre de canne non raffiné", nomsFournisseur: ["Sucre canne", "Sucre de canne", "Sucre canne Brésil"], bio: true, prixKg: 0, fournisseurId: "", stockActuel: 0, unite: "kg", allergene: "", categorie: "poudre" },
 { id: "ing_poudre_lait", nomRecette: "Poudre de lait", nomEtiquette: "lait en poudre", nomsFournisseur: ["Poudre de lait", "Lait en poudre"], bio: true, prixKg: 0, fournisseurId: "", stockActuel: 0, unite: "kg", allergene: "Lait", categorie: "poudre" },
 { id: "ing_lait_entier", nomRecette: "Lait entier pasteurisé", nomEtiquette: "lait frais entier", nomsFournisseur: ["Lait entier pasteurisé"], bio: true, prixKg: 1.90, fournisseurId: "four_fromentellerie", stockActuel: 0, unite: "L", allergene: "Lait", categorie: "liquide" },
 { id: "ing_creme_crue", nomRecette: "Crème crue", nomEtiquette: "crème fraîche crue", nomsFournisseur: ["Crème crue"], bio: true, prixKg: 12.89, fournisseurId: "four_fromentellerie", stockActuel: 0, unite: "kg", allergene: "Lait", categorie: "liquide" },
 { id: "ing_sirop_agave", nomRecette: "Sirop d'agave", nomEtiquette: "sirop d'agave", nomsFournisseur: ["Sirop agave", "Sirop d'agave"], bio: true, prixKg: 0, fournisseurId: "", stockActuel: 0, unite: "kg", allergene: "", categorie: "liquide" },
 { id: "ing_eau", nomRecette: "Eau", nomEtiquette: "eau", nomsFournisseur: ["Eau"], bio: false, prixKg: 0, fournisseurId: "", stockActuel: 0, unite: "L", allergene: "", categorie: "liquide" },
 { id: "ing_pistaches", nomRecette: "Pistaches décortiquées", nomEtiquette: "pistaches", nomsFournisseur: ["Pistaches d'Espagne décortiquées", "Pistaches décortiquées"], bio: true, prixKg: 32.46, fournisseurId: "four_agrosourcing", stockActuel: 0, unite: "kg", allergene: "Fruits à coque", categorie: "topping" },
 { id: "ing_lait_coco", nomRecette: "Lait de coco", nomEtiquette: "lait de coco", nomsFournisseur: ["Lait de coco du Sri Lanka", "Lait de coco"], bio: true, prixKg: 2.99, fournisseurId: "four_agrosourcing", stockActuel: 0, unite: "L", allergene: "", categorie: "liquide" },

 // Comptoir du Praliné
 { id: "ing_pate_pistache", nomRecette: "Pâte de pistache", nomEtiquette: "pâte de pistache", nomsFournisseur: ["Pâte de Pistache Iran Kernel 100%", "Pâte de pistache"], bio: false, prixKg: 39.12, fournisseurId: "four_comptoir_praline", stockActuel: 0, unite: "kg", allergene: "Fruits à coque", categorie: "autre" },
 { id: "ing_pate_sesame_noir", nomRecette: "Pâte de sésame noir", nomEtiquette: "pâte de sésame noir", nomsFournisseur: ["Pure Pâte de Sésame Noir", "Pâte de sésame noir bio", "Pâte de sésame noir"], bio: true, prixKg: 38.53, fournisseurId: "four_umami", fournisseursAlternatifs: [{ fournisseurId: "four_comptoir_praline", prixKg: 17.16, bio: false }], stockActuel: 0, unite: "kg", allergene: "Sésame", categorie: "autre" },

 // Umami
 { id: "ing_the_hojicha", nomRecette: "Poudre de thé Hojicha", nomEtiquette: "poudre de thé Hojicha", nomsFournisseur: ["Poudre de thé Hojicha Bio", "Thé Hojicha"], bio: true, prixKg: 126.40, fournisseurId: "four_umami", stockActuel: 0, unite: "kg", allergene: "", categorie: "aromate" },

 // Biocoop Restauration
 { id: "ing_farine_riz", nomRecette: "Farine de riz complet", nomEtiquette: "farine de riz complet", nomsFournisseur: ["Farine de riz complet Bio 3kg"], bio: true, prixKg: 4.13, fournisseurId: "four_biocoop", stockActuel: 0, unite: "kg", allergene: "", categorie: "poudre" },
 { id: "ing_boisson_soja", nomRecette: "Lait de soja", nomEtiquette: "lait de soja", nomsFournisseur: ["Boisson soja nature Bio 1L", "Lait de soja"], bio: true, prixKg: 1.60, fournisseurId: "four_biocoop", stockActuel: 0, unite: "L", allergene: "Soja", categorie: "liquide" },
 { id: "ing_flocons_sarrasin", nomRecette: "Flocons de sarrasin", nomEtiquette: "flocons de sarrasin", nomsFournisseur: ["Flocons de sarrasin Bio 500g"], bio: true, prixKg: 7.38, fournisseurId: "four_biocoop", stockActuel: 0, unite: "kg", allergene: "", categorie: "poudre" },
 { id: "ing_cafe_instantane", nomRecette: "Café instantané", nomEtiquette: "café instantané", nomsFournisseur: ["Café instantané Bio 100g"], bio: true, prixKg: 45.00, fournisseurId: "four_biocoop", stockActuel: 0, unite: "kg", allergene: "", categorie: "aromate" },
 { id: "ing_flocons_avoine", nomRecette: "Flocons d'avoine sans gluten", nomEtiquette: "flocons d'avoine sans gluten", nomsFournisseur: ["Flocon d'avoine petit sans gluten Bio 500g"], bio: true, prixKg: 5.24, fournisseurId: "four_biocoop", stockActuel: 0, unite: "kg", allergene: "Gluten", categorie: "poudre" },
 { id: "ing_jus_citron_vert", nomRecette: "Jus de citron vert", nomEtiquette: "jus de citron vert", nomsFournisseur: ["Jus de citron vert Bio 25cl"], bio: true, prixKg: 6.72, fournisseurId: "four_biocoop", stockActuel: 0, unite: "L", allergene: "", categorie: "liquide" },
 { id: "ing_jus_gingembre", nomRecette: "Jus de gingembre", nomEtiquette: "jus de gingembre", nomsFournisseur: ["Jus de gingembre Bio 25cl"], bio: true, prixKg: 12.32, fournisseurId: "four_biocoop", stockActuel: 0, unite: "L", allergene: "", categorie: "liquide" },
 { id: "ing_creme_uht", nomRecette: "Crème liquide UHT", nomEtiquette: "crème liquide", nomsFournisseur: ["Crème Liquide UHT 35%MG bio Tetra 1L", "Crème liquide UHT"], bio: true, prixKg: 6.90, fournisseurId: "four_biocoop", stockActuel: 0, unite: "L", allergene: "Lait", categorie: "liquide" },

 // Kaoka
 { id: "ing_cacao_poudre", nomRecette: "Poudre de cacao", nomEtiquette: "poudre de cacao", nomsFournisseur: ["Poudre de Cacao Alcalinisée 20/22% MG", "Poudre de cacao"], bio: true, prixKg: 14.45, fournisseurId: "four_kaoka", stockActuel: 0, unite: "kg", allergene: "", categorie: "poudre" },

 // DIPSA
 { id: "ing_puree_citron", nomRecette: "Purée de citron jaune", nomEtiquette: "purée de citron jaune", nomsFournisseur: ["PUREE FRAIS CITRON J BIO 1KG", "Purée citron jaune"], bio: true, prixKg: 8.28, fournisseurId: "four_dipsa", stockActuel: 0, unite: "kg", allergene: "", categorie: "fruit" },
 ],
 recettes: [
    { id: "rec_passion_framboise", nom: "Passion Framboise", categorie: "sorbet", ephemere: false, notes: "", poudres: [ { id: "pf1", ingredientId: "ing_lin", poids: 70, unite: "g" }, { id: "pf2", ingredientId: "ing_guar", poids: 30, unite: "g" }, { id: "pf3", ingredientId: "ing_sucre_canne", poids: 2500, unite: "g" } ], liquides: [ { id: "pf4", ingredientId: "ing_eau", poids: 5, unite: "L" } ], ingredients: [ { id: "pf5", ingredientId: "ing_framboise_puree", poids: 6000, unite: "g" }, { id: "pf6", ingredientId: "ing_passion_puree", poids: 4000, unite: "g" } ], toppings: [] },
    { id: "rec_mangue_keesar", nom: "Mangue Keesar", categorie: "sorbet", ephemere: false, notes: "Base : base de recette pour 3 boites de mangue - poids approximatif", poudres: [ { id: "mk1", ingredientId: "ing_lin", poids: 50, unite: "g" }, { id: "mk2", ingredientId: "ing_guar", poids: 30, unite: "g" }, { id: "mk3", ingredientId: "ing_sucre_canne", poids: 1200, unite: "g" } ], liquides: [ { id: "mk4", ingredientId: "ing_sirop_agave", poids: 600, unite: "g" }, { id: "mk5", ingredientId: "ing_eau", poids: 6, unite: "L" } ], ingredients: [ { id: "mk6", ingredientId: "ing_mangue_keesar", poids: 9, unite: "kg" }, { id: "mk7", ingredientId: "ing_jus_citron_vert", poids: 150, unite: "g" } ], toppings: [] },
    { id: "rec_lychee_groseille", nom: "Lychee groseille", categorie: "sorbet", ephemere: false, notes: "TOPPING : faitout moyen - melanger sucre et groseilles - cuisson th4 20min puis th5 15min", poudres: [ { id: "lg1", ingredientId: "ing_lin", poids: 50, unite: "g" }, { id: "lg2", ingredientId: "ing_guar", poids: 30, unite: "g" }, { id: "lg3", ingredientId: "ing_sucre_canne", poids: 2000, unite: "g" } ], liquides: [ { id: "lg4", ingredientId: "ing_eau", poids: 5, unite: "L" } ], ingredients: [ { id: "lg5", ingredientId: "ing_puree_lychee", poids: 10, unite: "kg" }, { id: "lg6", ingredientId: "ing_puree_citron_vert_boiron", poids: 500, unite: "g" } ], toppings: [ { id: "lg7", ingredientId: "ing_groseille_bille", poids: 2, unite: "kg" }, { id: "lg8", ingredientId: "ing_sucre_canne", poids: 500, unite: "g" } ] },
    { id: "rec_fleur_oranger_pistache", nom: "Fleur oranger pistache", categorie: "glace", ephemere: false, notes: "Base : incorporer eau fleur oranger a froid - infuser 24h. TOPPING : +150g pistache pour les pots", poudres: [ { id: "fo1", ingredientId: "ing_lin", poids: 40, unite: "g" }, { id: "fo2", ingredientId: "ing_guar", poids: 20, unite: "g" }, { id: "fo3", ingredientId: "ing_sucre_canne", poids: 2200, unite: "g" }, { id: "fo4", ingredientId: "ing_poudre_lait", poids: 1000, unite: "g" } ], liquides: [ { id: "fo5", ingredientId: "ing_lait_entier", poids: 12.5, unite: "L" }, { id: "fo6", ingredientId: "ing_creme_crue", poids: 2000, unite: "g" }, { id: "fo7", ingredientId: "ing_sirop_agave", poids: 400, unite: "g" } ], ingredients: [ { id: "fo8", ingredientId: "ing_eau_fleur_oranger", poids: 400, unite: "g" } ], toppings: [ { id: "fo9", ingredientId: "ing_pistaches", poids: 500, unite: "g" }, { id: "fo10", ingredientId: "ing_pistaches", poids: 150, unite: "g" } ] },
    { id: "rec_lemon_curd", nom: "Lemon curd", categorie: "glace", ephemere: false, notes: "Base : sirop citron-sucre max 60 degres - incorporer a froid. Topping : melanger poudres + lait soja + citron. Fouet. Chauffer th4 epaississement.", poudres: [ { id: "lc1", ingredientId: "ing_lin", poids: 40, unite: "g" }, { id: "lc2", ingredientId: "ing_guar", poids: 20, unite: "g" }, { id: "lc3", ingredientId: "ing_sucre_canne", poids: 1200, unite: "g" }, { id: "lc4", ingredientId: "ing_poudre_lait", poids: 1000, unite: "g" } ], liquides: [ { id: "lc5", ingredientId: "ing_lait_entier", poids: 10, unite: "L" }, { id: "lc6", ingredientId: "ing_creme_crue", poids: 2, unite: "g" }, { id: "lc7", ingredientId: "ing_sirop_agave", poids: 400, unite: "g" } ], ingredients: [ { id: "lc8", ingredientId: "ing_puree_citron", poids: 5, unite: "L" }, { id: "lc9", ingredientId: "ing_sucre_canne", poids: 1300, unite: "g" } ], toppings: [ { id: "lc10", ingredientId: "ing_puree_citron", poids: 1, unite: "L" }, { id: "lc11", ingredientId: "ing_boisson_soja", poids: 750, unite: "g" }, { id: "lc12", ingredientId: "ing_sucre_canne", poids: 1000, unite: "g" }, { id: "lc13", ingredientId: "ing_fecule_mais", poids: 150, unite: "g" }, { id: "lc14", ingredientId: "ing_curcuma", poids: 5, unite: "g" } ] },
    { id: "rec_praline_sesame", nom: "Praline sesame noir", categorie: "glace", ephemere: false, notes: "Base : incorporer pate sesame noir et praline a froid. Topping : sirop th5 5min - epaississement - amandes sec - sabler - carameliser th6/7", poudres: [ { id: "ps1", ingredientId: "ing_lin", poids: 70, unite: "g" }, { id: "ps2", ingredientId: "ing_guar", poids: 20, unite: "g" }, { id: "ps3", ingredientId: "ing_sucre_canne", poids: 1800, unite: "g" }, { id: "ps4", ingredientId: "ing_poudre_lait", poids: 1200, unite: "g" } ], liquides: [ { id: "ps5", ingredientId: "ing_lait_entier", poids: 12.5, unite: "L" }, { id: "ps6", ingredientId: "ing_sirop_agave", poids: 400, unite: "g" }, { id: "ps7", ingredientId: "ing_creme_uht", poids: 2, unite: "L" } ], ingredients: [ { id: "ps8", ingredientId: "ing_pate_praline_amande", poids: 1500, unite: "g" }, { id: "ps9", ingredientId: "ing_pate_sesame_noir", poids: 500, unite: "g" } ], toppings: [] },
    { id: "rec_chocolat_feve_tonka", nom: "Chocolat feve tonka", categorie: "glace", ephemere: false, notes: "Base : incorporer feve tonka a chaud + poudre cacao - cuisson th10 23min", poudres: [ { id: "cf1", ingredientId: "ing_lin", poids: 60, unite: "g" }, { id: "cf2", ingredientId: "ing_guar", poids: 20, unite: "g" }, { id: "cf3", ingredientId: "ing_sucre_canne", poids: 2200, unite: "g" }, { id: "cf4", ingredientId: "ing_poudre_lait", poids: 1000, unite: "g" } ], liquides: [ { id: "cf5", ingredientId: "ing_lait_entier", poids: 12.5, unite: "L" }, { id: "cf6", ingredientId: "ing_creme_crue", poids: 2000, unite: "g" }, { id: "cf7", ingredientId: "ing_sirop_agave", poids: 400, unite: "g" } ], ingredients: [ { id: "cf8", ingredientId: "ing_cacao_poudre", poids: 600, unite: "g" }, { id: "cf9", ingredientId: "ing_feve_tonka", poids: 40, unite: "g" } ], toppings: [] },
    { id: "rec_coco_sesame", nom: "Coco sesame", categorie: "végétale", ephemere: false, notes: "Base : eau th10 ebullition + lait coco + 75 degres. Topping : poele - sel 100ml eau - th4 8-12min - arreter une fois dore", poudres: [ { id: "cs1", ingredientId: "ing_lin", poids: 50, unite: "g" }, { id: "cs2", ingredientId: "ing_guar", poids: 20, unite: "g" }, { id: "cs3", ingredientId: "ing_sucre_canne", poids: 2500, unite: "g" } ], liquides: [ { id: "cs4", ingredientId: "ing_sirop_agave", poids: 600, unite: "g" }, { id: "cs5", ingredientId: "ing_eau", poids: 4, unite: "L" } ], ingredients: [ { id: "cs6", ingredientId: "ing_lait_coco_aroy", poids: 10, unite: "g" }, { id: "cs7", ingredientId: "ing_sel_guerande", poids: 15, unite: "g" } ], toppings: [ { id: "cs8", ingredientId: "ing_graine_sesame", poids: 400, unite: "g" }, { id: "cs9", ingredientId: "ing_sel_guerande", poids: 30, unite: "g" }, { id: "cs10", ingredientId: "ing_eau", poids: 100, unite: "g" } ] },
    { id: "rec_pistache_iran", nom: "Pistache Iran", categorie: "glace", ephemere: false, notes: "Incorporation de la pate a froid", poudres: [ { id: "pi1", ingredientId: "ing_lin", poids: 20, unite: "g" }, { id: "pi2", ingredientId: "ing_guar", poids: 50, unite: "g" }, { id: "pi3", ingredientId: "ing_sucre_canne", poids: 2400, unite: "g" }, { id: "pi4", ingredientId: "ing_poudre_lait", poids: 1200, unite: "g" } ], liquides: [ { id: "pi5", ingredientId: "ing_lait_entier", poids: 12.5, unite: "L" }, { id: "pi6", ingredientId: "ing_sirop_agave", poids: 400, unite: "g" }, { id: "pi7", ingredientId: "ing_creme_uht", poids: 2, unite: "L" } ], ingredients: [ { id: "pi8", ingredientId: "ing_pate_pistache", poids: 2000, unite: "g" } ], toppings: [] },
  ],
};

function genId() { return Math.random().toString(36).slice(2, 9); }

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

function toGrams(val, unite) {
 if (unite === "kg" || unite === "L") return val * 1000;
 if (unite === "cl") return val * 10;
 return val;
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
 return lignes
 .filter(l => l.poids > 0 && l.ingredientId)
 .map(l => {
 const ing = ings.find(i => i.id === l.ingredientId);
 return { nom: ing?.nomEtiquette || ing?.nomRecette || "?", bio: ing?.bio || false, poids: toGrams(l.poids, l.unite) };
 })
 .sort((a, b) => b.poids - a.poids);
}

// Calcul % bio excluant l'eau (règle agriculture biologique)
function calcBioPctStrict(lignes, ings) {
 let total = 0, bio = 0;
 for (const l of lignes) {
 const ing = ings.find(i => i.id === l.ingredientId);
 if (!ing || !l.poids) continue;
 // Exclure l'eau du calcul
 if (ing.nomRecette.toLowerCase().includes("eau") || ing.id === "ing_eau") continue;
 const g = toGrams(l.poids, l.unite);
 total += g;
 if (ing.bio) bio += g;
 }
 if (total === 0) return 0;
 return (bio / total) * 100;
}

// Alerte règle 95% : si entre 95% et 99.9%, il faut déclasser
function getBioAlert(lignes, ings) {
 const pct = calcBioPctStrict(lignes, ings);
 if (pct >= 95 && pct < 100) {
 return {
 type: "warning",
 pct: pct.toFixed(1),
 message: `${pct.toFixed(1)}% bio (hors eau) — entre 95% et 99,9% : vous devez déclasser certains ingrédients bio en non-bio pour descendre à ≤ 94% ou monter à 100%.`
 };
 }
 if (pct === 100) return { type: "success", pct: "100", message: "100% bio (hors eau) — logo AB autorisé." };
 if (pct >= 95) return null;
 return { type: "info", pct: pct.toFixed(1), message: `${pct.toFixed(1)}% des ingrédients d'origine agricole sont issus de l'AB (hors eau).` };
}

// ── UI ────────────────────────────────────────────────────────────────────────
function Badge({ color, children }) {
 return <span style={{ background: color || C.lightMint, color: C.darkGreen, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontFamily: F.body, fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase" }}>{children}</span>;
}
function Card({ children, style, onClick }) {
 return <div onClick={onClick} style={{ background: C.white, borderRadius: 14, padding: "20px 24px", boxShadow: "0 2px 14px rgba(26,58,42,0.07)", border: `1px solid ${C.lightMint}`, ...style }}>{children}</div>;
}
function Btn({ onClick, children, variant = "primary", small, style, disabled }) {
 const base = { border: "none", borderRadius: 9, fontFamily: F.body, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", fontSize: small ? 12 : 14, padding: small ? "5px 12px" : "9px 20px", transition: "all 0.15s", opacity: disabled ? 0.5 : 1, ...style };
 const v = { primary: { background: C.green, color: C.white }, secondary: { background: C.lightMint, color: C.darkGreen }, ghost: { background: "transparent", color: C.green, border: `1.5px solid ${C.mint}` }, danger: { background: "#FFE5E5", color: C.error } };
 return <button onClick={onClick} disabled={disabled} style={{ ...base, ...v[variant] }}>{children}</button>;
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

// ── LIGNE INGRÉDIENT ──────────────────────────────────────────────────────────
const UNITES = ["g", "kg", "mL", "L", "cl", "pièce"].map(u => ({ value: u, label: u }));
const UNITES_LIBRE = ["g", "kg", "L"].map(u => ({ value: u, label: u }));

// Ligne pour section libre avec recherche par caractères + création à la volée
function LigneIngLibre({ ligne, onChange, onRemove, allIng, onCreateIng, bg, fournisseurs }) {
 const [mode, setMode] = useState("existant");
 const [search, setSearch] = useState("");
 const [showDropdown, setShowDropdown] = useState(false);
 const [nomNouvel, setNomNouvel] = useState("");
 const [bioNouvel, setBioNouvel] = useState(false);

 const ingActuel = allIng.find(i => i.id === ligne.ingredientId);
 const sortedIng = [...allIng].sort((a, b) => a.nomRecette.localeCompare(b.nomRecette, "fr"));
 const filtered = sortedIng.filter(i =>
 i.nomRecette.toLowerCase().includes(search.toLowerCase())
 );

 const handleSelect = (ing) => {
 onChange({ ...ligne, ingredientId: ing.id, fournisseurId: ing.fournisseurId || "" });
 setSearch("");
 setShowDropdown(false);
 };

 const handleCreate = () => {
 if (!nomNouvel.trim()) return;
 onCreateIng({ nom: nomNouvel.trim(), bio: bioNouvel }, (newId) => {
 onChange({ ...ligne, ingredientId: newId });
 setMode("existant");
 setNomNouvel("");
 setSearch("");
 });
 };

 const allFournisseurs = ingActuel
 ? [
 { id: ingActuel.fournisseurId, prixKg: ingActuel.prixKg, bio: ingActuel.bio },
 ...(ingActuel.fournisseursAlternatifs || [])
 ].filter(f => f.id)
 : [];
 const hasManyFournisseurs = allFournisseurs.length > 1;

 return (
 <div style={{ background: bg, borderRadius: 8, padding: "8px 10px", marginBottom: 6 }}>
 {mode === "existant" ? (
 <div>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 82px 52px 26px", gap: 6, alignItems: "flex-start" }}>
 <div style={{ position: "relative" }}>
 <div style={{ display: "flex", gap: 4 }}>
 <div style={{ flex: 1, position: "relative" }}>
 <input
 value={showDropdown ? search : (ingActuel ? (ingActuel.bio ? "Bio " : "") + ingActuel.nomRecette : "")}
 onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
 onFocus={() => { setSearch(""); setShowDropdown(true); }}
 onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
 placeholder="Rechercher un ingrédient…"
 style={{ width: "100%", padding: "6px 8px", borderRadius: 7, border: `1.5px solid ${showDropdown ? C.mint : C.lightMint}`, fontFamily: F.body, fontSize: 13, color: ingActuel ? C.darkGreen : C.muted, background: C.white, outline: "none", boxSizing: "border-box" }}
 />
 {showDropdown && (
 <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: C.white, borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", border: `1px solid ${C.lightMint}`, maxHeight: 200, overflowY: "auto", marginTop: 2 }}>
 {filtered.length === 0 && (
 <div style={{ padding: "8px 12px", fontFamily: F.body, fontSize: 12, color: C.muted, fontStyle: "italic" }}>Aucun résultat</div>
 )}
 {filtered.map(i => (
 <div key={i.id} onMouseDown={() => handleSelect(i)}
 style={{ padding: "7px 12px", fontFamily: F.body, fontSize: 13, color: C.darkGreen, cursor: "pointer", background: i.id === ligne.ingredientId ? C.lightMint : "transparent", borderBottom: `1px solid ${C.cream}` }}>
 {i.bio ? "Bio " : ""}{i.nomRecette}
 </div>
 ))}
 </div>
 )}
 </div>
 <button onClick={() => setMode("nouveau")} title="Créer un nouvel ingrédient"
 style={{ background: C.green, border: "none", borderRadius: 7, color: C.white, fontSize: 16, width: 28, height: 28, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
 </div>
 </div>
 <input type="number" value={ligne.poids || ""} onChange={e => onChange({ ...ligne, poids: parseFloat(e.target.value) || 0 })} placeholder="0"
 style={{ padding: "6px 8px", borderRadius: 7, border: `1.5px solid ${C.lightMint}`, fontFamily: F.mono, fontSize: 13, color: C.text, background: C.white, outline: "none", textAlign: "right", width: "100%", boxSizing: "border-box" }} />
 <select value={ligne.unite} onChange={e => onChange({ ...ligne, unite: e.target.value })}
 style={{ padding: "6px 4px", borderRadius: 7, border: `1.5px solid ${C.lightMint}`, fontFamily: F.body, fontSize: 12, background: C.white, outline: "none" }}>
 {UNITES_LIBRE.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
 </select>
 <button onClick={onRemove} style={{ background: "#FFE5E5", border: "none", borderRadius: 6, cursor: "pointer", color: C.error, fontSize: 13, padding: "4px 7px", fontWeight: 700 }}>Retirer</button>
 </div>
 {hasManyFournisseurs && (
 <div style={{ marginTop: 5, display: "flex", alignItems: "center", gap: 8 }}>
 <span style={{ fontSize: 11, color: C.muted, fontFamily: F.body, whiteSpace: "nowrap" }}>Fournisseur :</span>
 <select value={ligne.fournisseurId || ingActuel.fournisseurId}
 onChange={e => onChange({ ...ligne, fournisseurId: e.target.value })}
 style={{ flex: 1, padding: "4px 8px", borderRadius: 7, border: `1.5px solid ${C.lightMint}`, fontFamily: F.body, fontSize: 12, color: C.text, background: C.white, outline: "none" }}>
 {allFournisseurs.map(f => {
 const four = fournisseurs ? fournisseurs.find(x => x.id === f.id) : null;
 return (
 <option key={f.id} value={f.id}>
 {four ? four.nom : f.id} — {f.prixKg} €/kg {f.bio ? "Bio Bio" : "Non bio"}
 </option>
 );
 })}
 </select>
 </div>
 )}
 </div>
 ) : (
 <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
 <div style={{ fontSize: 11, fontWeight: 700, color: C.green, fontFamily: F.body, textTransform: "uppercase" }}>Nouvel ingrédient</div>
 <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
 <input value={nomNouvel} onChange={e => setNomNouvel(e.target.value)} placeholder="Nom (ex: Kumquat semi-confit)"
 style={{ flex: 1, padding: "6px 10px", borderRadius: 7, border: `1.5px solid ${C.mint}`, fontFamily: F.body, fontSize: 13, color: C.text, background: C.white, outline: "none" }} />
 <div onClick={() => setBioNouvel(!bioNouvel)} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", whiteSpace: "nowrap" }}>
 <div style={{ width: 32, height: 18, borderRadius: 9, background: bioNouvel ? C.green : C.lightMint, position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
 <div style={{ width: 12, height: 12, borderRadius: "50%", background: C.white, position: "absolute", top: 3, left: bioNouvel ? 17 : 3, transition: "left 0.2s" }} />
 </div>
 <span style={{ fontSize: 12, fontFamily: F.body, color: C.muted }}>Bio</span>
 </div>
 </div>
 <div style={{ display: "flex", gap: 6 }}>
 <button onClick={handleCreate} disabled={!nomNouvel.trim()}
 style={{ background: C.green, border: "none", borderRadius: 7, color: C.white, fontFamily: F.body, fontSize: 12, fontWeight: 700, padding: "6px 14px", cursor: nomNouvel.trim() ? "pointer" : "not-allowed", opacity: nomNouvel.trim() ? 1 : 0.5 }}>
 Créer & ajouter
 </button>
 <button onClick={() => { setMode("existant"); setNomNouvel(""); }}
 style={{ background: "none", border: `1.5px solid ${C.lightMint}`, borderRadius: 7, color: C.muted, fontFamily: F.body, fontSize: 12, padding: "6px 12px", cursor: "pointer" }}>
 Annuler
 </button>
 </div>
 </div>
 )}
 </div>
 );
}

// Ligne fixe (poudres/liquides standards)
function LigneIng({ ligne, onChange, onRemove, allIng, fixe, bg }) {
 const ing = allIng.find(i => i.id === ligne.ingredientId);
 const sortedIng = [...allIng].sort((a, b) => a.nomRecette.localeCompare(b.nomRecette, "fr"));
 return (
 <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 58px 26px", gap: 6, alignItems: "center", background: bg, borderRadius: 8, padding: "7px 10px", marginBottom: 4 }}>
 {fixe
 ? <div style={{ fontFamily: F.body, fontSize: 13, fontWeight: 600, color: C.darkGreen }}>{ing?.bio ? "Bio " : ""}{ing?.nomRecette || "?"}</div>
 : <select value={ligne.ingredientId} onChange={e => onChange({ ...ligne, ingredientId: e.target.value })}
 style={{ padding: "6px 8px", borderRadius: 7, border: `1.5px solid ${C.lightMint}`, fontFamily: F.body, fontSize: 13, color: C.text, background: C.white, outline: "none" }}>
 <option value="">— Choisir —</option>
 {sortedIng.map(i => <option key={i.id} value={i.id}>{i.bio ? "Bio " : ""}{i.nomRecette}</option>)}
 </select>}
 <input type="number" value={ligne.poids || ""} onChange={e => onChange({ ...ligne, poids: parseFloat(e.target.value) || 0 })} placeholder="0"
 style={{ padding: "6px 8px", borderRadius: 7, border: `1.5px solid ${C.lightMint}`, fontFamily: F.mono, fontSize: 13, color: C.text, background: C.white, outline: "none", textAlign: "right", width: "100%", boxSizing: "border-box" }} />
 <select value={ligne.unite} onChange={e => onChange({ ...ligne, unite: e.target.value })}
 style={{ padding: "6px 4px", borderRadius: 7, border: `1.5px solid ${C.lightMint}`, fontFamily: F.body, fontSize: 12, background: C.white, outline: "none" }}>
 {UNITES.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
 </select>
 <button onClick={onRemove} style={{ background: "#FFE5E5", border: "none", borderRadius: 6, cursor: "pointer", color: C.error, fontSize: 13, padding: "4px 7px", fontWeight: 700 }}>Retirer</button>
 </div>
 );
}

function Section({ title, icon, bg, children, onAdd }) {
 return (
 <div style={{ marginBottom: 16 }}>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
 <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 12, color: C.darkGreen, textTransform: "uppercase", letterSpacing: 0.6 }}>{icon} {title}</div>
 {onAdd && <button  onClick={onAdd} style={{ background: "transparent", border: `1.5px solid ${C.mint}`, borderRadius: 7, padding: "6px 12px", fontFamily: F.body, fontSize: 12, fontWeight: 600, color: C.green, cursor: "pointer" }}>+ Ajouter</button>}
 </div>
 <div style={{ background: bg, borderRadius: 10, padding: "8px 8px 4px" }}>{children}</div>
 </div>
 );
}

// ── FORMULAIRE RECETTE ────────────────────────────────────────────────────────
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

 // Créer un nouvel ingrédient à la volée depuis le formulaire recette
 const handleCreateIng = (setter) => ({ nom, bio }, callback) => {
 const newIng = {
 id: genId(), nomRecette: nom, nomEtiquette: nom.toLowerCase(),
 nomsFournisseur: [], bio, prixKg: 0, fournisseurId: "",
 stockActuel: 0, unite: "kg", allergene: "", categorie: "autre",
 };
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

 {/* En-tête colonnes */}
 <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 58px 26px", gap: 6, padding: "2px 10px", marginBottom: 2 }}>
 <span style={{ fontSize: 10, color: C.muted, fontFamily: F.body, textTransform: "uppercase" }}>Ingrédient</span>
 <span style={{ fontSize: 10, color: C.muted, fontFamily: F.body, textAlign: "right", textTransform: "uppercase" }}>Quantité</span>
 <span style={{ fontSize: 10, color: C.muted, fontFamily: F.body, textTransform: "uppercase" }}>Unité</span>
 <span />
 </div>

 <Section title="Poudres" icon="" bg={C.section1} onAdd={() => setPoudres(p => [...p, makeLigne("", "g")])}>
 {poudres.map(l => <LigneIng key={l.id} ligne={l} bg={C.section1} fixe={POUDRES_IDS.includes(l.ingredientId)} allIng={allIng} onChange={v => upd(setPoudres, l.id, v)} onRemove={() => rm(setPoudres, l.id)} />)}
 </Section>

 <Section title="Liquides" icon="" bg={C.section2} onAdd={() => setLiquides(p => [...p, makeLigne("", "L")])}>
 {liquides.map(l => <LigneIng key={l.id} ligne={l} bg={C.section2} fixe={LIQUIDES_IDS.includes(l.ingredientId)} allIng={allIng} onChange={v => upd(setLiquides, l.id, v)} onRemove={() => rm(setLiquides, l.id)} />)}
 </Section>

 <Section title="Ingrédient(s) spécifique(s)" icon="" bg={C.section3} onAdd={() => setIngs(p => [...p, makeLigne("", "g")])}>
 {ingredients.length === 0 && <div style={{ fontFamily: F.body, fontSize: 12, color: C.muted, padding: "4px 4px 6px", fontStyle: "italic" }}>Ajoutez les ingrédients propres à ce parfum…</div>}
 {ingredients.map(l => <LigneIngLibre key={l.id} ligne={l} bg={C.section3} allIng={allIng} fournisseurs={fournisseurs} onChange={v => upd(setIngs, l.id, v)} onRemove={() => rm(setIngs, l.id)} onCreateIng={handleCreateIng(setIngs)} />)}
 </Section>

 <Section title="Topping(s)" icon="✨" bg={C.section4} onAdd={() => setTops(p => [...p, makeLigne("", "g")])}>
 {toppings.length === 0 && <div style={{ fontFamily: F.body, fontSize: 12, color: C.muted, padding: "4px 4px 6px", fontStyle: "italic" }}>Ajoutez les toppings éventuels…</div>}
 {toppings.map(l => <LigneIngLibre key={l.id} ligne={l} bg={C.section4} allIng={allIng} fournisseurs={fournisseurs} onChange={v => upd(setTops, l.id, v)} onRemove={() => rm(setTops, l.id)} onCreateIng={handleCreateIng(setTops)} />)}
 </Section>

 <Section title="Notes de fabrication" icon="" bg={C.section5}>
 <Textarea value={notes} onChange={setNotes} placeholder="Températures, process, temps d'infusion, conseils topping, équilibrage…" />
 </Section>

 {bioAlert && (
 <div style={{ borderRadius: 10, padding: "10px 14px", marginBottom: 10, fontFamily: F.body, fontSize: 13,
 background: bioAlert.type === "warning" ? "#FFF3CD" : bioAlert.type === "success" ? "#D4EDDA" : C.lightCream,
 border: `1.5px solid ${bioAlert.type === "warning" ? C.gold : bioAlert.type === "success" ? C.green : C.lightMint}`,
 color: bioAlert.type === "warning" ? "#856404" : C.darkGreen }}>
 {bioAlert.message}
 </div>
 )}
 <div style={{ background: C.darkGreen, borderRadius: 10, padding: "11px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
 <span style={{ fontFamily: F.body, fontSize: 13, color: C.lightMint }}>Total : <strong style={{ color: C.white }}>{totalG.toFixed(0)} g</strong></span>
 <span style={{ fontFamily: F.body, fontSize: 13, color: C.lightMint }}>
 Bio (hors eau) : <strong style={{ color: bioPctStrict >= 95 && bioPctStrict < 100 ? "#FFD54F" : bioPctStrict === 100 ? "#A5D6A7" : C.lightGold }}>{bioPctStrict.toFixed(1)}%</strong>
 &nbsp;· Coût : <strong style={{ color: C.white }}>{cout} €</strong>
 </span>
 </div>

 <div style={{ display: "flex", gap: 10 }}>
 <button onClick={() => { if (nom) onSave({ id: initial?.id || genId(), nom, categorie, ephemere, notes, poudres, liquides, ingredients, toppings }); }} disabled={!nom} style={{ background: nom ? C.green : "#aaa", border: "none", borderRadius: 9, padding: "9px 20px", fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.white, cursor: nom ? "pointer" : "not-allowed", opacity: nom ? 1 : 0.5 }}>
 {initial ? "Enregistrer" : "Créer la recette"}
 </button>
 <button  onClick={onCancel} style={{ background: "transparent", border: `1.5px solid ${C.mint}`, borderRadius: 7, padding: "6px 12px", fontFamily: F.body, fontSize: 12, fontWeight: 600, color: C.green, cursor: "pointer" }}>Annuler</button>
 </div>
 </Card>
 );
}

// ── DÉTAIL RECETTE ────────────────────────────────────────────────────────────
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
 { label: "Poudres", lignes: recette.poudres, bg: C.section1 },
 { label: "Liquides", lignes: recette.liquides, bg: C.section2 },
 { label: "Ingrédients spécifiques", lignes: recette.ingredients, bg: C.section3 },
 { label: "Toppings", lignes: recette.toppings, bg: C.section4 },
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
 <Badge color={bioPct === 100 ? "#D4EDDA" : "#FFF3CD"}>{bioPct === 100 ? "Bio 100% Bio" : `Bio ${bioPct}% Bio`}</Badge>
 <Badge color="#EEE">Coût : {cout} €</Badge>
 </div>
 </div>
 <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.muted, padding: 0 }}>×</button>
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
 {ing?.bio && <span style={{ fontSize: 12 }}>Bio</span>}
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
 <div style={{ background: C.section5, borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, fontFamily: F.body, textTransform: "uppercase", marginBottom: 5 }}>Notes de fabrication</div>
 <div style={{ fontFamily: F.body, fontSize: 13, color: C.text, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{recette.notes}</div>
 </div>
 )}

 {bioAlert && bioAlert.type === "warning" && (
 <div style={{ borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontFamily: F.body, fontSize: 12, background: "#FFF3CD", border: `1.5px solid ${C.gold}`, color: "#856404" }}>
 {bioAlert.message}
 </div>
 )}
 <div style={{ background: C.cream, borderRadius: 10, padding: 12, border: `1.5px dashed ${C.mint}`, marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, fontFamily: F.body, textTransform: "uppercase", marginBottom: 5 }}>Aperçu étiquette</div>
 <div style={{ fontFamily: F.body, fontSize: 11, fontWeight: 700, color: C.darkGreen }}>{recette.nom}</div>
 <div style={{ fontFamily: F.body, fontSize: 10, color: C.text, lineHeight: 1.5, marginTop: 3, fontStyle: "italic" }}>{listeText}</div>
 <div style={{ fontFamily: F.body, fontSize: 9, color: C.muted, marginTop: 3, fontWeight: 700 }}>{mentionBio}</div>
 {allergenes.length > 0 && <div style={{ fontFamily: F.body, fontSize: 9, color: C.error, marginTop: 2 }}>Contient : {allergenes.join(", ")}</div>}
 </div>

 <div style={{ display: "flex", gap: 10 }}>
 <button onClick={onEdit} style={{ background: C.lightMint, border: "none", borderRadius: 8, padding: "9px 18px", fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.darkGreen, cursor: "pointer" }}>Modifier</button>
 <button onClick={onClose}  style={{ background: "transparent", border: `1.5px solid ${C.mint}`, borderRadius: 7, padding: "6px 12px", fontFamily: F.body, fontSize: 12, fontWeight: 600, color: C.green, cursor: "pointer" }}>Fermer</button>
 </div>
 </div>
 </div>
 );
}

// ── ONGLET RECETTES ───────────────────────────────────────────────────────────
function RecettesTab({ data, setData }) {
 const [showForm, setShowForm] = useState(false);
 const [editing, setEditing] = useState(null);
 const [detail, setDetail] = useState(null);
 const [search, setSearch] = useState("");
 const [filterCat, setFilterCat] = useState("");

 const save = (r) => {
 if (editing) { setData(d => ({ ...d, recettes: d.recettes.map(x => x.id === r.id ? r : x) })); setEditing(null); }
 else { setData(d => ({ ...d, recettes: [...d.recettes, r] })); setShowForm(false); }
 };
 const del = (id) => { if (window.confirm("Supprimer cette recette ?")) setData(d => ({ ...d, recettes: d.recettes.filter(r => r.id !== id) })); };
 const cats = [...new Set(data.recettes.map(r => r.categorie))];
 const filtered = data.recettes.filter(r => r.nom.toLowerCase().includes(search.toLowerCase()) && (!filterCat || r.categorie === filterCat));

 return (
 <div>
 {detail && <RecetteDetail recette={detail} data={data} onEdit={() => { setEditing(detail); setDetail(null); }} onClose={() => setDetail(null)} />}
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
 <h2 style={{ fontFamily: F.display, color: C.darkGreen, margin: 0 }}>Recettes <span style={{ fontSize: 13, fontWeight: 400, color: C.muted }}>({data.recettes.length})</span></h2>
 <button onClick={() => { setShowForm(true); setEditing(null); }} style={{ background: C.green, border: "none", borderRadius: 9, padding: "9px 20px", fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.white, cursor: "pointer" }}>+ Nouvelle recette</button>
 </div>
 {showForm && !editing && <RecetteForm onSave={save} onCancel={() => setShowForm(false)} allIng={data.ingredients} setData={setData} fournisseurs={data.fournisseurs} />}
 {editing && <RecetteForm initial={editing} onSave={save} onCancel={() => setEditing(null)} allIng={data.ingredients} setData={setData} fournisseurs={data.fournisseurs} />}
 <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
 <Input placeholder="Rechercher..." value={search} onChange={setSearch} style={{ flex: 1, marginBottom: 0 }} />
 <Select value={filterCat} onChange={setFilterCat} options={cats.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))} placeholder="Toutes catégories" style={{ flex: 1, marginBottom: 0 }} />
 </div>
 {filtered.length === 0 && !showForm && <Card style={{ textAlign: "center", color: C.muted, fontFamily: F.body, padding: 32 }}>{data.recettes.length === 0 ? "Aucune recette encore. Commencez votre catalogue !" : "Aucun résultat."}</Card>}
 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12 }}>
 {filtered.map(r => {
 const allL = [...r.poudres, ...r.liquides, ...r.ingredients, ...r.toppings];
 const bioPct = calcBioPct(allL, data.ingredients);
 const cout = calcCout(allL, data.ingredients);
 return (
 <Card key={r.id} style={{ cursor: "pointer", position: "relative" }} onClick={() => setDetail(r)}>
 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
 <Badge color={C.lightMint}>{r.categorie}</Badge>
 {r.ephemere && <Badge color={C.lightGold}></Badge>}
 </div>
 <div style={{ fontFamily: F.display, fontSize: 16, fontWeight: 700, color: C.darkGreen, marginBottom: 8 }}>{r.nom}</div>
 <div style={{ display: "flex", justifyContent: "space-between" }}>
 <span style={{ fontSize: 12, color: bioPct === 100 ? C.green : C.gold, fontFamily: F.body, fontWeight: 700 }}>Bio {bioPct === 100 ? "100% Bio" : `${bioPct}% Bio`}</span>
 <span style={{ fontSize: 12, color: C.muted, fontFamily: F.body }}>{cout} €</span>
 </div>
 <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
 <button onClick={() => setEditing(r)} style={{ background: C.lightMint, border: "none", borderRadius: 7, padding: "6px 12px", fontFamily: F.body, fontSize: 12, fontWeight: 600, color: C.darkGreen, cursor: "pointer" }}>Modifier</button>
 <button onClick={() => { if (window.confirm("Supprimer cette recette ?")) del(r.id); }} style={{ background: "#FFE5E5", border: "none", borderRadius: 7, padding: "5px 10px", fontFamily: F.body, fontSize: 11, fontWeight: 600, color: C.error, cursor: "pointer" }}>Supprimer</button>
 </div>
 </Card>
 );
 })}
 </div>
 </div>
 );
}

// ── ONGLET INGRÉDIENTS ────────────────────────────────────────────────────────
function IngredientForm({ onSave, onCancel, initial, fournisseurs }) {
 const [nomRecette, setNomR] = useState(initial?.nomRecette || "");
 const [nomEtiquette, setNomE] = useState(initial?.nomEtiquette || "");
 const [nomsFournisseur, setNomF] = useState((initial?.nomsFournisseur || []).join(", "));
 const [bio, setBio] = useState(initial?.bio ?? false);
 const [prixKg, setPrix] = useState(initial?.prixKg || "");
 const [fournisseurId, setFour] = useState(initial?.fournisseurId || "");
 const [stockActuel, setStock] = useState(initial?.stockActuel || "");
 const [unite, setUnite] = useState(initial?.unite || "kg");
 const [allergene, setAll] = useState(initial?.allergene || "");
 const [categorie, setCat] = useState(initial?.categorie || "autre");

 const [fournisseursAlternatifs, setFourAlts] = useState(initial?.fournisseursAlternatifs || []);
 const allerg = ["", "Lait", "Gluten", "Fruits à coque", "Soja", "Œufs", "Arachides", "Sésame", "Céleri", "Moutarde", "Poisson", "Crustacés", "Mollusques", "Lupin", "Sulfites"].map(a => ({ value: a, label: a || "Aucun" }));
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
 <Input label="Nom sur l'étiquette (légal, fixé par vous)" value={nomEtiquette} onChange={setNomE} placeholder="ex: sucre de canne non raffiné" />
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

 <div style={{ background: C.section2, borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
 <Label>Fournisseurs alternatifs</Label>
 <button onClick={addFourAlt} style={{ background: C.green, border: "none", borderRadius: 7, color: C.white, fontSize: 12, fontWeight: 700, padding: "4px 10px", cursor: "pointer", fontFamily: F.body }}>+ Ajouter</button>
 </div>
 {fournisseursAlternatifs.length === 0
 ? <div style={{ fontFamily: F.body, fontSize: 12, color: C.muted, fontStyle: "italic" }}>Aucun fournisseur alternatif.</div>
 : fournisseursAlternatifs.map((fa, i) => (
 <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 90px auto auto", gap: 6, alignItems: "center", marginBottom: 6 }}>
 <select value={fa.fournisseurId} onChange={e => updFourAlt(i, { ...fa, fournisseurId: e.target.value })}
 style={{ padding: "6px 8px", borderRadius: 7, border: `1.5px solid ${C.lightMint}`, fontFamily: F.body, fontSize: 12, background: C.white, outline: "none" }}>
 <option value="">— Fournisseur —</option>
 {fournisseurs.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
 </select>
 <input type="number" value={fa.prixKg || ""} onChange={e => updFourAlt(i, { ...fa, prixKg: parseFloat(e.target.value) || 0 })}
 placeholder="€/kg" style={{ padding: "6px 8px", borderRadius: 7, border: `1.5px solid ${C.lightMint}`, fontFamily: F.mono, fontSize: 12, background: C.white, outline: "none", width: "100%", boxSizing: "border-box" }} />
 <div onClick={() => updFourAlt(i, { ...fa, bio: !fa.bio })} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", userSelect: "none" }}>
 <div style={{ width: 30, height: 17, borderRadius: 9, background: fa.bio ? C.green : C.lightMint, position: "relative", flexShrink: 0 }}>
 <div style={{ width: 11, height: 11, borderRadius: "50%", background: C.white, position: "absolute", top: 3, left: fa.bio ? 16 : 3, transition: "left 0.2s" }} />
 </div>
 <span style={{ fontSize: 11, color: C.muted, fontFamily: F.body, whiteSpace: "nowrap" }}>Bio Bio</span>
 </div>
 <button onClick={() => rmFourAlt(i)} style={{ background: "#FFE5E5", border: "none", borderRadius: 6, color: C.error, fontSize: 12, padding: "5px 8px", cursor: "pointer", fontWeight: 700 }}>Retirer</button>
 </div>
 ))
 }
 </div>

 <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
 <button onClick={() => { if (nomRecette) onSave({ id: initial?.id || genId(), nomRecette, nomEtiquette: nomEtiquette || nomRecette.toLowerCase(), nomsFournisseur: nomsFournisseur.split(",").map(s => s.trim()).filter(Boolean), bio, prixKg: parseFloat(prixKg) || 0, fournisseurId, fournisseursAlternatifs, stockActuel: parseFloat(stockActuel) || 0, unite, allergene, categorie }); }} disabled={!nomRecette} style={{ background: nomRecette ? C.green : "#aaa", border: "none", borderRadius: 9, padding: "9px 20px", fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.white, cursor: nomRecette ? "pointer" : "not-allowed", opacity: nomRecette ? 1 : 0.5 }}>
 {initial ? "Enregistrer" : "Ajouter"}
 </button>
 <button  onClick={onCancel} style={{ background: "transparent", border: `1.5px solid ${C.mint}`, borderRadius: 7, padding: "6px 12px", fontFamily: F.body, fontSize: 12, fontWeight: 600, color: C.green, cursor: "pointer" }}>Annuler</button>
 </div>
 </Card>
 );
}

function IngredientsTab({ data, setData }) {
 const [showForm, setShowForm] = useState(false);
 const [editing, setEditing] = useState(null);
 const [search, setSearch] = useState("");
 const save = (ing) => {
 if (editing) { setData(d => ({ ...d, ingredients: d.ingredients.map(x => x.id === ing.id ? ing : x) })); setEditing(null); }
 else { setData(d => ({ ...d, ingredients: [...d.ingredients, ing] })); setShowForm(false); }
 };
 const del = (id) => {
 if (window.confirm("Supprimer cet ingrédient ?")) {
 setData(d => ({ ...d, ingredients: d.ingredients.filter(i => i.id !== id) }));
 }
 };
 const filtered = data.ingredients.filter(i => i.nomRecette.toLowerCase().includes(search.toLowerCase()));
 return (
 <div>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
 <h2 style={{ fontFamily: F.display, color: C.darkGreen, margin: 0 }}>Ingrédients</h2>
 <button onClick={() => { setShowForm(true); setEditing(null); }} style={{ background: C.green, border: "none", borderRadius: 9, padding: "9px 20px", fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.white, cursor: "pointer" }}>+ Ajouter</button>
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
 {ing.bio && <Badge color={C.lightMint}>Bio Bio</Badge>}
 {ing.allergene && <Badge color="#FFE0D0">{ing.allergene}</Badge>}
 <Badge color="#EEE">{ing.categorie}</Badge>
 </div>
 <div style={{ fontSize: 11, color: C.muted, fontFamily: F.body }}>
 <em>{ing.nomEtiquette}</em>
 {ing.nomsFournisseur?.length > 0 && <span style={{ marginLeft: 10 }}>{ing.nomsFournisseur.join(" / ")}</span>}
 </div>
 <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
 {ing.prixKg > 0 && <span style={{ fontSize: 11, color: C.muted, fontFamily: F.body }}>{ing.prixKg.toFixed(2)} €/kg</span>}
 {f && <span style={{ fontSize: 11, color: C.muted, fontFamily: F.body }}>{f.nom}</span>}
 </div>
 </div>
 <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
 <button onClick={(e) => { e.stopPropagation(); setEditing(ing); }}
 style={{ background: C.lightMint, border: "none", borderRadius: 8, padding: "6px 12px", fontFamily: F.body, fontSize: 12, fontWeight: 600, color: C.darkGreen, cursor: "pointer" }}>
 Modifier
 </button>
 <button onClick={(e) => { e.stopPropagation(); if(window.confirm("Supprimer " + ing.nomRecette + " ?")) { del(ing.id); } }}
 style={{ background: "#FFE5E5", border: "none", borderRadius: 8, padding: "6px 12px", fontFamily: F.body, fontSize: 12, fontWeight: 600, color: C.error, cursor: "pointer" }}>
 Supprimer
 </button>
 </div>
 </div>
 </Card>
 );
 })}
 </div>
 </div>
 );
}

// ── ONGLET FOURNISSEURS ───────────────────────────────────────────────────────
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
 <button onClick={() => { if (nom) onSave({ id: initial?.id || genId(), nom, jourCommande, jourLivraison, contact }); }} disabled={!nom} style={{ background: nom ? C.green : "#aaa", border: "none", borderRadius: 9, padding: "9px 20px", fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.white, cursor: nom ? "pointer" : "not-allowed", opacity: nom ? 1 : 0.5 }}>{initial ? "Enregistrer" : "Ajouter"}</button>
 <button  onClick={onCancel} style={{ background: "transparent", border: `1.5px solid ${C.mint}`, borderRadius: 7, padding: "6px 12px", fontFamily: F.body, fontSize: 12, fontWeight: 600, color: C.green, cursor: "pointer" }}>Annuler</button>
 </div>
 </Card>
 );
}

function FournisseursTab({ data, setData }) {
 const [showForm, setShowForm] = useState(false);
 const [editing, setEditing] = useState(null);
 const save = (f) => {
 if (editing) { setData(d => ({ ...d, fournisseurs: d.fournisseurs.map(x => x.id === f.id ? f : x) })); setEditing(null); }
 else { setData(d => ({ ...d, fournisseurs: [...d.fournisseurs, f] })); setShowForm(false); }
 };
 const del = (id) => { if (window.confirm("Supprimer ?")) setData(d => ({ ...d, fournisseurs: d.fournisseurs.filter(f => f.id !== id) })); };
 return (
 <div>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
 <h2 style={{ fontFamily: F.display, color: C.darkGreen, margin: 0 }}>Fournisseurs</h2>
 <button onClick={() => { setShowForm(true); setEditing(null); }} style={{ background: C.green, border: "none", borderRadius: 9, padding: "9px 20px", fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.white, cursor: "pointer" }}>+ Ajouter</button>
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
 <button onClick={() => { if (window.confirm("Supprimer " + f.nom + " ?")) del(f.id); }} style={{ background: "#FFE5E5", border: "none", borderRadius: 7, padding: "6px 12px", fontFamily: F.body, fontSize: 12, fontWeight: 600, color: C.error, cursor: "pointer" }}>Supprimer</button>
 </div>
 </Card>
 ))}
 </div>
 </div>
 );
}


// ── EXPORT / IMPORT CSV ───────────────────────────────────────────────────────
function exportCSV(data) {
  // Export recettes
  const recettesRows = data.recettes.map(r => {
    const allL = [...r.poudres, ...r.liquides, ...r.ingredients, ...r.toppings];
    const ingredientsList = allL.filter(l => l.poids > 0 && l.ingredientId).map(l => {
      const ing = data.ingredients.find(i => i.id === l.ingredientId);
      return (ing?.nomRecette || l.ingredientId) + ":" + l.poids + l.unite;
    }).join("|");
    return [r.id, r.nom, r.categorie, r.ephemere ? "oui" : "non", ingredientsList, r.notes || ""].map(v => '"' + String(v).replace(/"/g, '""') + '"').join(",");
  });
  downloadCSV("recettes.csv", ["id","nom","categorie","ephemere","ingredients","notes"].join(",") + "\n" + recettesRows.join("\n"));

  // Export ingredients
  const ingRows = data.ingredients.map(i => {
    const f = data.fournisseurs.find(f => f.id === i.fournisseurId);
    return [i.id, i.nomRecette, i.nomEtiquette, (i.nomsFournisseur||[]).join("|"), i.bio?"oui":"non", i.prixKg, i.unite, i.allergene||"", i.categorie, f?.nom||""].map(v => '"' + String(v||"").replace(/"/g, '""') + '"').join(",");
  });
  downloadCSV("ingredients.csv", ["id","nom_recette","nom_etiquette","alias_fournisseurs","bio","prix_kg","unite","allergene","categorie","fournisseur"].join(",") + "\n" + ingRows.join("\n"));

  // Export fournisseurs
  const fourRows = data.fournisseurs.map(f => [f.id, f.nom, f.contact||"", f.jourCommande, f.jourLivraison].map(v => '"' + String(v||"").replace(/"/g, '""') + '"').join(","));
  downloadCSV("fournisseurs.csv", ["id","nom","contact","jour_commande","jour_livraison"].join(",") + "\n" + fourRows.join("\n"));
}

function downloadCSV(filename, content) {
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function ImportCSVModal({ onClose, onImport }) {
  const [file, setFile] = useState(null);
  const [type, setType] = useState("ingredients");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const lines = text.split("\n").slice(0, 4);
      setPreview(lines.join("\n"));
    };
    reader.readAsText(f, "UTF-8");
  };

  const handleImport = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target.result.replace(/^\uFEFF/, "");
        const lines = text.split("\n").filter(l => l.trim());
        const headers = parseCSVLine(lines[0]);
        const rows = lines.slice(1).map(l => {
          const vals = parseCSVLine(l);
          const obj = {};
          headers.forEach((h, i) => obj[h.trim()] = (vals[i]||"").trim());
          return obj;
        }).filter(r => r.id || r.nom || r.nom_recette);
        onImport(type, rows);
        onClose();
      } catch(e) {
        setError("Erreur de lecture du fichier : " + e.message);
      }
    };
    reader.readAsText(file, "UTF-8");
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,58,42,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: C.white, borderRadius: 16, padding: 24, maxWidth: 480, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <h3 style={{ fontFamily: F.display, color: C.darkGreen, marginTop: 0 }}>Importer un fichier CSV</h3>
        <Select label="Type de donnees" value={type} onChange={setType} options={[
          { value: "ingredients", label: "Ingredients" },
          { value: "fournisseurs", label: "Fournisseurs" },
        ]} />
        <div style={{ marginBottom: 12 }}>
          <Label>Fichier CSV (depuis Excel)</Label>
          <input type="file" accept=".csv" onChange={handleFile}
            style={{ fontFamily: F.body, fontSize: 13, color: C.text }} />
        </div>
        {preview && (
          <div style={{ background: C.cream, borderRadius: 8, padding: 10, marginBottom: 12, fontFamily: F.mono, fontSize: 11, color: C.muted, whiteSpace: "pre", overflow: "auto", maxHeight: 100 }}>
            {preview}
          </div>
        )}
        {error && <div style={{ color: C.error, fontFamily: F.body, fontSize: 13, marginBottom: 10 }}>{error}</div>}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleImport} disabled={!file}
            style={{ background: C.green, border: "none", borderRadius: 9, padding: "9px 20px", fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.white, cursor: file ? "pointer" : "not-allowed", opacity: file ? 1 : 0.5 }}>
            Importer
          </button>
          <button onClick={onClose} style={{ background: "transparent", border: "1.5px solid " + C.mint, borderRadius: 9, padding: "9px 20px", fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.green, cursor: "pointer" }}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

function parseCSVLine(line) {
  const result = []; let current = ""; let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      if (inQuotes && line[i+1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (line[i] === "," && !inQuotes) {
      result.push(current); current = "";
    } else { current += line[i]; }
  }
  result.push(current);
  return result;
}

// ── TABLEAU DE BORD ───────────────────────────────────────────────────────────
function DashboardTab({ data, setData, onExport, onImport }) {
  const [showImport, setShowImport] = useState(false);

  const handleImport = (type, rows) => {
    if (type === "fournisseurs") {
      const newFours = rows.map(r => ({
        id: r.id || genId(), nom: r.nom || "", contact: r.contact || "",
        jourCommande: r.jour_commande || "lundi", jourLivraison: r.jour_livraison || "mardi",
      })).filter(f => f.nom);
      setData(d => ({ ...d, fournisseurs: [...d.fournisseurs.filter(f => !newFours.find(n => n.id === f.id)), ...newFours] }));
    } else if (type === "ingredients") {
      const newIngs = rows.map(r => ({
        id: r.id || genId(), nomRecette: r.nom_recette || r.nom || "",
        nomEtiquette: r.nom_etiquette || r.nom_recette || "", nomsFournisseur: (r.alias_fournisseurs||"").split("|").filter(Boolean),
        bio: r.bio === "oui", prixKg: parseFloat(r.prix_kg) || 0, unite: r.unite || "kg",
        allergene: r.allergene || "", categorie: r.categorie || "autre",
        fournisseurId: data.fournisseurs.find(f => f.nom === r.fournisseur)?.id || "",
        stockActuel: 0, fournisseursAlternatifs: [],
      })).filter(i => i.nomRecette);
      setData(d => ({ ...d, ingredients: [...d.ingredients.filter(i => !newIngs.find(n => n.id === i.id)), ...newIngs] }));
    }
  };
 const lignesAll = data.recettes.map(r => [...r.poudres, ...r.liquides, ...r.ingredients, ...r.toppings]);
 const bio100 = data.recettes.filter((r, i) => calcBioPct(lignesAll[i], data.ingredients) === 100).length;
 const stats = [
 { label: "Recettes", value: data.recettes.length, icon: "", color: C.green },
 { label: "Ingrédients", value: data.ingredients.length, icon: "", color: C.mint },
 { label: "100% Bio", value: bio100, icon: "Bio", color: "#2E7D32" },
 { label: "Éphémères", value: data.recettes.filter(r => r.ephemere).length, icon: "", color: C.gold },
 { label: "Fournisseurs", value: data.fournisseurs.length, icon: "", color: C.muted },
 ];
 return (
 <div>
 <h2 style={{ fontFamily: F.display, color: C.darkGreen, marginBottom: 4 }}>Tableau de bord</h2>
 <p style={{ fontFamily: F.body, color: C.muted, marginBottom: 22, fontSize: 13 }}>La Tropicale Glacier — Recettes & Ingrédients</p>
 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10, marginBottom: 24 }}>
 {stats.map(s => (
 <Card key={s.label} style={{ textAlign: "center", padding: "16px 10px" }}>
 <div style={{ fontSize: 24 }}>{s.icon}</div>
 <div style={{ fontFamily: F.display, fontSize: 28, fontWeight: 700, color: s.color, lineHeight: 1.1 }}>{s.value}</div>
 <div style={{ fontFamily: F.body, fontSize: 11, color: C.muted, marginTop: 3 }}>{s.label}</div>
 </Card>
 ))}
 </div>
 <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
  <button onClick={() => exportCSV(data)} style={{ background: C.green, border: "none", borderRadius: 9, padding: "9px 18px", fontFamily: F.body, fontSize: 13, fontWeight: 600, color: C.white, cursor: "pointer" }}>Exporter CSV</button>
  <button onClick={() => setShowImport(true)} style={{ background: "transparent", border: `1.5px solid ${C.mint}`, borderRadius: 9, padding: "9px 18px", fontFamily: F.body, fontSize: 13, fontWeight: 600, color: C.green, cursor: "pointer" }}>Importer CSV</button>
 </div>
 {showImport && <ImportCSVModal onClose={() => setShowImport(false)} onImport={handleImport} />}
 {data.recettes.length > 0
 ? <>
 <h3 style={{ fontFamily: F.display, color: C.darkGreen, marginBottom: 10 }}>Dernières recettes</h3>
 <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
 {data.recettes.slice(-5).reverse().map((r, i) => {
 const l = [...r.poudres, ...r.liquides, ...r.ingredients, ...r.toppings];
 const bp = calcBioPct(l, data.ingredients);
 return (
 <Card key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 16px" }}>
 <span style={{ fontFamily: F.body, fontWeight: 700, color: C.darkGreen }}>{r.nom}</span>
 <Badge color={bp === 100 ? "#D4EDDA" : "#FFF3CD"}>{bp === 100 ? "Bio 100%" : `Bio ${bp}%`}</Badge>
 </Card>
 );
 })}
 </div>
 </>
 : <Card style={{ background: C.lightCream, textAlign: "center", padding: 28 }}>
 <div style={{ fontSize: 32, marginBottom: 8 }}></div>
 <div style={{ fontFamily: F.display, fontSize: 17, color: C.darkGreen, marginBottom: 6 }}>Bienvenue !</div>
 <div style={{ fontFamily: F.body, fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
 Vos fournisseurs et ingrédients de base sont prêts.<br />
 Créez votre première <strong>Recette</strong> pour commencer !
 </div>
 </Card>
 }
 </div>
 );
}

// ── APP SHELL ─────────────────────────────────────────────────────────────────
const TABS = [
 { id: "dashboard", label: "Accueil" },
 { id: "recettes", label: "Recettes" },
 { id: "ingredients", label: "Ingrédients" },
 { id: "fournisseurs", label: "Fournisseurs" },
];

export default function App() {
 const [tab, setTab] = useState("dashboard");
 const [data, setData] = useState(initialData);

 useEffect(() => {
 (async () => {
 try {
 const saved = { value: localStorage.getItem("tropicale_data") };
 if (saved && saved.value) setData(JSON.parse(saved.value));
 } catch {}
 })();
 }, []);

 useEffect(() => {
 (async () => {
 try {
 localStorage.setItem("tropicale_data", JSON.stringify(data));
 } catch {}
 })();
 }, [data]);

 return (
 <div style={{ minHeight: "100vh", background: C.cream, fontFamily: F.body }}>
 <style>{`
 @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;600;700&family=DM+Mono&display=swap');
 * { box-sizing: border-box; }
 input:focus, select:focus, textarea:focus { border-color: #52B788 !important; box-shadow: 0 0 0 3px rgba(82,183,136,0.15); outline: none; }
 button:hover:not(:disabled) { filter: brightness(0.93); }
 `}</style>

 <div style={{ background: C.darkGreen, padding: "14px 24px", display: "flex", alignItems: "center", gap: 14 }}>
 <div>
 <div style={{ fontFamily: F.display, color: C.white, fontSize: 19, fontWeight: 700 }}>La Tropicale Glacier</div>
 <div style={{ fontFamily: F.body, color: C.lightMint, fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }}>Recettes · Ingrédients · Étiquettes</div>
 </div>
 <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
 <Badge color={C.lightMint}>{data.recettes.length} recettes</Badge>
 <Badge color={C.lightGold}>{data.ingredients.length} ingrédients</Badge>
 </div>
 </div>

 <div style={{ background: C.white, borderBottom: `1px solid ${C.lightMint}`, padding: "0 24px", display: "flex", gap: 2 }}>
 {TABS.map(t => (
 <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F.body, fontSize: 13, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? C.green : C.muted, padding: "13px 14px", borderBottom: tab === t.id ? `2.5px solid ${C.green}` : "2.5px solid transparent", transition: "all 0.15s" }}>
 {t.label}
 </button>
 ))}
 </div>

 <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 16px" }}>
 {tab === "dashboard" && <DashboardTab data={data} setData={setData} />}
 {tab === "recettes" && <RecettesTab data={data} setData={setData} />}
 {tab === "ingredients" && <IngredientsTab data={data} setData={setData} />}
 {tab === "fournisseurs" && <FournisseursTab data={data} setData={setData} />}
 </div>
 </div>
 );
}
