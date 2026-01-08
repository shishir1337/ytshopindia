import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(dirty: string): string {
  // For server-side rendering
  if (typeof window === "undefined") {
    const dom = new JSDOM("").window;
    const purify = DOMPurify(dom as any);
    return purify.sanitize(dirty, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "u",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "a",
        "img",
        "blockquote",
        "code",
        "pre",
        "hr",
        "div",
        "span",
      ],
      ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id"],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    });
  }

  // For client-side
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "blockquote",
      "code",
      "pre",
      "hr",
      "div",
      "span",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id"],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
}

