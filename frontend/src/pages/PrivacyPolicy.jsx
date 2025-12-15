import React from "react";
import { Shield, Lock, Eye, FileText, Cookie, Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: FileText,
      title: "Information We Collect",
      content: "At LensLogic, we collect information that you provide directly to us, including:",
      list: [
        "Personal information such as name, email address, phone number, and shipping address",
        "Payment information (processed securely through our payment partners)",
        "Account credentials and preferences",
        "Purchase history and product preferences"
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: "We use the information we collect to:",
      list: [
        "Process and fulfill your orders",
        "Send you order confirmations and shipping updates",
        "Respond to your inquiries and provide customer support",
        "Send you marketing communications (with your consent)",
        "Improve our website and services",
        "Detect and prevent fraud"
      ]
    },
    {
      icon: Shield,
      title: "Information Sharing",
      content: "We do not sell your personal information. We may share your information with:",
      list: [
        "Service providers who assist us in operating our website and conducting business",
        "Payment processors to handle transactions securely",
        "Shipping companies to deliver your orders",
        "Legal authorities when required by law"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure."
    },
    {
      icon: CheckCircle2,
      title: "Your Rights",
      content: "You have the right to:",
      list: [
        "Access your personal information",
        "Correct inaccurate information",
        "Request deletion of your personal information",
        "Opt-out of marketing communications",
        "Object to processing of your personal information"
      ]
    },
    {
      icon: Cookie,
      title: "Cookies",
      content: "We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookies through your browser settings."
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <section className="pt-8 pb-12 md:pt-12 md:pb-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: 'var(--accent-yellow)', color: 'var(--text-primary)' }}>
              <Shield className="w-4 h-4" />
              Privacy & Protection
            </div>
            <h1 className="text-optic-heading text-4xl md:text-5xl lg:text-6xl leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              Privacy <span style={{ color: 'var(--accent-yellow)' }}>Policy</span>
            </h1>
            <p className="text-optic-body text-lg md:text-xl mb-4" style={{ color: 'var(--text-secondary)' }}>
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12 md:py-16" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="card-optic p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent-yellow)' }}>
                      <Icon className="w-6 h-6 md:w-7 md:h-7" style={{ color: 'var(--text-primary)' }} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-optic-heading text-xl md:text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                        {index + 1}. {section.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-optic-body mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {section.content}
                  </p>
                  {section.list && (
                    <ul className="space-y-3 ml-2">
                      {section.list.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--accent-yellow)' }}></div>
                          <span className="text-optic-body leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-optic p-8 md:p-10 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--accent-yellow)' }}>
              <Mail className="w-8 h-8" style={{ color: 'var(--text-primary)' }} />
            </div>
            <h2 className="text-optic-heading text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Have Questions?
            </h2>
            <p className="text-optic-body text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: 'var(--accent-yellow)' }} />
                <div>
                  <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Email</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>support@lenslogic.com</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: 'var(--accent-yellow)' }} />
                <div>
                  <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Phone</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>+91 98765 43210</div>
                </div>
              </div>
              <div className="flex items-start gap-3 md:col-span-3 md:justify-center">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: 'var(--accent-yellow)' }} />
                <div>
                  <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Address</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>1245 Fashion Street, Bandra West, Mumbai - 400050, Maharashtra, India</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
