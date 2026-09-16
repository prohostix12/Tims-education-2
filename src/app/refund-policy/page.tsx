import type { Metadata } from "next";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy | TIMS Education",
  description: "Refund and Cancellation Policy for TIMS Education — Information regarding order cancellations, refunds, and replacements.",
};

export default function RefundPolicyPage() {
  return (
    <main>
      <PageHero title="Refund & Cancellation Policy" />
      <section
        style={{
          padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
          background: "#faf8f3",
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            width: "100%",
            background: "#ffffff",
            border: "3px solid #14161c",
            borderRadius: "18px",
            padding: "clamp(2rem, 4vw, 3.5rem)",
            boxShadow: "6px 6px 0 #14161c",
            lineHeight: 1.85,
            color: "#374151",
            fontSize: "0.95rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <span
              style={{
                display: "inline-block",
                padding: "0.35rem 0.85rem",
                borderRadius: "20px",
                background: "#fef3c7",
                color: "#d97706",
                border: "1.5px solid #f59e0b",
                fontSize: "0.8125rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Policy Details
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(1.35rem, 2.5vw, 1.85rem)",
              fontWeight: 800,
              color: "#14161c",
              marginBottom: "1.25rem",
              lineHeight: 1.3,
            }}
          >
            Refund and Cancellation Policy
          </h2>

          <p style={{ marginBottom: "1.5rem" }}>
            This refund and cancellation policy outlines how you can cancel or seek a refund for a product / service that you have purchased through the Platform. Under this policy:
          </p>

          <ul style={{ paddingLeft: "1.25rem", margin: "0 0 1.5rem", display: "flex", flexDirection: "column", gap: "1.15rem" }}>
            <li>
              Cancellations will only be considered if the request is made 10 days of placing the order. However, cancellation requests may not be entertained if the orders have been communicated to such sellers / merchant(s) listed on the Platform and they have initiated the process of shipping them, or the product is out for delivery. In such an event, you may choose to reject the product at the doorstep.
            </li>
            <li>
              TIMS Education does not accept cancellation requests for perishable items like flowers, eatables, etc. However, the refund / replacement can be made if the user establishes that the quality of the product delivered is not good.
            </li>
            <li>
              In case of receipt of damaged or defective items, please report to our customer service team. The request would be entertained once the seller/ merchant listed on the Platform, has checked and determined the same at its own end. This should be reported within 10 days of receipt of products. In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 10 days of receiving the product. The customer service team after looking into your complaint will take an appropriate decision.
            </li>
            <li>
              In case of complaints regarding the products that come with a warranty from the manufacturers, please refer the issue to them.
            </li>
            <li>
              In case of any refunds approved by TIMS Education, it will take 15 days for the refund to be processed to you.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
