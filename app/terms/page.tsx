import { Metadata } from 'next';

// Define metadata for the page (Next.js 13+ App Router)
export const metadata: Metadata = {
  title: 'Terms of Service | [Your Company Name]',
  description: 'The legally binding terms and conditions governing your use of the [Your SaaS Name] invoice management service.',
};

const TermsOfService = () => {
  const companyName = 'JK Technology Limited';
  const saasName = 'Invoice';
  const contactEmail = 'info@jktl.com.ng';
  const companyJurisdiction = 'Federal Republic of Nigeria';
  const courtLocation = 'The Capital of Rivers State';
  const lastUpdated = 'November 19, 2025';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 mb-2">
            Terms of Service
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Last Updated: {lastUpdated}
          </p>
          <p className="mt-4 italic text-sm text-red-500 dark:text-red-400">
            ⚠️ Please customize all bracketed placeholders and consult legal counsel.
          </p>
        </header>

        <section className="space-y-8 p-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl">
          <p className="text-lg font-medium">
            Please read these Terms of Service (the "**Terms**") carefully before using the **{saasName}** invoice management platform (the "**Service**") operated by **{companyName}** ("we," "us," or "our").
          </p>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-2 border-purple-200 dark:border-purple-700">
            1. The Service and Accounts
          </h2>
          <div className="space-y-4">
            <p>
              The Service is a Software-as-a-Service (SaaS) platform that allows users to create, manage, and track business invoices and related financial documents.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>**Eligibility:** You must be at least 18 years old to use the Service.</li>
              <li>**Account Security:** You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-2 border-purple-200 dark:border-purple-700">
            2. Subscriptions, Fees, and Payments
          </h2>
          <div className="space-y-4">
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>**Subscription:** The Service is billed on a subscription basis (e.g., monthly or annually) and is charged in advance.</li>
              <li>**Billing:** All billing information is processed by a secured third-party payment processor. You agree to pay all charges at the prices then in effect for your use of the Service.</li>
              <li>**Fee Changes:** We reserve the right to change fees upon 30 days prior notice.</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-2 border-purple-200 dark:border-purple-700">
            3. User Data (Customer Data)
          </h2>
          <div className="space-y-4">
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>**Ownership:** You retain all ownership of the data you submit to the Service, including the content of your invoices, client lists, and payment records (**"Customer Data"**).</li>
              <li>**License to Us:** You grant us a limited, non-exclusive license to use, host, store, and process your Customer Data solely for the purpose of providing and improving the Service.</li>
              <li>**Data Responsibility:** You are responsible for the accuracy, legality, and integrity of your Customer Data.</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-2 border-purple-200 dark:border-purple-700">
            4. Termination
          </h2>
          <div className="space-y-4">
            <p>
              Either party may terminate the Service.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>**By You:** You may cancel your subscription at any time through your account settings.</li>
              <li>**By Us:** We may terminate or suspend your account immediately if you breach these Terms (e.g., non-payment, illegal use).</li>
              <li>**Data After Termination:** Upon termination, your access ceases. We will provide a 30-day grace period for you to download your Customer Data before its permanent deletion (unless legally required otherwise).</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-2 border-purple-200 dark:border-purple-700">
            5. Limitation of Liability and Disclaimer
          </h2>
          <div className="space-y-4">
            <p>
              The Service is provided on an "**AS IS**" and "**AS AVAILABLE**" basis, without warranties of any kind.
            </p>
            <p>
              In no event shall {companyName} be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from: (i) your access to or use of the Service; (ii) any conduct or content of any third party; or (iii) any unauthorized access or use of your Customer Data.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-2 border-purple-200 dark:border-purple-700">
            6. Governing Law and Dispute Resolution
          </h2>
          <div className="space-y-4">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of **{companyJurisdiction}**, without regard to its conflict of law provisions.
            </p>
            <p>
              Any dispute arising from these Terms will be subject to the exclusive jurisdiction of the courts in **{courtLocation}**.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-2 border-purple-200 dark:border-purple-700">
            7. Contact Us
          </h2>
          <p>
            If you have any questions about these Terms, please contact us:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>**By email:** <a href={`mailto:${contactEmail}`} className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline font-medium">{contactEmail}</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;