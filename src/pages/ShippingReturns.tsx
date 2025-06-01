// src/pages/ShippingReturns.tsx
import React from "react";

const ShippingReturns: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-8">Shipping & Returns</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Shipping Policy</h2>
        <ul className="list-disc list-inside space-y-3">
          <li>
            We currently ship only within the 48 contiguous United States.
          </li>
          <li>
            Orders over <strong>$75</strong> qualify for{" "}
            <strong>free shipping</strong>. Orders below $75 incur a flat rate
            shipping fee of $6.
          </li>
          <li>
            We do not ship to Hawaii, Alaska, Puerto Rico, Guam, P.O. Boxes, or
            APO/FPO addresses at this time.
          </li>
          <li>
            Our primary shipping providers are FedEx Home Delivery, FedEx
            Ground, and FedEx SmartPost.
          </li>
          <li>
            Signature confirmation may be required for delivery, depending on
            the order value and shipping address.
          </li>
          <li>
            Orders are processed within 1–3 business days. Transit time
            typically ranges from 2–5 business days.
          </li>
          <li>All orders ship from Washington State.</li>
          <li>
            If using a freight forwarding service, Lootara is not responsible
            for damage or loss after initial delivery.
          </li>
        </ul>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Pre-Order Items</h3>
          <p className="mt-2">
            Orders containing pre-order items will ship once all items are
            available. To avoid delays, we recommend placing separate orders for
            in-stock and pre-order items.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Returns & Exchanges</h2>
        <ul className="list-disc list-inside space-y-3">
          <li>
            New, unopened items may be returned within 30 days for a refund.
          </li>
          <li>
            We do not accept returns on trading card games (e.g. Pokémon, Magic,
            One Piece) or blind-box products to ensure product integrity.
          </li>
          <li>
            If your return is due to our error (e.g. wrong or defective item),
            we will provide a prepaid shipping label.
          </li>
          <li>
            For board games and miniatures with missing components, please
            contact us to initiate a manufacturer replacement request.
          </li>
          <li>
            Return requests must be submitted via your Lootara account under the
            order history section.
          </li>
          <li>
            A restocking fee of 15% may apply depending on the condition and
            timing of the return.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Order Cancellations</h2>
        <ul className="list-disc list-inside space-y-3">
          <li>
            Email{" "}
            <a
              href="mailto:shop@lootara.com"
              className="text-blue-600 underline"
            >
              support@lootara.com
            </a>{" "}
            to request a cancellation. Please include your order number and
            email address used for the purchase.
          </li>
          <li>
            Cancellations are not guaranteed and depend on the processing status
            of your order.
          </li>
          <li>
            Pre-orders can be cancelled within 120 days for a full refund. After
            120 days, only store credit or check refunds are offered.
          </li>
          <li>
            Orders held for more than 30 days may be subject to a 15% restocking
            or storage fee.
          </li>
          <li>
            Excessive cancellations may result in loss of order hold privileges.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default ShippingReturns;
