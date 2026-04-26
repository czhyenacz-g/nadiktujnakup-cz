import type { GroceryItem, ParsedGroceryRequest } from "./types";

type GroceryItemDraft = Omit<GroceryItem, "id">;

interface ItemRule {
  keywords: string[];
  item: GroceryItemDraft;
}

const DIRECT_ITEM_RULES: ItemRule[] = [
  {
    keywords: ["mleko"],
    item: {
      name: "Mléko",
      quantity: "1 l",
      category: "Mléčné výrobky",
      confidence: 0.96,
    },
  },
  {
    keywords: ["vajicka", "vejce"],
    item: {
      name: "Vajíčka",
      quantity: "10 ks",
      category: "Základní potraviny",
      confidence: 0.96,
    },
  },
  {
    keywords: ["banany", "banan"],
    item: {
      name: "Banány",
      quantity: "1 kg",
      category: "Ovoce a zelenina",
      confidence: 0.95,
    },
  },
  {
    keywords: ["pecivo", "rohliky", "chleb"],
    item: {
      name: "Pečivo",
      quantity: "1 balení",
      category: "Pečivo",
      confidence: 0.94,
    },
  },
  {
    keywords: ["maslo"],
    item: {
      name: "Máslo",
      quantity: "1 ks",
      category: "Mléčné výrobky",
      confidence: 0.95,
    },
  },
  {
    keywords: ["sunka"],
    item: {
      name: "Šunka",
      quantity: "200 g",
      category: "Lahůdky",
      confidence: 0.94,
    },
  },
  {
    keywords: ["syr"],
    item: {
      name: "Sýr",
      quantity: "200 g",
      category: "Mléčné výrobky",
      confidence: 0.93,
    },
  },
  {
    keywords: ["jogurty", "jogurt"],
    item: {
      name: "Jogurty",
      quantity: "4 ks",
      category: "Mléčné výrobky",
      confidence: 0.95,
    },
  },
  {
    keywords: ["ovoce"],
    item: {
      name: "Sezonní ovoce",
      quantity: "1 kg",
      category: "Ovoce a zelenina",
      confidence: 0.9,
    },
  },
];

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createItemId(name: string, index: number): string {
  const slug = normalizeText(name).replace(/\s+/g, "-");
  return `${slug}-${index + 1}`;
}

function containsAny(normalizedText: string, keywords: string[]): boolean {
  return keywords.some((keyword) => normalizedText.includes(keyword));
}

function addUniqueItem(items: GroceryItemDraft[], item: GroceryItemDraft): void {
  const itemKey = normalizeText(item.name);
  const existingIndex = items.findIndex(
    (existingItem) => normalizeText(existingItem.name) === itemKey,
  );

  if (existingIndex === -1) {
    items.push(item);
    return;
  }

  const existingItem = items[existingIndex];
  items[existingIndex] = {
    ...existingItem,
    quantity: existingItem.quantity ?? item.quantity,
    category: existingItem.category ?? item.category,
    note: existingItem.note ?? item.note,
    confidence: Math.max(existingItem.confidence, item.confidence),
  };
}

function addDinnerSuggestions(items: GroceryItemDraft[], suggestions: string[]): void {
  addUniqueItem(items, {
    name: "Čerstvé těstoviny",
    quantity: "1 balení",
    category: "Hotová a rychlá jídla",
    note: "Rychlá varianta k večeři",
    confidence: 0.72,
  });
  addUniqueItem(items, {
    name: "Rajčatová omáčka",
    quantity: "1 sklenice",
    category: "Trvanlivé potraviny",
    note: "K těstovinám",
    confidence: 0.7,
  });
  addUniqueItem(items, {
    name: "Strouhaný sýr",
    quantity: "1 balení",
    category: "Mléčné výrobky",
    note: "Doplněk k rychlé večeři",
    confidence: 0.66,
  });
  suggestions.push("Výraz „něco k večeři“ beru jako rychlé jídlo bez složité přípravy.");
}

function addBreakfastSuggestions(items: GroceryItemDraft[], suggestions: string[]): void {
  addUniqueItem(items, {
    name: "Jogurty",
    quantity: "6 ks",
    category: "Mléčné výrobky",
    note: "Snídaně pro děti",
    confidence: 0.78,
  });
  addUniqueItem(items, {
    name: "Ovesné vločky",
    quantity: "1 balení",
    category: "Základní potraviny",
    note: "Snídaňový základ",
    confidence: 0.74,
  });
  addUniqueItem(items, {
    name: "Banány",
    quantity: "1 kg",
    category: "Ovoce a zelenina",
    note: "Ovoce ke snídani",
    confidence: 0.72,
  });
  suggestions.push("Snídani pro děti doplňuji o jogurty, ovoce a jednoduchý sytý základ.");
}

function addHealthyLunchSuggestions(items: GroceryItemDraft[], suggestions: string[]): void {
  addUniqueItem(items, {
    name: "Kuřecí prsa",
    quantity: "500 g",
    category: "Maso a ryby",
    note: "Jednoduchý zdravý oběd",
    confidence: 0.7,
  });
  addUniqueItem(items, {
    name: "Rýže",
    quantity: "1 balení",
    category: "Základní potraviny",
    note: "Příloha k obědu",
    confidence: 0.68,
  });
  addUniqueItem(items, {
    name: "Zeleninový mix",
    quantity: "1 balení",
    category: "Ovoce a zelenina",
    note: "Zelenina k obědu",
    confidence: 0.72,
  });
  suggestions.push("Zdravý oběd převádím na jednoduchou kombinaci bílkoviny, přílohy a zeleniny.");
}

// TODO(integration): Replace this deterministic parser with a server-side AI parser behind the same typed return value.
export function parseGroceryRequest(originalText: string): ParsedGroceryRequest {
  const normalizedText = normalizeText(originalText);
  const items: GroceryItemDraft[] = [];
  const suggestions: string[] = [];
  const assumptions: string[] = [];

  for (const rule of DIRECT_ITEM_RULES) {
    if (containsAny(normalizedText, rule.keywords)) {
      const item =
        rule.item.name === "Sezonní ovoce" && normalizedText.includes("tyden")
          ? { ...rule.item, quantity: "2 kg", note: "Ovoce přibližně na celý týden" }
          : rule.item;

      addUniqueItem(items, item);
    }
  }

  const asksForDinner =
    normalizedText.includes("vecere") ||
    normalizedText.includes("k veceri") ||
    normalizedText.includes("rychleho k veceri");
  if (asksForDinner && (normalizedText.includes("neco") || normalizedText.includes("rychl"))) {
    addDinnerSuggestions(items, suggestions);
  }

  if (normalizedText.includes("snidane")) {
    addBreakfastSuggestions(items, suggestions);
  }

  const asksForHealthyLunch = normalizedText.includes("obed") && normalizedText.includes("zdrav");
  if (asksForHealthyLunch) {
    addHealthyLunchSuggestions(items, suggestions);
  }

  if (normalizedText.includes("dve deti") || normalizedText.includes("2 deti")) {
    assumptions.push("Počítám se snídaní pro dvě děti.");
  }

  if (normalizedText.includes("tri dny") || normalizedText.includes("3 dny")) {
    assumptions.push("Množství jsou orientačně navýšená na tři dny.");
  }

  if (items.length === 0) {
    suggestions.push("Nenašel jsem konkrétní potraviny. Zkuste doplnit názvy položek nebo typ jídla.");
  } else {
    assumptions.push("Množství jsou demo odhady a před objednávkou je potřeba je zkontrolovat.");
  }

  return {
    originalText,
    items: items.map((item, index) => ({
      id: createItemId(item.name, index),
      ...item,
    })),
    suggestions,
    assumptions,
  };
}
