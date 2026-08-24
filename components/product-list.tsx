"use client";

import type { Product } from "@zivira/types";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { StatusBadge } from "./page-components";

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  async function loadProducts() {
    setError("");
    try {
      const response = await apiClient.products();
      setProducts(response.data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load products");
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  return (
    <>
      <div className="toolbar">
        <button className="button button-secondary" onClick={loadProducts} type="button">
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Code</th><th>Category</th><th>Division</th><th>Status</th></tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.code}</td>
                <td>{product.category}</td>
                <td>{product.division}</td>
                <td><StatusBadge status={product.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
