import { useMemo } from "react";
import ProductTable from "./components/ProductTable";

import "./App.css";

function App() {
  const products = useMemo(
    () =>
      Array.from({ length: 5000 }, (_, index) => ({
        id: index + 1,
        name: `Produk ${index + 1}`,
        sku: `SKU-${index + 1}`,
        inStock: true,
      })),
    [],
  );

  return (
    <main>
      <h1>Dashboard E-commerce</h1>
      <ProductTable products={products} />
    </main>
  );
}

export default App;
