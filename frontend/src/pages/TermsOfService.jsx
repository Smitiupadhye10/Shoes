import React from "react";
import { FileText, Shield, AlertCircle, CreditCard, Package, Scale, Ban, Mail, Phone, MapPin } from "lucide-react";

const TermsOfService = () => {
  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: "By accessing and using LensLogic's website and services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services."
    },
    {
      icon: Shield,
      title: "Use of Service",
      content: "You agree to use our service only for lawful purposes and in accordance with these Terms. You agree not to:",
      list: [
        "Use the service in any way that violates any applicable law or regulation",
        "Infringe upon the rights of others",
        "Transmit any malicious code or viruses",
        "Attempt to gain unauthorized access to any portion of the service",
        "Interfere with or disrupt the service or servers connected to the service"
      ]
    },
    {
      icon: Package,
      title: "Product Information",
      content: "We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.",
      note: "All product images are for illustrative purposes only. Actual products may vary slightly in appearance."
    },
    {
      icon: CreditCard,
      title: "Pricing and Payment",
      content: "All prices are listed in Indian Rupees (INR) and are subject to change without notice. We reserve the right to modify prices at any time.",
      note: "Payment must be made through our authorized payment gateways. By placing an order, you agree to pay all charges incurred for your purchases."
    },
    {
      icon: AlertCircle,
      title: "Orders and Acceptance",
      content: "When you place an order, we will send you an order confirmation email. This email constitutes our acceptance of your order. We reserve the right to refuse or cancel any order for any reason.",
      note: "If we cancel your order, we will refund any payment you have made for that order."
    },
    {
      icon: Ban,
      title: "Intellectual Property",
      content: "All content on this website, including text, graphics, logos, images, and software, is the property of LensLogic and is protected by copyright and trademark laws. You may not reproduce, distribute, or create derivative works from any content without our written permission."
    },
    {
      icon: Scale,
      title: "Limitation of Liability",
      content: "LensLogic shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service, even if we have been advised of the possibility of such damages."
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <section className="pt-8 pb-12 md:pt-12 md:pb-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: 'var(--accent-yellow)', color: 'var(--text-primary)' }}>
              <FileText className="w-4 h-4" />
              Legal Terms
            </div>
            <h1 className="text-optic-heading text-4xl md:text-5xl lg:text-6xl leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              Terms of <span style={{ color: 'var(--accent-yellow)' }}>Service</span>
            </h1>
            <p className="text-optic-body text-lg md:text-xl mb-4" style={{ color: 'var(--text-secondary)' }}>
              Please read these terms carefully before using our services.
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
                  {section.note && (
                    <p className="text-optic-body mt-4 p-4 rounded-lg leading-relaxed" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
                      {section.note}
                    </p>
                  )}
                  {section.list && (
                    <ul className="space-y-3 ml-2 mt-4">
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

      {/* Governing Law Section */}
      <section className="py-12 md:py-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-optic p-8 md:p-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-yellow)' }}>
                <Scale className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
              </div>
              <h2 className="text-optic-heading text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Governing Law
              </h2>
            </div>
            <p className="text-optic-body leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-16" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-optic p-8 md:p-10 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--accent-yellow)' }}>
              <Mail className="w-8 h-8" style={{ color: 'var(--text-primary)' }} />
            </div>
            <h2 className="text-optic-heading text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Questions About Terms?
            </h2>
            <p className="text-optic-body text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
              If you have any questions about these Terms of Service, please contact us at:
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

export default TermsOfService;
