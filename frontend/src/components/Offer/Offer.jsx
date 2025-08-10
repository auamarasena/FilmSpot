import React from "react";

function Offer() {
  const offer = [
    {
      id: 1,
      title: "BOGO Movie Tickets",
      subtitle: "BOC Credit Card Exclusive",
      description:
        "Buy one get one free on all movie tickets at Scope Cinemas theaters. Valid for BOC Credit Card holders (Master and Visa). Perfect for movie dates and family outings.",
      imageUrl:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      validUntil: "Valid until March 31, 2025",
      cardType: "BOC Credit Card",
      discount: "BOGO",
      category: "Credit Card Offer",
    },
    {
      id: 2,
      title: "DFCC Pinnacle Special",
      subtitle: "Exclusive Online Offer",
      description:
        "Buy one get one free on movie tickets exclusively for DFCC Pinnacle Credit Card holders. Available for online purchases only through our website.",
      imageUrl:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=300&fit=crop",
      validUntil: "Valid: Dec 20, 2024 - Jan 20, 2025",
      cardType: "DFCC Pinnacle",
      discount: "BOGO",
      category: "Premium Card Offer",
    },
    {
      id: 3,
      title: "HSBC Live+ Benefits",
      subtitle: "Selected Theaters Only",
      description:
        "Special buy one get one offer for HSBC Live+ card holders at selected Scope Cinemas locations. Valid for both online and counter purchases.",
      imageUrl:
        "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=300&fit=crop",
      validUntil: "Valid: Jan 10 - Feb 28, 2025",
      cardType: "HSBC Live+",
      discount: "BOGO",
      category: "Live+ Exclusive",
    },
    {
      id: 4,
      title: "Weekend Special",
      subtitle: "All Customers Welcome",
      description:
        "20% discount on all weekend shows. Perfect for weekend movie marathons with friends and family. No credit card required.",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1682089647302-f8c6f6c4a83f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      validUntil: "Every Weekend",
      cardType: "No Card Required",
      discount: "20% OFF",
      category: "Weekend Deal",
    },
  ];

  return (
    <div className='op-offer-container'>
      {/* Header Section */}
      <div className='op-offer-header'>
        <div className='op-offer-header-content'>
          <h1 className='op-offer-title'>Exclusive offer & Deals</h1>
          <p className='op-offer-subtitle'>
            Discover amazing savings and special promotions for your next movie
            experience
          </p>
        </div>
      </div>

      {/* offer Grid */}
      <div className='op-offer-content'>
        <div className='op-offer-grid'>
          {offer.map((offer) => (
            <div key={offer.id} className='op-offer-card'>
              <div className='op-offer-badge'>
                <span className='op-discount-badge'>{offer.discount}</span>
                <span className='op-category-badge'>{offer.category}</span>
              </div>

              <div className='op-offer-image-section'>
                <img
                  src={offer.imageUrl}
                  alt={offer.title}
                  className='op-offer-image'
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300/731010/ffffff?text=Cinema+Offer";
                  }}
                />
                <div className='op-image-overlay'>
                  <button className='op-view-details-btn'>View Details</button>
                </div>
              </div>

              <div className='op-offer-content'>
                <div className='op-offer-header-info'>
                  <h3 className='op-offer-title'>{offer.title}</h3>
                  <p className='op-offer-subtitle-text'>{offer.subtitle}</p>
                </div>

                <p className='op-offer-description'>{offer.description}</p>

                <div className='op-offer-details'>
                  <div className='op-offer-validity'>
                    <span className='op-validity-label'>
                      ⏰ {offer.validUntil}
                    </span>
                  </div>
                  <div className='op-offer-card-type'>
                    <span className='op-card-label'>💳 {offer.cardType}</span>
                  </div>
                </div>

                <div className='op-offer-actions'>
                  <button className='op-claim-offer-btn'>Claim Offer</button>
                  <button className='op-learn-more-btn'>Learn More</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className='op-offer-cta'>
        <div className='op-cta-content'>
          <h2>Don't Miss Out!</h2>
          <p>
            Sign up for our newsletter to get notified about the latest offer
            and exclusive deals.
          </p>
          <button className='op-newsletter-btn'>Subscribe to Newsletter</button>
        </div>
      </div>
    </div>
  );
}

export default Offer;
