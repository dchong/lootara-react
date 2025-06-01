// src/pages/privacy.tsx
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        At Lootara, we value your privacy and are committed to protecting the
        personal information you share with us. This Privacy Policy explains how
        we collect, use, and safeguard your information when you visit our
        website.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        Information We Collect
      </h2>
      <p className="mb-4">
        We may collect the following types of personal data:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          Contact information (such as name, email address, and phone number)
        </li>
        <li>Billing and shipping addresses</li>
        <li>
          Payment information (processed securely through third-party vendors)
        </li>
        <li>Browser and usage data (via cookies and analytics tools)</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        How We Use Your Information
      </h2>
      <p className="mb-4">Your information is used to:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Process and fulfill orders</li>
        <li>Respond to inquiries and customer support requests</li>
        <li>Send updates, offers, and promotional materials</li>
        <li>Improve our website and shopping experience</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Cookies and Tracking</h2>
      <p className="mb-4">
        We use cookies to enhance your browsing experience, analyze site
        traffic, and personalize content. You can control cookies through your
        browser settings.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        Sharing Your Information
      </h2>
      <p className="mb-4">
        We do not sell your personal data. We only share your information with
        trusted partners and service providers who help us operate our business,
        such as payment processors and shipping providers. These third parties
        are obligated to keep your information secure.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Your Rights</h2>
      <p className="mb-4">
        You have the right to access, correct, or delete your personal
        information at any time. To exercise these rights, please contact us at
        <a
          href="mailto:shop@lootara.com"
          className="text-blue-600 hover:underline"
        >
          {" "}
          support@lootara.com
        </a>
        .
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Policy Updates</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page with an updated revision date.
      </p>

      <p className="mt-8 text-sm text-gray-500">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

export default PrivacyPolicy;
