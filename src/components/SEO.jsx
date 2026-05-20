import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, name, type, image }) => {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title} | The Spice Slice</title>
      <meta name="description" content={description} />

      {/* Open Graph tags (Facebook, LinkedIn, etc) */}
      <meta property="og:type" content={type || 'website'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="og:image"
        content={image || 'https://your-site.com/default-og-image.jpg'}
      />

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name || 'The Spice Slice'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Accessibility & Best Practices */}
      <html lang="en" />
    </Helmet>
  );
};

export default SEO;
