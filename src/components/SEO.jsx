import { useEffect } from 'react';

const SEO = ({ 
  title = "Dagim Wubeante - Full Stack Developer | React, Node.js, Express.js Portfolio",
  description = "Professional Full Stack Developer specializing in React, Node.js, Express.js, MongoDB, PostgreSQL. View my portfolio of web applications, Chrome extensions, and machine learning projects.",
  image = "/profile.jpg",
  url = "https://dagimwubeante.vercel.app/"
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (property, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', image, true);
    updateMetaTag('twitter:url', url, true);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', url);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', url);
      document.head.appendChild(canonical);
    }
  }, [title, description, image, url]);

  return null;
};

export default SEO;
