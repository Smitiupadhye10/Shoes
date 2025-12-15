import React from "react";
import { RefreshCw, CheckCircle2, XCircle, ArrowRight, Package, CreditCard, RotateCcw, Mail, Phone, MapPin, Clock } from "lucide-react";

const ReturnPolicy = () => {
  const sections = [
    {
      icon: Clock,
      title: "Return Window",
      content: "We offer a 30-day return policy from the date of delivery. Items must be returned in their original condition, unused, unwashed, and with all original tags and packaging intact.",
      note: "To initiate a return, please contact us within the 30-day window. Returns initiated after this period will not be accepted."
    },
    {
      icon: CheckCircle2,
      title: "Eligible Items for Return",
      content: "The following items are eligible for return:",
      list: [
        "Unused products in original condition",
        "Products with all original tags and labels attached",
        "Products in original packaging with all accessories included",
        "Products that are defective or damaged upon delivery",
        "Products that do not match the description on our website"
      ]
    },
    {
      icon: XCircle,
      title: "Non-Returnable Items",
      content: "The following items cannot be returned:",
      list: [
        "Products that have been used or worn",
        "Products without original tags or packaging",
        "Products that have been damaged due to misuse or negligence",
        "Personalized or customized products",
        "Products returned after the 30-day return window",
        "Contact lenses (for hygiene reasons, once opened)"
      ]
    },
    {
      icon: ArrowRight,
      title: "How to Initiate a Return",
      content: "To return an item, please follow these steps:",
      list: [
        "Log into your account and go to \"My Orders\"",
        "Select the order containing the item you wish to return",
        "Click on \"Return Item\" and provide a reason for the return",
        "Wait for return approval confirmation via email",
        "Package the item securely in its original packaging",
        "Ship the item to the return address provided in the confirmation email"
      ],
      note: "Alternatively, you can contact our customer support team directly at support@lenslogic.com or call +91 98765 43210."
    },
    {
      icon: Package,
      title: "Return Shipping",
      content: "Return shipping charges apply as follows:",
      list: [
        { text: "Defective or damaged products:", value: "Free return shipping (we cover the cost)" },
        { text: "Wrong product delivered:", value: "Free return shipping (we cover the cost)" },
        { text: "Change of mind:", value: "Return shipping charges will be deducted from your refund" }
      ],
      note: "We recommend using a trackable shipping method for returns to ensure the package reaches us safely."
    },
    {
      icon: CreditCard,
      title: "Refund Process",
      content: "Once we receive and inspect your returned item, we will process your refund:",
      list: [
        "Refunds are processed within 5-7 business days after we receive the returned item",
        "Refunds will be issued to the original payment method used for the purchase",
        "If you paid via cash on delivery, the refund will be processed via bank transfer (account details required)",
        "Only the product price will be refunded; shipping charges (for change of mind returns) are non-refundable"
      ]
    },
    {
      icon: RotateCcw,
      title: "Exchange Policy",
      content: "We currently do not offer direct exchanges. If you wish to exchange an item:",
      list: [
        "Return the item following our return process",
        "Once the return is processed and refunded, place a new order for the desired item"
      ],
      note: "This ensures you get the exact item you want and helps us maintain accurate inventory."
    },
    {
      icon: CheckCircle2,
      title: "Quality Check",
      content: "All returned items undergo a quality check upon receipt. If an item does not meet our return conditions (used, damaged, or missing original packaging/tags), we reserve the right to refuse the return or offer a partial refund. You will be notified via email if your return does not meet our conditions."
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <section className="pt-8 pb-12 md:pt-12 md:pb-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: 'var(--accent-yellow)', color: 'var(--text-primary)' }}>
              <RefreshCw className="w-4 h-4" />
              30-Day Returns
            </div>
            <h1 className="text-optic-heading text-4xl md:text-5xl lg:text-6xl leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              Return & <span style={{ color: 'var(--accent-yellow)' }}>Refund Policy</span>
            </h1>
            <p className="text-optic-body text-lg md:text-xl mb-4" style={{ color: 'var(--text-secondary)' }}>
              Hassle-free returns and refunds within 30 days. Your satisfaction is our priority.
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
                      {section.list.map((item, idx) => {
                        const text = typeof item === 'object' ? item.text : null;
                        const value = typeof item === 'object' ? item.value : item;
                        return (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--accent-yellow)' }}></div>
                            <span className="text-optic-body leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                              {text && <strong>{text}</strong>} {value}
                            </span>
                          </li>
                        );
                      })}
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
              Need Help with Returns?
            </h2>
            <p className="text-optic-body text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
              For any return-related queries or assistance, please contact us at:
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

export default ReturnPolicy;
