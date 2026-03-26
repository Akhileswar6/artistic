// src/Pages/User/Orders.jsx

export default function Orders() {
  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ fontFamily: "Inter, serif" }}>
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

      <div className="border rounded-lg p-6 shadow-md text-center">
        <p className="text-gray-500">No orders yet</p>

        <p className="text-sm mt-2">
          Once you place an order, it will appear here.
        </p>
      </div>
    </div>
  );
}