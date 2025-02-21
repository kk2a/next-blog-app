import DOMPurify from "isomorphic-dompurify";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const processNode = (node: Node, key: number): JSX.Element | string | null => {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || "";
    const parts = text.split(/(\\\(|\\\)|\\\[|\\\])/g);
    const elements = [];
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === "\\(") {
        elements.push(
          <InlineMath key={`${key}-${i}`}>{parts[i + 1]}</InlineMath>
        );
        i++;
      } else if (parts[i] === "\\[") {
        elements.push(
          <BlockMath key={`${key}-${i}`}>{parts[i + 1]}</BlockMath>
        );
        i++;
      } else if (parts[i] !== "\\)" && parts[i] !== "\\]") {
        elements.push(parts[i]);
      }
    }
    return elements.length === 1 ? elements[0] : <>{elements}</>;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;
    const children = Array.from(element.childNodes).map((child, index) =>
      processNode(child, key * 1000 + index)
    );

    switch (element.tagName.toLowerCase()) {
      case "p":
        return <p key={key}>{children}</p>;
      case "strong":
      case "b":
        return <strong key={key}>{children}</strong>;
      case "em":
      case "i":
        return <em key={key}>{children}</em>;
      case "u":
        return <u key={key}>{children}</u>;
      case "br":
        return <br key={key} />;
      case "span":
        return <span key={key}>{children}</span>;
      case "ul":
        return <ul key={key}>{children}</ul>;
      case "li":
        return <li key={key}>{children}</li>;
      default:
        return <>{children}</>;
    }
  }

  return null;
};

export const renderContentWithMath = (content: string): JSX.Element[] => {
  const safeContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      "b",
      "strong",
      "i",
      "em",
      "u",
      "br",
      "span",
      "p",
      "ul",
      "li",
    ],
    ALLOWED_ATTR: ["class"],
  });

  const parser = new DOMParser();
  const doc = parser.parseFromString(safeContent, "text/html");
  // console.log(doc.body);
  const result = processNode(doc.body, 0);

  return result ? [result as JSX.Element] : [];
};
