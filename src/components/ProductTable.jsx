import "../styles/ProductTable.css";
import { memo, useCallback, useMemo, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { create } from "zustand";

const useProductStore = create((set) => ({
  stockStatus: {},

  updateStock: (id) =>
    set((state) => ({
      stockStatus: {
        ...state.stockStatus,
        [id]: !(state.stockStatus[id] ?? true),
      },
    })),
}));

const ProductRow = memo(function ProductRow({ index, style, data }) {
  const product = data.products[index];

  const inStock = useProductStore(
    (state) => state.stockStatus[product.id] ?? product.inStock,
  );

  const updateStock = useProductStore((state) => state.updateStock);

  const handleUpdate = useCallback(() => {
    updateStock(product.id);
  }, [updateStock, product.id]);

  return (
    <div style={style} className="product-row">
      <span>{product.name}</span>

      <span>{product.sku}</span>

      <span>{inStock ? "Tersedia" : "Habis"}</span>

      <button onClick={handleUpdate}>Ubah Stok</button>
    </div>
  );
});

export default function ProductTable({ products = [] }) {
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const keyword = search.toLowerCase();

    return products.filter((product) =>
      product.name.toLowerCase().includes(keyword),
    );
  }, [products, search]);

  const itemData = useMemo(
    () => ({ products: filteredProducts }),
    [filteredProducts],
  );

  return (
    <section>
      <h2>Daftar Produk</h2>

      <input
        type="text"
        placeholder="Cari produk..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="product-header">
        <span>Nama Produk</span>
        <span>SKU</span>
        <span>Status Stok</span>
        <span>Aksi</span>
      </div>

      <List
        height={500}
        width="100%"
        itemCount={filteredProducts.length}
        itemSize={55}
        itemData={itemData}
        itemKey={(index, data) => data.products[index].id}
      >
        {ProductRow}
      </List>
    </section>
  );
}
