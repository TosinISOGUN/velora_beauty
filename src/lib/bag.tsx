import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { describeSelections, missingGroups, type Product, type Selections } from "@/data/products";

import {
  addLine,
  countItems,
  parseSavedBag,
  removeLine,
  resolveLines,
  setLineQty,
  subtotalOf,
  type BagLine,
  type ResolvedLine,
} from "./bag-logic";

const STORAGE_KEY = "velora-bag-v2";

export interface AddResult {
  ok: boolean;
  /** Labels of the choices still missing when `ok` is false. */
  missing: string[];
}

interface BagApi {
  items: ResolvedLine[];
  count: number;
  subtotal: number;
  addItem: (product: Product, selections?: Selections, qty?: number) => AddResult;
  /** Adds several products at once and announces a single message. */
  addMany: (entries: { product: Product; selections: Selections }[]) => void;
  setQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  isOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  announcement: string;
}

const BagContext = createContext<BagApi | null>(null);

/**
 * Shared bag state. Only the product slug, chosen option ids and quantity are saved in the
 * browser; nothing personal is stored and nothing is sent anywhere.
 */
export function BagProvider({ children }: { children: ReactNode }) {
  // Start empty and load after mount so the server render and first client render match.
  const [lines, setLines] = useState<BagLine[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    try {
      setLines(parseSavedBag(window.localStorage.getItem(STORAGE_KEY)));
    } catch {
      // storage unavailable (private window): the bag simply will not persist
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // see above
    }
  }, [lines, loaded]);

  const addItem = useCallback<BagApi["addItem"]>((product, selections = {}, qty = 1) => {
    const missing = missingGroups(product, selections);
    if (missing.length > 0) return { ok: false, missing: missing.map((g) => g.label) };
    setLines((prev) => addLine(prev, product, selections, qty));
    const detail = describeSelections(product, selections);
    setAnnouncement(
      `Added ${qty > 1 ? `${qty} × ` : ""}${product.name}${detail ? ` (${detail})` : ""} to your bag.`,
    );
    setIsOpen(true);
    return { ok: true, missing: [] };
  }, []);

  const addMany = useCallback<BagApi["addMany"]>((entries) => {
    const valid = entries.filter((e) => missingGroups(e.product, e.selections).length === 0);
    if (valid.length === 0) return;
    setLines((prev) => valid.reduce((acc, e) => addLine(acc, e.product, e.selections), prev));
    setAnnouncement(`Added ${valid.length} products to your bag.`);
    setIsOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) => setLineQty(prev, key, qty));
    setAnnouncement(qty < 1 ? "Item removed from your bag." : `Quantity updated to ${qty}.`);
  }, []);

  const removeItem = useCallback((key: string) => {
    setLines((prev) => removeLine(prev, key));
    setAnnouncement("Item removed from your bag.");
  }, []);

  const clear = useCallback(() => {
    setLines([]);
    setAnnouncement("Your bag is empty.");
  }, []);

  const items = useMemo(() => resolveLines(lines), [lines]);

  const value = useMemo<BagApi>(
    () => ({
      items,
      count: countItems(items),
      subtotal: subtotalOf(items),
      addItem,
      addMany,
      setQty,
      removeItem,
      clear,
      isOpen,
      openBag: () => setIsOpen(true),
      closeBag: () => setIsOpen(false),
      announcement,
    }),
    [items, addItem, addMany, setQty, removeItem, clear, isOpen, announcement],
  );

  return (
    <BagContext.Provider value={value}>
      {children}
      {/* Screen-reader announcements for bag updates */}
      <div aria-live="polite" role="status" className="sr-only">
        {announcement}
      </div>
    </BagContext.Provider>
  );
}

export function useBag(): BagApi {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag must be used within BagProvider");
  return ctx;
}
