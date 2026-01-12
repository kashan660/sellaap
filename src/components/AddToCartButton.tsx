'use client';

import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { Product } from "@prisma/client";

interface AddToCartButtonProps {
    product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addItem } = useCart();

    return (
        <button 
            onClick={() => addItem(product)}
            className="flex-1 bg-primary border border-transparent rounded-md py-4 px-8 flex items-center justify-center text-base font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-sm transition-colors cursor-pointer"
        >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
        </button>
    );
}
