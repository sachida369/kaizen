export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: December 2024</p>

        <div className="space-y-8 prose prose-sm dark:prose-invert max-w-none">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using this website and the Kaizen platform (the "Service"), you accept and agree to be bound by and comply with the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p className="text-muted-foreground mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on Kaizen's Service for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile, reverse engineer, disassemble, or hacking the Service</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              <li>Violating any applicable laws or regulations</li>
              <li>Harassing, defaming, or causing harm to others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
            <p className="text-muted-foreground mb-4">
              The materials on Kaizen's Service are provided on an 'as is' basis. Kaizen makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
            <p className="text-muted-foreground mb-4">
              In no event shall Kaizen or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Kaizen's Service, even if Kaizen or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Accuracy of Materials</h2>
            <p className="text-muted-foreground mb-4">
              The materials appearing on Kaizen's Service could include technical, typographical, or photographic errors. Kaizen does not warrant that any of the materials on its Service are accurate, complete, or current. Kaizen may make changes to the materials contained on its Service at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Links</h2>
            <p className="text-muted-foreground mb-4">
              Kaizen has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Kaizen of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Modifications</h2>
            <p className="text-muted-foreground mb-4">
              Kaizen may revise these Terms of Service for its Service at any time without notice. By using this Service, you are agreeing to be bound by the then current version of these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
            <p className="text-muted-foreground mb-4">
              These Terms and Conditions and any separate agreements we provide will be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. User Accounts</h2>
            <p className="text-muted-foreground mb-4">
              When you create an account on Kaizen, you must provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Candidate Call Compliance</h2>
            <p className="text-muted-foreground mb-4">
              You agree to comply with all applicable telemarketing, privacy, and data protection laws including but not limited to the Telephone Consumer Protection Act (TCPA), the General Data Protection Regulation (GDPR), and the California Consumer Privacy Act (CCPA).
            </p>
            <p className="text-muted-foreground mb-4">
              You agree to maintain and check against Do Not Call (DNC) lists before initiating calls. Kaizen provides automated DNC filtering, but you remain responsible for compliance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Intellectual Property Rights</h2>
            <p className="text-muted-foreground mb-4">
              All content included on this Service, such as text, graphics, logos, images, and software, is the property of Kaizen or its content suppliers and is protected by international copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              IN NO EVENT SHALL KAIZEN BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, REGARDLESS OF THE CAUSE OR THEORY OF LIABILITY, EVEN IF KAIZEN HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Email: legal@kaizen.com</li>
              <li>Address: San Francisco, CA, USA</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
