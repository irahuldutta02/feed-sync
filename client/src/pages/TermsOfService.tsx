import LegalPageLayout from "@/components/layout/LegalPageLayout";
import React from "react";
import { Helmet } from "react-helmet-async";

const TermsOfService: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | FeedSync</title>
        <meta
          name="description"
          content="Terms of Service for FeedSync - Understanding the rules and guidelines for using our feedback platform."
        />
      </Helmet>

      <LegalPageLayout title="Terms of Service" lastUpdated="May 16, 2024">
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p>
              Welcome to FeedSync. By accessing or using our website and
              feedback collection platform (collectively, the "Service"), you
              agree to be bound by these Terms of Service ("Terms"). If you do
              not agree to these Terms, please do not use our Service.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">2. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will
              provide notice of any material changes by posting the updated
              Terms on our website and updating the "Last updated" date. Your
              continued use of the Service after such changes constitutes your
              acceptance of the new Terms.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">
              3. Account Registration and Security
            </h2>
            <p>
              To access certain features of our Service, you may need to create
              an account. You are responsible for maintaining the
              confidentiality of your account information and for all activities
              that occur under your account. You agree to provide accurate and
              complete information when creating an account and to update your
              information as necessary.
            </p>
            <p>
              You are solely responsible for any activity that occurs through
              your account and for maintaining the security of your password.
              You agree to notify us immediately of any unauthorized use of your
              account or any other breach of security.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">4. User Conduct</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-6">
              <li>Violate any applicable law or regulation</li>
              <li>
                Infringe the rights of others, including intellectual property
                rights
              </li>
              <li>Submit false, misleading, or fraudulent information</li>
              <li>Harass, abuse, or harm another person or entity</li>
              <li>
                Upload or transmit viruses, malware, or other malicious code
              </li>
              <li>
                Interfere with or disrupt the Service or servers/networks
                connected to the Service
              </li>
              <li>
                Attempt to gain unauthorized access to any portion of the
                Service or any related systems
              </li>
              <li>
                Use automated methods to access or use the Service without our
                express permission
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold">5. User Content</h2>
            <p>
              Our Service allows you to submit feedback, comments, and other
              content ("User Content"). You retain ownership of your User
              Content, but you grant us a worldwide, non-exclusive, royalty-free
              license to use, reproduce, modify, adapt, publish, translate, and
              distribute your User Content in connection with the Service.
            </p>
            <p>
              You are solely responsible for your User Content and the
              consequences of posting it. You represent and warrant that you own
              or have the necessary rights to post your User Content and that
              your User Content does not violate the rights of any third party
              or any applicable law.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">
              6. Intellectual Property Rights
            </h2>
            <p>
              All content included on the Service, such as text, graphics,
              logos, images, and software, is the property of FeedSync or our
              licensors and is protected by copyright, trademark, and other
              intellectual property laws. You may not copy, modify, distribute,
              or create derivative works based on this content without our
              express written permission.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">7. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the
              Service at any time, with or without cause, and with or without
              notice. Upon termination, your right to use the Service will
              immediately cease, and we may delete or disable access to your
              account and any associated content.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">
              8. Disclaimer of Warranties
            </h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST
              EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING
              IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, AND NON-INFRINGEMENT.
            </p>
            <p>
              WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED,
              ERROR-FREE, OR SECURE, OR THAT ANY DEFECTS WILL BE CORRECTED. WE
              MAKE NO WARRANTY REGARDING THE QUALITY, ACCURACY, TIMELINESS,
              COMPLETENESS, OR RELIABILITY OF ANY CONTENT AVAILABLE THROUGH THE
              SERVICE.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">
              9. Limitation of Liability
            </h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
              SHALL FEEDSYNC, ITS AFFILIATES, OR THEIR RESPECTIVE OFFICERS,
              DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING
              LOST PROFITS, LOSS OF DATA, OR GOODWILL, ARISING OUT OF OR IN
              CONNECTION WITH YOUR ACCESS TO OR USE OF THE SERVICE.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless FeedSync and its
              officers, directors, employees, agents, and affiliates from and
              against any claims, liabilities, damages, losses, costs, expenses,
              or fees (including reasonable attorneys' fees) arising from your
              use of the Service, violation of these Terms, or infringement of
              any rights of a third party.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of [Your Jurisdiction], without regard to its conflict of
              law provisions. Any legal action or proceeding arising out of or
              relating to these Terms or your use of the Service shall be
              brought exclusively in the courts of [Your Jurisdiction].
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">12. Severability</h2>
            <p>
              If any provision of these Terms is held to be invalid, illegal, or
              unenforceable, the remaining provisions shall continue in full
              force and effect.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">13. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy and any other legal
              notices published by us on the Service, constitute the entire
              agreement between you and FeedSync regarding your use of the
              Service.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">14. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="font-medium">
              Email: legal@feedsync.com
              <br />
              Address: 123 Feedback Street, Analytics City, FS 12345
            </p>
          </section>{" "}
        </div>
      </LegalPageLayout>
    </>
  );
};

export default TermsOfService;
