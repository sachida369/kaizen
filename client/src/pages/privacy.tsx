export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: December 2024</p>

        <div className="space-y-8 prose prose-sm dark:prose-invert max-w-none">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              Kaizen ("we", "us", "our" or "Company") operates the kaizen.com website and the Kaizen mobile application (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information Collection and Use</h2>
            <p className="text-muted-foreground mb-4">We collect several different types of information for various purposes to provide and improve our Service to you.</p>
            
            <h3 className="text-lg font-semibold mb-2">Types of Data Collected:</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li><strong>Personal Data:</strong> Email address, name, phone number, and job title</li>
              <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, time spent</li>
              <li><strong>Candidate Data:</strong> Call recordings, transcripts, and engagement metrics (with consent)</li>
              <li><strong>Device Data:</strong> Device ID, operating system, and mobile network information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Use of Data</h2>
            <p className="text-muted-foreground mb-4">Kaizen uses the collected data for various purposes:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical and security issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Security of Data</h2>
            <p className="text-muted-foreground mb-4">
              The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. GDPR Compliance</h2>
            <p className="text-muted-foreground mb-4">
              If you are a resident of the European Economic Area (EEA), you have certain data protection rights. Kaizen aims to take reasonable steps to allow you to correct, amend, delete or limit the use of your Personal Data.
            </p>
            <p className="text-muted-foreground mb-4">
              You have the right to request access to, correction of, or deletion of your personal data. You also have the right to data portability and the right to object to processing of your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. CCPA Compliance</h2>
            <p className="text-muted-foreground mb-4">
              If you are a resident of California, you have the right to know what personal information is collected, used, shared or sold. You have the right to delete personal information collected from you (with some exceptions).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
            <p className="text-muted-foreground mb-4">
              We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Third-Party Services</h2>
            <p className="text-muted-foreground mb-4">
              Our Service may contain links to other sites that are not operated by us. This Privacy Policy does not apply to third-party websites and we are not responsible for their privacy practices.
            </p>
            <p className="text-muted-foreground mb-4">
              We use third-party services for: OpenAI (AI processing), Vapi (voice agents), Twilio (telephony), GoHighLevel (CRM), and Firebase (authentication). These services have their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Candidate Data & Do Not Call</h2>
            <p className="text-muted-foreground mb-4">
              We maintain a Global Do Not Call (DNC) list and regional DNC lists. All campaign executions are checked against these lists to ensure compliance with telemarketing regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
            <p className="text-muted-foreground mb-4">
              Our Service does not address anyone under the age of 18. We do not knowingly collect personal information from children under 18.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Email: privacy@kaizen.com</li>
              <li>Address: San Francisco, CA, USA</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
