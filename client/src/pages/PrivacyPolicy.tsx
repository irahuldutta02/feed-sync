import LegalPageLayout from "@/components/layout/LegalPageLayout";
import React from "react";
import { Helmet } from "react-helmet-async";

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | FeedSync</title>
        <meta
          name="description"
          content="Privacy Policy for FeedSync - Learn how we collect, use, and protect your data."
        />
      </Helmet>

      <LegalPageLayout title="Privacy Policy" lastUpdated="May 16, 2024">
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p>
              Welcome to FeedSync ("we," "our," or "us"). We are committed to
              protecting your privacy and handling your data with transparency
              and care. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our website
              and feedback collection platform (collectively, the "Service").
            </p>
            <p>
              By accessing or using our Service, you consent to the practices
              described in this Privacy Policy. If you do not agree with the
              policies and practices outlined here, please do not use our
              Service.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">2. Information We Collect</h2>
            <h3 className="text-lg font-medium">2.1 Personal Information</h3>
            <p>
              We may collect personal information that you voluntarily provide
              when using our Service, including:
            </p>
            <ul className="list-disc pl-6">
              <li>
                Name and contact information (email address, phone number)
              </li>
              <li>Account credentials (username, password)</li>
              <li>Profile information</li>
              <li>Feedback, survey responses, and comments you provide</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-lg font-medium">
              2.2 Automatically Collected Information
            </h3>
            <p>
              When you access or use our Service, we automatically collect
              certain information, including:
            </p>
            <ul className="list-disc pl-6">
              <li>
                Device information (device type, operating system, browser type)
              </li>
              <li>Log data (IP address, access times, pages viewed)</li>
              <li>
                Usage information (features used, interactions with content)
              </li>
              <li>Cookies and similar tracking technologies data</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold">
              3. How We Use Your Information
            </h2>
            <p>
              We may use the information we collect for various purposes,
              including:
            </p>
            <ul className="list-disc pl-6">
              <li>Providing and maintaining our Service</li>
              <li>Processing and responding to your feedback and inquiries</li>
              <li>Personalizing your experience</li>
              <li>Improving our Service and developing new features</li>
              <li>
                Communicating with you about updates, features, and promotional
                offers
              </li>
              <li>Analyzing usage patterns and trends</li>
              <li>
                Protecting against unauthorized access and ensuring the security
                of our Service
              </li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold">
              4. Sharing of Your Information
            </h2>
            <p>
              We may share your information with third parties in the following
              circumstances:
            </p>
            <ul className="list-disc pl-6">
              <li>With service providers who perform services on our behalf</li>
              <li>With your consent or at your direction</li>
              <li>To comply with legal obligations or protect our rights</li>
              <li>
                In connection with a business transaction such as a merger or
                acquisition
              </li>
              <li>
                In aggregated or anonymized form that cannot reasonably be used
                to identify you
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect the security of your personal information. However, no
              method of transmission over the Internet or electronic storage is
              100% secure, and we cannot guarantee absolute security.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">6. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding
              your personal information, including:
            </p>
            <ul className="list-disc pl-6">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate or incomplete information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction of processing of your personal information</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information
              provided in the "Contact Us" section below.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">
              7. Cookies and Tracking Technologies
            </h2>
            <p>
              We use cookies and similar tracking technologies to collect
              information about your browsing activities and to improve your
              experience on our Service. You can control cookies through your
              browser settings and other tools, but this may impact the
              functionality of our Service.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">8. Children's Privacy</h2>
            <p>
              Our Service is not intended for children under the age of 13, and
              we do not knowingly collect personal information from children
              under 13. If you are a parent or guardian and believe that your
              child has provided us with personal information, please contact
              us.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">
              9. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date. You are advised to
              review this Privacy Policy periodically for any changes.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <p className="font-medium">
              Email: privacy@feedsync.com
              <br />
              Address: 123 Feedback Street, Analytics City, FS 12345
            </p>
          </section>{" "}
        </div>
      </LegalPageLayout>
    </>
  );
};

export default PrivacyPolicy;
