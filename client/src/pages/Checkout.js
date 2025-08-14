import React from "react";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

const Checkout = () => {
  const { cart, setCart } = useCart();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;

    const message = `Hello, I want to place an order from Abhi ShoppingZone.\n\nItems:\n${cart
      .map((item) => `${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`)
      .join("\n")}\n\nTotal: ₹${total}`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "919696400628";
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");

    // ✅ Clear cart after order
    localStorage.removeItem("cart");
    setCart([]);
    toast.success("✅ Order placed! Cart cleared.");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold text-center text-black mb-6">
          🧾 Checkout Summary
        </h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-600">🛒 Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="font-semibold text-green-600">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right mb-6">
              <p className="text-xl font-bold text-black">
                Total: ₹{total.toFixed(2)}
              </p>
            </div>

            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-200"
            >
              📲 Place Order via WhatsApp
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
