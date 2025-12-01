import { Metadata } from 'next';

// Define metadata for the page (Next.js 13+ App Router)
export const metadata: Metadata = {
  title: 'Privacy Policy | [Your Company Name]',
  description: 'Our policy on the collection, use, and disclosure of your personal information when you use our invoice management SaaS.',
};

const PrivacyPolicy = () => {
  const companyName = 'JK Technology Limited';
  const saasName = 'Invoice';
  const contactEmail = 'info@jktl.com.ng';
  const companyAddress = 'No.4 Chief Oge Close, Port Harcourt, Rivers State';
  const lastUpdated = 'November 19, 2025';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Last Updated: {lastUpdated}
          </p>
          <p className="mt-4 italic text-sm text-red-500 dark:text-red-400">
            ⚠️ Please customize all bracketed placeholders and consult legal counsel.
          </p>
        </header>

        <section className="space-y-8 p-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl">
          <p className="text-lg">
            This Privacy Policy describes how **{companyName}** ("we," "us," or "our") collects, uses, and discloses information in connection with your use of our invoice management Software as a Service (**SaaS**) platform, named **{saasName}** (the "Service").
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-2 border-blue-200 dark:border-blue-700">
            1. Information We Collect
          </h2>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">A. Information You Provide to Us</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>**Account and Contact Data:** Name, email address, phone number, company name, and company physical address.</li>
              <li>**Billing and Payment Data:** Credit card details (processed securely by a third-party processor, e.g., Stripe) and billing history.</li>
              <li>
                **Invoice Data (Customer Data):** All information you input into the Service to create invoices, including your client's names, addresses, payment terms, and details of services rendered.
                <span className="font-medium text-blue-600 dark:text-blue-400 block mt-1">This is the core business data processed by the Service.</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">B. Information Collected Automatically</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>**Usage Data:** Information on how you access and use the Service, such as IP address, browser type, pages viewed, time spent on the Service, and clicks.</li>
              <li>**Cookies and Tracking Technologies:** We use cookies and similar technologies to track activity, maintain session state, and analyze usage patterns.</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-2 border-blue-200 dark:border-blue-700">
            2. How We Use Your Information
          </h2>
          <p>
            We use the collected data for various purposes, primarily centered around providing the reliable invoice service:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>**To Provide the Service:** To operate, maintain, and deliver the core invoice generation and management functionality.</li>
            <li>**Account Management:** To manage your registration, provide customer support, and send essential service-related notifications.</li>
            <li>**Service Improvement:** To monitor usage and analyze trends to enhance our platform's performance, features, and user experience.</li>
            <li>**Security and Compliance:** To detect, prevent, and address technical issues or illegal activities, and to comply with legal obligations.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-2 border-blue-200 dark:border-blue-700">
            3. How We Share Your Information
          </h2>
          <p>
            We do not sell your **Invoice Data** (Customer Data). We may share your information only in the following limited circumstances:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>**Service Providers:** We share necessary information with third-party vendors who assist us with payment processing (e.g., Stripe), cloud hosting (e.g., AWS, GCP), and analytics.</li>
            <li>**Business Transfers:** In connection with a merger, acquisition, or sale of assets, your data may be transferred, provided the new owner adheres to this Privacy Policy.</li>
            <li>**Legal Requirements:** If required to do so by law or in response to valid requests by public authorities (e.g., a court order).</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-2 border-blue-200 dark:border-blue-700">
            4. Data Security and Retention
          </h2>
          <p>
            We take reasonable technical and organizational measures to protect your Personal Data and Invoice Data. However, you acknowledge that no method of transmission over the Internet is 100% secure.
          </p>
          <p>
            We retain your data for as long as your account is active or as needed to provide you with the Service. We also retain information as necessary to comply with legal obligations, resolve disputes, and enforce our agreements.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-2 border-blue-200 dark:border-blue-700">
            5. Your Data Protection Rights
          </h2>
          <p>
            Depending on your location, you may have rights regarding your personal data, including the right to access, rectify, or erase your data. To exercise these rights, please contact us using the details below.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-2 border-blue-200 dark:border-blue-700">
            6. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>**By email:** <a href={`mailto:${contactEmail}`} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium">{contactEmail}</a></li>
            <li>**By mail:** {companyAddress}</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;