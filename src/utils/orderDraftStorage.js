// Utility to persist and restore Order Form Draft across page refreshes
// Text fields are saved in localStorage, and uploaded photo file in IndexedDB

const DRAFT_LOCAL_KEY = "artistic_order_draft_data";
const DB_NAME = "ArtisticOrderDB";
const STORE_NAME = "draftFiles";
const DB_VERSION = 1;

let isDraftSavingDisabled = false;

export function disableOrderDraftSaving() {
  isDraftSavingDisabled = true;
}

export function enableOrderDraftSaving() {
  isDraftSavingDisabled = false;
}

function openDB() {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return resolve(null);
    }
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = (err) => {
        console.warn("IndexedDB open error:", err);
        resolve(null);
      };
    } catch (err) {
      console.warn("IndexedDB not available:", err);
      resolve(null);
    }
  });
}

/**
 * Save text / options fields to localStorage
 */
export function saveOrderDraftText(data, currentStep = 1) {
  if (typeof window === "undefined") return;
  if (isDraftSavingDisabled) return;
  if (!data) return;

  try {
    const payload = {
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      doorNo: data.doorNo || "",
      street: data.street || "",
      landmark: data.landmark || "",
      city: data.city || "",
      state: data.state || "",
      pincode: data.pincode || "",
      addressType: data.addressType || "Home",
      artStyle: data.artStyle || "realistic",
      frameOption: data.frameOption || "noframe",
      quantity: data.quantity ?? 1,
      extraPeople: data.extraPeople ?? 0,
      rushDelivery: Boolean(data.rushDelivery),
      couponCode: data.couponCode || "",
      instructions: data.instructions || "",
      artworkId: data.artworkId || null,
      step: currentStep || 1,
      savedAt: Date.now(),
    };
    localStorage.setItem(DRAFT_LOCAL_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn("Failed to save order draft to localStorage:", err);
  }
}

/**
 * Read text fields from localStorage
 */
export function getOrderDraftText() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_LOCAL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // If draft was on step 3 (final review), it's from an already completed/stale order
    if (parsed?.step === 3) {
      clearOrderDraft();
      return null;
    }
    return parsed;
  } catch (err) {
    console.warn("Failed to read order draft from localStorage:", err);
    return null;
  }
}

/**
 * Save draft photo File in IndexedDB
 */
export async function saveDraftPhoto(file, metadata) {
  if (!file || isDraftSavingDisabled) return;
  try {
    const db = await openDB();
    if (!db) return;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
      tx.onabort = () => resolve(false);
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ file, metadata, savedAt: Date.now() }, "order_photo");
      req.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn("Failed to store draft photo in IndexedDB:", err);
  }
}

/**
 * Retrieve draft photo File from IndexedDB
 */
export async function getDraftPhoto() {
  try {
    const db = await openDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get("order_photo");
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn("Failed to retrieve draft photo from IndexedDB:", err);
    return null;
  }
}

/**
 * Remove draft photo from IndexedDB
 */
export async function clearDraftPhoto() {
  try {
    const db = await openDB();
    if (!db) return;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
      tx.onabort = () => resolve(false);
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete("order_photo");
      req.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn("Failed to clear draft photo from IndexedDB:", err);
  }
}

/**
 * Completely clear the saved order draft (after successful order submission or user reset)
 */
export async function clearOrderDraft() {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(DRAFT_LOCAL_KEY);
      sessionStorage.removeItem(DRAFT_LOCAL_KEY);
    } catch (e) {}
  }
  await clearDraftPhoto();
}
